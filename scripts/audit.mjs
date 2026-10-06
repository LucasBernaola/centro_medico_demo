import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.NOVA_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
page.setDefaultTimeout(12000);
const overflow = [];
const runtimeErrors = [];
const imageFailures = [];
const flows = [];
page.on('pageerror', (e) => runtimeErrors.push(e.message));
const routes = [
  '/',
  '/nosotros',
  '/profesionales',
  '/especialidades',
  '/profesionales/sofia-martinez',
  '/especialidades/cardiologia',
  '/novedades/un-espacio-para-escucharte',
  '/turnos',
];
await mkdir('artifacts/public', { recursive: true });
async function screenshot(name) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 35));
    }
    // Visit offscreen slides before checking lazy images; they should stay deferred in normal use.
    for (const track of document.querySelectorAll('.carousel-track')) {
      track.scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 35));
      for (let x = 0; x < track.scrollWidth; x += track.clientWidth) {
        track.scrollLeft = x;
        await new Promise((r) => setTimeout(r, 35));
      }
      track.scrollLeft = 0;
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
  await page.screenshot({ path: `artifacts/public/${name}.png`, fullPage: true });
}
async function noOverflow(label) {
  const sizes = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: innerWidth,
  }));
  if (sizes.scroll > sizes.width) overflow.push({ label, ...sizes });
}
async function fillPatient() {
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Laura');
  await page.getByRole('textbox', { name: 'Apellido', exact: true }).fill('Demo');
  await page.getByRole('textbox', { name: 'DNI', exact: true }).fill('40999888');
  await page.getByRole('textbox', { name: 'Teléfono', exact: true }).fill('11 4000-0000');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('laura@example.com');
}
async function next() {
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
}
async function chooseCard(text) {
  await page.locator('label').filter({ hasText: text }).click();
}
async function reachTimes() {
  await fillPatient();
  await next();
  await chooseCard('Cardiología');
  await next();
  await chooseCard('Dra. Sofía Martínez');
  await next();
}
try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.locator('h1').waitFor();
      await noOverflow(`${route}@${width}`);
    }
    await page.goto(base);
    await screenshot(`inicio-${width}`);
  }
  for (const route of [
    '/profesionales/nicolas-ferrer',
    '/profesionales/paula-rios',
    '/profesionales/julieta-fernandez',
    '/profesionales/mateo-alvarez',
    '/profesionales/elena-acosta',
    '/especialidades/clinica-medica',
    '/especialidades/pediatria',
    '/especialidades/dermatologia',
    '/especialidades/traumatologia',
    '/especialidades/ginecologia',
    '/novedades/bienvenida-julieta',
    '/novedades/organiza-tu-visita',
  ]) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
  }
  for (const route of ['/agenda', '/pacientes', '/disponibilidad', '/configuracion']) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 404, `Administrative route still exists: ${route}`);
  }
  flows.push('Todas las fichas públicas y eliminación de rutas administrativas');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + '/turnos');
  await next();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 5);
  await fillPatient();
  await next();
  assert.equal(
    await page.getByRole('button', { name: 'Continuar', exact: true }).isDisabled(),
    true,
  );
  await chooseCard('Cardiología');
  await next();
  assert.equal(await page.locator('.professional-option').count(), 1);
  await chooseCard('Dra. Sofía Martínez');
  await next();
  const weekday = page.getByRole('button', {
    name: 'miércoles, 7 de octubre · Sin disponibilidad',
    exact: true,
  });
  assert.equal(await weekday.isDisabled(), true);
  assert.equal(
    await page
      .getByRole('button', { name: 'lunes, 12 de octubre · Sin disponibilidad', exact: true })
      .isDisabled(),
    true,
  );
  await page
    .getByRole('button', { name: 'martes, 6 de octubre · Disponible', exact: true })
    .click();
  assert.equal(await page.locator('.time-options').getByText('09:00', { exact: true }).count(), 0);
  await chooseCard('10:00');
  await next();
  await page.getByRole('button', { name: 'Modificar datos personales' }).click();
  assert.equal(
    await page.getByRole('textbox', { name: 'Nombre', exact: true }).inputValue(),
    'Laura',
  );
  await next();
  await next();
  await next();
  await next();
  await screenshot('revision-1440');
  await page.getByRole('button', { name: 'Confirmar turno', exact: true }).click();
  await page.getByRole('heading', { name: '¡Tu turno fue reservado!' }).waitFor();
  assert.match(await page.locator('.success-code strong').innerText(), /^NOV-[A-F0-9]{6}$/);
  await screenshot('confirmacion-1440');
  flows.push(
    'Validaciones, especialidad compatible, días bloqueados, horarios ocupados, modificación y confirmación',
  );
  await page.getByRole('link', { name: 'Volver al inicio', exact: true }).click();
  await page
    .locator('.professional-card')
    .first()
    .getByRole('link', { name: 'Solicitar turno', exact: true })
    .click();
  await fillPatient();
  await next();
  assert.equal(await page.locator('input[name=specialty]:checked').inputValue(), 'cardio');
  await next();
  assert.equal(await page.locator('input[name=professional]:checked').inputValue(), 'sofia');
  await next();
  await page
    .getByRole('button', { name: 'martes, 6 de octubre · Disponible', exact: true })
    .click();
  assert.equal(await page.locator('.time-options').getByText('10:00', { exact: true }).count(), 0);
  await page
    .getByRole('button', { name: 'jueves, 15 de octubre · Disponible', exact: true })
    .click();
  assert.deepEqual(await page.locator('.time-options label').allTextContents(), [
    '10:00',
    '10:30',
    '11:00',
    '11:30',
  ]);
  flows.push('Preselección desde profesional, persistencia de reserva y horario extraordinario');
  await page.goto(base + '/turnos?especialidad=derma&profesional=paula');
  await reachPaula();
  assert.equal(
    await page
      .getByRole('button', { name: 'miércoles, 14 de octubre · Sin disponibilidad', exact: true })
      .isDisabled(),
    true,
  );
  flows.push('Día completamente ocupado deshabilitado');
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(base + '/turnos?especialidad=cardio&profesional=sofia');
    await reachTimes();
    await noOverflow(`Calendario@${width}`);
    await page
      .getByRole('button', { name: 'martes, 13 de octubre · Disponible', exact: true })
      .click();
    await chooseCard('11:00');
    await next();
    await noOverflow(`Revisión@${width}`);
    await screenshot(`revision-${width}`);
    await page.getByRole('button', { name: 'Confirmar turno', exact: true }).click();
    await page.getByRole('heading', { name: '¡Tu turno fue reservado!' }).waitFor();
    await noOverflow(`Éxito@${width}`);
    if (width === 320 || width === 1440) await screenshot(`confirmacion-${width}`);
  }
  flows.push('Reserva completa en los ocho tamaños');
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto(base);
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page
    .getByRole('navigation', { name: 'Menú móvil' })
    .getByRole('link', { name: 'Contacto' })
    .click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  flows.push('Menú móvil, cierre por Escape y navegación');
  await page.locator('#novedades').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Novedad siguiente' }).click();
  await expect(page.locator('.carousel-dots [aria-current=true]')).toHaveAttribute(
    'aria-label',
    `Ver novedad 2: Una nueva mirada para los más chicos`,
  );
  await page.locator('.news-track').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.carousel-dots [aria-current=true]')).toHaveAttribute(
    'aria-label',
    /^Ver novedad 3/,
  );
  await page.locator('.faq-trigger').first().click();
  assert.equal(await page.locator('.faq-trigger[aria-expanded=true]').count(), 1);
  flows.push('Carrusel con flechas y teclado, preguntas frecuentes');
  await page.goto(base);
  await screenshot('inicio-final-320');
  const broken = await page
    .locator('img')
    .evaluateAll((imgs) =>
      imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    );
  imageFailures.push(...broken);
  assert.equal(
    await page.locator('meta[name=robots]').getAttribute('content'),
    'noindex, nofollow',
  );
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('table').count(), 0);
  flows.push('Imágenes locales, noindex y estructura institucional');
  const report = {
    pages: routes.length,
    viewports: 8,
    responsiveChecks: 64,
    overflowFailures: overflow,
    runtimeErrors,
    imageFailures,
    flows,
  };
  await writeFile('artifacts/public/audit.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  assert.equal(overflow.length, 0, 'Horizontal overflow');
  assert.equal(runtimeErrors.length, 0, 'Runtime errors');
  assert.equal(imageFailures.length, 0, 'Broken images');
} finally {
  await browser.close();
}
async function reachPaula() {
  await fillPatient();
  await next();
  await next();
  await next();
}
