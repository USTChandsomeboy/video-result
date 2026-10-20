import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Every graphic is generated here from editable paths, text, and deterministic points.
const W=1920,H=1080;
const orange='#ff5106';
const mono='"Geist Mono", monospace';
const sans='"Onest", sans-serif';
const inter='"Inter", sans-serif';
const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const range=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
const out=(v:number,n=4)=>1-Math.pow(1-clamp(v),n);
const smooth=(v:number)=>{const p=clamp(v);return p*p*(3-2*p)};
const pop=(v:number)=>{const p=clamp(v);return 1+2.70158*Math.pow(p-1,3)+1.70158*Math.pow(p-1,2)};
const rand=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const number=(n:number)=>Math.round(Math.max(0,n)).toLocaleString('en-US');

function Logo({size=100,color='currentColor',style={}}:{size?:number;color?:string;style?:React.CSSProperties}){
 return <svg width={size} height={size} viewBox="0 0 100 100" style={{display:'block',...style}} aria-label="pulso mark">
   <path fill={color} d="M72 8 A46 46 0 1 1 19 14 L33 29 A27 27 0 1 0 64 27 Z"/>
   <circle cx="62" cy="36" r="11.5" fill={color}/>
 </svg>
}
function Grid({light=false,opacity=1}:{light?:boolean;opacity?:number}){
 return <AbsoluteFill style={{opacity,backgroundImage:`linear-gradient(${light?'#11111106':'#ffffff04'} 1px,transparent 1px),linear-gradient(90deg,${light?'#11111106':'#ffffff04'} 1px,transparent 1px)`,backgroundSize:'96px 96px',backgroundPosition:'0px 60px',maskImage:'radial-gradient(ellipse at center,black 12%,transparent 78%)'}}/>;
}
function RollingCount({value,size=150,width=840,color='#fff',pad=true}:{value:number;size?:number;width?:number;color?:string;pad?:boolean}){
 const rounded=Math.floor(value);
 const formatted=number(rounded);
 const str=pad?String(rounded).padStart(7,'0').replace(/\B(?=(\d{3})+(?!\d))/g,','):formatted;
 const cols=str.split('');
 const cw=size*.59;
 return <div style={{width,height:size*1.16,display:'flex',justifyContent:'center',fontFamily:mono,fontSize:size,fontWeight:400,letterSpacing:-size*.075,color,lineHeight:1.08,fontVariantNumeric:'tabular-nums'}}>
  {cols.map((s,i)=>{
   if(s===',')return <span key={i} style={{width:cw*.55,marginRight:3}}>,</span>;
   const digit=Number(s);
   const places=cols.slice(i+1).filter(c=>c!==',').length;
   const unit=Math.pow(10,places);
   const fraction=clamp((value%unit)/unit-.72,0,.28)/.28;
   const rolling=places<3?fraction:0;
   const leading=pad&&i===0&&value<1000000;
   return <span key={i} style={{display:'block',width:cw,height:size*1.12,overflow:'hidden',color:leading?'#333':color}}><span style={{display:'block',transform:`translateY(${-rolling*size*1.1}px)`}}><span style={{height:size*1.1,display:'block'}}>{digit}</span><span style={{height:size*1.1,display:'block'}}>{(digit+1)%10}</span></span></span>
  })}
 </div>
}

const url='https://store.example.net/collections/fall-2026/limited-run?source=newsletter&medium=email&campaign=fall_drop&content=hero_banner&variant=b&ref=partner_9134';
function LongURL({t}:{t:number}){
 const count=Math.round(url.length*out(range(t,.2,.94),1.55));
 const text=url.slice(0,count);
 const endWidth=Math.max(0,count*28.8);
 const crumple=range(t,1.32,1.48);
 const opacity=1-range(t,1.34,1.49);
 return <div data-bench-object="launch.url" style={{position:'absolute',inset:0,opacity,transform:`scaleX(${mix(1,.38,out(crumple))}) scaleY(${mix(1,.025,out(crumple))})`,filter:`blur(${range(t,.94,1.3)*1.2}px)`}}>
  <div style={{position:'absolute',top:379,width:'100%',textAlign:'center',fontFamily:mono,fontSize:25,letterSpacing:9,color:'#767676',opacity:out(range(t,.13,.3))}}>RAW LINK <span style={{color:orange}}>· {count} CHARS</span></div>
  <div style={{position:'absolute',left:80,top:489,width:1520,height:76,overflow:'hidden',maskImage:'linear-gradient(to right,transparent,#000 7%,#000 98%,transparent)'}}>
   <div style={{position:'absolute',left:Math.min(160,1490-endWidth),top:0,whiteSpace:'nowrap',fontFamily:mono,fontSize:46,lineHeight:'66px',letterSpacing:-.5,color:'#bababa'}}>{text}<span style={{display:'inline-block',verticalAlign:'middle',height:56,width:4,background:orange,boxShadow:`0 0 16px ${orange}`,marginLeft:3}}/></div>
  </div>
 </div>
}

