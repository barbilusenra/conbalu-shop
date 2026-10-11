import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { initPageChoreography } from './motion-three.js';
import { translate } from './i18n.js';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';

gsap.registerPlugin(ScrollTrigger, Flip, Physics2DPlugin, SplitText);
const t = text => translate(text, document.documentElement.lang.startsWith('en') ? 'en' : 'es');
const all = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

export function createMenuController(getLenis) {
  const dialog = document.querySelector('#menu-dialog');
  const toggle = document.querySelector('.menu-toggle');
  const panels = all('.menu-panel', dialog);
  const links = all('#main-nav a', dialog);
  let animation, closing = false;
  const finish = (returnFocus) => {
    dialog.close();
    closing = false;
    gsap.set([...panels, ...links], { clearProps: 'all' });
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', t('Abrir menú'));
    getLenis()?.start();
    if (returnFocus) toggle.focus({ preventScroll: true });
  };
  const close = ({ immediate = false, returnFocus = true } = {}) => {
    if (!dialog.open) return;
    animation?.kill();
    if (immediate || reduce.matches) return finish(returnFocus);
    closing = true;
    // The exit deliberately differs from the lateral entrance: panels drop away.
    animation = gsap.timeline({ onComplete: () => finish(returnFocus) })
      .to(links, { y: 16, opacity: 0, duration: .18, stagger: .025 }, 0)
      .to(panels, { y: () => innerHeight + 100, rotation: 6, duration: .48, stagger: { each: .07, from: 'end' }, ease: 'power3.in' }, .04);
  };
  const open = () => {
    animation?.kill();
    closing = false;
    if (!dialog.open) dialog.showModal();
    getLenis()?.stop();
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', t('Cerrar menú'));
    if (reduce.matches) gsap.set([...panels, ...links], { clearProps: 'all' });
    else animation = gsap.timeline()
      .fromTo(panels, { xPercent: 115, y: 0, rotation: 0 }, { xPercent: 0, duration: .7, stagger: .09, ease: 'power4.out' }, 0)
      .fromTo(links, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .075, ease: 'power3.out' }, .18);
    dialog.querySelector('[data-menu-close]').focus({ preventScroll: true });
  };
  const cancel = e => { e.preventDefault(); close(); };
  const click = e => { if (e.target === dialog || e.target.closest('[data-menu-close]')) close(); };
  const onPreference = () => { if (dialog.open) close({ immediate: true }); };
  dialog.addEventListener('cancel', cancel);
  dialog.addEventListener('click', click);
  reduce.addEventListener('change', onPreference);
  return { open, close, toggle: () => dialog.open && !closing ? close() : open(), destroy() { animation?.kill(); dialog.removeEventListener('cancel', cancel); dialog.removeEventListener('click', click); reduce.removeEventListener('change', onPreference); } };
}

export function burst(button) {
  if (reduce.matches) return;
  const host = button.closest('dialog') || document.body;
  const layer = document.createElement('div');
  layer.className = 'particle-burst';
  layer.setAttribute('aria-hidden', 'true');
  host.append(layer);
  const b = button.getBoundingClientRect(), l = layer.getBoundingClientRect();
  const x = b.left + b.width / 2 - l.left, y = b.top + b.height / 2 - l.top;
  const timeline = gsap.timeline({ onComplete: () => layer.remove() });
  for (let i = 0; i < 16; i++) {
    const dot = document.createElement('i'); dot.className = 'particle'; layer.append(dot);
    gsap.set(dot, { x, y, scale: .65 + Math.random() * .75 });
    timeline.to(dot, { physics2D: { angle: -160 + Math.random() * 140, velocity: 120 + Math.random() * 180, gravity: 420 }, rotation: Math.random() * 280, duration: .85, ease: 'none' }, 0)
      .to(dot, { opacity: 0, scale: 0, duration: .25 }, .6);
  }
}

