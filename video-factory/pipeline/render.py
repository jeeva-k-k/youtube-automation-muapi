#!/usr/bin/env python3
"""Deterministic Playwright/GSAP scene renderer with resumable segment cache."""
import argparse
import asyncio
import hashlib
import json
import math
import subprocess
from pathlib import Path

from playwright.async_api import async_playwright

FACTORY = Path(__file__).resolve().parents[1]
FRONTEND = FACTORY / 'frontend'


def resolve(base: Path, value: str) -> Path:
    return (base / value).resolve()


def digest(paths, extra=''):
    h = hashlib.sha256(extra.encode())
    for path in paths:
        h.update(path.name.encode())
        h.update(path.read_bytes())
    return h.hexdigest()


def run_command(command):
    subprocess.run(command, check=True)


def payload(project_path, processed_path):
    project = json.loads(project_path.read_text())
    processed = json.loads(processed_path.read_text())
    asset_urls = {k: resolve(project_path.parent, v).as_uri() for k, v in project['assets'].items()}
    return project, {'project': project, 'processed': processed, 'assetUrls': asset_urls}


async def open_page(browser, data):
    fmt = data['project']['format']
    context = await browser.new_context(
        viewport={'width': fmt['width'], 'height': fmt['height']},
        device_scale_factor=1,
        locale='en-US',
        reduced_motion='reduce',
    )
    async def route_handler(route):
        if route.request.url.startswith(('http://', 'https://')):
            await route.abort('blockedbyclient')
        else:
            await route.continue_()
    await context.route('**/*', route_handler)
    page = await context.new_page()
    await page.goto((FRONTEND / 'index.html').as_uri(), wait_until='load')
    await page.wait_for_function('window.factoryReady === true')
    await page.evaluate('(data) => window.initVideo(data)', data)
    return context, page


async def seek_and_check(page, t):
    await page.evaluate('(time) => window.renderAt(time)', t)
    errors = await page.evaluate('window.validateFrame()')
    if errors:
        raise RuntimeError(f'layout validation failed at {t:.3f}s: ' + '; '.join(errors))


async def preview(project_path, processed_path, output_dir):
    project, data = payload(project_path, processed_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    samples = []
    for scene in project['scenes']:
        samples.append(scene['start'] + min(1.1, (scene['end'] - scene['start']) * .55))
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--disable-dev-shm-usage'])
        context, page = await open_page(browser, data)
        for i, t in enumerate(samples, 1):
            await seek_and_check(page, t)
            await page.screenshot(path=str(output_dir / f'preview-{i:02d}-{t:.2f}.png'), type='png')
        await context.close(); await browser.close()
    print(output_dir)


async def render(project_path, processed_path, force=False):
    project, data = payload(project_path, processed_path)
    fmt = project['format']; fps = int(fmt['fps']); duration = float(fmt['duration']); crf = int(fmt.get('crf', 18))
    cache = FACTORY / 'cache' / project['project_id']
    segments_dir = cache / 'segments'; segments_dir.mkdir(parents=True, exist_ok=True)
    state_path = cache / 'render-state.json'
    frontend_files = [FRONTEND / 'index.html', FRONTEND / 'styles.css', FRONTEND / 'render.js', FACTORY / 'node_modules/gsap/dist/gsap.min.js']
    build_hash = digest([project_path, processed_path, *frontend_files])
    state = json.loads(state_path.read_text()) if state_path.exists() else {'segments': {}}
    if state.get('build_hash') != build_hash:
        state = {'build_hash': build_hash, 'segments': {}}

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--disable-dev-shm-usage'])
        context, page = await open_page(browser, data)
        for index, scene in enumerate(project['scenes']):
            segment_path = segments_dir / f"{index+1:02d}-{scene['id']}.mp4"
            scene_hash = hashlib.sha256(f"{build_hash}:{scene['id']}:{scene['start']}:{scene['end']}".encode()).hexdigest()
            cached = state['segments'].get(scene['id'], {})
            if not force and segment_path.exists() and cached.get('hash') == scene_hash and cached.get('status') == 'completed':
                print(f"cached {scene['id']}", flush=True)
                continue
            start_frame = round(float(scene['start']) * fps)
            end_frame = math.ceil(duration * fps) if index == len(project['scenes']) - 1 else round(float(scene['end']) * fps)
            command = [
                'ffmpeg','-y','-v','error','-f','image2pipe','-vcodec','png','-framerate',str(fps),'-i','-',
                '-c:v','libx264','-preset','fast','-crf',str(crf),'-pix_fmt','yuv420p','-movflags','+faststart',str(segment_path)
            ]
            proc = subprocess.Popen(command, stdin=subprocess.PIPE)
            try:
                for frame in range(start_frame, end_frame):
                    t = frame / fps
                    await seek_and_check(page, t)
                    png = await page.screenshot(type='png', animations='disabled')
                    proc.stdin.write(png)
                    if (frame - start_frame) and (frame - start_frame) % 120 == 0:
                        print(f"{scene['id']} {frame-start_frame}/{end_frame-start_frame}", flush=True)
            finally:
                if proc.stdin:
                    proc.stdin.close()
            if proc.wait() != 0:
                raise RuntimeError(f'FFmpeg failed for {scene["id"]}')
            state['segments'][scene['id']] = {'hash': scene_hash, 'status': 'completed', 'path': str(segment_path), 'frames': end_frame-start_frame}
            state_path.write_text(json.dumps(state, indent=2) + '\n')
        await context.close(); await browser.close()

    concat_file = cache / 'segments.txt'
    concat_file.write_text(''.join(f"file '{(segments_dir / f'{i+1:02d}-{s['id']}.mp4').as_posix()}'\n" for i, s in enumerate(project['scenes'])))
    visuals = cache / 'visuals.mp4'
    run_command(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(concat_file),'-c','copy',str(visuals)])
    output = resolve(project_path.parent, project['output']); output.parent.mkdir(parents=True, exist_ok=True)
    audio_master = resolve(project_path.parent, project['approved_audio_master'])
    run_command(['ffmpeg','-y','-v','error','-i',str(visuals),'-i',str(audio_master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-shortest','-movflags','+faststart',str(output)])
    print(output)
    return output


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project', type=Path)
    ap.add_argument('processed', type=Path)
    ap.add_argument('--preview-dir', type=Path)
    ap.add_argument('--preview-only', action='store_true')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()
    project = args.project.resolve(); processed = args.processed.resolve()
    if args.preview_dir:
        await preview(project, processed, args.preview_dir.resolve())
    if not args.preview_only:
        await render(project, processed, args.force)


if __name__ == '__main__':
    asyncio.run(main())
