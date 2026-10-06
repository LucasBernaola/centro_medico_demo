import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.NOVA_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [];
const errors = [];
await mkdir('artifacts/polish/after', { recursive: true });
const reduced = await browser.newContext({ reducedMotion: 'reduce' });
const page = await reduced.newPage();
page.on('pageerror', (error) => errors.push(error.message));
async function settleImages() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 450) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
}
try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(base);
    await settleImages();
    assert.equal(await page.locator('.specialty-card').count(), 6);
    assert.equal(await page.locator('#profesionales .professional-card').count(), 6);
    assert.equal(await page.locator('#novedades .news-card').count(), 3);
    const newsImageHeights = await page
      .locator('.news-grid .news-image')
      .evaluateAll((images) => images.map((image) => image.clientHeight));
    assert.ok(
      newsImageHeights.every((height) => height > 100),
      `News images: ${newsImageHeights}`,
    );
    assert.equal(await page.locator('[aria-roledescription="carrusel"]').count(), 1);
    assert.equal(await page.locator('.carousel-track').count(), 0);
    const geometry = await page.evaluate(() => {
      const container = document.querySelector('.hero-grid').getBoundingClientRect();
      const cards = [
        ...document.querySelectorAll(
          '.specialty-card, #profesionales .professional-card, #novedades .news-card',
        ),
      ];
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        outside: cards.filter((card) => {
          const box = card.getBoundingClientRect();
          return box.left < container.left - 1 || box.right > container.right + 1;
        }).length,
        columns: getComputedStyle(
          document.querySelector('.specialties-grid'),
        ).gridTemplateColumns.split(' ').length,
        portraitHeights: [...document.querySelectorAll('#profesionales .professional-photo')].map(
          (photo) => photo.clientHeight,
        ),
      };
    });
    assert.equal(geometry.overflow, false);
    assert.equal(geometry.outside, 0);
    assert.equal(geometry.columns, width >= 1024 ? 3 : width >= 600 ? 2 : 1);
    assert.ok(geometry.portraitHeights.every((height) => height > 200));
    const band = page.locator('.announcement-band');
    await band.scrollIntoViewIfNeeded();
    if (width >= 1024) assert.ok((await band.boundingBox()).height <= 100);
    await expect(band.getByRole('button')).toHaveCount(0);
    await expect(band.locator('.announcement-count')).toHaveText('01 / 04');
    results.push(
      `Grilla, 6 especialidades, 6 profesionales, 3 novedades fijas y banda compacta: ${width}px`,
    );
    if ([320, 375, 390, 768, 1440].includes(width)) {
      await page.evaluate(() => {
        document.activeElement?.blur();
        window.scrollTo(0, 0);
      });
      await page.screenshot({ path: `artifacts/polish/after/home-${width}.png`, fullPage: true });
      await page.screenshot({ path: `artifacts/polish/after/hero-${width}.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(base);
  const nav = page.getByRole('navigation', { name: 'Navegación principal' });
  await expect(nav.locator('[aria-current]')).toHaveText('Inicio');
  for (const id of ['especialidades', 'nosotros', 'profesionales', 'novedades', 'contacto']) {
    await page.evaluate((id) => {
      const section = document.getElementById(id);
      const header = document.querySelector('.navbar');
      scrollTo({
        top:
          section.getBoundingClientRect().top +
          scrollY -
          header.getBoundingClientRect().height -
          parseFloat(getComputedStyle(section).scrollMarginTop),
        behavior: 'instant',
      });
    }, id);
    await expect(nav.locator('[aria-current]')).toHaveAttribute('href', `/#${id}`);
    await expect(nav.locator('[aria-current]')).toHaveCSS('background-color', 'rgb(15, 76, 69)');
  }
  await nav.getByRole('link', { name: 'Profesionales', exact: true }).click();
  await expect(nav.locator('[aria-current]')).toHaveText('Profesionales');
  await expect
    .poll(() =>
      page
        .locator('#profesionales')
        .evaluate((element) => Math.round(element.getBoundingClientRect().top)),
    )
    .toBeGreaterThanOrEqual(90);
  await nav.getByRole('link', { name: 'Inicio', exact: true }).click();
  await expect(nav.locator('[aria-current]')).toHaveText('Inicio');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(20);
  results.push('Scroll spy, estado invertido, offset del header y regreso a Inicio');
  await page.goto(base + '/profesionales/sofia-martinez');
  await expect(nav.locator('[aria-current]')).toHaveText('Profesionales');
  await page.goto(base);
  await page.locator('.faq-trigger').first().click();
  await page.locator('.faq-trigger').nth(1).click();
  await expect(page.locator('.faq-trigger').first()).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.faq-trigger').nth(2)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.faq-trigger').nth(2)).toHaveAttribute('aria-expanded', 'true');
  results.push('FAQ con un único panel, foco y teclado');
  const preview = page.locator('.preview-times button').first();
  await preview.click();
  await expect(preview).toHaveAttribute('aria-pressed', 'true');
  assert.equal(new URL(page.url()).pathname, '/');
  const reducedBand = page.locator('.announcement-band');
  await reducedBand.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForTimeout(5300);
  await expect(reducedBand).toHaveAttribute('data-announcement-index', '1');
  await expect(reducedBand.locator('.announcement-slide')).toHaveCSS('transform', 'none');
  results.push('Movimiento reducido: avance automático cada 5 segundos sin animaciones');

  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const touchPage = await touch.newPage();
  await touchPage.goto(base);
  const viewport = touchPage.locator('.announcement-viewport');
  await viewport.scrollIntoViewIfNeeded();
  const rect = await viewport.boundingBox();
  const cdp = await touch.newCDPSession(touchPage);
  const y = rect.y + 35;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 325, y }] });
  for (let x = 300; x >= 80; x -= 20)
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(touchPage.locator('.announcement-band')).toHaveAttribute(
    'data-announcement-index',
    '0',
  );
  assert.equal(new URL(touchPage.url()).pathname, '/');
  const startY = await touchPage.evaluate(() => scrollY);
  const newRect = await viewport.boundingBox();
  const fingerY = newRect.y + 55;
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 200, y: fingerY }],
  });
  for (let dy = 10; dy <= 100; dy += 10)
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 200, y: fingerY - dy }],
    });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => touchPage.evaluate(() => scrollY)).toBeGreaterThan(startY + 20);
  results.push('Swipe sin navegación manual y scroll vertical sin bloquear');
  await touch.close();

  const normal = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    reducedMotion: 'no-preference',
  });
  const motionPage = await normal.newPage();
  motionPage.on('pageerror', (error) => errors.push(error.message));
  await motionPage.goto(base);
  await expect(motionPage.locator('.hero-visual')).toHaveCSS('opacity', '1');
  const reveal = motionPage.locator('.about-copy');
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveCSS('opacity', '1');
  await motionPage.evaluate(() => scrollTo(0, 0));
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveAttribute('data-revealed', 'true');
  await expect(reveal).toHaveCSS('transform', 'none');
  const normalBand = motionPage.locator('.announcement-band');
  await normalBand.scrollIntoViewIfNeeded();
  await motionPage.mouse.move(0, 0);
  const firstIndex = await normalBand.getAttribute('data-announcement-index');
  await expect
    .poll(() => normalBand.getAttribute('data-announcement-index'), { timeout: 7500 })
    .not.toBe(firstIndex);
  await normalBand.hover();
  const hoveredIndex = await normalBand.getAttribute('data-announcement-index');
  await expect
    .poll(() => normalBand.getAttribute('data-announcement-index'), { timeout: 7500 })
    .not.toBe(hoveredIndex);
  await normalBand.getByRole('link').focus();
  const focusedIndex = await normalBand.getAttribute('data-announcement-index');
  await motionPage.waitForTimeout(5300);
  await expect(normalBand).toHaveAttribute('data-announcement-index', focusedIndex);
  await motionPage.mouse.move(0, 0);
  await motionPage.evaluate(() => document.activeElement?.blur());
  await expect
    .poll(() => normalBand.getAttribute('data-announcement-index'), { timeout: 7500 })
    .not.toBe(focusedIndex);
  results.push(
    'Reveals únicos, autoplay cada 5 segundos sin controles y foco estable en el enlace',
  );
  await normal.close();
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of [
      '/turnos',
      '/profesionales/sofia-martinez',
      '/especialidades/cardiologia',
      '/novedades/un-espacio-para-escucharte',
    ]) {
      await page.goto(base + route);
      await settleImages();
      await page.screenshot({
        path: `artifacts/polish/after/${route.replaceAll('/', '-')}-${width}.png`,
        fullPage: true,
      });
    }
  }
  assert.equal(errors.length, 0);
  await writeFile(
    'artifacts/polish/after/interactions.json',
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
