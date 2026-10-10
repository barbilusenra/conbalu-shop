// No secrets or payment decisions belong in browser code.
// Future server: create order from validated product IDs and server-owned prices;
// choose PayPal or custom checkout; redirect only to the provider-approved URL.
// A return URL is NOT payment proof. Verify a signed webhook, idempotently mark
// the order paid, then queue the Canva-link email. Retry delivery independently.
export const integrationStatus = Object.freeze({ checkout: 'pending', email: 'pending', brief: 'local-download' });
export async function createCheckout() {
  throw new Error('Las compras todavía no están habilitadas. No se realizó ningún cobro.');
}
export function briefToText(data) {
  const labels = { name: 'Nombre', email: 'Email', product: 'Producto', instagram: 'Instagram', logo: 'Logo', colors: 'Colores de marca', assets: 'Recursos disponibles', goal: 'Qué buscás', timeline: 'Plazo', budget: 'Presupuesto', notes: 'Dirección creativa' };
  return ['CONBALU · BRIEF CREATIVO', 'Documento preparado localmente. No enviado.', '', ...Object.entries(labels).map(([key, label]) => `${label}: ${data[key] || 'Sin especificar'}`)].join('\n\n');
}
