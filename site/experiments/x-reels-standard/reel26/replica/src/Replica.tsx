import React,{useEffect,useState} from 'react';
import {AbsoluteFill,continueRender,delayRender,useCurrentFrame} from 'remotion';

// The film is generated from editable SVG text, paths, polygons, and circles.
const C={ink:'#0b0b0b',paper:'#ece8dd',red:'#f43717',blue:'#2425eb',yellow:'#f9d52c',pink:'#f0a3cc'};
const TAU=Math.PI*2;
const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const ease=(t:number)=>1-Math.pow(1-clamp(t),3);
const range=(f:number,a:number,b:number)=>clamp((f-a)/(b-a));
const keys=(f:number,t:number[],v:number[])=>{if(f<=t[0])return v[0];for(let i=1;i<t.length;i++)if(f<=t[i])return mix(v[i-1],v[i],range(f,t[i-1],t[i]));return v[v.length-1]};
const spring=(f:number,start:number,duration=15)=>{const u=clamp((f-start)/duration);return u===1?1:1-Math.exp(-7*u)*Math.cos(10*u)};
const mono={fontFamily:'JBMono',fontWeight:700,letterSpacing:1.5};
const big={fontFamily:'Archivo',fontWeight:900};

function Chrome({f,index,dark}:{f:number,index:number,dark:boolean}){
 const names=['BOUNCE','VOICE','SHAPE','VOLUME','PATTERN','PATH','CONTROL','PULSE','END'];
 const pad=(n:number)=>String(n).padStart(2,'0');
 return <g data-bench-object="hud.chrome" fill={dark?C.paper:C.ink} fontSize={15} style={mono}>
  <text x={56} y={73}>{'KINETIC FORM — SKETCHBOOK'.slice(0,Math.min(27,Math.floor(f*2.2)+12))}</text>
  <text x={1864} y={73} textAnchor="end">VOL.09</text>
  <text x={56} y={1035}>{pad(index+1)}{'  '}{names[index]}</text>
  <text x={1864} y={1035} textAnchor="end">00:{pad(Math.floor(f/60))}:{pad(f%60)}</text>
 </g>;
}
function ballPoint(f:number){
 const x=300+7.05*f;let y:number;
 if(f<20)y=-220+966*Math.pow(f/20,2);
 else if(f<58){const d=f<36?(f-36)/16:(f-36)/22;y=330+416*d*d}
 else if(f<79){const d=f<68?(f-68)/10:(f-68)/11;y=548+198*d*d}
 else{const d=(f-85)/6;y=678+68*d*d}
 return{x,y};
}
function Bounce({f}:{f:number}){
 const p=ballPoint(f),v=ballPoint(f+.25).y-ballPoint(f-.25).y;
 const impact=Math.max(...[20,58,79].map(t=>Math.exp(-Math.pow((f-t)/2.2,2))));
 const sx=mix(.86,1.38,impact),sy=mix(1+Math.min(.3,Math.abs(v)*.013),.54,impact);
 const floor=Array.from({length:82},(_,i)=>{
  const x=150+i*20,y=800+[20,58,79].reduce((s,t)=>{const age=f-t;if(age<0||age>28)return s;const dx=x-ballPoint(t).x;return s+17*Math.exp(-age/7)*Math.sin(dx/37-age*.8)*Math.exp(-Math.pow(dx/220,2))},0);
  return `${i?'L':'M'}${x},${y}`;
 }).join(' ');
 return <>
  <g data-bench-object="bounce.trail">
   {Array.from({length:70},(_,i)=>{const age=(i+1)*1.4,q=ballPoint(f-age);if(f-age<0)return null;return <circle key={i} cx={q.x} cy={q.y} r={3.2} fill={C.paper} opacity={.36*Math.exp(-age/47)}/>})}
   {[20,58,79].map((t,k)=>{const u=range(f,t,t+13),a=f-t,x=ballPoint(t).x;if(a<0||a>13)return null;return <g key={k} stroke={C.paper} strokeWidth={2.5} opacity={(1-u)*.8}>
    {Array.from({length:12},(_,i)=>{const an=Math.PI+(i+1)*Math.PI/13,r=40+u*95;return <line key={i} x1={x+Math.cos(an)*r} y1={798+Math.sin(an)*r*.75} x2={x+Math.cos(an)*(r+28)} y2={798+Math.sin(an)*(r+28)*.75}/>})}
   </g>})}
  </g>
  <path data-bench-object="bounce.floor" d={floor} fill="none" stroke={C.paper} strokeWidth={3} strokeLinecap="round"/>
  <ellipse data-bench-object="bounce.ball" cx={p.x} cy={p.y} rx={54*sx} ry={54*sy} fill={C.red} filter={Math.abs(v)>8?'url(#slightBlur)':undefined}/>
 </>;
}
function Voice({f}:{f:number}){
 const zoom=1+1.5*Math.pow(range(f,75,90),2),p=ease(range(f,30,61)),x=mix(1850,0,p);
 return <g data-bench-object="type.words" transform={`translate(1660 880) scale(${zoom}) translate(-1660 -880)`} fill={C.ink} style={big} fontSize={520}>
  {['L','O','U','D'].map((l,i)=>{const v=spring(f,i*3,18);return <text key={l} x={[54,350,735,1100][i]} y={510} textLength={[274,335,310,302][i]} lengthAdjust="spacingAndGlyphs" transform={`translate(0 ${480*(1-v)}) scale(1 ${Math.max(.1,v)})`}>{l}</text>})}
  <text x={1440+mix(570,0,ease(range(f,14,32)))} y={510} fill={C.paper} textLength={420} lengthAdjust="spacingAndGlyphs">&amp;</text>
  <g transform={`translate(${x} 0)`} filter={p<.98?'url(#typeBlur)':undefined}><text x={54} y={940} textLength={1645} lengthAdjust="spacingAndGlyphs">CLEAR</text></g>
  <ellipse cx={1825} cy={897} rx={42*ease(range(f,55,68))} ry={42*ease(range(f,55,68))} fill={C.paper}/>
 </g>;
}
const shapeNames=['ROUND','BLOCK','DELTA','CROSS','SPARK / 10','BLOOM / 6','HEX'];
function radial(kind:number,a:number):number{
 const co=Math.abs(Math.cos(a)),si=Math.abs(Math.sin(a));
 if(kind===0)return 280;
 if(kind===1)return 260/Math.max(co,si);
 if(kind===2){const sector=((a+Math.PI/2+Math.PI/3)%(TAU/3)+TAU/3)%(TAU/3)-Math.PI/3;return 305*.5/Math.cos(sector)}
 if(kind===3)return Math.max(Math.min(290/(co||.0001),98/(si||.0001)),Math.min(98/(co||.0001),290/(si||.0001)));
 if(kind===4){const n=((a+Math.PI/2)/TAU*20+1000)%20,k=Math.floor(n),p=n-k;return mix(k%2?208:305,k%2?305:208,p)}
 if(kind===5)return 240+52*Math.cos(a*6+Math.PI);
 const sector=((a+Math.PI/6)%(TAU/6)+TAU/6)%(TAU/6)-Math.PI/6;return 280*Math.cos(Math.PI/6)/Math.cos(sector);
}
function morphPath(f:number,lag=0){
 const local=Math.max(0,f-lag),n=Math.min(6,Math.floor(local/12)),p=ease(range(local,n*12,n*12+6)),prev=Math.max(0,n-1);
 return Array.from({length:180},(_,i)=>{const a=TAU*i/180-Math.PI/2,r=mix(radial(prev,a),radial(n,a),p);return `${i?'L':'M'}${Math.cos(a)*r},${Math.sin(a)*r}`}).join(' ')+' Z';
}
function Shapes({f}:{f:number}){
 const n=Math.min(6,Math.floor(f/12)),enter=spring(f,0,12),exit=range(f,78,87),scale=enter*(1+exit*1.2),rot=Math.sin(f*.8)*4*Math.exp(-(f%12)/3);
 return <>
  <g data-bench-object="shapes.guides" opacity={1-ease(range(f,76,83))}>
   <g stroke="#b9b5ad" strokeWidth={2} opacity={.65}>{Array.from({length:15},(_,x)=>Array.from({length:9},(_,y)=><path key={`${x}-${y}`} d={`M${120+x*120-7} ${60+y*120}h14 M${120+x*120} ${60+y*120-7}v14`}/ >))}</g>
   <g transform={`translate(960 540) scale(${enter})`} fill="none" stroke="#58584e" strokeWidth={1.5}>
    <rect x={-316} y={-316} width={632} height={632}/>
    {[-1,0,1].flatMap(x=>[-1,0,1].map(y=>x===0&&y===0?null:<rect key={`${x}-${y}`} x={316*x-5.5} y={316*y-5.5} width={11} height={11} fill={C.paper}/>))}
    <g fill={C.ink} stroke="none" fontSize={15} style={mono}><text x={-316} y={-335}>FIG.{n+1} {shapeNames[n]}</text><text x={316} y={344} textAnchor="end">W {n===3?'610':'560'}  H {n===3?'610':'560'}  R {n*90}°</text></g>
   </g>
  </g>
  <g data-bench-object="shapes.stack" transform={`translate(960 540) scale(${scale}) rotate(${rot})`} filter={exit>.2?'url(#slightBlur)':undefined}>
   <path d={morphPath(f,5)} transform="translate(0 20) rotate(7)" fill={C.yellow}/><path d={morphPath(f,2)} transform="translate(17 7)" fill={C.blue}/><path d={morphPath(f)} fill={C.red}/>
   <g fill={C.ink} opacity={n===3?.9:.25}>{Array.from({length:12},(_,i)=>{const a=i*TAU/12,r=radial(n,a);return <rect key={i} x={Math.cos(a)*r-3} y={Math.sin(a)*r-3} width={6} height={6}/>})}</g>
  </g>
 </>;
}

