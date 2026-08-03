// @ts-check
const { defineConfig } = require("@playwright/test");

const BASE_URL = process.env.BASE_URL || "https://gt.nic.gt";

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },

  fullyParallel: false, // secuencial para evidencia de video clara
  retries: 0,
  workers: 1,

  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],

  use: {
    baseURL: BASE_URL,
    // Capturas y video automáticos
    screenshot: "on",
    video: "on",
    trace: "on",

    // Viewport estándar
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true, // dev2.registro.gt no tiene certificado

    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
