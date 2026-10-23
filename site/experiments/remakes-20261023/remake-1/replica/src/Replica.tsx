import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';

// All drawings and motion below were reconstructed from the public reference video.
const INK='#1c1722', PAPER='#f1f0df', GREEN='#b9e79a', RED='#d97259', GOLD='#edb345', PURPLE='#b69ae9';
const clamp=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const ease=(x:number)=>1-Math.pow(1-clamp(x),3);
const smooth=(f:number,a:number,b:number)=>ease((f-a)/(b-a));
const wave=(f:number,n=1)=>Math.sin(f*n);
const T=({x=0,y=0,size=36,fill=INK,children,family='DynaPuff',anchor='start',weight=700,...rest}:any)=><text x={x} y={y} fontSize={size} fill={fill} fontFamily={family} fontWeight={weight} textAnchor={anchor} {...rest}>{children}</text>;
const star=(cx:number,cy:number,r:number,r2:number,n=4)=>Array.from({length:n*2},(_,i)=>{const a=(i*Math.PI/n)-Math.PI/2;return `${cx+Math.cos(a)*(i%2?r2:r)},${cy+Math.sin(a)*(i%2?r2:r)}`}).join(' ');
const arc=(r:number,a:number,b:number)=>{const A=a*Math.PI/180,B=b*Math.PI/180;return `M ${Math.cos(A)*r} ${Math.sin(A)*r} A ${r} ${r} 0 ${b-a>180?1:0} 1 ${Math.cos(B)*r} ${Math.sin(B)*r}`};

function Defs(){return <defs>
  <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><path d="M 0 0 L 0 9" stroke={INK} strokeWidth="1" opacity=".08"/></pattern>
  <pattern id="grassHatch" width="17" height="17" patternUnits="userSpaceOnUse" patternTransform="rotate(68)"><path d="M 0 0 L 0 17" stroke="#6dab59" strokeWidth="1" opacity=".13"/></pattern>
  <pattern id="cross" width="39" height="39" patternUnits="userSpaceOnUse"><path d="M 0 0 L39 39 M39 0 L0 39" stroke="#85a17b" strokeWidth="1" opacity=".27"/></pattern>
  <pattern id="cloth" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0 L7 7 M7 0 L0 7" stroke="#d6cfb1" strokeWidth=".5" opacity=".35"/></pattern>
  <clipPath id="screenClip"><rect width="1080" height="1080"/></clipPath>
  <clipPath id="clapClip"><rect x="-442" y="-276" width="884" height="80" rx="6"/></clipPath>
</defs>}
function Sprout({x=0,y=0,s=1}:any){return <g transform={`translate(${x} ${y}) scale(${s})`} fill="#8fc66b" stroke={INK} strokeWidth="5" strokeLinejoin="round"><path d="M0 0 Q-5 -32 0 -65" fill="none"/><path d="M0 -39 Q-38 -70 -58 -40 Q-28 -25 0 -39 Z"/><path d="M0 -55 Q35 -91 61 -61 Q25 -42 0 -55 Z"/></g>}
function Sun({x=890,y=180,r=90,alpha=1}:any){return <g transform={`translate(${x} ${y})`} opacity={alpha} fill="none" stroke="#ce982e" strokeWidth="2.5">
  {Array.from({length:18},(_,i)=><path key={i} transform={`rotate(${i*20})`} d={`M0 ${-r-14} L0 ${-r-34+(i%2?12:0)}`}/>)}
  <circle r={r} fill={GOLD}/><circle r={r} fill="url(#hatch)"/><path d={`M${-r*.58} ${-r*.26} Q${-r*.3} ${-r*.58} ${r*.16} ${-r*.66}`} stroke="#f6d07b" strokeWidth="5" opacity=".7"/>
</g>}
function Flower({x,y,s=1}:any){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth=".7"><path d="M0 2 L0 12" stroke="#6f9555"/>{[0,72,144,216,288].map(a=><ellipse key={a} transform={`rotate(${a})`} cx="0" cy="-3.5" rx="3" ry="4" fill="#fffef4"/>)}<circle r="2.5" fill="#f5c442"/></g>}
function Background({ground=820,stripes=false,sun=false,final=false}:any){return <g>
 <rect width="1080" height="1080" fill={PAPER}/>
 {stripes&&<g opacity=".44" fill="#e6e4cb">{[-4,-3,-2,-1,0,1,2,3,4,5].map(i=><path key={i} d={`M${i*400-800} 0 L${i*400-600} 0 L${i*400+1020} 1080 L${i*400+820} 1080 Z`}/>)}</g>}
 {sun&&<Sun/>}
 <rect x="0" y={ground} width="1080" height={1080-ground} fill={final?'#bfd2ad':GREEN}/>
 <rect x="0" y={ground} width="1080" height={1080-ground} fill={final?'url(#cross)':'url(#grassHatch)'}/>
 <path d={`M0 ${ground} L1080 ${ground}`} stroke={INK} strokeWidth="3"/>
 {!final&&<g stroke="#789657" fill="none" strokeWidth="1.2">{Array.from({length:72},(_,i)=>{const x=(i*173+31)%1080,y=ground+25+(i*79)%Math.max(30,1050-ground);return <path key={i} d={`M${x} ${y} l-3 -9 m6 9 l4 -11`}/>})}</g>}
 {!final&&<g stroke={INK} strokeWidth="1.3">{Array.from({length:104},(_,i)=>{const x=i*10.5;return <path key={i} d={`M${x} ${ground} l${(i%3)-3} ${-5-(i*13%18)}`}/>})}</g>}
 {!final&&[0,1,2,3,4,5].map((i)=><Flower key={i} x={(i*277+164)%1080} y={ground+67+(i*73)%Math.max(40,1000-ground)} s={1.1}/>)}
 </g>}
