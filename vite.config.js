import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { normalizeBase, rewriteHtmlRoutes } from './scripts/pages-paths.mjs';
const base = normalizeBase(process.env.BASE_PATH || '/');
export default defineConfig({
  base,
  plugins: [{
    name: 'github-pages-route-prefix',
    transformIndexHtml: { order: 'post', handler: html => rewriteHtmlRoutes(html, base) },
  }],
  build: { rollupOptions: { input: {
    home: resolve('index.html'), shop: resolve('shop/index.html'),
    how: resolve('como-funciona/index.html'), checkout: resolve('checkout/index.html'),
    success: resolve('checkout/exito/index.html'), cancel: resolve('checkout/cancelado/index.html'),
    enHome: resolve('en/index.html'), enShop: resolve('en/shop/index.html'), enHow: resolve('en/como-funciona/index.html'),
    enCheckout: resolve('en/checkout/index.html'), enSuccess: resolve('en/checkout/exito/index.html'), enCancel: resolve('en/checkout/cancelado/index.html'),
  }}},
});
