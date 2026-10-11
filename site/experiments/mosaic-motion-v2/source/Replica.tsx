import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type SceneId = 'portrait' | 'lounge' | 'flight' | 'suite' | 'dinner' | 'card';
export type SceneRecord = {id: SceneId; columns: number; rows: number; changed: number[]};
export type Manifest = {width: number; height: number; tileSize: number; seed: number; scenes: SceneRecord[]};
export type LoadedScene = SceneRecord & {record: SceneRecord; before: HTMLImageElement; after: HTMLImageElement};
export type Assets = {manifest: Manifest; scenes: Record<SceneId, LoadedScene>};
export type Config = {width: number; height: number; fps: number; durationInFrames: number};

const IDS: SceneId[] = ['portrait', 'lounge', 'flight', 'suite', 'dinner', 'card'];
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value: number) => {const p = clamp(value); return p * p * (3 - 2 * p);};
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const hash = (index: number, salt: number) => {
  const v = Math.sin(index * 127.1 + salt * 311.7 + 42) * 43758.5453;
  return v - Math.floor(v);
};

type Reveal = {start: number; speed: number; duration: number; centers: [number, number][]};
const REVEALS: Record<SceneId, Reveal> = {
  portrait: {start: 0.43, speed: 790, duration: 0.28, centers: [[915, 400]]},
  lounge: {start: 5.4, speed: 570, duration: 0.28, centers: [[1000, 490]]},
  flight: {start: 10.64, speed: 760, duration: 0.3, centers: [[550, 650]]},
  suite: {start: 15.64, speed: 580, duration: 0.32, centers: [[470, 450], [870, 450], [1285, 450]]},
  dinner: {start: 20.8, speed: 530, duration: 0.32, centers: [[650, 500], [1080, 500], [1360, 500]]},
  card: {start: 23.58, speed: 770, duration: 0.3, centers: [[1100, 530]]},
};

