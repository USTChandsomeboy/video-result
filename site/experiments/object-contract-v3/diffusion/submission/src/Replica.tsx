import React, {CSSProperties, useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, staticFile} from 'remotion';

const W = 1280;
const H = 720;
const fps = 30;

type Props = Record<string, unknown>;

/** A zero-visual-impact wrapper used by the benchmark object contract. */
const BenchObject = ({id, children, style}: {id: string; children: React.ReactNode; style?: CSSProperties}) => (
  <div data-bench-object={id} style={style}>{children}</div>
);

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

const Particle = ({x, y, color, r = 5, alpha = 1}: {x: number; y: number; color: string; r?: number; alpha?: number}) => (
  <circle cx={x} cy={y} r={r} fill={color} opacity={alpha} />
);

// Fixed seeds make the point fields stable across renders while still allowing frame-driven motion.
const purple = Array.from({length: 25}, (_, i) => ({
  x: 0.05 + ((i * 0.173) % 0.87),
  y: 0.17 + ((i * 0.347) % 0.60),
  phase: (i * 0.77) % 1,
}));
const blue = Array.from({length: 12}, (_, i) => ({
  x: 0.07 + ((i * 0.211) % 0.82),
  y: 0.24 + ((i * 0.491) % 0.45),
  phase: (i * 0.91) % 1,
}));
const orange = Array.from({length: 8}, (_, i) => ({
  x: 0.10 + ((i * 0.231) % 0.76),
  y: 0.27 + ((i * 0.413) % 0.38),
  phase: (i * 0.63) % 1,
}));

const labelStyle: CSSProperties = {
  fontFamily: 'Inter Tight, Arial, Helvetica, sans-serif',
  color: '#20252b',
  letterSpacing: 1.2,
};

function DiffusionDiagram({frame}: {frame: number}) {
  const x = 734, y = 164, width = 467, height = 224;
  const left = x + 20, top = y + 35, innerW = width - 40, innerH = 130;
  const p = ease(frame, 80, 450);
  const arrow = fade(frame, 150, 235);
  const divider = x + innerW * (0.50) + 20;
  return (
    <BenchObject id="diffusion.panel" style={{position: 'absolute', left: x, top: y, width, height}}>
      <div style={{position: 'absolute', inset: 0, background: '#fbfbfa', border: '1px solid #e2e4e7', boxShadow: '0 7px 20px rgba(48,58,67,.08)', borderRadius: 2}} />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <rect x={20} y={35} width={innerW} height={innerH} fill="#dff1f8" stroke="#d0dde3" strokeWidth={1} />
        <line x1={20} y1={165} x2={innerW + 20} y2={165} stroke="#9c9f9d" strokeWidth={4} />
        <line x1={divider} y1={35} x2={divider} y2={165} stroke="#98a5aa" strokeWidth={2} strokeDasharray="3 5" opacity={.9} />
        <text x={width / 2} y={24} textAnchor="middle" fontFamily="Arial" fontSize={12} fill="#1474a3" fontWeight={700}>simple diffusion</text>
        <g data-bench-object="diffusion.particles">
          {purple.map((q, i) => {
            // High-to-low movement: points begin concentrated on the left and spread over time.
            const xNorm = i < 13 ? q.x * (.31 + .48 * p) : .36 + q.x * (.55 - .18 * p);
            const wobble = Math.sin(frame / 28 + q.phase * 7) * 0.035;
            const yy = top - y + (q.y + wobble) * innerH;
            const xx = 20 + (Math.max(.03, Math.min(.97, xNorm))) * innerW;
            return <Particle key={i} x={xx} y={yy} color="#8d2a85" r={4.7} />;
          })}
        </g>
        <g data-bench-object="diffusion.arrow" opacity={arrow}>
          <line x1={divider - 53} y1={80} x2={divider + 53} y2={80} stroke="#3198c8" strokeWidth={4} />
          <polygon points={`${divider + 53},80 ${divider + 39},72 ${divider + 39},88`} fill="#3198c8" />
        </g>
        <text x={112} y={187} textAnchor="middle" fontFamily="Arial" fontSize={11} fill="#30363a">left: 12</text>
        <text x={354} y={187} textAnchor="middle" fontFamily="Arial" fontSize={11} fill="#30363a">right: 14</text>
      </svg>
    </BenchObject>
  );
}

