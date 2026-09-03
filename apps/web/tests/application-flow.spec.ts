import { test, expect } from '@playwright/test';

test.describe('Flujo de Postulación de Voluntarios (/unite)', () => {
  test('debe cargar la página y permitir completar el formulario de postulación', async ({ page }) => {
    await page.goto('/unite');
    await expect(page.locator('h1')).toContainText('Únete a la Órbita');

    await page.locator('input[name="fullName"]').fill('Astronauta Prueba');
    await page.locator('input[name="email"]').fill('astronauta@ejemplo.com');
    await page.locator('select[name="area"]').selectOption('redaccion');
    await page.locator('textarea[name="message"]').fill('Deseo escribir artículos sobre astrofísica.');

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/¡Gracias por postularte!|Hemos recibido tu información/i)).toBeVisible();
  });
});
