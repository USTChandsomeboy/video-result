# Kinetic replication log

## Public input and observation

- Read `../public-input/instruction.md`, `video-spec.json`, `objects.json`, and `asset-manifest.json`.
- Observed the full 15-second reference through a continuous 0.1-second frame sequence, additional 0.25-second overview sheets, full-resolution anchors, and frame-by-frame samples of the opening-to-graph transition. Observation files are in `observations/`.
- Reference: 1920×1080, 60 fps, 900 frames, H.264 video, no audio stream.
- Restricted implementation inputs to the public input, replica directory, and linked runtime dependencies.

## Motion and implementation

- Opening: close view of an orange on/off toggle; a black cursor approaches and clicks. The camera pulls back to show “Linear Easing”; the toggle slides off, “Linear” letters bend and fall individually, and “Easing” grows. Its orange i-dot bounces and stretches before the text slides left.
- Graph: thin axes and a dashed equilibrium line slide in. A sampled damped spring response is drawn by an orange leading dot, with the “↑22%” annotation beside the first peak. The camera tracks and magnifies the dot to transition into the shape scene.
- Morph: centered orange circle on black; color inversion to black on orange; circle becomes a rounded rotating diamond, then an orange capsule on paper. An outline lingers while the capsule shrinks to a dot on black.
- Orbit: editable individual letters form a rotating CSS 3D cylinder with dark back faces and light front faces. The ring expands around the orange center dot; the dot drops before the cut to the point grid. Text: “PULSE · ECHO · ORBIT · DRIFT · TWEEN · ARCS · BLUR ·”.
- Halftone: separately generated SVG grid circles change radius according to distance and a travelling pulse; an expanding dark wave fills the scene around the orange center dot.
- Ending: clipped text reveals “Kinetic Study 07”, “Physics in code”, and “1 equation”; the orange dot becomes the punctuation. The equation retreats and the dot returns to center.
- Rewind: time is mapped backward through the same scene components to reproduce the fast reverse montage and return to the close toggle.
- Each public object ID is applied to its actual DOM/SVG rendering root. Text remains text, letters and grid samples remain editable members.

## Validation and render

- TypeScript check: `npm run typecheck` passed under Node.js 22.12.0.
- Render uses the preinstalled Remotion 4.0.535 runtime and browser with concurrency 2. No dependencies installed.
- The first successful full render is retained as `output.mp4`. No scorer, verifier, or subjective score was produced.

### Completed render

```sh
PATH=[local artifact] \
REMOTION_BROWSER_EXECUTABLE=[local artifact] \
npm run render > render.log 2>&1
```

The package render command is `remotion render src/index.tsx Replica output.mp4 --codec=h264 --concurrency=2 --gl=angle`.

- First complete render: successful, 900/900 rendered and encoded.
- Output decode: successful, 900 frames, 15.00 seconds, 1920×1080, 60 fps, H.264, no audio.
- Output SHA-256: `56ce4adfb85fa5459a1ebbb3bb8686089f26b885dc2b970c00867ef3bfb4fe01`.
- Metadata/decode transcript: `metadata.log`.
- Actual blockers: none. The shell did not expose a `node22` alias; the supplied absolute Node.js 22.12.0 runtime was used successfully.
- No changes were made to the implementation after the first successful full render.
