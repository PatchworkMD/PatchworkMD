'use client';
import AsciiArtwork, { type AsciiArtworkProps } from './artwork/AsciiArtwork';

// Original procedural rose: layered petals rendered as shaded ASCII characters.
const paintInk: AsciiArtworkProps['paintInk'] = (pen, shape) => {
  // Draw the silhouette first, then nested folds. These contours remain legible at every frame.
  shape('M176 216 Q190 262 165 340 L173 342 Q200 268 186 215 Z', '#352d25');
  shape('M182 283 Q132 236 98 262 Q122 305 182 283 Z', '#3e5149');
  shape('M180 302 Q211 248 259 267 Q242 308 180 302 Z', '#3e5149');
  pen.strokeStyle = '#352d25';
  pen.stroke(new Path2D('M110 264 L173 282 M190 296 L248 270'));
  shape(
    'M180 231 C133 245 99 212 105 185 C65 171 70 119 101 103 C98 62 139 43 166 61 C190 26 230 50 241 75 C280 70 302 110 281 139 C304 174 277 207 251 207 C237 240 205 249 180 231 Z',
    '#ad382c',
  );
  shape(
    'M180 216 C143 221 117 199 116 170 Q143 152 173 176 Q196 145 239 166 C251 195 218 227 180 216 Z',
    '#c9553c',
  );
  shape(
    'M116 170 Q89 125 117 98 Q153 91 170 130 L173 176 Q142 147 116 170 Z',
    '#b83c2b',
  );
  shape(
    'M173 176 Q166 128 203 105 Q242 94 268 126 Q272 152 239 166 Q203 150 173 176 Z',
    '#c9553c',
  );
  shape(
    'M117 98 Q130 66 166 77 Q176 57 203 66 Q229 72 238 96 Q208 119 170 130 Q154 100 117 98 Z',
    '#ce6448',
  );
  shape(
    'M150 119 Q139 94 163 86 Q193 78 213 103 Q207 132 179 144 Z',
    '#9d3028',
  );
  shape('M164 108 Q164 92 181 95 Q200 99 195 113 L179 124 Z', '#d47756');
};

const lettering: AsciiArtworkProps['lettering'] = {
  label: 'patchwork.md',
  arcId: 'word-arc',
  arcPath: 'M70 190 Q500 20 930 190',
  maskStyle:
    'font-family:Georgia,serif;font-weight:400;font-style:italic;font-size:112px;letter-spacing:-3px;fill:white;stroke:none',
  maskOmit: '.flash-md,.flash-rule,.flash-ornament',
  ornament: (
    <g
      className="flash-ornament"
      fill="none"
      stroke="#192a35"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M150 268 C215 225 290 238 350 263 C380 278 416 281 442 269 M850 268 C785 225 710 238 650 263 C620 278 584 281 558 269" />
      <path
        d="M185 254 Q165 229 143 239 Q150 260 185 254 M815 254 Q835 229 857 239 Q850 260 815 254"
        fill="#287f8b"
      />
      <path
        d="M485 238 L500 205 L515 238 L509 303 L500 333 L491 303 Z"
        fill="#f6f5ef"
      />
      <path d="M500 214 V317 M472 250 Q500 259 528 250" />
      <path
        d="M484 239 C461 232 458 211 474 201 C470 180 493 171 504 186 C524 173 544 192 533 209 C547 227 526 247 510 236 C502 250 489 249 484 239Z"
        fill="#ac4736"
      />
      <path d="M480 204 Q499 185 519 201 Q529 219 508 231 Q485 230 480 204 M489 206 Q507 196 514 210 L503 220Z" />
      <path
        d="M465 224 Q434 202 440 185 Q468 187 475 211 M532 225 Q560 204 559 187 Q533 190 527 212"
        fill="#287f8b"
      />
      <path
        d="M370 218 v16 m-8-8 h16 M626 218 v16 m-8-8 h16"
        stroke="#b18a38"
      />
    </g>
  ),
};

const palette =
  'vec3 ink=vec3(.07,.12,.17),red=vec3(.13,.30,.36),gold=vec3(.17,.39,.47),green=vec3(.08,.16,.23); vec3 color=wave<.45?ink:wave<1.15?red:wave<1.65?gold:green;';

const burst = {
  axis: 'x',
  spread: 0.65,
  decay: 0.91,
  label: 'Scatter rose',
} as const;
const glyphs: AsciiArtworkProps['glyphs'] = [85, 170];
const classNames = {
  root: 'flash-art',
  stage: 'lettering-stage',
  lettering: 'flash-lettering',
  shader: 'ink-shader',
  ascii: 'ascii-rose',
  controls: 'flash-controls',
};

export default function FlashMark() {
  return (
    <AsciiArtwork
      classNames={classNames}
      lettering={lettering}
      palette={palette}
      inkStroke="#352d25"
      paintInk={paintInk}
      burst={burst}
      glyphs={glyphs}
      asciiLabel="Tattoo-style rose with curled petals, stem and leaves drawn in ASCII characters"
    />
  );
}
