# Production operations

## Folder layout

Use this pattern for a two-variant music release:

```text
outputs/<project-slug>/
├── generation.json
├── batch-state.json
├── 01-<variant-slug>/
│   ├── source-audio.*
│   ├── cover-landscape.png
│   ├── cover-vertical.png
│   ├── music-video.mp4
│   ├── vertical-video.mp4
│   ├── youtube-metadata.md
│   └── publishing.json
└── 02-<variant-slug>/
    └── ...
```

For image/video-only projects, keep the same principles: immutable sources, derivatives beside them, metadata, request/cost record, and one self-contained folder per deliverable.

## State and cost records

Record for every paid call:

- Timestamp, model, endpoint/tool, prompt, parameters, and request ID.
- Expected and actual output count.
- Output URLs and local paths.
- Planned price and actual USD/credit charge.
- Status and error details.

Use atomic state-file writes and stable item IDs. Do not store secrets. For a shared Suno request, record the charge once at the generation level instead of charging each variant in the ledger.

## Validation

For every final MP4:

1. Use FFprobe to verify container, duration, resolution, aspect ratio, frame rate, video codec, audio codec, and stream presence.
2. Run a complete FFmpeg decode to a null output and require a zero exit code.
3. Visually inspect at least the opening, representative middle, and ending frames.
4. Confirm audio duration, fade behavior, and absence of unexpected silence or clipping.
5. Confirm readable title text, correct artwork, and correct audio/metadata pairing.

For images, verify pixel dimensions, aspect ratio, file integrity, spelling, title legibility, safe margins, and lack of obvious generation defects.

## Handoff

Report:

- Clickable absolute paths for final deliverables and manifests.
- Which items were generated, reused, trimmed, or converted.
- Actual MuAPI cost and current balance.
- Validation results.
- YouTube URLs or schedule range and verified scheduled-post count.
- Any remaining user action or risk.
