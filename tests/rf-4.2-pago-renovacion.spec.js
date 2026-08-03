// RF-4.2: El sistema debe procesar el pago de la renovación y enviar los datos
// de facturación/notificación a los contactos previamente registrados.
//
// NOTA: Estos tests son MANUALES porque involucran pasarelas de pago reales.
// Los scripts llegan hasta donde es posible sin completar un pago.

const { test, expect } = require("@playwright/test");

test.describe("RF-4.2 — Pago de renovación y notificación a contactos", () => {
  // TC-28: Verificar que el flujo de pago existe y muestra datos de contacto
  test("TC-28: [PARCIAL] El flujo de renovación presenta formulario de pago y contactos", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Ir a renovación rápida
    const renewLink = page.locator(
      "a:has-text('Renovación'), a:has-text('Renovar'), a:has-text('Renew'), a:has-text('renovación')"
    ).first();

    if (await renewLink.isVisible()) {
      await renewLink.click();
      await page.waitForLoadState("networkidle");
    }

    // Buscar un dominio para renovar
    const renewInput = page.locator("input[type='text']").first();
    if (await renewInput.isVisible()) {
      await renewInput.fill("nic.gt");

      const renewBtn = page.locator(
        "button:has-text('Buscar'), button:has-text('Renovar'), button:has-text('Renew'), button[type='submit']"
      ).first();

      if (await renewBtn.isVisible()) {
        await renewBtn.click();
        await page.waitForTimeout(3000);
      }
    }

    // Documentar lo que se muestra en pantalla
    const content = await page.textContent("body");
    const hasPaymentInfo =
      content.toLowerCase().includes("pago") ||
      content.toLowerCase().includes("pay") ||
      content.toLowerCase().includes("monto") ||
      content.toLowerCase().includes("amount") ||
      content.toLowerCase().includes("factur") ||
      content.toLowerCase().includes("billing");

    const hasContactInfo =
      content.toLowerCase().includes("administrativo") ||
      content.toLowerCase().includes("técnico") ||
      content.toLowerCase().includes("cobro") ||
      content.toLowerCase().includes("admin") ||
      content.toLowerCase().includes("technical") ||
      content.toLowerCase().includes("billing");

    console.log(`Info de pago encontrada: ${hasPaymentInfo}`);
    console.log(`Info de contactos encontrada: ${hasContactInfo}`);

    // NOTA MANUAL: Continuar documentando manualmente desde aquí.
    // Capturar la pasarela de pago, montos, y contactos que se muestran.
    await page.screenshot({ path: "evidence/TC-28-flujo-pago.png", fullPage: true });
  });

  // TC-29: MANUAL — Verificar pasarela y monto correcto
  test.skip("TC-29: [MANUAL] La pasarela muestra el monto correcto y contactos de notificación", async () => {
    // PASOS MANUALES:
    // 1. Iniciar flujo de renovación de un dominio
    // 2. Llegar hasta la pasarela de pago
    // 3. Capturar el monto mostrado
    // 4. Verificar que es consistente con el período de renovación
    // 5. Documentar los campos requeridos por la pasarela
    // 6. Verificar mención de contactos (Administrativo, Técnico, Cobro)
    //
    // NO completar pago real.
    //
    // RESULTADO ESPERADO:
    // La pasarela muestra el monto correcto y el sistema indica que las
    // notificaciones se enviarán a los contactos registrados.
  });

  // TC-30: MANUAL — Cancelar pago y verificar que no se procesa
  test.skip("TC-30: [MANUAL] Cancelar el pago no procesa la renovación", async () => {
    // PASOS MANUALES:
    // 1. Iniciar flujo de renovación de un dominio
    // 2. Llegar a la pasarela de pago
    // 3. Cancelar/abandonar sin completar
    // 4. Verificar mensaje de cancelación
    // 5. Verificar que el dominio NO fue renovado
    //
    // RESULTADO ESPERADO:
    // Al cancelar, no se procesa la renovación y se muestra un mensaje
    // indicando que el proceso no se completó.
  });
});
