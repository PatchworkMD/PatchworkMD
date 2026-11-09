'use client';
import { useEffect, useRef, useState } from 'react';
import type { ProductPage } from '../lib/products';

type Film = NonNullable<ProductPage['film']>;

export default function ProductFilm({
  film,
  name,
}: {
  film: Film;
  name: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const follow = () => {
      if (reduced.matches) element.pause();
    };
    if (!reduced.matches) void element.play().catch(() => {});
    reduced.addEventListener('change', follow);
    return () => reduced.removeEventListener('change', follow);
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) void element.play().catch(() => {});
    else element.pause();
  };

  return (
    <figure className="product-motion-figure">
      <video
        ref={video}
        className="product-motion-video"
        muted
        loop
        playsInline
        preload="metadata"
        poster={film.poster}
        aria-label={film.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={film.src} type="video/mp4" />
        Your browser does not support the {name} product film.
      </video>
      <figcaption>
        <span>{film.caption}</span>
        <button type="button" className="film-toggle" onClick={toggle}>
          {playing ? 'Pause film' : 'Play film'}
        </button>
      </figcaption>
    </figure>
  );
}
