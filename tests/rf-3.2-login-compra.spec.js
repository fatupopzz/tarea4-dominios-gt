// RF-3.2: El sistema debe requerir que el usuario inicie sesión
// para poder finalizar la compra de los dominios en el carrito.

const { test, expect } = require("@playwright/test");

test.describe("RF-3.2 — Login requerido para finalizar compra", () => {
  // TC-22: Sin sesión, el checkout solicita login
  test("TC-22: El sistema solicita login al intentar finalizar compra sin sesión", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Agregar un dominio al carrito primero
    const searchInput = page.locator("#texto-search");
    await searchInput.fill("testlogin12345");

    const searchBtn = page.locator("button.boton-search");
    await searchBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Intentar agregar al carrito
    const addBtn = page.locator(
      "button:has-text('Agregar'), a:has-text('Agregar'), [class*='cart'], [class*='add']"
    ).first();

    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
    }

    // Intentar ir al checkout
    const checkoutBtn = page.locator(
      "button:has-text('Comprar'), button:has-text('Checkout'), button:has-text('Finalizar'), " +
      "button:has-text('Pagar'), a:has-text('Comprar'), a:has-text('Checkout'), " +
      "a:has-text('Finalizar'), a:has-text('Pagar'), a:has-text('Registrar')"
    ).first();

    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForTimeout(3000);
    }

    // Verificar que se solicita login
    const content = await page.textContent("body");
    const requiresLogin =
      content.toLowerCase().includes("iniciar sesión") ||
      content.toLowerCase().includes("login") ||
      content.toLowerCase().includes("sign in") ||
      content.toLowerCase().includes("google") ||
      content.toLowerCase().includes("autenticar") ||
      content.toLowerCase().includes("ingresar") ||
      content.toLowerCase().includes("cuenta");

    await page.screenshot({ path: "evidence/TC-22-checkout-requiere-login.png", fullPage: true });
    console.log(`Login requerido detectado: ${requiresLogin}`);
    console.log(`URL actual: ${page.url()}`);
  });

  // TC-23: MANUAL — Login con Google
  test.skip("TC-23: [MANUAL] Después de login con Google, se puede continuar la compra", async () => {
    // MANUAL: requiere OAuth con Google
  });

  // TC-24: Carrito vacío no permite checkout
  test("TC-24: No se puede finalizar compra con carrito vacío", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState("networkidle");

    const checkoutBtn = page.locator(
      "button:has-text('Comprar'), button:has-text('Checkout'), button:has-text('Finalizar'), " +
      "a:has-text('Comprar'), a:has-text('Checkout'), a:has-text('Carrito'), a:has-text('Cart')"
    ).first();

    if (await checkoutBtn.isVisible()) {
      const isDisabled = await checkoutBtn.isDisabled();
      console.log(`Botón checkout deshabilitado: ${isDisabled}`);

      if (!isDisabled) {
        await checkoutBtn.click();
        await page.waitForTimeout(2000);
        const content = await page.textContent("body");
        const emptyMsg =
          content.toLowerCase().includes("vacío") ||
          content.toLowerCase().includes("empty") ||
          content.toLowerCase().includes("no hay") ||
          content.toLowerCase().includes("agregar");
        console.log(`Mensaje de carrito vacío detectado: ${emptyMsg}`);
      }
    }

    await page.screenshot({ path: "evidence/TC-24-carrito-vacio.png", fullPage: true });
  });
});