function Actor({x=0,y=0,s=1,pose='happy',type='plain',f=0,arms='down',soot=false,bounce=0,noLegs=false}:any){
 const angry=pose==='angry',smile=pose==='happy',shock=pose==='shock';const eyeY=-12;const fill=soot?'#95624e':RED;
 const handUp=arms==='up';
 return <g transform={`translate(${x} ${Number(y)+Number(bounce)}) scale(${s})`} stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
  <g fill="none" opacity={noLegs?0:1}><path d="M-28 75 L-40 182 M29 75 L43 182"/><ellipse cx="-43" cy="184" rx="16" ry="6" fill={INK}/><ellipse cx="46" cy="184" rx="17" ry="6" fill={INK}/></g>
  <g fill={fill}><path d={handUp?'M-75 25 Q-112 20 -137 -3 Q-148 -12 -153 0 Q-153 14 -133 24 Q-103 50 -71 47':'M-75 28 Q-98 72 -116 72 Q-137 62 -136 76 Q-131 105 -111 95 Q-83 91 -65 57'}/><path d={handUp?'M75 25 Q110 18 138 -3 Q150 -11 153 0 Q152 14 132 25 Q104 49 71 47':'M75 28 Q99 70 118 73 Q137 65 138 78 Q137 102 117 96 Q86 90 67 55'}/><circle cx={handUp?-146:-126} cy={handUp?5:80} r="11"/><circle cx={handUp?146:128} cy={handUp?4:82} r="11"/></g>
  <Sprout y={-82} s={.7}/>
  <circle r="85" fill={fill}/><circle r="83" fill="url(#hatch)" stroke="none"/>
  <path d="M-53 -52 Q-27 -78 11 -76" stroke="#ed9580" strokeWidth="9" opacity=".52" fill="none"/>
  {type==='director'&&<g transform="translate(-5 -87) rotate(-11)"><ellipse rx="76" ry="21" fill={INK}/><path d="M-50 -6 Q-3 -28 45 -12" stroke="#59505a" strokeWidth="6" fill="none"/></g>}
  {type==='camera'&&<path d="M-42 -77 Q-38 -126 8 -112 Q23 -85 67 -72 Z" fill={INK}/>}
  {type==='stunt'&&<g><path d="M-81 -36 Q0 -56 80 -34 L79 -10 Q0 -30 -81 -10 Z" fill="#72ae67"/><path d="M80 -32 l42 1 -25 20 26 19 -45 -9" fill="#75ab63"/></g>}
  {type==='cycle'&&<g><path d="M-83 -22 Q0 -40 81 -25 L84 6 Q0 -4 -83 9 Z" fill="#db4037"/><path d="M-80 -20 Q-126 -14 -163 -28 Q-121 12 -80 9" fill="#df473e"/><path d="M-64 -10 L-5 -10 L-9 10 Q-47 33 -64 -10 M10 -10 L67 -10 Q52 31 16 11Z" fill={INK}/></g>}
  {type!=='cycle'&&<g>{angry?<><path d="M-40 -22 l23 10 -23 9 M38 -22 l-23 10 23 9" fill="none"/></>:smile?<><path d="M-42 -7 Q-31 -26 -20 -7 M20 -7 Q31 -26 42 -7" fill="none"/></>:<><ellipse cx="-29" cy={eyeY} rx="10" ry="14" fill={INK}/><ellipse cx="29" cy={eyeY} rx="10" ry="14" fill={INK}/><circle cx="-26" cy={eyeY-5} r="3.5" fill="white" stroke="none"/><circle cx="32" cy={eyeY-5} r="3.5" fill="white" stroke="none"/></>}</g>}
  <ellipse cx="-49" cy="24" rx="11" ry="6" fill="#ee9d83" stroke="none"/><ellipse cx="49" cy="24" rx="11" ry="6" fill="#ee9d83" stroke="none"/>
  {smile?<path d="M-17 28 L17 28 Q10 65 -6 52 Q-17 44 -17 28Z" fill="#682b2d" strokeWidth="3"/>:shock?<ellipse cy="34" rx="9" ry="13" fill="#6e2b2f" strokeWidth="3"/>:<path d="M-12 34 L10 34" fill="none" strokeWidth="3"/>}
  {soot&&<g fill="#5b493d" stroke="none" opacity=".65"><circle cx="37" cy="-54" r="10"/><circle cx="-46" cy="45" r="15"/><circle cx="50" cy="50" r="8"/></g>}
 </g>
}
function Chair(){return <g stroke={INK} strokeWidth="5" strokeLinejoin="round"><g fill="#794a29"><path d="M-112 -180 h13 v235 h-13z M100 -180 h13 v235 h-13z"/><path d="M-93 67 L99 202 L87 215 L-109 78Z M96 67 L-103 202 L-90 215 L110 78Z"/><path d="M-152 210 h86 v15 h-86z M66 210 h87 v15 h-87z"/></g><path d="M-99 -163 h198 v190 h-198z M-140 33 h280 v31 h-280z" fill={GOLD}/><path d="M-99 -163 h198 v190 h-198z" fill="url(#hatch)"/></g>}
function Megaphone({x=0,y=0,s=1,rotate=-40}:any){return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`} stroke={INK} strokeWidth="5" strokeLinejoin="round"><path d="M0 -20 L135 -72 L135 72 L0 20 Z" fill={GOLD}/><path d="M0 -20 L135 -72 L135 72 L0 20 Z" fill="url(#hatch)"/><ellipse cx="135" cy="0" rx="24" ry="73" fill="#bb8326"/><rect x="-17" y="-20" width="25" height="40" fill={INK}/><path d="M0 22 L0 47" strokeWidth="12"/></g>}
function Speech({x=0,y=0,w=500,h=210,label='ACTION!',s=1}:any){return <g transform={`translate(${x} ${y}) scale(${s})`}><path d={`M${-w/2} ${-h*.25} L${-w*.39} ${-h*.4} L${-w*.27} ${-h*.53} L${-w*.08} ${-h*.54} L${w*.1} ${-h*.6} L${w*.26} ${-h*.49} L${w*.44} ${-h*.4} L${w*.48} ${-h*.2} L${w*.56} 0 L${w*.48} ${h*.19} L${w*.44} ${h*.4} L${w*.25} ${h*.48} L${w*.1} ${h*.6} L${-w*.03} ${h*.54} L${-w*.2} ${h*.98} L${-w*.13} ${h*.53} L${-w*.27} ${h*.51} L${-w*.4} ${h*.29} L${-w/2} ${h*.18} L${-w*.47} 0 Z`} fill="#fffef6" stroke={INK} strokeWidth="3"/><T x="0" y="23" size={w*.15} anchor="middle">{label}</T></g>}
function StoryBoard(){return <g transform="translate(-125 -40) rotate(-8)" stroke={INK} strokeWidth="4"><rect x="-135" y="-138" width="255" height="310" rx="7" fill="#fffef6"/>{Array.from({length:6},(_,i)=><g key={i} transform={`translate(${-115+(i%2)*117} ${-116+Math.floor(i/2)*94})`}><rect width="103" height="80" fill="white"/>{i<2?<circle cx="51" cy="40" r="23" fill={i?RED:GOLD} stroke="none"/>:i===2?<path d="M18 48 Q48 22 80 48" fill="none"/>:i===3?<path d="M22 39 L82 39"/>:i===5?<polygon points={star(50,40,25,7)} fill={INK}/>:null}</g>)}</g>}
function Director({x=0,y=0,s=1,action=false,f=0,soot=false}:any){return <g transform={`translate(${x} ${y}) scale(${s})`}><Chair/><Actor y="-60" s={.95} type="director" pose={soot?'shock':'happy'} arms="up" soot={soot}/><Megaphone x="95" y="-58" rotate={action?-39:35} s={1.05}/>{action&&<><StoryBoard/><Speech x="430" y="-540" w="560" h="240"/></>}</g>}
function Bike({x=0,y=0,s=1,f=0,soot=false}:any){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="5" fill="none"><g transform={`translate(0 -100)`}><Actor s={.68} type="cycle" pose="flat" soot={soot}/></g>{[-85,88].map(cx=><g key={cx} transform={`translate(${cx} 150) rotate(${f*12})`}><circle r="65"/><circle r="5" fill={INK}/>{[0,60,120].map(a=><path key={a} d="M-60 0 L60 0" transform={`rotate(${a})`} strokeWidth="2"/>)}</g>)}<path d="M-85 150 L-26 45 L63 45 L88 150 L-26 45 L0 150 L-85 150 L49 150 L0 150 L63 45 L80 4 L112 4"/><path d="M-42 43 h47" strokeWidth="10"/></g>}
function Camera({x=0,y=0,s=1,f=0}:any){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="4"><Actor x="75" y="-25" s={.67} type="camera" pose="neutral"/><path d="M-18 17 L-56 175 M-18 17 L29 175 M-18 17 L-10 175" stroke="#936447" strokeWidth="6"/><rect x="-80" y="-73" width="115" height="78" fill={INK}/><path d="M35 -57 l33 -14 v83 L35 -7Z" fill={INK}/>{[-53,8].map(cx=><g key={cx} transform={`translate(${cx} -107) rotate(${f*6})`} fill="#d5d3c6"><circle r="31"/>{[0,120,240].map(a=><circle key={a} transform={`rotate(${a})`} cx="0" cy="-16" r="6" fill={INK}/>)}</g>)}</g>}
function Crate({x=0,y=0,s=1}:any){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="5" strokeLinejoin="round"><rect width="160" height="116" rx="5" fill="#9a663d"/><rect x="7" y="6" width="146" height="103" rx="3" fill="#af7c4e" stroke="#7d512f" strokeWidth="3"/><rect width="160" height="116" fill="url(#hatch)" stroke="none"/><polygon points={star(80,58,35,10)} fill={PURPLE} stroke="none"/></g>}
function TNT({x=0,y=0,s=1}:any){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="4">{[-35,0,35].map((xx,i)=><g key={i} transform={`translate(${xx} 0) rotate(${(i-1)*-9})`}><rect x="-9" y="-50" width="21" height="69" rx="3" fill="#db4440"/><path d="M-7 -39 h17 v10 h-17Z" fill={PAPER} stroke="none"/><path d="M2 -51 Q-6 -75 5 -77" fill="none"/><circle cx="6" cy="-79" r="3" fill="#efc84c" stroke="none"/></g>)}</g>}
function Gauge({x=0,y=0,s=1,f=0,needle=8,id}:any){return <g data-bench-object={id} transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="5" strokeLinejoin="round">
 <path d="M-381 0 A381 381 0 0 1 381 0 Z" fill="#faf9ec"/>
 <path d="M-364 0 A364 364 0 0 1 364 0" fill="none" strokeWidth="3"/>
 <path d="M-336 0 A336 336 0 0 1 336 0 L265 0 A265 265 0 0 0 -265 0 Z" fill="#80c85e"/>
 {Array.from({length:20},(_,i)=>{const a=180+i*9,b=a+9,clr=i<11?'#82c661':i<14?'#edd354':i<16?'#ecb14e':'#dc4a42';return <path key={i} d={`${arc(336,a,b)} L ${Math.cos(b*Math.PI/180)*265} ${Math.sin(b*Math.PI/180)*265} ${arc(265,b,a).replace(/^M [^A]+A/,'A').replace(/ 1 /,' 0 ')} Z`} fill={clr} strokeWidth="2.5"/>})}
 <path d="M-336 0 A336 336 0 0 1 336 0 L265 0 A265 265 0 0 0 -265 0 Z" fill="url(#hatch)" stroke="none"/>
 <path d="M0 0 L201 -178 A270 270 0 0 1 267 -37 Z" fill="#d84039"/>
 {['U','S','A','G','E'].map((c,i)=>{const x=(i-2)*56,y=-176+Math.abs(i-2)*9;return <T key={c} x={x} y={y} size="59" anchor="middle" transform={`rotate(${(i-2)*14} ${x} ${y})`}>{c}</T>})}
 <T x="184" y="-69" size="34" anchor="middle" transform="rotate(-21 184 -69)">LIMIT</T>
 <circle cx="-296" cy="-20" r="8" fill="#fffef6" strokeWidth="2"/>
 <g transform={`rotate(${needle})`}><path d="M0 -6 L-314 -15 L-3 7 Z" fill={INK}/></g>
 <circle r="16" fill={INK}/><circle r="6" fill="#bfc0ae" stroke="none"/>
 <path d="M-390 17 L391 17" fill="none" strokeWidth="22" strokeLinecap="round"/>
 </g>}
function Clapper({x=540,y=580,s=1,open=0,last=false}:any){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="6" strokeLinejoin="round">
 <path d="M-439 -47 Q-485 -20 -504 22 Q-521 66 -503 68 Q-490 71 -481 37 Q-466 9 -437 0 M439 -47 Q485 -20 504 22 Q521 66 503 68 Q490 71 481 37 Q466 9 437 0" fill={RED} strokeWidth="3"/>
 <Sprout y="-278"/>
 <g transform={`translate(-443 -196) rotate(${-open}) translate(443 196)`}><rect x="-442" y="-276" width="884" height="80" rx="6" fill={INK}/><g clipPath="url(#clapClip)">{Array.from({length:10},(_,i)=><path key={i} d={`M${-430+i*105} -276 l54 0 40 80 h-54Z`} fill="#faf9e9" stroke="none"/>)}</g><circle cx="-422" cy="-205" r="10" fill="#faf9e9"/></g>
 <rect x="-442" y="-196" width="884" height="80" rx="6" fill={INK}/>{Array.from({length:8},(_,i)=><path key={i} d={`M${-417+i*105} -118 l44 -78 h53 l-44 78Z`} fill="#faf9e9" stroke="none"/>)}
 <rect x="-443" y="-108" width="886" height="451" rx="8" fill="#102431"/><rect x="-425" y="-91" width="850" height="416" rx="3" fill="none" stroke={PAPER} strokeWidth="3"/><path d="M-425 93 L425 93" stroke={PAPER} strokeWidth="3"/>
 <T y="40" size="112" anchor="middle" fill={PURPLE} letterSpacing="1">ULTRACODE</T><T x="-327" y="244" size="47" fill={PAPER}>TAKE</T><T x="-133" y="252" size="98" fill={PAPER}>{last?'2':'1'}</T>
 <g fill={INK} strokeWidth="0"><path d="M-466 277 Q-456 268 -441 279 l10 -25 9 31 26 -7 3 25 Q-395 346 -431 346 Q-462 344 -466 277Z"/><path d="M466 277 Q456 268 441 279 l-10 -25 -9 31 -26 -7 -3 25 Q395 346 431 346 Q462 344 466 277Z"/></g>
 </g>}
function Terminal({f}:any){const tm=f/30;const gray='#858f98';const mono='JetBrains Mono';
 if(f<48){const shift=f<15?150:mix(80,0,smooth(f,15,36));const typed=Math.floor(clamp((f-20)/17)*7);return <g fontFamily={mono}>
 <rect width="1080" height="1080" fill="#10222d"/><g transform={`translate(0 ${shift})`}>
 {f>15&&<g><T x="92" y="64" size="73" family={mono} fill={gray} weight="400" fontStyle="italic">sound of two hands when they clap,</T><T x="92" y="166" size="73" family={mono} fill={gray} weight="400" fontStyle="italic">sound of one hand."</T><T x="92" y="267" size="73" family={mono} fill="#f0e936" weight="400">– Every answer you prepare is the</T></g>}
 <g data-bench-object="terminal.command"><path d="M0 432 H1080 M0 643 H1080" stroke="#5c707c" strokeWidth="4"/><T x="4" y="571" size="75" family={mono} fill="#8cfa88" weight="400">❯ {tm<.5?'':('/effort'.slice(0,typed))}</T><rect x={100+typed*45} y="494" width="32" height="92" fill="#b10058" opacity={f%20<16?1:.3}/><T x="92" y="775" size="73" family={mono} fill="#b5b8fb">/effort</T></g>
 {f<15&&<T x="100" y="950" size="65" family={mono} fill={gray} weight="400">○ low · /effort</T>}
 </g></g>}
 if(f<113){const custom=f>79;const sx=custom?mix(430,180,smooth(f,80,93)):0;return <g>
 <rect width="1080" height="1080" fill="#10222d"/><g data-bench-object="terminal.options" fontFamily={mono} transform={`translate(${-sx} 0)`}>
 <path d="M0 66 H1900 M0 344 H1900" stroke="#60717c" strokeWidth="3"/>
 {!custom?<><polygon points="955,342 968,322 980,342" fill="#96ff96"/>{['medium','high','xhigh','max'].map((txt,i)=><T key={txt} x={i*305-14} y="436" size="51" family={mono} fill={i===3?'#eb8750':gray} weight={i===3?700:400}>{txt}</T>)}<T x="-88" y="575" size="52" family={mono} fill={gray} weight="400">Uses excessive tokens resulting in long</T><T x="-93" y="644" size="52" family={mono} fill={gray} weight="400">thinking. Use sparingly for the hardest</T><T x="-126" y="782" size="51" family={mono} fill={gray} weight="400">← → adjust · Enter to confirm · s for this</T></>:<><T x="810" y="387" size="73" family={mono} fill="#9aff94" weight="400">Smarter</T><path d="M0 462 H1125" stroke="#60717c" strokeWidth="3"/><polygon points="721,459 740,430 759,459" fill="#97fa91"/><T x="-30" y="599" size="70" family={mono} fill={gray} weight="400">max</T><T x="537" y="594" size="72" family={mono} fill="#9d68e7">Ultracode</T><ellipse cx="742" cy="568" rx="243" ry="52" fill="none" stroke="#d87859" strokeWidth="5" transform="rotate(-3 742 568)"/><T x="355" y="700" size="70" family={mono} fill={gray} weight="400">xhigh + workflows</T><path d="M580 716 Q620 726 670 715 T760 715 T850 715 T960 715" stroke="#d87859" strokeWidth="5" fill="none"/><T x="-240" y="906" size="73" family={mono} fill={gray} weight="400">s for this session only · Esc</T></>}
 </g></g>}
 return <g data-bench-object="terminal.output"><rect width="1080" height="1080" fill="#10222d"/>
 <g transform={`translate(${-mix(0,155,smooth(f,132,151))} 0)`}>
 <T x="126" y="247" size="59" family={mono} fill="#94f986" weight="400">overhead</T><rect x="0" y="358" width="1700" height="51" fill="#2d2d2c"/><T x="20" y="401" size="61" family={mono} fill="#f2f0e9" weight="400">/effort</T>
 <T x="111" y="480" size="59" family={mono} fill="#91f98b" weight="400">Set effort level to ultracode</T><T x="111" y="557" size="59" family={mono} fill="#91f98b" weight="400">dynamic workflow orchestration</T><path d="M113 569 Q170 573 230 568 T350 568 T470 568 T590 568 T710 568 T830 568 T960 568 T1170 568" fill="none" stroke="#de735c" strokeWidth="3"/><T x="112" y="635" size="57" family={mono} fill="#008ba3">The Sound of One Hand</T>
 <T x="33" y="714" size="59" family={mono} fill={gray} weight="400" fontStyle="italic">Hakuin would say to those who came:</T><T x="0" y="790" size="59" family={mono} fill={gray} weight="400" fontStyle="italic">sound of two hands when they clap,</T><T x="0" y="868" size="59" family={mono} fill={gray} weight="400" fontStyle="italic">sound of one hand."</T><T x="0" y="943" size="59" family={mono} fill="#efe83a" weight="400">– Every answer you prepare is the</T><path d="M0 1016 H1600" stroke="#344755" strokeWidth="3"/>
 </g>
 {f>143&&<g transform={`translate(620 555) scale(${smooth(f,143,153)})`}><g stroke="#c8c6b0" strokeWidth="1.5" fill="none">{Array.from({length:17},(_,i)=><path key={i} transform={`rotate(${i*360/17})`} d={`M0 -35 L${i%2?18:-14} -97 L-12 -155 L8 -232 L-28 -280 L-6 -337`}/>)}</g><g stroke="#df7156" strokeWidth="12" strokeLinecap="round">{Array.from({length:16},(_,i)=><path key={i} transform={`rotate(${i*22.5})`} d="M0 -9 L0 -58"/>)}</g></g>}
 </g>
}

function FirstGauge({f}:any){const l=f-188;return <><Background ground={740}/><g transform="translate(32 500)"><Crate s="1.38"/><Crate y="122" s="1"/><Crate x="161" y="122" s="1.1"/><TNT x="62" y="-18" s="1.3"/></g><Actor x="298" y="483" s={.43} pose="happy" type="stunt"/><g transform={`translate(${mix(1100,680,smooth(f,186,195))} 825)`}>
 <Gauge id="gauge.first" s={1} needle={9+Math.sin(l*.14)*2}/>
 <g data-bench-object="actor.first"><Actor x="0" y="-466" s={1.08} pose={l>14&&l<40?'angry':'neutral'} arms="down" bounce={Math.sin(l*.35)*3} noLegs/><path d="M-68 -344 L-100 -275 M68 -344 L103 -275" fill="none" stroke={INK} strokeWidth="5"/></g>
 </g></>}
function FirstDirector({f}:any){const p=smooth(f,238,246);return <><Background ground={930} stripes/><g data-bench-object="director.action" transform={`translate(0 ${mix(180,0,p)})`}><Director x="440" y="704" s={1} action f={f}/></g></>}
function Network({f}:any){const local=f-262;return <><Background ground={879} stripes/>
 <g data-bench-object="network.photos" transform="translate(530 650)"><ellipse rx="370" ry="370" stroke="#aaa7bb" strokeWidth="2" fill="none" strokeDasharray="4 7"/>
 {Array.from({length:8},(_,i)=>{const a=(i*45-100+local*.35)*Math.PI/180,x=Math.cos(a)*370,y=Math.sin(a)*370;return <g key={i}><path d={`M0 0 L${x} ${y}`} stroke="#a595d9" strokeWidth="2" strokeDasharray="7 9"/><g transform={`translate(${x} ${y}) rotate(${i%2?-5:7})`}><rect x="-15" y="-13" width="31" height="28" fill="#fffdf4" stroke="#827e84" strokeWidth="2"/><circle r="6" fill={i%2?RED:PURPLE}/></g></g>})}
 <Director y="0" s={.45}/>
 <g opacity={smooth(f,270,279)}><ellipse cx="345" cy="-310" rx="130" ry="23" fill={GREEN} stroke={INK} strokeWidth="2"/><Camera x="350" y="-380" s={.42} f={f}/><ellipse cx="382" cy="12" rx="126" ry="23" fill={GREEN} stroke={INK} strokeWidth="2"/><Actor x="382" y="-88" s={.38} pose="neutral"/><ellipse cx="-190" cy="235" rx="130" ry="24" fill={GREEN} stroke={INK} strokeWidth="2"/><Bike x="-190" y="180" s={.4} f={f}/></g>
 </g></>}
function MiniScene({kind,f}:any){return <svg x="0" y="0" width="1080" height="1080" viewBox="0 0 1080 1080" overflow="hidden"><Background ground={855} stripes sun={kind===1}/>
 {kind===0?<Director x="490" y="590" s={1} f={f}/>:kind===1?<><Camera x="460" y="655" s={1.25} f={f}/><Gauge x="850" y="1030" s={.32} needle={13}/></>:kind===2?<><path d="M0 55 L390 240" stroke={INK} strokeWidth="7"/><ellipse cx="390" cy="240" rx="47" ry="21" fill="#926343" stroke={INK} strokeWidth="5" transform="rotate(27 390 240)"/><Actor x="560" y="606" s={1.25} type="stunt" pose="neutral"/></>:kind===3?<><Actor x="570" y="570" s={1.24} pose="neutral"/><path d="M690 530 L820 450" stroke={INK} strokeWidth="9"/><rect x="790" y="395" width="83" height="105" fill={INK} transform="rotate(-13 820 450)"/></>:kind===4?<Bike x="560" y="590" s={1.2} f={f}/>:kind===5?<><Actor x="500" y="565" s={1.2} pose="neutral" type="stunt"/><Crate x="20" y="695" s={1.3}/></>:kind===6?<><Actor x="290" y="589" s={1.2} pose="neutral"/><Clapper x="765" y="773" s={.25}/></>:kind===7?<><Actor x="370" y="582" s={1.2} pose="neutral"/><g stroke={INK} strokeWidth="8" fill="none"><path d="M670 400 V850 M760 400 V850"/>{Array.from({length:8},(_,i)=><path key={i} d={`M670 ${430+i*55} h90`}/>)}</g></>:<><Gauge x="560" y="1000" s={1.23} needle={8}/><Actor x="560" y="430" s={1} pose="happy"/></>}
 </svg>}
function Panels({f,cols,id}:any){const n=cols===2?2:cols*cols,rows=cols===2?1:cols,w=1064/cols,h=1060/rows;const kinds=cols===2?[0,1]:cols===2.01?[0,1,4,5]:cols===3?[1,2,3,4,0,5,6,7,8]:[0,1,4,5];return <g data-bench-object={id}><rect width="1080" height="1080" fill={PAPER}/>{Array.from({length:n},(_,i)=>{const x=8+(i%cols)*w,y=10+Math.floor(i/cols)*h;return <g key={i} transform={`translate(${x} ${y})`}><svg width={w-8} height={h-8} viewBox={cols===2?"270 0 540 1080":"0 0 1080 1080"} preserveAspectRatio="xMidYMid slice" overflow="hidden"><MiniScene kind={kinds[i]} f={f}/></svg><rect width={w-8} height={h-8} fill="none" stroke={INK} strokeWidth="3"/>{cols===3&&f>356+i*4&&<path d={`M${w-70} 27 l18 20 29 -40`} fill="none" stroke="#267f53" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>}</g>})}
 {f>300&&<g fill="none" stroke="#a18add" strokeWidth="3" strokeDasharray="6 7">{Array.from({length:n},(_,i)=>{if(i===Math.floor(n/2))return null;return <path key={i} d={`M540 545 L${8+(i%cols)*w+w*.5} ${10+Math.floor(i/cols)*h+h*.5}`}/>})}</g>}
 </g>}
function FourPanels({f}:any){const w=526,h=526;return <g data-bench-object="split.four"><rect width="1080" height="1080" fill={PAPER}/>{[0,1,4,5].map((kind,i)=><g key={i} transform={`translate(${10+i%2*535} ${10+Math.floor(i/2)*535})`}><svg width={w} height={h} viewBox="0 0 1080 1080"><MiniScene kind={kind} f={f}/></svg><rect width={w} height={h} fill="none" stroke={INK} strokeWidth="4"/></g>)}<g stroke="#9c86d6" strokeWidth="3" strokeDasharray="7 7"><path d="M250 360 L760 360 L760 890 M250 360 L760 890 M250 360 L250 890"/></g></g>}
function StuntSet({f,actor=true}:any){return <>
 <Background ground={805} stripes sun/>
 <path d="M0 805 L230 605 L230 805Z" fill="#98603b" stroke={INK} strokeWidth="5"/><path d="M80 739 V804 M160 672 V804 M200 632 V804" stroke="#704629" strokeWidth="2"/>
 <g transform="translate(598 570)"><Crate y="118"/><Crate x="160" y="118"/><Crate x="80"/><TNT x="160" y="-12" s="1.2"/></g>
 <path d="M421 805 h78 v-63 h-78Z" fill="#d74139" stroke={INK} strokeWidth="4"/><path d="M458 741 V687 M436 687 h46" stroke={INK} strokeWidth="12" strokeLinecap="round"/>
 {actor&&<><Actor x="460" y="636" s={.65} type="stunt" pose="neutral"/><Gauge x="887" y="1060" s={.7} needle={10}/><Actor x="887" y="700" s={.48} pose="neutral"/>
 <path d="M68 570 Q450 75 966 540" stroke="#a298dd" strokeWidth="3" strokeDasharray="9 10" fill="none"/><g transform="translate(544 245)" stroke="#9e95dc" strokeWidth="2" opacity=".8"><circle r="48" fill="none"/><path d="M-15 0 H15 M0 -15 V15"/></g>
 <g transform={`translate(${mix(-20,1190,clamp((f-450)/40))} ${mix(635,640,clamp((f-450)/40))-Math.sin(clamp((f-450)/40)*Math.PI)*350}) rotate(${-10+Math.sin((f-450)*.08)*8})`}><Bike s={.66} f={f}/></g></>}
 </>}
function FilmStrip({f,stunt=false}:any){const p=f-402;const isFull=p>23;const scale=isFull?mix(.5,1,smooth(f,425,433)):.5;
 if(stunt)return <g data-bench-object="stunt.strip"><StuntSet f={f}/></g>;
 return <g data-bench-object="film.strip"><rect width="1080" height="1080" fill={PAPER}/>
 {!isFull&&<><path d="M0 152 Q540 156 1080 135" stroke={INK} strokeWidth="2" fill="none"/>{[90,190,310].map((x,i)=><g key={i}><rect x={x} y="148" width="18" height="165" fill={i===0?'#efb8cf':i===1?'#b9b6df':'#e9bd5a'} stroke={INK} strokeWidth="3"/></g>)}<g transform="translate(941 221) rotate(6)"><rect x="-100" y="-90" width="160" height="190" fill={INK}/><rect x="-86" y="-76" width="130" height="155" fill={PAPER}/><Actor y="-15" s={.5} pose="neutral"/></g><path d="M0 862 H1080 V1080 H0Z" fill="#986644" stroke={INK} strokeWidth="5"/><path d="M0 877 H1080 M180 877 V1080 M620 877 V1080" stroke="#725032" strokeWidth="3"/><Actor x="585" y="681" s={.65} type="stunt" pose="angry" arms="up"/><g transform="translate(690 678) rotate(-30)" stroke={INK} strokeWidth="4"><path d="M0 -9 l70 -6 M0 9 l70 6"/><circle cx="-19" cy="-20" r="18" fill="none"/><circle cx="-19" cy="20" r="18" fill="none"/></g><ellipse cx="80" cy="837" rx="49" ry="8" fill="none" stroke="#8e8d7c" strokeWidth="3"/></>}
 <g transform={`translate(${isFull?0:mix(-120,120,smooth(f,402,425))} ${isFull?250:395}) scale(${scale})`}>
 <rect x="-1500" y="0" width="4300" height="580" fill={INK}/>
 {[-2,-1,0,1,2,3].map((i)=><g key={i} transform={`translate(${(i*660)-(p>22?(p-22)*88:0)} 72)`}><svg x="0" y="0" width="592" height="438" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid slice"><StuntSet f={f} actor={false}/></svg></g>)}
 {Array.from({length:35},(_,i)=><g key={i}><rect x={-1500+i*120} y="18" width="69" height="36" rx="8" fill={PAPER}/><rect x={-1500+i*120} y="526" width="69" height="36" rx="8" fill={PAPER}/></g>)}
 </g></g>
}
function Burst({f}:any){const local=f-481;const pulse=1+Math.sin(local*.55)*.06;return <><StuntSet f={f} actor={false}/><Gauge x="896" y="1060" s=".72" needle={9}/>
 <g data-bench-object="explosion.burst" transform={`translate(740 620) scale(${mix(.1,1.16,smooth(f,481,492))*pulse})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
 {Array.from({length:17},(_,i)=><path key={i} transform={`rotate(${i*360/17+local*.9})`} d="M-19 -35 L-34 -420 Q-25 -475 11 -468 Q45 -455 34 -418 L18 -35Z" fill={RED}/>)}
 {Array.from({length:17},(_,i)=><path key={i} transform={`rotate(${i*360/17+12-local*.7})`} d="M-12 -15 L-22 -240 Q-15 -269 10 -262 Q28 -252 21 -231 L13 -15Z" fill={GOLD} stroke="#d99e36" strokeWidth="2"/>)}
 {Array.from({length:12},(_,i)=><path key={i} transform={`rotate(${i*30+local})`} d="M-8 -5 L-10 -151 Q0 -173 12 -150 L8 -5Z" fill="#f2dd47" stroke="#dcb33b" strokeWidth="1"/>)}<polygon points={star(0,0,45,9)} fill="#fffbb4" stroke="none"/>
 </g>
 <g fill="none" stroke={INK} strokeWidth="3">{Array.from({length:14},(_,i)=>{const a=i*2.4;return <path key={i} d={`M${740+Math.cos(a)*330} ${620+Math.sin(a)*330} l${Math.cos(a)*220} ${Math.sin(a)*220}`}/>})}</g>
 <g transform={`translate(${650+local*6} ${110-Math.sin(local*.07)*200}) rotate(${local*9})`}><Bike s={.58} f={f} soot/></g>
 </>}
