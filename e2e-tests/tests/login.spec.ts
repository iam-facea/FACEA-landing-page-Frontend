import { test, expect } from "@playwright/test";

/**
 * Suite E2E de Caja Negra: Autenticación, Editor y Flujo de Publicaciones
 * Adaptada a Supabase Auth y Edge Functions (frontend-ai-bridge-contract.md).
 */
test.describe("E2E Black-Box Testing: IAM FACEA con Supabase", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Interceptamos Supabase Auth (/auth/v1/token) para simular login de caja negra
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

    // 2. Interceptamos GET /functions/v1/editor-publications para simular listado
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

  test("debe permitir iniciar sesión con credenciales válidas y navegar al panel del editor", async ({
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
    await emailInput.fill("usuario_erroneo@test.com");
    await passwordInput.fill("password_invalida");
    await submitButton.click();

    // ==========================================
    // 3. ASSERT
    // ==========================================
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText(/credenciales inválidas/i);

    // Debe permanecer en la pantalla de login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("debe completar el flujo en 2 pasos de publicación (POST /images -> POST /editor-publications)", async ({
    page,
  }) => {
    const postTitle = "Noticia E2E Supabase Flow";
    const postDescription = "Descripción completa para la prueba end-to-end con Edge Functions.";
    let imageUploaded = false;
    let publicationCreated = false;

    // Mock Paso 1: POST /functions/v1/images
    await page.route("**/functions/v1/images", async (route) => {
      if (route.request().method() === "POST") {
        imageUploaded = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "img-uuid-1234",
            url: "https://ejemplo.com/blob-preview.png",
            createdAt: new Date().toISOString(),
          }),
        });
        return;
      }
      await route.fallback();
    });

    // Mock Paso 2: POST /functions/v1/editor-publications
    await page.route("**/functions/v1/editor-publications", async (route) => {
      if (route.request().method() === "POST") {
        publicationCreated = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "pub-uuid-5678",
            title: postTitle,
            description: postDescription,
            category: "Noticias",
            publicationDate: "2026-04-01",
            status: "published",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            image: {
              id: "img-uuid-1234",
              url: "https://ejemplo.com/blob-preview.png",
            },
          }),
        });
        return;
      }
      await route.fallback();
    });

    // Login y navegación al editor
    await page.goto("/login");
    await page.getByLabel(/email \/ usuario/i).fill("editor@institucion.edu.ar");
    await page.getByLabel(/contraseña/i).fill("password_segura");
    await page.getByRole("button", { name: /iniciar sesión/i }).click();

    await expect(page).toHaveURL(/.*\/editor/);

    // Llenamos el formulario según el contrato
    await page.getByPlaceholder(/escribe un título atractivo/i).fill(postTitle);
    await page.getByPlaceholder(/describe el contenido/i).fill(postDescription);
    await page.locator('input[type="date"]').fill("2026-04-01");
    await page
      .locator('input[type="file"]')
      .setInputFiles("fixtures/publicacion-e2e.png");

    // Enviamos el formulario
    await page.getByRole("button", { name: /publicar noticia/i }).click();

    // Verificamos banner de éxito
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText(/publicación creada exitosamente/i);

    expect(imageUploaded).toBe(true);
    expect(publicationCreated).toBe(true);
  });
});
