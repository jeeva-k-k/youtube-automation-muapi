# Adaptive Code-Driven Video Factory

## 1. Purpose

This document defines the target architecture, workflow, interfaces, validation rules, and implementation requirements for an adaptive video-generation system.

The system must not be tied to one fixed video template or one provider. It must select the most suitable tool for each scene while keeping one stable end-to-end architecture.

The central rule is:

> Use the best available tool to create each visual asset or specialist scene, but use Remotion as the default composition, synchronization, and final code-based video-rendering engine.

MuAPI is the initial default provider for text-to-speech, image generation, and YouTube publishing. However, all external providers must be accessed through replaceable adapters so they can be changed without rewriting the video pipeline.

---

## 2. Primary Design Principles

1. **Architecture-stable, provider-flexible**
   - The overall workflow remains constant.
   - TTS, image, video, storage, alignment, and publishing providers may change.

2. **Remotion is the central compositor**
   - Remotion controls the timeline, layouts, transitions, captions, audio, branding, and final render.
   - Remotion should be used whenever the final video is constructed through code.

3. **No single fixed template**
   - Use a library of reusable scene components, visual systems, transitions, and specialist renderers.
   - The scene planner chooses and configures components for each project.

4. **Best engine per scene**
   - Remotion + React + SVG for most scenes.
   - React Three Fiber or Three.js for genuine 3D scenes.
   - Motion Canvas for advanced vector explainers when it materially improves the result.
   - Manim for complex mathematical animation.
   - AI image/video providers for generated media.
   - Stock or real footage when authenticity is more important than generation.

5. **Deterministic and resumable**
   - Every job must have a manifest, stable IDs, cached assets, stage status, and retry support.
   - A failed stage must not force the entire project to restart.

6. **Validation before publishing**
   - Technical, visual, audio, caption, semantic, and publishing checks are mandatory.
   - Upload privately first. Public publishing requires explicit approval or a configured auto-approval rule.

7. **Human-review friendly**
   - Every output must be traceable to its script, source assets, provider requests, scene configuration, and render settings.

---

## 3. System Responsibilities

### 3.1 MuAPI default responsibilities

MuAPI is the initial default provider for:

- text-to-speech generation;
- AI image generation;
- optional AI video generation when supported and suitable;
- final media upload;
- private YouTube publishing.

MuAPI must be wrapped behind provider interfaces. Do not call MuAPI directly from scene components or business logic.

### 3.2 Remotion responsibilities

Remotion is responsible for:

- the master video timeline;
- scene sequencing;
- frame-accurate timing;
- narration synchronization;
- captions and word highlighting;
- text, images, clips, diagrams, charts, overlays, and branding;
- transitions and camera-style movement;
- audio, music, and sound-effect placement;
- horizontal, vertical, square, and custom aspect ratios;
- final code-based rendering to MP4 or an intermediate master file.

### 3.3 Specialist visual engines

Use specialist engines only when they offer a clear advantage.

| Requirement | Preferred engine |
|---|---|
| Titles, layouts, captions, cards, standard motion graphics | Remotion + React |
| Simple and medium-complexity diagrams | Remotion + SVG |
| Particle systems and dense procedural 2D effects | Canvas inside Remotion |
| 3D science, products, space, molecules, machines | React Three Fiber / Three.js inside Remotion |
| Advanced vector explainers | Motion Canvas exported as a scene asset |
| Advanced equations, proofs, geometry, calculus | Manim exported as a scene asset |
| Static generated illustration | Configured image provider, initially MuAPI |
| Photorealistic generated motion | Configured AI video provider |
| Real places, events, products, or demonstrations | Licensed stock or verified real footage |
| Final video composition | Remotion |
| Final mastering and media inspection | FFmpeg and ffprobe |
| Publishing | Configured publishing provider, initially MuAPI |

### 3.4 FFmpeg responsibilities

FFmpeg must be used for media processing, not speech understanding.

FFmpeg responsibilities include:

- audio normalization;
- audio resampling and channel conversion;
- silence inspection and optional trimming;
- video transcode or final mastering;
- adding fast-start metadata;
- generating proxies or thumbnails where useful;
- format conversion;
- technical inspection with ffprobe.

FFmpeg must not be described as a word-alignment engine.

### 3.5 Alignment responsibilities

Word-level timestamps must come from one of the following:

