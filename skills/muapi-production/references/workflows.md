# Media workflow selection

## Images and covers

Use Codex native image generation first for covers, thumbnails, title cards, backgrounds, and still artwork. Generate at the final aspect ratio whenever possible:

- YouTube landscape: 16:9, normally 1920×1080 delivery.
- Shorts/Reels: 9:16, normally 1080×1920 delivery.
- Square social artwork: 1:1.

Use MuAPI image generation only for an explicitly requested model, a MuAPI-only edit/effect, or a consistency requirement that justifies the charge. Check the live price first. Put title text inside the generation only when the model produces reliable typography; otherwise add it locally with a readable font, strong contrast, safe margins, and visual QA.

## Paid video generation

Before recommending a model, determine:

- Text-to-video or image-to-video.
- Duration, resolution, aspect ratio, audio requirement, motion complexity, and reference-image support.
- Whether speed, realism, prompt adherence, character consistency, or lowest cost is the priority.

Search the current MuAPI catalog and official documentation. Present one recommended model plus a cheaper fallback when useful. State price per call, output count, duration, and known tradeoffs. Do not infer that FLUX image models create video.

Preserve the raw video output. Perform compatible trimming, scaling, padding, captions, audio replacement, and muxing locally.

## Music and audio

For a paid Suno request:

1. Finalize the concept, lyrics or instrumental choice, structure, language, vocal direction, genre tags, and title before submission.
2. Treat the response as two variants from one shared paid request.
3. Save both audio files and all request/cost data.
4. Create separate cover art, video, and metadata for each variant.

Write lyrics locally unless live MuAPI/Suno capabilities provide a clearly better requested feature. Do not spend an extra generation merely to draft lyrics.

For transformations of an existing song, confirm ownership or permission. Do not imitate a living artist's voice or present a derivative as rights-cleared.

## Local assembly

Prefer FFmpeg for deterministic, no-MuAPI-cost processing:

- Static cover plus audio music video.
- Audio fades and loudness-safe conversion.
- Landscape and vertical masters.
- Trimming, padding, scaling, and format conversion.
- H.264/AAC MP4 delivery with fast start.

Never upscale a poor source and call it improved without checking the result visually. Retain the original cover and audio alongside the encoded master.

## Batch work

Create a manifest before any paid call. Include a stable release ID, prompt, model/settings, expected output count, target paths, planned cost, and status. Submit sequentially or with bounded concurrency, save after every state transition, and make reruns skip completed items.

Stop the batch on authentication, billing, corrupted-output, or ambiguous publishing failures. Do not blindly retry a paid call if it may already have succeeded.
