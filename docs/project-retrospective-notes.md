# Project Retrospective Notes

## 2026-07-27 Approved Headrust Hat Replacement

- The approved storefront image for the `Richardson Headrust Logo Snapback Hat`
  is `attached_assets/richardson-headrust-logo-snapback-v2.png`, copied
  byte-for-byte from the user-provided mockup.
- The separate `Richardson HR Logo Snapback Hat` remains unchanged. The previous
  Headrust wordmark hat asset is preserved for rollback.
- The `Richardson Headrust Logo Snapback Hat` has a foam-backed Headrust logo
  with raised white stitching; keep that construction detail in its storefront
  description.
- Local browser verification confirmed the new image at its full `1254 x 1254`
  dimensions in both the merchandise card and product-detail modal.
- The vinyl card now uses the same square, dark product-image treatment as the
  hats, with equal-height card content and bottom-aligned price/actions.
- Every merchandise card now opens its product details from the full card
  surface and supports Enter/Space activation with a visible keyboard focus
  state.
- Shirt mockups use the larger square card-image treatment so their front/back
  artwork stays legible. Hats and vinyl use that same edge-to-edge square image
  treatment so no black side blocks or inset frame appear, and merchandise card
  titles use a lighter-weight sans-serif style.
- Merchandise cards have no persistent decorative outline. A restrained hover
  ring and the stronger keyboard focus ring preserve interaction feedback
  without adding unnecessary borders or divider lines.

## 2026-07-27 DMS Discography Artwork

- The `EYES ON EMPIRE` discography card links to the Spotify release
  `2FMr8W5OPuDSjy7P4kX6UC`, whose official release title is `DMS - Single`.
  Use `attached_assets/headrust-dms-spotify-cover.jpg`, copied from that
  release's official Spotify artwork, so the card image matches its destination.

## 2026-07-27 Merchandise Quantity Backspace Fix

- React Hook Form's `valueAsNumber` converted a cleared quantity input to
  `NaN`. The size and color effects then attempted to create arrays with an
  invalid length, which could crash the order modal when Backspace removed the
  last digit.
- All six merchandise quantity inputs now share a finite-number conversion that
  treats an empty or otherwise invalid edit state as quantity zero while leaving
  the field visibly clear. Browser verification covered clearing every quantity,
  a safe `$0.00` subtotal, and re-entering shirt and album quantities with the
  expected size/color selectors and `$155.00` subtotal.

## 2026-07-27 Forms, Links, and Email Reliability Audit

- Production navigation and the 19 audited external/download/API links all
  resolved successfully before this change set. The remaining domain issue is
  `www.headrust.com`, whose certificate and domain connection require the
  GoDaddy account to complete Domain Connect authorization.
- Contact and booking submissions now use shared client/server validation,
  classify booking requests explicitly, and route contact, booking, custom
  quote, and merchandise notifications to `dbrack37@gmail.com`.
- The unauthenticated contact-message listing endpoint was removed. Public
  contact and order endpoints now have per-IP request limits.
- Contact requests now use the connected PostgreSQL database in production,
  matching the existing durable merchandise-order path. Local development
  continues to use the in-memory fallback when `DATABASE_URL` is absent.
- GitHub Actions now runs `npm run check` and `npm run build` for pull requests
  and pushes to `main`.
- Production deployment required approval of Replit's validated database
  migration after the Publishing pane detected the new contact-message table.
  The header Republish shortcut did not surface that paused migration or enqueue
  a build; use the Publishing pane directly when database changes are present.
- Production verification passed on deployment `cefd0a27`: the new favicon
  assets are live, the private contact-message route returns `404`, and the
  labeled booking, custom-quote, and merchandise tests were saved and delivered
  to `dbrack37@gmail.com`. The booking test reached the inbox; Gmail classified
  the intentionally repetitive quote and order audit messages as spam, so
  future delivery checks should search `in:anywhere` before treating a message
  as missing.

## 2026-07-27 Approved Shirt Storefront Handoff

