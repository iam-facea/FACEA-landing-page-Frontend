import { test, expect } from "@playwright/test";

test.describe("Flujo End-to-End de Autenticación y Navegación al Editor (Supabase)", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Interceptamos Supabase Auth (/auth/v1/token)
    await page.route("**/auth/v1/token*", async (route) => {
      const postData = route.request().postDataJSON() || {};

      if (
        postData.email === "editor@institucion.edu.ar" &&
        postData.password === "password_segura"
      ) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            access_token: "mock-valid-supabase-token",
            token_type: "bearer",
            expires_in: 3600,
            refresh_token: "mock-refresh-token",
            user: {
              id: "00000000-0000-0000-0000-000000000001",
              email: "editor@institucion.edu.ar",
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            error: "invalid_grant",
            error_description: "Invalid login credentials",
          }),
        });
      }
    });

    // 2. Interceptamos GET /functions/v1/editor-publications
    await page.route("**/functions/v1/editor-publications*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [],
            nextCursor: null,
          }),
        });
      } else {
        await route.fallback();
      }
    });
  });

  test("debe permitir al usuario iniciar sesión y redirigir al panel del editor", async ({
    page,
  }) => {
    // ==========================================
    // 1. ARRANGE
    // ==========================================
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: /admin login/i }),
    ).toBeVisible();

    const emailInput = page.getByLabel(/email \/ usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT
    // ==========================================
    await emailInput.fill("editor@institucion.edu.ar");
    await passwordInput.fill("password_segura");
    await submitButton.click();

    // ==========================================
    // 3. ASSERT
    // ==========================================
    await expect(page).toHaveURL(/.*\/editor/);
    await expect(
      page.getByRole("button", { name: /publicar noticia/i }),
    ).toBeVisible();
  });

  test("debe mostrar alerta de error cuando las credenciales son incorrectas", async ({
    page,
  }) => {
    // ==========================================
    // 1. ARRANGE
    // ==========================================
    await page.goto("/login");

    const emailInput = page.getByLabel(/email \/ usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT
    // ==========================================
    await emailInput.fill("usuario_inexistente@test.com");
    await passwordInput.fill("clave_invalida");
    await submitButton.click();

    // ==========================================
    // 3. ASSERT
    // ==========================================
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText(/credenciales inválidas/i);

    await expect(page).toHaveURL(/.*\/login/);
  });
});
