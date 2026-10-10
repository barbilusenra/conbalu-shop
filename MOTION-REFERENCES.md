# Iteración 2: dirección y mapa de motion

## Dirección

Rediseño de las superficies pedidas, conservando rutas, catálogo, voz rioplatense, condiciones comerciales y flujo del brief. Referencias: las nueve capturas provistas, interpretadas como tipografía protagonista, escalas contrastadas, composiciones abiertas y ritmo editorial. No se copiaron marcas, textos ni imágenes de esos sitios.

- Skills: `design-taste-frontend`, `build-awwwards-quality-sites`, `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins` y `gsap-performance`.
- Diales de Taste: DESIGN_VARIANCE 9, MOTION_INTENSITY 9, VISUAL_DENSITY 5. El pedido explícito de gradientes, blobs, maximalismo y varios acentos prevalece sobre los valores predeterminados de las skills.
- Base existente: rosa, amarillo, papel y tinta marrón; wordmark tipográfico; Home, Shop, Cómo funciona y checkout; catálogo de 14 conceptos. Se conserva la lógica del catálogo y el checkout pendiente.
- Tipografía: Saans variable proporcionada por la usuaria, incluida en loader, navegación, contenido, diálogos y footer. Ejes inspeccionados: `wght` 300–900, `MONO` 0–100, `slnt` -10–0. Texto pequeño de 16 px y títulos normalmente entre 65 y 80 px, con excepciones expresivas en Hero y texto horizontal.
- Hero: letras como foco principal, collage editorial existente en tres planos, gradientes reactivos y CTA visible. Los caracteres tienen avances fijos para que variar el peso no desplace la composición.
- Secuencia: Hero expresivo, colección que cambia de composición, manifiesto con reveal, contenido existente; Shop compacto con catálogo interactivo y una banda horizontal; Cómo funciona con índice, recorrido fijado y FAQ.
- Scroll: se conserva Lenis. Locomotive no agrega una ventaja que justifique sustituir el motor existente. Solo una instancia y un ticker; tacto y movimiento reducido usan scroll nativo.
- Three.js: no se incorpora; DOM, GSAP y un canvas 2D acotado cubren las interacciones solicitadas.
- Imágenes: se reutilizan los conceptos originales registrados en ASSET-PROVENANCE.md. No representan archivos finales de Canva. Los archivos Saans son la edición TRIAL suministrada por la usuaria; no se presupone una licencia de producción distinta.

## Fuentes inspeccionadas y adaptación

Implementaciones propias adaptadas a HTML estático/Vite, GSAP y Barba; no se incorporan los frameworks ni los assets de los ejemplos.

| Referencia provista | Principio inspeccionado | Aplicación |
| --- | --- | --- |
| [Physics-based particles](https://codepen.io/GreenSock/pen/VwGdvj) | Velocidad, ángulo, gravedad y desaparición de partículas | Confirmación visual al guardar una plantilla en la bolsa, con Physics2DPlugin |
| [Animated menu](https://codepen.io/GreenSock/pen/qEaKJZr) | Entrada lateral de paneles; salida hacia abajo independiente | Menú responsive en diálogo nativo, stagger, foco contenido y Escape |
| [Scrubbed Bento Gallery](https://codepen.io/GreenSock/pen/vYMzKZx) | Capturar otra geometría con Flip y vincularla al scroll | Colección de Home: transición entre dos composiciones asimétricas con pin |
| [Cursor Trail](https://codepen.io/GreenSock/pen/WbbEGmp) | Pool reutilizable y umbral de distancia del cursor | Etiquetas de la voz de Conbalu en el Hero, con caída y desaparición |
| [Magnetic Button](https://codepen.io/GreenSock/pen/azmKBBJ) | Coordenadas relativas y control de tweens en conflicto | CTAs con atracción contenida y retorno elástico usando quickTo |
| [SVG Bezier Curve](https://github.com/olivierlarose/svg-bezier-curve) | Curva cuadrática y retorno amortiguado | Separador del encabezado Cómo funciona |
| [Floating Image Gallery](https://github.com/olivierlarose/floating-image-gallery) | Capas con distinta profundidad y suavizado del movimiento | Tres planos de imágenes en el Hero y galerías de las cards |
| [Mouse Scale Image Gallery](https://github.com/olivierlarose/mouse-scale-image-gallery) | Tamaño según proximidad horizontal del cursor | Las tres vistas de cada card cambian escala y posición al recorrerlas |
| [Smooth Parallax Scroll](https://github.com/olivierlarose/smooth-parallax-scroll) | Columnas a distintas velocidades | Planos de la colección y el manifiesto, coordinados por ScrollTrigger |
| [Paint Reveal](https://github.com/olivierlarose/paint-reveal) | Canvas con composición destination-out y trazo continuo | Reveal del collage en el manifiesto; botón equivalente para teclado/tacto |
| [Background Image Parallax](https://github.com/olivierlarose/background-image-parallax) | Imagen desplazándose dentro de una ventana recortada | Imágenes internas del Hero, independientes del movimiento de sus marcos |

La referencia [Awwwards Landing Page](https://github.com/olivierlarose/awwwards-landing-page) se trató como conjunto de inspiración, no como una animación adicional ni como una plantilla a clonar.

El recorrido horizontal con letras que se arman se implementa específicamente para Conbalu: un timeline de ScrollTrigger mueve el carril y revela caracteres durante el desplazamiento. En móvil se convierte en una secuencia vertical completa; la banda del Shop admite deslizamiento horizontal nativo y foco de teclado.

## Ciclo de vida y alternativas

Los efectos de página viven en `src/motion.js` y se limpian con `gsap.matchMedia`, AbortController y la transición de Barba. Se eliminan los trails, observers, callbacks, splits, pins y estilos de transición al navegar o cambiar preferencias. Los eventos de puntero usan quickTo y referencias reutilizadas. No hay render loop de WebGL ni partículas permanentes.

Con movimiento reducido: no hay loader, Lenis, pins, trails, canvas de reveal ni división de caracteres; se muestran los contenidos finales. Sin JavaScript, los encabezados, imágenes, enlaces y FAQs nativas siguen disponibles. Los efectos nunca son requisito para leer ni comprar.

Validación reproducible: `pnpm test`, `pnpm build` y `node scripts/iteration-two-check.mjs`, con Chrome disponible. Las capturas y resultados se guardan en `test-results/iteration-two/` (excluido de Git).

Verificación del 9 de octubre: las 6 pruebas del proyecto y el build con base `/conbalu-shop/` pasaron. Chrome verificó los recorridos completos en 1440 y 390 px, sin errores de navegador, imágenes rotas ni desborde horizontal. Los controles automáticos WCAG A/AA no detectaron infracciones en Home, Shop, Cómo funciona y Bolsa. Se probaron teclado/foco, filtros, persistencia de bolsa, navegación entre páginas, pin horizontal, peso variable, movimiento reducido y contenido sin JavaScript. Una revisión adicional cubrió 320, 768 y 1024 px, paint reveal, curva elástica y carril horizontal del Shop. La navegación se inicializa en el hook `after` de Barba, cuando la página anterior ya fue retirada, para medir correctamente los pins.
