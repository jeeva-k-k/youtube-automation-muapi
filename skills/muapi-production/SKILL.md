---
name: muapi-production
description: Plan, generate, edit, animate, lip-sync, assemble, validate, organize, cost-track, and publish media with the MUAPI project. Use for any MUAPI image, video, music, audio, cover, thumbnail, rhyme or story video, character animation, image-to-video, lip-sync, social clip, YouTube video, Shorts batch, multi-model workflow, credit estimate, account check, or server-side publishing/scheduling task in this workspace.
---

# MUAPI Production

Create production-ready media while minimizing MuAPI spend and preserving every paid result.

## Start every task

1. Read `/Users/jeeva/Documents/MUAPI/AGENTS.md`.
2. Inspect relevant existing manifests, state files, output folders, and scripts. Resume safe completed work instead of regenerating it.
3. Restate the requested deliverables, count, aspect ratios, durations, platforms, and publishing intent.
4. Query live MuAPI model availability, pricing, balance, and connected account when relevant. Never rely on remembered prices or account IDs.
5. Present the estimated paid calls, credits, USD total, expected outputs, and free local work. Obtain explicit approval before paid generation, private uploads, or public/scheduled publishing.

Read only the references needed for the task:

- Image, video, audio, and assembly choices: [workflows.md](references/workflows.md)
- Rhyme, story, character, image-to-video, and lip-sync productions: [story-video.md](references/story-video.md)
- YouTube, Shorts, metadata, and scheduling: [youtube.md](references/youtube.md)
- Folder structure, state, cost records, validation, and recovery: [operations.md](references/operations.md)

## Choose the least-cost valid route

- Use Codex native image generation for covers, thumbnails, backgrounds, and stills when it satisfies the brief. It does not consume MuAPI credits.
- Use MuAPI image models only when the user asks for one, a MuAPI-only capability is needed, or consistency with a paid workflow materially benefits the result.
- Use local FFmpeg for trimming, resizing, fades, muxing, static-image music videos, format conversion, and final encoding. These steps add no MuAPI charge.
- Compare current MuAPI models and prices for paid video/audio work. Recommend the cheapest model that meets the quality, duration, aspect-ratio, and commercial-use requirements; explain meaningful compromises.
- Avoid speculative test generations. Improve the prompt, references, dimensions, and settings before submitting a paid call.

## Execute reliably

1. Create a project folder and an idempotent manifest/state file before a batch.
2. Record prompt, model, parameters, request ID, outputs, actual credits, and actual USD charge for each paid request.
3. Poll asynchronous jobs to completion. Preserve every returned output before downstream processing.
4. Build derivatives locally when possible. Never overwrite source media.
5. Write distinct metadata for distinct releases.
6. Validate every deliverable before reporting completion.
7. Report exact output paths, paid cost, remaining balance, validation result, and publishing/schedule status.

## Production defaults

- Treat a Suno request as one paid request returning two song variants. Preserve and finish both variants.
- Give each variant its own native-generated cover with readable title text, finished video, metadata, and self-contained subfolder.
- Produce 1920×1080 landscape masters unless the user requests another format.
- For Shorts/Reels, produce a separate 1080×1920 master. Prefer a purpose-built vertical composition; crop an existing cover only when it remains visually strong.
- Keep YouTube metadata free of references to AI, generated content, models, tools, or production method unless the user explicitly requests such wording.
- Do not mark content as made for kids unless the user states that it is.
- Default YouTube delivery to MuAPI immediate uploads with `privacy: private`. Preserve each YouTube URL and let the user schedule manually in YouTube Studio.
- Treat MuAPI server-side scheduling as opt-in only. This project has observed intermittent OAuth client-ID failures in scheduled jobs; require an explicit request and a successful one-post schedule test before batching.
- Never publish publicly, schedule, cancel, or change visibility without explicit user authorization.

## Safety and ownership

- Never print, commit, or copy API keys into prompts, manifests, logs, metadata, or deliverables. Use the configured MUAPI MCP/secure local configuration.
- Confirm the user owns or has permission to transform copyrighted source music, images, voices, likenesses, logos, or footage when that is not clear.
- Do not claim copyright clearance, platform acceptance, monetization eligibility, or guaranteed performance.
- Keep connected social integrations and sufficient MuAPI balance active until server-side schedules finish.

## Completion gate

Do not call a task complete until all requested outputs exist, all paid outputs are preserved, costs are recorded, final files pass validation, metadata is present, every requested private upload has a completed YouTube URL, and no unintended server-side schedule remains active.
