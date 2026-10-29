import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración de la suite externa End-to-End (E2E).
 * Prueba la aplicación desde afuera como una 'caja negra' (Black-Box Testing).
 * Requiere que la aplicación web esté previamente levantada en http://localhost:5173.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    // Apunta a la URL de la aplicación ya servida
    baseURL: process.env.BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
