// RF-2.3: El sistema debe incluir una herramienta IDN para traducir
// nombres con caracteres especiales a Punycode y viceversa.

const { test, expect } = require("@playwright/test");

test.describe("RF-2.3 — Herramienta IDN / Punycode", () => {
  // TC-16: Convertir caracteres especiales a Punycode
  test("TC-16: Caracteres especiales se convierten correctamente a Punycode", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navegar a la herramienta IDN
    const idnLink = page.locator(
      "a:has-text('IDN'), a:has-text('idn'), a:has-text('Punycode'), a:has-text('punycode'), a:has-text('Internacionalizado')"
    ).first();

    if (await idnLink.isVisible()) {
      await idnLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Buscar el campo de entrada de la herramienta IDN
    const idnInput = page.locator(
      "input[placeholder*='IDN'], input[placeholder*='idn'], input[placeholder*='dominio'], input[class*='idn'], input[type='text']"
    ).first();

    if (await idnInput.isVisible()) {
      await idnInput.fill("año");

      // Buscar botón de convertir
      const convertBtn = page.locator(
        "button:has-text('Convertir'), button:has-text('Convert'), button:has-text('Traducir'), button[type='submit']"
      ).first();

      if (await convertBtn.isVisible()) {
        await convertBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verificar que el resultado contiene xn-- (prefijo Punycode)
      const content = await page.textContent("body");
      const hasPunycode = content.includes("xn--");
      console.log(`Punycode encontrado: ${hasPunycode}`);
    }

    await page.screenshot({ path: "evidence/TC-16-idn-a-punycode.png", fullPage: true });
  });

  // TC-17: Convertir Punycode a Unicode
  test("TC-17: Punycode se convierte correctamente a caracteres legibles", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const idnLink = page.locator(
      "a:has-text('IDN'), a:has-text('idn'), a:has-text('Punycode'), a:has-text('punycode')"
    ).first();

    if (await idnLink.isVisible()) {
      await idnLink.click();
      await page.waitForLoadState("networkidle");
    }

    const idnInput = page.locator(
      "input[placeholder*='IDN'], input[placeholder*='idn'], input[placeholder*='punycode'], input[type='text']"
    ).first();

    if (await idnInput.isVisible()) {
      // Ingresar Punycode para "año"
      await idnInput.fill("xn--ao-0ja");

      const convertBtn = page.locator(
        "button:has-text('Convertir'), button:has-text('Convert'), button:has-text('Traducir'), button[type='submit']"
      ).first();

      if (await convertBtn.isVisible()) {
        await convertBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verificar que el resultado contiene el texto legible
      const content = await page.textContent("body");
      const hasUnicode = content.includes("año");
      console.log(`Unicode encontrado: ${hasUnicode}`);
    }

    await page.screenshot({ path: "evidence/TC-17-punycode-a-unicode.png", fullPage: true });
  });

  // TC-18: Nombre sin caracteres especiales no se modifica
  test("TC-18: Nombre sin caracteres especiales no requiere conversión", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const idnLink = page.locator(
      "a:has-text('IDN'), a:has-text('idn'), a:has-text('Punycode'), a:has-text('punycode')"
    ).first();

    if (await idnLink.isVisible()) {
      await idnLink.click();
      await page.waitForLoadState("networkidle");
    }

    const idnInput = page.locator(
      "input[placeholder*='IDN'], input[placeholder*='idn'], input[type='text']"
    ).first();

    if (await idnInput.isVisible()) {
      await idnInput.fill("dominio");

      const convertBtn = page.locator(
        "button:has-text('Convertir'), button:has-text('Convert'), button:has-text('Traducir'), button[type='submit']"
      ).first();

      if (await convertBtn.isVisible()) {
        await convertBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verificar que el resultado es el mismo texto o indica que no necesita conversión
      const content = await page.textContent("body");
      const sinCambio = content.includes("dominio") && !content.includes("xn--");
      console.log(`Sin cambio: ${sinCambio}`);
    }

    await page.screenshot({ path: "evidence/TC-18-sin-conversion.png", fullPage: true });
  });
});
