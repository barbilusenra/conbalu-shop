# Conbalu

Sitio local completo para una tienda de plantillas Canva. HTML prerenderizado + Vite + JavaScript, sin dependencia de un servidor de aplicación para navegar.

## GitHub Pages

La versión pública de la segunda iteración está en `https://barbilusenra.github.io/conbalu-shop/`, publicada desde `gh-pages`. El workflow de Actions está disponible, pero su ejecución estuvo bloqueada por la facturación de GitHub; la publicación actual usa Pages desde rama. La tercera iteración se desarrolla en `tercera-iteracion` y no se publica automáticamente.

Para generar recursos compatibles con ese repositorio, compilar con `BASE_PATH=/conbalu-shop/`. La compilación por sí sola no publica. Ver `MOTION-ITERATION-03.md` para el alcance y las verificaciones de la versión en desarrollo.

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

Las seis páginas tienen una versión en inglés bajo `/en/`. El selector ES/EN conserva la ruta, la bolsa y la preferencia de moneda. `src/i18n.js` centraliza las traducciones del contenido estático, modales y mensajes.

## Editar contenido

`scripts/generate.mjs` contiene los componentes y el contenido de las páginas. `pnpm dev` y `pnpm build` regeneran el HTML. No editar manualmente los HTML generados. Luego de cambiar el generador durante desarrollo, ejecutar `node scripts/generate.mjs`.

`src/catalog.js` contiene la estructura del catálogo. Los nombres son propuestas editoriales y las imágenes son conceptos, no previews de archivos Canva existentes. Reemplazar por los 10 carruseles y 3 portfolios reales, y el media kit, con sus precios, licencias, requisitos de Canva y enlaces de entrega antes de vender.

## Diseño y assets

- Dirección completa: `ART-DIRECTION.md`.
- Saans Collection Variable proporcionada por el usuario, autohospedada, con puntos circulares OpenType `ss07`. El peso responde al cursor en el hero. Predominan off-white y tinta cálida, con rosa y amarillo como acentos. Los dos nuevos visuales del hero son placeholders grises.
- Íconos Solar vía Iconify, licencia CC BY 4.0; https://icon-sets.iconify.design/solar/.
- Tríptico editorial original generado mediante la herramienta integrada de imagegen. Archivo fuente: `public/images/editorial-concepts.png`; versión web optimizada: `public/images/editorial-concepts.webp` (207 KB frente a 2,29 MB del PNG). Prompt: `ASSET-PROVENANCE.md`.
- Variante móvil de 768 px: `public/images/editorial-concepts-small.webp` (61 KB). El navegador elige la resolución mediante `srcset`. Se conservan las proporciones originales y se precarga la fuente principal.
- No se usaron logos de socios, reseñas ficticias, fotos de clientes ni métricas comerciales inventadas. Las cifras de catálogo vienen del brief. La experiencia, las ventas, las personas ayudadas y la valoración quedan pendientes de datos verificables.

## Movimiento y accesibilidad

GSAP Core + Timeline + ScrollTrigger para entradas y composición editorial durante scroll. Barba para navegar entre páginas; cada cambio limpia animaciones, listeners y triggers, actualiza el título y mueve el foco al contenido. Lenis es el único motor de smooth scroll, solo con puntero fino y sin movimiento reducido. Touch conserva scroll nativo. No se agregó Three.js.

SplitText vuelve a calcular las líneas al cambiar el ancho y las revela con máscaras. En escritorio, las secuencias horizontales usan ScrollTrigger; en móvil, el manifiesto se recorre con desplazamiento nativo y el proceso se presenta verticalmente. La escala de las categorías se aplica al visual, no al texto. Todos los observers, listeners y tweens de página se limpian al navegar o activar movimiento reducido.

`prefers-reduced-motion` se aplica en vivo: desactiva Lenis, parallax, revelaciones y transiciones. La navegación, el contenido y la FAQ funcionan sin JavaScript; bolsa, búsqueda, detalles y brief necesitan JS. Los modales nativos conservan foco, Escape y retorno al control de origen. Formularios con etiquetas y validación por paso.

Skills de diseño y motion: top-design (instalada para la tercera iteración), design-taste-frontend, build-awwwards-quality-sites y GSAP Core/Timeline/ScrollTrigger/Plugins/Performance. La estructura sigue siendo HTML + JavaScript, sin añadir un framework.

## Checkout, email y brief

No hay pagos ni envíos de email reales. No se recopilan tarjetas. Por pedido del usuario se muestran precios de muestra: USD 25 por carrusel, USD 40 por portfolio y USD 50 por media kit. Frankfurter v2 convierte a EUR/ARS; se muestra la fecha de cotización y, ante fallos, se conservan importes identificados en USD. `src/pricing.js` contiene esa lógica; `src/integrations.js` conserva los puntos de integración comercial.

Para activar ventas:

1. Proveer archivos/productos definitivos, precios, licencias y políticas comerciales.
2. Implementar un backend que genere órdenes con IDs y precios validados en servidor; elegir PayPal o checkout propio.
3. Verificar la notificación firmada del proveedor e implementar idempotencia. Una URL de éxito nunca prueba un pago.
4. Encolar el email con enlaces de Canva después de confirmar el pago; reintentar la entrega independientemente.
5. Conectar el brief a un endpoint con validación, límites y protección contra abuso. Sustituir el mensaje de descarga local solo cuando el envío esté disponible.

El brief reúne nombre, email, tipo, Instagram, logo, colores, recursos, objetivo, plazo, presupuesto y notas. Descarga un TXT; no transmite los datos del formulario. Un clic fuera abre un aviso junto al cursor y permite seguir escribiendo o cerrar. La bolsa guarda IDs de producto en localStorage; se puede borrar desde Privacidad. También se guarda la moneda elegida y una caché de cotizaciones de seis horas. No hay analítica.

## Referencias de implementación

- GSAP matchMedia: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- Lenis e integración con GSAP: https://github.com/darkroomengineering/lenis
- Ciclo de navegación de Barba: https://barba.js.org/docs/getstarted/lifecycle/

## Alcance pendiente

Resultados de compilación, pruebas y Lighthouse: `VALIDATION.md`.

La segunda iteración está publicada en GitHub Pages; la tercera está disponible localmente para revisión. Faltan el logo definitivo, los archivos finales de Canva, precios comerciales, pruebas sociales verificadas y las integraciones de venta/contacto. Las pruebas de navegador son automatizadas en Chrome; no sustituyen pruebas en dispositivos físicos o con lectores de pantalla.