export function initAmbientMotion() {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
    const abort = new AbortController();
    const targets = all('.color-blob');
    const setters = targets.map((el, i) => ({ x: gsap.quickTo(el, 'x', { duration: 1.4 + i * .3, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1.6 + i * .3, ease: 'power3.out' }) }));
    document.addEventListener('pointermove', e => {
      if (document.hidden) return;
      setters.forEach((to, i) => { const direction = i % 2 ? -1 : 1; to.x((e.clientX / innerWidth - .5) * 180 * direction); to.y((e.clientY / innerHeight - .5) * 130 * direction); });
    }, { signal: abort.signal, passive: true });
    return () => abort.abort();
  });
  const mark = document.querySelector('.load-mark');
  let intro;
  if (!reduce.matches && matchMedia('(pointer: fine)').matches && mark) {
    gsap.set(mark, { display: 'flex' });
    intro = gsap.timeline({ onComplete: () => { mark.style.display = 'none'; } })
      .fromTo(mark.firstElementChild, { fontWeight: 300, y: 20 }, { fontWeight: 760, y: 0, duration: .55, ease: 'power3.out' })
      .to(mark, { yPercent: -100, duration: .65, ease: 'power4.inOut' }, .35);
  }
  const stopIntro = () => { if (reduce.matches) { intro?.kill(); if (mark) mark.style.display = 'none'; } };
  reduce.addEventListener('change', stopIntro);
  return () => { media.revert(); intro?.kill(); reduce.removeEventListener('change', stopIntro); };
}

