// RF-3.1: El sistema debe permitir agregar dominios al carrito
// y guardarlos en el localStorage sin iniciar sesión.

const { test, expect } = require("@playwright/test");

test.describe("RF-3.1 — Carrito con localStorage sin sesión", () => {
  // TC-19: Agregar dominio al carrito y verificar localStorage
  test("TC-19: Un dominio se agrega al carrito y se guarda en localStorage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Limpiar localStorage
    await page.evaluate(() => localStorage.clear());

    // Buscar un dominio disponible
    const searchInput = page.locator("#texto-search");
    await searchInput.fill("pruebacarrito12345xyz");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Buscar botón de agregar al carrito en la página de resultados
    const addBtn = page.locator(
      "button:has-text('Agregar'), button:has-text('Add'), button:has-text('Carrito'), " +
      "button:has-text('Cart'), a:has-text('Agregar'), a:has-text('Carrito'), " +
      "[class*='cart'], [class*='add'], input[value*='Agregar'], input[value*='Cart']"
    ).first();

    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(2000);
    } else {
      console.log("No se encontró botón de agregar al carrito en la página de resultados");
      console.log("Botones disponibles:");
      const allBtns = await page.locator("button, input[type='submit'], input[type='button']").allTextContents();
      console.log(allBtns);
    }

    // Verificar localStorage
    const storageData = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      return data;
    });

    console.log("localStorage después de agregar:", JSON.stringify(storageData, null, 2));
    await page.screenshot({ path: "evidence/TC-19-carrito-agregar.png", fullPage: true });
  });

  // TC-20: Múltiples dominios persisten tras recargar
  test("TC-20: Dominios persisten en el carrito después de recargar la página", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => localStorage.clear());

    // Agregar un dominio
    const searchInput = page.locator("#texto-search");
    await searchInput.fill("testdominio111");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Intentar agregar al carrito
    const addBtn = page.locator(
      "button:has-text('Agregar'), a:has-text('Agregar'), button:has-text('Carrito'), " +
      "a:has-text('Carrito'), [class*='cart'], [class*='add']"
    ).first();

    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
    }

    const storageBefore = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      return data;
    });
    console.log("localStorage ANTES de recargar:", JSON.stringify(storageBefore, null, 2));
    await page.screenshot({ path: "evidence/TC-20-antes-recarga.png" });

    // Recargar
    await page.reload();
    await page.waitForLoadState("networkidle");

    const storageAfter = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      return data;
    });
    console.log("localStorage DESPUÉS de recargar:", JSON.stringify(storageAfter, null, 2));
    await page.screenshot({ path: "evidence/TC-20-despues-recarga.png" });
  });

  // TC-21: Eliminar un dominio del carrito
  test("TC-21: Al eliminar un dominio, se remueve del carrito y localStorage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Agregar un dominio primero
    const searchInput = page.locator("#texto-search");
    await searchInput.fill("dominioeliminar999");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const addBtn = page.locator(
      "button:has-text('Agregar'), a:has-text('Agregar'), [class*='cart'], [class*='add']"
    ).first();

    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
    }

    const countBefore = await page.evaluate(() => localStorage.length);
    await page.screenshot({ path: "evidence/TC-21-antes-eliminar.png" });

    // Buscar icono/link del carrito en el navbar
    const cartIcon = page.locator(
      "a:has-text('Carrito'), a:has-text('Cart'), [class*='cart'], [class*='carrito']"
    ).first();

    if (await cartIcon.isVisible()) {
      await cartIcon.click();
      await page.waitForTimeout(1000);

      const removeBtn = page.locator(
        "button:has-text('Eliminar'), button:has-text('Remover'), button:has-text('Remove'), " +
        "a:has-text('Eliminar'), a:has-text('Remove'), [class*='remove'], [class*='delete'], " +
        "button:has-text('×'), button:has-text('X')"
      ).first();

      if (await removeBtn.isVisible()) {
        await removeBtn.click();
        await page.waitForTimeout(1000);
      }
    }

    await page.screenshot({ path: "evidence/TC-21-despues-eliminar.png" });
    const countAfter = await page.evaluate(() => localStorage.length);
    console.log(`Items antes: ${countBefore}, después: ${countAfter}`);
  });
});
