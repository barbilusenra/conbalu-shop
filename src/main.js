import gsap from 'gsap';
import { translate, translateMarkup } from './i18n.js';
import { createPricing, samplePrices } from './pricing.js';
import { animateFilter, initCursorAndBrand, createExitNudge } from './motion-three.js';
const locale = document.documentElement.lang.startsWith('en') ? 'en' : 'es';
const t = text => translate(text, locale);
const html = text => translateMarkup(text, locale);
const pricing = createPricing(locale);
const cleanupCursor = initCursorAndBrand();
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { products, categories, cleanCart, getProduct } from './catalog.js';
import { briefToText } from './integrations.js';
import { initMotion, initAmbientMotion, createMenuController, burst } from './motion.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const bagKey = 'conbalu:bag:v1';
const sitePath = path => `${import.meta.env.BASE_URL}${locale === 'en' && !path.startsWith('/images/') ? 'en/' : ''}${path.replace(/^\/+/, '')}`;
let cart = [];
try { cart = cleanCart(JSON.parse(localStorage.getItem(bagKey) || '[]')); } catch { /* Storage can be unavailable. In-memory bag still works. */ }
let lenis, pageMotion, pageAbort, toastTimer, activeStep = 0, filter = 'all';
let opener;
const menuController = createMenuController(() => lenis);
const cleanupAmbient = initAmbientMotion();
const modalIds = ['product-dialog','cart-dialog','brief-dialog','privacy-dialog'];