type V3=[number,number,number];
function rotate(v:V3,ax:number,ay:number,az=0):V3{
 let[x,y,z]=v;const xx=x*Math.cos(ay)+z*Math.sin(ay),zz=-x*Math.sin(ay)+z*Math.cos(ay);x=xx;z=zz;
 const yy=y*Math.cos(ax)-z*Math.sin(ax),zzz=y*Math.sin(ax)+z*Math.cos(ax);y=yy;z=zzz;
 return[x*Math.cos(az)-y*Math.sin(az),x*Math.sin(az)+y*Math.cos(az),z];
}
const faces:{normal:V3,verts:V3[],color:string}[]=[
 {normal:[0,1,0],verts:[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]],color:C.paper},
 {normal:[0,-1,0],verts:[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]],color:C.paper},
 {normal:[-1,0,0],verts:[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],color:C.red},
 {normal:[1,0,0],verts:[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]],color:C.yellow},
 {normal:[0,0,1],verts:[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],color:C.pink},
 {normal:[0,0,-1],verts:[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]],color:C.yellow}
];
function Cube({f}:{f:number}){
 const opening=ease(range(f,0,12)),gap=14*ease(range(f,21,28)),pitch=.47*opening,yaw=.79*opening,explode=ease(range(f,71,91));
 const top=keys(f,[0,25,35,45,56,68],[0,0,Math.PI/2,0,0,Math.PI/2]),low=keys(f,[0,25,35,90],[0,0,Math.PI/2,Math.PI/2]);
 const polygons:{key:string,points:string,depth:number,color:string}[]=[];
 [-1,1].forEach((x,xi)=>[-1,1].forEach((y,yi)=>[-1,1].forEach((z,zi)=>{
  const angle=y>0?top:low,center:V3=[x*(118+explode*430),y*(118+explode*350),z*(118+explode*430)];
  const group=(v:V3)=>rotate(rotate(v,explode*(xi?1.2:-1.1),angle,explode*(zi?1:-.7)),pitch,yaw+explode*.8);
  for(let fi=0;fi<faces.length;fi++){
   const face=faces[fi],normal=group(face.normal);if(normal[2]<=.01)continue;
   const vv=face.verts.map(v=>{const s=(236-gap)/2;return group([v[0]*s+center[0],v[1]*s+center[1],v[2]*s+center[2]])});
   const outer=face.normal[0]!==0?face.normal[0]===x:face.normal[1]!==0?face.normal[1]===y:face.normal[2]===z;
   polygons.push({key:`${xi}-${yi}-${zi}-${fi}`,points:vv.map(v=>`${960+v[0]},${540-v[1]+explode*explode*130}`).join(' '),depth:vv.reduce((s,v)=>s+v[2],0)/4,color:outer?face.color:C.ink});
  }
 })));
 polygons.sort((a,b)=>a.depth-b.depth);
 return <g data-bench-object="cube.blocks">{polygons.map(p=><polygon key={p.key} points={p.points} fill={p.color} stroke={p.color} strokeWidth={1.3}/>)}</g>;
}
function Halftone({f}:{f:number}){
 const radius=keys(f,[0,13,30,88],[100,280,330,350]),cy=500+22*Math.sin(f*.06),cx=960+35*Math.sin(f*.035);
 return <g data-bench-object="halftone.field">{Array.from({length:41},(_,ix)=>Array.from({length:23},(_,iy)=>{
  const x=ix*48,y=12+iy*48,dx=x-cx,dy=y-cy,a=Math.atan2(dy,dx),d=Math.hypot(dx,dy),strength=Math.exp(-Math.pow((d-radius-9*Math.sin(a*3+f*.05))/100,4)),wave=Math.sin(d*.013-f*.07+a*1.7);
  return <circle key={`${ix}-${iy}`} cx={x} cy={y} r={2.3+20.7*strength} fill={strength>.04?C.paper:wave>.7?C.red:'#969696'} opacity={strength>.04?1:wave>.7?.73:.9}/>;
 }))}</g>;
}
function StripePath({d,widths,colors,from,to}:{d:string,widths:number[],colors:string[],from:number,to:number}){
 const len=Math.max(0,to-from);if(len<=.0001)return null;
 return <g fill="none" strokeLinecap="round" strokeLinejoin="round">{widths.map((w,i)=><path key={i} d={d} pathLength={1} stroke={colors[i]} strokeWidth={w} strokeDasharray={`${len} 2`} strokeDashoffset={-from}/>)}</g>;
}
function Tubes({f}:{f:number}){
 const pink='M -180 860 C 180 840 490 725 750 525 C 980 340 1120 225 1360 265 C 1690 325 1740 670 1470 817 C 1240 940 1010 858 1007 730 C 1000 535 1160 370 1370 293 C 1540 227 1780 164 2070 112';
 const blue='M 320 1250 C 295 1000 320 770 500 663 C 698 548 842 835 1085 895 C 1300 950 1490 878 1555 679 C 1610 499 1575 251 1708 -160';
 const yellow='M 2100 690 C 1750 620 1455 425 1120 390 C 834 360 641 177 432 186 C 165 194 73 355 130 563 C 205 823 466 896 630 1230';
 const thin='M -170 385 C 308 473 616 875 1005 900 C 1320 925 1613 737 2070 555';
 return <g data-bench-object="tubes.paths">
  <StripePath d={pink} widths={[144,105,36]} colors={[C.red,C.pink,C.paper]} from={ease(range(f,37,73))} to={ease(range(f,-1,25))}/>
  <StripePath d={yellow} widths={[128,96,70]} colors={[C.yellow,C.ink,C.yellow]} from={ease(range(f,62,90))} to={ease(range(f,27,59))}/>
  <StripePath d={blue} widths={[130,80,30]} colors={[C.blue,C.paper,C.blue]} from={ease(range(f,52,78))} to={ease(range(f,12,41))}/>
  <StripePath d={thin} widths={[60,28]} colors={[C.pink,C.red]} from={ease(range(f,78,99))} to={ease(range(f,52,78))}/>
  {f>83&&<circle cx={340} cy={820} r={2400*Math.pow(range(f,83,96),2)} fill={C.paper} filter="url(#slightBlur)"/>}
 </g>;
}
function Pointer({x,y,scale=1}:{x:number,y:number,scale?:number}){
 return <path d="M0 0 L0 81 L22 62 L37 92 L51 85 L37 56 L63 54 Z" transform={`translate(${x} ${y}) scale(${scale})`} fill={C.ink} stroke={C.paper} strokeWidth={5} strokeLinejoin="round"/>;
}
function Dashboard({f}:{f:number}){
 const p=ease(range(f,0,13)),percent=Math.round(100*ease(range(f,2,29))),heights=[80,150,110,190,165,230,220,280,260,330];
 return <g transform={`translate(960 540) scale(${p}) translate(-960 -540)`}>
  <rect x={56} y={120} width={584} height={412} rx={48} fill={C.ink}/><rect x={656} y={120} width={1208} height={412} rx={48} fill={C.red}/>
  <rect x={56} y={552} width={1188} height={436} rx={48} fill={C.blue}/><rect x={1264} y={552} width={600} height={436} rx={48} fill={C.pink}/>
  <g fontSize={14} style={mono}>
   <text x={104} y={181} fill={C.paper}>SNAP MODE</text><text x={590} y={181} fill={C.red} textAnchor="end">ON</text>
   <text x={704} y={181}>EXPORT</text><text x={1816} y={181} textAnchor="end">{percent===100?'READY':'BUSY_'}</text>
   <text x={110} y={613} fill={C.paper}>FRAMES / DAY</text><text x={1190} y={613} fill={C.paper} textAnchor="end">+235%</text>
   <text x={1317} y={613}>CURVE</text><text x={1816} y={613} textAnchor="end">0.22, 1.00, 0.36, 1.00</text>
  </g>
  <rect x={164} y={272} width={368} height={164} rx={82} fill={C.red}/><circle cx={450} cy={354} r={65} fill={C.paper}/>
  <text x={735} y={449} fontSize={316} fill={C.paper} style={big} textLength={710} lengthAdjust="spacingAndGlyphs">{percent}</text><text x={1462} y={450} fontSize={166} style={big}>%</text>
  <path d="M704 490H1816" stroke={C.ink} strokeWidth={5}/><line x1={110} y1={928} x2={1190} y2={928} stroke={C.paper} strokeOpacity={.3} strokeWidth={2}/>
  {heights.map((h,i)=>{const grow=ease(range(f,9+i*1.3,27+i*1.3));return <rect key={i} x={110+i*113} y={928-h*grow} width={63} height={h*grow} rx={13} fill={i===9?C.yellow:C.paper}/>})}
  <path d="M146 801 L250 741 L362 777 L474 701 L586 734 L699 660 L812 687 L924 600 L1035 630 L1150 550" fill="none" stroke={C.pink} strokeWidth={4} pathLength={1} strokeDasharray={`${ease(range(f,10,37))} 2`}/>
  <g stroke={C.ink} strokeWidth={1} opacity={.08}>
   {Array.from({length:5},(_,i)=><line key={'x'+i} x1={1320+i*120} y1={660} x2={1320+i*120} y2={930}/>)}
   {Array.from({length:4},(_,i)=><line key={'y'+i} x1={1320} y1={660+i*90} x2={1810} y2={660+i*90}/>)}
  </g>
  <path d="M1320 928 C1430 605 1490 654 1810 657" fill="none" stroke={C.ink} strokeWidth={5} pathLength={1} strokeDasharray={`${ease(range(f,16,37))} 2`}/>
  <path d="M1320 928L1428 657M1810 657H1490" fill="none" stroke={C.ink} strokeWidth={1.5}/>
  {[{x:1428,y:657},{x:1490,y:657}].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={9} fill={C.pink} stroke={C.ink} strokeWidth={1.5}/>)}
  <circle cx={1320} cy={928} r={6} fill={C.ink}/><circle cx={1810} cy={657} r={6} fill={C.ink}/>
  <circle cx={mix(1320,1740,ease(range(f,18,39)))} cy={mix(920,660,ease(range(f,18,39)))} r={12} fill={C.red}/>
 </g>;
}
function Controls({f}:{f:number}){
 const dashboard=ease(range(f,45,56)),enter=spring(f,0,13),on=ease(range(f,24,30));
 return <g data-bench-object="ui.widgets">
  {dashboard<1&&<g opacity={1-dashboard} transform={`translate(960 540) scale(${enter*(1-.6*dashboard)}) translate(-960 -540)`}>
   {f>26&&<circle cx={840} cy={565} r={200+20*range(f,26,45)} fill="none" stroke="#c7c4bb" strokeWidth={3} opacity={1-range(f,36,48)}/>}
   {f>26&&Array.from({length:20},(_,i)=>{const a=-Math.PI*.61+i*Math.PI*1.22/19,r=260;return <line key={i} x1={1140+Math.cos(a)*r} y1={540+Math.sin(a)*r} x2={1140+Math.cos(a)*(r+17)} y2={540+Math.sin(a)*(r+17)} stroke="#8a8980" strokeWidth={3.5} strokeLinecap="round" opacity={1-range(f,40,47)}/>})}
   <rect x={630} y={390} width={660} height={300} rx={150} fill={on>.45?C.red:C.ink}/><circle cx={mix(780,1140,on)} cy={540} r={122} fill={C.paper}/>
   <Pointer x={keys(f,[0,14,23,30,44],[1100,875,850,845,845])} y={keys(f,[0,14,23,30,44],[900,620,580,575,650])}/>
  </g>}
  {f>=45&&<Dashboard f={f-45}/>}
 </g>;
}

