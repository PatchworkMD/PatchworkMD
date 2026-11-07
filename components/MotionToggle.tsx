'use client';

import { useSyncExternalStore } from 'react';
import { siteMotion } from '../lib/motion';

export function useSiteMotionPaused() {
  return useSyncExternalStore(
    siteMotion.subscribe,
    siteMotion.isPaused,
    siteMotion.serverPaused,
  );
}

export default function MotionToggle({ className }: { className?: string }) {
  const paused = useSiteMotionPaused();

  return (
    <button
      type="button"
      className={className}
      aria-pressed={paused}
      onClick={() => siteMotion.setPaused(!paused)}
    >
      {paused ? 'Play motion' : 'Pause motion'}
    </button>
  );
}
