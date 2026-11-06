'use client';
/* SVG and canvas provide the live artwork; replacing them with img would remove animation. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { useEffect, useRef, type ReactNode } from 'react';
import { siteMotion } from '../../lib/motion';
import MotionToggle from '../MotionToggle';
import { createInkShader } from './inkShader';
import { startArtworkLoop } from './loop';

type Shape = (path: string, fill: string) => void;

export type AsciiArtworkProps = {
  classNames: {
    root: string;
    stage: string;
    lettering: string;
    shader: string;
    ascii: string;
    controls: string;
  };
  lettering: {
    label: string;
    arcId: string;
    arcPath: string;
    maskStyle: string;
    maskOmit?: string;
    ornament?: ReactNode;
  };
  palette: string;
  inkStroke: string;
  paintInk: (pen: CanvasRenderingContext2D, shape: Shape) => void;
  burst: { axis: 'x' | 'y'; spread: number; decay: number; label: string };
  glyphs: [dense: number, mid: number];
  asciiLabel: string;
};

export default function AsciiArtwork({
  classNames,
  lettering,
  palette,
  inkStroke,
  paintInk,
  burst,
  glyphs,
  asciiLabel,
}: AsciiArtworkProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const letteringRef = useRef<SVGSVGElement>(null);
  const shaderRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLCanvasElement>(null);
  const control = useRef({ burst: 0, wake: () => {} });

  useEffect(() => {
    const root = rootRef.current;
    const svg = letteringRef.current;
    const shaderCanvas = shaderRef.current;
    const canvas = asciiRef.current;
    if (!root || !svg || !shaderCanvas || !canvas) return;
    const ctx = canvas.getContext('2d');
    const ink = document.createElement('canvas');
    ink.width = 360;
    ink.height = 360;
    const pen = ink.getContext('2d');
    if (!ctx || !pen) return;

    pen.lineWidth = 5;
    pen.lineJoin = 'round';
    pen.lineCap = 'round';
    paintInk(pen, (path, fill) => {
      const shape = new Path2D(path);
      pen.fillStyle = fill;
      pen.strokeStyle = inkStroke;
      pen.fill(shape);
      pen.stroke(shape);
    });
    const points: number[][] = [];
    const pixels = pen.getImageData(0, 0, 360, 360).data;
    for (let y = 0; y < 360; y += 5)
      for (let x = 0; x < 360; x += 4) {
        const i = (y * 360 + x) * 4;
        if (pixels[i + 3] > 100)
          points.push([
            x - 180,
            y - 180,
            pixels[i],
            pixels[i + 1],
            pixels[i + 2],
          ]);
      }

    const shader = createInkShader(shaderCanvas, palette);
    const pointer = { x: -10, y: -10 };
    const moving = siteMotion.allowsMotion;

    const drawAscii = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(devicePixelRatio, 2);
      if (
        canvas.width !== Math.round(w * dpr) ||
        canvas.height !== Math.round(h * dpr)
      ) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w / 380, h / 370);
      const spread = 1 + (moving() ? control.current.burst : 0) * burst.spread;
      ctx.font = `${7.5 * scale}px monospace`;
      ctx.textAlign = 'center';
      for (const [x, y, r, g, b] of points) {
        let px = w / 2 + x * (burst.axis === 'x' ? spread : 1) * scale;
        let py = h / 2 + y * (burst.axis === 'y' ? spread : 1) * scale;
        if (moving()) {
          const dx = px - (pointer.x + 0.5) * w;
          const dy = py - (pointer.y + 0.5) * h;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 65) {
            const push = (1 - distance / 65) * 13;
            px += (dx / distance) * push;
            py += (dy / distance) * push;
          }
        }
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(r < glyphs[0] ? '@' : r < glyphs[1] ? '#' : '*', px, py);
      }
      if (moving()) control.current.burst *= burst.decay;
      canvas.dataset.ready = 'true';
    };

    const loop = startArtworkLoop({
      element: root,
      frameMs: 33,
      draw: (seconds) => {
        if (shader?.draw(seconds)) shaderCanvas.dataset.shader = 'ready';
        drawAscii();
      },
    });
    control.current.wake = loop.wake;

    let disposed = false;
    const mask = svg.cloneNode(true);
    if (shader && mask instanceof SVGSVGElement) {
      mask.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      mask.setAttribute('width', '1000');
      mask.setAttribute('height', '390');
      if (lettering.maskOmit)
        mask
          .querySelectorAll(lettering.maskOmit)
          .forEach((node) => node.remove());
      mask
        .querySelectorAll('text')
        .forEach((node) => node.setAttribute('style', lettering.maskStyle));
      const image = new Image();
      image.onload = () => {
        if (disposed) return;
        shader.setMask(image);
        loop.wake();
      };
      image.src =
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(new XMLSerializer().serializeToString(mask));
    }

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => {
      pointer.x = -10;
      pointer.y = -10;
    };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    return () => {
      disposed = true;
      loop.stop();
      shader?.dispose();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
    };
  }, [burst, glyphs, inkStroke, lettering, paintInk, palette]);

  return (
    <div ref={rootRef} className={classNames.root}>
      <div className={classNames.stage}>
        <svg
          ref={letteringRef}
          className={classNames.lettering}
          viewBox="0 0 1000 390"
          role="img"
          aria-label={lettering.label}
        >
          <defs>
            <path id={lettering.arcId} d={lettering.arcPath} />
          </defs>
          <text textAnchor="middle">
            <textPath href={`#${lettering.arcId}`} startOffset="50%">
              {lettering.label}
            </textPath>
          </text>
          {lettering.ornament}
        </svg>
        <canvas
          ref={shaderRef}
          className={classNames.shader}
          aria-hidden="true"
        />
      </div>
      <canvas
        ref={asciiRef}
        className={classNames.ascii}
        aria-label={asciiLabel}
        role="img"
      />
      <div className={classNames.controls}>
        <button
          type="button"
          onClick={() => {
            control.current.burst = 1;
            control.current.wake();
          }}
        >
          {burst.label}
        </button>
        <MotionToggle />
      </div>
    </div>
  );
}
