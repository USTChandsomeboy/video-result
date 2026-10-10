import React, {CSSProperties} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const W=1280, H=720;
// The benchmark object contract is encoded on the four public scene containers below.

const BenchObject=({id,children,style}:{id:string;children:React.ReactNode;style?:CSSProperties})=><div data-bench-object={id} style={style}>{children}</div>;
const clamp=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
const out=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});

const ImageFit=({src,style}:{src:string;style?:CSSProperties})=><Img src={staticFile(src)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',...style}}/>;

function LightTrail({frame}:{frame:number}){
  // A warm meteor-like stroke travels from the lower middle of the canvas to the upper right.
  const p=clamp(frame,85,470);
  const x=310+610*p, y=525-330*p;
  const visible=out(frame,80,135)*(1-out(frame,490,560));
  const trailOpacity=visible*.88;
  return <BenchObject id="light.trail" style={{position:'absolute',inset:0,pointerEvents:'none',opacity:visible}}>
    <svg width={W} height={H} style={{position:'absolute',inset:0,overflow:'visible'}}>
      <defs><filter id="glow"><feGaussianBlur stdDeviation="7"/></filter><linearGradient id="trailg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#fff6b1" stopOpacity="0"/><stop offset=".62" stopColor="#fff5bf" stopOpacity=".7"/><stop offset="1" stopColor="#fff" stopOpacity="1"/></linearGradient></defs>
      <path d={`M ${x-220} ${y+108} Q ${x-85} ${y+70} ${x} ${y}`} stroke="#fff4ab" strokeWidth="14" opacity={trailOpacity*.5} filter="url(#glow)" fill="none" strokeLinecap="round"/>
      <path d={`M ${x-205} ${y+101} Q ${x-72} ${y+56} ${x} ${y}`} stroke="url(#trailg)" strokeWidth="3" opacity={trailOpacity} fill="none" strokeLinecap="round"/>
      <circle cx={x} cy={y} r={10} fill="#fff" opacity={trailOpacity}/><circle cx={x} cy={y} r={4} fill="#fffced" opacity={trailOpacity}/>
    </svg>
  </BenchObject>;
}

function WindowSequence({frame}:{frame:number}){
  const enter=clamp(frame,260,390);
  const scale=interpolate(frame,[260,570],[1.17,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
  const opacity=out(frame,215,285)*(1-out(frame,645,750));
  return <BenchObject id="window.foreground" style={{position:'absolute',inset:0,opacity,transform:`scale(${scale})`,transformOrigin:'center'}}>
    <ImageFit src="artworks/starry-window.png" />
  </BenchObject>;
}

function Painting({frame}:{frame:number}){
  const inWindow=frame<670;
  const transition=clamp(frame,620,760);
  const info=clamp(frame,890,1040);
  const x=interpolate(transition,[0,1],[0,235]);
  const y=interpolate(transition,[0,1],[0,54]);
  const width=interpolate(transition,[0,1],[W,760]);
  const height=interpolate(transition,[0,1],[H,570]);
  const finalX=interpolate(info,[0,1],[235,524]);
  const finalY=interpolate(info,[0,1],[54,53]);
  const finalW=interpolate(info,[0,1],[760,690]);
  const finalH=interpolate(info,[0,1],[570,575]);
  const px=inWindow?0:frame<890?x:finalX;
  const py=inWindow?0:frame<890?y:finalY;
  const pw=inWindow?W:frame<890?width:finalW;
  const ph=inWindow?H:frame<890?height:finalH;
  const op=inWindow?0:out(frame,635,735);
  return <BenchObject id="painting.main" style={{position:'absolute',left:px,top:py,width:pw,height:ph,opacity:op,overflow:'hidden'}}>
    <ImageFit src="artworks/starry-night.webp" style={{objectFit:'cover'}} />
  </BenchObject>;
}

function InformationPanel({frame}:{frame:number}){
  const a=clamp(frame,900,1045);
  const row=(label:string, value:string)=><div style={{display:'flex',gap:22,marginTop:12,fontSize:14,lineHeight:1.25}}><span style={{color:'#c6b56c',fontWeight:700,width:40}}>{label}</span><span style={{color:'#ece9df'}}>{value}</span></div>;
  return <BenchObject id="information.panel" style={{position:'absolute',left:72,top:73,width:395,opacity:a,transform:`translateX(${(1-a)*-26}px)`,fontFamily:'Starry Serif, Georgia, serif',color:'#f5f1e6'}}>
    <div style={{fontSize:12,letterSpacing:3,color:'#eee7cd',fontWeight:700}}>— FROM A SPARK, INTO A PAINTING</div>
    <div style={{fontSize:51,lineHeight:1.1,marginTop:25,fontWeight:700,letterSpacing:2}}>星月夜</div>
    <div style={{fontSize:25,fontStyle:'italic',marginTop:4}}>The Starry Night</div>
    <div style={{height:1,background:'#7d8590',opacity:.65,margin:'23px 0 15px'}} />
    <div style={{fontSize:17,fontWeight:700}}>文森特·梵高 <span style={{fontSize:13,fontWeight:400,marginLeft:12}}>Vincent van Gogh</span></div>
    <div style={{fontSize:15,lineHeight:1.85,marginTop:22,color:'#e3e2dc'}}>《星月夜》创作于 1889 年 6 月。梵高在法国圣雷米<br/>疗养期间，将窗外景色与记忆、想象相融。<br/>起伏的柏树、宁静的村庄与翻涌的天空，共同构成这<br/>幅夜景。</div>
    <div style={{height:1,background:'#7d8590',opacity:.65,margin:'25px 0 14px'}} />
    {row('材质','布面油画')}{row('尺寸','73.7 × 92.1 cm')}{row('馆藏','美国纽约现代艺术博物馆 MoMA')}
  </BenchObject>;
}

export const Replica:React.FC=()=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{background:'#071724',overflow:'hidden'}}>
    <style>{`@font-face{font-family:"Starry Serif";src:url(${staticFile('fonts/starry-serif.woff2')}) format('woff2');font-weight:100 900;}`}</style>
    <Painting frame={frame}/>
    <WindowSequence frame={frame}/>
    <LightTrail frame={frame}/>
    <InformationPanel frame={frame}/>
    <div style={{position:'absolute',right:52,top:38,color:'#f2efdf',fontFamily:'Starry Serif, Georgia, serif',fontSize:12,letterSpacing:3,opacity:out(frame,920,1020)}}>VINCENT VAN GOGH　/　1889</div>
    <div style={{position:'absolute',left:73,bottom:32,color:'#e9e3ca',fontFamily:'Starry Serif, Georgia, serif',fontSize:11,letterSpacing:2,opacity:out(frame,930,1050)}}>A JOURNEY THROUGH THE STARRY NIGHT</div>
    <div style={{position:'absolute',right:52,bottom:32,color:'#e9e3ca',fontFamily:'Starry Serif, Georgia, serif',fontSize:11,letterSpacing:2,opacity:out(frame,930,1050)}}>星夜的视觉艺术之旅 · 美国 MoMA</div>
  </AbsoluteFill>;
};