export function initMotion(container) {
  const media = gsap.matchMedia();
  media.add({ motion: '(prefers-reduced-motion: no-preference)', fine: '(pointer: fine)', desktop: '(min-width: 1024px)' }, context => {
    if (!context.conditions.motion) return;
    const { fine, desktop } = context.conditions;
    const abort = new AbortController();
    const cleanups = [];
    cleanups.push(initPageChoreography(container, { fine, desktop }));
    const listen = (el, event, fn, options = {}) => el?.addEventListener(event, fn, { ...options, signal: abort.signal });
    const remember = element => { const original = element.innerHTML; cleanups.push(() => { element.innerHTML = original; }); };
    const splitChars = element => {
      remember(element);
      const value = element.textContent;
      element.textContent = '';
      return [...value].map(char => { const span = document.createElement('span'); span.className = 'assemble-char'; span.textContent = char === ' ' ? '\u00a0' : char; element.append(span); return span; });
    };
    const hero = container.querySelector('.hero-v2');
    const intro = gsap.timeline({ defaults: { duration: .95, ease: 'power3.out' } });
    if (hero) {
      intro.from(hero.querySelectorAll('.hero-line'), { y: 35, stagger: .12 }, .15)
        .from(hero.querySelector('.hero-sticker'), { scale: .8, rotation: 12, ease: 'elastic.out(1,.6)' }, .4);
      if (fine) intro.from(hero.querySelectorAll('.hero-float:not(.visual-placeholder)'), { y: 80, rotation: -8, scale: .9, stagger: .12, duration: 1.15 }, .1);
      if (desktop) {
        gsap.to(hero.querySelector('.hero-stage'), { y: -80, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } });
        // A clipped image moves inside each frame independently of its outer plane.
        gsap.fromTo(hero.querySelectorAll('.hero-float .poster img'), { yPercent: -44 }, { yPercent: -56, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 } });
      }
    } else {
      const h1 = container.querySelector('h1');
      if (h1) intro.from(h1, { y: 25, duration: .75 });
    }

    // Saans glyphs have fixed advance boxes; changing weight never reflows a line.
    const variable = container.querySelector('[data-variable]');
    if (variable && fine) {
      const chars = splitChars(variable);
      chars.forEach(c => c.className = 'variable-char');
      const weightTo = chars.map(c => gsap.quickTo(c, 'fontWeight', { duration: .45, ease: 'power2.out' }));
      let rects = [];
      const measure = () => {
        chars.forEach(c => { c.style.width = ''; c.style.fontWeight = '900'; });
        const widths = chars.map(c => c.getBoundingClientRect().width);
        chars.forEach((c, i) => { c.style.width = `${widths[i]}px`; c.style.fontWeight = '300'; });
        rects = chars.map(c => c.getBoundingClientRect());
      };
      measure();
      document.fonts.ready.then(() => { if (!abort.signal.aborted) measure(); });
      listen(window, 'resize', measure);
      listen(variable, 'pointerenter', () => { rects = chars.map(c => c.getBoundingClientRect()); });
      listen(hero, 'pointermove', e => {
        rects.forEach((r, i) => { const distance = Math.abs(e.clientX - (r.left + r.width / 2)); weightTo[i](Math.round(300 + Math.pow(Math.max(0, 1 - distance / 280), .7) * 600)); });
      }, { passive: true });
      listen(hero, 'pointerleave', () => weightTo.forEach(to => to(300)));
    }

    // Masked line reveals are responsive and restored by SplitText on cleanup.
    const revealHeading = heading => {
      const split = SplitText.create(heading, { type: 'lines,words', mask: 'lines', linesClass: 'motion-line', autoSplit: true,
        onSplit(self) { return gsap.from(self.lines, { yPercent: 110, x: desktop ? -35 : 0, rotation: .6, stagger: .09, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'clamp(top 94%)', end: 'clamp(top 59%)', scrub: .45 } }); }
      });
      cleanups.push(() => split.revert());
    };
    if (desktop) all('[data-words]', container).forEach(revealHeading);
    else {
      // Measure lower-page text only when it approaches the viewport on mobile.
      const observer = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach(entry => {
          observer.unobserve(entry.target);
          context.add(() => revealHeading(entry.target));
        });
      }, { rootMargin: '160px 0px' });
      all('[data-words]', container).forEach(heading => observer.observe(heading));
      cleanups.push(() => observer.disconnect());
    }
    // Only media transforms. Card labels and descriptions keep their font size.
    const bento = container.querySelector('[data-bento]');
    if (bento) all('.category-visual', bento).forEach((visual, i) => {
      gsap.fromTo(visual, { scale: desktop ? .84 : .92, rotation: desktop ? (i - 1) * 3 : 0 }, { scale: 1, rotation: 0, ease: 'power2.out', scrollTrigger: { trigger: visual.parentElement, start: 'top 90%', end: 'top 25%', scrub: .6 } });
    });
    // Three different depth speeds adapt the multi-column parallax reference.
    all('.category-visual', container).forEach((visual, i) => {
      if (desktop) gsap.fromTo(visual.querySelectorAll('.poster'), { y: 32 + i * 8 }, { y: -25 - i * 9, ease: 'none', scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: .7 } });
    });
    const manifesto = container.querySelector('.manifesto');
    if (manifesto && desktop) {
      gsap.fromTo(manifesto.querySelector('.manifesto-one'), { y: 35 }, { y: -40, ease: 'none', scrollTrigger: { trigger: manifesto, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo(manifesto.querySelector('.manifesto-two'), { y: -20 }, { y: 45, ease: 'none', scrollTrigger: { trigger: manifesto, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }
    all('.process-list li,.product-card,.media-topics>div', container).forEach(el => {
      gsap.from(el, { y: 35, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 96%', toggleActions: 'play none none reverse' } });
    });

    const reel = container.querySelector('.shop-reel');
    if (reel && desktop) {
      reel.classList.add('is-pinned');
      const track = reel.querySelector('.reel-track');
      gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: reel, start: 'center center', end: () => `+=${track.scrollWidth - innerWidth}`, pin: true, scrub: .9, invalidateOnRefresh: true } });
      cleanups.push(() => reel.classList.remove('is-pinned'));
    }

    const journey = container.querySelector('.how-journey');
    if (journey) {
      const panels = all('.journey-panel', journey);
      const words = all('[data-assemble]', journey).map(splitChars);
      if (desktop) {
        journey.classList.add('is-horizontal');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: journey, start: 'top top', end: () => `+=${innerWidth * 2.8}`, pin: true, scrub: .7, invalidateOnRefresh: true, onUpdate: self => { journey.querySelector('[data-journey-counter]').textContent = `0${Math.min(3, 1 + Math.floor(self.progress * 3))} / 03`; } } });
        timeline.from(words[0], { yPercent: 120, rotation: 7, stagger: .035, duration: .35, ease: 'none' }, 0);
        timeline.to(journey.querySelector('.journey-track'), { x: () => -innerWidth * 2, duration: 3, ease: 'none' }, .5);
        timeline.from(words[1], { yPercent: 125, rotation: 7, stagger: .035, duration: .45, ease: 'none' }, 1.05);
        timeline.from(words[2], { yPercent: 125, rotation: 7, stagger: .035, duration: .45, ease: 'none' }, 2.5);
      } else {
        words.forEach((chars, i) => gsap.from(chars, { yPercent: 105, stagger: .04, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: panels[i], start: 'top 90%', once: true } }));
      }
      cleanups.push(() => { journey.classList.remove('is-horizontal'); journey.querySelector('[data-journey-counter]').textContent = '01 / 03'; });
    }

    if (fine) {
      all('[data-magnetic],.custom-bottom .button,.shop-custom .button', container).forEach(button => {
        const x = gsap.quickTo(button, 'x', { duration: .7, ease: 'elastic.out(1,.5)' });
        const y = gsap.quickTo(button, 'y', { duration: .7, ease: 'elastic.out(1,.5)' });
        let rect;
        listen(button, 'pointerenter', () => rect = button.getBoundingClientRect());
        listen(button, 'pointermove', e => { if (!rect) return; x((e.clientX - rect.left - rect.width / 2) * .16); y((e.clientY - rect.top - rect.height / 2) * .28); });
        listen(button, 'pointerleave', () => { x(0); y(0); });
      });
      if (hero) {
        const floats = all('[data-float]', hero).map(el => ({ depth: Number(el.dataset.float), x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }) }));
        listen(hero, 'pointermove', e => { const r = hero.getBoundingClientRect(); floats.forEach(f => { f.x((e.clientX - r.left - r.width / 2) * .06 * f.depth); f.y((e.clientY - r.top - r.height / 2) * .06 * f.depth); }); }, { passive: true });
        listen(hero, 'pointerleave', () => floats.forEach(f => { f.x(0); f.y(0); }));
        const tokens = ['Tu idea.', 'Con intención.', 'Sin filtro.', 'Tu voz.', 'Mucho más vos.', 'Con carácter.'].map(text => { const el = document.createElement('span'); el.className = 'trail-token'; el.textContent = t(text); el.setAttribute('aria-hidden', 'true'); document.body.append(el); return el; });
        let previous, index = 0;
        listen(hero, 'pointermove', e => {
          if (e.target.closest('a,button,[data-variable]')) return;
          if (!previous) { previous = { x: e.clientX, y: e.clientY }; return; }
          if (Math.hypot(previous.x - e.clientX, previous.y - e.clientY) < 135) return;
          const el = tokens[index++ % tokens.length]; gsap.killTweensOf(el);
          gsap.set(el, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -50, opacity: 1, scale: .4, rotation: -12 + Math.random() * 24 });
          gsap.timeline().to(el, { scale: 1, duration: .3, ease: 'back.out(2)' }, 0).to(el, { y: e.clientY + 90, rotation: '+=15', duration: 1.1, ease: 'power2.in' }, 0).to(el, { opacity: 0, duration: .35 }, .65);
          previous = { x: e.clientX, y: e.clientY };
        }, { passive: true });
        listen(hero, 'pointerleave', () => { previous = undefined; });
        cleanups.push(() => { tokens.forEach(el => { gsap.killTweensOf(el); el.remove(); }); });
      }
      all('.product-visual', container).forEach(visual => {
        const sheets = all('.gallery-sheet', visual);
        const to = sheets.map(el => ({ x: gsap.quickTo(el, 'x', { duration: .65, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: .8, ease: 'power3.out' }), scale: gsap.quickTo(el, 'scale', { duration: .65, ease: 'power3.out' }), rotation: gsap.quickTo(el, 'rotation', { duration: .65, ease: 'power3.out' }) }));
        let rect;
        listen(visual, 'pointerenter', () => { rect = visual.getBoundingClientRect(); });
        listen(visual, 'pointermove', e => {
          if (!rect) return;
          const x = (e.clientX - rect.left) / rect.width, y = (e.clientY - rect.top) / rect.height - .5;
          to.forEach((move, i) => { const depth = [1,.65,.4][i], distance = Math.abs(x - [.5,.8,.2][i]); move.x((x - .5) * rect.width * .22 * depth); move.y(y * 55 * depth); move.scale(.87 + (1 - distance) * .3); move.rotation((x - .5) * 14 * depth); });
        }, { passive: true });
        listen(visual, 'pointerleave', () => to.forEach(move => { move.x(0); move.y(0); move.scale(1); move.rotation(0); }));
      });
      all('.elastic-line', container).forEach(line => {
        const path = line.querySelector('path'), state = { bend: 0, x: 500 };
        const render = () => path.setAttribute('d', `M0 50 Q${state.x} ${50 + state.bend} 1000 50`);
        listen(line, 'pointermove', e => { const r = line.getBoundingClientRect(); gsap.to(state, { x: (e.clientX - r.left) / r.width * 1000, bend: (e.clientY - r.top - r.height / 2) * 2.3, duration: .18, overwrite: true, onUpdate: render }); });
        listen(line, 'pointerleave', () => gsap.to(state, { bend: 0, duration: 1.3, ease: 'elastic.out(1,.2)', overwrite: true, onUpdate: render }));
        cleanups.push(() => { gsap.killTweensOf(state); path.setAttribute('d', 'M0 50 Q500 50 1000 50'); });
      });
    }

    listen(window, 'blur', () => all('.trail-token').forEach(el => { gsap.killTweensOf(el); gsap.set(el, { opacity: 0 }); }));
    return () => { abort.abort(); cleanups.reverse().forEach(fn => fn()); };
  }, container);
  return () => media.revert();
}
