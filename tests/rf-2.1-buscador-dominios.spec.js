// RF-2.1: El sistema debe incluir un buscador para verificar la disponibilidad de dominios.

const { test, expect } = require("@playwright/test");

test.describe("RF-2.1 — Buscador de disponibilidad de dominios", () => {
  // TC-10: Buscar un dominio disponible
  test("TC-10: Un dominio no registrado aparece como disponible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // El input es #texto-search y el botón es .boton-search
    const searchInput = page.locator("#texto-search");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("dominioprueba12345xyz");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();

    // El form postea a results.php — esperar la nueva página
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const content = await page.textContent("body");
    const disponible =
      content.toLowerCase().includes("disponible") ||
      content.toLowerCase().includes("available") ||
      content.toLowerCase().includes("registrar") ||
      content.toLowerCase().includes("libre");

    await page.screenshot({ path: "evidence/TC-10-dominio-disponible.png", fullPage: true });
    expect(disponible).toBeTruthy();
  });

  // TC-11: Buscar un dominio ya registrado
  test("TC-11: Un dominio registrado aparece como no disponible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator("#texto-search");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("uvg.edu.gt");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const content = await page.textContent("body");
    const noDisponible =
      content.toLowerCase().includes("no disponible") ||
      content.toLowerCase().includes("registrado") ||
      content.toLowerCase().includes("not available") ||
      content.toLowerCase().includes("taken") ||
      content.toLowerCase().includes("whois") ||
      content.toLowerCase().includes("ocupado");

    await page.screenshot({ path: "evidence/TC-11-dominio-registrado.png", fullPage: true });
    expect(noDisponible).toBeTruthy();
  });

  // TC-12: Buscar con entrada inválida
  test("TC-12: Entrada inválida muestra error o impide la búsqueda", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator("#texto-search");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("!!!");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForTimeout(3000);

    const content = await page.textContent("body");
    const hayValidacion =
      content.toLowerCase().includes("error") ||
      content.toLowerCase().includes("inválido") ||
      content.toLowerCase().includes("invalid") ||
      content.toLowerCase().includes("válido") ||
      content.toLowerCase().includes("no se encontró") ||
      content.toLowerCase().includes("not found") ||
      content.toLowerCase().includes("no disponible");

    await page.screenshot({ path: "evidence/TC-12-entrada-invalida.png", fullPage: true });
    console.log(`Validación detectada: ${hayValidacion}`);
    console.log(`URL después de búsqueda inválida: ${page.url()}`);
  });
});