- the TTS provider, if reliable word timestamps are returned;
- a forced-alignment provider;
- a speech-to-text engine with word timestamps;
- a local alignment engine such as WhisperX or another configured adapter.

The alignment provider must also be replaceable.

---

## 4. End-to-End Workflow

```text
Video request
  -> Project configuration
  -> Research and source collection
  -> Script generation
  -> Script validation and approval
  -> Narration generation
  -> Audio normalization
  -> Word-level alignment
  -> Scene planning
  -> Per-scene engine selection
  -> Asset and specialist-scene generation
  -> Asset validation
  -> Remotion composition
  -> Preview render
  -> Automated visual and semantic checks
  -> Final Remotion render
  -> FFmpeg mastering
  -> Final validation
  -> Private upload
  -> Human or policy-based approval
  -> Public or scheduled publishing
  -> Ledger, analytics, and cost update
```

---

## 5. Stage Definitions

## Stage 0: Intake and project creation

### Inputs

- topic or creative brief;
- target platform;
- desired duration;
- aspect ratio;
- target audience;
- language;
- visual style;
- brand profile;
- publishing destination;
- optional source material;
- optional required tools or providers.

### Actions

1. Generate a unique `project_id` and `job_id`.
2. Create the project workspace.
3. Validate required configuration.
4. Resolve defaults.
5. Write the initial project manifest.

### Output

- `project.json`
- `manifest.json`
- project directory

---

## Stage 1: Research and source collection

This stage is mandatory for factual, scientific, educational, historical, medical, financial, legal, or current-events content.

### Actions

1. Collect authoritative sources.
2. Store source URLs, titles, dates, and relevant notes.
3. Mark claims that require citation or verification.
4. Create a source-to-claim map.
5. Reject unsupported claims or flag them for human review.

### Output

- `sources.json`
- `claims.json`

### Minimum source record

```json
{
  "source_id": "src-001",
  "title": "Example source",
  "url": "https://example.com",
  "publisher": "Example Publisher",
  "published_at": "2026-01-01",
  "accessed_at": "2026-07-20",
  "supports_claim_ids": ["claim-001"]
}
```

---

## Stage 2: Script generation and validation

### Actions

1. Generate the script from the project brief and validated sources.
2. Split the script into narration blocks.
3. Validate factual claims, calculations, terminology, names, dates, units, and pronunciation.
4. Add pronunciation hints where needed.
5. Estimate narration duration.
6. Revise until the duration is within the configured tolerance.
7. Obtain human or policy-based approval.

### Output

- `script.json`
- `script.txt`
- `claims-validation.json`

### Script block schema

```json
{
  "block_id": "block-001",
  "text": "Massive objects curve spacetime around them.",
  "purpose": "explanation",
  "claim_ids": ["claim-001"],
  "pronunciation_hints": [],
  "visual_intent": "Show a star deforming a spacetime grid"
}
```

---

## Stage 3: Narration generation

### Default provider

- MuAPI TTS adapter

### Requirements

1. Store the exact provider name, endpoint, model ID, voice ID, request ID, and provider response.
2. Pin or record model versions whenever possible.
3. Support per-project and per-block voices.
4. Support pronunciation instructions when the provider allows them.
5. Cache outputs using a content hash of script text, voice, model, speed, and provider settings.
6. Retry transient failures with exponential backoff.
7. Fail over to another configured TTS provider only when policy permits.

### Output

- `audio/narration-raw.wav` or provider-supported lossless format
- `providers/tts-request.json`
- `providers/tts-response.json`

---

## Stage 4: Audio normalization

### Default target

- integrated loudness: `-16 LUFS` for narration-led web video;
- true peak: no higher than `-1.5 dBTP`;
- sample rate: `48000 Hz`;
- channels: explicit mono or stereo based on project configuration.

### Actions

1. Measure the raw narration.
2. Apply two-pass loudness normalization when practical.
3. Do not automatically apply aggressive noise reduction to clean synthetic speech.
4. Detect clipping, long silence, missing audio, or unexpected duration.

### Output

- `audio/narration-master.wav`
- `audio/audio-analysis.json`

---

## Stage 5: Word-level alignment and caption preparation

### Actions

1. Use provider timestamps when trustworthy.
2. Otherwise run the configured alignment adapter.
3. Produce word-level start and end timestamps with confidence values.
4. Validate that alignment duration is close to audio duration.
5. Segment words into caption groups using punctuation, reading speed, and line-length limits.
6. Generate SRT and WebVTT.

