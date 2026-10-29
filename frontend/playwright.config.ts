import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración de Playwright para pruebas End-to-End (E2E) en el Frontend.
 * Documentación oficial: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    // URL base de la app frontend local
    baseURL: "http://localhost:5173",
    // Captura trazas y screenshots solo si el test falla
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Levanta automáticamente el servidor de desarrollo de Vite antes de ejecutar los tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