function Smoke({f}:any){const l=f-542;return <><StuntSet f={f} actor={false}/><g opacity={clamp((f-559)/10)}>{[170,330,500,655,805,940].map((x,i)=><Actor key={i} x={x} y={i===1?680:770} s={i===1?.95:.55} type={i===1?'director':'plain'} soot pose="shock"/>)}<Bike x="255" y="1060" s=".65" f={f} soot/></g>
 <g data-bench-object="smoke.clouds" opacity={1-smooth(f,562,580)}>{Array.from({length:18},(_,i)=>{const x=(i*283)%1220-100,y=140+(i*137)%930,r=145+(i%3)*32;return <g key={i} transform={`translate(${x+Math.sin(l*.05+i)*l*5} ${y-l*3})`}><path d={`M${-r} 0 Q${-r*1.3} ${-r*.65} ${-r*.6} ${-r*.9} Q${-r*.3} ${-r*1.2} ${r*.2} ${-r*.93} Q${r*.9} ${-r*1.12} ${r} ${-r*.4} Q${r*1.3} ${r*.2} ${r*.75} ${r*.6} Q${r*.65} ${r*1.1} 0 ${r*.9} Q${-r*.8} ${r*1.1} ${-r} 0Z`} fill="#cecec4" stroke="#6c6a67" strokeWidth="2"/></g>})}</g></>}
