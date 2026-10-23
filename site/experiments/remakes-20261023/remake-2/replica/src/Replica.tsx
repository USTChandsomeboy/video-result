import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';

const INK='#242623', GRAY='#92958f', LINE='#e9ebe7', PAPER='#fdfdfd';
const ease=(x:number)=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
const progress=(t:number,s:number,d:number)=>Math.max(0,Math.min(1,(t-s)/d));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const pose=(t:number,start:number,dy=22,d=.35):React.CSSProperties=>{const p=ease(progress(t,start,d));return {opacity:p,transform:`translateY(${dy*(1-p)}px)`};};

function Icon({type='person',size=22,color=GRAY}:{type?:string,size?:number,color?:string}){
 let content:React.ReactNode;
 switch(type){
 case 'budget':content=<><rect x="2" y="5" width="20" height="14" rx="1" fill={color}/><circle cx="12" cy="12" r="4" fill={PAPER}/></>;break;
 case 'group':content=<><circle cx="9" cy="6" r="3" fill={color}/><circle cx="17" cy="8" r="2.5" fill={color}/><path d="M2 19v-3c0-6 14-6 14 0v3M17 13c5 0 5 3 5 6h-4" fill={color}/></>;break;
 case 'seat':content=<><path d="M6 2h12v10H6zM4 13h16v4H4zM7 17v5M17 17v5" fill={color} stroke={color} strokeWidth="1.4"/></>;break;
 case 'calendar':content=<><rect x="3" y="5" width="18" height="16" rx="1" fill="none" stroke={color} strokeWidth="2"/><path d="M3 10h18M7 2v6M17 2v6" stroke={color} strokeWidth="2"/></>;break;
 case 'note':content=<><path d="M5 2h10l5 5v15H5z" fill={color}/><path d="M8 12h9M8 16h7M15 2v5h5" fill="none" stroke={PAPER} strokeWidth="1.3"/></>;break;
 case 'margin':content=<><path d="M3 3v18h19M6 16l5-6 5 3 5-8M15 5h6v6" fill="none" stroke={color} strokeWidth="2"/></>;break;
 case 'deposit':content=<><ellipse cx="12" cy="5" rx="9" ry="3" fill={color}/><path d="M3 8c4 4 14 4 18 0v4c-4 4-14 4-18 0M3 14c4 4 14 4 18 0v4c-4 4-14 4-18 0" fill={color}/></>;break;
 case 'feedback':content=<path d="M2 10c0-10 20-10 20 0 0 6-7 9-13 7l-6 4 1-7z" fill={color}/>;break;
 case 'allergies':content=<><path d="M3 19C0 7 11 2 22 3c0 12-7 19-17 17" fill={color}/><path d="M5 19L17 8" stroke={PAPER} strokeWidth="1"/></>;break;
 case 'key':content=<><circle cx="15" cy="7" r="5" fill="none" stroke={color} strokeWidth="4"/><path d="M11 11L2 21M5 17l3 3" stroke={color} strokeWidth="4"/></>;break;
 case 'tips':content=<><path d="M2 9h20v4H2zM4 14h16v9H4zM10 8V3c-8-7-9 6 2 5 12 1 10-12 2-5v20" fill={color} stroke={PAPER} strokeWidth="1"/></>;break;
 case 'phone':content=<><rect x="6" y="1" width="12" height="22" rx="1" fill="none" stroke={color} strokeWidth="2"/><circle cx="12" cy="19" r="1" fill={color}/></>;break;
 case 'star':content=<path d="M12 0l3.5 7.7L24 9l-6 6 1.5 9L12 19.7 4.5 24 6 15 0 9l8.5-1.3z" fill={color}/>;break;
 case 'house':content=<path d="M1 11L12 1l11 10h-3v12h-6v-8h-4v8H4V11z" fill={color}/>;break;
 case 'truck':content=<><path d="M1 4h13v14H1zM15 9h5l4 5v4h-9z" fill={color}/><circle cx="6" cy="20" r="3" fill={color}/><circle cx="19" cy="20" r="3" fill={color}/></>;break;
 case 'ticket':content=<path d="M1 6h22v5a3 3 0 000 6v5H1v-5a3 3 0 000-6z" fill={color}/>;break;
 case 'table':content=<><rect x="2" y="3" width="20" height="18" fill="none" stroke={color} strokeWidth="2"/><path d="M2 9h20M10 9v12" stroke={color} strokeWidth="2"/></>;break;
 default:content=<><circle cx="12" cy="6" r="4" fill={color}/><path d="M3 23v-5c0-9 18-9 18 0v5" fill={color}/></>;
 }
 return <svg viewBox="0 0 24 24" width={size} height={size} style={{flexShrink:0,display:'inline-block',verticalAlign:'middle'}}>{content}</svg>;
}
function Lock({size=22}:{size?:number}) {return <span style={{display:'inline-flex',width:size+7,height:size+7,borderRadius:5,background:'#eeefec',alignItems:'center',justifyContent:'center',verticalAlign:'middle',flexShrink:0}}><svg width={size*.7} height={size*.7} viewBox="0 0 20 24"><path d="M5 10V6a5 5 0 0110 0v4" fill="none" stroke="#8e928c" strokeWidth="3"/><rect x="2" y="9" width="16" height="14" rx="2" fill="#8e928c"/><path d="M10 14v5" stroke="white" strokeWidth="2"/></svg></span>;}
const names=['Lena Park','Omar Haddad','Iris Novak','Theo Brandt','June Okoro'];
const groups=['Family','Friends','Work','Vendors','Friends'];
const tags=['#f8dce6','#d7ebf7','#d9ece2','#e8ddf6','#d7ebf7'];
const tagInk=['#693948','#244961','#33594a','#493364','#244961'];
const seats=['Table 2','Table 5','Table 4','Bar side','Table 5'];
const budgets=['$420','$380','$360','$1,200','$300'];
const notes=['Toast at 9pm','Bring the cake','Leaves early','Paid half','Plus-one?'];
const dates=['May 3, 2025','Apr 28, 2025','May 9, 2025','Apr 30, 2025','May 12, 2025'];
const columns:{[s:string]:{name:string,icon:string,values:string[],align?:'right'}}={guest:{name:'Guest',icon:'person',values:names},group:{name:'Group',icon:'group',values:groups},seat:{name:'Seat',icon:'seat',values:seats},budget:{name:'Budget',icon:'budget',values:budgets,align:'right'},notes:{name:'Notes',icon:'note',values:notes},rsvp:{name:'RSVP',icon:'calendar',values:dates}};

