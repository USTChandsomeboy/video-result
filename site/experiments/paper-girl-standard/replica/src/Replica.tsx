import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {C,Defs,Texture,Sky,Moon,Sun,Girl,Room,WideHouse,Town,Plane,Pen,Lines,Words,Letter,Stamp,between,mix,ease} from './Art';
import {Montage,HeartScene} from './Montage';

function Trail({d,color='#e4e8d5',width=1.5,progress=1}:{d:string,color?:string,width?:number,progress?:number}){return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray="7 5" opacity={progress}/>}
function OpeningPlanes({t}:{t:number}){const phase=(t>=27?t-27:t)*.85;const routes=[{x:448,y:528,dx:120,dy:-370,s:.54},{x:511,y:620,dx:38,dy:-410,s:.56},{x:682,y:524,dx:-117,dy:-300,s:.48}];return <g data-bench-object="opening.planes">{routes.map((p,i)=>{const q=(phase+i*.29)%1,x=p.x+q*p.dx,y=p.y+q*p.dy;return <g key={i}><Trail d={`M${p.x-7} ${p.y+100}Q${p.x+p.dx*.5} ${p.y+20} ${x} ${y}`} progress={.6}/><Plane x={x} y={y} s={p.s} angle={i===2?-24:-15}/></g>})}</g>}
function WideScene({t}:{t:number}){const ending=t>=24&&t<26;const back=t>=20&&t<21;const returnP=between(t,20,21);const pose=back&&t>20.55?'catch':ending&&t>24.4?'wave':ending?'hold':'idle';return <>
 <Sky/><Moon x={63} y={105} s={.96}/><Town lit={ending}/>
 <WideHouse t={t} pose={pose} mood={ending?'happy':'smile'} note={ending} pen={!back&&!ending}/>
 <Sun x={476} y={166} s={.99} mood={ending?'happy':'smile'} radiant rotation={Math.sin(t*.9)*7}/>
 {(t<1.25||t>=27)&&<OpeningPlanes t={t}/>}
 {back&&<><Trail d="M468 267Q471 359 394 403Q317 446 263 493"/><Plane id="return.plane" x={mix(469,261,ease(returnP))} y={mix(279,493,ease(returnP))} angle={mix(135,160,returnP)} s={.58}/></>}
 {ending&&<g data-bench-object="wave.trails"><Trail d="M470 261Q437 346 475 435T686 559" progress={.68}/><Trail d="M474 266Q578 352 552 449" progress={.6}/></g>}
 </>}

