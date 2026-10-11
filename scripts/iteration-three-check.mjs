import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, mkdir } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
await mkdir('test-results/iteration-three',{recursive:true});
const report = { errors: [], flows: [], accessibility: [] };
try {
  for (const width of [1440,390]) {
    const context = await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768});
    const page = await context.newPage(); page.setDefaultTimeout(12000);
    page.on('pageerror', e => report.errors.push(e.stack));
    await page.goto(base+'/'); await page.waitForTimeout(1400);
    if(width===1440) {
      const glyph=page.locator('.variable-char').nth(1);const initial=await page.locator('[data-variable]').evaluate(el=>el.getBoundingClientRect().width);
      await glyph.hover();await expect.poll(()=>glyph.evaluate(el=>Number(getComputedStyle(el).fontWeight))).toBeGreaterThan(840);
      expect(await page.locator('[data-variable]').evaluate(el=>el.getBoundingClientRect().width)).toBeCloseTo(initial,0);
      await expect(page.locator('.custom-cursor')).toBeVisible();
      const font=await page.locator('.category-name h3').first().evaluate(el=>getComputedStyle(el).fontSize);
      await page.locator('.category-grid').scrollIntoViewIfNeeded();await page.waitForTimeout(800);
      expect(await page.locator('.category-name h3').first().evaluate(el=>getComputedStyle(el).fontSize)).toBe(font);
      expect(await page.locator('.category-item').first().evaluate(el=>getComputedStyle(el).transform)).toBe('none');
    }
    await page.locator('.directional-marquee').scrollIntoViewIfNeeded();
    await page.locator('.marquee-pause').click();await expect(page.locator('.marquee-pause')).toHaveAttribute('aria-pressed','true');
    await page.waitForTimeout(650);const position=await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(400);expect(await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform)).toBe(position);
    await page.locator('.marquee-pause').click();
    await page.locator('.paint-mask').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
    if(width===1440) {
      const r=await page.locator('.paint-mask').boundingBox();
      for(let i=0;i<8;i++){await page.mouse.move(r.x+30,r.y+70);await page.mouse.move(r.x+r.width-40,r.y+70,{steps:10});}
      expect(await page.locator('.paint-mask').evaluate(el=>{const ctx=el.getContext('2d');return ctx.getImageData(Math.floor(el.width*.8),Math.floor(el.height*.8),1,1).data[3]})).toBe(255);
      await expect(page.locator('.paint-mask')).toBeVisible();
    }
    await page.locator('.paint-reveal-button').click();await expect(page.locator('.paint-reveal-button')).toContainText('(1/16)');
    await page.screenshot({path:`test-results/iteration-three/paint-${width}.png`});
    if(width===1440){const start=await page.locator('.home-story').evaluate(el=>el.getBoundingClientRect().top+scrollY);await page.evaluate(y=>scrollTo(0,y+900),start);await page.waitForTimeout(1000);expect(await page.locator('.story-track').evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)).toBeLessThan(-300);await page.screenshot({path:'test-results/iteration-three/story-progress.png'});}
    await page.locator('.stats').scrollIntoViewIfNeeded();await expect(page.locator('[data-counter]').first()).toHaveText('10');
    await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.waitForTimeout(1300);
    const fit=await page.locator('.footer-logotype').evaluate(el=>({width:el.getBoundingClientRect().width,available:el.parentElement.clientWidth}));expect(Math.abs(fit.width-fit.available)).toBeLessThan(3);
    await page.screenshot({path:`test-results/iteration-three/footer-${width}.png`});
    await page.locator('.footer-top [data-custom]').click();await expect(page.locator('#brief-dialog')).toBeVisible();await page.waitForTimeout(550);
    await page.locator('[name=name]').fill('Test name');await page.mouse.click(3,120);await expect(page.locator('.exit-nudge')).toBeVisible();
    await page.screenshot({path:`test-results/iteration-three/contact-nudge-${width}.png`});
    await page.locator('[data-stay]').click();await expect(page.locator('[name=name]')).toHaveValue('Test name');await expect(page.locator('#brief-dialog')).toBeVisible();
    await page.keyboard.press('Escape');await expect(page.locator('#brief-dialog')).toBeHidden();
    await page.evaluate(()=>scrollTo(0,0));await page.locator('.menu-toggle').click();await page.locator('[data-nav=shop]').click();await expect(page.locator('main')).toHaveAttribute('data-barba-namespace','shop');await page.waitForTimeout(700);
    await expect(page.locator('.product-card')).toHaveCount(14);
    await page.locator('[data-filter=portfolio]').click();await expect(page.locator('.product-card:visible')).toHaveCount(3);await page.waitForTimeout(650);
    await page.locator('#search').fill('nothing matches');await expect(page.locator('.empty-search')).toBeVisible();await page.locator('[data-reset-filters]').click();await page.waitForTimeout(650);await expect(page.locator('.product-card:visible')).toHaveCount(14);
    await page.route('https://api.frankfurter.dev/**',route=>route.fulfill({json:[{date:'2026-10-09',base:'USD',quote:'EUR',rate:.9},{date:'2026-10-09',base:'USD',quote:'ARS',rate:1500}]}));
    await page.locator('.shop-locale [data-currency]').selectOption('EUR');await expect(page.locator('.product-price').first()).toContainText('22,50');await expect(page.locator('.shop-locale [data-rate-status]')).toContainText('Frankfurter');
    await page.locator('.shop-locale [data-currency]').selectOption('ARS');await expect(page.locator('.product-price').first()).toContainText('37.500');
    await page.locator('[data-product=c1]').first().click();await page.locator('[data-add=c1]').click();await page.keyboard.press('Escape');await expect(page.locator('#product-dialog')).toBeHidden();
    await page.locator('[data-cart]').click();await expect(page.locator('.bag-total [data-price-usd]')).toContainText('37.500');await page.keyboard.press('Escape');await expect(page.locator('#cart-dialog')).toBeHidden();
    await page.locator('[data-language=en]').click();await expect(page).toHaveURL(new RegExp('/en/shop/'));await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.locator('[data-cart-count]')).toHaveText('1');await expect(page.locator('.product-name').first()).toContainText('Beautiful noise');await expect(page.locator('.product-price').first()).toContainText('37,500');
    await page.locator('.menu-toggle').click();await page.locator('[data-nav=how]').click();await expect(page.locator('main')).toHaveAttribute('data-barba-namespace','how');await page.waitForTimeout(700);await expect(page.locator('h1')).toContainText('How it');
    await page.locator('#preguntas').scrollIntoViewIfNeeded();await page.locator('summary').first().click();await expect(page.locator('details').first()).toHaveAttribute('open','');
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.accessibility.push({width,violations:axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});
    await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.pin-spacer')).toHaveCount(0);await expect(page.locator('.assemble-char')).toHaveCount(0);await expect(page.locator('.custom-cursor')).toBeHidden();
    await page.goto(base+'/en/');await expect(page.locator('.paint-mask')).toBeHidden();await expect(page.locator('.pin-spacer')).toHaveCount(0);await expect(page.locator('h1')).toContainText('Make it');
    report.flows.push(`${width}: weight/media scale, marquee pause, manual reveal, story, counters, logo sizing, contact nudge/preservation, filters, exchange/total/persistence, language routes, FAQ and reduced motion`);
    await context.close();
  }
  const offline=await browser.newContext();const p=await offline.newPage();p.setDefaultTimeout(12000);await p.route('https://api.frankfurter.dev/**',r=>r.abort());await p.goto(base+'/en/shop/');await p.locator('.shop-locale [data-currency]').selectOption('EUR');await expect(p.locator('.shop-locale [data-rate-status]')).toContainText('unavailable');await expect(p.locator('.product-price').first()).toContainText('USD');await offline.close();report.flows.push('Exchange failure retains correctly labelled USD prices');
} finally { await writeFile('test-results/iteration-three/flow-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close(); }
if(report.errors.length||report.accessibility.some(a=>a.violations.length)) process.exitCode=1;