function GridTable({cols,widths,rows=5,rowH=58,font=24,locked=false,muted=false,deniedNotes=false,focused=false}:{cols:string[],widths:number[],rows?:number,rowH?:number,font?:number,locked?:boolean,muted?:boolean,deniedNotes?:boolean,focused?:boolean}){
 return <div style={{width:widths.reduce((a,b)=>a+b,0),fontSize:font,fontWeight:400,lineHeight:1,color:INK}}>
  {Array.from({length:rows+1},(_,r)=><div key={r} style={{display:'flex',height:rowH,borderBottom:`1px solid ${LINE}`}}>{cols.map((col,c)=>{
   const data=columns[col];const dim=(focused&&col!=='budget'&&col!=='notes')||muted;
   return <div key={col} style={{width:widths[c],padding:'0 14px',boxSizing:'border-box',borderRight:c<cols.length-1?`1px solid ${LINE}`:undefined,display:'flex',alignItems:'center',justifyContent:r>0&&data.align==='right'?'flex-end':'flex-start',gap:12,opacity:dim?.3:1,whiteSpace:'nowrap',overflow:'hidden'}}>
    {r===0?<><Icon type={data.icon} size={font*.87}/><span style={{color:GRAY}}>{data.name}</span>{locked&&(col==='budget'||col==='notes')?<Lock size={font*.62}/>:null}</>:
      col==='group'?<span style={{background:tags[r-1],color:tagInk[r-1],borderRadius:3,padding:'4px 7px',fontWeight:500}}>{data.values[r-1]}</span>:
      deniedNotes&&col==='notes'?<span style={{color:'#b4b6b1',fontSize:font*.85}}>♧ No access</span>:data.values[r-1]}
   </div>;
  })}</div>)}
 </div>;
}
function Title({children,size=96,style={}}:{children:React.ReactNode,size?:number,style?:React.CSSProperties}) {return <div style={{fontSize:size,fontWeight:700,lineHeight:1.07,letterSpacing:-size*.055,color:INK,...style}}>{children}</div>;}