### Output

- `alignment/words.json`
- `alignment/captions.json`
- `alignment/captions.srt`
- `alignment/captions.vtt`

### Word record

```json
{
  "word": "gravity",
  "start": 2.14,
  "end": 2.62,
  "confidence": 0.98
}
```

### Caption rules

- Keep captions within platform-safe areas.
- Avoid orphaned one-word lines.
- Avoid more than two lines unless explicitly configured.
- Highlight spoken keywords only when the style profile enables it.
- Do not cover important visual content.

---

## Stage 6: AI scene planning

The scene planner converts the approved script and word alignment into a structured scene manifest.

### Planner responsibilities

- divide narration into scenes;
- define the visual purpose of each scene;
- choose the preferred scene engine;
- specify required assets;
- define timing, transitions, camera movement, and emphasis cues;
- map visual events to words or narration timestamps;
- avoid repetitive scene patterns;
- enforce brand and accessibility constraints;
- choose a fallback engine.

### Scene schema

```json
{
  "scene_id": "scene-004",
  "type": "three-dimensional-explainer",
  "start_seconds": 14.2,
  "duration_seconds": 7.4,
  "narration_block_ids": ["block-004"],
  "visual_intent": "Show a star deforming a spacetime grid",
  "preferred_engine": "react-three-fiber",
  "fallback_engine": "remotion-svg",
  "component": "SpacetimeGridScene",
  "assets": [],
  "transition_in": "camera-push",
  "transition_out": "light-wipe",
  "visual_events": [
    {
      "event": "grid_deforms",
      "at_word": "curve"
    }
  ]
}
```

### Scene-engine routing rules

Use the following default priority:

1. Remotion-native React and SVG.
2. Canvas inside Remotion for dense procedural 2D animation.
3. React Three Fiber or Three.js inside Remotion for genuine 3D.
4. Pre-rendered Motion Canvas scene.
5. Pre-rendered Manim scene.
6. Generated image or generated video.
7. Stock or real footage.

The planner must not select a specialist engine only for novelty. It must select it because the scene cannot be produced as well, as reliably, or as efficiently with the preceding option.

---

## Stage 7: Asset and specialist-scene generation

### Asset types

- generated images;
- generated video clips;
- stock footage;
- icons;
- SVG illustrations;
- charts and data visualizations;
- Three.js assets;
- Motion Canvas renders;
- Manim renders;
- music;
- sound effects;
- logos and brand assets.

### Requirements

1. Every asset must have a unique ID and provenance record.
2. Store the prompt, provider, model, seed when available, request ID, cost, and license information.
3. Validate dimensions, duration, alpha channel, frame rate, and file integrity.
4. Generate proxies for heavy media when needed for preview.
5. Cache generated assets using a content hash.
6. Do not regenerate unchanged assets.
7. Do not use unverified or unlicensed media.

### Asset record

```json
{
  "asset_id": "asset-018",
  "type": "image",
  "path": "assets/images/asset-018.png",
  "provider": "muapi",
  "model": "provider-model-id",
  "prompt_hash": "sha256-value",
  "width": 2048,
  "height": 2048,
  "license": "provider-commercial-use",
  "cost_usd": 0.04
}
```

---

## Stage 8: Remotion composition

Remotion is the master assembly layer.

### Required technologies

- TypeScript;
- React;
- Remotion;
- SVG for most 2D diagrams;
- CSS for typography and layout;
- Canvas only when suitable;
- React Three Fiber or Three.js for embedded 3D;
- KaTeX or another configured equation renderer;
- FFmpeg and ffprobe for post-processing and inspection.

### Remotion responsibilities

1. Load the project manifest, scene manifest, alignments, and assets.
2. Resolve project format, dimensions, duration, and frame rate.
3. Instantiate the correct scene component for each scene.
4. Synchronize visual events with word timestamps.
5. Place narration, music, and sound effects.
6. Apply captions and safe-area rules.
7. Apply brand tokens and visual style.
8. Apply transitions and virtual camera movement.
9. Produce deterministic frames.
10. Render a preview and a final master.

### Frame-rate policy

- Default: `30 fps`.
- Use `60 fps` only for high-motion scenes or when explicitly requested.
- Do not render every project at 60 fps by default.

### Resolution policy

Supported presets:

