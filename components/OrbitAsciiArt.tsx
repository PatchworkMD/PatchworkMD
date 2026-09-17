'use client';
/* SVG and canvas provide the live artwork; replacing them with img would remove animation. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { useEffect, useRef, useState } from 'react';

// Orbit-themed sibling of the homepage FlashMark rose: a procedural rocket
// rendered as shaded ASCII characters, under the same ink-shader wordmark.
export default function OrbitAsciiArt() {
  const lettering = useRef<SVGSVGElement>(null);
  const shader = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const control = useRef({ paused: false, burst: 0 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = shader.current, svg = lettering.current;
    if (!el || !svg) return;
    const gl = el.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    const compile = (type: number, source: string) => { const sh = gl.createShader(type)!; gl.shaderSource(sh, source); gl.compileShader(sh); return sh; };
    const vs = compile(gl.VERTEX_SHADER, `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`);
    const fs = compile(gl.FRAGMENT_SHADER, `precision mediump float;varying vec2 uv;uniform sampler2D mask;uniform float t;
    void main(){float a=texture2D(mask,vec2(uv.x,1.-uv.y)).a;
    float wave=sin(uv.x*21.+sin(uv.y*13.+t)*1.6-t*.9)+cos(uv.y*18.-t*.6);
    vec3 ink=vec3(.02,.03,.05),deep=vec3(.06,.14,.22),cyan=vec3(.14,.43,.55),mint=vec3(.14,.42,.34);
    vec3 color=wave<.45?ink:wave<1.15?deep:wave<1.65?cyan:mint;
    float grain=fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453);
    color*=.82+.18*grain;gl_FragColor=vec4(color,a);}`);
    const program = gl.createProgram()!; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); return; }
    // WebGL useProgram is a native graphics method, not a React hook.
    // oxlint-disable-next-line react/react-compiler
    gl.useProgram(program); const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const clone = svg.cloneNode(true) as SVGSVGElement; clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); clone.setAttribute('width', '1000'); clone.setAttribute('height', '390');
    clone.querySelectorAll('text').forEach(n => n.setAttribute('style', 'font-family:Georgia,serif;font-weight:700;font-size:118px;letter-spacing:-3px;fill:white;stroke:none'));
    const img = new Image(); let ready = false, disposed = false, frame = 0, last = 0, time = 0, visible = true;
    img.onload = () => { if (disposed) return; gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); ready = true; };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); observer.observe(el);
    const tick = (now: number) => { frame = requestAnimationFrame(tick); if (!ready || !visible || document.hidden || now - last < 33) return; last = now;
      if (!control.current.paused && !reduced.matches) time += .033;
      el.width = Math.round(el.clientWidth * Math.min(devicePixelRatio, 2)); el.height = Math.round(el.clientHeight * Math.min(devicePixelRatio, 2));
      gl.viewport(0, 0, el.width, el.height); gl.uniform1f(gl.getUniformLocation(program, 't'), time); gl.drawArrays(gl.TRIANGLES, 0, 6); el.dataset.shader = 'ready'; }; frame = requestAnimationFrame(tick);
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0, visible = true;
    const pointer = { x: -10, y: -10 };
    const points: number[][] = [];
    const ink = document.createElement('canvas'); ink.width = 360; ink.height = 360;
    const pen = ink.getContext('2d');
    if (!pen) return;
    pen.lineWidth = 5; pen.lineJoin = 'round'; pen.lineCap = 'round';
    const shape = (path: string, fill: string) => { const p = new Path2D(path); pen.fillStyle = fill; pen.strokeStyle = '#0c1219'; pen.fill(p); pen.stroke(p); };
    // Orbit ring first, rocket body drawn on top, nose to tail.
    pen.strokeStyle = '#22384a'; pen.beginPath(); pen.ellipse(180, 196, 148, 56, 0, 0, Math.PI * 2); pen.stroke();
    shape('M150 236 L104 282 Q128 266 150 258 Z', '#7af0b8');
    shape('M210 236 L256 282 Q232 266 210 258 Z', '#7af0b8');
    shape('M160 258 Q180 320 168 356 L192 356 Q180 320 200 258 Z', '#ffc75c');
    shape('M170 258 Q180 300 178 330 L182 330 Q180 300 190 258 Z', '#fff3d6');
    shape('M154 250 Q150 150 180 96 Q210 150 206 250 Q180 268 154 250 Z', '#f2e9da');
    shape('M180 60 Q206 96 202 146 Q180 132 158 146 Q154 96 180 60 Z', '#e4d9c4');
    shape('M180 150 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0', '#131a22');
    shape('M180 150 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0', '#6bdcff');
    const pixels = pen.getImageData(0, 0, 360, 360).data;
    for (let y = 0; y < 360; y += 5) for (let x = 0; x < 360; x += 4) { const i = (y * 360 + x) * 4; if (pixels[i + 3] > 100) points.push([x - 180, y - 180, pixels[i], pixels[i + 1], pixels[i + 2]]); }
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - last < 40 || !visible || document.hidden) return;
      last = now;
      const w = el.clientWidth, h = el.clientHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      if (el.width !== Math.round(w * dpr) || el.height !== Math.round(h * dpr)) { el.width = Math.round(w * dpr); el.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w / 380, h / 370);
      ctx.font = `${7.5 * scale}px monospace`; ctx.textAlign = 'center';
      for (const [x, y, r, g, b] of points) {
        const burst = media.matches ? 0 : control.current.burst;
        let px = w / 2 + x * scale;
        let py = h / 2 + y * (1 + burst * .7) * scale;
        if (!media.matches && !control.current.paused) {
          const dx = px - (pointer.x + .5) * w, dy = py - (pointer.y + .5) * h;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 65) { const push = (1 - distance / 65) * 13; px += dx / distance * push; py += dy / distance * push; }
        }
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(r < 60 ? '@' : r < 180 ? '#' : '*', px, py);
      }
      if (!control.current.paused) control.current.burst *= .9;
      el.dataset.ready = 'true';
    };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); pointer.x = (e.clientX - r.left) / r.width - .5; pointer.y = (e.clientY - r.top) / r.height - .5; };
    const leave = () => { pointer.x = -10; pointer.y = -10; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); observer.observe(el);
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, []);

  return <div className="orbit-mark">
    <div className="orbit-lettering-stage">
      <svg ref={lettering} className="orbit-lettering" viewBox="0 0 1000 390" role="img" aria-label="Orbit">
        <defs><path id="orbit-word-arc" d="M100 220 Q500 60 900 220" /></defs>
        <text textAnchor="middle"><textPath href="#orbit-word-arc" startOffset="50%">Orbit</textPath></text>
      </svg>
      <canvas ref={shader} className="orbit-ink-shader" aria-hidden="true" />
    </div>
    <canvas ref={canvas} className="orbit-ascii-rocket" aria-label="Orbit rocket illustration drawn in ASCII characters" role="img" />
    <div className="orbit-mark-controls">
      <button onClick={() => { control.current.burst = 1; }}>Launch burst</button>
      <button aria-pressed={paused} onClick={() => { control.current.paused = !paused; setPaused(!paused); }}>{paused ? 'Play' : 'Pause'}</button>
    </div>
  </div>;
}