function Avatar({variant=0,size=66}:{variant?:number,size?:number}){
 const robot=variant===14;const spark=variant===15;const notion=variant===13;
 return <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow:'visible'}}>
  <circle cx="50" cy="50" r="47" fill={robot?'#4596d6':spark?'#b887dc':notion?'#92948e':'#fdfdfd'} stroke={variant<13?'#ededeb':'none'} strokeWidth="4"/>
  {spark?<path d="M50 10l9 28 27 12-27 11-9 29-10-29L13 50l27-12z" fill="white" stroke="#292b28" strokeWidth="3"/>:notion?<><rect x="25" y="24" width="49" height="54" rx="3" fill="white" stroke="#252724" strokeWidth="3" transform="rotate(-8 50 50)"/><text x="34" y="63" fontSize="34" fontWeight="700">N</text></>:robot?<>
   <path d="M50 27V16" stroke="#202624" strokeWidth="3"/><circle cx="50" cy="13" r="4" fill="#fcfaf3" stroke="#202624" strokeWidth="2"/>
   <rect x="24" y="30" width="52" height="49" rx="12" fill="white" stroke="#202624" strokeWidth="3"/><path d="M32 79v7h36v-7M18 45v20M82 45v20" fill="none" stroke="#202624" strokeWidth="4"/><circle cx="39" cy="48" r="4"/><circle cx="61" cy="48" r="4"/><path d="M36 65h28" stroke="#202624" strokeWidth="4"/>
  </>:<>
   {(variant%6===0||variant%6===4)&&<path d="M20 55C6 16 46-2 69 17c28 4 23 43 9 53L23 68z" fill="#181b18"/>}
   {variant%6===1&&<path d="M22 38C15 0 69 5 79 37l-4 29-51 2z" fill="#b4b6af"/>}
   {variant%6===2&&<><circle cx="32" cy="25" r="13" fill="#151815"/><circle cx="53" cy="21" r="14" fill="#151815"/><circle cx="72" cy="30" r="13" fill="#151815"/><circle cx="25" cy="39" r="13" fill="#151815"/></>}
   {variant%6===3&&<><circle cx="50" cy="12" r="9" fill="#171a17"/><path d="M22 41q-3-34 28-31 34 1 29 34" fill="#171a17"/></>}
   {variant%6===5&&<path d="M22 38L24 10l14 13 11-20 10 20 18-16 1 35" fill="#222522"/>}
   <ellipse cx="50" cy="56" rx="27" ry="34" fill={variant%6===1?'#d8d9d5':'#fff'} stroke="#202420" strokeWidth="2.6"/>
   {(variant%6===0||variant%6===4)&&<path d="M23 48q-2-27 27-27 25-3 28 25-15-1-21-16-8 16-34 18" fill="#1d211e"/>}
   {variant%6===1&&<path d="M27 41q23-27 46 0" fill="none" stroke="#616760" strokeWidth="4"/>}
   {variant%6===2&&<><circle cx="40" cy="54" r="9" fill="none" stroke="#161b17" strokeWidth="2.4"/><circle cx="62" cy="54" r="9" fill="none" stroke="#161b17" strokeWidth="2.4"/><path d="M49 54h4" stroke="#161b17" strokeWidth="2"/></>}
   <circle cx="40" cy="54" r="2.8" fill="#1f2520"/><circle cx="62" cy="54" r="2.8" fill="#1f2520"/>
   {variant%3===0?<path d="M40 70q11 12 22-1" fill="none" stroke="#1b211c" strokeWidth="2.6"/>:variant%3===1?<path d="M43 72h15" stroke="#1b211c" strokeWidth="2.4"/>:<ellipse cx="51" cy="72" rx="4" ry="3" fill="none" stroke="#1b211c" strokeWidth="2"/>}
  </>}
 </svg>;
}