- YouTube landscape: `1920x1080`;
- vertical short: `1080x1920`;
- square: `1080x1080`;
- custom: configured dimensions after validation.

### Rendering policy

- Use Remotion's renderer rather than Playwright screenshot loops.
- Do not save every frame as PNG unless a specific debug or specialist workflow requires it.
- Use a job-specific temporary directory.
- Clean temporary files on success and failure.
- Support local rendering first.
- Keep cloud rendering behind a separate adapter.

---

## Stage 9: Motion-design system

The system must use a component library rather than a single template.

### Core scene components

At minimum, implement:

- `HookScene`
- `TitleScene`
- `DefinitionScene`
- `QuestionScene`
- `ImageFocusScene`
- `ImageSequenceScene`
- `CinematicClipScene`
- `ComparisonScene`
- `TimelineScene`
- `ProcessFlowScene`
- `CauseEffectScene`
- `MapScene`
- `StatisticScene`
- `CounterScene`
- `BarChartScene`
- `LineChartScene`
- `DiagramScene`
- `EquationScene`
- `ThreeDScene`
- `SummaryScene`
- `EndCardScene`

### Shared components

At minimum, implement:

- `AnimatedTitle`
- `KeywordCaption`
- `SafeArea`
- `ScientificLabel`
- `Callout`
- `Arrow`
- `ConnectorLine`
- `ProgressIndicator`
- `AnimatedNumber`
- `SourceFootnote`
- `LogoLockup`
- `BackgroundSystem`
- `ParticleLayer`
- `Camera2D`
- `AudioTrack`
- `SoundEffectCue`

### Motion hierarchy

Every scene should distinguish:

- primary motion: the main concept or object;
- secondary motion: labels, arrows, supporting diagrams;
- ambient motion: subtle particles, lighting, depth, or background movement.

Do not animate all elements at once.

### Easing presets

Create reusable motion presets:

- `smoothEnter`
- `smoothExit`
- `softOvershoot`
- `scientificDraw`
- `slowCameraPush`
- `cameraPullBack`
- `labelPop`
- `numberCount`
- `lightWipe`
- `depthParallax`

### Visual layers

Use a consistent layer model:

1. background;
2. ambient background effects;
3. midground;
4. primary visual;
5. annotations;
6. captions;
7. foreground effects;
8. review/debug overlays, disabled in final render.

---

## Stage 10: Preview rendering and review

### Preview requirements

- render at reduced resolution or quality;
- include optional debug overlays;
- show scene IDs and safe areas when debug mode is enabled;
- generate a contact sheet or scene thumbnails;
- produce a review manifest listing unresolved warnings.

### Human-review checks

- factual correctness;
- equations and measurements;
- pronunciation;
- narration-to-visual match;
- scene pacing;
- repetitive layouts;
- visual quality;
- readability;
- brand compliance;
- copyright and attribution;
- title, description, and thumbnail.

### Output

- `renders/preview.mp4`
- `renders/contact-sheet.jpg`
- `review/review-report.json`

---

## Stage 11: Final Remotion render

### Requirements

1. Render only after required checks pass.
2. Record Remotion version, Node version, dependency lock hash, render settings, and composition ID.
3. Use deterministic asset paths and stable seeds where possible.
4. Fail if required assets are missing.
5. Retry only retryable render failures.
6. Resume from cached upstream stages.

### Output

- `renders/master-remotion.mp4`
- `renders/render-metadata.json`

---

## Stage 12: FFmpeg mastering

### Recommended output characteristics

- video codec: H.264 using `libx264` unless another delivery codec is configured;
- pixel format: `yuv420p` for broad compatibility;
- profile: explicit High profile where compatible;
- quality: project-configured CRF, default around visually high quality;
- audio codec: AAC;
- audio bitrate: project-configured;
- `+faststart` enabled for MP4 delivery;
- duration calculated deliberately, not hidden by `-shortest`.

### Duration rule

Define final duration explicitly:

```text
final_duration = narration_duration + configured_end_hold
```

If streams differ, pad or trim according to explicit project rules. Do not depend on `-shortest` as the primary synchronization method.

### Output

- `renders/final.mp4`
- `renders/final.ffprobe.json`

---

## Stage 13: Automated validation

Validation must run after preview and after final mastering.

### Technical validation

