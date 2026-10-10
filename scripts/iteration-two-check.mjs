import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://127.0.0.1:5173';
await mkdir('test-results/iteration-two', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { errors: [], layouts: [], flows: [], accessibility: [] };
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 }, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', e => report.errors.push(e.stack));
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push(`${response.status()} ${response.url()}`); });
    for (const route of ['/', '/shop/', '/como-funciona/']) {
      await page.goto(base + route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.load-mark')).toBeHidden();
      await page.waitForTimeout(1200);
      const name = route === '/' ? 'home' : route.replaceAll('/', '');
      await page.screenshot({ path: `test-results/iteration-two/${name}-${width}.png` });
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, font: getComputedStyle(document.body).fontFamily, loaded: document.fonts.check('500 24px Saans'), brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src), pins: document.querySelectorAll('.pin-spacer').length }));
      report.layouts.push({ route, ...layout });
      expect(layout.scrollWidth).toBeLessThanOrEqual(width + 1);
      expect(layout.loaded).toBe(true);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      report.accessibility.push({ route, width, violations: axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, message: n.failureSummary })) })) });
    }
    await page.goto(base + '/');
    await expect(page.locator('.load-mark')).toBeHidden();
    await page.waitForTimeout(1300);
    if (width === 1440) {
      const glyph = page.locator('.variable-char').nth(1);
      await expect(glyph).toBeVisible();
      const originalWidth = await page.locator('[data-variable]').evaluate(el => el.getBoundingClientRect().width);
      await glyph.hover();
      await expect.poll(() => glyph.evaluate(el => Number(getComputedStyle(el).fontWeight))).toBeGreaterThan(650);
      expect(await page.locator('[data-variable]').evaluate(el => el.getBoundingClientRect().width)).toBeCloseTo(originalWidth, 0);
      await page.mouse.move(800, 610);
      await page.mouse.move(1100, 650, { steps: 6 });
      await expect.poll(() => page.locator('.trail-token').evaluateAll(els => els.some(el => Number(getComputedStyle(el).opacity) > .1))).toBe(true);
      const button = page.locator('.hero .button');
      const rect = await button.boundingBox();
      await page.mouse.move(rect.x + rect.width - 20, rect.y + 20);
      await expect.poll(() => button.evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
      report.flows.push('Desktop: variable font changes weight without reflow, cursor trail, magnetic CTA');
    }
    await page.locator('.menu-toggle').click();
    await expect(page.locator('#menu-dialog')).toBeVisible();
    await page.waitForTimeout(850);
    await page.screenshot({ path: `test-results/iteration-two/menu-${width}.png` });
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('#menu-dialog'))).toBe(true);
    await page.locator('[data-menu-close]').click();
    await expect(page.locator('#menu-dialog')).toBeHidden();
    await expect(page.locator('.menu-toggle')).toBeFocused();
    await page.locator('.menu-toggle').click();
    await page.locator('[data-nav="shop"]').click();
    await expect(page.locator('main')).toHaveAttribute('data-barba-namespace', 'shop');
    await expect(page.locator('main')).toBeFocused();
    await expect(page.locator('#menu-dialog')).toBeHidden();
    await page.locator('[data-filter="portfolio"]').click();
    await expect(page.locator('.product-card:visible')).toHaveCount(3);
    await page.locator('#search').fill('no existe');
    await expect(page.locator('.empty-search')).toBeVisible();
    await page.locator('[data-reset-filters]').click();
    await expect(page.locator('.product-card:visible')).toHaveCount(14);
    const visual = page.locator('[data-product="c1"]').first();
    await visual.scrollIntoViewIfNeeded();
    if (width === 1440) {
      await page.waitForTimeout(850);
      const box = await visual.boundingBox();
      await page.mouse.move(box.x + box.width * .9, box.y + box.height * .3);
      await expect.poll(() => visual.locator('.sheet-0').evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
      await page.screenshot({ path: 'test-results/iteration-two/gallery-hover.png' });
    }
    await visual.click();
    await expect(page.locator('#product-dialog')).toBeVisible();
    await page.locator('[data-add="c1"]').click();
    await expect(page.locator('[data-cart-count]')).toHaveText('1');
    await expect(page.locator('.particle-burst')).toBeAttached();
    await page.keyboard.press('Escape');
    await expect(page.locator('#product-dialog')).toBeHidden();
    await expect(visual).toBeFocused();
    await page.locator('[data-cart]').click();
    await expect(page.locator('#cart-dialog .cart-item')).toHaveCount(1);
    await page.waitForTimeout(550);
    await page.screenshot({ path: `test-results/iteration-two/bag-${width}.png` });
    const bagAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    report.accessibility.push({ route: 'bag', width, violations: bagAxe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, message: n.failureSummary })) })) });
    await page.keyboard.press('Escape');
    await expect(page.locator('#cart-dialog')).toBeHidden();
    await page.reload();
    await expect(page.locator('[data-cart-count]')).toHaveText('1');
    await page.locator('[data-cart]').click();
    await page.locator('[data-remove="c1"]').click();
    await expect(page.locator('#cart-dialog .cart-empty')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#cart-dialog')).toBeHidden();
    report.flows.push(`${width}: menu entrance/exit, focus trap/return, Barba routing, filters/search, product hover/detail, particles, persistent bag and removal`);
    await page.locator('.menu-toggle').click();
    await page.locator('[data-nav="how"]').click();
    await expect(page.locator('main')).toHaveAttribute('data-barba-namespace', 'how');
    await page.waitForTimeout(1000);
    if (width === 1440) {
      const start = await page.locator('.how-journey').evaluate(el => el.getBoundingClientRect().top + window.scrollY);
      await page.evaluate(y => window.scrollTo(0, y), start + 1900);
      await page.waitForTimeout(1400);
      await expect.poll(() => page.locator('[data-journey-counter]').textContent()).toBe('02 / 03');
      const x = await page.locator('.journey-track').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
      expect(x).toBeLessThan(-500);
      await page.screenshot({ path: 'test-results/iteration-two/how-pinned.png' });
      report.flows.push('Desktop: pinned horizontal journey progresses and assembles text');
    }
    await page.locator('#preguntas').scrollIntoViewIfNeeded();
    await page.locator('summary').first().click();
    await expect(page.locator('details').first()).toHaveAttribute('open', '');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('.assemble-char')).toHaveCount(0);
    await page.goto(base + '/');
    await expect(page.locator('.load-mark')).toBeHidden();
    await expect(page.locator('.paint-mask')).toBeHidden();
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await page.screenshot({ path: `test-results/iteration-two/home-full-${width}.png`, fullPage: true });
    report.flows.push(`${width}: FAQ, reduced-motion cleanup and static final states`);
    await context.close();
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await nojs.newPage();
  await staticPage.goto(base + '/');
  await expect(staticPage.locator('h1')).toBeVisible();
  await expect(staticPage.locator('.hero .button')).toBeVisible();
  await expect(staticPage.locator('.load-mark')).toBeHidden();
  await staticPage.goto(base + '/como-funciona/');
  await expect(staticPage.locator('.journey-panel')).toHaveCount(3);
  await staticPage.locator('summary').first().click();
  await expect(staticPage.locator('details').first()).toHaveAttribute('open', '');
  await nojs.close();
  report.flows.push('No JavaScript: readable hero, reachable CTA, all process steps and native FAQ');
} finally {
  await writeFile('test-results/iteration-two/report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
if (report.errors.length || report.accessibility.some(entry => entry.violations.length)) process.exitCode = 1;
