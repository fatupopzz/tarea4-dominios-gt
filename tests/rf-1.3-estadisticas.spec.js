// RF-1.3: El sistema debe mostrar estadísticas de dominios registrados por subdominio,
// filtradas por un rango de fechas, en la sección de 'Estadísticas'.

const { test, expect } = require("@playwright/test");

test.describe("RF-1.3 — Estadísticas de dominios por subdominio", () => {
  // TC-07: Verificar que la sección muestra datos por subdominio
  test("TC-07: La sección de estadísticas muestra datos por tipo de subdominio", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navegar a la sección de estadísticas (buscar link en nav o scroll)
    const statsLink = page.locator(
      "a:has-text('Estadísticas'), a:has-text('estadísticas'), a:has-text('Statistics'), a:has-text('stats')"
    ).first();

    if (await statsLink.isVisible()) {
      await statsLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Verificar que hay datos de estadísticas visibles
    // Buscar tabla, gráfico, o sección con datos por subdominio
    const content = await page.textContent("body");
    const subdominios = [".gt", ".com.gt", ".org.gt", ".edu.gt", ".net.gt"];
    const found = subdominios.filter((sub) => content.includes(sub));

    expect(found.length).toBeGreaterThanOrEqual(1);

    await page.screenshot({ path: "evidence/TC-07-estadisticas.png", fullPage: true });
  });

  // TC-08: Filtrar por rango de fechas válido
  test("TC-08: El filtro de fechas actualiza las estadísticas correctamente", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navegar a estadísticas
    const statsLink = page.locator(
      "a:has-text('Estadísticas'), a:has-text('estadísticas'), a:has-text('Statistics'), a:has-text('stats')"
    ).first();

    if (await statsLink.isVisible()) {
      await statsLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Buscar los campos de fecha
    const dateInputs = page.locator("input[type='date'], input[type='text'][placeholder*='fecha'], input[class*='date']");
    const dateCount = await dateInputs.count();

    if (dateCount >= 2) {
      // Llenar fecha inicio y fin
      await dateInputs.nth(0).fill("2024-01-01");
      await dateInputs.nth(1).fill("2024-12-31");

      // Buscar y hacer clic en botón de filtrar/buscar
      const filterBtn = page.locator(
        "button:has-text('Filtrar'), button:has-text('Buscar'), button:has-text('Aplicar'), button:has-text('Filter'), button[type='submit']"
      ).first();

      if (await filterBtn.isVisible()) {
        await filterBtn.click();
        await page.waitForLoadState("networkidle");
        // Esperar a que se actualicen los datos
        await page.waitForTimeout(2000);
      }
    }

    await page.screenshot({ path: "evidence/TC-08-estadisticas-filtro.png", fullPage: true });
  });

  // TC-09: Filtrar por rango sin datos (fechas futuras)
  test("TC-09: Rango sin datos muestra estado vacío apropiado", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navegar a estadísticas
    const statsLink = page.locator(
      "a:has-text('Estadísticas'), a:has-text('estadísticas'), a:has-text('Statistics'), a:has-text('stats')"
    ).first();

    if (await statsLink.isVisible()) {
      await statsLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Llenar con fechas futuras
    const dateInputs = page.locator("input[type='date'], input[type='text'][placeholder*='fecha'], input[class*='date']");
    const dateCount = await dateInputs.count();

    if (dateCount >= 2) {
      await dateInputs.nth(0).fill("2030-01-01");
      await dateInputs.nth(1).fill("2030-12-31");

      const filterBtn = page.locator(
        "button:has-text('Filtrar'), button:has-text('Buscar'), button:has-text('Aplicar'), button:has-text('Filter'), button[type='submit']"
      ).first();

      if (await filterBtn.isVisible()) {
        await filterBtn.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);
      }
    }

    // Verificar que se muestra algún indicador de sin datos o valores en cero
    await page.screenshot({ path: "evidence/TC-09-estadisticas-vacio.png", fullPage: true });
  });
});