function Ideas({t}:{t:number}){const first=t<2,throwing=t>=5.25&&t<6,returning=t>=21&&t<22,pinning=t>=26;let pose:any='idle',mood:any='smile',note=false,pen=false;let x=286,y=274;
 if(first){pen=true;if(t<1.65)mood='closed';else {pose='idea';mood='shock'}}
 if(throwing){if(t<5.44)pose='ready';else if(t<5.75){pose='throw';mood='shock'}else pose='clasp'}
 if(returning){pose='read';note=true;mood=t>21.5?'shock':'smile'}
 if(t>=22.75&&t<24){pose=t>23.45?'hug':'hold';note=true;mood=t>23.2?'closed':'happy'}
 if(pinning){x=242;y=295;if(t<26.45)pose='pin';else{pose='clasp';mood='happy'}}
 return <Room><g>
  {first&&<g transform="translate(390 612)"><rect width="42" height="15" fill="#503583" stroke={C.cream}/><path d="M0 6H42" stroke={C.cream}/></g>}
  <Girl x={x} y={y} t={t} pose={pose} mood={mood} pen={pen} note={note} throwP={between(t,5.44,5.75)}/>
  {first&&t>1.7&&<g stroke={C.cream} strokeWidth="6" strokeLinecap="round" opacity={Math.min(1,(t-1.7)*8)}>{Array.from({length:7},(_,i)=><path key={i} d="M0-123v-29" transform={`translate(286 278) rotate(${-60+i*20})`}/>)}</g>}
  {throwing&&t<5.48&&<Plane x={399} y={371} s={.6} angle={65}/>}
  {throwing&&t>=5.45&&<g data-bench-object="throw.trail"><path d="M409 427Q555 282 720 31" fill="none" stroke={C.blue} strokeWidth="2.8" strokeDasharray="13 9"/>{t<5.68&&<Plane x={mix(407,771,between(t,5.45,5.68))} y={mix(412,-60,between(t,5.45,5.68))} s={.58} angle={-8}/>}</g>}
  {t>=23.28&&t<24&&<g>{[[-165,-15,'#ed8fa6'],[164,8,'#d94a3e']].map(([dx,dy,color],i)=>{const xx=286+(dx as number),yy=274+(dy as number)-(t-23.28)*30;return <path key={i} d="M0 16C-35-8-22-29-8-16Q0-8 0-6Q12-31 26-19Q45-1 0 16Z" fill={color as string} stroke={C.cream} strokeWidth="2" transform={`translate(${xx} ${yy}) scale(.65)`}/>})}</g>}
  {pinning&&<g data-bench-object="pin.note" transform={`translate(445 ${t<26.17?mix(350,295,between(t,26,26.17)):295}) rotate(-1)`}><Letter w={193} h={144} circle/><path d="M-9-5L14-17L20-2L-3 10ZM174-5L195-17L207-2L186 9Z" fill="#efe1a4" opacity=".9"/>{t<26.5&&<g stroke="#d18c4f" strokeWidth="2">{Array.from({length:8},(_,i)=><path key={i} d="M0-91v-20" transform={`translate(94 72) rotate(${i*45})`}/>)}</g>}</g>}
 </g></Room>
}

