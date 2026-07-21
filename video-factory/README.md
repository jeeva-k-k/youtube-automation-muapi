# Visual Science Video Factory

Deterministic 1080×1920 video rendering with HTML/CSS Grid, inline SVG, GSAP,
Playwright, SciPy/NumPy preprocessing, FFmpeg assembly, Prefect orchestration,
and automated layout/media validation.

Each video is defined by a project manifest. Paid generation remains outside the
renderer and must be explicitly approved. Local preprocessing, rendering, and
validation do not consume MuAPI credits.

The renderer uses a continuous full-bleed canvas and four immutable logical rows:

- header: 0–15%
- visual: 15–60%
- captions: 60–78%
- transparent platform exclusion: 78–100%

The full-page gradient and texture continue through the exclusion row; only
critical content is prohibited there. Critical DOM elements are checked before capture and cause an immediate failure
if they enter an exclusion zone or the right-side control gutter.
