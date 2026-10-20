import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {W,H,sceneAt,drawSurface,drawDetails,drawSky,grain,clamp} from './drawing';

function PaintedCanvas({id,draw}:{id:string;draw:(g:CanvasRenderingContext2D)=>void}) {
 const ref=useRef<HTMLCanvasElement>(null);
 useLayoutEffect(()=>{const g=ref.current!.getContext('2d')!;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.clearRect(0,0,W,H);draw(g);});
 return <canvas ref={ref} width={W} height={H} data-bench-object={id} style={{position:'absolute',inset:0,width:W,height:H}}/>;
}
export function Replica(){
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;const scene=sceneAt(t);const ending=t>=15.96;
 const word=t<10.68?'Wonder':t<12.48?'lives at':'the edge';const wordId=t<10.68?'word.wonder':t<12.48?'word.lives':'word.edge';
 const textSize=72+(t-8.72)*18.1;const dark=scene===30||scene===31||scene===33||scene===34;
 const endingProgress=clamp((t-18.7)/1.26);const horizon=1250-730*endingProgress*endingProgress;
 const brandY=534-Math.pow(clamp((t-18.25)/1.45),2)*370;
 const brandOpacity=1-clamp((t-19.4)/.3);
 return <AbsoluteFill style={{background:'#0b1216',overflow:'hidden'}}>
 {ending?<>
  <PaintedCanvas id="ending.horizon" draw={g=>{drawSky(g,horizon);grain(g,frame,.035);}}/>
  {t<17.28?<svg width={W} height={H} style={{position:'absolute'}}><text data-bench-object="ending.now" x="960" y="535" textAnchor="middle" fontFamily="Newsreader" fontSize="96" fill="#f4f1e9">Now in view</text></svg>:
  <svg width={W} height={H} style={{position:'absolute',opacity:brandOpacity}}><g data-bench-object="ending.brand" transform={`translate(960 ${brandY})`} fill="#f5f3ed">
   <path d="M-250,-6 A34,34 0 0 1 -182,-6 Z"/><rect x="-259" y="2" width="86" height="7" rx="3.5"/>
   <text x="-148" y="0" fontFamily="Newsreader" fontWeight="500" fontSize="102">Meridian</text>
  </g></svg>}
 </>:<>
  <PaintedCanvas id="surface.horizon" draw={g=>drawSurface(g,scene,t)}/>
  <PaintedCanvas id="surface.details" draw={g=>{drawDetails(g,scene,t);grain(g,frame,.035);}}/>
  {t>=8.72&&<svg width={W} height={H} style={{position:'absolute'}}><text data-bench-object={wordId} x="960" y="507" textAnchor="middle" fontFamily="Newsreader" fontWeight="400" fontSize={textSize} fill={dark?'#080604':scene===19||scene===20?'#dcb69a':'#f7f4e8'} transform={`rotate(${-Math.sin((t-8.72)*.4)*1.2} 960 510)`}>{word}</text></svg>}
 </>}
 </AbsoluteFill>;
}