function GaugeClose({f}:any){const l=f-598;return <><Background ground={1200}/><Gauge id="gauge.close" x="540" y="875" s={1.1} needle={7+Math.sin(l*.07)*2}/>{f>608&&<g transform={`translate(${mix(1310,1060,smooth(f,608,614))} 625) rotate(22)`}><ellipse rx="42" ry="31" fill={INK}/><path d="M0 0 L200 0" stroke={INK} strokeWidth="18"/><ellipse cx="-8" cy="-9" rx="11" ry="5" fill="#b6adbd"/></g>}
 {f>625&&<g transform={`translate(515 310) scale(${smooth(f,625,632)})`}><circle r="175" fill={PAPER} stroke={INK} strokeWidth="5"/><path d="M-100 -143 L92 -150 L116 153 L-58 163Z" fill="#80c65c" stroke={INK} strokeWidth="5"/><path d="M-59 -58 L65 -14" stroke={INK} strokeWidth="18" strokeLinecap="round"/><path d="M-72 -16 L71 26" stroke="#a899e6" strokeWidth="5" strokeDasharray="7 7"/><circle r="185" fill="none" stroke="#9586d1" strokeWidth="3" strokeDasharray="6 7"/><path d="M-104 163 L-149 553 L214 155" fill="none" stroke="#9586d1" strokeWidth="3"/><circle cx="-149" cy="553" r="23" fill="none" stroke="#9586d1" strokeWidth="3"/></g>}
 </>}
