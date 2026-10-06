import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const base = process.env.NOVA_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const reports = [];
async function check(label) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  reports.push({
    label,
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  });
}
try {
  for (const route of [
    '/',
    '/profesionales/sofia-martinez',
    '/especialidades/cardiologia',
    '/turnos',
  ]) {
    await page.goto(base + route);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
      window.scrollTo(0, 0);
    });
    await check(route);
  }
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Laura');
  await page.getByRole('textbox', { name: 'Apellido', exact: true }).fill('Demo');
  await page.getByRole('textbox', { name: 'DNI', exact: true }).fill('40999888');
  await page.getByRole('textbox', { name: 'Teléfono', exact: true }).fill('11 4000-0000');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('laura@example.com');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('heading', { name: '¿Con qué especialidad necesitás atenderte?' }).waitFor();
  await check('Especialidad');
  await page.locator('label').filter({ hasText: 'Cardiología' }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('heading', { name: 'Elegí tu profesional' }).waitFor();
  await check('Profesional');
  await page.locator('label').filter({ hasText: 'Dra. Sofía Martínez' }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('heading', { name: 'Encontrá un momento para vos' }).waitFor();
  await page
    .getByRole('button', { name: 'martes, 13 de octubre · Disponible', exact: true })
    .click();
  await check('Calendario');
  await page.locator('label').filter({ hasText: '11:00' }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('heading', { name: 'Revisá los datos de tu turno' }).waitFor();
  await check('Revisión');
  await page.getByRole('button', { name: 'Confirmar turno' }).click();
  await page.getByRole('heading', { name: '¡Tu turno fue reservado!' }).waitFor();
  await check('Confirmación');
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(base);
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.getByRole('dialog').waitFor();
  await check('Menú móvil');
  await writeFile('artifacts/public/accessibility.json', JSON.stringify(reports, null, 2));
  console.log(
    JSON.stringify(
      reports.map((r) => ({
        label: r.label,
        rules: r.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
      })),
      null,
      2,
    ),
  );
  if (reports.some((r) => r.violations.length)) process.exitCode = 1;
} finally {
  await browser.close();
}
