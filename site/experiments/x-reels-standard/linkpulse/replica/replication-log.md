# LinkPulse replication log

## Public inputs used

- `../public-input/instruction.md`, `objects.json`, `asset-manifest.json`, `video-spec.json`, and `reference.mp4`.
- Supplied font files through the existing `public/fonts` and entry-point font CSS.
- Existing blank Remotion project and its shared runtime dependencies.

## Observations and implementation

The full reference was reviewed as a continuous series of contact frames, followed by full-resolution frames and a denser launch-action sequence. Observation images are stored in `observations/`.

- 0.00–1.50 s: long URL types across a dark grid; the label tracks character count; the text flattens into an orange line.
- 1.50–2.25 s: a dark rounded `pulso.example/drop` capsule types in; a cursor approaches and clicks; white and orange rings expand from the click.
- 2.00–4.55 s: a dotted globe rises, with geographic particles, orange rim, travel arcs, pings, and floating particles. The capsule shrinks upward while the visits counter rolls toward 1,306,482.
- 4.40–7.55 s: a dark perspective dashboard enters. Visits, Signups, and Revenue become active in sequence; the chart shifts blue, purple, and teal. Metric end values are 1,306,482, 52,917, and $418,260. A moving chart tooltip and four notification cards appear.
- 7.50–10.55 s: a white central brand mark blooms with a purple glow, initials nodes and connecting lines expand, and `Scale through referrals.` enters above them. Earnings count to $3,864,215, with green node payout tags.
- 10.50–12.50 s: eight feature cards advance every 15 frames: Tiny links.; Scan codes.; Own domains.; App routing.; Attribution.; Referrals.; Rewards.; All in one. Card backgrounds include generated square cells, color gradients, and falling dollar signs.
- 12.50–15.067 s: a large rotating brand mark contracts onto a white grid, the pulso wordmark is revealed, a soft multicolor glow grows, and `Make every link count.` enters word by word with an orange underline. `Get started →` and `pulso.example` buttons follow.

All text remains text. Logos, nodes, geographic dots, charts, rings, cursor, and card ornamentation are generated with editable DOM/SVG. Actual object roots carry the public `data-bench-object` IDs. Animations depend only on Remotion frame time and deterministic constants. No reference video frames are used in the rendered composition.

## Validation and render

- `npm run typecheck` completed successfully.
- Composition: `Replica`, 1920×1080, 60 fps, 904 frames.
- Rendering uses the supplied browser, H.264 codec, and concurrency 2.
- The first successful complete output is retained as `output.mp4`; no scoring or verifier was generated or used.

Render command:

```sh
PATH=[local artifact] REMOTION_BROWSER_EXECUTABLE=[local artifact] npm run render
```

Render output is captured in `render.log`.

## Completed output metadata

The first render completed successfully (exit code 0). FFmpeg's complete stream scan reports 904 video frames, H.264 High profile, 1920×1080, 60 fps, approximately 15.067 seconds. The file contains one video stream and no audio stream, matching the reference's stream layout. `metadata-check.log` records the scan. No blocking issue remained at delivery.