function Happy({f}:any){const l=f-639;return <><Background ground={1200}/><Gauge x="540" y="1260" s={1.17} needle={9}/><g data-bench-object="actor.happy"><Actor x="540" y="669" s={1.53} pose="happy" arms="up" bounce={-Math.sin(clamp(l/20)*Math.PI)*65}/>{Array.from({length:15},(_,i)=>{const a=i*24*Math.PI/180;return <path key={i} d={`M${540+Math.cos(a)*240} ${650+Math.sin(a)*250} l${Math.cos(a)*29} ${Math.sin(a)*29}`} stroke="#e9ac42" strokeWidth="4"/>})}{[0,1,2,3].map((i)=><polygon key={i} points={star(260+i*190,425+(i%2)*120,24,6)} fill="#9b6ce4"/>)}</g></>}
function Return({f}:any){return <><Background ground={772} stripes sun/><Gauge x="760" y="1060" s={.8} needle={9}/><g data-bench-object="director.return"><Actor x="300" y="561" s={1.1} type="director" pose="shock" soot arms="up"/><path d="M449 634 L500 659" stroke={INK} strokeWidth="6"/><g stroke={INK} strokeWidth="3"><path d="M289 374 V345 M279 373 L269 350 M309 374 L323 352"/></g></g><Actor x="764" y="607" s={.89} pose="happy"/><Megaphone x="812" y="530" s=".62" rotate="-101"/></>}
function Again({f}:any){const p=smooth(f,685,693);return <><Background ground={844} stripes sun/>
 <g data-bench-object="again.actor" transform={`translate(0 ${mix(120,0,p)})`}><Gauge x="552" y="1030" s={.58} needle={9}/><Actor x="553" y="663" s={.85} pose="neutral"/><Megaphone x="485" y="605" rotate="-113" s=".5"/><Speech x="480" y="333" w="720" h="230" label="AGAIN!"/>
 <g transform={`translate(${240-(f-687)*4} ${664+(f-687)*3}) rotate(${(f-687)*-5})`}><Actor s=".45" type="director" pose="shock" soot/></g><Actor x="918" y="760" s={.45} type="stunt" pose="happy"/><Camera x="140" y="1013" s={.4} f={f}/><Bike x="945" y="980" s={.4} f={f}/>
 {[0,1,2,3].map(i=><polygon key={i} points={star(100+i*280,620+(i%2)*-70,15,4)} fill="#a071e5"/>)}
 </g></>}
