// RF-1.1: El sistema debe mostrar la información principal del servicio
// de registro de dominios en la página de inicio.

const { test, expect } = require("@playwright/test");

test.describe("RF-1.1 — Contenido principal de la página de inicio", () => {
  // TC-01: Verificar encabezado con info del servicio
  test("TC-01: La página muestra información principal del servicio de registro", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // El sitio usa div.middle-container como área principal y div.main como contenido
    const mainContent = page.locator("div.middle-container, div.main").first();
    await expect(mainContent).toBeVisible();

    // Verificar que hay headings
    const headings = page.locator("h1, h2, h3");
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);

    // Verificar que el buscador de dominios está presente (call-to-action principal)
    const searchForm = page.locator("form.form-search");
    await expect(searchForm).toBeVisible();

    const searchInput = page.locator("#texto-search");
    await expect(searchInput).toBeVisible();

    await page.screenshot({ path: "evidence/TC-01-hero.png", fullPage: true });
  });

  // TC-02: Verificar que se menciona .gt como dominio
  test("TC-02: La página muestra información sobre dominios .gt", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // El sitio menciona .gt en el contenido
    const content = await page.textContent("body");
    const mencionaGT = content.includes(".gt");
    expect(mencionaGT).toBeTruthy();

    // Verificar que el buscador tiene placeholder descriptivo
    const placeholder = await page.locator("#texto-search").getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
    expect(placeholder.toLowerCase()).toContain("dominio");

    await page.screenshot({ path: "evidence/TC-02-subdominios.png", fullPage: true });
  });

  // TC-03: Verificar navegación funcional
  test("TC-03: Los enlaces de navegación son visibles y funcionales", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // El navbar usa div.navbar con div.menu-site
    const nav = page.locator("div.navbar, div.menu-site").first();
    await expect(nav).toBeVisible();

    const navLinks = nav.locator("a[href]");
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(2);

    // Clic en el primer link y verificar navegación
    const firstLink = navLinks.first();
    const href = await firstLink.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      await firstLink.click();
      await page.waitForLoadState("networkidle");
      await page.screenshot({ path: "evidence/TC-03-nav-link1.png" });
      await page.goBack();
    }

    const secondLink = navLinks.nth(1);
    const href2 = await secondLink.getAttribute("href");
    if (href2 && !href2.startsWith("http") && !href2.startsWith("#")) {
      await secondLink.click();
      await page.waitForLoadState("networkidle");
      await page.screenshot({ path: "evidence/TC-03-nav-link2.png" });
    }
  });
});
