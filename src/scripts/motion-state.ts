// Shared motion state. Motion is ON for everyone unless the visitor turns it off
// with the footer toggle (stored in localStorage → html.motion-off).
export const motionOn = () => !document.documentElement.classList.contains('motion-off');

/** Runs cb once the preloader has finished (html.is-ready). */
export function onReady(cb: () => void) {
  if (document.documentElement.classList.contains('is-ready')) cb();
  else document.addEventListener('site:ready', () => cb(), { once: true });
}
