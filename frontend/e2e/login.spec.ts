import { test, expect } from "@playwright/test";

test.describe("Flujo End-to-End de Autenticación y Navegación al Editor", () => {
  test.beforeEach(async ({ page }) => {
    // Interceptamos cualquier llamada al backend para que el test no dependa de si la API está levantada
    await page.route("**/api/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });
  });

  test("debe permitir al usuario iniciar sesión y redirigir al panel del editor", async ({
    page,
  }) => {
    // ==========================================
    // 1. ARRANGE (Organizar / Navegar a la página)
    // ==========================================
    await page.goto("/login");

    // Verificamos que la página cargó el formulario de login
    await expect(
      page.getByRole("heading", { name: /admin login/i })
    ).toBeVisible();

    const userInput = page.getByLabel(/usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT (Actuar / Tipear y enviar formulario en navegador real)
    // ==========================================
    await userInput.fill("admin");
    await passwordInput.fill("123");
    await submitButton.click();

    // ==========================================
    // 3. ASSERT (Afirmar / Verificar navegación e interfaz en /editor)
    // ==========================================
    // Esperamos a que la URL del navegador cambie a /editor
    await expect(page).toHaveURL(/.*\/editor/);

    // Verificamos que el formulario del editor y sus elementos clave estén en pantalla
    await expect(page.getByRole("button", { name: /publicar/i })).toBeVisible();
  });

  test("debe mostrar alerta de error cuando las credenciales son incorrectas", async ({
    page,
  }) => {
    // ==========================================
    // 1. ARRANGE (Organizar / Navegar a la página)
    // ==========================================
    await page.goto("/login");

    const userInput = page.getByLabel(/usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT (Actuar / Tipear credenciales erróneas)
    // ==========================================
    await userInput.fill("usuario_inexistente");
    await passwordInput.fill("clave_invalida");
    await submitButton.click();

    // ==========================================
    // 3. ASSERT (Afirmar / Verificar alerta de error)
    // ==========================================
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText(/credenciales inválidas/i);

    // Confirmamos que sigue en /login y no redirigió
    await expect(page).toHaveURL(/.*\/login/);
  });
});
