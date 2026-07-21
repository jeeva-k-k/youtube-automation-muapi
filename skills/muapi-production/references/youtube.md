# YouTube and Shorts

## Before upload

- Verify the active MuAPI YouTube integration and channel/account ID live.
- Confirm category, made-for-kids status, and whether the user wants the project default: private upload now and manual scheduling later.
- Obtain explicit approval for the number of uploads and total expected MuAPI publishing cost.
- Confirm every MP4 and its metadata are paired correctly.

## Metadata

Give each release a distinct:

- Title under YouTube's limit.
- Description with the song/video positioning and relevant hashtags.
- Tags suited to that specific release.

Do not include AI, generated, generative, model, Suno, MuAPI, or production-method wording unless the user explicitly asks. Do not make deceptive ownership, chart, official, celebrity, or affiliation claims.

For nursery rhymes or other content that may be directed to children, explicitly determine the intended audience before upload and set the made-for-kids flag accordingly. Do not infer `false` from the general project default.

## Shorts

Use a 1080×1920 vertical H.264/AAC MP4. Keep a safety margin below the platform duration boundary when classification matters; use no more than 179 seconds unless the current official rule has been checked and a longer duration is intentional. Create a purpose-built vertical cover when cropping damages composition or text.

## Default: private upload, manual scheduling

Use MuAPI's immediate YouTube publishing endpoint with `privacy: private`. Upload the complete approved batch while Codex is working, poll every request to completion, and preserve every returned YouTube URL. The user then chooses dates and times manually in YouTube Studio.

Prefer this workflow because it separates upload reliability from scheduling and avoids the intermittent OAuth client-ID failures observed in this project's MuAPI scheduled jobs.

Maintain an idempotent private-upload ledger with:

- Local file and hosted media URL.
- Connected account ID.
- Title, description, tags, category, made-for-kids flag, and requested private visibility.
- Every MuAPI request ID and retry attempt.
- Completed YouTube URL, actual charge, and status.

Before uploading replacements for a failed scheduled batch, reconcile remote published results and exclude successful videos. Cancel any still-pending public schedules to prevent duplicates. Reuse existing hosted MuAPI media URLs when available; do not upload the same local file again unnecessarily.

After the batch, require all approved private entries to have completed YouTube URLs, confirm the expected cost and balance, and query MuAPI to ensure zero unintended scheduled posts remain.

## Exception: MuAPI server-side scheduling

Do not use MuAPI server-side scheduling by default. Use it only when the user explicitly prefers it after being told that scheduled posts in this project have intermittently failed with `Could not determine client ID from request`.

When explicitly requested:

1. Verify the connected YouTube account live.
2. Submit one scheduled test post.
3. Wait until the test actually publishes; acceptance into the queue is not sufficient validation.
4. Only then request approval for a larger scheduled batch.
5. Store every social post ID and query published, scheduled, processing, failed, and cancelled states.

Stop and report immediately if any scheduled post fails. Do not assume the remaining queue will succeed and do not retry without reconciling actual YouTube uploads first.