function Finale({f}:any){const local=f-744;const words1=['Blow','up','the','set.'],words2=['Not','your','limits.'];const count=Math.max(0,Math.floor((local-1)/7)+1);return <>
 <Background ground={820} final/>
 <g data-bench-object="finale.lineup" transform={`translate(0 ${mix(25,0,smooth(f,742,750))})`}>
 <Actor x="120" y="695" s={.5} type="stunt" pose="happy"/><path d="M167 778 h39 v-28 h-39Z M185 747 V722 M174 722 H199" fill="#d7433a" stroke={INK} strokeWidth="4"/>
 <Actor x="331" y="635" s={.89} type="director" pose="happy" arms="up"/>
 <g transform="translate(540 670) scale(.7)"><Chair/><Actor y="-85" s=".9" pose="happy" arms="up"/></g>
 <Gauge x="540" y="817" s={.35} needle={9}/>
 <Bike x="765" y="685" s={.62} f={f}/><Camera x="976" y="701" s={.48} f={f}/>
 </g>
 <g data-bench-object="finale.headline" opacity={smooth(f,744,747)}>
 <T x="540" y="199" size="88" family="Grandstander" weight="800" anchor="middle">{words1.slice(0,Math.min(count,4)).join(' ')}</T>
 <T x="540" y="311" size="88" family="Grandstander" weight="800" anchor="middle">{count>4?words2.slice(0,count-4).join(' '):''}</T>
 {count>=7&&<path d="M638 334 Q722 345 809 332" fill="none" stroke="#d34339" strokeWidth="8" strokeLinecap="round"/>}
 {local>46&&<g opacity={smooth(f,790,800)}><T x="111" y="414" size="48" fill="#9761e6">✦ultracode</T><T x="415" y="414" size="43" family="Grandstander" weight="800">· starring Opus 5.5</T></g>}
 </g>
 <g transform={`translate(${mix(540,940,smooth(f,744,782))} ${mix(264,480,smooth(f,744,782))})`}><circle r="69" fill="#f3d991" stroke={INK} strokeWidth="2"/><circle r="69" fill="url(#hatch)"/><path d="M-89 0 H89 M0 -89 V89" stroke="#8f85d0" strokeWidth="2"/><path d="M-39 -21 Q-10 -51 27 -49" stroke="#f8e8b4" strokeWidth="4" fill="none"/></g>
 {f>830&&<rect x="70" y="575" width="810" height="295" fill="#8f90dd" opacity={.7*(1-smooth(f,830,837))}/>}
 </>}

