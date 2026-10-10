import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBase, rewriteHtmlRoutes } from '../scripts/pages-paths.mjs';

test('deployment base supports root and repository Pages URLs', () => {
  assert.equal(normalizeBase(), '/');
  assert.equal(normalizeBase(''), '/');
  assert.equal(normalizeBase('/conbalu-shop/'), '/conbalu-shop/');
  assert.equal(normalizeBase('conbalu-shop'), '/conbalu-shop/');
});

test('repo paths rewrite local routes, keep external links, and avoid double prefixes', () => {
  const html = '<a href="/">Inicio</a><a href="/shop/?categoria=media">Shop</a><a href="#faq">FAQ</a><a href="https://canva.com/">Canva</a><img src="/conbalu-shop/assets/photo.webp"><a href="//example.com/">Externo</a>';
  const output = rewriteHtmlRoutes(html, '/conbalu-shop/');
  assert.ok(output.includes('href="/conbalu-shop/"'));
  assert.ok(output.includes('href="/conbalu-shop/shop/?categoria=media"'));
  assert.ok(output.includes('href="#faq"'));
  assert.ok(output.includes('href="https://canva.com/"'));
  assert.ok(output.includes('href="//example.com/"'));
  assert.ok(output.includes('src="/conbalu-shop/assets/photo.webp"'));
  assert.equal(rewriteHtmlRoutes(output, '/conbalu-shop/'), output);
  assert.equal(rewriteHtmlRoutes(html, '/'), html);
});