/** Draw one mosaic, with the changed squares moving through a radial wave. */
function drawMosaic(ctx: CanvasRenderingContext2D, seconds: number, scene: LoadedScene, manifest: Manifest) {
  const reveal = REVEALS[scene.id];
  const elapsed = seconds - reveal.start;
  if (elapsed < 0) {
    ctx.drawImage(scene.before, 0, 0, manifest.width, manifest.height);
    return;
  }
  if (elapsed > 2.25) {
    ctx.drawImage(scene.after, 0, 0, manifest.width, manifest.height);
    return;
  }
  ctx.drawImage(scene.before, 0, 0, manifest.width, manifest.height);
  const tile = manifest.tileSize;
  for (const index of scene.changed) {
    const x = (index % scene.columns) * tile;
    const y = Math.floor(index / scene.columns) * tile;
    let distance = Infinity;
    for (const [cx, cy] of reveal.centers) distance = Math.min(distance, Math.hypot(x - cx, y - cy));
    const jitter = (hash(index, 1) - 0.5) * 0.1;
    const progress = clamp((elapsed - distance / reveal.speed - jitter) / reveal.duration);
    if (progress <= 0) continue;
    if (progress >= 1) {
      ctx.drawImage(scene.after, x, y, tile, tile, x, y, tile + 0.15, tile + 0.15);
      continue;
    }
    const p = smooth(progress);
    ctx.globalAlpha = p;
    ctx.drawImage(scene.after, x, y, tile, tile, x, y, tile + 0.2, tile + 0.2);
    const wave = Math.sin(progress * Math.PI);
    const angle = hash(index, 2) * Math.PI * 2;
    const travel = wave * (8 + hash(index, 3) * 35);
    const dx = Math.cos(angle) * travel;
    const dy = Math.sin(angle) * travel;
    const size = tile * (0.45 + 0.55 * Math.abs(2 * progress - 1));
    ctx.save();
    ctx.translate(x + tile / 2 + dx, y + tile / 2 + dy);
    ctx.rotate(wave * (hash(index, 4) - 0.5) * 2.3);
    ctx.globalAlpha = wave * 0.85;
    ctx.drawImage(progress < 0.5 ? scene.before : scene.after, x, y, tile, tile, -size / 2, -size / 2, size, size);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

const PANS = [
  {from: 0, to: 1, start: 4.2, end: 4.96},
  {from: 1, to: 2, start: 8.8, end: 9.65},
  {from: 2, to: 3, start: 13.45, end: 14.45},
  {from: 3, to: 4, start: 18.55, end: 19.62},
];

function sceneView(ctx: CanvasRenderingContext2D, seconds: number, assets: Assets, id: SceneId, xOffset: number) {
  let scale = 1.05;
  let cx = 900;
  let cy = 540;
  if (id === 'portrait') {
    const pullback = smooth((seconds - 1.52) / 1.86);
    scale = mix(2.8, 1.05, pullback);
    cx = mix(928, 900, pullback);
    cy = mix(414, 540, pullback);
  }
  // Each panel has a small camera settle after the fast horizontal move.
  const settledAt: Record<SceneId, number> = {portrait: 3.38, lounge: 4.96, flight: 9.65, suite: 14.45, dinner: 19.62, card: 25.4};
  if (id !== 'portrait' || seconds > 3.38) scale += 0.018 * (1 - smooth((seconds - settledAt[id]) / 1.3));
  ctx.save();
  ctx.translate(960 + xOffset, 540);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);
  drawMosaic(ctx, seconds, assets.scenes[id], assets.manifest);
  ctx.restore();
}

/** The same deterministic canvas renderer is used by the Remotion component. */
export function drawFrame(ctx: CanvasRenderingContext2D, seconds: number, assets: Assets, config: Config) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#15140f';
  ctx.fillRect(0, 0, config.width, config.height);
  ctx.scale(config.width / 1920, config.height / 1080);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const pan = PANS.find((transition) => seconds >= transition.start && seconds < transition.end);
  if (pan) {
    const p = smooth((seconds - pan.start) / (pan.end - pan.start));
    const blur = Math.sin(p * Math.PI) * 7;
    ctx.filter = `blur(${blur}px)`;
    sceneView(ctx, seconds, assets, IDS[pan.from], -p * 1920);
    sceneView(ctx, seconds, assets, IDS[pan.to], (1 - p) * 1920);
    ctx.filter = 'none';
  } else {
    let index = 0;
    for (const transition of PANS) if (seconds >= transition.end) index = transition.to;
    // The final card grows out of the dining scene, without a camera cut.
    if (seconds >= 23.58) index = 5;
    sceneView(ctx, seconds, assets, IDS[index], 0);
  }
  if (seconds < 0.38) {
    ctx.fillStyle = `rgba(21,20,15,${1 - clamp(seconds / 0.38)})`;
    ctx.fillRect(0, 0, 1920, 1080);
  }
  ctx.restore();
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Cannot load image: ${url}`));
    image.src = url;
  });
}

export const Replica: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [handle] = useState(() => delayRender('Loading mosaic images'));
  useLayoutEffect(() => {
    let active = true;
    (async () => {
      const response = await fetch(staticFile('assets/mosaics/manifest.json'));
      if (!response.ok) throw new Error('Unable to load public mosaic manifest');
      const manifest = await response.json() as Manifest;
      const entries = await Promise.all(manifest.scenes.map(async (record) => {
        const [before, after] = await Promise.all([
          loadImage(staticFile(`assets/mosaics/${record.id}-before.png`)),
          loadImage(staticFile(`assets/mosaics/${record.id}-after.png`)),
        ]);
        return [record.id, {...record, record, before, after}] as const;
      }));
      if (active) setAssets({manifest, scenes: Object.fromEntries(entries) as Record<SceneId, LoadedScene>});
    })().catch(cancelRender);
    return () => {active = false;};
  }, []);
  useLayoutEffect(() => {
    if (!assets || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    drawFrame(context, frame / fps, assets, {width, height, fps, durationInFrames});
    continueRender(handle);
  }, [assets, frame, fps, width, height, durationInFrames, handle]);
  return <AbsoluteFill style={{backgroundColor: '#15140f'}}>
    <canvas ref={canvasRef} width={width} height={height} style={{width: '100%', height: '100%'}} />
    <Audio src={staticFile('assets/journey.wav')} />
  </AbsoluteFill>;
};