export function Replica(){const f=useCurrentFrame();let scene:React.ReactNode;
 if(f<154)scene=<Terminal f={f}/>;
 else if(f<159)scene=<g><rect width="1080" height="1080" fill={PAPER}/><g transform={`translate(540 540) scale(${mix(.1,2.4,smooth(f,154,159))})`}><polygon points={star(0,0,480,205,16)} fill="#dc7557" stroke={INK} strokeWidth="4"/><polygon points={star(0,0,340,133,15)} fill="#f7d847" stroke="#d49b38" strokeWidth="4"/></g></g>;
 else if(f<188)scene=<><Background ground={820}/><g data-bench-object="clapper.first"><Clapper x="540" y={580-mix(0,980,smooth(f,181,190))} s={mix(.91,.88,smooth(f,159,170))} open={f<162?mix(26,0,smooth(f,159,162)):0}/></g></>;
 else if(f<238)scene=<FirstGauge f={f}/>;
 else if(f<263)scene=<FirstDirector f={f}/>;
 else if(f<283)scene=<Network f={f}/>;
 else if(f<299)scene=<Panels f={f} cols={2} id="split.two"/>;
 else if(f<327)scene=<FourPanels f={f}/>;
 else if(f<403)scene=<Panels f={f} cols={3} id="grid.nine"/>;
 else if(f<435)scene=<FilmStrip f={f}/>;
 else if(f<481)scene=<FilmStrip f={f} stunt/>;
 else if(f<542)scene=<Burst f={f}/>;
 else if(f<598)scene=<Smoke f={f}/>;
 else if(f<639)scene=<GaugeClose f={f}/>;
 else if(f<660)scene=<Happy f={f}/>;
 else if(f<686)scene=<Return f={f}/>;
 else if(f<744)scene=<Again f={f}/>;
 else if(f<837)scene=<Finale f={f}/>;
 else if(f<875)scene=<><Background ground={820}/><g data-bench-object="clapper.last"><Clapper x={mix(1330,540,smooth(f,837,844))} y="580" s={f<860?.88:mix(.88,1.55,smooth(f,860,872))} open={mix(32,0,smooth(f,850,860))} last={f>863}/></g></>;
 else scene=<rect width="1080" height="1080" fill="#10222d"/>;
 return <AbsoluteFill style={{background:PAPER}}><Audio src={staticFile('audio.wav')}/><svg width="1080" height="1080" viewBox="0 0 1080 1080" style={{width:'100%',height:'100%'}}><Defs/>{scene}</svg></AbsoluteFill>
}
