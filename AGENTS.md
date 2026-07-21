# MUAPI project instructions

For every image, audio, music, video, cover, thumbnail, rhyme/story video, character animation, image-to-video, lip-sync, workflow, batch, social-media, or publishing task in this workspace:

1. Read `skills/muapi-production/SKILL.md` completely before taking task actions.
2. Load only the skill references relevant to the request.
3. Inspect and resume existing manifests/state before creating new paid work.
4. Check live MuAPI pricing and balance before estimating costs. Do not assume remembered model prices are current.
5. Get explicit user approval for the exact paid estimate before generation or private upload, and separate explicit approval before public publishing or scheduling.
6. Use Codex native image generation when suitable to save MuAPI credits. Use local FFmpeg for assembly and conversion; these do not consume MuAPI credits.
7. Preserve source files and every result from paid requests. Never overwrite originals.
8. Never expose, print, commit, or place API keys in project artifacts.
9. For multi-stage productions, build a scene manifest first, price every paid stage separately, test one representative scene when useful, and resume by scene without regenerating successful work.

For every video-factory Remotion video task:

- Read and follow `video-factory/PRODUCTION_RULES.md` completely before designing scenes.
- These rules govern pacing, animation, tool selection, layout, captions, and the pre-render quality gate.
- Do not skip the low-resolution preview and 8-point quality checklist before the full render.

For every paid Suno music-generation request:

- Preserve both returned song variants.
- Produce two distinct native-generated cover images with readable title text.
- Produce one finished 1920×1080 music video for each song variant using its own cover.
- Produce separate 1080×1920 versions when Shorts/Reels are requested.
- Write a distinct YouTube title, description, hashtags, and tags for each video.
- Do not mention AI, generated content, generative tools, models, or production method in YouTube metadata unless the user explicitly requests it; the user handles any required disclosure manually.
- Store the releases in separate self-contained subfolders beneath the song/project folder.
- Record the actual MuAPI USD and credit charge once for the shared generation request; native image generation and local FFmpeg assembly do not add MuAPI cost.
- Validate every final MP4 with FFprobe and a full FFmpeg decode before delivery.

For YouTube publishing:

- Verify the currently connected channel/account before submission; do not rely on a previously observed account ID.
- Default to uploading completed videos through MuAPI's immediate YouTube endpoint with `privacy: private`; the user schedules them manually in YouTube Studio.
- Treat private uploads, visibility changes, scheduling, cancellation, and public publishing as paid/external side effects requiring explicit authorization.
- Maintain an idempotent upload ledger containing media path/URL, metadata, MuAPI request ID, YouTube URL, requested visibility, actual cost, and status.
- Before private replacements, reconcile live YouTube/MuAPI results and cancel conflicting pending public schedules so no duplicate can publish.
- Verify every private upload returned a completed YouTube URL and verify that no unintended MuAPI schedules remain active.
- Do not use MuAPI server-side scheduling unless the user explicitly requests it after being warned that this project's scheduler produced intermittent OAuth client-ID failures. Test one scheduled post through actual publication before creating a batch.
