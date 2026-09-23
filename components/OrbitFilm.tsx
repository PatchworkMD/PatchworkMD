'use client';

import { useEffect, useRef, useState } from 'react';

type FilmState = 'pending' | 'ready' | 'error';

export default function OrbitFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<FilmState>('pending');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const setReady = () => setState('ready');
    const setError = () => setState('error');
    if (video.error) setError();
    else if (video.readyState >= 1) setReady();
    video.addEventListener('loadedmetadata', setReady);
    video.addEventListener('canplay', setReady);
    video.addEventListener('play', setReady);
    video.addEventListener('error', setError);
    return () => {
      video.removeEventListener('loadedmetadata', setReady);
      video.removeEventListener('canplay', setReady);
      video.removeEventListener('play', setReady);
      video.removeEventListener('error', setError);
    };
  }, []);

  return (
    <figure className="orbit-film" aria-labelledby="orbit-film-caption">
      <div className="orbit-film-frame">
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster="/orbit/orbit-film-poster.jpg"
          onLoadedMetadata={() => setState('ready')}
          onCanPlay={() => setState('ready')}
          onPlay={() => setState('ready')}
          onError={() => setState('error')}
          aria-label="Orbit product film"
          aria-describedby="orbit-film-status"
        >
          <source src="/orbit/orbit-film.mp4" type="video/mp4" onError={() => setState('error')} />
          <track
            kind="captions"
            src="/orbit/orbit-film.vtt"
            srcLang="en"
            label="English"
          />
          Your browser does not support the Orbit film. Use the transcript below.
        </video>
      </div>
      <figcaption id="orbit-film-caption" className="orbit-film-caption">
        <span>Orbit film · recorded with demonstration sessions</span>
        <a href="/orbit/orbit-film.mp4" download>
          Download MP4 ↗
        </a>
      </figcaption>
      <output id="orbit-film-status" className="orbit-film-status" aria-live="polite">
        {state === 'ready'
          ? 'Film ready. Captions are available from the player menu.'
          : state === 'error'
            ? 'Film unavailable in this build. Use the transcript or download link.'
            : 'Film loading. Use the transcript below for silent access.'}
      </output>
    </figure>
  );
}