function Pencils(){return <g stroke={C.cream} strokeWidth="1.7" strokeLinecap="round"><path d="M632 697L755 625" stroke="#df5951" strokeWidth="15"/><path d="M652 683L769 612" stroke="#f3bf4c" strokeWidth="14"/><path d="M675 714L779 654" stroke="#5da448" strokeWidth="14"/></g>}
function Table(){return <><rect width="720" height="720" fill="#ad753b"/><circle cx="366" cy="330" r="304" fill="#d5ab57" stroke={C.cream} strokeWidth="2" filter="url(#rough)"/></>}
function Notebook({t}:{t:number}){const p1=between(t,2.02,2.79),p2=between(t,3.03,4.00),tearing=t>=4.18;const zoom=t<3?mix(1,1.4,ease(between(t,2.84,3))):t<3.85?1.4:mix(1.4,1,ease(between(t,3.85,4.08)));const textX=156,firstWidth=319,secondX=127,secondWidth=389;
 let pointX=0,pointY=0;if(t<3.03){pointX=textX+firstWidth*p1;pointY=348+Math.sin(p1*45)*9;}else{pointX=secondX+secondWidth*p2;pointY=493+Math.sin(p2*50)*9;}
 const sleeveX=pointX+83,sleeveY=pointY-75;const tearY=mix(0,24,between(t,4.18,4.5)),tearAngle=-3*between(t,4.18,4.5);
 const content=<><path d="M98 200H638V641H98Z" fill={C.cream} filter="url(#rough)"/><Lines x={98} y={200} w={540} h={438} step={60} red/>
  <defs><clipPath id="first-reveal"><rect x={textX-9} y="265" width={firstWidth*p1+9} height="111"/></clipPath><clipPath id="second-reveal"><rect x={secondX-10} y="406" width={secondWidth*p2+10} height="130"/></clipPath></defs>
  <text data-bench-object="writing.first" x={textX} y="359" fontFamily="Patrick Hand" fontSize="118" textLength="319" lengthAdjust="spacingAndGlyphs" fill={C.blue} stroke={C.blue} strokeWidth="5.4" clipPath="url(#first-reveal)">what do</text>
  {p2>0&&<text data-bench-object="writing.second" x={secondX} y="503" fontFamily="Patrick Hand" fontSize="123" textLength="389" lengthAdjust="spacingAndGlyphs" fill={C.blue} stroke={C.blue} strokeWidth="5.4" clipPath="url(#second-reveal)">you love?</text>}
 </>;
 return <><Table/><g transform={`translate(360 375) scale(${zoom}) translate(-360 -375)`}>
  <g data-bench-object="notebook.page"><path d="M68 179H662V671H68Z" fill="#583081" stroke={C.cream} strokeWidth="2" filter="url(#rough)"/>{!tearing?content:<><rect x="98" y="200" width="540" height="441" fill={C.cream}/><Lines x={98} y={200} w={540} h={438} step={60} red/></>}
  {Array.from({length:18},(_,i)=>{const x=115+i*29.5;return <g key={i}><ellipse cx={x} cy="209" rx="3.5" ry="5" fill="#625876"/><path d={`M${x} 210C${x-14} 201 ${x-14} 173 ${x+2} 176`} fill="none" stroke="#b9b9ac" strokeWidth="7"/><path d={`M${x} 210C${x-14} 201 ${x-14} 173 ${x+2} 176`} fill="none" stroke="#73778f" strokeWidth="2"/></g>})}</g>
  {tearing&&<g data-bench-object="writing.tear" transform={`translate(0 ${tearY}) rotate(${tearAngle} 100 200)`}>{content}{Array.from({length:12},(_,i)=><circle key={i} cx={130+i*43} cy="184" r="9" fill={C.cream}/>)} </g>}
  {t<4.035&&<g data-bench-object="writing.arm"><Pen x={pointX} y={pointY} angle={-28} s={1.07}/><path d={`M${sleeveX+27} ${sleeveY+34}L${sleeveX+75} ${sleeveY+5}L895 780L820 847Z`} fill={C.green} stroke={C.cream} strokeWidth="2"/><path d={`M${sleeveX+27} ${sleeveY+34}L${sleeveX+75} ${sleeveY+5}L895 780L820 847Z`} fill="url(#knit)" stroke="none"/><path d={`M${sleeveX+15} ${sleeveY+19}L${sleeveX+68} ${sleeveY-12}L${sleeveX+86} ${sleeveY+15}L${sleeveX+32} ${sleeveY+48}Z`} fill="#258d79" stroke={C.cream} strokeWidth="1.4"/><ellipse cx={sleeveX} cy={sleeveY-9} rx="44" ry="47" fill={C.skin} filter="url(#rough)"/><path d={`M${sleeveX-18} ${sleeveY-48}q-3 18 10 22M${sleeveX+1} ${sleeveY-54}q-3 18 10 24M${sleeveX+18} ${sleeveY-50}q-1 13 9 19`} fill="none" stroke="#d49c72" strokeWidth="2"/></g>}
  {tearing&&<g fill={C.skin} stroke={C.cream} strokeWidth="1.5"><path d="M-60 690L97 435L129 468L-18 720Z" fill={C.green}/><circle cx="104" cy="440" r="27"/><path d="M740 375L666 240L689 211L778 364Z" fill={C.green}/><circle cx="649" cy="199" r="27"/></g>}
 </g><Pencils/></>}

