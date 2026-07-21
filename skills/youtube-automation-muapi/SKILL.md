---
name: youtube-automation-muapi
description: Master end-to-end automated media creation, editing, rendering, pre-render quality verification, MuAPI credit optimization, Codex native image generation, local FFmpeg assembly, YouTube OAuth setup & verification, topic de-duplication with local database tracking, and automated YouTube native scheduling for both Explainer Shorts and Suno Music Videos.
---

# YouTube Automation Engine (Master Skill)

A single unified production engine for creating, validating, uploading, and scheduling **Science Explainer Shorts (9:16)** and **Suno Music Videos (16:9 & 9:16)** with zero generic placeholders, strict topic de-duplication, credit-optimized asset generation, and native YouTube scheduling.

---

## 1. Step 1: Prompt User for Content Idea & Format

When this master skill is invoked, **always start by asking the user for their topic idea set or content plan**:

```
1. What kind of content would you like to create?
   [A] Science & Explainer Shorts (9:16 Vertical Video Factory)
   [B] Suno Music Video & Visualizer (16:9 Landscape & 9:16 Shorts)

2. How would you like to provide the topics/ideas?
   [Option 1] Provide a concept / niche idea (e.g., "Physics paradoxes", "Deep sea creatures", "Lo-Fi Beats") -> AI will generate non-duplicate topics.
   [Option 2] Upload or provide a custom CSV / JSON content plan file.
```

---

## 2. Step 2: Environment & Credentials Check

1. **MUAPI Key Verification**:
   - Check if `MUAPI_API_KEY` (or bearer token) is present.
   - If missing, prompt the user for their MuAPI Key before taking any API actions.
2. **YouTube OAuth Setup & Validation**:
   - Check if `.youtube-credentials.json` exists.
   - If missing, guide the user to set up:
     * `client_id`
     * `client_secret`
     * `refresh_token`
   - Run verification script `node scratch/test-youtube-credentials.mjs` to confirm channel access and print the connected channel name.
3. **Credit & Cost Optimization Protocol**:
   - **Codex Native Image Generation**: Use Codex native image generation for thumbnails, covers, visual stills, and background layers whenever possible to save MuAPI credits.
   - **Local FFmpeg Assembly**: Perform all trimming, resizing, composition, audio LUFS mastering (-16 LUFS), and MP4 container encoding locally via FFmpeg. These steps consume **0 MuAPI credits**.
   - **MuAPI Usage**: Use MuAPI only for immediate private video uploads ($0.01 per video) or specific paid generative tasks requested by the user.

---

## 3. Step 3: Topic De-Duplication & Database Registration

Before creating any script or rendering any video:
1. Query `video-factory/database/db.mjs` using `isTopicDuplicate(workingTitle, keywords)`.
2. If fuzzy normalized title matches or $\ge 3$ concept keywords overlap, reject the candidate topic and generate a unique alternative.
3. Record every valid topic code (`V001`, `V002`...), category, working title, and release metadata into `video-factory/database/tracker.json`.

---

## 4. Step 4: Production Pipelines by Content Type

### Workflow A: Science Explainer Shorts (9:16 Vertical)
Follow `video-factory/PRODUCTION_RULES.md`:
- **Action-First Hook**: Action starts within **<0.5s**. Title overlay lasts **<1.5s**.
- **Visual Scale**: Primary subject fills **40%–70% of vertical frame**.
- **Pacing**: Visual beats every **0.8s–2.0s**. No visual stays static **>1.25s**.
- **Engine Routing**: `React Three Fiber` (3D/orbital/molecules), `Remotion SVG` (diagrams/counters), `Canvas Shaders` (fluids/waves).
- **Conclusion**: 3-second animated conclusion with **max 2 key points**.
- **Kinetic Captions**: 2–7 word phrase-level captions with word-level timestamp highlighting.

### Workflow B: Suno Music Videos (16:9 Landscape & 9:16 Shorts)
- **Dual Variant Preservation**: Trigger Suno music generation via MuAPI and **preserve BOTH returned song variants** (`variant_v1.mp3` and `variant_v2.mp3`).
- **Cover Artwork**: Generate two distinct cover images (one per variant) with bold, readable title text using **Codex Native Image Generation** (or best MuAPI image model if requested).
- **Video Rendering**:
  * 16:9 Landscape (1920×1080) video with spectrum/waveform overlays.
  * 9:16 Vertical (1080×1920) Shorts/Reels video with centered artwork and kinetic lyrics.
- **Metadata Rules**: Write distinct non-AI titles, descriptions, hashtags, and tags for each variant. Do NOT mention AI in metadata.
- **Folder Structure**: Organize into self-contained subfolders (`projects/[song]/variant_1/`, `variant_2/`).

---

## 5. Step 5: Pre-Render Quality Gate & Local Compilation

1. Run the **8-Point Quality Gate**:
   - [ ] Resolution: 1080×1920 (Shorts) / 1920×1080 (Landscape).
   - [ ] Subject Frame Fill: 40%–70%.
   - [ ] Action Start: <0.5s.
   - [ ] Title Duration: <1.5s overlay.
   - [ ] Beat Frequency: <1.25s static duration.
   - [ ] Audio Mastering: -16 LUFS.
   - [ ] Caption Legibility: Readable on mobile.
   - [ ] Zero Generic Icons / Placeholders.
2. **Local Compilation**:
   - Render MP4 locally via `npm run build`.
   - Validate bitstream with `ffprobe` and `ffmpeg` full decode check.

---

## 6. Step 6: MuAPI Private Upload & Native YouTube API Scheduling

1. **Private Upload ($0.01 per video)**:
   - Upload file to MuAPI storage (`POST /api/v1/upload_file`).
   - Submit request to YouTube endpoint (`POST /api/v1/youtube-publish`) with `privacy: "private"`.
   - Record response, YouTube Video ID, and cost in project `publishing.json` and master ledgers.
2. **Native YouTube API Scheduling (50 Units / video)**:
   - Call Google's YouTube Data API v3 (`PUT https://www.googleapis.com/youtube/v3/videos?part=status`).
   - Set `status.privacyStatus = "private"` and `status.publishAt = ISO_TIMESTAMP`.
   - YouTube native servers manage public release automatically with 100% reliability.