function notify(message) {
  const toast = $('.toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function persist() {
  try { localStorage.setItem(bagKey, JSON.stringify(cart)); } catch { notify(t('Tu selección se conservará durante esta visita.')); }
  updateCart();
}
function openDialog(id) {
  const fromMenu = $('#menu-dialog').open;
  if (fromMenu) menuController.close({ immediate: true, returnFocus: false });
  const alreadyOpen = $('dialog[open]');
  if (fromMenu) opener = $('.menu-toggle');
  else if (!alreadyOpen) opener = document.activeElement;
  else alreadyOpen.close();
  lenis?.stop();
  const dialog = $(id);
  gsap.killTweensOf(dialog);
  dialog.showModal();
  if (!reduced.matches) gsap.fromTo(dialog, { x: id === '#cart-dialog' ? 100 : 0, y: id === '#cart-dialog' ? 0 : 18, opacity: .7 }, { x: 0, y: 0, opacity: 1, duration: .5, ease: 'power3.out', clearProps: 'transform,opacity' });
}
function closeDialog(dialog) {
  if (!dialog?.open) return;
  gsap.killTweensOf(dialog);
  if (reduced.matches) { dialog.close(); return; }
  gsap.to(dialog, { x: dialog.id === 'cart-dialog' ? 80 : 0, y: dialog.id === 'cart-dialog' ? 0 : 12, opacity: 0, duration: .22, ease: 'power2.in', onComplete: () => { dialog.close(); gsap.set(dialog, { clearProps: 'transform,opacity' }); } });
}
const exitNudge = createExitNudge($('#brief-dialog'), closeDialog);
modalIds.forEach(id => {
  const dialog = document.getElementById(id);
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeDialog(dialog); });
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) { lenis?.start(); if (opener?.isConnected) opener.focus({preventScroll:true}); }
  });
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
      if (id === 'brief-dialog') exitNudge.show(e); else closeDialog(dialog);
    }
  });
});
const arrow = '<span aria-hidden="true">↗</span>';
const art = p => `<div class="poster panel-${p.panel}"><img src="${sitePath('/images/editorial-concepts.webp')}" srcset="${sitePath('/images/editorial-concepts-small.webp')} 768w, ${sitePath('/images/editorial-concepts.webp')} 1536w" sizes="(max-width: 767px) 110vw, 60vw" alt="Vista de concepto de ${p.name}" width="1536" height="1024"></div>`;
function showProduct(id) {
  const p = getProduct(id);
  if (!p) return;
  $('#product-content').innerHTML = html(`<div class="product-detail"><div class="detail-image">${art(p)}</div><div class="detail-copy"><span class="eyebrow">${categories[p.category].singular} / ${p.number}</span><h2 id="product-title">${p.name}</h2><p>${p.description}</p><p class="detail-price"><span class="product-price" data-price-usd="${samplePrices[p.category]}"></span><small>Precio de muestra</small></p><div class="detail-facts">Formato digital · Edición en Canva<br>Contenido final y requisitos por confirmar<br>Precio por confirmar</div><button class="button" data-add="${p.id}">${cart.includes(p.id) ? 'Ya está en tu bolsa' : 'Guardar en mi bolsa'} ${arrow}</button><button class="button button-outline" data-custom="${p.category}">Lo quiero a mi manera ${arrow}</button><p class="detail-note">Vista de concepto. La imagen es una exploración visual; el archivo final y sus condiciones se publicarán antes de habilitar la compra.</p></div></div>`);
  pricing.refresh(); openDialog('#product-dialog');
}
function itemMarkup(p) {
  return html(`<article class="cart-item">${art(p)}<div><h3>${p.name}</h3><p>${categories[p.category].singular}<span class="product-price" data-price-usd="${samplePrices[p.category]}"></span></p></div><button class="remove-item" data-remove="${p.id}" aria-label="Quitar ${p.name}"><span aria-hidden="true">×</span></button></article>`);
}
function updateCart() {
  $('[data-bag-display]').textContent = String(cart.length).padStart(2, '0');
  $$('[data-cart-count]').forEach(el => { el.textContent = cart.length; });
  $('[data-cart]').setAttribute('aria-label', `${t('Abrir bolsa')}, ${cart.length}`);
  const items = cart.map(getProduct);
  const empty = html(`<div class="cart-empty"><h3>Acá empieza tu próxima idea.</h3><p>Tu bolsa está vacía. Explorá las plantillas y guardá las que más van con vos.</p><a href="${sitePath('/shop/')}" class="button" data-close-link>Ir al shop ${arrow}</a></div>`);
  $('#cart-content').innerHTML = items.length ? items.map(itemMarkup).join('') + html(`<div class="cart-bottom"><p>Precios de muestra. Compras próximamente.</p><p class="bag-total">Total <span data-price-usd="${items.reduce((sum,p) => sum + samplePrices[p.category],0)}"></span></p><p>No se realizará ningún cobro.</p><a class="button" href="${sitePath('/checkout/')}" data-close-link>Ver mi selección ${arrow}</a><button class="text-link" data-close>Seguir mirando</button></div>`) : empty;
  const checkoutItems = $('#checkout-items');
  if (checkoutItems) checkoutItems.innerHTML = items.length ? items.map(itemMarkup).join('') : empty;
  $$('[data-add]').forEach(button => { if (cart.includes(button.dataset.add)) button.innerHTML = html(`Ya está en tu bolsa ${arrow}`); });
  pricing.refresh();
}
function openBrief(category) {
  $('#brief-form').elements.product.value = categories[category] ? category : 'carousel';
  activeStep = 0;
  $('.form-status').textContent = '';
  showStep();
  openDialog('#brief-dialog');
}
function showStep() {
  $$('[data-step]').forEach((fieldset, i) => {
    fieldset.hidden = i !== activeStep;
    // Inactive required controls must not prevent the final submit event.
    fieldset.disabled = i !== activeStep;
  });
  $$('.step-indicator li').forEach((li,i) => i === activeStep ? li.setAttribute('aria-current','step') : li.removeAttribute('aria-current'));
  $('[data-step-number]').textContent = activeStep + 1;
  $('[data-prev]').hidden = activeStep === 0;
  $('[data-next]').hidden = activeStep === 2;
  $('[data-submit]').hidden = activeStep !== 2;
}
function validateStep() {
  const fields = $$('input,select,textarea', $(`[data-step="${activeStep}"]`));
  return fields.every(field => {
    if (field.required && !field.value.trim()) { field.setCustomValidity(t('Completá este campo para continuar.')); }
    else { field.setCustomValidity(''); }
    return field.reportValidity();
  });
}
$('#brief-form').addEventListener('input', e => { if (e.target.setCustomValidity) e.target.setCustomValidity(''); });
$('#brief-form').addEventListener('submit', e => {
  e.preventDefault();
  if (activeStep < 2) { if (validateStep()) { activeStep++; showStep(); $(`[data-step="${activeStep}"] input, [data-step="${activeStep}"] select`)?.focus(); } return; }
  if (!validateStep()) return;
  $$('[data-step]').forEach(el => { el.disabled = false; });
  const data = Object.fromEntries(new FormData(e.currentTarget));
  data.product = t(categories[data.product].singular);
  showStep();
  const blob = new Blob([briefToText(data, locale)], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'conbalu-mi-brief.txt'; link.dataset.barbaPrevent = 'all';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('.form-status').textContent = t('Tu brief está listo para guardar. No se envió: lo tenés en tu dispositivo para compartirlo cuando se habilite el contacto.');
});

function closeMenu() { menuController.close({ immediate: true, returnFocus: false }); }
document.addEventListener('click', e => {
  const target = e.target.closest('button,a');
  if (!target) return;
  if (target.matches('[data-product]')) showProduct(target.dataset.product);
  if (target.matches('[data-cart]')) { updateCart(); openDialog('#cart-dialog'); }
  if (target.matches('[data-close]')) closeDialog(target.closest('dialog'));
  if (target.matches('[data-close-link]')) closeDialog(target.closest('dialog'));
  if (target.matches('[data-custom]')) openBrief(target.dataset.custom);
  if (target.matches('[data-add]')) {
    const id = target.dataset.add;
    if (!getProduct(id)) return;
    if (!cart.includes(id)) { cart.push(id); persist(); target.textContent = t('Guardada en tu bolsa ✓'); burst(target); }
    else { closeDialog(target.closest('dialog')); openDialog('#cart-dialog'); }
  }
  if (target.matches('[data-remove]')) {
    cart = cart.filter(id => id !== target.dataset.remove); persist();
    const root = $('dialog[open]') || $('#checkout-items');
    $('[data-remove],a,button', root)?.focus();
    notify(t('Plantilla quitada de tu bolsa.'));
  }
  if (target.matches('[data-next]') && validateStep()) {
    activeStep++; showStep();
    $(`[data-step="${activeStep}"] input, [data-step="${activeStep}"] select, [data-step="${activeStep}"] textarea`)?.focus();
  }
  if (target.matches('[data-prev]')) { activeStep--; showStep(); $(`[data-step="${activeStep}"] input, [data-step="${activeStep}"] select`)?.focus(); }
  if (target.matches('.menu-toggle')) menuController.toggle();
  if (target.matches('#main-nav a')) closeMenu();
  if (target.matches('[data-privacy]')) openDialog('#privacy-dialog');
  if (target.matches('[data-clear-cart]')) { cart = []; persist(); $('#privacy-status').textContent = t('La bolsa guardada en este navegador se eliminó.'); }
  if (target.matches('[data-filter]')) {
    filter = target.dataset.filter; filterProducts();
    const url = new URL(location.href); filter === 'all' ? url.searchParams.delete('categoria') : url.searchParams.set('categoria',filter);
    history.replaceState(history.state, '', url);
  }
  if (target.matches('[data-reset-filters]')) { filter = 'all'; $('#search').value = ''; filterProducts(); const url = new URL(location.href); url.searchParams.delete('categoria'); history.replaceState(history.state,'',url); }
  if (target.matches('a[href^="#"]')) {
    const destination = document.getElementById(target.hash.slice(1));
    if (destination) { e.preventDefault(); destination.scrollIntoView({behavior:reduced.matches?'instant':'smooth'}); destination.setAttribute('tabindex','-1'); destination.focus({preventScroll:true}); }
  }
});
addEventListener('storage', e => { if (e.key === bagKey) { try { cart = cleanCart(JSON.parse(e.newValue || '[]')); } catch { cart = []; } updateCart(); } });
let filterAnimation;
function filterProducts(animate = true) {
  const input = $('#search');
  if (!input) return;
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const query = normalize(input.value.trim());
  let count = 0;
  const cards = $$('.product-card');
  const update = () => cards.forEach(card => {
    const visible = (filter === 'all' || card.dataset.category === filter) && normalize(card.dataset.name + ' ' + t(getProduct(card.querySelector('[data-product]').dataset.product).name)).includes(query);
    card.hidden = !visible;
    if (visible) count++;
  });
  if (animate) { filterAnimation?.kill(); filterAnimation = animateFilter(cards, update); } else update();
  $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  $('#result-count').textContent = count;
  $('.empty-search').hidden = count > 0;
  const custom = $('.shop-custom [data-custom]');
  if (custom) custom.dataset.custom = filter === 'all' ? 'carousel' : filter;
  ScrollTrigger.refresh();
}

// One Lenis instance, one GSAP ticker, native touch scroll. matchMedia cleanup
// removes the instance and its callbacks when reduced motion is requested.
const smoothMedia = gsap.matchMedia();
smoothMedia.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
  lenis = new Lenis({duration:1.05, smoothWheel:true, syncTouch:false, anchors:false});
  const update = () => ScrollTrigger.update();
  const tick = time => lenis?.raf(time * 1000);
  lenis.on('scroll',update); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); lenis?.off('scroll',update); lenis?.destroy(); lenis = undefined; };
});
function cleanupPage() { filterAnimation?.kill(); pageAbort?.abort(); pageMotion?.(); }
function initPage(container, navigation = false) {
  pageAbort = new AbortController();
  const namespace = container.dataset.barbaNamespace;
  const route = location.pathname.slice(import.meta.env.BASE_URL.length).replace(/^en\//, '');
  $$('[data-language]').forEach(link => { link.href = import.meta.env.BASE_URL + (link.dataset.language === 'en' ? 'en/' : '') + route + location.search + location.hash; });
  $$('[data-nav]').forEach(link => link.dataset.nav === namespace ? link.setAttribute('aria-current','page') : link.removeAttribute('aria-current'));
  if (namespace === 'shop') {
    const requested = new URL(location.href).searchParams.get('categoria');
    filter = categories[requested] ? requested : 'all';
    $('#search').addEventListener('input',filterProducts,{signal:pageAbort.signal});
    filterProducts(false);
  }
  updateCart();
  pageMotion = initMotion(container);
  const refresh = () => { if(container.isConnected) { ScrollTrigger.sort(); ScrollTrigger.refresh(); } };
  document.fonts.ready.then(refresh);
  $$('img',container).forEach(img => { if (!img.complete) img.addEventListener('load',refresh,{once:true,signal:pageAbort.signal}); });
  $$('details',container).forEach(el => el.addEventListener('toggle',refresh,{signal:pageAbort.signal}));
  if (navigation) {
    container.focus({preventScroll:true});
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  }
  refresh();
}
initPage($('main'));
// Navigation works with real links while the transition layer loads separately.
import('@barba/core').then(({default:barba}) => barba.init({
  preventRunning:true,
  timeout:10000,
  prevent:({el,href}) => el.hasAttribute('download') || el.hasAttribute('data-barba-prevent') || href.startsWith('blob:') || (new URL(href,location.href).pathname === location.pathname && new URL(href,location.href).hash),
  transitions:[{
    name:'editorial-turn',
    async leave({current}) {
      closeMenu(); $$('dialog[open]').forEach(dialog => dialog.close());
      lenis?.stop();
      if (!reduced.matches) await gsap.timeline().to(current.container,{y:-35,duration:.35,ease:'power3.in'},0).fromTo('.page-curtain',{yPercent:0},{yPercent:-101,duration:.48,ease:'power4.inOut'},0);
      gsap.set(current.container,{clearProps:'transform'});
      cleanupPage();
    },
    // Barba removes the previous container before `after`. Measuring earlier
    // includes its height and displaces pinned sections on client navigation.
    after({next}) {
      window.scrollTo({top:0,behavior:'instant'}); lenis?.scrollTo(0,{immediate:true});
      const doc = new DOMParser().parseFromString(next.html,'text/html');
      document.title = doc.title;
      const description = $('meta[name="description"]',doc)?.content;
      if (description) $('meta[name="description"]').content = description;
      initPage(next.container,true); lenis?.resize(); lenis?.start();
      if (!reduced.matches) gsap.to('.page-curtain',{yPercent:-202,duration:.5,ease:'power4.inOut',onComplete:()=>gsap.set('.page-curtain',{yPercent:0})});
    },
  }],
}));
addEventListener('pagehide', () => { cleanupPage(); smoothMedia.revert(); cleanupAmbient(); cleanupCursor(); menuController.destroy(); clearTimeout(toastTimer); });
addEventListener('pageshow', e => { if (e.persisted) location.reload(); });
