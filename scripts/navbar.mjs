import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.NOVA_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [];
const errors = [];
await mkdir('artifacts/navbar', { recursive: true });
let page;
async function clickHeader(locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  assert.ok(box);
  // Click the visible sticky header without Playwright scrolling it under scroll-padding.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
async function clickSection(id) {
  const href = id === 'inicio' ? '/' : `/#${id}`;
  if (page.viewportSize().width < 1024) {
    await clickHeader(page.getByRole('button', { name: 'Abrir menú' }));
    await page.locator(`.menu-panel nav a[href="${href}"]`).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
  } else await clickHeader(page.locator(`.desktop-navigation a[href="${href}"]`));
  await expect(page.locator('.desktop-navigation [aria-current]')).toHaveAttribute('href', href);
  await expect
    .poll(
      async () => {
        if (id === 'inicio') return page.evaluate(() => Math.abs(scrollY));
        return page.evaluate((id) => {
          const section = document.getElementById(id);
          const header = document.querySelector('.navbar');
          return Math.abs(
            section.getBoundingClientRect().top -
              header.getBoundingClientRect().height -
              parseFloat(getComputedStyle(section).scrollMarginTop),
          );
        }, id);
      },
      { timeout: 5000 },
    )
    .toBeLessThan(2);
}
async function manualScroll(id) {
  // Real wheel input releases an in-progress anchor animation before manually moving the page.
  await page.mouse.wheel(0, 1);
  await page.evaluate((id) => {
    const section = document.getElementById(id);
    scrollTo({ top: section.getBoundingClientRect().top + scrollY + 160, behavior: 'instant' });
  }, id);
  await expect(page.locator('.desktop-navigation [aria-current]')).toHaveAttribute(
    'href',
    id === 'inicio' ? '/' : `/#${id}`,
  );
}
try {
  for (const motion of ['reduce', 'no-preference']) {
    const context = await browser.newContext({ reducedMotion: motion });
    page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    const widths = motion === 'reduce' ? [320, 375, 390, 430, 768, 1024, 1280, 1440] : [375, 1440];
    for (const width of widths) {
      console.log(`Navbar: ${width}px, ${motion}`);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base);
      for (const id of [
        'nosotros',
        'especialidades',
        'profesionales',
        'novedades',
        'contacto',
        'inicio',
      ])
        await clickSection(id);
      await clickSection('contacto');
      const historyLength = await page.evaluate(() => history.length);
      await manualScroll('especialidades');
      await clickSection('contacto');
      assert.equal(
        await page.evaluate(() => history.length),
        historyLength,
        'Repeated anchors must not create duplicate history entries',
      );
      await clickSection('inicio');
      await manualScroll('profesionales');
      await clickSection('inicio');
      await manualScroll('novedades');
      await clickHeader(page.locator('.navbar .brand'));
      await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
      await expect(page.locator('.desktop-navigation [aria-current]')).toHaveAttribute('href', '/');
      results.push(`Links, ancla repetida, Inicio y logo: ${width}px · ${motion}`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const route of [
      '/turnos',
      '/nosotros',
      '/especialidades',
      '/profesionales/sofia-martinez',
    ]) {
      await page.goto(base + route);
      await clickSection('especialidades');
      await manualScroll('nosotros');
      await clickSection('inicio');
    }
    await clickSection('nosotros');
    const aboutPosition = await page.evaluate(() => scrollY);
    await clickSection('profesionales');
    const professionalsPosition = await page.evaluate(() => scrollY);
    await page.goBack();
    await expect(page).toHaveURL(base + '/#nosotros');
    await expect
      .poll(() => page.evaluate((top) => Math.abs(scrollY - top), aboutPosition))
      .toBeLessThan(2);
    await expect(page.locator('.desktop-navigation [aria-current]')).toHaveAttribute(
      'href',
      '/#nosotros',
    );
    await page.goForward();
    await expect(page).toHaveURL(base + '/#profesionales');
    await expect
      .poll(() => page.evaluate((top) => Math.abs(scrollY - top), professionalsPosition))
      .toBeLessThan(2);
    await expect(page.locator('.desktop-navigation [aria-current]')).toHaveAttribute(
      'href',
      '/#profesionales',
    );
    for (const id of ['novedades', 'profesionales', 'nosotros', 'especialidades', 'inicio'])
      await manualScroll(id);
    await page.evaluate(() =>
      scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
    );
    await expect(page.locator('.desktop-navigation [aria-current]')).toHaveAttribute(
      'href',
      '/#contacto',
    );
    results.push(
      `Retorno desde páginas interiores, historial y scroll en ambos sentidos · ${motion}`,
    );
    await page.setViewportSize({ width: 375, height: 844 });
    await page.goto(base + '/turnos');
    await clickSection('profesionales');
    await expect(page.locator('#profesionales h2')).toBeFocused();
    await clickHeader(page.getByRole('button', { name: 'Abrir menú' }));
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused();
    await clickHeader(page.getByRole('button', { name: 'Abrir menú' }));
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await expect(page.locator('.desktop-navigation [aria-current]')).toBeFocused();
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflow), 'visible');
    results.push(
      `Menú móvil: cierre antes del scroll, foco, Escape y cambio a desktop · ${motion}`,
    );
    await context.close();
  }
  assert.equal(errors.length, 0);
  await writeFile('artifacts/navbar/audit.json', JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