// A low resolution geographic model, projected into a rotating dotted sphere.
const landPolygons:number[][][]=[
 [[-168,70],[-145,72],[-132,62],[-115,56],[-95,51],[-80,48],[-55,53],[-60,40],[-80,24],[-88,15],[-102,18],[-114,30],[-125,49],[-155,57]],
 [[-81,12],[-65,9],[-48,-1],[-35,-9],[-43,-24],[-55,-37],[-67,-55],[-75,-49],[-76,-22],[-81,-5]],
 [[-20,36],[6,37],[28,31],[42,12],[50,9],[42,-12],[31,-32],[17,-35],[10,-21],[0,2],[-15,13]],
 [[-10,36],[-9,56],[7,60],[23,70],[40,65],[42,48],[28,39],[17,36]],
 [[30,70],[70,76],[112,72],[150,62],[178,55],[160,45],[144,40],[132,20],[114,4],[103,0],[89,22],[76,8],[67,25],[50,30],[35,44]],
 [[112,-12],[130,-11],[143,-17],[154,-29],[146,-39],[123,-34],[112,-23]],
 [[-52,60],[-43,59],[-23,74],[-38,83],[-60,80]],
 [[45,-13],[50,-15],[48,-26],[44,-23]],
 [[129,31],[142,45],[145,36],[136,30]],
];
function inside(x:number,y:number,poly:number[][]){let b=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],c=poly[j];if(((a[1]>y)!==(c[1]>y))&&x<(c[0]-a[0])*(y-a[1])/(c[1]-a[1])+a[0])b=!b;}return b;}
const earthPoints:{lat:number;lon:number;r:number}[]=[];
for(let lat=-60;lat<82;lat+=3.1){for(let lon=-180;lon<180;lon+=3.1/Math.max(.4,Math.cos(lat*Math.PI/180))){if(landPolygons.some(p=>inside(lon,lat,p)))earthPoints.push({lat:lat*Math.PI/180,lon:lon*Math.PI/180,r:rand(earthPoints.length+23)})}}
const stars=Array.from({length:160},(_,i)=>({x:rand(i+37)*1920,y:rand(i+489)*1080,r:mix(1.2,5,rand(i+903)),o:mix(.14,.72,rand(i+153))}));
function Planet({t}:{t:number}){
 const rise=out(range(t,2.02,2.85),3);
 const cy=mix(1850,1260,rise)-range(t,2.85,4.5)*30;
 const R=790;
 const rot=(t-2)*.105+.12;
 const tilt=.22;
 return <svg data-bench-object="launch.planet" width={W} height={H} style={{position:'absolute',inset:0,overflow:'visible',opacity:out(range(t,2,2.3))}}>
  <defs><radialGradient id="earthFill" cx="50%" cy="8%" r="80%"><stop offset="0" stopColor="#0b0502"/><stop offset=".38" stopColor="#020202"/><stop offset="1" stopColor="#000"/></radialGradient><filter id="earthGlow"><feGaussianBlur stdDeviation="21"/></filter></defs>
  <circle cx="960" cy={cy} r={R} fill="none" stroke={orange} strokeWidth="12" opacity=".24" filter="url(#earthGlow)"/>
  <circle cx="960" cy={cy} r={R} fill="url(#earthFill)" stroke="#421700" strokeWidth="2"/>
  {earthPoints.map((p,i)=>{
    const lon=p.lon+rot;
    const x=Math.cos(p.lat)*Math.sin(lon),z=Math.cos(p.lat)*Math.cos(lon),yy=-Math.sin(p.lat);
    const y=yy*Math.cos(tilt)+z*Math.sin(tilt),depth=z*Math.cos(tilt)-yy*Math.sin(tilt);
    if(depth<=0)return null;
    return <circle key={i} cx={960+x*R} cy={cy+y*R} r={mix(1.6,3.1,p.r)} fill="#dadada" opacity={mix(.12,.65,p.r)*Math.pow(depth,.6)}/>;
  })}
 </svg>
}
const flights=[
 {p:'M 800 1010 Q 815 -505 1225 790',x:1225,y:790,start:2.28,len:1.05},
 {p:'M 1450 1045 Q 1410 -400 550 648',x:550,y:648,start:2.6,len:1.2},
 {p:'M 465 1052 Q 400 110 1500 760',x:1500,y:760,start:2.97,len:.95},
 {p:'M 1550 1015 Q 1470 110 680 990',x:680,y:990,start:3.18,len:1.15},
 {p:'M 440 1020 Q 960 18 1110 910',x:1110,y:910,start:3.38,len:.86},
 {p:'M 1260 1050 Q 1320 380 1440 770',x:1440,y:770,start:3.6,len:.78},
];
function Pings({t}:{t:number}){
 return <svg data-bench-object="launch.pings" width={W} height={H} style={{position:'absolute',inset:0}}><defs><filter id="arcGlow"><feGaussianBlur stdDeviation="4"/></filter></defs>
  {stars.map((s,i)=>{const grow=out(range(t,2.12+(i%14)*.018,2.6));return <circle key={i} cx={mix(1290,s.x,grow)} cy={mix(550,s.y,grow)} r={s.r*grow} fill={i%3===0?orange:'#fff'} opacity={s.o*grow*(.75+.25*Math.sin(t*3+i))}/>})}
  {flights.map((f,i)=>{
   const phase=((t-f.start)/f.len);
   if(phase<0)return null;
   const p=clamp(phase);
   const ping=clamp(phase-.78)*2.5;
   return <g key={i}>
    <path d={f.p} fill="none" stroke={orange} strokeWidth="1.3" opacity=".32" pathLength="1" strokeDasharray={`${p} 1`}/>
    {phase<1&&<><path d={f.p} fill="none" stroke={orange} strokeWidth="8" opacity=".7" pathLength="1" strokeDasharray=".095 .905" strokeDashoffset={-Math.max(0,p-.095)} filter="url(#arcGlow)"/><path d={f.p} fill="none" stroke="#ffa36f" strokeWidth="2.6" pathLength="1" strokeDasharray=".095 .905" strokeDashoffset={-Math.max(0,p-.095)}/></>}
    {ping>0&&<g opacity={.75}><circle cx={f.x} cy={f.y} r={12+ping*28} fill="none" stroke={orange} strokeWidth="1.8" opacity={1-clamp(ping*.7)}/><circle cx={f.x} cy={f.y} r="9" fill={orange}/><circle cx={f.x} cy={f.y} r="19" fill={orange} opacity=".17"/></g>}
   </g>
  })}
 </svg>
}
function Rings({t}:{t:number}){
 return <svg data-bench-object="launch.rings" width={W} height={H} style={{position:'absolute',inset:0}}>{[0,.09,.19,.29].map((delay,i)=>{
 const p=range(t,1.98+delay,3.55+delay);
 return <circle key={i} cx="1280" cy="545" r={out(p,2)*1510} fill="none" stroke={i===0?'#ddd':orange} strokeWidth={i===0?2:2.4} opacity={(1-p)*(.7-i*.1)}/>;
 })}</svg>
}
function Launch({t}:{t:number}){
 const sceneOut=range(t,4.32,4.55);
 const pillIn=out(range(t,1.52,1.75),3);
 const shrink=out(range(t,2.27,2.72),3);
 const pillScale=mix(1,.46,shrink)*mix(.25,1,pillIn);
 const pillY=mix(520,157,shrink);
 const typed='pulso.example/drop'.slice(0,Math.floor(mix(0,18,range(t,1.53,1.76))));
 const split=typed.split('/');
 const initialChars=typed.length;
 const pillWidth=Math.max(140,150+initialChars*46.5);
 const visits=1306482*out(range(t,2.24,4.45),4);
 const cursorP=out(range(t,1.79,1.94),3);
 return <AbsoluteFill style={{background:'#020302',opacity:1-sceneOut,filter:`blur(${sceneOut*13}px)`,transform:`scale(${1+sceneOut*.06})`}}>
  <Grid opacity={1-range(t,2,2.7)}/>
  {t<1.51&&<LongURL t={t}/>}
  {t>1.37&&t<1.54&&<div style={{position:'absolute',left:'28%',width:'44%',top:518,height:3,background:orange,boxShadow:`0 0 15px 5px #ff50003b`,transform:`scaleX(${1-range(t,1.4,1.52)})`}}/>}
  {t>=2&&<Planet t={t}/>}
  {t>=1.98&&t<3.7&&<Rings t={t}/>}
  {t>=2.15&&<Pings t={t}/>}
  {t>=2.28&&<div data-bench-object="launch.counter" style={{position:'absolute',left:0,top:mix(395,286,out(range(t,2.28,2.7),3)),width:1920,textAlign:'center',opacity:out(range(t,2.28,2.53)),transform:`scale(${mix(.9,1,out(range(t,2.28,2.65)))})`}}>
   <div style={{fontFamily:mono,color:orange,fontSize:28,letterSpacing:9,marginBottom:18}}>●VISITS · REAL-TIME</div>
   <div style={{display:'flex',justifyContent:'center'}}><RollingCount value={visits} width={920}/></div>
  </div>}
  {t>=1.51&&<div data-bench-object="launch.pill" style={{position:'absolute',left:960,top:pillY,transform:`translate(-50%,-50%) scale(${pillScale})`,height:180,width:pillWidth,borderRadius:100,border:'3px solid #353535',background:'linear-gradient(180deg,#181818,#0c0c0c)',boxShadow:`0 0 ${mix(20,56,Math.max(0,1-Math.abs(t-2)*5))}px #ff500015,inset 0 1px 3px #ffffff0e`,display:'flex',alignItems:'center',justifyContent:'center',gap:26,whiteSpace:'nowrap',fontFamily:sans,fontWeight:700,fontSize:80,letterSpacing:-4,color:'#fff',overflow:'hidden'}}>
   <Logo size={82} color="#fff"/><span>{split[0]}{split.length>1&&<>/<span style={{color:orange}}>{split[1]}</span></>}</span>
  </div>}
  {t>=1.78&&t<=2.14&&<svg data-bench-object="launch.cursor" width="34" height="43" viewBox="0 0 34 43" style={{position:'absolute',left:mix(1740,1265,cursorP),top:mix(1010,568,cursorP),opacity:1-range(t,2.04,2.14),transform:`scale(${1-.15*range(t,1.97,2.01)})`}}><path d="M4 2 L4 31 L12 24 L18 39 L24 36 L18 22 L29 21 Z" fill="#111" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round"/></svg>}
  {t>=1.48&&t<1.7&&<AbsoluteFill style={{background:'radial-gradient(ellipse,#ffffff66,transparent 77%)',opacity:(1-range(t,1.49,1.69))*.9}}/>}
  {t>=1.98&&t<2.22&&<AbsoluteFill style={{background:'radial-gradient(ellipse at 55% 48%,#ff500043,transparent 75%)',opacity:1-range(t,1.99,2.22)}}/>}
 </AbsoluteFill>
}

function curve(points:{x:number;y:number}[]){
 let d=`M${points[0].x},${points[0].y}`;
 for(let i=0;i<points.length-1;i++){
 const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];
 d+=` C${p1.x+(p2.x-p0.x)/6},${p1.y+(p2.y-p0.y)/6} ${p2.x-(p3.x-p1.x)/6},${p2.y-(p3.y-p1.y)/6} ${p2.x},${p2.y}`;
 }
 return d;
}
const chartPoints=Array.from({length:76},(_,i)=>{const u=i/75;return {x:42+u*1356,y:704-u*269+21*Math.sin(u*Math.PI*10)+10*Math.sin(u*Math.PI*22)-6*Math.cos(u*Math.PI*40)}});
const chartPath=curve(chartPoints);
function LinkIcon(){return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="2.6"><path d="M9.5 14.5l5-5m-6 8l-1.5 1.5a4.2 4.2 0 01-6-6l4-4a4.2 4.2 0 016 0m1-2L13.5 4a4.2 4.2 0 016 6l-4 4a4.2 4.2 0 01-6 0" transform="translate(1 0)"/></svg>}
function Toasts({t}:{t:number}){
 const content=[
  ['New signup','mara@studio.example · /drop','#a56eff',6.1],
  ['Order · $189.00','Starter kit · /drop','#2ad6c4',6.43],
  ['Order · $940.00','Team bundle · via @jonah','#2ad6c4',6.72],
  ['New signup','leo@north.example · scan code','#a56eff',6.98],
 ] as const;
 const count=content.reduce((n,c)=>n+out(range(t,c[3],c[3]+.2),3),0);
 return <div data-bench-object="dashboard.toasts" style={{position:'absolute',left:1290,top:900-count*92,width:520,display:'flex',flexDirection:'column',gap:9}}>
  {content.map((c,i)=>{const p=out(range(t,c[3],c[3]+.22),3);return p>0&&<div key={i} style={{height:98,boxSizing:'border-box',borderRadius:17,border:'1px solid #ffffff12',background:'#111111ec',display:'flex',alignItems:'center',gap:20,padding:'16px 22px',opacity:p,transform:`translateX(${(1-p)*75}px) scale(${mix(.86,1,p)})`,boxShadow:'0 14px 32px #0006'}}>
   <div style={{width:50,height:50,border:`1px solid ${c[2]}55`,borderRadius:13,background:`${c[2]}16`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{width:16,height:16,borderRadius:'50%',background:c[2],boxShadow:`0 0 16px ${c[2]}`}}/></div>
   <div style={{fontFamily:inter,color:'#eee'}}><div style={{fontWeight:600,fontSize:28,letterSpacing:-.7}}>{c[0]}</div><div style={{fontSize:18,color:'#888',marginTop:3,whiteSpace:'nowrap'}}>{c[1]}</div></div><span style={{position:'absolute',right:24,top:28,fontFamily:inter,color:'#777',fontSize:17}}>now</span>
  </div>})}
 </div>
}
function Dashboard({t}:{t:number}){
 const enter=out(range(t,4.4,4.64),3);
 const exit=out(range(t,7.27,7.54),3);
 const active=t<5.55?0:t<6.06?1:2;
 const palette=['#428bff','#9361ef','#24c9b8'];
 const activeColor=palette[active];
 const values=[1306482*out(range(t,4.4,5.4),6),52917*out(range(t,5.5,6.1),6),418260*out(range(t,6,6.6),6)];
 const reveal=active===0?out(range(t,4.43,4.93),2):1;
 const progress=range(t,6.32,7.0);
 const px=mix(190,810,progress);
 const pt=chartPoints[Math.round((px-42)/1356*75)];
 const selectionOpacity=out(range(t,6.3,6.4))*(1-range(t,7.0,7.16));
 const selectedDate=Math.round(mix(6,18,progress));
 const value=Math.round(mix(2255,3596,progress));
 return <AbsoluteFill style={{opacity:enter*(1-exit),transform:`translateX(${exit*1350}px) scale(${mix(.94,1,enter)*(1-exit*.7)})`,filter:`blur(${(1-enter)*8+exit*6}px)`}}>
  <div style={{position:'absolute',left:240,top:140,width:1440,height:800,transform:`perspective(2400px) rotateX(${mix(5,-1,range(t,4.4,7.4))}deg) rotateY(${mix(-10,3,range(t,4.4,7.4))}deg) rotateZ(${mix(-3.7,1.8,range(t,4.4,7.4))}deg)`,transformOrigin:'50% 50%'}}>
   <div data-bench-object="dashboard.panel" style={{position:'absolute',inset:0,borderRadius:42,border:'2px solid #242424',background:'linear-gradient(135deg,#101010,#070707)',boxShadow:'0 24px 85px #0009'}}>
    <div style={{position:'absolute',left:48,top:45,display:'flex',gap:24,alignItems:'center',fontFamily:inter,color:'#bababa',fontSize:25,fontWeight:600}}>
     <div style={{padding:'15px 23px',borderRadius:14,border:'1px solid #262626',background:'#171717',display:'flex',gap:15,alignItems:'center',fontSize:24,color:'#dedede'}}><LinkIcon/>pulso.example/drop</div>
     <div style={{padding:'15px 20px',borderRadius:14,border:'1px solid #262626'}}>Past 4 weeks</div>
    </div>
    <div style={{position:'absolute',right:52,top:44}}><Logo size={44} color="#eee"/></div>
    <div data-bench-object="dashboard.metrics" style={{position:'absolute',top:126,left:38,right:38,height:173,display:'flex',gap:22,borderBottom:'2px solid #222'}}>
     {['Visits','Signups','Revenue'].map((label,i)=><div key={label} style={{width:'33.333%',position:'relative',padding:'20px 25px',boxSizing:'border-box',background:i===active?'linear-gradient(#191919,#121212)':'transparent',borderRadius:'14px 14px 0 0',fontFamily:inter}}>
      <div style={{color:i===active?'#d6d6d6':'#8a8a8a',fontSize:28,display:'flex',gap:14,alignItems:'center'}}><span style={{width:14,height:14,borderRadius:3,background:palette[i],opacity:i===active?1:.6}}/>{label}</div>
      <div style={{fontFamily:sans,fontWeight:600,fontSize:78,lineHeight:1.3,letterSpacing:-4.5,color:i===active?'#fff':'#595959',whiteSpace:'nowrap'}}>{i===2?'$':''}{number(values[i])}</div>
      {i===active&&<div style={{position:'absolute',bottom:-2,left:0,right:0,height:4,borderRadius:4,background:palette[i],boxShadow:`0 0 14px ${palette[i]}88`}}/>}
     </div>)}
    </div>
    <svg data-bench-object="dashboard.chart" width="1440" height="800" style={{position:'absolute',inset:0,overflow:'visible'}}>
     <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={activeColor} stopOpacity=".52"/><stop offset="1" stopColor={activeColor} stopOpacity="0"/></linearGradient><filter id="lineGlow"><feGaussianBlur stdDeviation="6"/></filter><clipPath id="chartReveal"><rect x="0" y="310" width={1440*reveal} height="490"/></clipPath></defs>
     {[438,550,662,774].map(y=><line key={y} x1="40" x2="1396" y1={y} y2={y} stroke="#ffffff" opacity=".04" strokeDasharray="3 6"/>)}
     <g clipPath="url(#chartReveal)">
      <path d={`${chartPath} L1398 774 L42 774 Z`} fill="url(#chartFill)"/>
      <path d={chartPath} stroke={activeColor} strokeWidth="12" fill="none" opacity=".7" filter="url(#lineGlow)"/>
      <path d={chartPath} stroke={activeColor} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
     </g>
     {reveal<1&&<circle cx={42+1356*reveal} cy={chartPoints[Math.min(75,Math.floor(reveal*75))].y} r="5" fill="#fff"/>}
     <g opacity={selectionOpacity}>
      <line x1={px} x2={px} y1="338" y2="771" stroke="#aaa" strokeWidth="1.5"/>
      <circle cx={px} cy={pt.y} r="12" fill={activeColor} opacity=".2"/><circle cx={px} cy={pt.y} r="7.5" fill="#fff" stroke={activeColor} strokeWidth="4"/>
      <rect x={px+28} y={pt.y-112} width="170" height="94" rx="12" fill="#101010" stroke="#ffffff16"/>
      <text x={px+48} y={pt.y-80} fill="#aaa" fontFamily={inter} fontSize="21">Oct {selectedDate}</text><text x={px+48} y={pt.y-43} fill="white" fontFamily={inter} fontSize="30" fontWeight="700">${number(value)}</text>
     </g>
    </svg>
   </div>
  </div>
  {t>=6.1&&<Toasts t={t}/>}
 </AbsoluteFill>
}

type NodeSpec={name:string;x:number;y:number;r:number;color:string;delay:number};
const nodeRows:[string,number,number,number,string][]=[
 ['YT',837,428,34,'#a756ff'],['ZM',1051,412,33,'#f4cc12'],['RE',1225,480,35,'#ed4c96'],['KB',1248,602,29,'#f8c91f'],['WA',1135,677,35,'#ed4ca0'],['LZ',936,707,37,'#20ada9'],['LR',783,678,35,'#23c285'],['MM',650,569,35,'#f3c617'],['VZ',699,491,29,'#ff8a2e'],
 ['SM',534,394,28,'#26bdb7'],['GS',707,351,26,'#f566b2'],['TD',941,333,23,'#ff8a22'],['EB',1145,317,23,'#21c96b'],['DZ',1229,278,24,'#ed4ba3'],['CF',1325,397,29,'#ee53aa'],['DA',1421,455,27,'#23cc78'],['BM',1508,589,24,'#ff8f30'],['TG',1450,680,30,'#ed51ae'],['LB',1310,766,23,'#f24e61'],['LM',1507,771,25,'#9856da'],['NW',1112,785,27,'#448bf0'],['MG',1023,866,25,'#9858ce'],['JK',903,790,26,'#35d18a'],['VG',645,743,22,'#2ed2b9'],['JL',477,687,26,'#2bc97f'],['NT',424,599,24,'#ed5c9f'],['VJ',421,481,28,'#ff8b2a'],
 ['LL',564,256,20,'#dfb42e'],['FD',749,230,20,'#dfb92e'],['AD',979,240,25,'#ed4358'],['ZH',1438,337,22,'#ff8e2b'],['GF',1579,362,20,'#32b6b1'],['CS',1702,420,22,'#ebc231'],['GK',1709,546,23,'#27bf70'],['EH',1624,667,23,'#de4952'],['SZ',1430,813,22,'#daba2b'],['SD',1135,882,21,'#d9b426'],['YA',757,903,21,'#32bda6'],['AB',454,809,20,'#30a7a7'],['ML',373,769,21,'#2dada1'],['CV',200,673,22,'#32c180'],['HF',202,568,21,'#33bd78'],['NG',269,455,21,'#25c976'],['VW',379,347,22,'#eac52a'],
];
const nodes:NodeSpec[]=nodeRows.map((n,i)=>({name:n[0],x:n[1],y:n[2],r:n[3],color:n[4],delay:i<9?i*.025:.14+(i-9)*.016}));
const payouts=[
 {name:'LR',value:'+$420',start:8.94}, {name:'LZ',value:'+$85',start:9.1}, {name:'NG',value:'+$1,180',start:9.23},
 {name:'KB',value:'+$265',start:9.55}, {name:'TG',value:'+$72',start:9.68}, {name:'BM',value:'+$610',start:9.77},
 {name:'VJ',value:'+$2,040',start:9.98}, {name:'YT',value:'+$330',start:10.1}, {name:'DZ',value:'+$150',start:10.23},
 {name:'EB',value:'+$140',start:9.35}, {name:'JL',value:'+$60',start:10.17},
];
function getNode(n:NodeSpec,t:number){const p=out(range(t,7.83+n.delay,8.55+n.delay),3);return {x:mix(960,n.x,p)+Math.sin(t*.7+n.x)*6*p,y:mix(560,n.y,p)+Math.cos(t*.65+n.y)*5*p,p};}
function Network({t}:{t:number}){
 const entry=pop(range(t,7.5,7.83));
 const fade=1-range(t,10.38,10.56);
 const value=3864215*out(range(t,7.946,10.53),5);
 return <AbsoluteFill style={{opacity:fade,filter:`blur(${range(t,10.35,10.53)*9}px)`}}>
  <div style={{position:'absolute',left:330,top:190,width:1260,height:770,background:'radial-gradient(ellipse,#421c7866,transparent 66%)'}}/>
  <div data-bench-object="network.headline" style={{position:'absolute',left:0,right:0,top:81,textAlign:'center',fontFamily:sans,fontWeight:700,fontSize:120,letterSpacing:-6,lineHeight:1.1,whiteSpace:'nowrap'}}>
   <span style={{display:'inline-block',color:'#ededed',opacity:out(range(t,7.68,7.84)),transform:`translateY(${(1-out(range(t,7.68,7.9)))*60}px)`}}>Scale</span>{' '}
   <span style={{display:'inline-block',color:'#ededed',opacity:out(range(t,7.76,7.92)),transform:`translateY(${(1-out(range(t,7.76,7.98)))*60}px)`}}>through</span>{' '}
   <span style={{display:'inline-block',opacity:out(range(t,7.84,8)),transform:`translateY(${(1-out(range(t,7.84,8.05)))*60}px)`,background:'linear-gradient(90deg,#9959ff,#d541d3 50%,#ff5d08)',backgroundClip:'text',WebkitBackgroundClip:'text',color:'transparent'}}>referrals.</span>
  </div>
  <svg data-bench-object="network.nodes" width="1920" height="1080" style={{position:'absolute',inset:0}}>
   <defs><radialGradient id="hubGlow"><stop offset="0" stopColor="#a05fff" stopOpacity=".62"/><stop offset=".5" stopColor="#7730d6" stopOpacity=".15"/><stop offset="1" stopColor="#7730d6" stopOpacity="0"/></radialGradient><filter id="nodeGlow"><feGaussianBlur stdDeviation="7"/></filter></defs>
   <g opacity={out(range(t,7.9,8.6))}>{[[760,330],[530,245],[320,150]].map((r,i)=><ellipse key={i} cx="960" cy="560" rx={r[0]} ry={r[1]} fill="none" stroke="#9a74b8" strokeWidth="1.5" opacity=".19" strokeDasharray="5 10"/>)}</g>
   {nodes.map((n,i)=>{const pos=getNode(n,t);return <g key={n.name} opacity={pos.p}>
    <line x1="960" y1="560" x2={pos.x} y2={pos.y} stroke="#9782bb" strokeWidth="1.35" opacity=".25"/>
    {pos.p>.6&&<circle cx={mix(960,pos.x,((t*1.25+i*.17)%1))} cy={mix(560,pos.y,((t*1.25+i*.17)%1))} r={i%3===0?4:2} fill={t>8.9?'#21d26b':'#b5a0cc'} opacity=".8"/>}
    <circle cx={pos.x} cy={pos.y} r={n.r*pos.p+3} fill={n.color} opacity=".2" filter="url(#nodeGlow)"/>
    <circle cx={pos.x} cy={pos.y} r={n.r*pos.p} fill="#777880" stroke={n.color} strokeWidth="2.7"/>
    <circle cx={pos.x} cy={pos.y} r={n.r*pos.p-2>0?n.r*pos.p-2:0} fill={n.color} opacity=".1"/>
    <text x={pos.x} y={pos.y+1} textAnchor="middle" dominantBaseline="middle" fill="#eee" fontFamily={inter} fontWeight="600" fontSize={n.r*.72*pos.p}>{n.name}</text>
   </g>})}
   <circle cx="960" cy="560" r={260*entry} fill="url(#hubGlow)"/>
   <circle cx="960" cy="560" r={113*entry} fill="#a05cff" opacity=".1"/>
   <circle cx="960" cy="560" r={100*entry} fill="#fff"/>
   <g transform={`translate(${960-60*entry},${560-60*entry}) scale(${entry})`}><Logo size={120} color="#000"/></g>
  </svg>
  <div data-bench-object="network.payout" style={{position:'absolute',left:0,right:0,top:908,textAlign:'center',opacity:out(range(t,7.96,8.12)),fontFamily:mono}}><div style={{fontSize:90,lineHeight:1.1,letterSpacing:-7,color:'#1dc45b',textShadow:'0 0 20px #19c45b38'}}>${number(value)}</div><div style={{fontSize:21,letterSpacing:8,color:'#777',marginTop:7}}>EARNED BY REFERRERS</div></div>
  <div data-bench-object="network.pills" style={{position:'absolute',inset:0}}>{payouts.map(p=>{
   const node=nodes.find(n=>n.name===p.name)!;const n=getNode(node,t);const age=t-p.start;
   const show=out(range(age,0,.16),3)*(1-range(age,.95,1.15));
   return show>0&&<div key={p.name} style={{position:'absolute',left:n.x,top:n.y-node.r-45-range(age,0,1.15)*25,transform:`translate(-50%,-50%) scale(${mix(.3,1,pop(range(age,0,.18)))})`,opacity:show,background:'#1dca5a',color:'#002c14',borderRadius:20,padding:node.r<25?'8px 16px':'10px 20px',fontFamily:mono,fontSize:node.r<25?26:30,fontWeight:500,letterSpacing:-2,whiteSpace:'nowrap',boxShadow:'0 0 26px #22dc5d6b'}}>{p.value}</div>
  })}</div>
 </AbsoluteFill>
}

const features=[
 {text:'Tiny links.',bg:'#fafafa',color:'#000',category:'LINKS'},
 {text:'Scan codes.',bg:'#000',color:'#fff',category:'LINKS'},
 {text:'Own domains.',bg:'#ff5000',color:'#000',category:'LINKS'},
 {text:'App routing.',bg:'#000',color:'#fff',category:'LINKS'},
 {text:'Attribution.',bg:'#fa5300',color:'#000',category:'ANALYTICS'},
 {text:'Referrals.',bg:'#fafafa',color:'#9858ec',category:'PARTNERS'},
 {text:'Rewards.',bg:'#000',color:'#14c563',category:'PARTNERS'},
 {text:'All in one.',bg:'#000',color:'#fff',category:'PULSO'},
];
const qrCells=Array.from({length:30*18},(_,i)=>({x:20+i%30*65,y:20+Math.floor(i/30)*62,show:rand(i+992)>.52}));
const cash=Array.from({length:65},(_,i)=>({x:rand(i+364)*1920,y:rand(i+934)*1380,size:mix(18,46,rand(i+682)),o:mix(.14,.64,rand(i+234))}));
function Features({t}:{t:number}){
 const slot=Math.min(7,Math.floor((t-10.5)/.25));const s=features[slot];const local=t-10.5-slot*.25;
 const enter=out(range(local,0,.085),3);
 const wipe=slot===0?out(range(local,0,.06),3):1;
 const color=s.color;
 return <AbsoluteFill data-bench-object="features.slides" style={{background:s.bg,color,fontFamily:sans,clipPath:`inset(0 0 0 ${(1-wipe)*100}%)`}}>
  {slot===1&&<svg width={W} height={H} style={{position:'absolute',inset:0}}>{qrCells.map((c,i)=>c.show&&<rect key={i} x={c.x} y={c.y} width="58" height="55" rx="6" fill="#321102"/>)}</svg>}
  {slot===4&&<AbsoluteFill style={{background:'conic-gradient(from 25deg at 50% 49%,#f26800,#eed500,#9fe531,#20dab0,#25b7f0,#7154ee,#b249f5,#d32c89,#ff5311,#f26800)',transform:'scale(1.15)',filter:'blur(70px)'}}/>}
  {slot===6&&<svg width={W} height={H} style={{position:'absolute',inset:0}}>{cash.map((c,i)=><text key={i} x={c.x} y={(c.y+(t-12)*260)%1250-80} fill="#18c76b" fontFamily={mono} fontSize={c.size} opacity={c.o}>$</text>)}</svg>}
  <div style={{position:'absolute',top:48,left:48,fontFamily:mono,fontSize:24,letterSpacing:5,display:'flex',alignItems:'center',gap:16,color}}><Logo size={32} color={color}/>PULSO.EXAMPLE</div>
  <div style={{position:'absolute',top:48,right:48,fontFamily:mono,fontSize:24,letterSpacing:5,color}}>{String(slot+1).padStart(2,'0')} / 08</div>
  <div style={{position:'absolute',left:0,right:0,top:410,height:280,display:'flex',justifyContent:'center',alignItems:'center',fontSize:240,fontWeight:700,letterSpacing:-13,lineHeight:1,transform:`translateY(${(1-enter)*36}px) scale(${mix(.97,1,enter)})`,filter:`blur(${(1-enter)*7}px)`,whiteSpace:'nowrap',color:slot===3?'transparent':color,WebkitTextStroke:slot===3?'1.8px #eee':undefined,textShadow:slot===6?'0 0 24px #11b85e99':undefined}}>
   {slot===7&&<div style={{marginRight:55}}><Logo size={190} color="#fff"/></div>}
   <span style={{clipPath:slot===2?`inset(0 ${(1-out(range(local,0,.13),2))*100}% 0 0)`:undefined}}>{s.text}</span>
  </div>
  <div style={{position:'absolute',left:48,bottom:48,fontFamily:mono,fontSize:22,letterSpacing:5}}>[ {s.category} ]</div>
  <div style={{position:'absolute',right:48,bottom:59,width:320,height:2,background:color,opacity:.15}}/>
  <div style={{position:'absolute',right:48+320*(1-(slot+1)/8),bottom:59,width:320*(slot+1)/8,height:3,background:color,opacity:.7}}/>
 </AbsoluteFill>
}
function Ending({t}:{t:number}){
 const lt=t-12.5;
 const compact=out(range(lt,0,.34),4);
 const reveal=out(range(lt,.68,.94),3);
 const size=mix(1320,220,compact);
 const left=mix(960,680,reveal);
 const rotate=mix(-145,0,compact);
 const glow=out(range(lt,.26,.8),3);
 const wordP=(start:number)=>out(range(lt,start,start+.34),3);
 return <AbsoluteFill style={{background:'#fafafa',color:'#000',fontFamily:sans}}>
  <Grid light opacity={out(range(lt,.2,.9))}/>
  <div style={{position:'absolute',left:405,top:425,width:1110,height:780,opacity:glow*.57,filter:'blur(88px)',background:'radial-gradient(ellipse at 55% 34%,#ff798e 0%,transparent 46%),radial-gradient(ellipse at 33% 52%,#b16fda 0%,transparent 40%),radial-gradient(ellipse at 30% 81%,#5cacfa 0%,transparent 39%),radial-gradient(ellipse at 70% 61%,#ffba7c 0%,transparent 40%),radial-gradient(ellipse at 75% 89%,#bddd69 0%,transparent 38%)'}}/>
  <div data-bench-object="ending.logo" style={{position:'absolute',inset:0}}>
   <div style={{position:'absolute',left,top:445,transform:`translate(-50%,-50%) rotate(${rotate}deg)`,opacity:mix(.35,1,compact)}}><Logo size={size} color="#000"/></div>
   <div style={{position:'absolute',left:830,top:327,fontSize:170,fontWeight:600,letterSpacing:-11,lineHeight:1.2,opacity:reveal,clipPath:`inset(0 ${100*(1-reveal)}% 0 0)`,transform:`translateX(${(1-reveal)*-120}px)`}}>pulso</div>
  </div>
  <div data-bench-object="ending.tagline" style={{position:'absolute',left:0,right:0,top:641,height:145,display:'flex',justifyContent:'center',fontSize:96,fontWeight:700,letterSpacing:-5,lineHeight:1.2,whiteSpace:'nowrap'}}>
   {[['Make',.94],['every',1.035],['link',1.13],['count.',1.23]].map((w,i)=>{const p=wordP(Number(w[1]));return <div key={String(w[0])} style={{height:146,overflow:'hidden',marginRight:i<3?21:0}}><span style={{display:'inline-block',color:i===3?orange:'#050505',transform:`translateY(${(1-p)*145}px)`}}>{w[0]}</span></div>})}
   <svg width="270" height="26" style={{position:'absolute',left:1174,top:101}}><path d="M8 17 C74 8 135 16 195 12 Q238 10 259 14" fill="none" stroke={orange} strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-out(range(lt,1.5,1.75),3)}/></svg>
  </div>
  <div data-bench-object="ending.buttons" style={{position:'absolute',top:820,left:0,right:0,display:'flex',justifyContent:'center',gap:26}}>
   <div style={{width:349,height:92,borderRadius:16,background:'#050505',color:'#fff',fontFamily:inter,fontSize:39,fontWeight:600,letterSpacing:-1,display:'flex',alignItems:'center',justifyContent:'center',gap:20,opacity:out(range(lt,1.58,1.83)),transform:`translateY(${(1-out(range(lt,1.58,1.83)))*55}px)`,boxShadow:'0 20px 32px #0002'}}>Get started <span style={{fontWeight:400}}>→</span></div>
   <div style={{width:373,height:92,boxSizing:'border-box',borderRadius:16,border:'2px solid #e7e7e7',background:'#fff',color:'#111',fontFamily:mono,fontSize:34,letterSpacing:-1,display:'flex',alignItems:'center',justifyContent:'center',opacity:out(range(lt,1.7,1.95)),transform:`translateY(${(1-out(range(lt,1.7,1.95)))*55}px)`}}>pulso.example</div>
  </div>
 </AbsoluteFill>
}
export function Replica(){
 const frame=useCurrentFrame();const t=frame/60;
 return <AbsoluteFill style={{background:'#000',overflow:'hidden'}}>
  {t<4.55&&<Launch t={t}/>}
  {t>=4.4&&t<7.56&&<Dashboard t={t}/>}
  {t>=7.5&&t<10.56&&<Network t={t}/>}
  {t>=10.5&&t<12.5&&<Features t={t}/>}
  {t>=12.5&&<Ending t={t}/>}
 </AbsoluteFill>
}
