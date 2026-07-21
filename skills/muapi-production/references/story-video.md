# Rhyme, story, and character videos

Use this pipeline for nursery rhymes, songs with animated characters, educational stories, dialogue scenes, image sequences, image-to-video animation, and lip-sync productions.

## 1. Define the production

Confirm or infer:

- Audience and age range.
- Language, rhyme/story, lyrics, voice, music, and total duration.
- Landscape, vertical, or both.
- Visual style, recurring characters, locations, and brand constraints.
- Animation level: still-image motion, image-to-video, lip-sync, or a hybrid.
- Number and approximate duration of scenes.
- Delivery platform and whether the content is directed to children.

Do not start paid generation until the story, timing, scene count, paid-stage estimate, and output count are clear.

## 2. Build a timed storyboard

Create a scene manifest before generation. Give each scene a stable ID and record:

- Start/end time and matching lyric/dialogue line.
- Characters, action, emotion, location, camera framing, and transition.
- Image prompt and reference assets.
- Animation prompt and intended motion.
- Whether the scene needs mouth movement or lip-sync.
- Planned model, price, request ID, outputs, selected take, local paths, and status.

Match visual changes to musical phrases instead of cutting arbitrarily. Add a safe opening hook and a clear ending rather than truncating the last musical phrase.

## 3. Lock character consistency

Create a character bible before scene images: front/three-quarter appearance, proportions, clothing, colors, facial traits, props, and prohibited changes. Generate and approve a master character/reference sheet first.

Use reference-aware image generation or editing for subsequent scenes when available. Keep the same character description and reference images across prompts. Do not accept unexplained changes in clothing, age, species, colors, or anatomy.

Generate scene images at the final aspect ratio. Compose landscape and vertical versions separately when important subjects or text cannot survive reframing.

## 4. Choose animation per shot

Use the cheapest technique that meets the shot:

- Local pan, zoom, parallax, or camera motion for backgrounds, establishing shots, and lyric cards.
- Image-to-video for meaningful body movement, action, environmental motion, or cinematic camera work.
- Lip-sync only for visible speaking/singing close-ups where mouth accuracy matters.
- Reusable loops for repeating choruses, dances, or background motion when repetition is visually acceptable.

Do not pay for lip-sync on wide shots, off-screen voices, animals/objects without visible mouths, or scenes where cuts can hide mouth movement. Avoid image-to-video for every still by default; use a hybrid pipeline to control cost and visual instability.

Search current MuAPI capabilities and prices for every paid stage. Verify the selected animation/lip-sync model accepts the source type, duration, aspect ratio, audio format, and reference inputs. Never assume a model name or old price is still valid.

## 5. Run a representative shot test

For a large or expensive batch, propose one representative scene test and its exact cost before the full run. Choose a shot that exercises the hardest requirement, such as the main character singing in close-up.

After approval, validate character identity, mouth movement, motion quality, framing, duration, and audio sync. Refine the reusable prompt/settings before scaling. Do not silently turn a test into a full batch.

## 6. Generate and preserve stages

Keep immutable assets for each scene:

```text
scenes/scene-001/
├── storyboard.json
├── source-image.png
├── source-audio.wav
├── image-to-video-raw.mp4
├── lipsync-raw.mp4
└── scene-final.mp4
```

Save after every upload, request, poll, selection, and validation. A rerun must skip completed stages and must not issue a paid retry when the previous request may have succeeded.

## 7. Assemble locally

Use FFmpeg for no-MuAPI-cost assembly:

- Conform scene resolution, frame rate, codecs, and audio sample rate.
- Trim scenes to the timeline and use restrained transitions.
- Mix vocals, music, and effects without clipping or masking lyrics.
- Add timed lyrics/captions when requested, using safe margins and readable contrast.
- Produce independent landscape and vertical masters rather than blindly cropping important content.

Keep audio continuity across visual cuts. When lip-sync is generated in short clips, align clips to the exact vocal segment and verify that no word is lost at boundaries.

## 8. Validate the complete video

In addition to normal MP4 validation, inspect:

- Character consistency across every scene.
- Mouth movement against the intended lyric/dialogue.
- No frozen, warped, duplicated, or abruptly cut frames.
- Correct scene order and lyric timing.
- Smooth audio across joins and complete beginning/end phrases.
- Captions spelling, timing, safe area, and readability.
- Child-directed content settings and metadata when applicable.

Report actual cost by stage: music/voice, images, image-to-video, lip-sync, publishing, and free local assembly. Preserve rejected paid takes instead of deleting them.
