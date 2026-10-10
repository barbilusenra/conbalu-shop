# Conbalu

Sitio local completo para una tienda de plantillas Canva. HTML prerenderizado + Vite + JavaScript, sin dependencia de un servidor de aplicación para navegar.

## GitHub Pages

El workflow en `.github/workflows/pages.yml` valida y publica únicamente al cambiar `main`. Configura automáticamente el prefijo de la URL del repositorio, mantiene el router multipágina y coloca el sitio en GitHub Pages. Los pushes a `primera-iteracion` y `segunda-iteracion` no publican. GitHub Actions debe tener Pages habilitado como fuente de deploy.

Para el repo `conbalu-shop`, la URL esperada es `https://barbilusenra.github.io/conbalu-shop/`. La publicación efectiva queda confirmada cuando Actions complete el deploy y GitHub Pages devuelva su URL.

## Iniciar

```sh
pnpm install
pnpm dev
```

Vista local: http://127.0.0.1:5173/

```sh
pnpm build
pnpm preview
pnpm test
node scripts/qa.mjs
```

La QA de navegador usa Chrome instalado en Windows. Para otra ubicación, configurar `CHROME_PATH`. El servidor de desarrollo debe estar activo para `qa.mjs`. Los resultados y capturas se guardan en `test-results/`.

## Páginas

- `/`: hero, catálogo por categorías, manifiesto, proceso, cifras de catálogo, espacio para reseñas reales, recursos Coming Soon, personalización.
- `/shop/`: 14 fichas de concepto (10 carruseles, 3 portfolios, 1 media kit), filtros, búsqueda sin distinción de acentos, modal de producto, bolsa persistente y personalización por tipo.
- `/como-funciona/`: proceso, descripción de media kit y FAQ.
- `/checkout/`: selección y estado de compras en preparación.
- `/checkout/exito/`: estado seguro hasta recibir una confirmación verificada.
- `/checkout/cancelado/`: salida sin cobro y regreso a la selección.

## Editar contenido

`scripts/generate.mjs` contiene los componentes y el contenido de las páginas. `pnpm dev` y `pnpm build` regeneran el HTML. No editar manualmente los HTML generados. Luego de cambiar el generador durante desarrollo, ejecutar `node scripts/generate.mjs`.

`src/catalog.js` contiene la estructura del catálogo. Los nombres son propuestas editoriales y las imágenes son conceptos, no previews de archivos Canva existentes. Reemplazar por los 10 carruseles y 3 portfolios reales, y el media kit, con sus precios, licencias, requisitos de Canva y enlaces de entrega antes de vender.

## Diseño y assets

- Dirección completa: `ART-DIRECTION.md`.
- Paleta exacta del brief. DM Sans variable autohospedada (SIL OFL) como alternativa grotesca a SaanS. SaanS no fue proporcionada.
- Íconos Solar vía Iconify, licencia CC BY 4.0; https://icon-sets.iconify.design/solar/.
- Tríptico editorial original generado mediante la herramienta integrada de imagegen. Archivo fuente: `public/images/editorial-concepts.png`; versión web optimizada: `public/images/editorial-concepts.webp` (207 KB frente a 2,29 MB del PNG). Prompt: `ASSET-PROVENANCE.md`.
- Variante móvil de 768 px: `public/images/editorial-concepts-small.webp` (61 KB). El navegador elige la resolución mediante `srcset`. Se conservan las proporciones originales y se precarga la fuente principal.
- No se usaron logos de socios, reseñas ficticias, fotos de clientes ni métricas comerciales inventadas. Las cifras de catálogo vienen del brief. La experiencia, las ventas, las personas ayudadas y la valoración quedan pendientes de datos verificables.

## Movimiento y accesibilidad

GSAP Core + Timeline + ScrollTrigger para entradas y composición editorial durante scroll. Barba para navegar entre páginas; cada cambio limpia animaciones, listeners y triggers, actualiza el título y mueve el foco al contenido. Lenis es el único motor de smooth scroll, solo con puntero fino y sin movimiento reducido. Touch conserva scroll nativo. No se agregó Three.js.

En móvil, IntersectionObserver inicia un tween por título al entrar en pantalla, sin dividir o medir todo el documento al cargar. El texto conserva contraste completo durante las animaciones. Todos los observers y tweens móviles se limpian al navegar o activar movimiento reducido.

`prefers-reduced-motion` se aplica en vivo: desactiva Lenis, parallax, revelaciones y transiciones. La navegación, el contenido y la FAQ funcionan sin JavaScript; bolsa, búsqueda, detalles y brief necesitan JS. Los modales nativos conservan foco, Escape y retorno al control de origen. Formularios con etiquetas y validación por paso.

Skills aplicadas: build-awwwards-quality-sites, design-taste-frontend, scroll-experience, gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-performance, barba-js, imagegen, PDF y Sites en modo local. No se agregaron frameworks ni plugins que no aportaran al proyecto.

## Checkout, email y brief

No hay pagos ni envíos de email reales. No se recopilan tarjetas ni se inventan precios. `src/integrations.js` define el estado y los puntos de integración.

Para activar ventas:

1. Proveer archivos/productos definitivos, precios, licencias y políticas comerciales.
2. Implementar un backend que genere órdenes con IDs y precios validados en servidor; elegir PayPal o checkout propio.
3. Verificar la notificación firmada del proveedor e implementar idempotencia. Una URL de éxito nunca prueba un pago.
4. Encolar el email con enlaces de Canva después de confirmar el pago; reintentar la entrega independientemente.
5. Conectar el brief a un endpoint con validación, límites y protección contra abuso. Sustituir el mensaje de descarga local solo cuando el envío esté disponible.

El brief actual reúne nombre, email, tipo, Instagram, logo, colores, recursos, objetivo, plazo, presupuesto y notas. Descarga un TXT con todos los campos; no envía ni guarda datos personales. La bolsa solo guarda IDs de producto en localStorage; se puede borrar desde Privacidad. No hay analítica.

## Referencias de implementación

- GSAP matchMedia: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- Lenis e integración con GSAP: https://github.com/darkroomengineering/lenis
- Ciclo de navegación de Barba: https://barba.js.org/docs/getstarted/lifecycle/

## Alcance pendiente

Resultados de compilación, pruebas y Lighthouse: `VALIDATION.md`.

No se publicó ni se conectó con conbalu.com. Faltan los assets reales de Canva, precios, licencia de SaanS si se desea, pruebas sociales verificadas, backend de contacto, proveedor de pagos y servicio de email. Las pruebas de navegador son automatizadas en Chrome; no sustituyen pruebas en dispositivos físicos o con lectores de pantalla.
