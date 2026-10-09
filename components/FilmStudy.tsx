'use client';

import { useEffect, useRef, useState } from 'react';

const vertexSource = `attribute vec2 position;
varying vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }`;
const fragmentSource = `precision mediump float;
varying vec2 uv;
uniform sampler2D photograph;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
void main() {
  vec2 p = uv;
  float aspect = resolution.x / resolution.y;
  vec2 cover = vec2(min(aspect / 1.5, 1.), min(1.5 / aspect, 1.));
  vec2 delta = (p - pointer) * vec2(aspect, 1.);
  float lens = exp(-dot(delta, delta) * 8.);
  p += vec2(sin(p.y * 9. + time * .35), cos(p.x * 8. + time * .25)) * .004 * lens;
  vec2 sampleUV = (p - .5) * cover + .5;
  vec3 color = texture2D(photograph, sampleUV).rgb;
  float grain = fract(sin(dot(gl_FragCoord.xy + floor(time * 12.), vec2(12.9898, 78.233))) * 43758.5453) - .5;
  float leak = exp(-pow((p.x - .92 - .04 * sin(time * .2)) * 5., 2.)) * (.10 + .08 * lens);
  color += vec3(.75, .24, .06) * leak;
  color += grain * .025;
  color *= 1. - .16 * dot(uv - .5, uv - .5);
  gl_FragColor = vec4(color, 1.);
}`;

/** One decorative image. The HTML photograph remains the fallback. */
export default function FilmStudy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;
    let disposed = false;
    let frame = 0;
    let visible = true;
    let loaded = false;
    let last = 0;
    let elapsed = 0;
    const pointer = [0.5, 0.5];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      shaders.forEach(shader => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const sizeUniform = gl.getUniformLocation(program, 'resolution');
    const timeUniform = gl.getUniformLocation(program, 'time');
    const pointerUniform = gl.getUniformLocation(program, 'pointer');
    const draw = () => {
      if (!loaded || disposed) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(sizeUniform, canvas.width, canvas.height);
      gl.uniform2f(pointerUniform, pointer[0], pointer[1]);
      gl.uniform1f(timeUniform, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const tick = (now: number) => {
      if (disposed) return;
      if (visible && !document.hidden && !motion.matches && !pausedRef.current && now - last >= 33) {
        elapsed += Math.min((now - last) / 1000, .05);
        last = now;
        draw();
      }
      if (visible && !document.hidden && !motion.matches && !pausedRef.current) frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      if (!disposed && loaded) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * scale));
      canvas.height = Math.max(1, Math.round(rect.height * scale));
      draw();
    };
    const onMotion = () => { setReduced(motion.matches); draw(); resume(); };
    const onPointer = (event: PointerEvent) => {
      if (motion.matches || pausedRef.current) return;
      const rect = canvas.getBoundingClientRect();
      pointer[0] = (event.clientX - rect.left) / rect.width;
      pointer[1] = 1 - (event.clientY - rect.top) / rect.height;
    };
    const onLost = () => { loaded = false; cancelAnimationFrame(frame); setReady(false); };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume(); });
    intersection.observe(canvas);
    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('film-motion-change', resume);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', onMotion);
    setReduced(motion.matches);
    const photograph = new window.Image();
    photograph.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, photograph);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      loaded = true;
      resize();
      setReady(true);
      resume();
    };
    photograph.src = '/brand/studio.jpg';
    return () => {
      disposed = true;
      photograph.onload = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('film-motion-change', resume);
      document.removeEventListener('visibilitychange', resume);
      motion.removeEventListener('change', onMotion);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
  }, []);

  return <>
    <canvas ref={canvasRef} className="film-canvas" aria-hidden="true" data-ready={ready} />
    {ready && !reduced && <button type="button" className="film-control" aria-pressed={paused} onClick={() => {
      pausedRef.current = !pausedRef.current;
      setPaused(pausedRef.current);
      canvasRef.current?.dispatchEvent(new Event('film-motion-change'));
    }}>{paused ? 'Play motion' : 'Pause motion'}<span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>}
  </>;
}
