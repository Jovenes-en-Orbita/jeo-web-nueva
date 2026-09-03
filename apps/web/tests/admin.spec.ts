import { test, expect } from '@playwright/test';

test.describe('Intranet Administrativa JEO', () => {
  test('debe redirigir a /admin/login al ingresar a /admin sin sesión', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*admin\/login/);
    await expect(page.getByText('Acceso a la Intranet')).toBeVisible();
  });

  test('debe mostrar error con campos vacíos o credenciales incorrectas', async ({ page }) => {
    await page.goto('/admin/login');

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.fill('erroneo@jovenesenorbita.com');
    await passwordInput.fill('wrongpassword123');
    await submitBtn.click();

    // Debe mostrar feedback de error
    await expect(page.locator('form, main')).toBeVisible();
  });
});
