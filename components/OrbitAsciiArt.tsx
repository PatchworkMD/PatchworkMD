'use client';
import AsciiArtwork, { type AsciiArtworkProps } from './artwork/AsciiArtwork';

// Orbit sibling of the homepage rose: a procedural rocket in shaded ASCII
// characters under the same ink-shader wordmark.
const paintInk: AsciiArtworkProps['paintInk'] = (pen, shape) => {
  // Orbit ring first, rocket body drawn on top, nose to tail.
  pen.strokeStyle = '#22384a';
  pen.beginPath();
  pen.ellipse(180, 196, 148, 56, 0, 0, Math.PI * 2);
  pen.stroke();
  shape('M150 236 L104 282 Q128 266 150 258 Z', '#7af0b8');
  shape('M210 236 L256 282 Q232 266 210 258 Z', '#7af0b8');
  shape('M160 258 Q180 320 168 356 L192 356 Q180 320 200 258 Z', '#ffc75c');
  shape('M170 258 Q180 300 178 330 L182 330 Q180 300 190 258 Z', '#fff3d6');
  shape(
    'M154 250 Q150 150 180 96 Q210 150 206 250 Q180 268 154 250 Z',
    '#f2e9da',
  );
  shape('M180 60 Q206 96 202 146 Q180 132 158 146 Q154 96 180 60 Z', '#e4d9c4');
  shape('M180 150 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0', '#131a22');
  shape('M180 150 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0', '#6bdcff');
};

const lettering: AsciiArtworkProps['lettering'] = {
  label: 'Orbit',
  arcId: 'orbit-word-arc',
  arcPath: 'M100 220 Q500 60 900 220',
  maskStyle:
    'font-family:Georgia,serif;font-weight:700;font-size:118px;letter-spacing:-3px;fill:white;stroke:none',
};

const palette =
  'vec3 ink=vec3(.02,.03,.05),deep=vec3(.06,.14,.22),cyan=vec3(.14,.43,.55),mint=vec3(.14,.42,.34); vec3 color=wave<.45?ink:wave<1.15?deep:wave<1.65?cyan:mint;';

const burst = {
  axis: 'y',
  spread: 0.7,
  decay: 0.9,
  label: 'Launch burst',
} as const;
const glyphs: AsciiArtworkProps['glyphs'] = [60, 180];
const classNames = {
  root: 'orbit-mark',
  stage: 'orbit-lettering-stage',
  lettering: 'orbit-lettering',
  shader: 'orbit-ink-shader',
  ascii: 'orbit-ascii-rocket',
  controls: 'orbit-mark-controls',
};

export default function OrbitAsciiArt() {
  return (
    <AsciiArtwork
      classNames={classNames}
      lettering={lettering}
      palette={palette}
      inkStroke="#0c1219"
      paintInk={paintInk}
      burst={burst}
      glyphs={glyphs}
      asciiLabel="Orbit rocket illustration drawn in ASCII characters"
    />
  );
}
