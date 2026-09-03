import { test, expect } from '@playwright/test';

test.describe('Flujo de Noticias Espaciales', () => {
  test('debe listar noticias y abrir el detalle dinámico por slug', async ({ page }) => {
    await page.goto('/noticias');

    // Debe mostrar la noticia principal destacada
    const articleTitle = page.locator('h2, h3').filter({ hasText: /Artemis|Exoplaneta|SpaceX/i }).first();
    await expect(articleTitle).toBeVisible();

    // Navegar al detalle de Artemis
    await page.goto('/noticias/artemis-iii');
    await expect(page).toHaveURL(/.*noticias\/artemis-iii/);
    await expect(page.locator('h1')).toContainText('Artemis III');
    await expect(page.getByText('Volver a Noticias Espaciales')).toBeVisible();
  });
});
