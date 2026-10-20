import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

const W=1920,H=1080;
const C={black:'#0b0b0d', cream:'#f0eee6', red:'#f04432', blue:'#302bff', lime:'#dfff3f'};
const mono='JetBrains Mono';
const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const smooth=(x:number)=>{const p=clamp(x);return p*p*(3-2*p)};
const easeOut=(x:number)=>1-Math.pow(1-clamp(x),3);
const easeInOut=(x:number)=>{const p=clamp(x);return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2};
const rad=(d:number)=>d*Math.PI/180;
const polar=(r:number,a:number)=>[Math.cos(a)*r,Math.sin(a)*r];
const hash=(i:number)=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const full:React.CSSProperties={position:'absolute',inset:0};
const svgText={fontFamily:mono,fontSize:14,letterSpacing:3};

function Grid(){return <svg width={W} height={H} style={full}><defs><pattern id="bgdots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="29" cy="29" r="1.6" fill={C.cream} opacity=".15"/></pattern></defs><rect width={W} height={H} fill="url(#bgdots)"/></svg>}

function Hud({f,dark}:{f:number,dark:boolean}){
 const color=dark?C.black:C.cream;
 const scene=f<213?'01 — MARK':f<338?'02 — TIMING':f<450?'03 — SHAPE':f<572?'04 — PATTERN':f<675?'05 — SPACE':f<786?'06 — TYPE':'07 — END';
 const alpha=easeOut(f/14);
 const bar=Math.min(8,1+Math.floor(f/112.5));
 const beat=Math.floor(f/28.125)%4;
 const tc=`00:00:${String(Math.floor(f/60)).padStart(2,'0')}:${String(f%60).padStart(2,'0')}`;
 return <svg data-bench-object="hud.chrome" width={W} height={H} style={full} fill={color}>
  <g opacity={alpha} style={svgText}>
   <text x="80" y="80" fontWeight="700">NOVARA</text><text x="186" y="80" opacity=".48">KINETIC REEL — 2026</text>
   <text x="1838" y="80" textAnchor="end" fontWeight="700">{scene}</text>
   <text x="80" y="1012" fontWeight="700">{tc}</text><text x="258" y="1012" opacity=".48">60 FPS</text>
   <text x="1584" y="1012" opacity=".48">128 BPM</text>
   <text x="1838" y="1012" textAnchor="end" fontWeight="700">BAR {bar}/8</text>
   {[0,1,2,3].map(i=><rect key={i} x={1682+i*17} y="1001" width="10" height="10" stroke={color} strokeWidth="1" fill={beat===i?color:'none'}/>)}
  </g>
  <g stroke={color} strokeWidth="2" fill="none" opacity={mix(.35,1,alpha)}><path d="M44 66V44H66 M1854 44H1876V66 M44 1014V1036H66 M1854 1036H1876V1014"/></g>
  <path d={`M44 1050H${44+1832*f/899}`} stroke={color} strokeWidth="2"/>
 </svg>
}

function Sun({radius=250,stroke=38,rotation=0,progress=1,joined=false,color=C.red}:{radius?:number,stroke?:number,rotation?:number,progress?:number,joined?:boolean,color?:string}){
 return <g transform={`rotate(${rotation})`} fill="none" stroke={color} strokeLinecap="round">
  {!joined&&<circle r={mix(0,43,progress)} strokeWidth={mix(0,28,progress)}/>}
  {Array.from({length:10},(_,i)=>{const a=rad(-90+i*36);const p=clamp(progress*1.35-i*.035);const inn=joined?0:mix(0,86,p);const out=mix(0,(i%2?radius:radius*.66),p);return <line key={i} x1={Math.cos(a)*inn} y1={Math.sin(a)*inn} x2={Math.cos(a)*out} y2={Math.sin(a)*out} strokeWidth={stroke}/>})}
 </g>
}

function Intro({f}:{f:number}){
 const t=f/60;
 const build=smooth((f-24)/18);
 const thick=smooth((f-53)/13);
 const exit=1-easeInOut((f-99)/10);
 const scale=f<53?1:exit;
 const rot=mix(0,19*Math.sin((f-55)*.04)*Math.exp(-Math.max(0,f-63)*.05),thick);
 const outer=f<60?mix(170,650,easeOut((f-26)/27)):mix(650,430,easeOut((f-60)/8));
 const ringFade=smooth((f-8)/6)*(1-smooth((f-97)/8));
 const visible=f<112;
 const label='NOVARA · KINETIC STUDIO · REEL 2026 · NOVARA · KINETIC STUDIO · REEL 2026 · ';
 return <AbsoluteFill>
  <Grid/>
  {visible&&<svg data-bench-object="intro.emblem" width={W} height={H} style={full}>
   <defs><path id="intro-type-circle" d="M0 -344 A344 344 0 1 1 -0.01 -344"/></defs>
   <g transform={`translate(960 540) scale(${scale})`}>
    <circle r={outer} stroke={f>60?C.red:C.cream} strokeWidth="1.3" fill="none" opacity={ringFade*(f>60?.65:.3)}/>
    {f<61&&<circle r={170+Math.max(0,f-26)*15} stroke={C.cream} strokeWidth="7" fill="none" opacity={.2*(1-smooth((f-27)/12))} style={{filter:'blur(5px)'}}/>}
    <g transform={`rotate(${(t-1)*15})`} opacity={smooth((f-59)/8)*(1-smooth((f-97)/7))}>
     <text fontFamily={mono} fontSize="23" fill={C.cream} letterSpacing="12" opacity=".57"><textPath href="#intro-type-circle">{label}</textPath></text>
    </g>
    {f<60?<g opacity={smooth((f-5)/9)}><circle r={mix(28,20,build)} fill={C.red}/><Sun radius={mix(0,250,build)} stroke={mix(1,5,thick)} rotation={0} progress={build}/></g>:<Sun radius={250} stroke={mix(5,38,thick)} rotation={rot} progress={1}/>}
   </g>
  </svg>}
 </AbsoluteFill>
}

function BrandIntro({f}:{f:number}){
 const local=f-113;
 const subtitle=easeOut((f-158)/15)*(1-smooth((f-201)/10));
 const collapse=clamp((f-193)/16);
 return <svg data-bench-object="intro.wordmark" width={W} height={H} style={full} fill={C.black}>
  <g opacity={easeOut(local/12)*(1-smooth((f-202)/12))}>
   <path d="M144 237H1776" stroke={C.black} strokeWidth="2"/>
   <g style={svgText}><text x="144" y="222">N° 01</text><text x="1776" y="222" textAnchor="end">KINETIC STUDIO — 2026</text></g>
  </g>
  <g>
   {'NOVARA'.split('').map((letter,i)=>{
    const entrance=easeOut((local-i*2)/13);
    const out=smooth((f-(194+i*2))/10);
    const x=144+i*272;
    const squash=1+Math.sin((f-135)*.12+i*1.3)*.08*Math.exp(-Math.max(0,f-164)/22);
    return out<.98?<text key={i} x={x} y={mix(740,630,entrance)} fontFamily="Archivo Black" fontSize="370" textLength={272} lengthAdjust="spacingAndGlyphs" style={{transformOrigin:`${x+136}px 520px`,transform:`scale(${mix(squash,.04,out)},${mix(entrance,.04,out)})`,filter:`blur(${Math.max(0,(1-entrance)*9)}px)`}}>{letter}</text>:null;
   })}
  </g>
  <text x="960" y="868" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="114" fill={C.cream} opacity={subtitle} style={{filter:`blur(${(1-subtitle)*15}px)`}}>kinetic studio</text>
 </svg>
}

const easingNames=['linear','sine in-out','expo out','back out','elastic','bounce'];
const rowColors=[C.black,C.blue,C.red,C.black,C.blue,C.red];
const easeFns=[
 (p:number)=>p,
 (p:number)=>(1-Math.cos(Math.PI*p))/2,
 (p:number)=>p===1?1:1-Math.pow(2,-10*p),
 (p:number)=>{const c=1.70158;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2)},
 (p:number)=>p===0||p===1?p:Math.pow(2,-10*p)*Math.sin((p*10-.75)*(2*Math.PI/3))+1,
 (p:number)=>{const n=7.5625,d=2.75;if(p<1/d)return n*p*p;if(p<2/d)return n*(p-=1.5/d)*p+.75;if(p<2.5/d)return n*(p-=2.25/d)*p+.9375;return n*(p-=2.625/d)*p+.984375}
];
function EasingScene({f}:{f:number}){
 const show=easeOut((f-212)/18);
 const disappear=1-smooth((f-317)/13);
 const p=clamp((f-252)/56.25);
 const depart=smooth((f-318)/18);
 return <AbsoluteFill>
  <svg data-bench-object="easing.heading" width={W} height={H} style={full} opacity={show*disappear}>
   <text x="150" y="214" fill={C.black} fontFamily="Instrument Serif" fontStyle="italic" fontSize="68">One distance, six timings.</text>
   <text x="1700" y="214" fill={C.black} style={svgText} opacity=".5" textAnchor="end">EQUAL TRAVEL · EQUAL TIME (0.94s)</text>
  </svg>
  <svg data-bench-object="easing.rows" width={W} height={H} style={full} opacity={show*disappear}>
   <text x="660" y="272" textAnchor="middle" fontFamily={mono} fontSize="14">A</text><text x="1700" y="272" textAnchor="middle" fontFamily={mono} fontSize="14">B</text>
   {easingNames.map((name,i)=>{
    const y=330+i*92;
    const path=Array.from({length:45},(_,j)=>{const v=j/44;return `${j===0?'M':'L'}${460+56*v} ${y+30-56*easeFns[i](v)}`}).join(' ');
    return <g key={i} opacity={easeOut((f-214-i*1.2)/12)}>
     <text x="150" y={y+5} fontFamily={mono} fontSize="12" fill={C.red}>{String(i+1).padStart(2,'0')}</text>
     <text x="194" y={y+9} fontFamily={mono} fontSize="22" fill={C.black}>{name}</text>
     <path d={`M460 ${y-30}V${y+30}H520`} fill="none" stroke={C.black} strokeWidth="1.2" opacity=".2"/>
     <path d={path} fill="none" stroke={C.black} strokeWidth="1.8"/>
     <circle cx="490" cy={y+30-56*easeFns[i](.535)} r="3.3" fill={rowColors[i]}/>
     <path d={`M660 ${y}H1700 M660 ${y-12}V${y+12} M1700 ${y-12}V${y+12}`} fill="none" stroke={C.black} strokeWidth="1.5" opacity=".22"/>
     {p>0&&Array.from({length:15},(_,j)=>{const k=j/14;return <path key={j} d={`M${660+1040*easeFns[i](k)} ${y-36}v10`} fill="none" stroke={rowColors[i]} opacity={.5*clamp(p*1.8)}/>})}
    </g>
   })}
  </svg>
  {f>=196&&<svg data-bench-object="easing.dots" width={W} height={H} style={full}>
   {easingNames.map((_,i)=>{
    const birth=smooth((f-(194+i*2))/10);
    if(birth<=0)return null;
    const arrange=easeInOut((f-207-i*1.3)/18);
    const target=660+1040*easeFns[i](p);
    const x0=144+i*272+136;
    let x=mix(x0,target,arrange),y=mix(540,330+i*92,arrange);
    if(depart>0){x=mix(x,960,depart)+Math.sin(depart*Math.PI)*(-180+i*70);y=mix(y,540,depart)-Math.sin(depart*Math.PI)*(80-i*20)}
    const prev=clamp(p-.015), speed=Math.abs(easeFns[i](p)-easeFns[i](prev));
    const stretch=p>0&&p<1?1+Math.min(1.5,speed*22):1;
    const r=mix(22,70,depart);
    return <g key={i} opacity={birth*(i===4?1:1-smooth((f-329)/8))}>
     {p>0&&p<1&&depart===0&&[1,2,3,4].map(j=><circle key={j} cx={660+1040*easeFns[i](clamp(p-j*.07))} cy={330+i*92} r="22" fill="none" stroke={rowColors[i]} strokeWidth="1.5" opacity={.13*(1-j/5)}/>)}
     <ellipse cx={x} cy={y} rx={r*stretch} ry={r/Math.sqrt(stretch)} fill={arrange>.5?rowColors[i]:C.black} transform={`rotate(${depart>0?-18*Math.sin(depart*Math.PI):0} ${x} ${y})`} style={{filter:p>0&&p<1&&i===1?'blur(1px)':undefined}}/>
    </g>
   })}
  </svg>}
 </AbsoluteFill>
}

function polygonRadius(a:number,n:number,r:number,rotation:number){
 const sector=2*Math.PI/n;
 const q=((a-rotation+sector/2)%sector+sector)%sector-sector/2;
 return r*Math.cos(Math.PI/n)/Math.cos(q);
}
function shapePoints(kind:number,rotation:number,r:number){
 const pts:number[][]=[];
 for(let i=0;i<120;i++){
  const a=i/120*Math.PI*2;
  let rr=r;
  if(kind===1)rr=polygonRadius(a,3,r,rotation);
  if(kind===2){const k=((a-rotation)/(Math.PI/5)%2+2)%2;rr=k<1?mix(r,r*.45,k):mix(r*.45,r,k-1)}
  if(kind===3)rr=polygonRadius(a,4,r,rotation);
  pts.push([rr*Math.cos(a),rr*Math.sin(a)]);
 }
 return pts;
}
function morphPoints(t:number,lag=0,radius=1){
 const k=t-lag;
 let from=0,to=0,p=0;
 if(k<.46){from=to=0}
 else if(k<.8){from=0;to=1;p=easeOut((k-.46)/.34)}
 else if(k<.96){from=to=1}
 else if(k<1.16){from=1;to=2;p=easeOut((k-.96)/.20)}
 else if(k<1.48){from=to=2}
 else {from=2;to=3;p=easeOut((k-1.48)/.22)}
 const rot=rad(-90+(k-.46)*190);
 const sizes=[185,280,250,255];
 const a=shapePoints(from,rot,sizes[from]*radius),b=shapePoints(to,rot,sizes[to]*radius);
 const enter=easeOut((t+.02)/.16);
 return a.map((v,i)=>`${mix(v[0],b[i][0],p)*enter},${mix(v[1],b[i][1],p)*enter}`).join(' ');
}
function MorphScene({f}:{f:number}){
 const t=(f-338)/60;
 const alpha=easeOut(t/.15);
 const title=t<.47?'ROUND → ROUND':t<.97?'ROUND → TRI':t<1.48?'TRI → STAR':'STAR → QUAD';
 return <svg width={W} height={H} style={full}>
  <g fill="none" stroke={C.cream} opacity={.14*alpha}><path d="M260 540H1660 M960 60V1020"/><circle cx="960" cy="540" r="400" strokeDasharray="2 12"/>
  {Array.from({length:36},(_,i)=>{const a=i*Math.PI/18;const p=polar(414,a),q=polar(425,a);return <line key={i} x1={960+p[0]} y1={540+p[1]} x2={960+q[0]} y2={540+q[1]}/>})}</g>
  <g style={svgText} fill={C.cream} opacity={alpha}>
   <text x="500" y="524" fontSize="11" opacity=".5">270°</text><text x="1400" y="524" fontSize="11" opacity=".5">90°</text>
   <text x="260" y="580"><tspan opacity=".5">SHAPE </tspan><tspan dx="12">{title}</tspan></text>
   <text x="1660" y="580" textAnchor="end">t {Math.max(0,t).toFixed(2)}　ROT {Math.max(0,t*135).toFixed(1)}°</text>
   <text x="1660" y="607" textAnchor="end" opacity=".5">STIFF 2.6　 DAMP 0.30</text>
  </g>
  <g data-bench-object="morph.shape" transform="translate(960 540)">
   {[7,6,5,4,3,2,1].map(j=><polygon key={j} points={morphPoints(t,j*.022,1+j*.015)} fill="none" stroke={C.red} strokeWidth="1.5" opacity={.12+(7-j)*.055}/>)}
   <polygon points={morphPoints(t)} fill={C.cream}/>
  </g>
  <g data-bench-object="morph.orbit">
   {Array.from({length:12},(_,i)=>{
    const e=easeOut((t-.12-i*.017)/.35);
    const a=rad(-100+i*30+t*45),r=330;
    const x=960+Math.cos(a)*r,y=540+Math.sin(a)*r;
    const smallT=t-i*.025;
    const k=smallT<.57?0:smallT<1.03?1:smallT<1.55?2:3;
    const s=15*e;
    let points=shapePoints(k,rad(t*200+i*35),k===0?s:k===1?s*1.6:s*1.5).map(v=>v.join(',')).join(' ');
    return <g key={i} transform={`translate(${x} ${y})`} opacity={e}>{k===0?<circle r={s} fill={C.cream}/>:<polygon points={points} fill={C.cream}/>}</g>
   })}
  </g>
 </svg>
}

function Tile({x,y,index,f}:{x:number,y:number,index:number,f:number}){
 const t=(f-450)/60;
 const orient=hash(index+7)>.5?1:0;
 const dist=Math.hypot(x+60-960,y+60-540);
 const reveal=easeOut((t-.06-dist/4400)/.13);
 const fronts=[(t-.44)*2050,(t-1.02)*2050,(t-1.59)*2050];
 const pos=x+(y-540)*.27;
 let color=C.cream,rotate=0;
 fronts.forEach((front,i)=>{if(front>pos){color=i%2===0?C.red:C.cream}if(Math.abs(front-pos)<105){color='#ffc1b5';rotate=90*smooth((front-pos+105)/210)}});
 const middle=Math.abs(x+60-960)<181&&Math.abs(y+60-540)<181;
 const solid=1-smooth((t-.09)/.13);
 return <g transform={`translate(${x+60} ${y+60}) scale(${reveal}) rotate(${orient*90+rotate})`} opacity={reveal}>
  {middle&&solid>0&&<rect x="-60" y="-60" width="120" height="120" fill={C.cream} stroke={C.black} strokeWidth="1" opacity={solid}/>}
  <path d="M0 -60 A60 60 0 0 1 -60 0 M60 0 A60 60 0 0 0 0 60" fill="none" stroke={color} strokeWidth="22" opacity={1-solid}/>
 </g>
}
function PatternScene({f}:{f:number}){
 const t=(f-450)/60;
 return <AbsoluteFill>
  <Grid/>
  <svg data-bench-object="pattern.tiles" width={W} height={H} style={full}>
   {Array.from({length:153},(_,i)=><Tile key={i} x={i%17*120-60} y={Math.floor(i/17)*120} index={i} f={f}/>)}
   {t<.2&&<rect x="780" y="360" width="360" height="360" fill={C.cream} opacity={1-smooth((t-.07)/.1)}/>}
   {t<.25&&<rect x="929" y="509" width="62" height="62" stroke={C.black} strokeWidth="4" fill="none" opacity={smooth(t/.1)*(1-smooth((t-.12)/.12))}/>}
   <g opacity={easeOut((t-.25)/.12)}><rect x="730" y="912" width="460" height="36" rx="3" fill={C.black}/><text x="960" y="935" fill={C.cream} textAnchor="middle" style={svgText}>TILES × 153　 ·　3 PULSES　 ·　SEED 07</text></g>
  </svg>
 </AbsoluteFill>
}

type V3=[number,number,number];
function rotate3(v:V3,rx:number,ry:number,rz:number):V3{
 let [x,y,z]=v;
 [y,z]=[y*Math.cos(rx)-z*Math.sin(rx),y*Math.sin(rx)+z*Math.cos(rx)];
 [x,z]=[x*Math.cos(ry)+z*Math.sin(ry),-x*Math.sin(ry)+z*Math.cos(ry)];
 [x,y]=[x*Math.cos(rz)-y*Math.sin(rz),x*Math.sin(rz)+y*Math.cos(rz)];
 return [x,y,z];
}
function DepthScene({f}:{f:number}){
 const t=(f-572)/60;
 const planeToSphere=easeInOut((t-.20)/.37);
 const sphereToRing=easeInOut((t-.86)/.24);
 const exit=easeInOut((t-1.40)/.20);
 const yaw=rad(Math.max(0,t-.30)*54);
 const points=Array.from({length:576},(_,i)=>{
  const row=Math.floor(i/24),col=i%24,u=col/23,v=row/23;
  const theta=u*Math.PI*2,phi=v*Math.PI;
  const plane:V3=[(u-.5)*1700,Math.sin(u*6+v*3)*30,(v-.5)*1700];
  const sp:V3=[Math.sin(phi)*Math.cos(theta)*340,Math.cos(phi)*340,Math.sin(phi)*Math.sin(theta)*340];
  const tor:V3=[(340+130*Math.cos(v*Math.PI*2))*Math.cos(theta),130*Math.sin(v*Math.PI*2),(340+130*Math.cos(v*Math.PI*2))*Math.sin(theta)];
  const st=clamp(planeToSphere*1.15-(u-.5)*.25);
  const sphere=rotate3(sp,rad(8),yaw,rad(-4));
  const ring=rotate3(tor,rad(mix(63,34,smooth((t-1.18)/.24))),yaw*.5,rad(mix(0,18,smooth((t-1.12)/.28))));
  const flat=rotate3(plane,rad(63),rad(-4),rad(-3));
  const xyz=flat.map((a,j)=>mix(mix(a,sphere[j],st),ring[j],sphereToRing)) as V3;
  const perspective=1400/(1400+xyz[2]);
  const size=1+exit*4;
  return {x:960+xyz[0]*perspective*size,y:540+xyz[1]*perspective*size,z:xyz[2],r:(2.5+perspective*.8)*(1-exit*.4),red:hash(i+43)>.91};
 });
 const motion=Math.max(0,1-Math.abs(t-.48)/.3)+Math.max(0,1-Math.abs(t-1.0)/.13)+exit;
 return <AbsoluteFill style={{background:C.black}}>
  <Grid/>
  <svg data-bench-object="depth.points" width={W} height={H} style={full}>
   <g opacity={1-smooth((t-1.53)/.06)}>
    {points.map((p,i)=>{
     const adjacent=[];
     if(i%24<23)adjacent.push(i+1);
     if(i<552)adjacent.push(i+24);
     return <g key={i}>
      {adjacent.map(j=><line key={j} x1={p.x} y1={p.y} x2={points[j].x} y2={points[j].y} stroke={C.cream} strokeWidth=".7" opacity={.13}/>) }
     </g>
    })}
    {[...points.entries()].sort((a,b)=>b[1].z-a[1].z).map(([i,p])=><g key={i} opacity={clamp(.8-p.z/1500,.35,1)}>
     {motion>.1&&<line x1={p.x} y1={p.y} x2={p.x-30*motion*(.5+(i%24)/24)} y2={p.y-12*motion} stroke={p.red?C.red:C.cream} strokeWidth="3" strokeLinecap="round"/>}
     <circle cx={p.x} cy={p.y} r={p.r} fill={p.red?C.red:C.cream}/>
    </g>)}
   </g>
   <text x="960" y="932" textAnchor="middle" fill={C.cream} style={svgText} opacity={smooth((t-.35)/.15)*(1-smooth((t-1.36)/.1))}>POINTS 576　 ·　 LENS 1400　 ·　 YAW {String(Math.round(Math.max(0,t-.3)*54)).padStart(3,'0')}.0°</text>
  </svg>
 </AbsoluteFill>
}

function TypeScene({f}:{f:number}){
 const t=(f-675)/60;
 let word='SNAP',bg=C.red,fg=C.black,font='Archivo Black',fontSize=450,y=695,width=1600,kind=0;
 if(t>=.24&&t<.48){word='IN';bg=C.black;fg=C.cream;fontSize=650;width=800;y=760;kind=1}
 else if(t>=.48&&t<.70){word='SNAP';bg=C.cream;fg=C.blue;font='Anton';fontSize=900;width=1660;y=942;kind=2}
 else if(t>=.70&&t<.94){word='BACK';bg=C.blue;fg=C.cream;font='Archivo';fontSize=510;width=1390;y=735;kind=3}
 else if(t>=.94&&t<1.406){word='STAY';bg=C.lime;fg=C.black;fontSize=430;width=1390;y=640;kind=4}
 else if(t>=1.406){word='FLUID';bg=C.black;fg=C.cream;font='Archivo';fontSize=340;width=1050;y=651;kind=5}
 const stageStart=[0,.24,.48,.70,.94,1.406][kind];
 const age=t-stageStart;
 const enter=easeOut(age/(kind===0?.06:.08));
 const dot=kind===1||kind===3||kind===5;
 const fluidOut=kind===5?easeInOut((t-1.70)/.12):0;
 return <AbsoluteFill style={{background:bg}}>
  <svg data-bench-object="type.word" width={W} height={H} style={full}>
   {(kind===1||kind===3)&&<text x={kind===1?150:1690} y="170" textAnchor={kind===1?'start':'end'} style={svgText} fill={fg} opacity=".72">{kind===1?'SPEED UP →':'← SETTLE'}</text>}
   {kind===4&&t>1.13?<g>
    {[-2,-1,0,1,2].map((row)=><text key={row} x={-800+((row*210+t*500)%700)} y={616+row*220} fontFamily="Archivo Black" fontSize="230" textLength="3250" lengthAdjust="spacingAndGlyphs" fill={row===0?C.black:'none'} stroke={C.black} strokeWidth={row===0?0:1.1} opacity={row===0?1:.4}>STAY STAY STAY STAY</text>)}
   </g>:<g transform={`translate(${kind===5?-fluidOut*650:0} ${kind===5?-fluidOut*180:0}) scale(${kind===5?1+fluidOut*1.4:1})`}>
    <text x={960-width/2+(1-enter)*(kind===1?1000:kind===3?-900:0)} y={y+(1-enter)*(kind===2?500:kind===4?200:0)} fontFamily={font} fontWeight={font==='Archivo'?800:400} fontSize={fontSize} textLength={width} lengthAdjust="spacingAndGlyphs" fill={fg} style={{filter:`blur(${(1-enter)*20}px)`}}>{word}</text>
    {dot&&<circle cx={960+width/2+20} cy={kind===5?668:y-28} r={kind===5?30:kind===1?60:51} fill={C.red} opacity={enter}/>}
   </g>}
   {kind===5&&<g>
    <path d="M240 205V875H1675" stroke={C.cream} strokeWidth="1.3" opacity=".28" strokeDasharray="2 6" fill="none"/>
    <path d="M240 875C410 734 435 723 580 708S740 681 760 672" stroke={C.cream} strokeWidth="2" opacity=".75" fill="none" strokeDasharray="600" strokeDashoffset={600*(1-enter)}/>
    <text x="1675" y="178" textAnchor="end" fill={fg} style={svgText}>f(t) = t + sin 4πt</text>
   </g>}
  </svg>
 </AbsoluteFill>
}

function Ending({f}:{f:number}){
 const t=(f-786)/60;
 const assemble=easeInOut((t-.40)/.35);
 const emblemX=mix(960,348,assemble),emblemY=mix(540,475,assemble);
 const size=mix(1,.52,assemble)*easeOut((t-.05)/.18);
 const label=easeOut((t-.54)/.26);
 const ringOpacity=(1-smooth((t-.18)/.22))*.6;
 return <AbsoluteFill style={{background:C.red}}>
  <svg width={W} height={H} style={full}>
   <g opacity={ringOpacity}><circle cx="960" cy="540" r={mix(280,1150,easeOut(t/.5))} fill="none" stroke={C.cream} strokeWidth="22" style={{filter:'blur(13px)'}}/></g>
   <g>
    {Array.from({length:80},(_,i)=>{
     const a=hash(i+23)*Math.PI*2,spd=110+hash(i+71)*620;
     const elapsed=Math.max(0,t-.13);
     const dist=spd*(1-Math.exp(-elapsed*2))*.65;
     const x=960+Math.cos(a)*dist+Math.sin(i)*elapsed*30;
     const y=540+Math.sin(a)*dist+elapsed*elapsed*75;
     const op=easeOut(elapsed/.1)*(1-smooth((t-.73)/1.25));
     const r=2+hash(i+12)*5;
     const color=i%4===0?C.black:i%4===1?C.cream:C.blue;
     return <g key={i} transform={`translate(${x} ${y}) rotate(${t*(i%2?100:-100)+i*50})`} opacity={op}>
      {i%5===0?<path d={`M0 ${-r*1.7}L${r*1.5} ${r}H${-r*1.5}Z`} fill={C.blue}/>:i%5===1?<rect x={-r/2} y={-r/2} width={r*1.4} height={r*1.4} fill={color}/>:<circle r={r} fill={i%5===2?'none':color} stroke={i%5===2?C.black:'none'} strokeWidth="1.5"/>}
     </g>
    })}
   </g>
   <g data-bench-object="ending.emblem" transform={`translate(${emblemX} ${emblemY}) scale(${size})`}>
    <Sun radius={200} stroke={44} rotation={mix(t*170,0,assemble)} progress={1} joined color={C.black}/>
    <circle r="13" fill={C.red}/>
   </g>
   <g data-bench-object="ending.wordmark" opacity={label} fill={C.black}>
    {'NOVARA'.split('').map((ch,i)=>{const a=easeOut((t-.53-i*.016)/.20);return <text key={i} x={518+i*192+(1-a)*440} y="545" fontFamily="Archivo Black" fontSize="220" textLength="192" lengthAdjust="spacingAndGlyphs" opacity={a} style={{filter:`blur(${(1-a)*10}px)`}}>{ch}</text>})}
    <text x="518" y="675" fontFamily="Instrument Serif" fontStyle="italic" fontSize="128" opacity={easeOut((t-.60)/.20)}>kinetic studio</text>
    <path d={`M518 727H${518+1152*easeOut((t-.68)/.26)}`} stroke={C.black} strokeWidth="2"/>
    <g fontFamily={mono} fontSize="18" letterSpacing="2" opacity={easeOut((t-.75)/.35)}>
     <text x="518" y="766">REEL 2026　 ·　 900 FRAMES　 ·　 DRAWN IN TYPESCRIPT</text>
     <circle cx="1278" cy="758" r="17" fill="none" stroke={C.black} strokeWidth="1.5"/><circle cx="1278" cy="758" r="6"/>
     <text x="1670" y="766" textAnchor="end" fontWeight="700">OPEN FOR COMMISSIONS</text>
    </g>
   </g>
  </svg>
 </AbsoluteFill>
}

export function Replica(){
 const f=useCurrentFrame();
 const redIntro=f>=113&&f<213;
 const easing=f>=207&&f<338;
 const morph=f>=338&&f<450;
 const pattern=f>=450&&f<592;
 const depth=f>=572&&f<675;
 const type=f>=675&&f<786;
 const ending=f>=786;
 const dark=(f>=119&&f<338)||(type&&((f<690)||(f>=704&&f<717)||(f>=731&&f<760)))||ending;
 return <AbsoluteFill style={{background:C.black,overflow:'hidden'}}>
  {f<119&&<Intro f={f}/>}
  {redIntro&&<AbsoluteFill style={{background:C.red,clipPath:f<125?`circle(${Math.max(0,f-113)*200}px at 50% 50%)`:undefined}}><BrandIntro f={f}/></AbsoluteFill>}
  {f>=110&&f<122&&<svg width={W} height={H} style={full}><circle cx="960" cy="540" r={Math.max(0,f-110)*150} stroke={C.cream} strokeWidth="180" fill="none" style={{filter:'blur(15px)'}} opacity={1-smooth((f-119)/3)}/></svg>}
  {easing&&<AbsoluteFill style={{background:C.cream,clipPath:f<216?`polygon(0 ${Math.max(0,100-(f-207)*23)}%,100% ${Math.max(0,65-(f-207)*23)}%,100% 100%,0 100%)`:undefined}}/>}
  {f>=196&&f<338&&<EasingScene f={f}/>}
  {morph&&<AbsoluteFill style={{background:C.blue}}><MorphScene f={f}/></AbsoluteFill>}
  {pattern&&<PatternScene f={f}/>}
  {depth&&<AbsoluteFill style={{clipPath:f<592?`inset(${Math.max(0,540-(f-572)*35)}px ${Math.max(0,960-(f-572)*60)}px)`:undefined}}><DepthScene f={f}/></AbsoluteFill>}
  {type&&<TypeScene f={f}/>}
  {ending&&<Ending f={f}/>}
  <Hud f={f} dark={dark}/>
 </AbsoluteFill>
}
