import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { translate } from './i18n.js';
gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
const t = value => translate(value, document.documentElement.lang.startsWith('en') ? 'en' : 'es');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export function animateFilter(cards, update) {
  if (reduced.matches) { update(); ScrollTrigger.refresh(); return; }
  Flip.killFlipsOf(cards, true);
  const state = Flip.getState(cards);
  update();
  return Flip.from(state, { duration: .55, ease: 'power3.inOut', absolute: true, scale: false, prune: true,
    onEnter: els => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .45, stagger: .035 }),
    onComplete: () => ScrollTrigger.refresh(),
  });
}

export function initPageChoreography(container, { desktop }) {
  const abort = new AbortController(), cleanups = [];
  const on = (target, type, callback) => target?.addEventListener(type, callback, { signal: abort.signal });
  const headline = container.querySelector('h1');
  if (headline && !headline.closest('.hero-v2')) {
    const split = SplitText.create(headline, { type: 'lines', mask: 'lines', autoSplit: true, linesClass: 'motion-line',
      onSplit(self) { return gsap.from(self.lines, { yPercent: 105, duration: .9, stagger: .11, ease: 'power4.out' }); }
    });
    cleanups.push(() => split.revert());
  }
  // The wrappers hold their place while their contents arrive and leave.
  container.querySelectorAll('.process-intro>p,.proof-heading>p,.media-explainer>p:not(.eyebrow),.how-intro-bottom>p,.checkout-summary,.status-page>p:not(.eyebrow)').forEach(el => {
    gsap.fromTo(el, { x: desktop ? -70 : -20, y: 55 }, { x: 0, y: 0, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'clamp(top 96%)', end: 'clamp(top 64%)', scrub: .6 } });
  });
  const hero = container.querySelector('.hero-v2');
  if (hero) {
    const firstLine = hero.querySelector('.hero-line');
    const split = SplitText.create(firstLine, { type: 'words', mask: 'words' });
    gsap.from(split.words, { yPercent: 110, duration: 1, stagger: .08, ease: 'power4.out' });
    cleanups.push(() => split.revert());
    gsap.from(hero.querySelectorAll('.visual-placeholder'), { y: -55, rotation: -6, scale: .7, duration: 1.1, stagger: .12, ease: 'back.out(1.2)' });
  }
  container.querySelectorAll('[data-counter]').forEach(el => {
    const target = Number(el.dataset.counter), state = { value: 0 }, final = el.textContent;
    const tween = gsap.to(state, { value: target, duration: 1.5, ease: 'power3.out', paused: true,
      onUpdate: () => { el.textContent = String(Math.round(state.value)).padStart(final.length, '0'); }
    });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => tween.play() });
    cleanups.push(() => { el.textContent = final; });
  });
  const marquee = container.querySelector('.directional-marquee');
  if (marquee) {
    const track = marquee.querySelector('.marquee-track'), button = marquee.querySelector('button');
    let loop, direction = 1, paused = false, active = false;
    const sync = () => { if (active && !paused && !document.hidden) loop?.resume(); else loop?.pause(); };
    const build = () => {
      loop?.kill();
      const width = track.firstElementChild.getBoundingClientRect().width;
      loop = gsap.fromTo(track, { x: -width }, { x: -2 * width, duration: width / 65, repeat: -1, ease: 'none', paused: true,
        onReverseComplete: () => loop.totalTime(loop.duration() * 50)
      });
      loop.timeScale(direction); sync();
    };
    build();
    const observer = new ResizeObserver(build); observer.observe(marquee);
    ScrollTrigger.create({ trigger: marquee, start: 'top bottom', end: 'bottom top', onToggle: self => { active = self.isActive; sync(); },
      onUpdate: self => { if (direction !== self.direction) { direction = self.direction; gsap.to(loop, { timeScale: direction, duration: .55, overwrite: true }); } }
    });
    on(button, 'click', () => { paused = !paused; button.setAttribute('aria-pressed', String(paused)); button.setAttribute('aria-label', t(paused ? 'Reanudar movimiento' : 'Pausar movimiento')); button.textContent = paused ? '▶' : 'Ⅱ'; sync(); });
    on(document, 'visibilitychange', sync);
    cleanups.push(() => { observer.disconnect(); loop?.kill(); gsap.set(track, { clearProps: 'transform' }); button.setAttribute('aria-pressed', 'false'); });
  }
  const story = container.querySelector('.home-story');
  if (story) {
    const words = desktop ? [...story.querySelectorAll('[data-story-letters]')].map(el => SplitText.create(el, { type: 'chars', charsClass: 'story-char', aria: 'hidden' })) : [];
    if (desktop) {
      story.classList.add('story-pinned');
      const track = story.querySelector('.story-track'), bar = story.querySelector('.story-progress i');
      const pan = gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: story, start: 'center center', end: () => `+=${track.scrollWidth - innerWidth + 500}`, pin: true, scrub: .65, invalidateOnRefresh: true, onUpdate: self => gsap.set(bar, { scaleX: self.progress }) } });
      words.forEach((split, index) => split.chars.forEach((char, i) => {
        if (index === 0) gsap.from(char, { x: -70 + i * 3, y: i % 2 ? 90 : -80, rotation: i % 2 ? 8 : -8, ease: 'power2.out', scrollTrigger: { trigger: story, start: 'top 95%', end: 'top 25%', scrub: .65 } });
        else gsap.from(char, { y: i % 2 ? 120 : -100, x: -30, rotation: i % 2 ? -8 : 7, ease: 'back.out(1.1)', scrollTrigger: { trigger: char, containerAnimation: pan, start: 'left 105%', end: 'left 65%', scrub: .4 } });
      }));
    }
    cleanups.push(() => { words.forEach(split => split.revert()); story.classList.remove('story-pinned'); });
  }
  container.querySelectorAll('.section-waypoints a').forEach(link => {
    const target = container.querySelector(link.hash);
    if (target) ScrollTrigger.create({ trigger: target, start: 'top 55%', end: 'bottom 55%', onToggle: self => self.isActive ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current') });
  });
  const footer = document.querySelector('.footer-logotype');
  if (footer) {
    const tween = gsap.fromTo(footer, { y: 45, scaleY: .92 }, { y: 0, scaleY: 1, duration: 1.15, ease: 'elastic.out(.7,.5)', paused: true });
    ScrollTrigger.create({ trigger: footer, start: 'top 98%', onEnter: () => tween.restart(), onEnterBack: () => tween.restart() });
  }
  const canvas = container.querySelector('.paint-mask');
  if (canvas) cleanups.push(initManualPaint(canvas, abort.signal));
  return () => { abort.abort(); cleanups.reverse().forEach(fn => fn()); };
}

function initManualPaint(canvas, signal) {
  const ctx = canvas.getContext('2d'), button = canvas.parentElement.querySelector('.paint-reveal-button');
  if (!ctx || !button) return () => {};
  const strokes = [], tiles = []; let previous, held = false, size, tile = 0;
  const drawStroke = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x * size.w, a.y * size.h); ctx.lineTo(b.x * size.w, b.y * size.h); ctx.stroke(); };
  const paint = () => {
    const rect = canvas.getBoundingClientRect(), ratio = Math.min(devicePixelRatio, 1.5);
    size = { w: rect.width, h: rect.height };
    canvas.width = rect.width * ratio; canvas.height = rect.height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#e0ded7'; ctx.fillRect(0, 0, size.w, size.h);
    ctx.fillStyle = '#29261e'; ctx.font = `450 ${Math.min(size.w * .13, 68)}px Saans`; ctx.textAlign = 'center';
    ctx.fillText(document.documentElement.lang === 'en' ? 'YOUR NEXT' : 'TU PRÓXIMA', size.w / 2, size.h * .44);
    ctx.fillText(document.documentElement.lang === 'en' ? 'BIG IDEA.' : 'GRAN IDEA.', size.w / 2, size.h * .62);
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Math.min(size.w * .18, 90);
    strokes.forEach(([a,b]) => drawStroke(a,b));
    tiles.forEach(n => ctx.clearRect((n % 4) * size.w / 4, Math.floor(n / 4) * size.h / 4, size.w / 4 + 1, size.h / 4 + 1));
  };
  canvas.style.display = 'block'; button.style.display = 'flex'; paint();
  const observer = new ResizeObserver(paint); observer.observe(canvas);
  document.fonts.ready.then(() => { if (!signal.aborted) paint(); });
  const erase = event => {
    const rect = canvas.getBoundingClientRect(), point = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
    const a = previous || point; strokes.push([a,point]); drawStroke(a,point); previous = point;
  };
  canvas.addEventListener('pointerdown', event => { held = true; previous = undefined; canvas.setPointerCapture(event.pointerId); erase(event); }, { signal });
  canvas.addEventListener('pointermove', event => { if (event.pointerType === 'mouse' || held) erase(event); }, { signal });
  ['pointerup','pointercancel','pointerleave'].forEach(type => canvas.addEventListener(type, () => { held = false; previous = undefined; }, { signal }));
  button.addEventListener('click', () => {
    if (tile >= 16) return;
    tiles.push(tile++); paint();
    button.textContent = `${t('Revelar por partes')} (${tile}/16)`;
    if (tile === 16) button.disabled = true;
  }, { signal });
  return () => { observer.disconnect(); canvas.style.display = ''; button.style.display = ''; button.disabled = false; button.textContent = t('Revelar por partes'); };
}

