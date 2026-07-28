# Headrust Shirt Design — Clean Task Handoff

## Current selected design

- Selected concept: Vultures' Last Encore, preserving the approved composition
  with a solid etched microphone mounted directly to the original wooden perch.
- Current selected mockup:
  `output/tshirt-concepts-selected-vulture-mic/77-vultures-last-encore-blue-path-red-removed-tucson-metal.png`
- Matching preserved source:
  `output/selected-vulture-mic-artwork/77-vultures-last-encore-blue-path-red-removed-print-source.png`
- The previously selected serpent/double-kick mockup and its checkpointed
  sources remain preserved under `output/tshirt-concepts-selected-serpent-drum`
  and `output/selected-serpent-drum-artwork`.

## Verified state

- The selected sources are saved locally as validated PNG files; the current
  vulture source is 1122 x 1402 at 300 DPI and the serpent source is
  1254 x 1254.
- Their SHA256 hashes and checkpoint timestamps are recorded in the manifests.
- Existing outputs are authoritative. Do not regenerate or overwrite them merely
  to reconstruct prior conversation context.

## Continuation rules

- This handoff replaces the image-heavy task history. Consume saved file paths,
  not copied conversation history or inline image payloads.
- Do not fork either of the prior Headrust design tasks.
- Do not use built-in image generation or image editing in the long-running main
  design task. Those results embed large image payloads in task history.
- Generate each new source through the project's Gemini background-browser
  workflow or in a disposable single-asset task.
- Save the result with `tools/save-gemini-lightbox.mjs`, then immediately run
  `tools/checkpoint-artwork-source.ps1` before another network call.
- Keep the main task focused on file paths, design decisions, composition, and
  verification. Start another clean task if its history becomes image-heavy.

## Shirt-ready production rule

- Every shirt-ready deliverable must be one composed transparent-background PNG,
  not a bundle of separate assets.
- The single printable file must contain the Headrust logo, the selected artwork,
  and the `TUCSON METAL` text together in their approved composition.
- Apply the same one-file transparent-background requirement to compositions
  using the HR logo or HR-logo artwork.
- Preserve the selected design while preparing the production file; do not
  substitute or redesign unrelated elements.

## Active Vultures' Last Encore refinement

- Current review mockup:
  `output/tshirt-concepts-selected-vulture-mic/77-vultures-last-encore-blue-path-red-removed-tucson-metal.png`
- Current print-scale source:
  `output/selected-vulture-mic-artwork/77-vultures-last-encore-blue-path-red-removed-print-source.png`
- Last composed one-file transparent print:
  `output/selected-vulture-mic-artwork/print-ready/66-vultures-last-encore-fitted-mic-cable-composed-print.png`
- The retained wooden perch now carries a smaller realistic etched microphone.
  Its cable visibly exits the microphone base, enters the existing wrap, and
  passes behind the central stick at the upper crossing.
- Preserved clean source for the next edit:
  `output/selected-vulture-mic-artwork/58-vultures-last-encore-stick-mic-source.png`
- Versions 60 and 61 are rejected because they contain visible local texture
  repairs. Versions 62 through 64 are also superseded by the fresh redraw.
- Version 65 is the raw checkpointed Gemini redraw. Version 66 is its
  checkpointed 1122 x 1402, 300-DPI production source; it contains no local
  cable patch.
- Version 67 is the raw checkpointed redraw with one complete upper cable wind
  removed. Version 68 is its checkpointed 1122 x 1402, 300-DPI print-scale
  source and shirt mockup, but it removed the wrong rear/behind-stick wind and
  is rejected.
- Version 69 is the raw checkpointed correction made again from version 65. It
  retains the rear wind and removes the upper foreground-facing wind. Version
  70 is its checkpointed 1122 x 1402, 300-DPI print-scale source and current
  shirt mockup, but it still did not match the original cable pattern.
- Version 71 is a rejected Gemini attempt to use the original cable as a visual
  reference; it still converted the cable into a tight helix.
- Version 72 is built directly from the original version 33 artwork, preserving
  the original broad three-turn S-weave cable pixel-for-pixel below the short
  microphone connection. Only the microphone/connector region differs. Its
  source and shirt mockup remain checkpointed.
- Version 73 is a rejected full-image edit because it removed too much of the
  upper cable wrap.
- Version 74 is the checkpointed clean source made from the user's red/blue
  markup: the two red-marked cable portions are absent and the retained cable
  follows the blue alternating wrap around the wooden perch. Version 75 is its
  checkpointed 1122 x 1402, 300-DPI print-scale source and shirt mockup, but the
  user rejected it because it did not follow the marked blue path closely
  enough.
- Version 76 is the new checkpointed clean source made again from version 69
  using the user's more precise markup. It contains one broad visible cable
  following the blue S-shaped path, hides the cable behind the solid wood at
  each crossing, and removes the red-marked competing cable sections. Version
  77 is its checkpointed 1122 x 1402, 300-DPI print-scale source and current
  shirt mockup. Compose the version 77 transparent print only after the user
  approves this mockup.
- The composed version 66 print is 4500 x 5400 at 300 DPI, has a transparent
  background, and contains the Headrust wordmark, artwork, and `TUCSON METAL`
  together in one PNG. The Gemini corner provenance mark is absent from the
  transparent artwork layer.
- Earlier versions 53 through 65 remain preserved.

## Serpent/double-kick dual-HR production variant

- The previously selected serpent-and-drums artwork remains preserved.
- Current checkpointed source with both HR logos reduced and lowered so every
  point remains inside its kick-drum skin:
  `output/selected-serpent-drum-artwork/57-serpent-double-kick-fitted-dual-hr-source.png`
- New shirt mockup:
  `output/tshirt-concepts-selected-serpent-drum-fitted-hr/57-serpent-double-kick-fitted-dual-hr-tucson-metal.png`
- Back-only close-up preview:
  `output/tshirt-concepts-selected-serpent-drum-fitted-hr/57-serpent-double-kick-fitted-dual-hr-back-closeup.png`
- New one-file transparent shirt print containing the Headrust wordmark, dual-HR
  artwork, and `TUCSON METAL`:
  `output/selected-serpent-drum-artwork/print-ready/57-serpent-double-kick-fitted-dual-hr-composed-print.png`
- The source and composed print are checkpointed in
  `output/selected-serpent-drum-artwork/batch-state.json`.
- Validation confirmed both fitted HR marks are contained inside the drumhead
  safe areas. The print file is 4500 x 5400 at 300 DPI with a transparent
  background. The earlier version 52 remains preserved.

## Next action

Review the version 77 vulture mockup using the exact blue cable path. If approved,
compose its one-file 4500 x 5400, 300-DPI transparent print. Preserve all current
outputs and previous versions before any further refinement.