- The approved storefront mockups are the photographic v3 assets:
  `attached_assets/headrust-vultures-last-encore-real-black-shirt-v3.png`
  and
  `attached_assets/headrust-serpent-double-kick-real-black-shirt-v3.png`.
  Earlier unreferenced shirt mockups remain preserved but must not replace these
  assets without new user approval.
- The storefront products are `Vultures' Last Encore T-Shirt` and
  `Serpent Double Kick T-Shirt`, both priced at `$30.00`. The order form and
  email details keep their quantities and sizes separate so mixed orders remain
  identifiable.
- Server-side order handling owns item prices and shipping calculations. It does
  not accept client-provided subtotals or shipping charges as authoritative.
- Validation covered a production build, both asset URLs, desktop and mobile
  product presentation, preselected product ordering, mixed shirt sizes, free
  Tucson delivery, remote zone shipping, rejected invalid sizes, and zero
  browser console errors.
- Production email delivery remains unverified locally because
  `SENDGRID_API_KEY` was not available during validation. A missing email key no
  longer makes the browser report that an already-recorded order was rejected.
- `server/storage.ts` currently exports `MemStorage`; orders are not durable
  across a server restart. The PostgreSQL schema includes the two new shirt
  fields, but no external database migration or deployment was performed in
  this handoff.

## 2026-07-25 Audit Follow-Ups

- GitHub remote `DDBrax/HeadrustSite` is public. Before future pushes or handoffs, fetch and reconcile remote `main`; during the audit, GitHub `main` was ahead of the local tracking ref by two commits.
- One tracked attached prompt asset contains a placeholder-like API key assignment line. No literal secret value was printed or confirmed during the audit. Review the asset before future public publishing or cleanup work.
- Do not change repository visibility, collaborators, branch protection, credentials, installs, or pushes automatically after a retrospective audit. Those remain explicit-approval actions.

## 2026-07-25 Gemini T-Shirt Workflow Incident

- A saved Chrome tab handle survived after the underlying tab disappeared. Reacquire
  the direct Chrome browser and Gemini tab immediately before every operation; if
  no Gemini tab exists, create and navigate a new one.
- Gemini's Copy Image action returned a stale clipboard image and caused the wrong
  artwork to be stored as Bell of Ruin. Clipboard state is not acceptable capture
  evidence.
- Save Gemini's generated-image element with
  `tools/save-gemini-lightbox.mjs`. It uses a browser-native element clip, rejects
  loading transitions or obstructed images, writes a validated PNG directly to
  the project, preserves the previous file, and avoids the clipboard, temporary
  downloads, and native Save dialog.
- Do not use browser screenshot crops for final Gemini sources. Loading blur,
  browser chrome, or an overlaid location prompt can be captured even when the
  dimensions appear correct.
- The Tucson Metal compositor must reject sources that are not the expected
  `825 x 1024` Gemini image dimensions before it creates or overwrites mockups.
- The metal-music batch (concepts 15-24) completed successfully with all ten
  sources auto-saved at `825 x 1024` and all ten full mockups rendered at
  `1536 x 858`. The Music layout places the Headrust wordmark at `Y=190`, keeps
  an exact 8 px wordmark-to-art gap, and keeps `TUCSON METAL` 16 px below the
  artwork. Every compositor safe-zone check passed.
- The Gemini full-size download control opens a visible Windows folder and must
  not be used for this project. Do not substitute visible desktop automation to
  close or operate that window. Use background browser control or a generator
  that returns a local file path, then copy the generated file directly into the
  project with no Windows cursor movement or screen highlighting.

## 2026-07-25 Refinement Batch Continuity Incident

- Correction after deeper inspection: application-level response-stream
  disconnects were verified in the local task rollout and Codex logs. Requests
  to `https://chatgpt.com/backend-api/codex/responses` repeatedly ended with
  `stream disconnected before completion`, including a failed remote compaction.
  OpenAI also reported July 25 incidents affecting ChatGPT and Codex
  conversations during the same work period.
- The original design rollout reached approximately 322 MB and contained more
  than 100 million characters of inline generated-image data. Its later requests
  approached 193,000 input tokens. This image-heavy history amplified the remote
  transport failure and made compaction and continuation unusually fragile.
