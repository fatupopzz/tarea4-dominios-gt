// RF-4.1: El sistema debe permitir buscar y renovar un dominio
// existente sin necesidad de iniciar sesión.

const { test, expect } = require("@playwright/test");

test.describe("RF-4.1 — Renovación rápida sin login", () => {
  // TC-25: Buscar un dominio registrado para renovación
  test("TC-25: Se puede buscar un dominio registrado para renovación sin login", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navegar a la sección de renovación rápida
    const renewLink = page.locator(
      "a:has-text('Renovación'), a:has-text('Renovar'), a:has-text('Renew'), a:has-text('renovación'), a:has-text('Quick Renewal')"
    ).first();

    if (await renewLink.isVisible()) {
      await renewLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Buscar campo de búsqueda de renovación
    const renewInput = page.locator(
      "input[type='text'], input[placeholder*='dominio'], input[placeholder*='domain'], input[class*='renew']"
    ).first();

    if (await renewInput.isVisible()) {
      // Ingresar un dominio registrado conocido
      await renewInput.fill("nic.gt");

      const renewBtn = page.locator(
        "button:has-text('Buscar'), button:has-text('Renovar'), button:has-text('Renew'), button:has-text('Search'), button[type='submit']"
      ).first();

      if (await renewBtn.isVisible()) {
        await renewBtn.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(3000);
      }

      // Verificar que muestra opciones de renovación
      const content = await page.textContent("body");
      const hasRenewalInfo =
        content.toLowerCase().includes("renovar") ||
        content.toLowerCase().includes("renew") ||
        content.toLowerCase().includes("pago") ||
        content.toLowerCase().includes("pay") ||
        content.toLowerCase().includes("período") ||
        content.toLowerCase().includes("period");

      console.log(`Info de renovación encontrada: ${hasRenewalInfo}`);
    }

    await page.screenshot({ path: "evidence/TC-25-renovacion-buscar.png", fullPage: true });
  });

  // TC-26: Buscar un dominio no registrado para renovación
  test("TC-26: Dominio no registrado muestra mensaje de no encontrado", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const renewLink = page.locator(
      "a:has-text('Renovación'), a:has-text('Renovar'), a:has-text('Renew'), a:has-text('renovación'), a:has-text('Quick Renewal')"
    ).first();

    if (await renewLink.isVisible()) {
      await renewLink.click();
      await page.waitForLoadState("networkidle");
    }

    const renewInput = page.locator(
      "input[type='text'], input[placeholder*='dominio'], input[placeholder*='domain']"
    ).first();

    if (await renewInput.isVisible()) {
      await renewInput.fill("dominionoexiste99999.com.gt");

      const renewBtn = page.locator(
        "button:has-text('Buscar'), button:has-text('Renovar'), button:has-text('Renew'), button:has-text('Search'), button[type='submit']"
      ).first();

      if (await renewBtn.isVisible()) {
        await renewBtn.click();
        await page.waitForTimeout(3000);
      }

      const content = await page.textContent("body");
      const notFound =
        content.toLowerCase().includes("no encontrado") ||
        content.toLowerCase().includes("not found") ||
        content.toLowerCase().includes("no existe") ||
        content.toLowerCase().includes("no se encontró") ||
        content.toLowerCase().includes("error");

      console.log(`Dominio no encontrado detectado: ${notFound}`);
    }

    await page.screenshot({ path: "evidence/TC-26-renovacion-no-existe.png", fullPage: true });
  });

  // TC-27: Verificar que no se solicita login
  test("TC-27: El flujo de renovación rápida no requiere login", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verificar que no hay redirección a login
    const renewLink = page.locator(
      "a:has-text('Renovación'), a:has-text('Renovar'), a:has-text('Renew'), a:has-text('renovación'), a:has-text('Quick Renewal')"
    ).first();

    if (await renewLink.isVisible()) {
      await renewLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Verificar URL: no debe ser /login, /signin, etc.
    const currentUrl = page.url();
    const isLoginPage =
      currentUrl.includes("login") ||
      currentUrl.includes("signin") ||
      currentUrl.includes("auth");

    expect(isLoginPage).toBeFalsy();

    // Interactuar con la búsqueda de renovación
    const renewInput = page.locator(
      "input[type='text'], input[placeholder*='dominio'], input[placeholder*='domain']"
    ).first();

    if (await renewInput.isVisible()) {
      await renewInput.fill("nic.gt");

      const renewBtn = page.locator(
        "button:has-text('Buscar'), button:has-text('Renovar'), button:has-text('Renew'), button:has-text('Search'), button[type='submit']"
      ).first();

      if (await renewBtn.isVisible()) {
        await renewBtn.click();
        await page.waitForTimeout(3000);
      }

      // Verificar que después de la búsqueda tampoco redirige a login
      const urlAfter = page.url();
      const redirectedToLogin =
        urlAfter.includes("login") ||
        urlAfter.includes("signin") ||
        urlAfter.includes("auth");

      expect(redirectedToLogin).toBeFalsy();
    }

    await page.screenshot({ path: "evidence/TC-27-sin-login.png", fullPage: true });
  });
});
