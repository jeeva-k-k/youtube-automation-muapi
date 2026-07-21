# Video Production Standards

Mandatory quality rules for every video produced by the video factory pipeline.

## Pacing and Timing

- **No Long Opening Title Scene**: Remove the long opening title scene completely.
- **Immediate Action**: The scientific action must start within the first **0.5 seconds**.
- **Brief Overlaid Title**: The title must appear briefly *over the ongoing action* for no more than **1.5 seconds**.
- **Visual Beats**: Break every scene into visual beats of approximately **0.8–2 seconds**.
- **No Static Visuals**: Ensure no explanatory visual remains materially unchanged for more than **1.25 seconds**.
- **Animated Conclusion**: Replace the final 5-to-6-second static summary card with a **maximum 3-second animated conclusion** that reuses the main scientific process and displays **no more than two short key points**.

## Action-Driven Animation

- The main process—not merely a small particle—must create significant visible change throughout each scene.
- Every narration action must visibly happen on screen:
  - Ions must cross the cell membrane
  - Vesicles must merge and release neurotransmitter particles
  - Vibration amplitude must visibly increase
  - Cracks must propagate
  - Glass must actually shatter
  - Flowing must move, bending must deform, separating must split, freezing must visibly change state
- Visuals must demonstrate the physical mechanism rather than merely label static components.

## Tool Selection & Specialist Engines

- Dynamically choose and route to the most suitable rendering tool for each scene. Avoid repeating the same title → centered diagram → second diagram → summary layout.
- The tool router must **genuinely select** specialist engines when plain SVG cannot clearly demonstrate the process:
  - **Canvas or WebGL** for particles, smoke, gas, and fluid effects
  - **React Three Fiber or Three.js** for spatial, molecular, planetary, and 3D scenes
  - **Motion Canvas or Manim** for complex vector, mathematical, or diagrammatic step-by-step animations
  - **Remotion + SVG** only for text overlays, charts, and simple geometric shapes

## Layout, Sizing & Composition

- **Maximize Visual Area**: The main scientific visual must occupy approximately **40–70% of the usable vertical frame**.
- **No Tiny Center Subjects**: Do not place tiny atoms, molecules, or mechanisms in the center of a mostly empty background.
- **No Empty Border Panels**: Avoid placing a small diagram inside a large, empty bordered panel.
- **Mobile Readability**: All summary and scientific labels must be large and readable on a phone screen.

## Captions

- Use **phrase-level kinetic captions** of **2–7 words** per phrase.
- Follow **word-level timestamps** to highlight key caption words as they are spoken.
- Highlight only **key terms** (scientific terms, values, verbs) using color highlights.

## Scientific Completeness

Include all essential components rather than relying on generic symbols:
- **Photosynthesis**: Must distinguish Photosystem II, the oxygen-evolving complex, electrons, protons, oxygen, and ATP synthase.
- **Laser**: Must show pumping, the gain medium, population inversion, stimulated emission, cavity mirrors, and the partially transmitting output mirror.

## Pre-Render Quality Gate & Rejection Criteria

Before the final full-resolution render, complete this checklist.

> [!CAUTION]
> **REJECT** any scene that fails any of these criteria:
> 1. Primary subject occupies **less than 35%** of the frame.
> 2. The overall frame remains materially unchanged for **more than 1.25 seconds**.
> 3. The summary/conclusion remains static for **more than 3 seconds**.

Checklist:
1. **Title Validation**: Validate that the title accurately represents the entire video content.
2. **Demonstration Check**: Confirm that the visual actually demonstrates rather than merely labels the mechanism.
3. **Action Verification**: Ensure the final action promised by the narration is clearly shown before rendering.
4. **Low-res preview**: Generate a low-resolution preview first.
5. **Narration match**: Verify visuals accurately match the narration content.
6. **Scientific accuracy**: Confirm scientific claims and uncertainty are represented correctly.
7. **Layout repetition**: Detect and fix repetitive layouts.
8. **Empty space**: Flag excessive dead space or small diagrams inside large borders.
9. **Small labels**: Ensure all text/labels are readable at target resolution.
10. **Weak motion**: Identify scenes with insufficient animation (<1.25s static).
11. **Caption obstruction**: Verify captions don't block key visual elements.

Only after passing all checks: proceed with full-resolution Remotion render → FFmpeg mastering → private publishing.
