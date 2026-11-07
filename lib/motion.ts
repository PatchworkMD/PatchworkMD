const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
let paused = false;
let reducedQuery: MediaQueryList | undefined;

function reduced() {
  if (!reducedQuery) {
    reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
    reducedQuery.addEventListener('change', notify);
  }

  return reducedQuery.matches;
}

export const siteMotion = {
  subscribe: (listener: () => void) => {
    reduced();
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
  isPaused: () => paused,
  serverPaused: () => false,
  allowsMotion: () => !paused && !reduced(),
  setPaused: (next: boolean) => {
    paused = next;
    document.documentElement.dataset.motion = next ? 'paused' : 'running';
    notify();
  },
};
