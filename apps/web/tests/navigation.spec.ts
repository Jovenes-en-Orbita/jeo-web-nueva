import { test, expect } from '@playwright/test';

test.describe('Navegación general en JEO', () => {
  test('debe cargar la página principal y mostrar el título oficial', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jóvenes en Órbita/);
    await expect(page.locator('h1')).toContainText('Jóvenes en Órbita');
  });

  test('debe navegar correctamente a las secciones del Cosmos', async ({ page }) => {
    await page.goto('/');
    
    // Navegar a El Universo
    await page.goto('/universo');
    await expect(page).toHaveURL(/.*universo/);

    // Navegar a Sistema Solar
    await page.goto('/sistema-solar');
    await expect(page).toHaveURL(/.*sistema-solar/);

    // Navegar a Constelaciones
    await page.goto('/constelaciones');
    await expect(page).toHaveURL(/.*constelaciones/);

    // Navegar a Galería
    await page.goto('/galeria');
    await expect(page).toHaveURL(/.*galeria/);
  });
});
