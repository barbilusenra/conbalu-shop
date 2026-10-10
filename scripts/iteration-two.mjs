// Original Conbalu compositions. Motion references are documented in MOTION-REFERENCES.md.
export const elasticLine = `<div class="elastic-line" aria-hidden="true"><svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0 50 Q500 50 1000 50"/></svg></div>`;

export function hero({ poster, arrow, star }) {
  return `<section class="hero hero-v2" data-trail>
    <div class="hero-topline"><span>Plantillas con personalidad.</span><span>Hechas para Canva.</span></div>
    <div class="hero-stage" aria-hidden="true">
      <div class="hero-float float-a" data-float="1">${poster(0, '', true)}</div>
      <div class="hero-float float-b" data-float=".55">${poster(1, '', true)}</div>
      <div class="hero-float float-c" data-float=".3">${poster(2, '', true)}</div>
    </div>
    <h1 aria-label="Hacé que se note."><span class="hero-line" aria-hidden="true">Hacé que</span><span class="hero-line hero-variable" data-variable aria-hidden="true">se note.</span></h1>
    <span class="hero-sticker" aria-hidden="true">MUCHO<br>MÁS VOS ${star}</span>
    <div class="hero-bottom"><p>Tu contenido tiene algo que decir.<br>Dale una forma que se sienta tuya.</p><a class="button" href="/shop/" data-magnetic>Encontrá tu plantilla ${arrow}</a></div>
  </section>`;
}

export function navigation({ icon, bag, arrow }) {
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="Conbalu, inicio">conbalu<span class="brand-dot" aria-hidden="true">*</span></a><span class="nav-note">Designing with intention.</span><div class="nav-actions"><button class="cart-toggle" data-cart aria-label="Abrir bolsa">${bag}<span class="bag-label">Bolsa</span><span data-cart-count>0</span></button><button class="menu-toggle" aria-label="Abrir menú" aria-controls="menu-dialog" aria-expanded="false"><span>Menú</span><span class="menu-bars" aria-hidden="true"><i></i><i></i></span></button></div></header>
  <dialog id="menu-dialog" class="menu-dialog" aria-label="Navegación principal" data-lenis-prevent>
    <div class="menu-panel menu-panel-main"><div class="menu-heading"><span>Pasá, ponete cómoda.</span><button class="menu-close" data-menu-close aria-label="Cerrar menú">Cerrar ${icon('close-circle-linear')}</button></div><nav id="main-nav" aria-label="Navegación principal"><a href="/" data-nav="home"><span>Inicio</span>${arrow}</a><a href="/shop/" data-nav="shop"><span>Shop</span>${arrow}</a><a href="/como-funciona/" data-nav="how"><span>Cómo funciona</span>${arrow}</a></nav></div>
    <div class="menu-panel menu-panel-bottom"><p>Una base.<br> Infinitas formas de ser vos.</p><button class="button button-outline" data-custom="carousel">Hagamos algo a medida ${arrow}</button></div>
  </dialog>`;
}

export function productCard(p, { poster, categories, arrow }) {
  return `<article class="product-card" data-category="${p.category}" data-name="${p.name.toLowerCase()}"><button class="product-visual visual-${p.category}" data-product="${p.id}" aria-label="Ver ${p.name}"><span class="mouse-gallery" aria-hidden="true">${[0, 1, 2].map((offset) => `<span class="gallery-sheet sheet-${offset}">${poster((p.panel + offset) % 3)}</span>`).join('')}</span><span class="gallery-hint">Explorá el concepto</span></button><div class="product-meta"><span>${categories[p.category].singular} / ${p.number}</span></div><button class="product-name" data-product="${p.id}">${p.name}${arrow}</button><p class="product-caption">Vista de concepto · Precio por confirmar</p></article>`;
}

export function shopIntro({ poster, products }) {
  return `<section class="shop-intro section"><h1>Shop <span>(${products.length})</span></h1><p>Elegí una base. Hacela tan tuya como tu próxima idea.</p></section>`;
}

export function shopReel({ poster }) {
  return `<section class="shop-reel" tabindex="0" aria-label="Una base, muchas posibilidades"><div class="reel-track"><h2>UNA BASE.</h2><div class="reel-image">${poster(0)}</div><h2>MUCHO MÁS VOS.</h2><div class="reel-image">${poster(1)}</div><p>Textos, colores, fotos.<br>Tu identidad tiene lugar acá.</p></div></section>`;
}

export function howIntro({ arrow }) {
  return `<section class="how-hero section"><div class="how-heading"><h1>Cómo<br><span>funciona.</span></h1><div class="how-index"><span>01 / Elegí.</span><span>02 / Editá.</span><span>03 / Mostrá.</span></div></div><div class="how-intro-bottom"><p>Vos ponés la idea.<br>La forma ya está.</p><a class="button button-outline" href="#pasos">Del primer clic a tu próximo post ${arrow}</a></div>${elasticLine}</section>`;
}

export function howJourney({ poster, arrow }) {
  const steps = [
    ['ELEGÍ.', 'Encontrá tu formato.', '¿Una idea que necesita varios slides? ¿Proyectos para mostrar? ¿Una presentación para marcas? Hay una base para cada historia.', 0],
    ['EDITÁ.', 'Abrí espacio para tu identidad.', 'Cuando recibas el enlace, creá tu copia en Canva y reemplazá textos, fotos y colores. Conservá lo que te sirve y adaptá el resto.', 1],
    ['MOSTRÁ.', 'Dale salida a esa idea.', 'Exportá el resultado en el formato que necesites. Publicá tu carrusel o compartí tu presentación con tu próximo cliente.', 2],
  ];
  return `<section class="how-journey" id="pasos" aria-label="Tres pasos para hacerla tuya"><div class="journey-label"><span>De “me gusta” a “es muy yo”.</span><span aria-hidden="true" data-journey-counter>01 / 03</span></div><div class="journey-track">${steps.map(([word, heading, text, panel], i) => `<article class="journey-panel"><div class="journey-word" data-assemble aria-hidden="true">${word}</div><div class="journey-body"><span class="journey-number">0${i + 1}</span><div><h2>${heading}</h2><p>${text}</p>${i === 0 ? `<a class="text-link" href="/shop/">Explorar plantillas ${arrow}</a>` : i === 1 ? '<p class="inline-note">Los requisitos de Canva se detallarán en cada producto.</p>' : `<button class="text-link" data-custom="portfolio">Prefiero una versión a medida ${arrow}</button>`}</div><div class="journey-poster">${poster(panel)}</div></div></article>`).join('')}</div></section>`;
}

export const atmosphere = `<div class="atmosphere" aria-hidden="true"><div class="color-blob blob-pink"></div><div class="color-blob blob-yellow"></div><div class="color-blob blob-peach"></div></div>`;
export const loader = `<div class="load-mark" aria-hidden="true"><span>conbalu*</span><span>Hacelo tuyo.</span></div>`;
