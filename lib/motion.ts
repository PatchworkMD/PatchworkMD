const listeners = new Set<() => void>();
let paused = false;

export const siteMotion = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  isPaused: () => paused,
  serverPaused: () => false,
  setPaused: (next: boolean) => {
    paused = next;
    document.documentElement.dataset.motion = next ? 'paused' : 'running';
    listeners.forEach((listener) => listener());
  },
};
