'use client';

import { useEffect, useRef, useState } from 'react';
import { siteMotion } from '../lib/motion';
import type { ProductPage } from '../lib/products';

type Film = NonNullable<ProductPage['film']>;

// The browser refused autoplay, or a later pause() or load() interrupted the
// request. Neither means the film is broken.
const playWasStopped = (error: unknown) =>
  error instanceof DOMException &&
  (error.name === 'NotAllowedError' || error.name === 'AbortError');

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
      if (!playWasStopped(error)) setFailed(true);
    });

  useEffect(() => {
    const element = video.current;

    if (!element) return;
    let heldByPolicy = true;

    const follow = () => {
      if (siteMotion.allowsMotion()) {
        if (heldByPolicy) {
          heldByPolicy = false;
          void play(element);
        }
      } else if (!element.paused) {
        heldByPolicy = true;
        element.pause();
      }
    };

    follow();

    return siteMotion.subscribe(follow);
  }, []);

  const toggle = () => {
    const element = video.current;

    if (!element) return;

    if (failed) {
      setFailed(false);
      element.load();
    } else if (!element.paused) {
      return element.pause();
    }

    void play(element);
  };

  return (
    <figure
      className="product-motion-figure"
      data-film-state={failed ? 'failed' : playing ? 'playing' : 'paused'}
    >
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
        onError={() => {
          setFailed(true);
          setPlaying(false);
        }}
      >
        Your browser does not support the {name} product film.
      </video>
      <figcaption>
        <span>{film.caption}</span>
        <button type="button" className="film-toggle" onClick={toggle}>
          {failed ? 'Try the film again' : playing ? 'Pause film' : 'Play film'}
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
