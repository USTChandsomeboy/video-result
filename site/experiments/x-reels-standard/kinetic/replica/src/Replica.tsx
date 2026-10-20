import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

// All geometry is generated from editable text, SVG primitives and DOM transforms.
const PAPER = '#ece9e0';
const INK = '#111111';
const ORANGE = '#ff4f18';
const WHITE = '#fcfcfc';
const clamp = (x:number, a=0, b=1) => Math.min(b, Math.max(a, x));
const mix = (a:number,b:number,p:number) => a+(b-a)*p;
const out = (x:number) => 1-Math.pow(1-clamp(x),3);
const smooth = (x:number) => {const p=clamp(x); return p*p*(3-2*p);};
function key(t:number, keys:number[][]):number {
  if(t<=keys[0][0])return keys[0][1];
  for(let i=1;i<keys.length;i++) if(t<=keys[i][0]) {
    return mix(keys[i-1][1],keys[i][1],(t-keys[i-1][0])/(keys[i][0]-keys[i-1][0]));
  }
  return keys[keys.length-1][1];
}
const full:React.CSSProperties={position:'absolute',inset:0,width:1920,height:1080};
const textStyle:React.CSSProperties={fontFamily:'Inter, sans-serif'};
function Svg({children,style}:{children:React.ReactNode,style?:React.CSSProperties}) {
  return <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{...full,...textStyle,...style}}>{children}</svg>;
}
function Dot({id,x,y,r,rx,ry,trailX=0,trailY=0}:{id:string,x:number,y:number,r:number,rx?:number,ry?:number,trailX?:number,trailY?:number}) {
  return <g data-bench-object={id}>
    {(Math.abs(trailX)+Math.abs(trailY)>1) && [5,4,3,2,1].map(i=><ellipse key={i} cx={x-trailX*i} cy={y-trailY*i} rx={rx??r} ry={ry??r} fill={ORANGE} opacity={(6-i)*.025}/>) }
    <ellipse cx={x} cy={y} rx={rx??r} ry={ry??r} fill={ORANGE}/>
  </g>;
}
function Opening({t}:{t:number}) {
  const zoomProgress=out((t-.5)/.36);
  const zoom=mix(2.4,1,zoomProgress);
  const cameraX=mix(1656,960,zoomProgress);
  const expand=out((t-1.43)/.97);
  const font=mix(176,410,expand);
  const ex=mix(802,312,expand);
  const baseline=mix(603,840,expand);
  const tracking=mix(-2,-4,expand);
  const fall=clamp((t-1.02)/.54);
  const slide=-2000*out((t-3.33)/.25);
  const sx=960-cameraX*zoom;
  const sy=540-540*zoom;
  let dx=ex+font*1.91+tracking*3;
  let dy=baseline-font*.68;
  let dr=font*.102;
  let rx=dr,ry=dr;
  if(t>=2.22) {
    dx=key(t,[[2.22,1084],[2.82,1230],[3.32,1540],[3.4,1710]]);
    if(t<2.82) {
      const p=clamp((t-2.22)/.6);dy=553-225*4*p*(1-p);
      rx=42*(1+.14*Math.cos(p*Math.PI*2));ry=42*(1-.13*Math.cos(p*Math.PI*2));
    } else {
      const p=clamp((t-2.82)/.5);dy=553-145*4*p*(1-p);
      rx=42*(1+.16*Math.cos(p*Math.PI*2));ry=42*(1-.16*Math.cos(p*Math.PI*2));
    }
  }
  const glyphs=[['L',232],['i',333],['n',379],['e',484],['a',587],['r',690]] as const;
  return <AbsoluteFill style={{backgroundColor:PAPER}}>
    <Svg>
      <g transform={`translate(${sx+slide} ${sy}) scale(${zoom})`}>
        <g data-bench-object="opening.label" fill={INK} fontWeight={800}>
          {t<1.68 && glyphs.map(([c,x],i)=>{
            const p=clamp((t-1.02-(5-i)*.014)/.54);
            const yy=603 + Math.pow(p,1.65)*[900,750,600,475,390,330][i];
            const xx=x-p*[145,100,65,35,12,0][i];
            const rot=-p*[88,72,55,39,25,12][i];
            return <text key={i} x={0} y={0} fontSize={176} letterSpacing={-2} transform={`translate(${xx} ${yy}) rotate(${rot})`}>{c}</text>;
          })}
          <text x={ex} y={baseline} fontSize={font} letterSpacing={tracking} style={{filter:t>3.33?`blur(${out((t-3.33)/.15)*10}px)`:'none'}}>Easıng</text>
        </g>
        {t<1.7 && <g data-bench-object="opening.toggle" transform={`translate(${1496+fall*135} ${444+Math.pow(fall,2)*670}) rotate(${fall*28} 160 96)`}>
          <rect width={320} height={192} rx={96} fill={t<.48?ORANGE:(t<.65?'#d6bba9':'#ccc4b4')}/>
          <circle cx={mix(224,96,smooth((t-.48)/.17))} cy={96} r={77} fill={WHITE}/>
        </g>}
        {t<3.4 && <Dot id="opening.dot" x={dx} y={dy} r={dr} rx={rx} ry={ry} trailX={t>3.33?8:0} trailY={t>2.22?(dy-553)*-.013:0}/>}
      </g>
      {t>.03 && t<.88 && (()=>{
        const x=key(t,[[.03,1150],[.1,1120],[.2,1102],[.45,1102],[.5,1088],[.6,1525],[.7,1775],[.88,1990]]);
        const y=key(t,[[.03,1100],[.1,705],[.2,594],[.45,594],[.5,647],[.6,737],[.7,735],[.88,860]]);
        const sc=mix(1,.43,zoomProgress);
        return <g data-bench-object="opening.cursor" transform={`translate(${x} ${y}) scale(${sc})`}>
          <path d="M0 0 L0 170 L42 132 L77 205 L113 188 L77 117 L133 113 Z" fill={INK} stroke={WHITE} strokeWidth={10} strokeLinejoin="round"/>
        </g>;
      })()}
    </Svg>
  </AbsoluteFill>;
}
function response(u:number) {return 1-Math.exp(-9*u)*(Math.cos(18.5*u)+9/18.5*Math.sin(18.5*u));}
function Graph({t}:{t:number}) {
  const p=clamp((t-3.817)/1.25);
  const cx=370+1230*p,cy=752-380*response(p);
  const scale=key(t,[[5,1],[5.1,2.1],[5.2,4.7],[5.3,5.3],[5.4,5.8],[5.5,6.1],[5.65,6.34]]);
  const screenX=key(t,[[5,1532],[5.1,1664],[5.2,1598],[5.3,1296],[5.4,1092],[5.5,1004],[5.65,960]]);
  const screenY=key(t,[[5,372],[5.1,340],[5.2,362],[5.3,440],[5.4,500],[5.5,525],[5.65,540]]);
  const entering=(1-out((t-3.4)/.3))*1800;
  const tr=t<5?`translate(${entering} 0)`:`translate(${screenX} ${screenY}) scale(${scale}) translate(${-cx} ${-cy})`;
  const points=Array.from({length:301},(_,i)=>{const u=p*i/300;return `${370+1230*u},${752-380*response(u)}`;}).join(' ');
  const labelOpacity=out((t-4.16)/.18);
  let dotX=cx,dotY=cy;
  if(t<3.817){dotX=key(t,[[3.4,600],[3.5,100],[3.6,115],[3.7,230],[3.8,365],[3.817,370]]);dotY=key(t,[[3.4,520],[3.5,555],[3.6,600],[3.7,685],[3.8,749],[3.817,752]]);}
  return <AbsoluteFill style={{backgroundColor:PAPER}}><Svg>
    <g transform={tr}>
      <g data-bench-object="graph.axes" fill="none" style={{filter:t<3.66?`blur(${(1-out((t-3.4)/.27))*6}px)`:'none'}}>
        <path d="M370 200 V752 H1600" stroke={INK} strokeWidth={4}/>
        <path d="M370 372 H1590" stroke="#9f9e96" strokeWidth={3} strokeDasharray="22 13"/>
      </g>
      <g data-bench-object="graph.curve" fill={INK}>
        {p>0 && <polyline points={points} stroke={INK} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round"/>}
        {Array.from({length:38},(_,i)=>i/37).filter(u=>u<=p).map((u,i)=><circle key={i} cx={370+1230*u} cy={752-380*response(u)} r={6.5}/>)}
      </g>
      <g data-bench-object="graph.label" opacity={labelOpacity} transform={`translate(0 ${(1-labelOpacity)*55})`}>
        <path d="M596 281 L645 258" stroke={INK} strokeWidth={4}/>
        <text x={662} y={260} fontSize={112} fontWeight={800} letterSpacing={-3} fill={INK}>↑22%</text>
      </g>
      {t>=3.817 && <Dot id="graph.dot" x={cx} y={cy} r={42}/>}
    </g>
    {t<3.817 && <Dot id="graph.dot" x={dotX} y={dotY} r={42} rx={t<3.65?49:42} ry={t<3.65?34:42} trailX={t<3.65?-28:-10} trailY={t>3.65? -8:0}/>}
  </Svg></AbsoluteFill>;
}
function Morph({t}:{t:number}) {
  const square=out((t-6.14)/.2);
  const capsule=out((t-6.59)/.31);
  const contract=clamp((t-7.05)/.35);
  let width=mix(520,560,square),height=mix(520,560,square),radius=mix(260,100,square),rot=45*square;
  if(t>=6.59){width=mix(520,1100,capsule);height=mix(520,340,capsule);radius=mix(100,170,capsule);rot=45*(1-capsule);}
  if(t>=7.05){
    width=key(t,[[7.05,1100],[7.1,660],[7.17,230],[7.22,130],[7.3,82],[7.4,104],[7.5,112]]);
    height=key(t,[[7.05,340],[7.1,230],[7.17,130],[7.22,115],[7.3,100],[7.4,108],[7.5,112]]);
    radius=height/2;rot=0;
  }
  const bg=t<6.1?INK:t<6.59?ORANGE:t<7.05?PAPER:INK;
  const color=t>=6.1&&t<6.59?INK:ORANGE;
  return <AbsoluteFill style={{backgroundColor:bg}}><Svg>
    <g data-bench-object="morph.shape">
      {t>=6.14&&t<6.59&&<circle cx={960} cy={540} r={275} fill="none" stroke={INK} strokeWidth={2} opacity={.18}/>}
      {t>=6.59&&t<7.05&&<rect x={700} y={280} width={520} height={520} rx={100} fill="none" stroke={ORANGE} strokeWidth={2} opacity={.28*(1-capsule*.6)} transform="rotate(45 960 540)"/>}
      {t>=7.05&&<rect x={960-mix(620,790,contract)} y={540-mix(195,235,contract)} width={mix(1240,1580,contract)} height={mix(390,470,contract)} rx={mix(195,235,contract)} fill="none" stroke={ORANGE} strokeWidth={2} opacity={mix(.55,.02,contract)}/>}
      <rect x={960-width/2} y={540-height/2} width={width} height={height} rx={radius} fill={color} transform={`rotate(${rot} 960 540)`} style={{filter:t>7.05&&t<7.21?'blur(9px)':'none'}}/>
    </g>
  </Svg></AbsoluteFill>;
}
const ringText='PULSE · ECHO · ORBIT · DRIFT · TWEEN · ARCS · BLUR · ';
const units:Record<string,number>={P:.66,U:.74,L:.58,S:.66,E:.63,C:.73,H:.75,O:.77,R:.7,B:.69,I:.28,T:.65,D:.75,F:.6,W:1,N:.75,A:.73,' ':.29,'·':.31};
const ringChars=Array.from(ringText);
const totalUnits=ringChars.reduce((v,c)=>v+(units[c]??.7),0);
function Orbit({t}:{t:number}) {
  const elapsed=Math.max(0,t-7.5);
  const grow=1-Math.exp(-4.2*elapsed);
  const radius=70+680*grow;
  const ringFont=170*radius/750;
  const phase=key(t,[[7.5,-345],[7.6,-260],[7.8,-155],[8,-114],[9.4,-184]]);
  const dotY=key(t,[[7.5,540],[8.9,540],[9,567],[9.1,640],[9.2,780],[9.3,950],[9.4,1200]]);
  let advance=0;
  return <AbsoluteFill style={{backgroundColor:INK}}>
    <div data-bench-object="orbit.text" style={{...full,perspective:4500,perspectiveOrigin:'960px 600px'}}>
      <div style={{position:'absolute',left:960,top:600,transformStyle:'preserve-3d',transform:'rotateX(-18deg)'}}>
        {ringChars.map((c,i)=>{
          const w=units[c]??.7;const angle=(advance+w/2)/totalUnits*360+phase;advance+=w;
          const front=Math.cos(angle*Math.PI/180);
          const color=front>0?PAPER:'#606060';
          return <div key={i} style={{position:'absolute',left:0,top:0,transformStyle:'preserve-3d',transform:`rotateY(${angle}deg) translateZ(${radius}px)`}}>
            <span style={{position:'absolute',display:'block',fontFamily:'Inter',fontWeight:700,fontSize:ringFont,lineHeight:1,color,whiteSpace:'pre',transform:'translate(-50%, -50%)',backfaceVisibility:'visible',letterSpacing:-2}}>{c}</span>
          </div>;
        })}
      </div>
    </div>
    <Svg><Dot id="orbit.dot" x={960} y={dotY} r={56} rx={56} ry={t>9.15?67:56}/></Svg>
  </AbsoluteFill>;
}
function Halftone({t}:{t:number}) {
  const wave=Math.max(0,t-9.82)*1450;
  const fillWave=Math.max(0,t-10.38)*2700;
  const r=key(t,[[9.38,150],[9.45,118],[9.5,90],[9.6,60],[9.7,45],[9.8,32],[11.25,32]]);
  return <AbsoluteFill style={{backgroundColor:PAPER}}><Svg>
    <g data-bench-object="halftone.grid" fill={INK}>
      {Array.from({length:23},(_,j)=>Array.from({length:39},(_,i)=>{
        const x=42+(i-1)*54,y=(j-1)*54;const dist=Math.hypot(x-960,y-540);
        const ripple=t>9.82?10.5*Math.exp(-Math.pow((dist-wave)/72,2)/2):0;
        const fill=clamp((fillWave-dist)/210)*38;
        return <circle key={`${i}-${j}`} cx={x} cy={y} r={5+ripple+fill}/>;
      }))}
    </g>
    <Dot id="halftone.dot" x={960} y={540} r={r}/>
  </Svg></AbsoluteFill>;
}
function Ending({t}:{t:number}) {
  const label=out((t-11.24)/.47);
  const headline=out((t-11.42)/.43);
  const equation=1-Math.exp(-10*Math.max(0,t-12.32));
  const removeEq=out((t-13.3)/.23);
  const collapse=out((t-13.48)/.14);
  const dx=mix(key(t,[[11,960],[11.25,960],[11.4,1115],[11.5,1320],[11.6,1540],[11.7,1675],[11.82,1758]]),960,collapse);
  const dy=mix(key(t,[[11,540],[11.25,540],[11.4,380],[11.5,398],[11.6,445],[11.7,510],[11.82,522]]),540,collapse);
  const r=mix(key(t,[[11,32],[11.3,32],[11.5,22],[11.8,18]]),32,collapse);
  return <AbsoluteFill style={{backgroundColor:INK}}><Svg>
    <defs>
      <clipPath id="label-mask"><rect x={0} y={250} width={1920} height={125}/></clipPath>
      <clipPath id="headline-mask"><rect x={0} y={365} width={1920} height={245}/></clipPath>
      <clipPath id="equation-mask"><rect x={0} y={620} width={1920} height={340}/></clipPath>
    </defs>
    <g opacity={1-collapse} transform={`translate(${collapse*-90} ${collapse*-45}) scale(${1-collapse*.1})`}>
      <g data-bench-object="ending.label" clipPath="url(#label-mask)"><text x={150} y={340+125*(1-label)} fill="#a3a3a3" fontSize={96} fontWeight={600} letterSpacing={-2}>Kinetic Study 07</text></g>
      <g data-bench-object="ending.headline" clipPath="url(#headline-mask)"><text x={150} y={540+245*(1-headline)} fill={PAPER} fontSize={216} fontWeight={700} letterSpacing={-4.5}>Physics in code</text></g>
      <g data-bench-object="ending.equation" clipPath="url(#equation-mask)">
        <text x={144} y={788+430*(1-equation)+340*removeEq} fontSize={216} fontWeight={700} letterSpacing={-4}><tspan fill={ORANGE}>1</tspan><tspan fill={PAPER}> equation</tspan></text>
      </g>
    </g>
    <Dot id="ending.dot" x={dx} y={dy} r={r}/>
  </Svg></AbsoluteFill>;
}
function Scene({t}:{t:number}) {
  if(t<3.4)return <Opening t={t}/>;
  if(t<5.65)return <Graph t={t}/>;
  if(t<7.5)return <Morph t={t}/>;
  if(t<9.38)return <Orbit t={t}/>;
  if(t<11.05)return <Halftone t={t}/>;
  return <Ending t={t}/>;
}
export function Replica() {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  const rewind=t>=13.62;
  const displayTime=rewind?key(t,[[13.62,11],[14.5,2.2],[14.85,.25],[15,0]]):t;
  return <AbsoluteFill style={{overflow:'hidden',backgroundColor:INK,...textStyle}}>
    {rewind?<div data-bench-object="rewind.scene" style={full}><Scene t={displayTime}/></div>:<Scene t={displayTime}/>}
  </AbsoluteFill>;
}
