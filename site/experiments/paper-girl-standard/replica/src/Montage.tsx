import React from 'react';
import {C,Sun,Star,rand,clamp,between} from './Art';

export type Kind='words'|'music'|'sea'|'trees'|'dogs'|'bread'|'rain'|'math'|'stars'|'octopus'|'tea'|'flowers'|'cats';
export const kinds:Kind[]=['words','music','sea','trees','dogs','bread','rain','math','stars','octopus','tea','flowers','cats'];
export const labels:Record<Kind,string>={words:'words',music:'music',sea:'the sea',trees:'trees',dogs:'dogs',bread:'bread',rain:'rain',math:'math',stars:'the stars',octopus:'octopus',tea:'tea',flowers:'flowers',cats:'cats'};
export const backgrounds:Record<Kind,string>={words:'#f4ce30',music:'#42b99b',sea:'#ea86b1',trees:'#7bc4e4',dogs:'#f5dd6a',bread:'#72ace1',rain:'#d3a451',math:'#b191d6',stars:C.night,octopus:'#279d92',tea:'#8050a4',flowers:'#ec88bc',cats:'#356ccc'};
export function Icon({kind,showSun=true,time=0,id}:{kind:Kind,showSun?:boolean,time?:number,id?:string}){const bob=Math.sin(time*3)*3;return <g data-bench-object={id} transform={`translate(0 ${bob})`} stroke={C.cream} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
 {kind==='words'&&<>
  <path d="M135 350L353 365L571 350L584 559L359 577L130 558Z" fill="#cf4f47"/><path d="M146 344L357 356L357 563L144 548ZM363 356L562 343L568 548L363 563Z" fill="url(#news)"/>
  {[0,1,2,3].map(i=><path key={i} d={`M165 ${385+i*37}h60`} stroke="#82867f" strokeWidth="8"/>)}<text x="193" y="264" fill="#d45b50" stroke="none" fontFamily="Patrick Hand" fontSize="85">a</text><text x="281" y="203" fill="none" stroke="#fff3b9" fontFamily="Patrick Hand" fontSize="85">b</text><text x="397" y="302" fill="#3268b1" stroke="none" fontFamily="Patrick Hand" fontSize="85">c</text><text x="385" y="417" fill="#9169b8" stroke="none" fontFamily="Patrick Hand" fontSize="76">e</text>
  {showSun&&<Sun x={360} y={397} s={.83} mood="happy"/>}
 </>}
 {kind==='music'&&<>
  <path d="M150 572V303L167 301Q203 332 204 381Q194 360 168 342V571Z" fill="#cb4343"/><ellipse cx="139" cy="582" rx="36" ry="23" fill="#cb4343" transform="rotate(-22 139 582)"/>
  <path d="M294 569V347L450 319V544L432 550V348L313 369V563Z" fill="#354ab0"/><ellipse cx="280" cy="579" rx="37" ry="23" fill="#354ab0" transform="rotate(-22 280 579)"/><ellipse cx="420" cy="555" rx="37" ry="23" fill="#354ab0" transform="rotate(-22 420 555)"/>
  <path d="M220 344h14M227 337v14" stroke="#e8d36f"/>
  {showSun&&<Sun x={366} y={361} s={.8} mood="happy"/>}
 </>}
 {kind==='sea'&&<>
  <path d="M171 434Q229 390 301 429Q363 468 432 429Q489 397 546 433L562 520L533 559H188L153 515Z" fill="#3263b5"/><path d="M153 449Q205 407 281 427Q306 446 283 474Q214 497 153 449ZM482 426Q528 432 546 421Q562 470 537 479Q495 477 463 459Z" fill="#8cd0e8"/>
  <circle cx="267" cy="504" r="17" fill="none" stroke="#6495cf" opacity=".5"/><circle cx="444" cy="506" r="19" fill="none" stroke="#6495cf" opacity=".6"/><circle cx="444" cy="506" r="11" fill="none" stroke="#6495cf" opacity=".6"/>
  <path d="M248 361L283 409H430L479 356L411 418H284Z" fill="url(#news)"/><path d="M360 381V259L390 270L362 285" fill="#d85747" stroke="#f7edcf" strokeWidth="1.5"/><path d="M495 246l13 8l13-8M529 278l11 7l11-7" fill="none" stroke="#25213b" strokeWidth="2.6"/>
  {showSun&&<Sun x={365} y={374} s={.68} mood="happy"/>}
 </>}
 {kind==='trees'&&<>
  <ellipse cx="360" cy="585" rx="133" ry="22" fill="#398e34"/><path d="M339 580L351 333H371L379 580Z" fill="#93602e"/><path d="M352 421C299 480 203 459 214 384Q212 321 272 313Q265 229 345 223Q420 215 438 303Q515 311 512 379Q510 463 430 464Q386 464 361 438Z" fill="#59ad40"/>
  {[[-70,-15],[-32,-68],[55,-16],[-112,49],[18,49]].map(([x,y],i)=><circle key={i} cx={360+x} cy={378+y} r="12" fill="#df5349"/>)}
  <g fill="#bce790">{[[225,290,-40],[517,300,25],[531,375,-34]].map(([x,y,a],i)=><ellipse key={i} cx={x} cy={y} rx="7" ry="14" transform={`rotate(${a} ${x} ${y})`}/>)}</g>
  <path d="M277 327Q306 321 321 335M375 261Q405 269 412 296" stroke="#7fbc61" fill="none"/>
  {showSun&&<Sun x={358} y={221} s={.87} mood="happy"/>}
 </>}
 {kind==='dogs'&&<>
  <path d="M446 488Q510 505 517 399Q526 384 528 400Q541 521 457 548Z" fill="#c69a59"/><path d="M355 366Q466 384 484 480Q492 567 406 581Q363 578 350 542Q328 510 335 448Z" fill="#c49a5e"/><path d="M341 382Q370 368 383 396L396 532L353 531Z" fill="#f0dcaa"/><ellipse cx="354" cy="573" rx="43" ry="17" fill="#eddaa6"/><ellipse cx="443" cy="490" rx="30" ry="24" fill="#916033"/>
  <path d="M305 249Q350 226 392 253Q429 277 426 320Q395 340 341 347L306 331L277 320L245 307L248 281Z" fill="#c99c61"/><path d="M375 250Q430 258 426 320L393 329Z" fill="#79502d"/><path d="M324 347L329 363L397 340L393 327Z" fill="#d5493f"/><circle cx="355" cy="357" r="6" fill="#f6d75b" stroke="none"/><circle cx="322" cy="280" r="5" fill="#251e22" stroke="none"/><circle cx="243" cy="301" r="7" fill="#251e22" stroke="none"/>
  {showSun&&<Sun x={266} y={204} s={.82} mood="happy"/>}
 </>}
 {kind==='bread'&&<>
  <path d="M206 330Q260 302 411 317Q534 326 527 414Q517 495 363 500Q202 502 175 444Q157 367 206 330Z" fill="#c9974e"/><path d="M206 330Q260 302 411 317Q534 326 527 414Q517 495 363 500Q202 502 175 444Q157 367 206 330Z" fill="url(#script)" opacity=".6"/>
  {[0,1,2].map(i=><path key={i} d={`M${280+i*70} 347l-42 89`} fill="none" stroke="#f7df9a" strokeWidth="13"/>)}
  <path d="M466 440Q492 426 524 449Q547 463 536 490L520 556Q514 573 487 568L449 560Q427 552 435 526L446 462Q450 447 466 440Z" fill="#c9944d"/><path d="M473 449Q497 440 519 456Q530 466 522 491L510 547Q508 557 489 554L458 547Q449 543 455 521L465 467Q466 453 473 449Z" fill="#f5dda1"/><circle cx="480" cy="479" r="5" fill="none" stroke="#bb8b49"/><circle cx="503" cy="530" r="5" fill="none" stroke="#bb8b49"/>
  <path d="M198 314q12-28 0-52t0-42M558 330q12-28 0-52t0-42" fill="none" stroke={C.cream} strokeWidth="3"/>
  {showSun&&<Sun x={320} y={248} s={.7} mood="happy"/>}
 </>}
 {kind==='rain'&&<>
  <path d="M177 201Q158 151 198 132Q207 85 255 101Q284 54 333 87Q367 56 409 91Q454 75 471 122Q522 126 514 198Z" fill="url(#news)"/>
  <ellipse cx="360" cy="569" rx="131" ry="14" fill="#79b8dc"/>
  <path d="M221 398Q233 334 361 320Q479 337 495 398Q470 375 449 395Q411 371 391 396Q354 373 327 397Q295 374 267 397Q245 380 221 398Z" fill="#54a143"/><path d="M360 324L360 538Q359 553 345 552" fill="none" stroke="#a56b35" strokeWidth="5"/><path d="M360 320Q302 338 267 397M360 320Q404 338 449 395M360 320Q350 352 327 397" fill="none" stroke="#367d3e" strokeWidth="1.3"/>
  {[ [244,260],[298,300],[373,251],[437,288],[487,255],[523,392],[177,358],[157,540],[249,497],[485,485]].map(([x,y],i)=><path key={i} d={`M${x} ${y-12}Q${x-14} ${y+12} ${x} ${y+14}Q${x+14} ${y+11} ${x} ${y-12}Z`} fill="#68b3d9" strokeWidth="1.4"/>)}
  {showSun&&<Sun x={359} y={497} s={.58} mood="happy"/>}
 </>}
 {kind==='math'&&<>
  <path d="M145 280L537 278L538 574L143 574Z" fill="#e6f2d9" filter="url(#rough)"/><path d="M145 280L537 278L538 574L143 574Z" fill="url(#grid)" stroke="none"/>
  <path d="M167 445H499M378 304V554" fill="none" stroke="#93a08f" strokeWidth="1.7"/>
  <path d="M215 544Q221 374 289 366Q352 360 327 399Q299 422 289 396Q288 382 303 388" fill="none" stroke="#d56d5b" strokeWidth="6"/>
  <g fontFamily="Patrick Hand" fontSize="84" stroke="none"><text x="157" y="308" fill="#31a28b">1</text><text x="216" y="289" fill="#efbd36">2</text><text x="525" y="298" fill="#2c60aa">8</text><text x="538" y="618" fill="#cb493e">3</text></g>
  {showSun&&<Sun x={178} y={567} s={.64} mood="happy"/>}
 </>}
 {kind==='stars'&&<>
  <circle cx="360" cy="368" r="318" fill={C.night}/><path d="M152 407Q365 277 551 332Q619 377 399 455Q182 522 91 475Q45 440 152 407Z" fill="#df7e6e"/><path d="M150 429Q348 314 549 354Q577 373 385 433Q199 489 113 460Z" fill={C.night} stroke="none"/>
  <circle cx="316" cy="396" r="112" fill="#f3c147"/>
  <path d="M97 452Q174 496 393 431Q571 378 550 353L565 366Q610 408 399 462Q184 529 97 477Z" fill="#de7b69" strokeWidth="1.6"/>
  <circle cx="548" cy="224" r="48" fill="url(#news)"/><circle cx="145" cy="212" r="37" fill="#d97e64"/><text x="126" y="225" fontSize="34" fontFamily="Patrick Hand" fill="#7c4c4e" stroke="none">♫</text><path d="M90 151L223 135" stroke="#e0c34f" strokeWidth="10"/><circle cx="229" cy="134" r="18" fill="#f8da6b"/>
  <path d="M593 556Q546 524 494 559Q454 602 518 610Q568 612 555 580Q545 564 523 580Q513 594 533 594" fill="none" stroke="#e790b6" strokeWidth="5.5"/>
  {[[106,399],[549,324],[651,491],[187,634],[605,610]].map(([x,y],i)=><Star key={i} x={x} y={y} r={12} fill="#e8ce5a"/>)}
  <path d="M114 292h24M126 280v24M463 513h24M475 501v24" stroke="#a1b7cc" strokeWidth="2"/>
  {showSun&&<Sun x={365} y={132} s={.86} mood="happy"/>}
 </>}
 {kind==='octopus'&&<>
  <path d="M379 417Q322 391 296 330Q290 313 278 326Q276 378 356 439Q334 479 303 510Q288 518 295 531Q311 543 343 516L370 486Q335 539 363 537Q381 538 404 485Q385 547 412 539Q427 538 434 487Q441 546 462 539Q479 534 464 482Q495 543 515 536Q530 526 493 482Q537 535 560 532Q586 529 569 516Q528 493 508 442Q554 424 555 372Q555 303 501 280Q449 257 405 292Q361 330 379 417Z" fill="#ac79cc"/>
  <g fill="#fffdee" stroke="none"><circle cx="438" cy="373" r="16"/><circle cx="503" cy="373" r="16"/></g><g fill="#211b29" stroke="none"><circle cx="441" cy="373" r="7"/><circle cx="505" cy="373" r="7"/></g><circle cx="418" cy="410" r="11" fill="#e4a7af" stroke="none"/><circle cx="527" cy="410" r="11" fill="#e4a7af" stroke="none"/>
  {showSun&&<Sun x={202} y={307} s={.96} mood="happy"/>}
 </>}
 {kind==='tea'&&<>
  <ellipse cx="359" cy="599" rx="219" ry="43" fill="#249d7c"/>
  {showSun&&<Sun x={356} y={505} s={.75} mood="happy"/>}
  <path d="M450 466Q530 438 543 494Q550 552 486 563L467 542Q517 532 515 497Q515 475 463 493Z" fill="#eee9cb"/><path d="M214 475H484Q477 601 351 599Q230 596 214 475Z" fill="url(#news)"/><path d="M222 506H476V527H230Z" fill="#c74a3e" stroke="none"/><path d="M272 577Q356 609 431 568" fill="none" stroke="#a7ad93" strokeWidth="1"/>
  <path d="M529 564L537 586L518 594L509 571Z" fill="#f2cf47"/>
  <path d="M292 340q13-25 0-47t0-43M351 322q13-25 0-47t0-43M411 340q13-25 0-47t0-43" stroke="#efeccc" strokeWidth="5" fill="none"/>
 </>}
 {kind==='flowers'&&<>
  <path d="M258 536L228 388M442 537L488 381" fill="none" stroke="#4a9b51" strokeWidth="6"/>
  {[[229,384,'#efce43'],[487,374,'#5ab8e3']].map(([x,y,col],i)=><g key={i} transform={`translate(${x} ${y})`} fill={col as string}>{[0,1,2,3,4].map(n=><ellipse key={n} cx="0" cy="-17" rx="15" ry="19" transform={`rotate(${n*72})`}/>)}<circle r="11" fill="#df705c" stroke="none"/></g>)}
  {showSun&&<Sun x={363} y={374} s={.98} mood="smile"/>}
  <path d="M247 488H473L428 628H292Z" fill="url(#news)"/><path d="M333 591Q361 566 389 590L366 585L379 604L360 592L344 605L353 584Z" fill="#cb4b3e" stroke="none"/>
 </>}
 {kind==='cats'&&<>
  <path d="M523 527Q590 558 544 588Q511 602 506 576Q546 586 547 565Q547 554 513 550Z" fill="#d79b48"/><path d="M187 422L188 331L230 373Q276 364 297 358Q418 326 501 408Q562 482 543 532Q474 577 325 564Q220 559 199 513Q178 484 187 422Z" fill="#d79a47"/>
  <path d="M196 452q10 7 20 0M255 452q10 7 20 0M227 481l8 3l-8 4" fill="none" stroke="#875c32" strokeWidth="2.2"/><path d="M189 488l-30-8M190 496l-29 5M272 480l34-6M273 492l35 4M410 365l19 32M434 358l19 32" fill="none" stroke="#aa7738" strokeWidth="3"/><ellipse cx="255" cy="535" rx="45" ry="21" fill="#efdaa0"/>
  <text x="174" y="226" fontFamily="Patrick Hand" fontSize="66" fill={C.cream} stroke="none" transform="rotate(-6 174 226)">Z</text><text x="223" y="269" fontFamily="Patrick Hand" fontSize="40" fill={C.cream} stroke="none">z</text>
  {showSun&&<Sun x={379} y={351} s={.95} mood="closed"/>}
 </>}
 </g>}

