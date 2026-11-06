type LoopOptions = {
  element: Element;
  frameMs: number;
  isMoving: () => boolean;
  draw: (seconds: number) => void;
};

export type ArtworkLoop = { wake: () => void; stop: () => void };

export function startArtworkLoop({
  element,
  frameMs,
  isMoving,
  draw,
}: LoopOptions): ArtworkLoop {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let last = 0;
  let seconds = 0;
  let visible = true;
  let stopped = false;

  const tick = (now: number) => {
    frame = 0;
    if (stopped || !visible || document.hidden) return;
    const moving = isMoving() && !reduced.matches;
    if (moving && last && now - last < frameMs) {
      frame = requestAnimationFrame(tick);
      return;
    }
    if (moving && last) seconds += Math.min(now - last, 100) / 1000;
    last = moving ? now : 0;
    draw(seconds);
    if (moving) frame = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!frame && !stopped) frame = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', wake);
  reduced.addEventListener('change', wake);
  window.addEventListener('resize', wake);
  wake();

  return {
    wake,
    stop() {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', wake);
      reduced.removeEventListener('change', wake);
      window.removeEventListener('resize', wake);
    },
  };
}