function Folding({t}:{t:number}){const a=between(t,4.5,4.77),b=between(t,4.77,5.05),c=between(t,5.05,5.25);const cornery=mix(165,337,a),left=mix(240,325,c),right=mix(480,395,c);const paper=`M360 165L${right} ${cornery}L${right} 621H${left}V${cornery}Z`;const handY=mix(302,488,between(t,4.5,5.25)),handL=mix(286,312,between(t,4.5,5.25)),handR=720-handL;
 return <><Table/><g data-bench-object="folding.paper"><defs><clipPath id="fold-paper"><path d={paper}/></clipPath></defs><path d={paper} fill={C.cream} stroke="#fff9e9" strokeWidth="1.5" filter="url(#rough)"/>
 <g clipPath="url(#fold-paper)"><Lines x={230} y={166} w={260} h={454} step={37}/><path d="M360 165V620" stroke="#4d5368" strokeWidth="1.8"/>{b>0&&<><path d={`M360 165L${mix(240,263,b)} ${mix(337,477,b)}L${mix(240,328,b)} 337Z`} fill="#dfdec7" stroke="#e2e0c9" strokeWidth="1"/><path d={`M360 165L${mix(480,457,b)} ${mix(337,477,b)}L${mix(480,392,b)} 337Z`} fill="#e6e3cc" stroke="#e2e0c9" strokeWidth="1"/></>}<path d="M310 461L351 454" stroke={C.blue} strokeWidth="7" strokeLinecap="round"/></g>
 {a>.5&&<path d={`M${left-40} 337H${right+40}`} stroke="#897441" strokeWidth="1.2" opacity={1-b}/>}</g>
 <g data-bench-object="folding.hands">{[false,true].map((r,i)=>{const hx=r?handR:handL,sg=r?-1:1;return <g key={i}><path d={`M${r?743:-23} 720L${hx-42*sg} ${handY+27}L${hx+23*sg} ${handY+66}L${r?688:32} 748Z`} fill={C.green} stroke={C.cream} strokeWidth="2"/><path d={`M${r?743:-23} 720L${hx-42*sg} ${handY+27}L${hx+23*sg} ${handY+66}L${r?688:32} 748Z`} fill="url(#knit)"/><path d={`M${hx-48*sg} ${handY+22}L${hx-17*sg} ${handY-5}L${hx+43*sg} ${handY+47}L${hx+17*sg} ${handY+72}Z`} fill="#248d78" stroke={C.cream} strokeWidth="1.2"/>{Array.from({length:6},(_,n)=><path key={n} d={`M${hx+sg*(-40+n*9)} ${handY+15+n*7}l${-sg*14} 18`} stroke="#177867" opacity=".6" strokeWidth="2"/>)}<circle cx={hx} cy={handY} r="28" fill={C.skin}/><ellipse cx={hx-32*sg} cy={handY-2} rx="10" ry="17" transform={`rotate(${sg*30} ${hx-32*sg} ${handY-2})`} fill={C.skin}/></g>})}</g><Pencils/></>}

function Flight({t}:{t:number}){const p=between(t,6,7);const main={x:mix(10,425,p),y:mix(598,205,p)},two={x:mix(277,626,p),y:mix(523,314,p)},three={x:mix(-75,289,p),y:mix(745,376,p)};return <><Sky variant="flight"/><Moon x={mix(188,126,p)} y={mix(262,215,p)} s={1.35}/><Town wide={false}/><Sun x={mix(602,575,p)} y={mix(91,77,p)} s={.88} radiant/><g data-bench-object="flight.trails">{[main,two,three].map((r,i)=><Trail key={i} d={`M${r.x-(i===1?230:300)} ${r.y+340}Q${r.x-125} ${r.y+130} ${r.x} ${r.y+6}`} width={1.8}/>)}</g><g data-bench-object="flight.planes"><Plane {...main} s={.95}/><Plane {...two} s={.61} angle={12}/><Plane {...three} s={.61} angle={-13}/></g></>}