- file exists and is readable;
- file decodes without errors;
- correct container and codecs;
- exact target dimensions;
- expected frame rate;
- expected duration within tolerance;
- audio stream exists;
- no clipping;
- loudness within tolerance;
- file size within provider limit;
- no unexpected variable-frame-rate behavior unless allowed.

### Visual validation

- no blank or black frames beyond allowed transitions;
- no frozen sequences beyond allowed holds;
- no missing images or broken video frames;
- no text overflow;
- no layout collisions;
- no captions outside safe areas;
- no important content under platform controls;
- no unintended transparent or checkerboard backgrounds;
- no repeated placeholder assets;
- no debug overlays in final output.

### Caption validation

- captions exist when required;
- caption timings are monotonic;
- caption duration is readable;
- text matches narration within configured tolerance;
- no excessively long line;
- no one-frame captions;
- SRT and VTT parse successfully.

### Semantic validation

- every scene maps to narration or an intentional silent interval;
- visual content does not contradict the narration;
- factual visual labels match the approved script;
- units and equations are consistent;
- sources are available for factual claims;
- generated people, places, products, or events are not presented as real without disclosure.

### Accessibility validation

- adequate text contrast;
- readable font sizes;
- no unsafe rapid flashing;
- captions available;
- important information is not conveyed only by color;
- audio is intelligible over music.

### Publishing validation

- title present;
- description present;
- thumbnail present when required;
- category and language configured;
- privacy defaults to private;
- made-for-kids setting explicitly resolved;
- synthetic-media disclosure resolved where applicable;
- upload file is below provider limits or routed to a suitable upload path.

### Output

- `validation/final-report.json`
- `validation/final-report.md`

---

## Stage 14: Private upload and publishing

### Default provider

- MuAPI publishing adapter

### Rules

1. Upload the final validated file.
2. Default privacy must be `private`.
3. Store provider request and response IDs.
4. Poll status using bounded retries and exponential backoff.
5. Use a maximum polling duration.
6. Distinguish retryable, permanent, and manual-review failures.
7. Do not publish duplicate content when the same idempotency key already succeeded.
8. Verify final YouTube processing status.
9. Store the resulting video ID and URL in the ledger.

### Publication states

```text
READY_TO_UPLOAD
UPLOADING
UPLOAD_FAILED_RETRYABLE
UPLOAD_FAILED_PERMANENT
YOUTUBE_PROCESSING
PUBLISHED_PRIVATE
AWAITING_APPROVAL
SCHEDULED
PUBLISHED_PUBLIC
PROCESSING_FAILED
MANUAL_REVIEW
```

### Approval rule

- Default: human approval after private upload.
- Optional: policy-based auto-approval only when all required checks pass and the project explicitly allows it.

---

## 6. Provider Adapter Interfaces

All external services must implement stable internal interfaces.

### TTS provider

```ts
interface TtsProvider {
  generate(request: TtsRequest): Promise<TtsResult>;
}
```

### Alignment provider

```ts
interface AlignmentProvider {
  align(request: AlignmentRequest): Promise<AlignmentResult>;
}
```

### Image provider

```ts
interface ImageProvider {
  generate(request: ImageRequest): Promise<ImageResult>;
}
```

### Video provider

```ts
interface VideoProvider {
  generate(request: VideoRequest): Promise<VideoResult>;
}
```

### Storage provider

```ts
interface StorageProvider {
  upload(request: StorageUploadRequest): Promise<StorageUploadResult>;
}
```

### Publishing provider

```ts
interface PublishingProvider {
  publish(request: PublishRequest): Promise<PublishResult>;
  getStatus(request: PublishStatusRequest): Promise<PublishStatusResult>;
}
```

### Provider-selection policy

Provider choice may depend on:

- required capability;
- language or voice quality;
- visual style;
- cost limit;
- latency;
- provider availability;
- content restrictions;
- output resolution;
- file-size limit;
- commercial-use license;
- configured fallback order.

Provider selection must be recorded in the manifest.

---

## 7. Project Configuration

### Example `project.json`

