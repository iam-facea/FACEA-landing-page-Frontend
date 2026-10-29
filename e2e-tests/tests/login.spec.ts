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

  test("debe crear una publicacion y mostrarla en Publicaciones Guardadas", async ({
    page,
  }) => {
    const postTitle = "Publicacion E2E creada correctamente";
    const createdPost = {
      id: 1,
      title: postTitle,
      description: "Publicacion creada durante la prueba end-to-end.",
      category: "Noticias",
      date: "2026-10-01",
      postStateId: 1,
      imageUrl: "https://example.test/publicacion-e2e.png",
    };
    let savedPosts: typeof createdPost[] = [];

    // Simulamos el ciclo completo de listado, creacion y recarga. El retardo
    // representa el tiempo real de carga de las publicaciones guardadas.
    await page.unroute("**/api/**");
    await page.route("**/api/Posts", async (route) => {
      if (route.request().method() === "GET") {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(savedPosts),
        });
        return;
      }

      if (route.request().method() === "POST") {
        savedPosts = [createdPost];
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(createdPost),
        });
        return;
      }

      await route.fallback();
    });

    await page.goto("/login");
    await page.getByLabel(/usuario/i).fill("admin");
    await page.getByLabel(/contrase\u00f1a/i).fill("123");
    await page.getByRole("button", { name: /iniciar sesi\u00f3n/i }).click();

    await expect(page).toHaveURL(/.*\/editor/);
    await expect(
      page.getByRole("heading", { name: /publicaciones guardadas/i }),
    ).toBeVisible();

    await page.getByPlaceholder(/escribe un t/i).fill(postTitle);
    await page
      .getByPlaceholder(/describe brevemente/i)
      .fill("Publicacion creada durante la prueba end-to-end.");
    await page.locator('input[type="date"]').fill("2026-10-01");
    await page
      .locator('input[type="file"]')
      .setInputFiles("fixtures/publicacion-e2e.png");

    await page.getByRole("button", { name: /publicar noticia/i }).click();

    const savedPostsSection = page
      .getByRole("heading", { name: /publicaciones guardadas/i })
      .locator("xpath=../..");

    // Esperamos el resultado visible en vez de usar una pausa fija.
    await expect(savedPostsSection.getByText(postTitle)).toBeVisible({
      timeout: 15_000,
    });
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
