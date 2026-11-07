const VERTEX = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

const fragment = (
  palette: string,
) => `precision mediump float;varying vec2 uv;uniform sampler2D mask;uniform float t;
    void main(){float a=texture2D(mask,vec2(uv.x,1.-uv.y)).a;
    float wave=sin(uv.x*21.+sin(uv.y*13.+t)*1.6-t*.9)+cos(uv.y*18.-t*.6);
    ${palette}
    float grain=fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453);
    color*=.82+.18*grain;gl_FragColor=vec4(color,a);}`;

export type InkShader = {
  setMask: (image: HTMLImageElement) => void;
  draw: (seconds: number) => boolean;
  dispose: () => void;
};

export function createInkShader(
  canvas: HTMLCanvasElement,
  palette: string,
): InkShader | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
  });

  if (!gl) return null;
  const cleanup: (() => void)[] = [];
  const dispose = () => cleanup.splice(0).forEach((release) => release());

  const fail = () => {
    dispose();

    return null;
  };

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);

    if (!shader) return null;
    cleanup.push(() => gl.deleteShader(shader));
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const pixels = compile(gl.FRAGMENT_SHADER, fragment(palette));

  if (!vertex || !pixels) return fail();

  const program = gl.createProgram();

  if (!program) return fail();
  cleanup.push(() => gl.deleteProgram(program));
  gl.attachShader(program, vertex);
  gl.attachShader(program, pixels);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fail();
  // WebGL useProgram is a native graphics method, not a React hook.
  // oxlint-disable-next-line react/react-compiler
  gl.useProgram(program);

  const position = gl.getAttribLocation(program, 'p');
  const time = gl.getUniformLocation(program, 't');
  const buffer = gl.createBuffer();

  if (buffer) cleanup.push(() => gl.deleteBuffer(buffer));
  const texture = gl.createTexture();

  if (texture) cleanup.push(() => gl.deleteTexture(texture));

  if (position < 0 || !time || !buffer || !texture) return fail();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let ready = false;

  return {
    setMask(image) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      ready = true;
    },
    draw(seconds) {
      if (!ready) return false;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(time, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      return true;
    },
    dispose,
  };
}