function OsmosisDiagram({frame}: {frame: number}) {
  const reveal = fade(frame, 630, 790);
  const x = 734, y = 398, width = 467, height = 178;
  const innerW = width - 40, innerH = 112;
  const divider = 20 + innerW * .53;
  return (
    <BenchObject id="osmosis.panel" style={{position: 'absolute', left: x, top: y, width, height, opacity: reveal}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <rect x={20} y={22} width={innerW} height={innerH} fill="#dff1f8" stroke="#d0dde3" strokeWidth={1} />
        <line x1={20} y1={134} x2={innerW + 20} y2={134} stroke="#9c9f9d" strokeWidth={4} />
        <line x1={divider} y1={22} x2={divider} y2={134} stroke="#d7895e" strokeWidth={4} strokeDasharray="4 5" />
        <g data-bench-object="osmosis.membrane">
          <line x1={divider} y1={22} x2={divider} y2={134} stroke="#e4936c" strokeWidth={2} strokeDasharray="1 5" />
        </g>
        <g data-bench-object="osmosis.particles">
          {blue.map((q, i) => {
            const xx = 20 + q.x * innerW + Math.sin(frame / 22 + q.phase * 9) * 8;
            const yy = 22 + q.y * innerH + Math.cos(frame / 29 + q.phase * 7) * 4;
            return <Particle key={`b${i}`} x={xx} y={yy} color="#3d98be" r={3.3} />;
          })}
          {orange.map((q, i) => {
            const xx = 20 + (0.49 + q.x * .49) * innerW + Math.sin(frame / 34 + q.phase * 9) * 4;
            const yy = 22 + q.y * innerH + Math.cos(frame / 31 + q.phase * 6) * 4;
            return <Particle key={`o${i}`} x={xx} y={yy} color="#e77932" r={7} />;
          })}
        </g>
        <g opacity={fade(frame, 730, 820)}>
          <line x1={divider - 34} y1={53} x2={divider + 34} y2={53} stroke="#3198c8" strokeWidth={4} />
          <polygon points={`${divider + 34},53 ${divider + 20},45 ${divider + 20},61`} fill="#3198c8" />
        </g>
        <text x={125} y={155} textAnchor="middle" fontFamily="Arial" fontSize={10.5} fill="#30363a">dilute: more water</text>
        <text x={368} y={155} textAnchor="middle" fontFamily="Arial" fontSize={10.5} fill="#30363a">concentrated: less water</text>
        <text x={divider + 5} y={14} textAnchor="middle" fontFamily="Arial" fontSize={10} fill="#1680a9" fontWeight={700}>osmosis</text>
      </svg>
    </BenchObject>
  );
}

export const Replica: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const bullets = useMemo(() => ({one: fade(frame, 75, 150), two: fade(frame, 190, 270), note: fade(frame, 540, 650)}), [frame]);
  return (
    <AbsoluteFill style={{background: '#fafaf8', ...labelStyle}}>
      <style>{`@font-face{font-family:"Inter Tight";src:url(${staticFile("fonts/inter-tight-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900;}@font-face{font-family:"JetBrains Mono";src:url(${staticFile("fonts/jetbrains-mono-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900;}`}</style>
      <div style={{position: 'absolute', top: 0, left: 0, width: 286, height: 4, background: '#e9bc52'}} />
      <div style={{position: 'absolute', top: 31, left: 42, display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 700, letterSpacing: 2}}>
        <span style={{width: 10, height: 10, background: '#1e6f9e', display: 'inline-block'}} />BIOLOGY
      </div>
      <div style={{position: 'absolute', right: 42, top: 33, fontSize: 11, letterSpacing: 2, color: '#6f7376'}}>HSC</div>
      <div style={{position: 'absolute', left: 42, top: 94, fontFamily: 'Inter Tight, Arial, Helvetica, sans-serif', fontSize: 11, letterSpacing: 2.4, color: '#656c70'}}>CORE IDEA</div>
      <BenchObject id="slide.title" style={{position: 'absolute', left: 42, top: 119, width: 580, opacity: fade(frame, 18, 90)}}>
        <div style={{fontSize: 45, lineHeight: 1.02, fontWeight: 800, letterSpacing: -2.2}}>Simple diffusion and<br/>osmosis</div>
        <div style={{height: 2, background: '#8caab6', width: 600, marginTop: 17}} />
      </BenchObject>
      <BenchObject id="slide.bullet01" style={{position: 'absolute', left: 41, top: 225, width: 600, opacity: bullets.one}}>
        <div style={{display: 'flex', gap: 11, alignItems: 'flex-start'}}><span style={{color: '#6497ab', fontWeight: 700, fontSize: 13, letterSpacing: 1.1}}>| 01</span><div style={{fontSize: 18, fontWeight: 700, lineHeight: 1.33}}>Simple diffusion: net movement from high to low<br/>concentration, down the gradient, until evenly spread.</div></div>
      </BenchObject>
      <BenchObject id="slide.bullet02" style={{position: 'absolute', left: 41, top: 329, width: 600, opacity: bullets.two}}>
        <div style={{display: 'flex', gap: 11, alignItems: 'flex-start'}}><span style={{color: '#6497ab', fontWeight: 700, fontSize: 13, letterSpacing: 1.1}}>| 02</span><div style={{fontSize: 18, fontWeight: 700, lineHeight: 1.33}}>O₂ and CO₂ diffuse straight through the bilayer.</div></div>
      </BenchObject>
      <BenchObject id="slide.note" style={{position: 'absolute', left: 41, top: 524, opacity: bullets.note, color: '#b4752d', fontStyle: 'italic', fontWeight: 700, fontSize: 17}}>
        ← Both are passive: no energy from the cell.
      </BenchObject>
      <DiffusionDiagram frame={frame} />
      <OsmosisDiagram frame={frame} />
      <div style={{position: 'absolute', bottom: 34, left: 0, right: 0, textAlign: 'center', fontSize: 11, letterSpacing: 2.3, color: '#777a7b'}}>CORE IDEA</div>
      <div style={{position: 'absolute', right: 42, bottom: 34, fontSize: 10, letterSpacing: 2, color: '#777a7b'}}>0003 / 0010</div>
    </AbsoluteFill>
  );
};
