import { samplePrices } from '../src/pricing.js';

export const currencyControl = `<label class="currency-control"><span>Moneda</span><select data-currency aria-label="Moneda"><option value="USD">USD</option><option value="EUR">EUR</option><option value="ARS">ARS</option></select></label>`;
export const priceMarkup = product => `<span class="product-price" data-price-usd="${samplePrices[product.category]}">USD ${samplePrices[product.category].toFixed(2)}</span>`;
const marquee = `<section class="directional-marquee" aria-label="Tu contenido, con voz propia."><div class="marquee-window" aria-hidden="true"><div class="marquee-track">${Array.from({length:4},()=>'<span class="marquee-copy">Tu contenido, con voz propia. <span class="marquee-dot">•</span> Mucho más vos. <span class="marquee-dot">•</span> </span>').join('')}</div></div><button type="button" class="marquee-pause" aria-label="Pausar movimiento" aria-pressed="false">Ⅱ</button></section>`;
const story = `<section class="home-story" tabindex="0" aria-labelledby="story-title"><div class="story-caption"><span class="eyebrow">Un diseño que se adapta a vos.</span><span class="story-progress" aria-hidden="true"><i></i></span></div><h2 id="story-title" class="sr-only">Primero la idea. Después, la forma. Siempre, vos.</h2><div class="story-track" aria-hidden="true"><span data-story-letters>Primero la idea.</span><span data-story-letters>Después, la forma.</span><span data-story-letters>Siempre, vos.</span></div></section>`;
export function iterationThree(html, namespace) {
  html = html.replace('<div class="nav-actions">', '<div class="nav-actions"><div class="language-switch" aria-label="Idioma"><a data-language="es" data-barba-prevent="all" href="/">ES</a><a data-language="en" data-barba-prevent="all" href="/en/">EN</a></div>');
  html = html.replace('<div class="hero-stage" aria-hidden="true">', '<div class="hero-stage" aria-hidden="true"><div class="hero-float float-d visual-placeholder" data-float=".8"></div><div class="hero-float float-e visual-placeholder" data-float=".45"></div>');
  html = html.replace(/<div class="brand-strip">[\s\S]*?<\/div>/, marquee);
  html = html.replace('<section class="section process">', `${story}<section class="section process" id="proceso">`);
  html = html.replace('class="section collection"', 'class="section collection" id="coleccion"').replace('class="manifesto"', 'class="manifesto" id="manifiesto"');
  html = html.replace('<div class="shop-controls">', `<div class="shop-locale">${currencyControl}<p data-rate-status role="status">Precios de muestra en USD.</p></div><div class="shop-controls">`);
  html = html.replace('Estamos preparando los archivos finales y sus precios. Podés explorar estilos o armar tu brief a medida.', 'Precios de muestra entre USD 25 y USD 50. Los archivos finales están en preparación.');
  html = html.replace('Los precios y el pago todavía no están habilitados. Tu selección queda guardada en este navegador.', 'Tu selección queda guardada. Los precios son de muestra y el pago todavía no está habilitado.');
  html = html.replace('Esta versión local no envía datos a servidores ni usa analítica. Tu selección de productos se guarda únicamente en este navegador. El brief se descarga en tu dispositivo; los datos del formulario se borran al recargar la página.', 'Esta vista guarda la bolsa y la moneda en tu navegador. Para convertir precios consulta Frankfurter, sin enviar el contenido de tu bolsa ni los datos del formulario. El brief se descarga en tu dispositivo. No usamos analítica.');
  html = html.replace('<div id="cart-content"></div>', `${currencyControl}<p class="bag-rate" data-rate-status role="status"></p><div id="cart-content"></div>`);
  html = html.replace('>ELEGÍ.<', '>Elegí.<').replace('>EDITÁ.<', '>Editá.<').replace('>MOSTRÁ.<', '>Mostrá.<');
  html = html.replace('class="paint-mask" aria-hidden="true"', 'class="paint-mask" aria-hidden="true"');
  html = html.replace('Revelá tu próxima idea', 'Revelar por partes');
  html = html.replace('<canvas class="paint-mask"', '<span class="paint-instruction">Arrastrá para descubrir.</span><canvas class="paint-mask"');
  html = html.replace(/<strong>(10|03|01)<\/strong>/g, '<strong data-counter="$1" aria-label="$1">$1</strong>');
  html = html.replace('conbalu<span aria-hidden="true">*</span></a>', '<span class="footer-logotype">conbalu<span aria-hidden="true">*</span></span></a>');
  html = html.replace('</body>', `<div class="custom-cursor" aria-hidden="true"><span></span></div><div class="page-curtain" aria-hidden="true"></div></body>`);
  if (namespace === 'home') html = html.replace('</main>', `<nav class="section-waypoints" aria-label="Secciones"><a href="#coleccion" aria-label="Colección"><span>Colección</span><i></i></a><a href="#manifiesto" aria-label="Manifiesto"><span>Manifiesto</span><i></i></a><a href="#proceso" aria-label="Proceso"><span>Proceso</span><i></i></a></nav></main>`);
  return html;
}
