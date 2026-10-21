import React from 'react';

export const C={cream:'#f5f1d9',blue:'#355db5',night:'#252d79',coral:'#ed795d',green:'#229b83',skin:'#e9ad82',pink:'#ed8b9d',yellow:'#f5ca3e',ink:'#241e25'};
export const clamp=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const ease=(n:number)=>{const x=clamp(n);return x*x*(3-2*x)};
export const between=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
export const rand=(n:number)=>{const k=Math.sin(n*78.233+2.7)*43758.5453;return k-Math.floor(k)};
export function Defs(){return <defs>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".013 .055" numOctaves="3" seed="18"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="2.2" intercept="-.6"/><feFuncG type="linear" slope="2.2" intercept="-.6"/><feFuncB type="linear" slope="2.2" intercept="-.6"/></feComponentTransfer><feGaussianBlur stdDeviation="1.25"/></filter>
  <filter id="rough" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".16" numOctaves="2" seed="8" result="f"/><feDisplacementMap in="SourceGraphic" in2="f" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>
  <pattern id="script" width="170" height="24" patternUnits="userSpaceOnUse"><text x="0" y="9" fontFamily="Patrick Hand" fontSize="8" fill="#8b815e" opacity=".28">the little things we love and all the stars</text><text x="-25" y="21" fontFamily="Patrick Hand" fontSize="8" fill="#8b815e" opacity=".26">every day a new story in the world around us</text></pattern>
  <pattern id="news" width="96" height="16" patternUnits="userSpaceOnUse"><rect width="96" height="16" fill="#efefdf"/><text x="0" y="6" fontFamily="serif" fontSize="4.7" fill="#777971" opacity=".7">all the world and wonderful things in it</text><text x="-9" y="13" fontFamily="serif" fontSize="4.7" fill="#777971" opacity=".65">a letter to the sun a little story to tell</text></pattern>
  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#82aa8e" strokeWidth=".45"/></pattern>
  <pattern id="knit" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".65" fill="#126c5b" opacity=".34"/><circle cx="4.5" cy="4.5" r=".65" fill="#126c5b" opacity=".34"/></pattern>
 </defs>}
export function Texture(){return <rect width="720" height="720" filter="url(#grain)" opacity=".32" style={{mixBlendMode:'soft-light'}}/>}
export function Star({x,y,r=4,fill='#f0d368'}:{x:number,y:number,r?:number,fill?:string}){const pts=Array.from({length:10},(_,i)=>{const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.43:r;return `${x+Math.cos(a)*rr},${y+Math.sin(a)*rr}`}).join(' ');return <polygon points={pts} fill={fill}/>}
const wave=(y:number,seed:number)=>{let d=`M-10 ${y}`;for(let x=0;x<=740;x+=8)d+=`L${x} ${y+Math.sin(x*.019+seed)*9+(rand(x+seed)-.5)*5}`;return d};
export function Sky({variant='wide'}:{variant?:'wide'|'close'|'flight'}){const close=variant==='close',flight=variant==='flight';return <g>
 <rect width="720" height="720" fill={C.night}/><path d={`${wave(close?200:flight?210:212,3)}L740 720H-10Z`} fill="#2c3584"/><path d={`${wave(close?367:flight?393:374,7)}L740 720H-10Z`} fill="#303d91"/>
 {[0,1].map(i=><path key={i} d={wave(i?close?367:flight?393:374:close?200:flight?210:212,i?7:3)} fill="none" stroke={C.cream} strokeWidth="1.8" filter="url(#rough)"/>)}
 {Array.from({length:47},(_,i)=>{const x=22+rand(i+22)*682,y=12+rand(i+70)*(close?650:540);return i%4===0?<g key={i} opacity=".45" stroke="#b4ccdc" strokeWidth="1"><path d={`M${x-4} ${y}h8M${x} ${y-4}v8`}/></g>:<Star key={i} x={x} y={y} r={i%7===0?6.5:3+rand(i+12)*2} fill={i%3===0?'#bbab65':'#ead67b'}/>})}
 </g>}