```json
{
  "project_id": "black-holes-001",
  "topic": "How black holes bend light",
  "audience": "general",
  "language": "en",
  "target_duration_seconds": 180,
  "format": {
    "preset": "youtube-landscape",
    "width": 1920,
    "height": 1080,
    "fps": 30
  },
  "style_profile": "cinematic-science",
  "brand_profile": "default-science-brand",
  "caption_profile": "keyword-highlight",
  "audio_profile": "narration-web",
  "providers": {
    "tts": "muapi",
    "image": "muapi",
    "video": "auto",
    "alignment": "auto",
    "publishing": "muapi"
  },
  "publishing": {
    "platform": "youtube",
    "privacy": "private",
    "category_id": "28",
    "language": "en",
    "requires_human_approval": true
  },
  "limits": {
    "max_cost_usd": 5.0,
    "max_render_attempts": 2,
    "max_provider_attempts": 3
  }
}
```

---

## 8. Manifest and Job State

Use a database for the authoritative job ledger. SQLite is acceptable for the first local implementation. Do not use one global JSON file as the only ledger.

### Required job fields

- `job_id`
- `project_id`
- `content_hash`
- `status`
- `current_stage`
- `created_at`
- `updated_at`
- `attempt_count`
- `error_code`
- `error_message`
- `provider_request_ids`
- `render_id`
- `publishing_video_id`
- `cost_usd`
- `manifest_path`

### Recommended stage states

```text
CREATED
RESEARCH_COMPLETE
SCRIPT_COMPLETE
SCRIPT_APPROVED
TTS_COMPLETE
AUDIO_MASTERED
ALIGNMENT_COMPLETE
SCENE_PLAN_COMPLETE
ASSETS_COMPLETE
PREVIEW_RENDERED
PREVIEW_APPROVED
FINAL_RENDERED
MASTERED
VALIDATED
UPLOADED_PRIVATE
APPROVED_FOR_PUBLICATION
PUBLISHED
FAILED_RETRYABLE
FAILED_PERMANENT
CANCELLED
```

### Idempotency

Generate an idempotency key from:

- approved script hash;
- narration settings;
- scene manifest hash;
- asset manifest hash;
- render configuration;
- output format.

Do not duplicate generation, rendering, or publishing when a successful result already exists for the same idempotency key.

---

## 9. Recommended Repository Structure

```text
video-factory/
  apps/
    cli/
    studio/
    worker/
  packages/
    core/
      config/
      manifests/
      jobs/
      errors/
      logging/
    providers/
      muapi/
      tts/
      image/
      video/
      alignment/
      storage/
      publishing/
    planner/
      script/
      scenes/
      routing/
    remotion/
      compositions/
      scenes/
      components/
      captions/
      transitions/
      design-systems/
      three/
    specialist-engines/
      motion-canvas/
      manim/
    media/
      ffmpeg/
      ffprobe/
      audio/
      thumbnails/
    validation/
      technical/
      visual/
      captions/
      semantic/
      accessibility/
      publishing/
    persistence/
      database/
      cache/
      ledger/
  projects/
    project-id/
      project.json
      sources.json
      claims.json
      script.json
      scenes.json
      manifest.json
      audio/
      alignment/
      assets/
      renders/
      validation/
      providers/
      review/
  temp/
    job-id/
  outputs/
  tests/
    unit/
    integration/
    visual-regression/
    fixtures/
  package.json
  lockfile
  README.md
  workflow.md
```

---

## 10. Brand and Style Profiles

Video variety must come from scene choice and style profiles, not uncontrolled per-video CSS.

### Style profile should define

- color palette;
- typography;
- spacing scale;
- border radius;
- shadow and glow rules;
- background treatment;
- transition family;
- caption treatment;
- chart style;
- icon style;
- camera-motion intensity;
- particle density;
- grain and texture intensity;
- default music and sound-design profile.

### Example

```json
{
  "style_profile": "cinematic-science",
  "colors": {
    "background": "#07111F",
    "surface": "#102238",
    "primary": "#55D6FF",
    "secondary": "#FFB45C",
    "text": "#F7FBFF",
    "muted": "#9CB2C8"
  },
  "motion": {
    "camera_intensity": 0.4,
    "ambient_motion": 0.25,
    "transition_family": "cinematic-soft"
  },
  "captions": {
    "max_lines": 2,
    "highlight_keywords": true
  }
}
```

---

## 11. Caching and Temporary Files

### Cache keys

Use SHA-256 hashes for:

- TTS inputs;
- alignment inputs;
- image prompts and provider settings;
- specialist-scene inputs;
- scene manifests;
- Remotion render configuration;
- final mastering configuration.

### Temporary directory

Use:

```text
temp/{job_id}/
```

Never use one shared frame directory.

### Cleanup

