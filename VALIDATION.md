# Validación

## Tercera iteración · 11 de octubre de 2026

Ver `MOTION-ITERATION-03.md` para el alcance y las pruebas actuales. Doce páginas bilingües; nueve pruebas de lógica correctas; recorridos de Chrome desktop y mobile sin errores JavaScript; comprobación del prefijo de Pages y recursos sin errores. Axe no encontró infracciones en las rutas principales evaluadas.

Lighthouse móvil de producción local: 80 rendimiento, 100 accesibilidad, 100 buenas prácticas y 100 SEO. FCP 1,9 s, LCP 3,8 s, TBT 340 ms, CLS 0. La velocidad de carga visual móvil queda como punto de mejora, sin afirmar métricas de campo.

La tercera iteración está en revisión local; no se ha publicado sobre la segunda iteración.

## Registro histórico · Primera iteración · 9 de octubre de 2026

## Compilación y comportamiento

- Compilación de producción de Vite: correcta, seis documentos HTML y assets locales.
- Build con `BASE_PATH=/conbalu-shop/`: correcto. Las rutas HTML, recursos del hero, estilos y fuente reciben el prefijo Pages.
- 4 pruebas de lógica: correctas (recuentos e IDs, bolsa inválida/duplicada, exportación completa del brief, bloqueo del checkout pendiente).
- 24 combinaciones de ruta y viewport revisadas: seis rutas en 320, 390, 768 y 1440 px; sin desborde horizontal.
- Sin errores de JavaScript en los recorridos probados.
- Filtros, búsqueda sin distinción de acentos, estado vacío y reinicio: correctos.
- Detalle, agregado, persistencia tras recarga y eliminación de productos: correctos.
- Brief de tres pasos: campos obligatorios, preselección de media kit, descarga real del TXT con todos los campos y estado explícito de no envío: correctos.
- Navegación móvil, FAQ, foco tras navegar, Escape y devolución del foco al abrir/cerrar modales: correctos.
- Sin JavaScript: contenido principal, catálogo y enlaces reales disponibles.
- Nombres de base root y subdirectorio, enlaces externos, query strings y prevención de prefijo repetido: correctos.
- Movimiento reducido, también al cambiar la preferencia durante la visita: Lenis se destruye, el texto recupera su marcado original y no queda contenido oculto.
- Un solo motor de smooth scroll instalado e inicializado: Lenis. Scroll nativo en touch y con movimiento reducido. Sin Locomotive ni ScrollSmoother.

Resultados automatizados completos: `test-results/qa-report.json`.

La última revisión adicional, con movimiento normal y la capa de transiciones cargada por separado, pasó en 1440 y 390 px: navegación, foco, detalle de producto, teclado y movimiento reducido, sin errores de consola. Axe tampoco encontró infracciones en el hero ni en el modal; el hero se comprobó adicionalmente con reglas WCAG 2.2 AA. Resultado: `test-results/final-smoke.json`.

## Accesibilidad

Axe WCAG 2 A/AA y 2.1 AA: cero infracciones detectadas en las seis rutas, en escritorio y móvil, y en el brief. Los controles se revisaron con teclado y las imágenes se inspeccionaron visualmente. Esto no equivale a una auditoría con lectores de pantalla o en dispositivos físicos.

## Lighthouse móvil, producción local

| Categoría | Resultado |
| --- | ---: |
| Rendimiento | 85 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

- FCP: 1,7 s.
- LCP: 2,7 s.
- TBT: 410 ms.
- CLS: 0.
- Speed Index: 2,1 s.

Medición de laboratorio en Chrome con throttling móvil, sobre servidor de producción local. Las ejecuciones optimizadas oscilaron entre 85 y 87 de rendimiento. LCP queda por encima del objetivo de 2,5 s; conviene volver a medir y perfilar en el hosting definitivo. No se afirma cumplir Core Web Vitals de campo: todavía no hay datos reales de usuarios.

Informe: `test-results/lighthouse-mobile.json`. Herramienta reproducible: `scripts/performance.mjs` (usar BASE_URL y CHROME_PATH si corresponde).

## Pendientes comerciales

Assets finales de Canva, precios, licencias y políticas comerciales; cifras comerciales y reseñas verificadas; proveedor de pago; backend de contacto; entrega de enlaces por email. Ninguno se simula como operativo. El sitio sigue siendo local, sin publicación en conbalu.com.