export function Moon({x=76,y=109,s=1}:{x?:number,y?:number,s?:number}){return <g data-bench-object="sky.moon" transform={`translate(${x} ${y}) scale(${s})`} filter="url(#rough)"><path d="M22-44C-5-34-20-7-13 18C-6 45 20 54 45 35C14 44-1 27 0 5C0-15 8-32 22-44Z" fill={C.cream}/></g>}
export function Plane({x,y,s=1,angle=0,id}:{x:number,y:number,s?:number,angle?:number,id?:string}){return <g data-bench-object={id} transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}><path d="M-35 10L33-31L7 29L-1 9Z" fill={C.cream} stroke="#f8f5e5" strokeWidth="1.4"/><path d="M-35 10L33-31L-1 9Z" fill="#fffced"/><path d="M-1 9L33-31L7 29Z" fill="#dfdfd2"/><path d="M-1 9L33-31" fill="none" stroke="#aaa995" strokeWidth=".65"/><path d="M-1 9L-8 20L-6 7" fill="#f9f7e6"/></g>}
export function Pen({x=0,y=0,angle=-28,s=1}:{x?:number,y?:number,angle?:number,s?:number}){return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}><path d="M-10 0L3-7V7Z" fill={C.cream} stroke={C.cream} strokeWidth="1.5"/><rect x="1" y="-7" width="128" height="14" rx="7" fill={C.blue} stroke={C.cream} strokeWidth="1.4"/><path d="M-10 0L-4-2V2Z" fill={C.blue}/></g>}
export function Lines({x,y,w,h,step=30,red=false}:{x:number,y:number,w:number,h:number,step?:number,red?:boolean}){return <g opacity=".65">{Array.from({length:Math.ceil(h/step)},(_,i)=><path key={i} d={`M${x} ${y+(i+1)*step}H${x+w}`} stroke="#7498c9" strokeWidth="1.25"/>)}{red&&<path d={`M${x+42} ${y}V${y+h}`} stroke="#dd8c8c" strokeWidth="1.25"/>}</g>}
export function Words({x=0,y=0,size=54,opacity=1,back=false,gap=1.3}:{x?:number,y?:number,size?:number,opacity?:number,back?:boolean,gap?:number}){return <g transform={`translate(${x} ${y}) ${back?'scale(-1 1)':''}`} opacity={opacity} fill={C.blue} stroke={C.blue} strokeWidth={size*.04} paintOrder="stroke" fontFamily="Patrick Hand" fontSize={size}><text x="0" y="0">what do</text><text x="-2" y={size*gap}>you love?</text></g>}
export function Stamp({x,y,s=1}:{x:number,y:number,s?:number}){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#d76652" strokeWidth="2.5">{Array.from({length:12},(_,i)=><path key={i} d="M0-6V-28" transform={`rotate(${i*30})`}/>)}<circle r="5" fill="none"/></g>}
export function Letter({x=0,y=0,w=240,h=180,back=false,circle=false,words=true,id}:{x?:number,y?:number,w?:number,h?:number,back?:boolean,circle?:boolean,words?:boolean,id?:string}){return <g data-bench-object={id} transform={`translate(${x} ${y})`}><path d={`M0 0L${w} 0L${w} ${h}L0 ${h}Z`} fill={C.cream} filter="url(#rough)"/><Lines x={0} y={0} w={w} h={h-10} step={h/9}/>{words&&<g transform={back?`translate(${w-14} 0) scale(-1 1)`:undefined}><Words x={w*.1} y={h*.325} size={w*.18} gap={1.55} opacity={back?.42:1}/>{circle&&<ellipse cx={w*.31} cy={h*.61} rx={w*.21} ry={h*.105} transform={`rotate(-9 ${w*.31} ${h*.61})`} fill="none" stroke="#d8594f" strokeWidth={w*.009}/>}{circle&&<Stamp x={w*.88} y={h*.86} s={w/950}/>}</g>}</g>}
function sunPath(){const rays=12,step=Math.PI*2/rays;let d='';for(let i=0;i<rays;i++){const a=-Math.PI/2+i*step,rr=[123,114,117,113,116,114,117,112,115,112,114,113][i],w=12.8;const p=(r:number,b:number)=>[Math.cos(b)*r,Math.sin(b)*r];const va=p(42,a-step/2),ce=p(rr-w,a),tan=[-Math.sin(a)*w,Math.cos(a)*w];d+=`${i?'L':'M'}${va[0]} ${va[1]}L${ce[0]-tan[0]} ${ce[1]-tan[1]}A${w} ${w} 0 0 1 ${ce[0]+tan[0]} ${ce[1]+tan[1]}`;const vb=p(42,a+step/2);d+=`L${vb[0]} ${vb[1]}`;}return d+'Z'}
type Mood='smile'|'shock'|'think'|'squeeze'|'closed'|'happy';
export function Sun({x,y,s=1,mood='smile',paper=false,paperBack=false,circled=false,clasp=false,radiant=false,rotation=0,children}:{x:number,y:number,s?:number,mood?:Mood,paper?:boolean,paperBack?:boolean,circled?:boolean,clasp?:boolean,radiant?:boolean,rotation?:number,children?:React.ReactNode}){return <g data-bench-object="sun.figure" transform={`translate(${x} ${y}) scale(${s})`}>
 {radiant&&<g stroke="#e9d067" strokeWidth="1.7" opacity=".95">{Array.from({length:21},(_,i)=><path key={i} d="M0-130V-145" transform={`rotate(${i*360/21+rotation*.3})`}/>)}</g>}
 {paper&&<g fill={C.coral} stroke={C.cream} strokeWidth="3.5" strokeLinejoin="round"><path d="M-34 142L-39 204Q-36 221-22 219Q-11 216-12 204L-9 143Z"/><path d="M10 143L16 206Q17 220 30 219Q42 217 39 205L34 143Z"/></g>}
 <path d={sunPath()} transform={`rotate(${rotation})`} fill={C.coral} stroke={C.cream} strokeWidth="3.6" strokeLinejoin="round" filter="url(#rough)"/>
 <g data-bench-object="sun.face" fill={C.ink} stroke={C.ink} strokeLinecap="round" strokeWidth="2.3">
  <circle cx="-26" cy="12" r="6.8" fill="#f1a095" stroke="none"/><circle cx="26" cy="12" r="6.8" fill="#f1a095" stroke="none"/>
  {(mood==='closed'||mood==='happy')?<><path d={mood==='happy'?'M-20-3q6-8 12 0M8-3q6-8 12 0':'M-20-3q6 6 12 0M8-3q6 6 12 0'} fill="none"/></>:mood==='squeeze'?<path d="M-20-7L-12-2L-20 3M20-7L12-2L20 3" fill="none"/>:<><circle cx="-14" cy="0" r="5.9" stroke="none"/><circle cx="14" cy="0" r="5.9" stroke="none"/><circle cx="-12" cy="-2" r="1.7" fill="#fffce9" stroke="none"/><circle cx="16" cy="-2" r="1.7" fill="#fffce9" stroke="none"/></>}
  {mood==='shock'?<ellipse cx="0" cy="17" rx="3.8" ry="5.1" stroke="none"/>:mood==='think'?<path d="M-7 17q3-5 7 0t7 0" fill="none"/>:mood==='squeeze'?<path d="M-6 16H6" fill="none"/>:<path d="M-10 13Q0 25 10 13" fill="none"/>}
 </g>
 {paper&&<Letter x={-72} y={58} w={144} h={123} back={paperBack} circle={circled} id="sun.paper"/>}
 {paper&&!clasp&&<g fill={C.coral} stroke={C.cream} strokeWidth="3.5" filter="url(#rough)"><circle cx="-64" cy="64" r="14"/><circle cx="64" cy="64" r="14"/></g>}
 {paper&&clasp&&<g fill="none" strokeLinecap="round"><path d="M-75 72Q-26 104-9 58M75 72Q26 104 9 58" stroke={C.cream} strokeWidth="24"/><path d="M-75 72Q-26 104-9 58M75 72Q26 104 9 58" stroke={C.coral} strokeWidth="20"/></g>}{children}
 </g>}
type Pose='idle'|'idea'|'ready'|'throw'|'clasp'|'catch'|'read'|'hold'|'hug'|'wave'|'pin';
function Limb({d}:{d:string}){return <><path d={d} fill="none" stroke={C.cream} strokeWidth="41" strokeLinecap="round"/><path d={d} fill="none" stroke={C.green} strokeWidth="37" strokeLinecap="round"/></>}
export function Girl({x=286,y=274,s=1,t=0,pose='idle',mood='smile',pen=false,note=false,throwP=0}:{x?:number,y?:number,s?:number,t?:number,pose?:Pose,mood?:Mood,pen?:boolean,note?:boolean,throwP?:number}){
 let left='M-80 222C-99 284-74 323-29 338',right='M80 222C99 284 74 323 29 338';let lh=[-29,338],rh=[29,338];
 if(pose==='idea'){right='M80 223Q112 282 112 234';rh=[112,234]}
 if(pose==='ready'||pose==='catch'){right='M80 223Q134 209 104 92';rh=[104,92]}
 if(pose==='throw'){const px=mix(110,117,throwP),py=mix(96,226,throwP);right=`M80 223Q126 270 ${px} ${py}`;rh=[px,py]}
 if(pose==='clasp'){left='M-80 222Q-60 295-17 201';right='M80 222Q60 295 17 201';lh=[-17,201];rh=[17,201]}
 if(pose==='read'||pose==='hold'){left='M-80 222Q-111 278-63 277';right='M80 222Q111 278 63 277';lh=[-63,277];rh=[63,277]}
 if(pose==='hug'){left='M-80 222Q-93 309-17 286';right='M80 222Q93 309 17 286';lh=[-17,286];rh=[17,286]}
 if(pose==='wave'){const wig=Math.sin(t*14)*7;left='M-80 222Q-105 321-43 321';lh=[-43,321];rh=[120+wig,106];right=`M80 222Q122 226 ${rh[0]} ${rh[1]}`}
 if(pose==='pin'){left='M-80 222Q-110 320-44 338';lh=[-44,338];right='M80 222Q144 218 210 164';rh=[210,164]}
 const body='M-108 362L-106 236Q-108 199-66 190L-40 186H41L69 192Q109 201 107 241L108 362Z';
 return <g data-bench-object="girl.figure" transform={`translate(${x} ${y}) scale(${s})`}>
  <path d={body} fill={C.green} stroke={C.cream} strokeWidth="2.2" filter="url(#rough)"/>
  <g data-bench-object="girl.head"><path d="M-94 190Q-106 110-82 57Q-54-7 9 0Q87 3 96 76Q103 119 96 190Z" fill="#241e23" stroke={C.cream} strokeWidth="2.2" filter="url(#rough)"/>
   <path d="M-38 63Q-65 77-67 117Q-71 159-35 178Q0 197 34 178Q72 158 63 116Q59 82 39 63Z" fill={C.skin} stroke={C.cream} strokeWidth="2" filter="url(#rough)"/>
   <rect x="32" y="45" width="40" height="20" rx="1" transform="rotate(-23 32 45)" fill="#f5d56f" stroke={C.cream} strokeWidth="2"/>
   <g data-bench-object="girl.face" fill={C.ink} stroke={C.ink} strokeWidth="2.4" strokeLinecap="round"><circle cx="-43" cy="133" r="12" fill="#eda2a3" opacity=".9" stroke="none"/><circle cx="43" cy="133" r="12" fill="#eda2a3" opacity=".9" stroke="none"/>
    {(mood==='closed'||mood==='happy')?<path d={mood==='happy'?'M-32 104q9-9 18 0M14 104q9-9 18 0':'M-32 103q9 8 18 0M14 103q9 8 18 0'} fill="none"/>:<><ellipse cx="-23" cy="104" rx="4.5" ry="6.1" stroke="none"/><ellipse cx="23" cy="104" rx="4.5" ry="6.1" stroke="none"/><circle cx="-24" cy="102" r="1.4" fill={C.cream} stroke="none"/><circle cx="22" cy="102" r="1.4" fill={C.cream} stroke="none"/></>}
    {mood==='shock'?<ellipse cx="0" cy="135" rx="4" ry="5.8" stroke="none"/>:mood==='happy'?<path d="M-11 130H11Q8 148 0 148Q-9 147-11 130Z" fill="#672f32" stroke="none"/>:<path d="M-9 130Q0 139 9 130" fill="none"/>}
   </g>
  </g>
  <path d="M-44 186Q-38 225 0 201Q35 225 45 186Q20 192 0 185Q-20 193-44 186Z" fill="#fffcec" stroke={C.cream} strokeWidth="1"/>
  {note&&<Letter x={pose==='hug'?-101:-116} y={pose==='hug'?215:190} w={pose==='hug'?202:232} h={176} back circle id="girl.note"/>}
  <g data-bench-object="girl.arms"><Limb d={left}/><Limb d={right}/><g fill={C.skin} stroke={C.cream} strokeWidth="2.1"><circle cx={lh[0]} cy={lh[1]} r="15"/><circle cx={rh[0]} cy={rh[1]} r="15"/></g></g>
  {pen&&<g data-bench-object="girl.pen"><Pen x={rh[0]+9} y={rh[1]+4} s={.36} angle={213}/></g>}
 </g>
}
export function Plant({x=609,y=548,s=1}:{x?:number,y?:number,s?:number}){return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.cream} strokeWidth="1.5"><path d="M-2 6L3-52M-3 4Q-40-10-27-40Q-5-30-2 6M2 2Q13-27 37-34Q37-11 2 2" fill="#54a74d"/><path d="M-30 0H34L26 75H-23Z" fill="#b87537"/><path d="M-34-3H36V9H-34Z" fill="#a86c34"/><g transform="translate(3 -54)"><path d="M0-12C9-19 19-9 12-2C23 5 11 18 3 10C-5 20-18 7-10 1C-20-7-8-18 0-12Z" fill="#d25948"/><circle r="5" fill="#f1c44c" stroke="none"/></g></g>}
export function Room({children,poster=true}:{children?:React.ReactNode,poster?:boolean}){return <g><rect width="720" height="720" fill="#e9e6c9"/><rect width="720" height="720" fill="url(#script)"/><rect x="29" y="16" width="664" height="607" fill={C.yellow}/><path d="M29 16H119Q22 310 118 622H29ZM603 16H693V622H604Q695 310 603 16Z" fill="#ed849d" stroke={C.cream} strokeWidth="2" filter="url(#rough)"/>
 {poster&&<g transform="translate(485 95) rotate(1)"><path d="M0 0L110 2L109 131L-3 127Z" fill={C.cream} filter="url(#rough)"/><rect x="30" y="-6" width="42" height="16" fill="#efe3a2" opacity=".9"/><Stamp x={54} y={55} s={1.07}/><path d="M20 102H88" stroke="#69a454" strokeWidth="2.5"/></g>}
 <rect x="0" y="621" width="720" height="46" fill="#c59a61" stroke={C.cream} strokeWidth="1"/><rect x="0" y="666" width="720" height="54" fill="#4e2e80"/><rect x="0" y="666" width="720" height="54" fill="url(#script)" opacity=".4"/>
 {children}<Plant/>
 </g>}
