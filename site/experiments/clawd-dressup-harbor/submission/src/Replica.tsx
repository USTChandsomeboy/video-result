import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';

// The illustration is rebuilt from editable SVG primitives. Coordinates use the
// 1280 x 720 composition space; each accessory keeps its own animation binding.
const C = {ink:'#080c0c', orange:'#d77a52', yellow:'#ffdf3f', gold:'#d9b627', red:'#f12d37', redDark:'#cc202b', white:'#f8faf9', gray:'#bdc5cb', blue:'#2b90bb', green:'#53bb48'};
const mono = '"DejaVu Sans Mono", "Noto Sans Mono CJK SC", monospace';
const sans = '"Noto Sans CJK SC", "DejaVu Sans", sans-serif';
const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(f:number,x:number[],y:number[])=>interpolate(f,x,y,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const ease=(v:number)=>1-Math.pow(1-clamp(v),3);
const rand=(i:number)=>{const n=Math.sin(i*127.13+31.81)*43758.5453;return n-Math.floor(n)};
function R(p:React.SVGProps<SVGRectElement>){return <rect {...p}/>}
function Eyes({id,x1=-108,x2=83,y=-48,w=28,h=54,happy=false,glint=false}:{id:string;x1?:number;x2?:number;y?:number;w?:number;h?:number;happy?:boolean;glint?:boolean}) {
  return <g data-bench-object={id} fill={C.ink}>
    {[x1,x2].map((x,i)=><g key={i} data-bench-part={i===0?'left eye':'right eye'}>
      {happy ? <path d={`M ${x-17} ${y+h*.78} L ${x+w*.5} ${y+3} L ${x+w+17} ${y+h*.78}`} fill="none" stroke={C.ink} strokeWidth={15} strokeLinejoin="miter"/> : <><R x={x} y={y} width={w} height={h}/>{glint&&<R x={x+5} y={y+5} width={15} height={16} fill={C.white}/>}</>}
    </g>)}
  </g>
}
function SmallClawd({x,y,s=1}:{x:number;y:number;s?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} fill={C.orange}>
    <path d="M-30-20H30V-5H40V5H30V20H25V30H20V20H15V30H10V20H-10V30H-15V20H-20V30H-25V20H-30V5H-40V-5H-30Z"/>
    <R x={-20} y={-10} width={5} height={10} fill={C.ink}/><R x={15} y={-10} width={5} height={10} fill={C.ink}/>
  </g>
}
function Terminal({f}:{f:number}) {
  const opacity=f<3?f/3:f<83?1:lerp(f,[83,91],[1,.19]);
  const command='claude'.slice(0,Math.max(0,Math.floor((f-5)/2)+1));
  const input=f<35?'':f<38?'/':f<40?'/换':'/换装';
  return <g opacity={opacity}>
    <g data-bench-object="terminal.frame">
      <g data-bench-part="window"><R width={1280} height={720} fill="#0d0d0f"/><R y={43} width={1280} height={37} fill="#202024"/></g>
      <g data-bench-part="tab"><path d="M27 80V58Q27 49 36 49H244Q253 49 253 58V80Z" fill="#0b0d0e"/><SmallClawd x={51} y={64} s={.26}/><text x={72} y={69} fontFamily={mono} fontSize={16} fontWeight="bold" fill="#eee">claude</text><text x={221} y={70} fontSize={21} fill="#8c8c91">×</text><text x={272} y={70} fontSize={21} fill="#929297">+</text></g>
    </g>
    {f>=5&&<g data-bench-object="terminal.command" fontFamily={mono} fontSize={20}><text x={40} y={122} fill="#b4b4b5">PS D:\知洲&gt; <tspan fill="#f7dc72">{command}</tspan></text>{f<24&&f%16<12&&<R x={179+command.length*12.1} y={106} width={7} height={21} fill="#ddd"/>}</g>}
    {f>=25&&<>
      <g data-bench-object="terminal.header">
        <g data-bench-part="logo"><SmallClawd x={106.5} y={213.5} s={1.67}/></g>
        <text data-bench-part="title" x={207} y={188} fontSize={24} fill="#ededee" fontFamily={mono}><tspan fontWeight="bold">Claude Code</tspan><tspan fill="#858588"> v2.1.289</tspan></text>
        <text data-bench-part="account" x={207} y={219} fontSize={22} fill="#b4b4b7" fontFamily={mono}>Opus 5.5 · Claude Pro</text>
        <text data-bench-part="directory" x={207} y={250} fontSize={21} fill="#89898c" fontFamily={mono}>D:\知洲\Clawd 换装</text>
      </g>
      <g data-bench-object="terminal.input">
        <R data-bench-part="frame" x={40} y={302} width={1200} height={101} rx={12} fill="none" stroke="#737376" strokeWidth={1.4}/>
        <text data-bench-part="prompt" x={69} y={368} fontFamily={mono} fontSize={51} fill={C.orange}>›</text>
        <g data-bench-part="text">{input?<text x={109} y={370} fontFamily={sans} fontWeight={800} fontSize={43} fill="#fafafa">{input}</text>:f%20<15&&<R x={110} y={335} width={20} height={41} fill="#fff"/>}</g>
      </g>
      <text data-bench-object="terminal.hint" x={46} y={432} fill="#7a7a80" fontFamily={mono} fontSize={16}>? for shortcuts</text>
    </>}
  </g>
}
function Dialog({f}:{f:number}) {
  const scale=f<57?lerp(f,[52.5,55,57],[.1,1.08,1]):f>79?lerp(f,[79,84],[1,0]):1;
  return <g transform={`translate(640 510) scale(${scale}) translate(-640 -510)`}>
    <g data-bench-object="dialog.panel"><R data-bench-part="panel" x={440} y={432} width={400} height={155} fill="#f6f4eb" stroke="#333" strokeWidth={2}/><g data-bench-part="title bar"><R x={440} y={432} width={400} height={31} fill={C.orange}/>{[452,475,498].map(x=><R key={x} x={x} y={440} width={14} height={15} fill="#fffdf3"/>)}</g></g>
    <text data-bench-object="dialog.title" x={640} y={516} textAnchor="middle" fontFamily={sans} fontSize={36} fontWeight={900} fill="#111">换装开始?</text>
    <g data-bench-object="dialog.start" transform={f>=77?'translate(0 2)':''}><R data-bench-part="button" x={567} y={531} width={146} height={42} fill={C.orange} stroke="#111" strokeWidth={2}/><path data-bench-part="triangle" d="M591 539L611 552L591 565Z" fill="#111"/><text data-bench-part="text" x={623} y={561} fontFamily={mono} fontWeight="bold" fontSize={22} fill="#111">START</text></g>
  </g>
}
function Bare({f}:{f:number}) {
  const scale=lerp(f,[82.5,84.5,88,91],[.05,1.12,.97,1]);
  const dy=3*Math.sin((f-83)*.4);
  return <><R x={443} y={550+Math.max(0,dy)} width={394} height={12} fill="#28282a"/>
    <g data-bench-object="clawd.bare" transform={`translate(640 ${371+dy}) scale(${scale})`} fill={C.orange}>
      <R data-bench-part="body" x={-163} y={-105} width={326} height={210}/>
      <g data-bench-part="arms"><R x={-218} y={-27} width={55} height={53}/><R x={163} y={-27} width={55} height={53}/></g>
      <g data-bench-part="feet">{[-137,-82,55,110].map(x=><R key={x} x={x} y={105} width={27} height={54}/>)}</g>
      <Eyes id="clawd.bare-eyes"/>
    </g>
  </>
}
function IncomingCoat({f}:{f:number}) {
  const x=lerp(f,[102,105,113,117,126],[465,481,501,556,640]);
  const y=lerp(f,[102,105,114,126],[264,294,313,376]);
  const a=lerp(f,[102,106,114,126],[-12,-10,-8,0]);
  const s=lerp(f,[102,114,126],[1,1,.68]);
  return <g data-bench-object="clawd.incoming-coat" transform={`translate(${x} ${y}) rotate(${a}) scale(${s} ${s*.95})`}>
    <g data-bench-part="coat" fill={C.yellow}><path d="M-94-115H40V-77H126V21H70V115H-116V37H-172V-61H-94Z"/><R x={-69} y={-93} width={84} height={28} fill="#c69e19"/></g>
    <R data-bench-part="seam" x={-27} y={-65} width={12} height={180} fill={C.gold}/>
    <g data-bench-part="buttons" fill={C.ink}><R x={-1} y={-43} width={20} height={22}/><R x={-1} y={12} width={20} height={22}/></g>
  </g>
}
function RainCoat({f}:{f:number}) {
  const y=372+5*Math.sin((f-127)*.4);
  return <><R x={447} y={546} width={386} height={14} fill="#91bdce"/>
    <g data-bench-object="rain.coat" transform={`translate(640 ${y})`}>
      <g data-bench-part="coat" fill={C.yellow}><R x={-181} y={-156} width={362} height={264}/><R x={-237} y={-58} width={56} height={83}/><R x={181} y={-58} width={56} height={83}/><R x={-27} y={-169} width={54} height={13}/><R x={-237} y={13} width={71} height={12} fill={C.gold}/><R x={166} y={13} width={71} height={12} fill={C.gold}/><R x={-6} y={-3} width={12} height={111} fill={C.gold}/><R x={-140} y={54} width={72} height={12} fill={C.gold}/><R x={81} y={54} width={69} height={12} fill={C.gold}/></g>
      <R data-bench-part="face" x={-152} y={-115} width={304} height={112} fill={C.orange}/>
      <g data-bench-part="buttons" fill={C.ink}><R x={21} y={18} width={21} height={22}/><R x={21} y={64} width={21} height={22}/></g>
      <g data-bench-part="boots">{[-150,-94,46,102].map(x=><g key={x}><R x={x+5} y={108} width={28} height={15} fill={C.orange}/><R x={x} y={123} width={43} height={36} fill={C.blue}/><R x={x} y={150} width={43} height={9} fill="#2786af"/></g>)}</g>
      <Eyes id="rain.eyes" x1={-110} x2={84} y={-75} w={28} h={56} happy={f<137}/>
    </g></>
}
function Umbrella({f,id,space=false}:{f:number;id:string;space?:boolean}) {
  const appear=ease((f-134.4)/5);
  const x=space?lerp(f,[175,181,190],[733,729,710]):740;
  const y=space?lerp(f,[175,179,180,190],[145,37,24,-280]):145+5*Math.sin((f-134)*.23);
  const rot=space?lerp(f,[175,179,190],[-29,-14,0]):-29;
  return <g data-bench-object={id} transform={`translate(${x} ${y}) rotate(${rot}) scale(${space?1:appear})`}>
    <path data-bench-part="handle" d="M-4 20V230H-26V217H-16V20Z" fill="#98adb3"/>
    <g transform="translate(-15 12) scale(.96 .75)"><path data-bench-part="canopy" d="M-249 35V7H-222V-18H-194V-44H-166V-69H-124V-94H-82V-119H-41V-130H0V-141H42V-130H83V-119H125V-94H166V-69H194V-44H222V-18H249V7H267V35Z" fill={C.red}/>
    <g data-bench-part="ribs" fill={C.redDark}><R x={-162} y={-62} width={11} height={70}/><R x={-80} y={-111} width={12} height={119}/><R x={25} y={-130} width={12} height={138}/></g>
    <g fill="#fff"><R x={-139} y={-78} width={23} height={11}/><R x={-58} y={-127} width={27} height={11}/><R x={4} y={-142} width={24} height={11}/></g></g>
  </g>
}
function Helmet({f}:{f:number}) {
  const p=ease((f-148.2)/6);
  const x=lerp(p,[0,1],[360,447]);
  const y=lerp(p,[0,1],[-230,188])+8*Math.sin((f-148)*.22);
  return <g data-bench-object="rain.helmet" transform={`translate(${x} ${y}) rotate(-7)`}>
    <g data-bench-part="antenna"><R x={-7} y={-161} width={14} height={44} fill="#91a5ab"/><R x={-20} y={-197} width={40} height={35} fill={C.red}/></g>
    <g data-bench-part="shell"><R x={-110} y={-110} width={220} height={220} fill={C.white}/><R x={-110} y={110} width={220} height={20} fill="#b2bec5"/></g>
    <g data-bench-part="window"><R x={-88} y={-87} width={176} height={174} fill="#a2dff2"/><path d="M-73-70H-13V-54H-57V-21H-73Z" fill="white"/></g>
  </g>
}
const drops=Array.from({length:165},(_,i)=>({x:rand(i+103)*1280,y:rand(i+701)*760,h:12+rand(i+1501)*17,w:3+rand(i+551)*3,speed:8+rand(i+881)*9}));
function Rain({f}:{f:number}) {
  return <><R width={1280} height={720} fill="#cfe5f0"/><R y={534} width={1280} height={186} fill="#b3d2e0"/>
    <g fill="#9bc7d9" opacity={.7}>{[[-20,585],[150,617],[320,649],[490,585],[660,617],[830,649],[1000,585],[1170,617]].map(([x,y],i)=><g key={i}><R x={x} y={y} width={100} height={8}/><R x={x+20} y={y+8} width={60} height={6}/></g>)}</g>
    <g data-bench-object="rain.drops" fill="#79adc3"><g data-bench-part="individual drops">{drops.map((d,i)=><R key={i} data-bench-member={`drop-${i}`} x={d.x+Math.sin(i)*2} y={((d.y+(f-127)*d.speed)%790)-35} width={d.w} height={d.h} opacity={.26+rand(i+25)*.16}/>)}</g></g>
    <RainCoat f={f}/>{f>=134.4&&<Umbrella f={f} id="rain.umbrella"/>}{f>=148.2&&<Helmet f={f}/>}</>
}
const stars=Array.from({length:125},(_,i)=>({x:rand(i+990)*1280,y:rand(i+2601)*720,size:2+rand(i+1169)*4}));
function Planet({f}:{f:number}) {
  return <g data-bench-object="space.planet" transform={`translate(${1054+1.2*Math.sin(f*.09)} 169)`}>
    <path data-bench-part="body" d="M-60-120H16V-105H60V-90H90V-58H106V-20H120V30H105V60H90V90H60V106H15V120H-28V106H-60V90H-88V62H-104V30H-120V-20H-105V-58H-88V-90H-60Z" fill={C.orange}/>
    <g data-bench-part="bands" fill="#b85e38"><R x={-36} y={-94} width={77} height={16}/><R x={-94} y={-79} width={74} height={15}/><R x={-65} y={-24} width={107} height={16}/><R x={-116} y={-11} width={67} height={15}/><R x={-88} y={46} width={192} height={16}/></g>
    <g data-bench-part="rings" fill="#edb79a"><R x={-227} y={-49} width={56} height={7}/><R x={-171} y={-35} width={42} height={7}/><R x={125} y={23} width={50} height={7}/><path d="M-115-18H-66V-12H-115ZM-96-80H-63V-74H-96ZM-63-80H13V-73H-57V-59H-90V-65H-63Z"/></g>
  </g>
}
function Astronaut({f}:{f:number}) {
  const y=332+7*Math.sin((f-175)*.18);
  const rot=lerp(f,[175,181,195,210,222],[0,2,-8,1.5,2]);
  return <g data-bench-object="space.astronaut" transform={`translate(645 ${y}) rotate(${rot})`}>
    <g data-bench-part="suit"><path d="M-193-121H193V111H151V125H-151V111H-193Z" fill={C.gray}/><R x={-178} y={-166} width={356} height={155} fill={C.white}/><R x={-181} y={-18} width={362} height={123} fill={C.white}/><R x={-214} y={-18} width={42} height={84} fill={C.white}/><R x={172} y={-18} width={42} height={84} fill={C.white}/><R x={-214} y={10} width={38} height={17} fill={C.red}/><R x={176} y={10} width={38} height={17} fill={C.red}/><R x={-178} y={-18} width={356} height={18} fill={C.gray}/><R x={-151} y={105} width={42} height={22} fill={C.white}/><R x={109} y={105} width={42} height={22} fill={C.white}/></g>
    <g data-bench-part="visor"><R x={-150} y={-140} width={300} height={124} fill="#c48f7c"/><R x={-150} y={-140} width={300} height={12} fill="#405563"/><path d="M-126-122H-63V-109H-113V-82H-126Z" fill="#fff7df"/></g>
    <g data-bench-part="panel"><R x={-62} y={24} width={125} height={54} fill="#c0c8cd"/><R x={-49} y={36} width={26} height={29} fill="#ff4044"/><R x={-11} y={36} width={27} height={29} fill="#4367f5"/><R x={28} y={36} width={27} height={29} fill="#ffdf42"/></g>
    <g data-bench-part="boots">{[-110,74].map(x=><g key={x}><R x={x+8} y={114} width={27} height={15} fill={C.orange}/><R x={x} y={129} width={42} height={31} fill={C.white}/><R x={x} y={148} width={42} height={12} fill="#acb8bf"/></g>)}</g>
    <g data-bench-part="antenna"><R x={138} y={-246} width={12} height={80} fill="#9cacb4"/><R x={130} y={-273} width={28} height={28} fill={C.red}/></g>
    <Eyes id="space.eyes" x1={-105} x2={82} y={-89} w={27} h={54} happy={f<185}/>
  </g>
}
function Sparkle({x,y,s,angle}:{x:number;y:number;s:number;angle:number}) {
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} fill="#fff"><path d="M-6-54H6V54H-6ZM-54-6H54V6H-54Z"/><path d="M-6-54H6V54H-6ZM-54-6H54V6H-54Z" transform="rotate(45)"/><path d="M0-63L10-52H-10ZM0 63L-10 52H10ZM-63 0L-52-10V10ZM63 0L52 10V-10Z"/></g>
}
function Space({f}:{f:number}) {
  return <><R width={1280} height={720} fill="#151b35"/>
    <g data-bench-object="space.stars"><g data-bench-part="individual stars">{stars.map((s,i)=><R key={i} data-bench-member={`star-${i}`} x={s.x} y={s.y} width={s.size} height={s.size} fill={i%12===0?'#fff2a2':'#dfe7ff'} opacity={.75+.25*Math.sin(f*.06+i)}/>)}</g></g>
    <Planet f={f}/><Astronaut f={f}/>{f<190&&<Umbrella f={f} space id="space.umbrella"/>}
    {f>=192&&<g data-bench-object="space.sparkles">{[{x:480,y:97,s:.7,start:192,part:'left star'},{x:625,y:87,s:1,start:198,part:'middle star'},{x:773,y:94,s:.7,start:204,part:'right star'}].map((s,i)=>f>=s.start&&<g key={i} data-bench-member={`sparkle-${i}`} data-bench-part={s.part}><Sparkle x={s.x} y={s.y+(i===0?lerp(f,[192,205],[28,0]):0)} s={s.s*ease((f-s.start)/4)} angle={(f-s.start)*7}/></g>)}</g>}
  </>
}
const treeData=[{x:-75,top:315,s:.8},{x:173,top:274,s:1},{x:477,top:207,s:1.3},{x:780,top:279,s:.98},{x:986,top:274,s:1},{x:1295,top:267,s:1.03}];
function Trees(){return <g data-bench-object="snow.trees"><g data-bench-part="individual trees">{treeData.map((t,i)=><g key={i} data-bench-member={`tree-${i}`} transform={`translate(${t.x} ${t.top}) scale(${t.s})`}><R x={-10} y={230} width={20} height={32} fill="#a48d67"/>{[{x:-28,y:0,w:56,h:45},{x:-47,y:45,w:94,h:47},{x:-65,y:92,w:130,h:47},{x:-82,y:139,w:164,h:47},{x:-100,y:186,w:200,h:47}].map((r,j)=><g key={j}><R x={r.x} y={r.y} width={r.w} height={r.h} fill="#88baaf"/><R x={r.x} y={r.y-4} width={r.w} height={8} fill="#fff"/></g>)}</g>)}</g></g>}
const flakes=Array.from({length:95},(_,i)=>({x:rand(i+241)*1280,y:rand(i+824)*720,s:3+rand(i+612)*5,speed:1.6+rand(i+329)*2.5}));
function SnowSuit({f}:{f:number}) {
  const shift=lerp(f,[246,255,264],[0,60,100]);
  const rot=lerp(f,[222,226,232,239,246,250,255,260,265],[0,2,2,-1,-3,0,1.5,-2,0]);
  const dy=3*Math.sin((f-222)*.38);
  return <><R x={447+shift} y={546} width={386} height={14} fill="#cadee2"/>
  <g data-bench-object="snow.suit" transform={`translate(${640+shift} ${400+dy}) rotate(${rot})`}>
    <g data-bench-part="body" fill={C.orange}><R data-bench-part="face" x={-163} y={-96} width={326} height={174}/><R x={-218} y={-56} width={55} height={56}/><R x={163} y={-56} width={55} height={56}/>{[-137,-83,51,105].map(x=><R key={x} x={x} y={78} width={27} height={54}/>)}</g>
    <g data-bench-part="hat"><R x={-110} y={-231} width={220} height={42} fill={C.red}/><R x={-150} y={-193} width={300} height={54} fill={C.red}/><R x={-174} y={-136} width={348} height={42} fill="white"/><R x={-34} y={-282} width={68} height={57} fill="white"/>{[-88,-35,18,71].map(x=><R key={x} x={x} y={-216} width={22} height={14} fill={C.redDark}/>)}{[-118,-62,-6,50,106].map(x=><R key={x} x={x} y={-178} width={27} height={17} fill="white"/>)}</g>
    <g><R x={-148} y={-14} width={29} height={28} fill="#eea29a"/><R x={119} y={-14} width={29} height={28} fill="#eea29a"/></g>
    <g data-bench-part="mittens" transform="translate(0 -16)"><R x={-218} y={16} width={55} height={67} fill={C.blue}/><R x={163} y={16} width={55} height={67} fill={C.blue}/><R x={-218} y={12} width={55} height={14} fill="white"/><R x={163} y={12} width={55} height={14} fill="white"/></g>
    <g data-bench-part="scarf" transform="translate(0 -2)"><R x={-163} y={22} width={326} height={56} fill={C.red}/>{[-149,-95,-41,13,67,121].map(x=><R key={x} x={x} y={22} width={22} height={50} fill="white"/>)}<path d="M80 74H132V158H107V134H80Z" fill={C.red}/><R x={80} y={92} width={52} height={17} fill="white"/><path d="M-12 16H7V33H24V52H-10V40H-18V26H-12Z" fill="#7ec9df"/><R x={-1} y={28} width={9} height={9} fill="white"/></g>
    <Eyes id="snow.eyes" x1={-110} x2={78} y={-77} w={45} h={75} happy={f<232} glint/>
  </g></>
}
function Dinosaur({id,x,y,flip=false,angle=0,scale=1,f=0}:{id:string;x:number;y:number;flip?:boolean;angle?:number;scale?:number;f?:number}) {
  const leg=4*Math.sin(f*.52);
  return <g data-bench-object={id} transform={`translate(${x} ${y}) rotate(${angle} 150 100) scale(${scale})`}>
    <g transform={flip?'translate(300 0) scale(-1 1)':''}>
      <g data-bench-part="body" fill={C.green}><R x={0} y={0} width={152} height={85}/><R x={102} y={-30} width={30} height={30}/><R x={45} y={65} width={138} height={53}/><R x={180} y={65} width={69} height={27}/><R x={247} y={91} width={53} height={27}/><R x={160} y={27} width={26} height={27} fill="#369d43"/><R x={204} y={40} width={26} height={27} fill="#369d43"/><R x={73} y={114} width={83} height={32} fill="#e4f3a0"/></g>
      <g data-bench-part="legs" fill={C.green}><R x={61} y={133+leg} width={29} height={59-leg}/><R x={150} y={133-leg} width={29} height={59+leg}/></g>
      <R data-bench-part="eye" x={42} y={28} width={25} height={27} fill={C.ink}/><R data-bench-part="teeth" x={15} y={84} width={79} height={16} fill="white"/>
    </g>
  </g>
}
function Snow({f}:{f:number}) {
  const x=lerp(f,[234,246,252,255,265],[-370,-128,70,87,154]);
  return <><R width={1280} height={720} fill="#e2f2f8"/><R y={534} width={1280} height={186} fill="white"/><Trees/>
    <g data-bench-object="snow.flakes" fill="white"><g data-bench-part="individual flakes">{flakes.map((p,i)=><R key={i} data-bench-member={`flake-${i}`} x={p.x+10*Math.sin((f-222)*.04+i)} y={((p.y+(f-222)*p.speed)%780)-30} width={p.s} height={p.s} opacity={.55+rand(i+3)*.45}/>)}</g></g>
    <SnowSuit f={f}/>{f>=234&&<Dinosaur id="snow.dinosaur" x={x} y={369+8*Math.sin((f-234)*.34)} flip angle={9*Math.sin((f-234)*.28)} f={f}/>}
  </>
}
function Foliage({f}:{f:number}) {
  const shift=1.3*Math.sin(f*.15);
  return <g data-bench-object="jungle.foliage" transform={`translate(0 ${shift})`}>
    <g data-bench-part="left leaves"><path d="M0 0H99V23H142V46H184V69H229V93H252V140H276V205H210V161H166V138H122V115H77V93H33V69H0Z" fill="#7cbd69"/><path d="M0 104H33V127H77V150H122V173H166V196H144V235H111V213H78V190H45V167H0Z" fill="#56b649"/></g>
    <g data-bench-part="right leaves" transform="translate(1280 0) scale(-1 1)"><path d="M0 0H99V23H142V46H184V69H229V93H252V140H276V205H210V161H166V138H122V115H77V93H33V69H0Z" fill="#7cbd69"/><path d="M0 104H33V127H77V150H122V173H166V196H144V235H111V213H78V190H45V167H0Z" fill="#56b649"/></g>
    <path data-bench-part="fruit" d="M968 98H1040V116H1061V150H1078V201H1061V235H1040V254H968V235H948V202H929V150H948V116H968Z" fill="#ffe06a"/>
  </g>
}
function Ground(){return <g data-bench-object="jungle.ground"><g data-bench-part="grass"><R y={534} width={1280} height={186} fill="#c1dd87"/>{Array.from({length:82},(_,i)=><R key={i} x={rand(i+250)*1280} y={548+rand(i+363)*170} width={17+rand(i+233)*6} height={6} fill="#b4d37b" opacity={.8}/>)}</g><g data-bench-part="shrubs" fill="#7cbd68">{[80,449,1119].map(x=><path key={x} d={`M${x} 534V514H${x+15}V493H${x+35}V473H${x+57}V493H${x+77}V514H${x+96}V534Z`}/>)}</g></g>}
function JungleSuit({f}:{f:number}) {
  const rot=lerp(f,[265,269,276,283],[0,0,-9,-7]);
  const dy=3*Math.sin((f-265)*.35);
  return <><R x={548} y={546} width={386} height={14} fill="#b1d27b"/>
    <g data-bench-object="jungle.suit" transform={`translate(740 ${400+dy+lerp(f,[269,276],[0,-11])}) rotate(${rot})`}>
      <g data-bench-part="tail"><path d="M174 48H230V40H256V28H286V16H312V-4H340V24H312V50H286V66H256V82H230V102H174Z" fill={C.green}/></g>
      <g data-bench-part="head"><R x={-174} y={-159} width={348} height={256} fill={C.green}/><R x={-230} y={-64} width={56} height={82} fill={C.green}/><R x={174} y={-64} width={56} height={82} fill={C.green}/>{[-150,-95,-40,15,70,125].map(x=><R key={x} x={x} y={-188} width={28} height={30} fill="#329d47"/>)}{[-124,99].map(x=><g key={x}><R x={x} y={-147} width={25} height={27} fill={C.ink}/><R x={x} y={-147} width={9} height={10} fill="white"/></g>)}</g>
      <g data-bench-part="face"><R x={-147} y={-111} width={294} height={111} fill={C.orange}/>{[-140,-85,-30,25,80,135].map(x=><R key={x} x={x} y={-111} width={24} height={29} fill="white"/>)}</g>
      <g data-bench-part="belly"><R x={-94} y={22} width={190} height={113} fill="#e2f1a1"/>{[38,68,98,128].map(y=><R key={y} x={-94} y={y} width={190} height={9} fill="#d0e58e"/>)}</g>
      <g data-bench-part="feet">{[-145,75].map(x=><g key={x}><R x={x+5} y={97} width={28} height={16} fill={C.orange}/><R x={x} y={113} width={42} height={33} fill={C.green}/><R x={x} y={137} width={9} height={9} fill="white"/><R x={x+29} y={137} width={9} height={9} fill="white"/></g>)}</g>
      <Eyes id="jungle.eyes" x1={-106} x2={81} y={-73} w={27} h={54} happy={f>=278}/>
    </g></>
}
function Jungle({f}:{f:number}) {
  return <><R width={1280} height={720} fill="#eaf4c2"/><Foliage f={f}/><Ground/><R x={183} y={546} width={170} height={14} fill="#b1d27b"/>
  <Dinosaur id="jungle.dinosaur" x={174} y={358+4*Math.sin((f-265)*.4)} angle={lerp(f,[265,270,276,283],[10,10,0,5])} f={f}/><JungleSuit f={f}/></>
}
function Burst({f,start,id}:{f:number;start:number;id:string}) {
  const u=f-start;
  const radius=lerp(u,[0,4,11],[.4,1,1.25]);
  const s=lerp(u,[0,2,4,7,11],[.3,1,1,.75,0]);
  const opacity=lerp(u,[0,1,7,11],[0,1,1,0]);
  return <g data-bench-object={id} fill={C.ink} opacity={opacity}><g data-bench-part="individual particles">
    {Array.from({length:12},(_,i)=>{const a=-Math.PI/2+i*Math.PI/6;return <path key={i} data-bench-member={`particle-${i}`} transform={`translate(${640+436*radius*Math.cos(a)} ${380+313*radius*Math.sin(a)}) scale(${s})`} d="M-5-14H5V-5H14V5H5V14H-5V5H-14V-5H-5Z"/>})}
  </g></g>
}
function Watermark({f}:{f:number}) {
  return <g data-bench-object="watermark" fill="#73766c" fontFamily={sans} fontWeight={700} opacity={.87}><text data-bench-part="name" x={1170} y={683} fontSize={20}>知洲</text><g data-bench-part="small z marks" fontFamily={mono} fontWeight="bold" fontSize={16}><text x={1221} y={673}>z</text><text x={1227} y={655}>z</text><text x={1231} y={640}>z</text></g></g>
}
export function Replica() {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{background:'#0d0d0f'}}>
    <Audio src={staticFile('clawd-dressup.m4a')}/>
    <svg width={1280} height={720} viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      {f<127?<><Terminal f={f}/>{f>=52.5&&f<84&&<Dialog f={f}/>} {f>=82.5&&<Bare f={f}/>} {f>=102&&<IncomingCoat f={f}/>}</>:f<175?<Rain f={f}/>:f<222?<Space f={f}/>:f<265?<Snow f={f}/>:<Jungle f={f}/>}
      {[{start:127,id:'transition.rain'},{start:175,id:'transition.space'},{start:222,id:'transition.snow'},{start:265,id:'transition.jungle'}].map(t=>f>=t.start&&f<t.start+11&&<Burst key={t.id} f={f} {...t}/>)}
      <Watermark f={f}/>
    </svg>
  </AbsoluteFill>
}
