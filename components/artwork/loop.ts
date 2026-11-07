import { siteMotion } from '../../lib/motion';

type LoopOptions = {
  element: Element;
  frameMs: number;
  draw: (seconds: number) => void;
};

export type ArtworkLoop = { wake: () => void; stop: () => void };

export function startArtworkLoop({
  element,
  frameMs,
  draw,
}: LoopOptions): ArtworkLoop {
  let frame = 0;
  let last = 0;
  let seconds = 0;
  let visible = true;
  let stopped = false;

  const tick = (now: number) => {
    frame = 0;

    if (stopped || !visible || document.hidden) return;
    const moving = siteMotion.allowsMotion();

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
  const unsubscribe = siteMotion.subscribe(wake);
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('resize', wake);
  wake();

  return {
    wake,
    stop() {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      unsubscribe();
      document.removeEventListener('visibilitychange', wake);
      window.removeEventListener('resize', wake);
    },
  };
}
