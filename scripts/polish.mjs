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
    await Promise.all(
      [...document.images]
        .filter((image) => image.complete)
        .map((image) => image.decode().catch(() => {})),
    );
    window.scrollTo(0, 0);
  });
}

try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(base);
    await settleImages();
    const overflow = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert.ok(overflow.scroll <= overflow.width, JSON.stringify(overflow));
    const portraits = await page
      .locator('.professionals-carousel .professional-photo')
      .evaluateAll((photos) =>
        photos.map((photo) => ({ width: photo.clientWidth, height: photo.clientHeight })),
      );
    assert.equal(portraits.length, 6);
    assert.ok(portraits.every((photo) => photo.height > 200 && photo.width > 200));
    for (const id of ['professionals', 'news']) {
      const track = page.locator(`#${id}-track`);
      const carousel = page.locator(`.${id}-carousel`);
      await track.scrollIntoViewIfNeeded();
      await expect(carousel.locator('.carousel-controls button').first()).toBeDisabled();
      await carousel.locator('.carousel-controls button').last().click();
      await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100);
      await track.focus();
      await page.keyboard.press('End');
      await expect(carousel.locator('.carousel-controls button').last()).toBeDisabled();
      await expect(carousel.locator('.carousel-counter strong')).toHaveText(
        id === 'news' ? '03' : '06',
      );
      await page.keyboard.press('Home');
      await expect(carousel.locator('.carousel-controls button').first()).toBeDisabled();
    }
    results.push(`Responsive y carruseles con flechas, Home/End y límites: ${width}px`);
    if ([320, 375, 390, 768, 1440].includes(width)) {
      await page.evaluate(() => document.activeElement?.blur());
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `artifacts/polish/after/home-${width}.png`, fullPage: true });
      await page.screenshot({ path: `artifacts/polish/after/hero-${width}.png` });
    }
  }

  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(base);
  const nav = page.getByRole('navigation', { name: 'Navegación principal' });
  await expect(nav.locator('[aria-current]')).toHaveText('Inicio');
  for (const id of ['especialidades', 'nosotros', 'profesionales', 'novedades', 'contacto']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
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
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(20);
  const geometry = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
    const professionals = rect('#professionals-track');
    const news = rect('#news-track');
    const fourthProfessional = rect('#professionals-track > :nth-child(4)');
    const thirdNews = rect('#news-track > :nth-child(3)');
    return {
      rightBleed: Math.round(professionals.right) === innerWidth,
      leftBleed: Math.round(news.left) === 0,
      professionalPeek:
        fourthProfessional.left < innerWidth && fourthProfessional.right > innerWidth,
      newsPeek: thirdNews.left < news.right && thirdNews.right > news.right,
    };
  });
  assert.ok(Object.values(geometry).every(Boolean), JSON.stringify(geometry));
  results.push(
    'Scroll spy, enlace activo invertido, offset del navbar y carruseles hacia los bordes con siguiente tarjeta visible',
  );
  await page.goto(base + '/profesionales/sofia-martinez');
  await expect(nav.locator('[aria-current]')).toHaveText('Profesionales');
  await page.goto(base + '/especialidades/cardiologia');
  await expect(nav.locator('[aria-current]')).toHaveText('Especialidades');
  await page.goto(base);
  const track = page.locator('#professionals-track');
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  await page.mouse.move(box.x + 300, box.y + 150);
  await page.mouse.down();
  await page.mouse.move(box.x + 40, box.y + 150, { steps: 15 });
  await page.mouse.up();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(150);
  assert.equal(new URL(page.url()).pathname, '/', 'Drag must not open a professional profile');
  results.push('Arrastre con mouse sin activar los enlaces');

  await page.locator('.faq-trigger').first().click();
  await expect(page.locator('.faq-trigger').first()).toHaveAttribute('aria-expanded', 'true');
  await page.locator('.faq-trigger').nth(1).click();
  await expect(page.locator('.faq-trigger').first()).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.faq-trigger').nth(1)).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.faq-trigger').nth(2)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.faq-trigger').nth(2)).toHaveAttribute('aria-expanded', 'true');
  results.push('FAQ: un único panel, foco y teclado');

  const preview = page.locator('.preview-times button').first();
  await preview.click();
  await expect(preview).toHaveAttribute('aria-pressed', 'true');
  assert.equal(new URL(page.url()).pathname, '/');
  results.push('Ejemplo de horarios: interacción visual sin navegación ni reserva');

  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(base);
  const cdp = await touchContext.newCDPSession(touchPage);
  for (const id of ['professionals', 'news']) {
    const touchTrack = touchPage.locator(`#${id}-track`);
    await touchTrack.scrollIntoViewIfNeeded();
    const rect = await touchTrack.boundingBox();
    const y = Math.max(100, rect.y + 110);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 325, y }],
    });
    for (let x = 300; x >= 80; x -= 20) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect
      .poll(() => touchTrack.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(100);
    assert.equal(new URL(touchPage.url()).pathname, '/');
  }
  results.push('Swipe táctil nativo en los dos carruseles');
  await touchContext.close();

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
  await expect(reveal).toHaveAttribute('data-revealed', 'true');
  await motionPage.evaluate(() => window.scrollTo(0, 0));
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveCSS('opacity', '1');
  await expect(reveal).toHaveCSS('transform', 'none');
  results.push('Entrada del hero y reveal único sin repetirse al volver');
  await normal.close();

  await page.goto(base);
  await settleImages();
  const hidden = await page
    .locator('[data-reveal], [data-motion-intro]')
    .evaluateAll(
      (elements) => elements.filter((element) => getComputedStyle(element).opacity !== '1').length,
    );
  assert.equal(hidden, 0, 'Reduced motion must keep all content visible');
  const transitions = await page
    .locator('.button, .faq-trigger')
    .evaluateAll(
      (elements) =>
        elements.filter((element) => getComputedStyle(element).transitionDuration !== '0s').length,
    );
  assert.equal(transitions, 0);
  results.push('Movimiento reducido: contenido visible y transiciones desactivadas');

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
