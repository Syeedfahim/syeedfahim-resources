// Site-wide motion: preloader, smooth scroll, scroll reveals, split-text, scroll-scrubbed
// text, counters, parallax, sticky stacking cards, scroll band, card tilt, magnetic buttons,
// auto-hiding nav and the footer "Motion" toggle.
import Lenis from 'lenis';
import { motionOn, onReady } from './motion-state';

const html = document.documentElement;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ───────── Preloader ───────── */
function runPreloader() {
  const ready = () => {
    html.classList.add('is-ready');
    document.dispatchEvent(new Event('site:ready'));
  };
  if (!html.classList.contains('is-loading')) { ready(); return; }
  const el = document.querySelector<HTMLElement>('[data-preloader]');
  const pct = el?.querySelector<HTMLElement>('[data-pct]');
  const bar = el?.querySelector<HTMLElement>('[data-bar]');
  const dur = 950;
  const t0 = performance.now();
  const frame = (t: number) => {
    const p = clamp((t - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    if (pct) pct.textContent = Math.round(e * 100) + '%';
    if (bar) bar.style.transform = `scaleX(${e})`;
    if (p < 1) requestAnimationFrame(frame);
    else {
      html.classList.add('is-leaving');
      try { sessionStorage.setItem('pre', '1'); } catch {}
      setTimeout(ready, 180);
      setTimeout(() => html.classList.remove('is-loading', 'is-leaving'), 1000);
    }
  };
  requestAnimationFrame(frame);
}

/* ───────── Smooth scroll ───────── */
let lenis: Lenis | null = null;
function initLenis() {
  if (!motionOn()) return;
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -84 }, autoRaf: true });
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
}

/* ───────── Split text into words ───────── */
function splitWords(root: HTMLElement, cls: string) {
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.append(' '); continue; }
          const outer = document.createElement('span');
          outer.className = cls;
          const inner = document.createElement('span');
          inner.textContent = part;
          outer.append(inner);
          frag.append(outer);
          words.push(outer);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as Element).matches('br, svg, img')) {
        walk(child);
      }
    }
  };
  walk(root);
  return words;
}

/* ───────── Reveal on scroll ───────── */
function initReveals() {
  // Stagger groups: give each child an incremental delay.
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((g) => {
    const step = Number(g.dataset.stagger) || 90;
    Array.from(g.children).forEach((c, i) => {
      (c as HTMLElement).setAttribute('data-reveal', (c as HTMLElement).dataset.reveal || '');
      (c as HTMLElement).style.setProperty('--rd', `${i * step}ms`);
    });
  });
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((h) => {
    splitWords(h, 'sw').forEach((w, i) => w.style.setProperty('--wi', String(i)));
  });

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-split]');
  if (!motionOn()) { targets.forEach((t) => t.classList.add('in')); return; }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  onReady(() => targets.forEach((t) => io.observe(t)));
}

/** Re-run the reveal for freshly shown content (e.g. a new tab panel). */
export function replay(container: Element) {
  if (!motionOn()) return;
  container.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.classList.remove('in');
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}
(window as unknown as { __replay?: typeof replay }).__replay = replay;

/* ───────── Counters ───────── */
function initCounters() {
  const fmt = (v: number, el: HTMLElement) => {
    const compact = el.dataset.compact !== undefined;
    const s = compact
      ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: v < 1e6 && v >= 1e5 ? 0 : 1 }).format(v)
      : Math.round(v).toLocaleString('en');
    return s + (el.dataset.suffix ?? '');
  };
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!motionOn()) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target as HTMLElement;
    const to = Number(el.dataset.count);
    const t0 = performance.now(), dur = 1600;
    const tick = (t: number) => {
      const p = clamp((t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(p < 1 ? to * eased : to, el);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  els.forEach((el) => { el.textContent = fmt(0, el); });
  onReady(() => els.forEach((el) => io.observe(el)));
}

/* ───────── Scroll-driven effects (one rAF loop) ───────── */
type ScrollFx = () => void;
const fx: ScrollFx[] = [];

function initScrub() {
  // Words light up as the block scrolls through the viewport.
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((block) => {
    const words = splitWords(block, 'scw');
    let armed = false;
    new IntersectionObserver(([e]) => { if (e.isIntersecting) armed = true; }).observe(block);
    fx.push(() => {
      if (!armed) return;
      const r = block.getBoundingClientRect();
      const vh = innerHeight;
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      const lit = p * words.length * 1.15;
      words.forEach((w, i) => w.classList.toggle('lit', i < lit));
    });
  });
}

function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const k = Number(el.dataset.parallax) || 0.1;
    fx.push(() => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const center = r.top + r.height / 2 - innerHeight / 2;
      el.style.translate = `0 ${(-center * k).toFixed(1)}px`;
    });
  });
}

function initBand() {
  document.querySelectorAll<HTMLElement>('[data-band]').forEach((band) => {
    const rows = band.querySelectorAll<HTMLElement>('[data-band-row]');
    fx.push(() => {
      const r = band.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (innerHeight - r.top) / (innerHeight + r.height); // 0 → 1 while on screen
      rows.forEach((row, i) => {
        const dir = i % 2 ? 1 : -1;
        row.style.transform = `translate3d(${(dir * (p * 28) - (dir > 0 ? 28 : 0)).toFixed(2)}%,0,0)`;
      });
    });
  });
}

function initStack() {
  // Sticky stacking cards: each card shrinks and dims as the next one slides over it.
  document.querySelectorAll<HTMLElement>('[data-stack]').forEach((list) => {
    const cards = Array.from(list.children) as HTMLElement[];
    fx.push(() => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const top = parseFloat(getComputedStyle(next).top) || 0;
        const d = next.getBoundingClientRect().top - top;
        const p = clamp(1 - d / card.offsetHeight);
        card.style.transform = `scale(${(1 - p * 0.06).toFixed(4)})`;
        card.style.filter = `brightness(${(1 - p * 0.25).toFixed(3)})`;
      });
    });
  });
}

function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  let last = scrollY;
  fx.push(() => {
    const y = scrollY;
    const menuOpen = nav.querySelector('.is-open');
    nav.classList.toggle('nav--hidden', y > 240 && y > last && !menuOpen);
    nav.classList.toggle('nav--scrolled', y > 20);
    last = y;
  });
}

function startLoop() {
  if (!fx.length) return;
  let ticking = false;
  const run = () => { ticking = false; fx.forEach((f) => f()); };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
  if (lenis) lenis.on('scroll', req); else addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  run();
}

/* ───────── Pointer niceties ───────── */
function initTilt() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform 0.15s ease-out';
      el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
      el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform = '';
    });
  });
}

function initMagnetic() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = ''; });
  });
}

/* ───────── Motion toggle (footer) ───────── */
function initToggle() {
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(!motionOn()));
    b.querySelector('[data-motion-label]')!.textContent = motionOn() ? 'On' : 'Off';
    b.addEventListener('click', () => {
      try { localStorage.setItem('motion', motionOn() ? 'off' : 'on'); } catch {}
      location.reload();
    });
  });
}

/* ───────── Boot ───────── */
initToggle();
initReveals();
initCounters();
if (motionOn()) {
  initLenis();
  initScrub();
  initParallax();
  initBand();
  initStack();
  initTilt();
  initMagnetic();
}
initNav();
startLoop();
runPreloader();
onReady(() => html.classList.add('is-ready'));