function Intro({t}:{t:number}){
 const words=[['A',.12],['few',.26],['fields',.42],['should',.68],['stay',.89],['private.',1.12]] as const;
 return <div data-bench-object="intro.words" style={{position:'absolute',left:0,top:252,width:1280,textAlign:'center'}}>
  <Title size={104}>{words.slice(0,3).map(([word,start])=><span key={word} style={{display:'inline-block',marginRight:word==='fields'?0:24,opacity:ease(progress(t,start,.25)),transform:`translateY(${14*(1-ease(progress(t,start,.28)))}px)`}}>{word}</span>)}<br/>{words.slice(3).map(([word,start])=><span key={word} style={{display:'inline-block',marginRight:word==='private.'?0:22,opacity:ease(progress(t,start,.25)),transform:`translateY(${14*(1-ease(progress(t,start,.28)))}px)`}}>{word}</span>)}</Title>
 </div>;
}
function FirstTable({t}:{t:number}){
 const expanded=ease(progress(t,3.15,.26));
 return <div style={{position:'absolute',left:48,top:186,...pose(t,1.82,28,.28)}}>
  <div data-bench-object="table.first"><GridTable cols={['guest','group','seat','budget','rsvp']} widths={[288,204,252,220,220]} rows={4} rowH={70} font={26} locked={t>3.25}/></div>
  <div data-bench-object="selection.budget" style={{position:'absolute',left:744,top:0,width:220,height:70+280*expanded,boxSizing:'border-box',border:'1.5px solid #7aa9db',background:'rgba(109,175,234,.11)',opacity:ease(progress(t,2.08,.2)),pointerEvents:'none'}}/>
 </div>;
}
function Crowd({t}:{t:number}){
 return <><div data-bench-object="crowd.avatars" style={{position:'absolute',left:224,top:200,display:'flex',gap:0}}>{Array.from({length:16},(_,i)=><div key={i} style={{width:54,opacity:ease(progress(t,4.78+i*.069,.25)),transform:`translateY(${18*(1-ease(progress(t,4.78+i*.069,.28)))}px)`}}><Avatar variant={i} size={66}/></div>)}</div><div data-bench-object="crowd.title" style={{position:'absolute',top:444,width:1280,textAlign:'center',...pose(t,4.76,16)}}><Title size={82}>Many hands.</Title></div></>;
}
function Page({t}:{t:number}){
 const z=ease(progress(t,9.16,.42));const scale=mix(1,2.045,z);
 return <>
  <div style={{position:'absolute',left:60,top:124,opacity:1-z,...(t<9.16?pose(t,7.8,18):{})}}><div style={{display:'flex',gap:24,alignItems:'center',fontSize:48,fontWeight:700,letterSpacing:-2}}><span style={{background:'#e57d28',color:'white',fontSize:25,width:31,height:36,borderRadius:3,textAlign:'center',lineHeight:'36px'}}>★</span>Guest list</div><div style={{display:'inline-flex',alignItems:'center',gap:12,background:'#f0f2ee',borderRadius:24,padding:'10px 20px',fontSize:20,marginTop:24}}><Icon type="table" size={20} color="#50554f"/>Table</div></div>
  <div style={{position:'absolute',left:mix(60,-980,z),top:mix(258,15,z),transform:`scale(${scale})`,transformOrigin:'top left'}}>
   <div data-bench-object="page.table"><GridTable cols={['guest','group','seat','budget','notes','rsvp']} widths={[236,164,200,192,192,180]} rows={t<8.42?4:5} rowH={56} font={23} locked={t>8.82} focused={z>.15}/></div>
   {t>8.78?<div data-bench-object="page.selection" style={{position:'absolute',left:600,top:0,width:384,height:336,border:'1.4px solid #6e9fd0',boxSizing:'border-box',background:'rgba(115,177,230,.12)',opacity:ease(progress(t,8.78,.18)),pointerEvents:'none'}}/>:null}
  </div>
 </>;
}
const fields=[['Budget','budget'],['Margin','margin'],['Deposit','deposit'],['Feedback','feedback'],['Allergies','allergies'],['Invoices','note'],['Door code','key'],['Tips','tips'],['Phone','phone'],['Rating','star'],['Address','house'],['Vendors','truck'],['Passes','ticket'],['Contracts','note'],['Seating','seat'],['Payouts','calendar']];
function Fields({t}:{t:number}){
 const n=Math.min(15,Math.floor(Math.max(0,t-11.28)/.19));
 return <div data-bench-object="fields.grid" style={{position:'absolute',left:50,top:188,width:1180,display:'grid',gridTemplateColumns:'repeat(4, 282px)',columnGap:16,rowGap:18,...pose(t,11.25,14,.24)}}>{fields.map(([label,icon],i)=>{
 const p=ease(progress(t,11.32+i*.19,.18));return <div key={label} style={{height:74,boxSizing:'border-box',border:'1px solid #e4e6e1',borderRadius:10,background:i===n?'#f0f0fc':'#fdfefd',display:'flex',alignItems:'center',gap:12,padding:'0 20px',fontSize:24,color:INK,fontWeight:500,opacity:.24+.76*p}}><Icon type={icon} size={24} color="#7c8179"/>{label}<span style={{opacity:p}}><Lock size={15}/></span></div>;
 })}</div>;
}
function Who({t}:{t:number}){
 return <><div data-bench-object="who.column" style={{position:'absolute',left:158,top:112,...pose(t,14.85,20)}}><GridTable cols={['budget']} widths={[436]} rows={4} rowH={138} font={48} locked/></div><div data-bench-object="who.title" style={{position:'absolute',left:668,top:292,...pose(t,14.9,24)}}><Title size={82}>Who opens<br/>Budget?</Title></div></>;
}
function YourCall({t}:{t:number}){
 const p=ease(progress(t,16.75,.48));
 return <><div data-bench-object="your-call.title" style={{position:'absolute',top:106,width:1280,textAlign:'center',...pose(t,16.75,16)}}><Title size={74}>Your call.</Title></div><div data-bench-object="your-call.table" style={{position:'absolute',left:96,top:254,filter:`blur(${(1-p)*6}px)`,opacity:p}}><GridTable cols={['group','seat','budget','notes','rsvp']} widths={[192,192,264,180,260]} rowH={54} font={22} locked/></div></>;
}
function Viewers({t}:{t:number}){
 const n=t<19.82?0:t<20.72?1:t<21.64?2:3;
 const opts=[{label:'Planners',variant:0,color:'#f6dce7'},{label:'Vendors',variant:2,color:'#fbe4cb'},{label:'Family',variant:3,color:'#dcebe3'},{label:'Assistants',variant:14,color:'#efefeb'}];const o=opts[n];
 return <><div data-bench-object="viewers.identity" style={{position:'absolute',left:112,top:230,width:186,textAlign:'center',opacity:ease(progress(t,18.82,.18))}}><Avatar variant={o.variant} size={186}/><div style={{display:'inline-block',marginTop:24,fontSize:25,background:o.color,borderRadius:3,padding:'4px 8px'}}>{o.label}</div></div><div data-bench-object="viewers.table" style={{position:'absolute',left:414,top:198,opacity:ease(progress(t,18.82,.22))}}><GridTable cols={n===1||n===3?['guest']:['guest','budget','notes']} widths={n===1||n===3?[304]:[304,160,326]} rows={4} rowH={72} font={24} locked deniedNotes={n===2}/></div></>;
}
const carousel=[{name:'Door code',icon:'key',data:['Side gate 2281','Lockbox under mat','Ask Lena first'],right:false},{name:'Deposit',icon:'deposit',data:['$250','$1,400','$90'],right:true},{name:'Feedback',icon:'feedback',data:['Loved the band.','Too loud by ten.','Book them again.'],right:false},{name:'Margin',icon:'margin',data:['22%','31%','18%'],right:true},{name:'Allergies',icon:'allergies',data:['Peanuts','Shellfish','None'],right:false},{name:'Tips',icon:'tips',data:['$60','$95','$40'],right:true}];
function Columns({t}:{t:number}){
 const idx=Math.min(5,Math.floor(Math.max(0,t-23.26)/.5));const c=carousel[idx];
 return <div data-bench-object="columns.carousel" style={{position:'absolute',left:320,top:60,width:640,fontSize:58}}><div style={{height:136,display:'flex',alignItems:'center',gap:24,padding:'0 40px',color:GRAY,borderBottom:`1px solid ${LINE}`}}><Icon type={c.icon} size={60}/>{c.name}<Lock size={40}/></div>{c.data.map((v,i)=><div key={i} style={{height:158,display:'flex',alignItems:'center',justifyContent:c.right?'flex-end':'flex-start',padding:'0 40px',borderBottom:`1px solid ${LINE}`,boxSizing:'border-box',fontSize:58,color:INK}}>{v}</div>)}</div>;
}
function End({t}:{t:number}){
 return <><div data-bench-object="end.title" style={{position:'absolute',top:318,width:1280,textAlign:'center',...pose(t,26.27,18,.3)}}><Title size={96}>Field locks</Title></div>{t>28.18?<div data-bench-object="end.subtitle" style={{position:'absolute',top:444,width:1280,textAlign:'center',...pose(t,28.18,10,.3)}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:18,fontSize:36,fontWeight:600,letterSpacing:-1}}>Now in every table <Lock size={22}/></div></div>:null}</>;
}