function CatSilhouette({x,y,s=1}:{x:number,y:number,s?:number}){return <g transform={`translate(${x} ${y}) scale(${s})`} fill="#121733" stroke={C.cream} strokeWidth="1.5"><path d="M-8 0Q-20-8-10-22L-12-36L-4-32L3-38L7-23Q18-11 8 1Q-1 10-8 0Z"/><path d="M5 2Q31 8 27-19" fill="none" stroke={C.cream} strokeWidth="5"/><path d="M5 2Q31 8 27-19" fill="none" stroke="#121733" strokeWidth="2.5"/></g>}
export function Town({wide=true,lit=false}:{wide?:boolean,lit?:boolean}){const builds=wide?[{x:435,y:621,w:67,h:99,r:50},{x:504,y:634,w:101,h:86,r:0},{x:548,y:498,w:83,h:222,r:81},{x:584,y:536,w:75,h:184,r:55},{x:661,y:517,w:77,h:203,r:51},{x:610,y:605,w:122,h:115,r:65}]:[{x:-13,y:590,w:84,h:130,r:59},{x:85,y:549,w:83,h:171,r:81},{x:174,y:610,w:79,h:110,r:0},{x:278,y:586,w:93,h:134,r:46},{x:374,y:611,w:87,h:109,r:51},{x:467,y:568,w:82,h:152,r:73},{x:554,y:598,w:118,h:122,r:68},{x:649,y:611,w:90,h:109,r:0}];return <g data-bench-object="town.buildings">
 {builds.map((b,i)=><g key={i}><path d={`M${b.x} ${b.y}H${b.x+b.w}V720H${b.x}Z`} fill="#252c67" stroke={C.cream} strokeWidth="1.3"/>{b.r>0&&<path d={`M${b.x-2} ${b.y}L${b.x+b.w*.46} ${b.y-b.r}L${b.x+b.w+3} ${b.y}Z`} fill="#141b46" stroke={C.cream} strokeWidth="1.4"/>}<path d={`M${b.x} ${b.y}H${b.x+b.w}V720H${b.x}Z`} fill="url(#script)" opacity=".4"/>{Array.from({length:Math.floor(b.h/42)},(_,row)=>[0,1].map(col=>{const xx=b.x+13+col*(b.w-32),yy=b.y+22+row*42;return lit&&((i+row+col)%2===0)?<g key={`${row}-${col}`}><circle cx={xx+6} cy={yy+7} r="11" fill="#efd46d"/><path d={`M${xx+6} ${yy}v14M${xx} ${yy+7}h12`} stroke="#636a97" strokeWidth="1"/></g>:<g key={`${row}-${col}`}><rect x={xx} y={yy} width="12" height="16" fill="#f2cf5c"/><path d={`M${xx+6} ${yy}v16M${xx} ${yy+8}h12`} stroke="#515d88" strokeWidth="1"/></g>}))}</g>)}
 <CatSilhouette x={wide?625:337} y={wide?475:580} s={wide?.95:1.05}/></g>}