export function initCursorAndBrand() {
  const media = gsap.matchMedia(), cursor = document.querySelector('.custom-cursor');
  media.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const abort = new AbortController(); let target, rect;
    gsap.set(cursor, { display: 'block' });
    const x = gsap.quickTo(cursor, 'x', { duration: .2, ease: 'power3.out' }), y = gsap.quickTo(cursor, 'y', { duration: .2, ease: 'power3.out' });
    const scale = gsap.quickTo(cursor, 'scale', { duration: .4, ease: 'back.out(1.5)' });
    const hide = () => { cursor.style.opacity = '0'; document.documentElement.classList.remove('cursor-enabled'); };
    document.addEventListener('pointermove', e => {
      if (e.target.closest('dialog,input,textarea,select') || document.querySelector('dialog[open]')) return hide();
      document.documentElement.classList.add('cursor-enabled'); cursor.style.opacity = '1';
      const next = e.target.closest('.menu-toggle,.button,.product-visual,a');
      if (next !== target) { target = next; rect = target?.getBoundingClientRect(); cursor.classList.toggle('is-gallery', !!target?.matches('.product-visual')); cursor.firstElementChild.textContent = document.documentElement.lang === 'en' ? 'View' : 'Ver'; scale(target?.matches('.product-visual') ? 4.4 : target ? 2 : 1); }
      const sticky = target?.matches('.menu-toggle');
      x(sticky ? rect.left + rect.width / 2 + (e.clientX - rect.left - rect.width / 2) * .12 : e.clientX);
      y(sticky ? rect.top + rect.height / 2 + (e.clientY - rect.top - rect.height / 2) * .12 : e.clientY);
    }, { signal: abort.signal, passive: true });
    document.addEventListener('pointerleave', hide, { signal: abort.signal });
    document.addEventListener('keydown', e => { if (e.key === 'Tab') hide(); }, { signal: abort.signal });
    window.addEventListener('blur', hide, { signal: abort.signal });
    document.addEventListener('visibilitychange', hide, { signal: abort.signal });
    return () => { abort.abort(); hide(); };
  });
  const brand = document.querySelector('.footer-logotype');
  const fit = () => {
    if (!brand) return;
    brand.style.fontSize = '100px';
    const width = brand.getBoundingClientRect().width;
    if (width) brand.style.fontSize = `${brand.parentElement.clientWidth / width * 100}px`;
    ScrollTrigger.refresh();
  };
  const observer = new ResizeObserver(fit); if (brand) observer.observe(brand.parentElement);
  document.fonts.ready.then(fit);
  return () => { media.revert(); observer.disconnect(); };
}