- Forking did not recover the task: the fork inherited virtually the entire
  rollout and image payload. Continue from `docs/headrust-design-handoff.md` in
  a genuinely new task instead of forking either damaged task.
- Do not use the built-in image edit endpoint for this T-shirt project. The
  fresh-generation route returned local file paths without opening Windows UI.
- Immediately checkpoint every successful generated source with
  `tools/checkpoint-artwork-source.ps1` before the next generation. The script
  validates the PNG, copies it atomically into the project, verifies SHA256, and
  records the completed concept in a batch manifest so a later service failure
  cannot erase completed work.
- A connection diagnostic found the Wi-Fi adapter up, normal DNS resolution,
  successful HTTPS connectivity, and no recent WLAN disconnect events. The
  endpoint logs and the matching OpenAI incidents establish that the direct
  disconnect was in the remote conversation-response path, not the local Wi-Fi.
  Repository changes can eliminate the Headrust-specific history bloat but
  cannot guarantee external service availability.
- Keep PowerShell source labels ASCII-safe and run compositor validation
  immediately after editing the script, before beginning a long composition run.
- Use a dedicated output directory for each refinement batch so earlier concepts
  are not mixed with the current deliverables.
- During multi-image batches, report status after every one or two completed
  generations and before composition or validation so tool latency is not
  mistaken for a lost task.
- Recovery was validated in a genuinely new local Headrust task. Its first
  file-integrity turn completed in 42 seconds and its consecutive continuity
  turn completed in 13 seconds; the rollout remained measured in kilobytes
  rather than hundreds of megabytes.
- After validation, both image-bloated predecessor tasks were archived rather
  than deleted. A separate Buzz orphan-process leak was also cleared without
  terminating either non-Buzz Codex executable.

## 2026-07-27 Publishing, Domain, and Indexing Incident

- The storefront publishing task repeated the image-history failure mode after
  using built-in image generation. Its rollout reached approximately 97 MB,
  recent requests reached roughly 218,000 input tokens, and several turns ended
  with response-stream disconnects. The task must not be used for further
  publishing work.
- The GitHub release itself succeeded: the approved storefront and Eyes on
  Empire updates were merged into `main`. A merged pull request did not prove
  production publication.
- Replit authentication had expired with an OAuth `invalid_grant`. Production
  continued serving the earlier Eyes on Empire image after GitHub `main` had
  advanced, proving the deployment had not caught up.
- The apex hostname returned HTTP 200 with a valid certificate. The `www`
  hostname had authoritative DNS but no working TLS handshake, indicating that
  its DNS record existed without a valid custom-domain certificate binding.
- The live site exposed valid robots, sitemap, canonical, description, and
  index/follow metadata, but no Google result was found. Search Console
  submission and later index verification remain separate proof stages.
- Use `docs/deployment-runbook.md` for future releases. Publishing must start in
  a clean file-based task, confirm Replit authentication before release work,
  verify the deployed API and assets, and test both apex and `www` HTTPS.
- Recovery release PR #4 merged as GitHub `main` commit
  `7acb2f547542cf0966113f4d639d923932d4466b`. Replit preserved its local
  publish commits, merged that release as `19a01e9`, and successfully promoted
  it to production.
- Production verification confirmed a three-column merchandise grid at desktop
  width: the three shirts form the first row, followed by the two hats and
  album. The request-order form's ZIP-based estimator returns free local
  delivery for Tucson, Arizona and a paid estimate for Marana.
- Search Console auto-verified the `https://headrust.com/` property, reported
  the homepage indexed and served over HTTPS, accepted `sitemap.xml`, and
  accepted a priority recrawl request after the production release.
- `www.headrust.com` remains an external authentication handoff. Replit/Entri
  generated a GoDaddy Domain Connect request for the required verification and
  A records, but the owner must complete the GoDaddy password sign-in before
  Replit can bind the hostname and provision TLS. Do not report the `www` repair
  complete until an independent HTTPS request and canonical redirect both pass.
- The failed 97 MB publishing task was archived. The clean recovery task is
  pinned with a compact release handoff so future deployment work can continue
  without importing image-heavy history.