function pulseVariant(f:number){if(f<11)return 0;if(f<22)return 1;if(f<33)return 2;if(f<43)return 3;if(f<53)return 4;if(f<61)return 5;if(f<70)return 6;return 7}
const pulseBackgrounds=[C.paper,C.yellow,C.pink,C.red,C.blue,C.ink,C.blue,C.paper];
function Pulse({f}:{f:number}){
 const n=pulseVariant(f);
 return <g data-bench-object="pulse.shapes">
  {n===0&&<g transform={`translate(960 540) scale(${1+.04*Math.sin(f*.5)})`}>
   {Array.from({length:10},(_,i)=><circle key={i} r={170+i*137} fill="none" stroke={C.ink} strokeWidth={27}/>)}<circle r={120} fill={C.red}/>
  </g>}
  {n===1&&<g transform={`translate(960 540) rotate(${(f-11)*2})`}>
   {Array.from({length:32},(_,i)=>{const a=i*TAU/32,r=405+(i%4)*75,pts=[[-.025,145],[0,r],[.025,145]].map(([offset,rr])=>`${Math.cos(a+offset)*rr},${Math.sin(a+offset)*rr}`).join(' ');return <polygon key={i} points={pts} fill={C.ink}/>})}
   <circle r={150} fill={C.ink}/><circle r={136} fill={C.paper}/><circle r={120} fill={C.red}/>
  </g>}
  {n===2&&<g transform={`translate(960 540) rotate(${(f-22)*2-8})`}>
   {Array.from({length:8},(_,i)=><ellipse key={i} cx={0} cy={-235} rx={118} ry={365} fill={C.paper} stroke={C.ink} strokeWidth={6} transform={`rotate(${i*45})`}/>)}
   <circle r={195} fill={C.blue}/><circle r={112} fill={C.ink}/><circle cx={43} cy={-44} r={22} fill={C.paper}/>
  </g>}
  {n===3&&<g>
   {Array.from({length:12},(_,x)=>Array.from({length:7},(_,y)=>{const dx=x*192-960,dy=y*192+60-540,r=Math.max(3,72*(1-Math.hypot(dx,dy)/1250))*(.95+.22*Math.sin(x+y+(f-33)*.6));return <circle key={`${x}-${y}`} cx={x*192} cy={y*192+60} r={r} fill={C.ink}/>}))}<circle cx={960} cy={540} r={120} fill={C.paper}/>
  </g>}
  {n===4&&<g transform="translate(960 540) rotate(-18)">
   <ellipse rx={760} ry={260} fill="none" stroke={C.paper} strokeWidth={2}/><ellipse rx={450} ry={160} fill="none" stroke={C.paper} strokeWidth={3}/><circle r={120} fill={C.paper}/>
   {[0,1].map(i=>{const a=(f-43)*.18+i*2.8,rx=i?760:450,ry=i?260:160;return <ellipse key={i} cx={Math.cos(a)*rx} cy={Math.sin(a)*ry} rx={48} ry={22} fill={i?C.yellow:C.pink} filter="url(#slightBlur)"/>})}
  </g>}
  {n===5&&<g transform={`translate(960 540) rotate(${(f-53)*12})`}>
   <circle r={480} fill="#202024"/>{Array.from({length:45},(_,i)=><circle key={i} r={140+i*7.3} fill="none" stroke="#4b4b50" strokeWidth={1} opacity={.5}/>)}
   <path d="M0 0 L-430 -215 A480 480 0 0 1 -160 -453 Z" fill="url(#recordShine)"/><path d="M0 0 L430 215 A480 480 0 0 1 160 453 Z" fill="url(#recordShine)"/>
   {Array.from({length:72},(_,i)=><line key={i} x1={462*Math.cos(i*TAU/72)} y1={462*Math.sin(i*TAU/72)} x2={476*Math.cos(i*TAU/72)} y2={476*Math.sin(i*TAU/72)} stroke="#73737a" strokeWidth={1.5}/>)}
   <circle r={120} fill={C.red}/><circle r={8} fill={C.paper}/><path d="M65 18l22 7" stroke={C.ink} strokeWidth={4}/>
  </g>}
  {n===6&&<g>
   {Array.from({length:85},(_,i)=>{const y=40+(i*83)%1020,x=((i*277-(f-61)*80)%2300+2300)%2300-200;return <rect key={i} x={x} y={y} width={80+(i%6)*54} height={i%3?3:5} fill={[C.paper,C.pink,C.yellow][i%3]} opacity={.75} filter="url(#slightBlur)"/>})}<ellipse cx={960} cy={540} rx={180} ry={88} fill={C.paper}/>
  </g>}
  {n===7&&<><text x={560} y={664} fontSize={350} textLength={260} lengthAdjust="spacingAndGlyphs" style={big}>D</text><circle cx={960} cy={540} r={120} fill={C.red}/></>}
 </g>;
}
function Ending({f}:{f:number}){
 const reveal=ease(range(f,10,34)),form=ease(range(f,22,44)),ix=ease(range(f,40,60)),footer=ease(range(f,65,93));
 const dotX=keys(f,[0,10,23,34,45,55,66,90],[960,960,1200,1700,1630,1700,1832,1832]);
 const dotY=keys(f,[0,10,23,34,45,55,66,90],[540,540,430,320,520,760,768,768]);
 const dotR=keys(f,[0,12,24,50,66],[120,120,58,45,34]);
 return <>
  <g data-bench-object="ending.title">
   {f<18&&<text x={560} y={664} fontSize={350} textLength={260} lengthAdjust="spacingAndGlyphs" style={big} opacity={1-range(f,9,18)}>D</text>}
   {f<30&&<circle cx={960} cy={540} r={170+f*32} fill="none" stroke="#d1cec3" strokeWidth={18} opacity={1-range(f,12,30)}/>}
   <g style={big} fill={C.ink}>
    <g clipPath="url(#endKineticReveal)" transform={`translate(0 ${80*(1-reveal)})`}><text x={56} y={460} fontSize={400} textLength={1800} lengthAdjust="spacingAndGlyphs">KINETIC</text></g>
    <g clipPath="url(#endFormReveal)" transform={`translate(0 ${120*(1-form)})`}><text x={56} y={802} fontSize={400} textLength={1150} lengthAdjust="spacingAndGlyphs">FORM</text></g>
    <text x={1300} y={804+160*(1-ix)} fontSize={430} textLength={452} lengthAdjust="spacingAndGlyphs" fontFamily="ISerif" fontWeight={400} fontStyle="italic" fill={C.red} opacity={ix}>IX</text>
   </g>
   <g opacity={footer}>
    <line x1={44} y1={870} x2={44+1832*footer} y2={870} stroke={C.ink} strokeWidth={2.5}/>
    <g fill={C.ink} fontSize={15} style={mono}><text x={44} y={912}>SHAPE — TIMING — COLOUR</text><text x={960} y={912} textAnchor="middle">NINE STUDIES / 900 FRAMES</text><text x={1876} y={912} textAnchor="end">MADE ONE FRAME AT A TIME</text></g>
   </g>
  </g>
  <circle data-bench-object="ending.dot" cx={dotX} cy={dotY} r={dotR} fill={C.red} filter={f>13&&f<64?'url(#slightBlur)':undefined}/>
  <defs><clipPath id="endKineticReveal"><rect x={0} y={0} width={1920*reveal} height={520}/></clipPath><clipPath id="endFormReveal"><rect x={0} y={480} width={1280*form} height={390}/></clipPath></defs>
 </>;
}
export function Replica(){
 const[fontHandle]=useState(()=>delayRender('Load provided typefaces'));
 useEffect(()=>{Promise.all([document.fonts.load('900 400px Archivo'),document.fonts.load('italic 400 430px ISerif'),document.fonts.load('700 15px JBMono')]).then(()=>continueRender(fontHandle))},[fontHandle]);
 const f=useCurrentFrame(),starts=[0,89,179,265,357,443,539,630,709];
 let index=0;for(let i=0;i<starts.length;i++)if(f>=starts[i])index=i;
 const local=f-starts[index],pv=pulseVariant(local);
 let bg=[C.ink,C.red,C.paper,C.blue,C.ink,C.ink,C.paper,C.paper,C.paper][index];
 if(index===3&&local>83)bg=C.ink;if(index===7)bg=pulseBackgrounds[pv];
 const dark=index===0||index===3||index===4||index===5||(index===7&&(pv===4||pv===5||pv===6));
 return <AbsoluteFill style={{background:bg}}><svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{display:'block'}}>
  <defs>
   <filter id="slightBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>
   <filter id="typeBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={`${15*(1-ease(range(local,49,63)))} 1`}/></filter>
   <linearGradient id="recordShine"><stop offset="0" stopColor="#161619" stopOpacity="0"/><stop offset="1" stopColor="#77777a" stopOpacity=".4"/></linearGradient>
  </defs>
  {index===0&&<Bounce f={local}/>}{index===1&&<Voice f={local}/>}{index===2&&<Shapes f={local}/>}{index===3&&<Cube f={local}/>}
  {index===4&&<Halftone f={local}/>}{index===5&&<Tubes f={local}/>}{index===6&&<Controls f={local}/>}{index===7&&<Pulse f={local}/>}{index===8&&<Ending f={local}/>}
  <Chrome f={f} index={index} dark={dark}/>
 </svg></AbsoluteFill>;
}