- remove temporary files after success;
- remove or quarantine temporary files after failure;
- retain debug artifacts only when debug mode is enabled;
- check available disk space before heavy rendering.

---

## 12. Error Handling and Retry Policy

### Retryable examples

- provider timeout;
- rate limit;
- temporary network failure;
- interrupted upload;
- transient browser or render worker failure;
- provider processing delay.

### Permanent examples

- invalid credentials;
- unsupported content;
- invalid configuration;
- missing required asset;
- licensing failure;
- provider rejects media size and no alternate route is available;
- repeated deterministic render failure.

### Retry rules

- use exponential backoff with jitter;
- use bounded attempts;
- record every attempt;
- do not retry invalid requests unchanged;
- do not restart successful upstream stages;
- route unresolved failures to `MANUAL_REVIEW`.

---

## 13. Security Requirements

- Store API keys only in environment variables or a secrets manager.
- Never commit provider secrets.
- Do not hard-code account IDs, channel IDs, or credentials in source code.
- Validate and sanitize all external URLs and filenames.
- Restrict file access to project and temp directories.
- Verify content type and file signatures after downloads.
- Use least-privilege credentials for publishing.
- Redact secrets and personal information from logs.
- Record provider terms and commercial-use rights for generated assets.

### Environment variables

```text
MUAPI_API_KEY
MUAPI_ACCOUNT_ID
YOUTUBE_DEFAULT_CATEGORY_ID
YOUTUBE_DEFAULT_PRIVACY
TTS_PROVIDER
IMAGE_PROVIDER
VIDEO_PROVIDER
ALIGNMENT_PROVIDER
PUBLISHING_PROVIDER
DATABASE_URL
CACHE_DIR
TEMP_DIR
OUTPUT_DIR
```

---

## 14. Observability and Cost Tracking

Track the following for every stage:

- start time;
- end time;
- duration;
- provider;
- model;
- request ID;
- input size;
- output size;
- retry count;
- estimated and actual cost;
- warnings;
- failure reason.

### Cost report must include

- TTS cost;
- alignment cost;
- image-generation cost;
- AI-video cost;
- stock-asset cost;
- render compute cost;
- storage cost;
- upload/publishing cost;
- total project cost;
- cost per finished minute.

Do not assume any generation or publishing stage is free unless it is confirmed by the provider and recorded in configuration.

---

## 15. Testing Strategy

### Unit tests

- configuration validation;
- provider adapters;
- scene routing;
- timestamp conversion;
- caption segmentation;
- duration calculation;
- cache-key generation;
- idempotency;
- cost calculation.

### Integration tests

- TTS -> normalization -> alignment;
- scene plan -> assets -> Remotion preview;
- Remotion render -> FFmpeg master -> validation;
- private upload -> status polling -> ledger update.

### Visual regression tests

Maintain golden frames for:

- each core scene component;
- each aspect ratio;
- long and short text;
- captions;
- charts;
- transitions;
- safe areas;
- 3D fallback behavior.

### End-to-end fixtures

At minimum, include:

1. a 30-second vertical science short;
2. a 3-minute landscape explainer;
3. a mathematics video using Manim;
4. a 3D scene using React Three Fiber;
5. a video using generated images;
6. a project that switches from MuAPI to a fallback provider;
7. a project that resumes after a failed render;
8. a project that stops before publishing due to validation failure.

---

## 16. Implementation Phases for the Coding Agent

## Phase 1: Core project and provider abstraction

Implement:

- TypeScript monorepo or clean package structure;
- project config schema;
- manifest schema;
- SQLite job ledger;
- structured logging;
- MuAPI TTS, image, and publishing adapters;
- FFmpeg and ffprobe wrappers;
- basic retry and error model.

### Phase 1 acceptance criteria

- project can be created from JSON;
- TTS can be generated through the provider adapter;
- audio can be normalized and inspected;
- job state and costs are stored;
- no provider-specific code leaks into scene components.

## Phase 2: Remotion foundation

Implement:

- Remotion project;
- composition registry;
- project-data loader;
- safe-area system;
- caption renderer;
- audio track system;
- design tokens;
- core transitions;
- preview and final render commands.

### Phase 2 acceptance criteria

- a configured project renders without Playwright screenshot loops;
- narration and captions are synchronized;
- landscape and vertical versions render from the same content model;
- final output passes basic ffprobe checks.

## Phase 3: Scene component library

