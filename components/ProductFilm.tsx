'use client';
import { useEffect, useRef, useState } from 'react';
import type { ProductPage } from '../lib/products';

type Film = NonNullable<ProductPage['film']>;

const autoplayRefused = (error: unknown) =>
  error instanceof DOMException && error.name === 'NotAllowedError';

export default function ProductFilm({
  film,
  name,
}: {
  film: Film;
  name: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const play = (element: HTMLVideoElement) =>
    element.play().catch((error: unknown) => {
      if (!autoplayRefused(error)) setFailed(true);
    });

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const follow = () => {
      if (reduced.matches) element.pause();
    };
    if (!reduced.matches) void play(element);
    reduced.addEventListener('change', follow);
    return () => reduced.removeEventListener('change', follow);
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (!element.paused) return element.pause();
    if (failed) {
      setFailed(false);
      element.load();
    }
    void play(element);
  };

  return (
    <figure className="product-motion-figure">
      <video
        ref={video}
        className="product-motion-video"
        src={film.src}
        muted
        loop
        playsInline
        preload="metadata"
        poster={film.poster}
        aria-label={film.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      >
        Your browser does not support the {name} product film.
      </video>
      <figcaption>
        <span>{film.caption}</span>
        <button type="button" className="film-toggle" onClick={toggle}>
          {playing ? 'Pause film' : failed ? 'Try the film again' : 'Play film'}
        </button>
        <output className="film-status">
          {failed
            ? `The ${name} film could not load. The still image shows the same product.`
            : ''}
        </output>
      </figcaption>
    </figure>
  );
}