export function WideHouse({t=0,pose='idle',mood='smile',note=false,pen=false}:{t?:number,pose?:Pose,mood?:Mood,note?:boolean,pen?:boolean}){return <g>
 <path d="M-8 327L432 303V720H-8Z" fill="#593184" stroke={C.cream} strokeWidth="1.5"/><path d="M-8 327L432 303V720H-8Z" fill="url(#script)" opacity=".6"/>
 <path d="M-10 301L440 278L441 307L-10 332Z" fill="#211d4d" stroke={C.cream} strokeWidth="1.4"/>
 <rect x="48" y="385" width="300" height="286" fill="#e9e6c8" filter="url(#rough)"/><rect x="48" y="385" width="300" height="286" fill="url(#script)"/>
 <rect x="71" y="406" width="258" height="253" fill={C.yellow}/><path d="M71 406H104Q66 520 103 659H71ZM294 406H329V659H295Q337 520 294 406Z" fill="#e8889b" stroke={C.cream} strokeWidth="1.1"/>
 <Girl x={193} y={453} s={.58} t={t} pose={pose} mood={mood} note={note} pen={pen}/><Plant x={307} y={605} s={.48}/>
 <path d="M35 658H367V685H35Z" fill="#c59a62" stroke={C.cream} strokeWidth="1.5"/>
 <g stroke="#8eac50" strokeWidth="2"><path d="M22 351Q47 442 20 533T20 720" fill="none"/>{Array.from({length:10},(_,i)=>{const y=352+i*38,x=i%2?16:37;return <ellipse key={i} cx={x} cy={y} rx="10" ry="6" fill="#78ba61" stroke="#c9e09a" strokeWidth="1.6" transform={`rotate(${i%2?-28:28} ${x} ${y})`}/>})}</g>
 </g>}
