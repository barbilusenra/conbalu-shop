import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRates, samplePrices, formatPrice } from '../src/pricing.js';
import { translateMarkup } from '../src/i18n.js';
import { briefToText } from '../src/integrations.js';
test('sample prices remain in the user-authorised range', () => {
  assert.ok(Object.values(samplePrices).every(price => price >= 20 && price <= 50));
});
test('conversion uses validated USD rates and labels the actual currency', () => {
  const rates = parseRates([{base:'USD',quote:'EUR',rate:.9,date:'2026-10-09'},{base:'USD',quote:'ARS',rate:1500,date:'2026-10-09'}]);
  assert.equal(rates.USD.rate, 1);
  assert.match(formatPrice(25,'EUR',rates.EUR.rate,'en'), /EUR.*22\.50/);
  assert.match(formatPrice(25,'ARS',rates.ARS.rate,'en'), /ARS.*37,500\.00/);
  for(const invalid of [null,{},[],[{base:'EUR',quote:'ARS',rate:1500,date:'2026-10-09'}],[{base:'USD',quote:'EUR',rate:-2,date:'2026-10-09'}]]) assert.throws(() => parseRates(invalid));
});
test('localisation preserves markup and translates accessible names', () => {
  assert.equal(translateMarkup('<button data-product="c1" aria-label="Ver Ruido bonito">Ruido bonito</button>','en'), '<button data-product="c1" aria-label="View Beautiful noise">Beautiful noise</button>');
  assert.match(briefToText({name:'Ada',goal:'Launch'},'en'), /Name: Ada/);
  assert.match(briefToText({},'en'), /Not sent/);
});
