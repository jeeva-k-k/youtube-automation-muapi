---
name: youtube-automation-muapi
description: Master end-to-end automated media creation, editing, rendering, pre-render quality verification, Remotion React best practices, MuAPI credit optimization, Codex native image generation, local FFmpeg assembly, YouTube OAuth setup & verification, topic de-duplication with local database tracking, and automated YouTube native scheduling for both Explainer Shorts and Suno Music Videos.
---

# YouTube Automation Engine (Master Skill)

A single unified production engine for creating, validating, uploading, and scheduling **Science Explainer Shorts (9:16)** and **Suno Music Videos (16:9 & 9:16)** with zero generic placeholders, strict topic de-duplication, credit-optimized asset generation, official **Remotion Best Practices**, and native YouTube scheduling.

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
   - Check if `MUAPI_API_KEY` (or bearer token) is present. Prompt user if missing.
2. **YouTube OAuth Setup & Validation**:
   - Check if `.youtube-credentials.json` exists. Run `node scratch/test-youtube-credentials.mjs` to confirm channel access.
3. **Credit & Cost Optimization Protocol**:
   - **Codex Native Image Generation**: Use native image generation for thumbnails, covers, visual stills, and background layers whenever possible to save MuAPI credits.
   - **Local FFmpeg Assembly**: Perform all trimming, resizing, composition, audio LUFS mastering (-16 LUFS), and MP4 container encoding locally via FFmpeg ($0.00 extra cost).

---

## 3. Step 3: Remotion Best Practices & Flexible Video Composition

When rendering React video compositions using **Remotion**, follow the official [remotion-best-practices](file:///Users/jeeva/Documents/MUAPI/skills/remotion-best-practices/SKILL.md) guidelines:

> [!IMPORTANT]
> **No Rigid Layout Constraints**: Do NOT force a single fixed video layout or rigid scene template across all videos. Remotion gives full React freedom. Dynamically adapt visual design, typography, color palettes, and component layouts to best fit the topic.

### Key Remotion Core Principles:
- **Frame-Driven State**: Never use React `useState` for timeline animation. Use `useCurrentFrame()` and `useVideoConfig()`.
- **Smooth Physics Animations**: Use `spring({ frame, fps, config })` for natural spring-driven entry/exit motion instead of linear transitions.
- **Interpolation Curves**: Use `interpolate(frame, [start, end], [valStart, valEnd], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })` for progress-based scaling, opacity, and positioning.
- **Sequencing**: Structure scenes cleanly using Remotion's `<Series>` or `<Sequence>` components without manual offset calculations.
- **Captions & Audio**: Synchronize audio using `<Audio src={staticFile(...)} />` and render kinetic phrase/word highlighted captions.

---

## 4. Step 4: Topic De-Duplication & Database Registration

Before creating any script or rendering any video:
1. Query `video-factory/database/db.mjs` using `isTopicDuplicate(workingTitle, keywords)`.
2. Record valid topic codes (`V001`, `V002`...), working titles, and release metadata into `video-factory/database/tracker.json`.

---

## 5. Step 5: Pre-Render Quality Gate & Bitstream Audit

1. Run the **8-Point Quality Gate**:
   - [ ] Resolution: 1080×1920 (Shorts) / 1920×1080 (Landscape).
   - [ ] Action Start: <0.5s.
   - [ ] Title Duration: <1.5s overlay.
   - [ ] Audio Mastering: -16 LUFS (EBU R128).
   - [ ] Caption Legibility: High-contrast mobile subtitles.
   - [ ] Zero Generic Icons / Placeholders.
2. Validate MP4 container bitstream with `ffprobe` and full FFmpeg decode audit.

---

## 6. Step 6: MuAPI Private Upload & Native YouTube API Scheduling

1. **Private Upload ($0.01 per video)**: Upload video to YouTube via MuAPI with `privacy: "private"`.
2. **Native YouTube API Scheduling (50 Units / video)**: Call Google YouTube Data API v3 (`PUT https://www.googleapis.com/youtube/v3/videos?part=status`) with `publishAt = ISO_TIMESTAMP`.