function SunScene({t}:{t:number}){const read=t>=7.5&&t<10,reply=t>=18;const pull=read?ease(between(t,9,10)):0;const scale=reply?1.6:mix(2.2,1.45,pull),xx=reply?360:mix(330,360,pull),yy=reply?323:mix(302,333,pull);let mood:any='smile';if(t>=7.5&&t<8)mood='shock';else if(t>=8&&t<8.45)mood='think';else if(t>=8.45&&t<8.95)mood='squeeze';else if(t>=8.95&&t<10)mood='closed';else if(t>=18.85&&t<19.4)mood='closed';else if(t>=19.45)mood='shock';const paper=read||(reply&&t<19.45);return <><Sky variant="close"/>{reply&&<Moon x={88} y={113} s={.85}/>}
 <Sun x={xx} y={yy} s={scale} mood={mood} paper={paper} paperBack={reply&&t>=18.5} circled={reply&&t>=18.4} clasp={read&&t>=9.25} rotation={!paper?Math.sin(t*2)*3:0}/>
 {t<7.5&&<Plane id="catch.plane" x={mix(29,221,between(t,7,7.5))} y={mix(761,548,between(t,7,7.5))} s={mix(1.05,.9,between(t,7,7.5))} angle={-20}/>}
 {t>=8.08&&t<8.98&&<g data-bench-object="read.bubbles" fill={C.coral} stroke={C.cream} strokeWidth="1.5">{[[504,136,6,8.08],[531,112,10,8.28],[558,89,14,8.48]].map(([x,y,r,start],i)=>t>=start&&<circle key={i} cx={x} cy={y} r={r}/>)}</g>}
 {reply&&t>=19.43&&<Plane id="reply.plane" x={mix(314,76,between(t,19.43,20))} y={mix(554,777,between(t,19.43,20))} s={.9} angle={40}/>}
 </>}

function NoteClose({t}:{t:number}){const circle=between(t,22.00,22.35),stamp=between(t,22.23,22.6);return <><rect width="720" height="720" fill={C.yellow}/><g transform="rotate(-2 360 377)"><path d="M110 198L656 198L656 600L110 600Z" fill="#cc941a" opacity=".7"/>
 <path d="M92 168H638V577H92Z" fill={C.cream} filter="url(#rough)"/><Lines x={92} y={168} w={546} h={405} step={49} red/>
 <g data-bench-object="note.words"><Words x={154} y={344} size={117} gap={1.02}/></g>
 <path data-bench-object="note.circle" d="M288 393C208 372 121 405 133 443C149 496 337 501 349 432" fill="none" stroke="#d6574d" strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-circle}/>
 {stamp>0&&<g opacity={stamp}><Stamp x={589} y={509} s={.94}/><g stroke="#d56b53" strokeWidth="2.4">{Array.from({length:6},(_,i)=><path key={i} d="M0-48v-20" transform={`translate(589 509) rotate(${-56+i*22})`}/>)}</g></g>}
 </g><g stroke={C.cream} strokeWidth="2"><path d="M-20 612L85 561L126 633L37 681H-20Z" fill={C.green}/><path d="M740 612L636 561L594 633L683 681H740Z" fill={C.green}/><ellipse cx="111" cy="579" rx="54" ry="40" fill={C.skin}/><ellipse cx="608" cy="579" rx="54" ry="40" fill={C.skin}/></g></>}

export function FrameScene({frame}:{frame:number}){const t=frame/24;let scene:React.ReactNode;
 if(t<1.25)scene=<WideScene t={t}/>;
 else if(t<2)scene=<Ideas t={t}/>;
 else if(t<4.5)scene=<Notebook t={t}/>;
 else if(t<5.25)scene=<Folding t={t}/>;
 else if(t<6)scene=<Ideas t={t}/>;
 else if(t<7)scene=<Flight t={t}/>;
 else if(t<10)scene=<SunScene t={t}/>;
 else if(t<16)scene=<Montage time={t}/>;
 else if(t<18)scene=<HeartScene time={t}/>;
 else if(t<20)scene=<SunScene t={t}/>;
 else if(t<21)scene=<WideScene t={t}/>;
 else if(t<22)scene=<Ideas t={t}/>;
 else if(t<22.75)scene=<NoteClose t={t}/>;
 else if(t<24)scene=<Ideas t={t}/>;
 else if(t<26)scene=<WideScene t={t}/>;
 else if(t<27)scene=<Ideas t={t}/>;
 else scene=<WideScene t={t}/>;
 return <svg width="720" height="720" viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg" style={{overflow:'hidden'}}><Defs/>{scene}<Texture/></svg>
}

export function Replica(){const frame=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:C.night}}><Audio src={staticFile('audio.wav')}/><FrameScene frame={frame}/></AbsoluteFill>}
