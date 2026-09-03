import { test, expect } from '@playwright/test';

test.describe('Formularios y Recursos', () => {
  test('debe permitir suscribirse al newsletter', async ({ page }) => {
    await page.goto('/newsletter');
    await expect(page.locator('h3')).toContainText('Suscríbete Gratis');

    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('prueba@ejemplo.com');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/¡Suscripción Confirmada!|¡Te has suscrito con éxito/i)).toBeVisible();
  });

  test('debe mostrar los libros y enlaces de descarga en /libros', async ({ page }) => {
    await page.goto('/libros');
    await expect(page.getByText('Guía de Astrofotografía Urbana')).toBeVisible();
    await expect(page.getByText('Manual del Sistema Solar para Jóvenes')).toBeVisible();

    const downloadLinks = page.locator('a[download]');
    await expect(downloadLinks.first()).toBeVisible();
  });
});
