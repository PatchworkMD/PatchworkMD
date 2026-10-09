"use client";
import {useEffect,useRef,useState} from 'react';
type Dot={x:number;y:number;color:string;char:string};
function makeFlash():Dot[][]{
 const drawings=[
 // Swallow, heart, dagger, and horseshoe: original contours inspired by traditional flash.
 [['M170 170 Q130 85 25 35 Q50 118 119 162 L45 146 Q73 193 144 199 L96 276 L175 226 L206 267 L204 200 Q263 176 289 118 Q237 140 203 156 Q204 118 222 106 L199 109 Q178 106 170 170 Z','#397a89'],['M144 199 Q171 156 204 162 Q202 201 175 226 Z','#c06b38'],['M50 69 Q97 121 141 155 M62 106 Q111 148 148 167 M219 169 L261 145','none']],
 [['M160 254 C140 237 46 176 55 107 C61 55 128 49 160 98 C190 44 263 59 268 110 C272 169 199 224 160 254 Z','#aa4037'],['M48 156 Q153 128 275 159 L264 197 Q150 172 58 204 Z','#d3b968'],['M86 163 L96 188 M231 162 L221 185','none']],
 [['M160 28 L191 89 L174 233 L160 263 L146 233 L129 89 Z','#548e9e'],['M160 28 L160 263','none'],['M103 230 Q160 216 217 230 L216 246 Q160 235 104 247 Z','#c5a347'],['M149 246 L172 246 L178 302 Q160 321 143 302 Z','#a84334'],['M149 258 L174 272 M148 278 L176 292','none']],
 [['M89 61 L125 91 Q71 197 126 243 Q159 268 194 242 Q251 194 195 92 L231 59 Q303 180 235 270 Q162 335 86 272 Q14 182 89 61 Z','#4c7f89'],['M103 95 Q54 193 108 254 Q159 300 211 254 Q264 191 211 95','none'],['M96 125 L111 130 M85 163 L103 165 M88 202 L106 199 M109 238 L122 226 M148 257 L150 240 M187 250 L179 235 M220 217 L204 210 M236 177 L218 176 M223 138 L206 144','none']]
 ];
 return drawings.map(paths=>{const c=document.createElement('canvas');c.width=320;c.height=340;const g=c.getContext('2d')!;g.lineWidth=7;g.lineCap='round';g.lineJoin='round';
 for(const [path,fill] of paths){const shape=new Path2D(path);if(fill!=='none'){g.fillStyle=fill;g.fill(shape);}g.strokeStyle='#17272d';g.stroke(shape);}
 const data=g.getImageData(0,0,320,340).data,dots:Dot[]=[];
 for(let y=0;y<340;y+=5)for(let x=0;x<320;x+=4){const i=(y*320+x)*4;if(data[i+3]<100)continue;const red=data[i],green=data[i+1],blue=data[i+2];dots.push({x,y,color:`rgb(${red},${green},${blue})`,char:red<45?'@':(x+y)%3?'#': '+'});}return dots;});
}
export default function FlashBackground(){
 const ref=useRef<HTMLCanvasElement>(null);const state=useRef({paused:false});const [paused,setPaused]=useState(false);
 useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
 const motifs=makeFlash();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,last=0,time=0;const pointer={x:-1000,y:-1000};
 const move=(e:PointerEvent)=>{pointer.x=e.clientX;pointer.y=e.clientY;};const leave=()=>{pointer.x=-1000;pointer.y=-1000;};
 window.addEventListener('pointermove',move);document.addEventListener('pointerleave',leave);
 const tick=(now:number)=>{frame=requestAnimationFrame(tick);if(document.hidden||now-last<40)return;const dt=Math.min((now-last)/1000,.06);last=now;
 if(!state.current.paused&&!reduced.matches)time+=dt;
 const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio,1.5);
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const scale=Math.max(.72,Math.min(1.35,w/1050));
 const cell=365*scale,rowHeight=355*scale,cols=Math.ceil(w/cell)+2,rows=Math.ceil(h/rowHeight)+1;
 ctx.font=`bold ${5.7*scale}px monospace`;
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
 const index=(row*3+col)%motifs.length;
 const x=((col*cell+time*18+row*cell*.43)%(cols*cell))-cell,y=row*rowHeight-90;
 for(const dot of motifs[index]){let px=x+dot.x*scale,py=y+dot.y*scale;
 if(!reduced.matches&&!state.current.paused){const dx=px-pointer.x,dy=py-pointer.y,d=Math.hypot(dx,dy);if(d<100&&d>0){const f=(1-d/100)*12;px+=dx/d*f;py+=dy/d*f;}}
 ctx.fillStyle=dot.color;ctx.fillText(dot.char,px,py);}}
 canvas.dataset.ready='true';};frame=requestAnimationFrame(tick);
 return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);};},[]);
 return <><canvas ref={ref} className="flash-background" aria-hidden="true"/><button className="background-pause" aria-pressed={paused} onClick={()=>{state.current.paused=!paused;setPaused(!paused);}}>{paused?'Play background':'Pause background'}</button></>;
}