export function Montage({time}:{time:number}){let index=0;if(time<14)index=Math.min(7,Math.floor((time-10)*2));else if(time<15)index=8;else index=9+Math.min(3,Math.floor((time-15)*4));const kind=kinds[index];return <><rect width="720" height="720" fill={backgrounds[kind]}/><Icon kind={kind} time={time} id={`montage.${kind}`}/><text data-bench-object="montage.labels" x="360" y="638" textAnchor="middle" fontFamily="Patrick Hand" fontSize="51" fill={['stars','octopus','tea','cats'].includes(kind)?kind==='stars'?'#f1d46b':C.cream:'#282337'}>{labels[kind]}</text></>}

export function HeartScene({time}:{time:number}){const local=time-16;const pulse=1+Math.sin(local*4)*.008;const positions:[Kind,number,number,number,number][]=[['trees',120,147,.25,0],['music',206,143,.24,.08],['words',496,108,.28,.13],['sea',620,147,.28,.2],['dogs',670,285,.25,.3],['bread',68,259,.30,.42],['math',91,377,.28,.52],['stars',573,423,.23,.63],['octopus',195,459,.24,.72],['tea',521,554,.27,.8],['flowers',241,515,.23,.9],['rain',322,556,.23,.99],['cats',406,592,.23,1.07]];
 return <><rect width="720" height="720" fill="#e7e3c7"/><rect width="720" height="720" fill="url(#script)"/>
 <g data-bench-object="heart.large" transform={`translate(360 364) scale(${pulse}) translate(-360 -364)`}><path d="M360 653Q-12 376 73 205Q119 82 240 127Q318 156 360 224Q403 147 485 128Q613 100 646 209Q728 378 360 653Z" fill="#d94451" stroke={C.cream} strokeWidth="2.6"/><path d="M356 637Q-12 371 71 201Q118 82 239 121Q318 153 359 215Q408 137 487 120Q605 95 637 205Q711 369 356 637Z" fill="#ed8eaf" stroke={C.cream} strokeWidth="2.4"/></g>
 <g data-bench-object="heart.items">{positions.map(([kind,x,y,s,delay])=>local>delay&&<g key={kind} transform={`translate(${x} ${y}) scale(${s}) translate(-360 -380)`}><Icon kind={kind} showSun={false}/></g>)}</g>
 <Sun x={360} y={383} s={1.28} mood={local>1.4?'happy':'smile'}/>
 {local>.85&&<text data-bench-object="heart.question" x="381" y="208" fill={C.blue} stroke={C.cream} strokeWidth="6" paintOrder="stroke" fontFamily="Patrick Hand" fontSize={116+clamp((local-.85)*3)*32} transform={`rotate(${Math.sin(local*3)*4} 381 170)`}>?</text>}
 {local>1.1&&<path d="M360 651C335 634 325 612 341 604Q353 597 360 612Q372 596 383 606Q397 620 360 651Z" fill="#d44239" stroke={C.cream} strokeWidth="2"/>}
 </>}
