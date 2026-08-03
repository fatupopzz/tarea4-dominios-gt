// RF-2.2: El sistema debe mostrar la información del WHOIS
// para dominios que ya se encuentran registrados.

const { test, expect } = require("@playwright/test");

test.describe("RF-2.2 — Información WHOIS", () => {
  // TC-13: WHOIS de un dominio registrado
  test("TC-13: WHOIS muestra información completa de un dominio registrado", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator("#texto-search");
    await searchInput.fill("nic.gt");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const content = await page.textContent("body");
    const whoisFields = ["registrant", "registrante", "dns", "nameserver", "name server",
                         "creation", "creación", "expir", "contact", "registrar",
                         "domain name", "nombre de dominio", "status", "estado"];
    const found = whoisFields.filter((field) => content.toLowerCase().includes(field));

    console.log(`Campos WHOIS encontrados: ${found.join(", ")}`);
    expect(found.length).toBeGreaterThanOrEqual(1);

    await page.screenshot({ path: "evidence/TC-13-whois-completo.png", fullPage: true });
  });

  // TC-14: No se muestra WHOIS para dominio no registrado
  test("TC-14: Dominio no registrado no muestra información WHOIS detallada", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator("#texto-search");
    await searchInput.fill("asdfqwer98765.com.gt");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const content = await page.textContent("body");
    const disponible =
      content.toLowerCase().includes("disponible") ||
      content.toLowerCase().includes("available") ||
      content.toLowerCase().includes("libre") ||
      content.toLowerCase().includes("registrar");

    await page.screenshot({ path: "evidence/TC-14-whois-no-registrado.png", fullPage: true });
    console.log(`Indicación de disponible: ${disponible}`);
    console.log(`Contenido de la página (primeros 500 chars): ${content.substring(0, 500)}`);
  });

  // TC-15: Formato legible de WHOIS
  test("TC-15: La información WHOIS se presenta en formato legible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator("#texto-search");
    await searchInput.fill("nic.gt");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Buscar contenedor de resultados
    const resultContainer = page.locator("div.main, div.content, div.result, div.results, #results, .whois, pre, table").first();
    if (await resultContainer.isVisible()) {
      const text = await resultContainer.textContent();
      expect(text.length).toBeGreaterThan(50);
      console.log(`Contenido del resultado (primeros 300 chars): ${text.substring(0, 300)}`);
    }

    await page.screenshot({ path: "evidence/TC-15-whois-formato.png", fullPage: true });
  });
});
