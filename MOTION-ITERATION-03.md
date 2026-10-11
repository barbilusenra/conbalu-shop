# Conbalu · Iteración 03

## Dirección

**Idea:** tu idea toma forma. Un escenario off-white deja que la tipografía, los recortes y el movimiento construyan el contraste. El hero conserva su identidad, incorpora dos planos grises y aumenta la diferencia de peso de Saans de 300 a 900. Las letras reservan su ancho máximo para que el cursor no desplace el layout.

La secuencia horizontal se exploró primero con un estudio de tres estados (letras dispersas, aproximación y frase alineada), guardado en `test-results/iteration-three/motion-study.html`. El ritmo alterna composiciones densas con espacios de descanso. El fondo amarillo del relato y el rosa de “Elegí, editá, mostrá” se reemplazaron por off-white.

Se aplicaron Taste, Build Awwwards Quality Sites, las skills de GSAP y [Top Design](https://github.com/wondelai/skills/blob/main/top-design/SKILL.md), instalada en el directorio de skills del usuario. La prioridad explícita del usuario por texto ligado al scroll prevalece sobre la preferencia general de Top Design por reservar el parallax para elementos decorativos.

## Referencias y adaptación

Se leyeron el documento de animaciones y las capturas de Serious Business, Karim Saab y The First The Last. Las composiciones son propias; las referencias informan la escala, el espacio y el comportamiento.

| Referencia | Aplicación en Conbalu |
| --- | --- |
| [Directional Marquee](https://codepen.io/GreenSock/pen/zYaxEKV) | Bucle tipográfico en Home, inversión suave según la dirección de scroll y pausa explícita. Se detiene fuera de pantalla y al ocultar la pestaña. |
| [Sticky Cursor](https://github.com/olivierlarose/sticky-cursor) | Cursor con seguimiento amortiguado, atracción al menú y estado “Ver” sobre las galerías. Solo con puntero fino; cursor nativo en formularios. |
| [Responsive line splits](https://codepen.io/GreenSock/pen/GggpRoB) | Máscaras por línea, SplitText `autoSplit`, entrada desde abajo y reconstrucción al cambiar el ancho. |
| [Horizontal Text](https://codepen.io/GreenSock/pen/MYyBrZw) | Secuencia horizontal fijada en Home; letras con posiciones iniciales alternas que se acomodan durante el recorrido mediante `containerAnimation`. |
| [Footer bounce](https://codepen.io/GreenSock/pen/bGeZvpO) | Adaptación tipográfica con rebote vertical sutil, sin copiar el morph SVG de la demo. |
| [easeReverse UI](https://codepen.io/GreenSock/pen/JoRZaLY) | Principio de entradas y salidas asimétricas aplicado a transiciones y diálogos con timelines separados, compatibles con GSAP instalado. |
| [Scroll waypoints](https://codepen.io/GreenSock/pen/JjVPyxd) | Se examinó el cambio entre estados de layout de la referencia. Aquí se adaptó el recorrido a tres hitos laterales y una barra de avance, sin trasladar su objeto entre contenedores. |
| Flexbox Filtering, del documento | Filtros con GSAP Flip: capturar posiciones, actualizar visibilidad y reacomodar las cards. |
| Magnetic Button y perspectiva de cursor | Se conserva y ajusta el sistema magnético y la galería reactiva de la segunda iteración. |

No se implementaron literalmente todas las demos: la secuencia de imágenes requiere frames que no se proporcionaron; Three.js, canvas morphs y morphs SVG no aportan una historia propia con los assets actuales. Se priorizaron tipografía, galerías, transiciones y pintura manual. Los visuales nuevos permanecen grises como solicitó el usuario.

## Comportamiento

- Paint Reveal registra trazos normalizados y los conserva al redimensionar. No existe umbral ni temporizador que termine de revelar por el usuario. Un control de teclado revela una de dieciséis zonas por activación.
- Categorías: escala del visual y parallax de sus imágenes; el tamaño de los textos permanece constante.
- Contadores: animan cifras reales del catálogo, sin inventar ventas ni testimonios.
- Saans: se comprobó el nombre “Circular dots” de la tabla GSUB y se activó `ss07` en todo el sitio, incluidos formularios.
- El movimiento reducido desactiva cursor, pins, máscaras y pintura; deja el contenido disponible. Touch usa scroll nativo, con alternativa horizontal deslizable para el relato y vertical para el proceso.
- Un clic fuera del brief abre un pequeño aviso en el punto de interacción, limitado por los bordes del viewport. Volver al formulario conserva el texto y el foco.
- El wordmark tipográfico del footer ocupa el ancho disponible. Su sustitución por el logo definitivo queda pendiente de recibir el archivo.

## Idiomas y precios

Se generan doce documentos: seis rutas en español y las mismas seis bajo `/en/`. Los precios de muestra autorizados son USD 25, 40 y 50 por categoría. Se traducen también la bolsa, el detalle, las validaciones, las FAQ, el brief descargado y los estados de checkout.

La integración usa [Frankfurter v2](https://frankfurter.dev/) con `base=USD&quotes=EUR,ARS`. Se validan ambas cotizaciones y sus fechas; la preferencia persiste y la caché vence en seis horas. Timeout de siete segundos. Si no hay cotización válida se muestran USD, nunca una cantidad USD etiquetada como otra moneda. El formulario y la bolsa no se envían a ese servicio.

## Validación

- Compilación: doce páginas y assets generados correctamente.
- Nueve pruebas de lógica: catálogo, bolsa, brief, checkout seguro, rutas Pages, rango de precios, cotizaciones y traducción.
- Chrome 1440 y 390 px: recorrido de motion, filtros, idioma, bolsa, conversiones y total, persistencia, FAQ, aviso de salida y movimiento reducido. Cero errores JavaScript.
- Paint Reveal: pincelar repetidamente una zona conserva opacas las zonas lejanas; activación por teclado revela solo una zona.
- Home, Shop y Cómo funciona, ES/EN: sin desborde de página en 320, 390, 768, 1024 y 1440 px. Checkout EN y sus estados también comprobados en 320, 768 y 1024 px.
- Axe WCAG 2 A/AA y 2.1 AA: cero infracciones detectadas en las rutas principales revisadas y en el recorrido bilingüe. Esto no sustituye una auditoría con lectores de pantalla.

- Build adicional con prefijo `/conbalu-shop/`: las doce rutas, fuentes y recursos cargan sin errores; navegación EN entre Shop, bolsa y checkout, y cambio de idioma sin JavaScript, correctos. Informe `pages-report.json`.
- Lighthouse móvil, producción local: rendimiento 80, accesibilidad 100, buenas prácticas 100, SEO 100. FCP 1,9 s; LCP 3,8 s; TBT 340 ms; CLS 0. La carga visual móvil aún puede mejorar; estos datos de laboratorio no demuestran Core Web Vitals de usuarios reales.

Diagnóstico Top Design: **8/10**, valoración interna, no certificación. La jerarquía, asimetría, identidad y microinteracciones evolucionaron respecto de la base. No se considera un 10: faltan assets finales y logo, el LCP móvil supera 2,5 s y no todos los easings son curvas propias (el marquee usa velocidad constante deliberadamente).

Pruebas reproducibles: `scripts/iteration-three-check.mjs`, `scripts/iteration-three-layout.mjs`, `scripts/iteration-three-pages-check.mjs`, `pnpm test`. Los informes y capturas se guardan en `test-results/iteration-three/` (excluido de Git). La comprobación Pages espera la vista local en el puerto 4176 con el prefijo del repositorio.
