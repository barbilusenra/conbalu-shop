export const samplePrices = { carousel: 25, portfolio: 40, media: 50 };
export const currencies = ['USD', 'EUR', 'ARS'];
export function formatPrice(usd, currency = 'USD', rate = 1, locale = 'es') {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-AR', { style: 'currency', currency, currencyDisplay: 'code', minimumFractionDigits: 2 }).format(usd * rate);
}
export function parseRates(rows) {
  if (!Array.isArray(rows)) throw new Error('Invalid rate response');
  const rates = { USD: { rate: 1 } };
  for (const row of rows) {
    if (row.base === 'USD' && ['EUR', 'ARS'].includes(row.quote) && typeof row.rate === 'number' && Number.isFinite(row.rate) && row.rate > 0 && /^\d{4}-\d{2}-\d{2}$/.test(row.date)) rates[row.quote] = { rate: row.rate, date: row.date };
  }
  if (!rates.EUR || !rates.ARS) throw new Error('Missing conversion rate');
  return rates;
}
export function createPricing(locale) {
  let currency = 'USD', rates = { USD: { rate: 1 } }, pending, status = 'idle';
  const key = 'conbalu:exchange:v2', preference = 'conbalu:currency';
  try { const saved = localStorage.getItem(preference); if (currencies.includes(saved)) currency = saved; } catch {}
  const render = () => {
    document.querySelectorAll('[data-currency]').forEach(el => el.value = currency);
    const available = rates[currency];
    document.querySelectorAll('[data-price-usd]').forEach(el => {
      el.textContent = formatPrice(Number(el.dataset.priceUsd), available ? currency : 'USD', available?.rate || 1, locale);
    });
    const en = locale === 'en';
    const message = currency === 'USD' ? (en ? 'Sample prices in USD.' : 'Precios de muestra en USD.')
      : available ? `${en ? 'Indicative conversion' : 'Conversión orientativa'} · Frankfurter · ${available.date}`
      : status === 'error' ? (en ? 'Conversion unavailable. Showing USD prices.' : 'No pudimos obtener la cotización. Mostramos precios en USD.')
      : (en ? 'Fetching exchange rates. Showing USD for now.' : 'Consultando cotizaciones. Por ahora mostramos USD.');
    document.querySelectorAll('[data-rate-status]').forEach(el => el.textContent = message);
  };
  const load = async () => {
    if (currency === 'USD' || rates[currency]) return render();
    if (pending) return pending;
    pending = (async () => {
      status = 'loading'; render();
      const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 7000);
      try {
        let cached;
        try { cached = JSON.parse(localStorage.getItem(key)); } catch {}
        if (cached && Date.now() - cached.savedAt >= 0 && Date.now() - cached.savedAt < 6 * 60 * 60 * 1000) {
          rates = parseRates(cached.rows);
        } else {
          const response = await fetch('https://api.frankfurter.dev/v2/rates?base=USD&quotes=EUR,ARS', { signal: controller.signal, credentials: 'omit' });
          if (!response.ok) throw new Error('Exchange API unavailable');
          const rows = await response.json(); rates = parseRates(rows);
          try { localStorage.setItem(key, JSON.stringify({ rows, savedAt: Date.now() })); } catch {}
        }
        status = 'ready';
      } catch { status = 'error'; }
      finally { clearTimeout(timer); pending = undefined; render(); }
    })();
    return pending;
  };
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-currency]') || !currencies.includes(event.target.value)) return;
    currency = event.target.value;
    try { localStorage.setItem(preference, currency); } catch {}
    render(); load();
  });
  return { refresh() { render(); load(); } };
}
