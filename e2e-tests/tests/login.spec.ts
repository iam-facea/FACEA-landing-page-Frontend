import { test, expect } from "@playwright/test";

test.describe("E2E Black-Box Testing: Autenticación y Navegación al Editor", () => {
  test.beforeEach(async ({ page }) => {
    // Interceptamos llamadas a APIs externas para aislar el test del estado del backend
    await page.route("**/api/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
  });

  test("debe permitir iniciar sesión con credenciales válidas y acceder al editor", async ({
    page,
  }) => {
    // ==========================================
    // 1. ARRANGE (Navegar a la aplicación externa)
    // ==========================================
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: /admin login/i })
    ).toBeVisible();

    const userInput = page.getByLabel(/usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT (Interactuar con el formulario)
    // ==========================================
    await userInput.fill("admin");
    await passwordInput.fill("123");
    await submitButton.click();

    // ==========================================
    // 3. ASSERT (Verificar que el usuario llegó a /editor)
    // ==========================================
    await expect(page).toHaveURL(/.*\/editor/);
    await expect(page.getByRole("button", { name: /publicar/i })).toBeVisible();
  });

  test("debe mostrar alerta de error cuando las credenciales son incorrectas", async ({
    page,
  }) => {
    // ==========================================
    // 1. ARRANGE
    // ==========================================
    await page.goto("/login");

    const userInput = page.getByLabel(/usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT
    // ==========================================
    await userInput.fill("usuario_erroneo");
    await passwordInput.fill("password_invalida");
    await submitButton.click();

    // ==========================================
    // 3. ASSERT
    // ==========================================
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText(/credenciales inválidas/i);

    // El sistema debe permanecer en la pantalla de login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
