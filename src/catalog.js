export const categories = {
  carousel: { label: 'Carruseles', singular: 'Carrusel de Instagram', count: 10 },
  portfolio: { label: 'Portfolios', singular: 'Portfolio', count: 3 },
  media: { label: 'Media kits', singular: 'Media kit', count: 1 },
};
const names = ['Ruido bonito', 'En flor', 'Con alma', 'Fuera de línea', 'Punto y aparte', 'Otra mirada', 'Sin filtro', 'A todo color', 'Nueva página', 'En voz alta'];
export const products = [
  ...names.map((name, i) => ({ id: `c${i + 1}`, name, category: 'carousel', panel: i % 3, number: String(i + 1).padStart(2, '0'), description: 'Una base visual para desarrollar ideas, contar historias y darle continuidad a tu contenido de Instagram.' })),
  ...['Archivo creativo', 'Trabajo propio', 'Selección personal'].map((name, i) => ({ id: `p${i + 1}`, name, category: 'portfolio', panel: (i + 1) % 3, number: String(i + 1).padStart(2, '0'), description: 'Una presentación para ordenar tus proyectos, mostrar tu proceso y contar qué hace especial a tu trabajo.' })),
  { id: 'm1', name: 'Hola, soy yo', category: 'media', panel: 2, number: '01', description: 'Tu bio, audiencia, seguidores, visualizaciones, engagement y valor de colaboración, reunidos en una presentación para marcas.' },
];
export function cleanCart(value) {
  return Array.isArray(value) ? [...new Set(value.filter(id => products.some(p => p.id === id)))] : [];
}
export function getProduct(id) { return products.find(p => p.id === id); }