export function createExitNudge(dialog, close) {
  const nudge = document.createElement('aside'); nudge.className = 'exit-nudge'; nudge.hidden = true; nudge.setAttribute('role', 'dialog'); nudge.setAttribute('aria-label', t('¿Te vas? Tu idea sigue acá.'));
  nudge.innerHTML = `<p>${t('¿Te vas? Tu idea sigue acá.')}</p><small>${t('Tu texto se conserva mientras estés en esta página.')}</small><div><button type="button" data-stay>${t('Seguir creando')}</button><button type="button" data-dismiss>${t('Cerrar formulario')}</button></div>`;
  dialog.append(nudge); let lastFocus;
  const hide = () => { gsap.killTweensOf(nudge); nudge.hidden = true; };
  nudge.addEventListener('click', e => {
    if (e.target.closest('[data-stay]')) { hide(); (lastFocus?.isConnected ? lastFocus : dialog.querySelector('input')).focus({ preventScroll: true }); }
    if (e.target.closest('[data-dismiss]')) { hide(); close(dialog); }
  });
  dialog.addEventListener('close', hide);
  return { show(event) {
    lastFocus = document.activeElement; nudge.hidden = false;
    const r = nudge.getBoundingClientRect();
    gsap.set(nudge, { left: Math.max(14, Math.min(event.clientX, innerWidth - r.width - 14)), top: Math.max(14, Math.min(event.clientY, innerHeight - r.height - 14)) });
    if (!reduced.matches) gsap.fromTo(nudge, { y: 12, scale: .92 }, { y: 0, scale: 1, duration: .45, ease: 'back.out(1.6)', overwrite: true });
    nudge.querySelector('button').focus({ preventScroll: true });
  }, hide };
}
