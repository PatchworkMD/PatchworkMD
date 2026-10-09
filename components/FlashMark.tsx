"use client";
/* SVG and canvas provide the live artwork; replacing them with img would remove animation. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { useEffect, useRef, useState } from 'react';

// Original procedural rose: layered petals rendered as shaded ASCII characters.
export default function FlashMark() {
  const lettering = useRef<SVGSVGElement>(null);
  const shader = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const control = useRef({ paused: false, burst: 0 });
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el=shader.current, svg=lettering.current;
    if(!el||!svg)return;
    const gl=el.getContext('webgl',{alpha:true,premultipliedAlpha:false});
    if(!gl)return;
    const compile=(type:number,source:string)=>{const sh=gl.createShader(type)!;gl.shaderSource(sh,source);gl.compileShader(sh);return sh;};
    const vs=compile(gl.VERTEX_SHADER,`attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`);
    const fs=compile(gl.FRAGMENT_SHADER,`precision mediump float;varying vec2 uv;uniform sampler2D mask;uniform float t;
    void main(){float a=texture2D(mask,vec2(uv.x,1.-uv.y)).a;
    float wave=sin(uv.x*21.+sin(uv.y*13.+t)*1.6-t*.9)+cos(uv.y*18.-t*.6);
    vec3 ink=vec3(.07,.12,.17),red=vec3(.13,.30,.36),gold=vec3(.17,.39,.47),green=vec3(.08,.16,.23);
    vec3 color=wave<.45?ink:wave<1.15?red:wave<1.65?gold:green;
    float grain=fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453);
    color*=.82+.18*grain;gl_FragColor=vec4(color,a);}`);
    const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);return;}
    // WebGL useProgram is a native graphics method, not a React hook.
    // oxlint-disable-next-line react/react-compiler
    gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const location=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const clone=svg.cloneNode(true) as SVGSVGElement;clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','1000');clone.setAttribute('height','390');
    clone.querySelectorAll('.flash-md,.flash-rule,.flash-ornament').forEach(n=>n.remove());
    clone.querySelectorAll('text').forEach(n=>n.setAttribute('style','font-family:Georgia,serif;font-weight:400;font-style:italic;font-size:112px;letter-spacing:-3px;fill:white;stroke:none'));
    const img=new Image();let ready=false,disposed=false,frame=0,last=0,time=0,visible=true;
    img.onload=()=>{if(disposed)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);ready=true;};
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(clone));
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});observer.observe(el);
    const tick=(now:number)=>{frame=requestAnimationFrame(tick);if(!ready||!visible||document.hidden||now-last<33)return;last=now;
      if(!control.current.paused&&!reduced.matches)time+=.033;
      el.width=Math.round(el.clientWidth*Math.min(devicePixelRatio,2));el.height=Math.round(el.clientHeight*Math.min(devicePixelRatio,2));
      gl.viewport(0,0,el.width,el.height);gl.uniform1f(gl.getUniformLocation(program,'t'),time);gl.drawArrays(gl.TRIANGLES,0,6);el.dataset.shader='ready';};frame=requestAnimationFrame(tick);
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
  },[]);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0, visible = true;
    const pointer = { x: -10, y: -10 };
    const points: number[][] = [];
    const ink = document.createElement('canvas'); ink.width=360; ink.height=360;
    const pen=ink.getContext('2d');
    if(!pen)return;
    pen.lineWidth=5;pen.lineJoin='round';pen.lineCap='round';
    const shape=(path:string,fill:string)=>{const p=new Path2D(path);pen.fillStyle=fill;pen.strokeStyle='#352d25';pen.fill(p);pen.stroke(p);};
    // Draw the silhouette first, then nested folds. These contours remain legible at every frame.
    shape('M176 216 Q190 262 165 340 L173 342 Q200 268 186 215 Z','#352d25');
    shape('M182 283 Q132 236 98 262 Q122 305 182 283 Z','#3e5149');
    shape('M180 302 Q211 248 259 267 Q242 308 180 302 Z','#3e5149');
    pen.strokeStyle='#352d25';pen.stroke(new Path2D('M110 264 L173 282 M190 296 L248 270'));
    shape('M180 231 C133 245 99 212 105 185 C65 171 70 119 101 103 C98 62 139 43 166 61 C190 26 230 50 241 75 C280 70 302 110 281 139 C304 174 277 207 251 207 C237 240 205 249 180 231 Z','#ad382c');
    shape('M180 216 C143 221 117 199 116 170 Q143 152 173 176 Q196 145 239 166 C251 195 218 227 180 216 Z','#c9553c');
    shape('M116 170 Q89 125 117 98 Q153 91 170 130 L173 176 Q142 147 116 170 Z','#b83c2b');
    shape('M173 176 Q166 128 203 105 Q242 94 268 126 Q272 152 239 166 Q203 150 173 176 Z','#c9553c');
    shape('M117 98 Q130 66 166 77 Q176 57 203 66 Q229 72 238 96 Q208 119 170 130 Q154 100 117 98 Z','#ce6448');
    shape('M150 119 Q139 94 163 86 Q193 78 213 103 Q207 132 179 144 Z','#9d3028');
    shape('M164 108 Q164 92 181 95 Q200 99 195 113 L179 124 Z','#d47756');
    const pixels=pen.getImageData(0,0,360,360).data;
    for(let y=0;y<360;y+=5)for(let x=0;x<360;x+=4){const i=(y*360+x)*4;if(pixels[i+3]>100)points.push([x-180,y-180,pixels[i],pixels[i+1],pixels[i+2]]);}
    const draw = (now: number) => {
      frame=requestAnimationFrame(draw);
      if(now-last<40 || !visible || document.hidden) return;
      last=now;
      const w=el.clientWidth, h=el.clientHeight;
      const dpr=Math.min(devicePixelRatio,2);
      if(el.width!==Math.round(w*dpr)||el.height!==Math.round(h*dpr)) {el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const scale=Math.min(w/380,h/370);
      ctx.font=`${7.5*scale}px monospace`;ctx.textAlign='center';
      for(const [x,y,r,g,b] of points){
        const burst=media.matches?0:control.current.burst;
        let px=w/2+x*(1+burst*.65)*scale;
        let py=h/2+y*scale;
        if(!media.matches&&!control.current.paused){
          const dx=px-(pointer.x+.5)*w,dy=py-(pointer.y+.5)*h;
          const distance=Math.hypot(dx,dy);
          if(distance>0&&distance<65){const push=(1-distance/65)*13;px+=dx/distance*push;py+=dy/distance*push;}
        }
        ctx.fillStyle=`rgb(${r},${g},${b})`;
        ctx.fillText(r<85?'@':r<170?'#':'*',px,py);
      }
      if(!control.current.paused)control.current.burst*=.91;
      el.dataset.ready='true';
    };
    const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;};
    const leave=()=>{pointer.x=-10;pointer.y=-10;};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(el);
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
    frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};
  },[]);
  return <div className="flash-art">
    <div className="lettering-stage"><svg ref={lettering} className="flash-lettering" viewBox="0 0 1000 390" role="img" aria-label="patchwork.md">
      <defs><path id="word-arc" d="M70 190 Q500 20 930 190" /></defs>
      <text textAnchor="middle"><textPath href="#word-arc" startOffset="50%">patchwork.md</textPath></text>

      <g className="flash-ornament" fill="none" stroke="#192a35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M150 268 C215 225 290 238 350 263 C380 278 416 281 442 269 M850 268 C785 225 710 238 650 263 C620 278 584 281 558 269" />
        <path d="M185 254 Q165 229 143 239 Q150 260 185 254 M815 254 Q835 229 857 239 Q850 260 815 254" fill="#287f8b" />
        <path d="M485 238 L500 205 L515 238 L509 303 L500 333 L491 303 Z" fill="#f6f5ef" />
        <path d="M500 214 V317 M472 250 Q500 259 528 250" />
        <path d="M484 239 C461 232 458 211 474 201 C470 180 493 171 504 186 C524 173 544 192 533 209 C547 227 526 247 510 236 C502 250 489 249 484 239Z" fill="#ac4736" />
        <path d="M480 204 Q499 185 519 201 Q529 219 508 231 Q485 230 480 204 M489 206 Q507 196 514 210 L503 220Z" />
        <path d="M465 224 Q434 202 440 185 Q468 187 475 211 M532 225 Q560 204 559 187 Q533 190 527 212" fill="#287f8b" />
        <path d="M370 218 v16 m-8-8 h16 M626 218 v16 m-8-8 h16" stroke="#b18a38" />
      </g>
    </svg><canvas ref={shader} className="ink-shader" aria-hidden="true" /></div>
    <canvas ref={canvas} className="ascii-rose" aria-label="Tattoo-style rose with curled petals, stem and leaves drawn in ASCII characters" role="img" />
    <div className="flash-controls">
      <button onClick={()=>{control.current.burst=1;}}>Scatter rose</button>
      <button aria-pressed={paused} onClick={()=>{control.current.paused=!paused;setPaused(!paused);}}>{paused?'Play':'Pause'}</button>
    </div>
  </div>;
}