export function Replica(){
 const frame=useCurrentFrame();const t=frame/60;
 return <AbsoluteFill style={{background:t>=11.25&&t<14.85?'#fafbf9':PAPER,fontFamily:'Inter, sans-serif',color:INK,overflow:'hidden'}}>
  <Audio src={staticFile('audio.wav')}/>
  {t<1.82?<Intro t={t}/>:t<3.78?<FirstTable t={t}/>:t<4.76?<div data-bench-object="same-sheet.text" style={{position:'absolute',top:316,width:1280,textAlign:'center',...pose(t,3.78,12,.2)}}><Title size={96}>Same sheet.</Title></div>:t<7.8?<Crowd t={t}/>:t<11.25?<Page t={t}/>:t<14.85?<Fields t={t}/>:t<16.75?<Who t={t}/>:t<18.82?<YourCall t={t}/>:t<22.42?<Viewers t={t}/>:t<23.26?<div data-bench-object="lock-any.text" style={{position:'absolute',top:316,width:1280,textAlign:'center',...pose(t,22.42,18,.23)}}><Title size={96}>Lock any field.</Title></div>:t<26.27?<Columns t={t}/>:<End t={t}/>}
  {t>31.45?<AbsoluteFill style={{background:'#000',opacity:progress(t,31.45,.2)}}/>:null}
 </AbsoluteFill>;
}