Implement the minimum scene and shared-component library listed in this document.

### Phase 3 acceptance criteria

- planner can select at least ten different scene types;
- videos do not depend on one fixed layout;
- scene components accept structured props;
- visual regression tests cover every component.

## Phase 4: Scene planner and routing

Implement:

- script-to-scene segmentation;
- scene schema validation;
- engine-selection rules;
- fallback engine selection;
- asset requirement extraction;
- event-to-word timestamp mapping.

### Phase 4 acceptance criteria

- a script produces a valid `scenes.json`;
- every scene has a valid component or specialist engine;
- every specialist scene has a fallback;
- planner rejects unsupported or incomplete scenes.

## Phase 5: Specialist engines

Implement:

- React Three Fiber scene support inside Remotion;
- optional Motion Canvas render adapter;
- optional Manim render adapter;
- AI video provider adapter;
- stock or local footage ingestion.

### Phase 5 acceptance criteria

- specialist outputs can be cached and imported into Remotion;
- failures fall back to the configured engine;
- specialist media is validated before composition.

## Phase 6: Full QA and publishing

Implement:

- technical validation;
- visual validation;
- caption validation;
- semantic checks;
- accessibility checks;
- private upload;
- bounded processing-status polling;
- approval state;
- publication ledger.

### Phase 6 acceptance criteria

- invalid videos cannot be published;
- valid videos upload privately;
- duplicate publishing is prevented;
- final status and video ID are stored;
- a failed publishing job can resume without re-rendering.

---

## 17. Required Commands

The exact command names may vary, but the system must expose equivalents of:

```bash
video-factory project:create --config projects/example/project.json
video-factory research --project example
video-factory script:generate --project example
video-factory script:validate --project example
video-factory audio:generate --project example
video-factory audio:align --project example
video-factory scenes:plan --project example
video-factory assets:generate --project example
video-factory render:preview --project example
video-factory validate:preview --project example
video-factory render:final --project example
video-factory validate:final --project example
video-factory publish:private --project example
video-factory publish:approve --project example
video-factory publish:status --project example
video-factory job:resume --job job-id
video-factory job:inspect --job job-id
```

---

## 18. Non-Negotiable Rules

1. Do not use Playwright frame-by-frame screenshots as the main rendering method.
2. Do not force all videos into one fixed template.
3. Do not call external providers directly from Remotion scene components.
4. Do not claim FFmpeg generates word-level timestamps.
5. Do not use `-shortest` as the main duration-control strategy.
6. Do not hard-code provider account IDs or publishing settings.
7. Do not store the authoritative job ledger in one global JSON file.
8. Do not upload publicly before validation and approval rules are satisfied.
9. Do not regenerate assets that are unchanged and already cached.
10. Do not select specialist engines when Remotion-native components can produce equal or better results more reliably.
11. Do not publish generated or stock media without provenance and usage-right records.
12. Do not silently ignore validation warnings that affect factual accuracy, accessibility, copyright, or publishing safety.

---

## 19. Definition of Done

A project is complete only when:

- the approved script and source records are stored;
- narration is generated and normalized;
- word alignment and captions are valid;
- every scene has an approved engine and valid assets;
- the Remotion preview has passed review requirements;
- the final Remotion render and FFmpeg master have completed;
- all required validations pass;
- the final video is uploaded privately;
- human or configured policy approval is recorded;
- the publication state is stored;
- costs, provider IDs, hashes, and output paths are in the ledger;
- the project can be reproduced from its manifest and locked dependencies.

---

## 20. Final Architecture Summary

```text
External generation and services
  - MuAPI TTS by default
  - MuAPI image generation by default
  - replaceable AI video, alignment, storage, and publishing providers

Specialist visual generation
  - Remotion + React + SVG by default
  - Canvas for dense procedural 2D
  - React Three Fiber / Three.js for 3D
  - Motion Canvas for selected vector explainers
  - Manim for selected mathematical scenes
  - stock or real footage when authenticity is required

Central video engine
  - Remotion for timeline, composition, synchronization, captions,
    transitions, branding, audio placement, and final code-based render

Final media processing
  - FFmpeg and ffprobe for mastering and technical inspection

Publishing
  - private upload first through the configured publishing adapter
  - approval before public or scheduled release
```

The implementation must remain modular. MuAPI is the current default service provider, but Remotion is the stable central video engine whenever the video is assembled using code.
