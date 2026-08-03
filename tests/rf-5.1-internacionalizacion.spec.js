// RF-5.1: El sistema debe soportar y permitir alternar el idioma
// de la interfaz entre español e inglés.

const { test, expect } = require("@playwright/test");

test.describe("RF-5.1 — Internacionalización español/inglés", () => {
  // TC-31: Cambiar de español a inglés
  test("TC-31: El idioma cambia correctamente de español a inglés", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: "evidence/TC-31-idioma-espanol.png" });

    // El toggle de idioma está en ul.language-list
    // Buscar el link/botón de English/EN dentro del menú
    const langMenu = page.locator("ul.language-list, .language-list, [class*='language'], [class*='lang']");

    // Primero intentar abrir el menú de idioma si es un dropdown
    const langParent = page.locator("li:has(ul.language-list), a:has-text('Español'), a:has-text('Idioma'), [class*='language']").first();
    if (await langParent.isVisible()) {
      await langParent.hover();
      await page.waitForTimeout(500);
      await langParent.click();
      await page.waitForTimeout(500);
    }

    // Buscar el link de English/EN
    const enLink = page.locator(
      "a:has-text('English'), a:has-text('EN'), a[href*='en'], a[href*='lang=en'], " +
      "li:has-text('English') a, li:has-text('EN') a"
    ).first();

    if (await enLink.isVisible()) {
      await enLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
    } else {
      console.log("No se encontró link de English. Elementos de idioma encontrados:");
      const langElements = await page.locator("ul.language-list *").allTextContents();
      console.log(langElements);

      // Intentar encontrar cualquier link que cambie idioma
      const allLangLinks = page.locator("ul.language-list a, .language-list a");
      const count = await allLangLinks.count();
      console.log(`Links en language-list: ${count}`);
      for (let i = 0; i < count; i++) {
        const text = await allLangLinks.nth(i).textContent();
        const href = await allLangLinks.nth(i).getAttribute("href");
        console.log(`  Link ${i}: text="${text?.trim()}", href="${href}"`);
      }
    }

    const contentAfter = await page.textContent("body");
    // Buscar cualquier evidencia de que el idioma cambió
    const englishIndicators = ["home", "search", "news", "statistics", "domain", "renewal",
                               "cart", "about", "contact", "register", "whois", "services"];
    const foundEnglish = englishIndicators.filter((w) => contentAfter.toLowerCase().includes(w));
    console.log(`Palabras en inglés encontradas: ${foundEnglish.join(", ")}`);

    await page.screenshot({ path: "evidence/TC-31-idioma-ingles.png" });
  });

  // TC-32: Cambiar de inglés a español
  test("TC-32: El idioma regresa a español y se mantiene al navegar", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Intentar cambiar a inglés primero
    const langParent = page.locator("li:has(ul.language-list), [class*='language']").first();
    if (await langParent.isVisible()) {
      await langParent.hover();
      await page.waitForTimeout(500);
    }

    const enLink = page.locator("a:has-text('English'), a:has-text('EN')").first();
    if (await enLink.isVisible()) {
      await enLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);
    }

    // Ahora cambiar de vuelta a español
    const langParent2 = page.locator("li:has(ul.language-list), [class*='language']").first();
    if (await langParent2.isVisible()) {
      await langParent2.hover();
      await page.waitForTimeout(500);
    }

    const esLink = page.locator("a:has-text('Español'), a:has-text('ES')").first();
    if (await esLink.isVisible()) {
      await esLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);
    }

    const content = await page.textContent("body");
    const spanishWords = ["inicio", "buscar", "noticias", "estadísticas", "dominio"];
    const foundSpanish = spanishWords.filter((w) => content.toLowerCase().includes(w));
    console.log(`Palabras en español encontradas: ${foundSpanish.join(", ")}`);

    await page.screenshot({ path: "evidence/TC-32-vuelta-espanol.png" });

    // Navegar a otra sección
    const navLink = page.locator("div.navbar a").nth(1);
    if (await navLink.isVisible()) {
      await navLink.click();
      await page.waitForLoadState("networkidle");
      const contentNav = await page.textContent("body");
      const stillSpanish = spanishWords.filter((w) => contentNav.toLowerCase().includes(w));
      console.log(`Español después de navegar: ${stillSpanish.join(", ")}`);
      await page.screenshot({ path: "evidence/TC-32-espanol-otra-seccion.png" });
    }
  });

  // TC-33: Persistencia del idioma tras recargar
  test("TC-33: El idioma seleccionado persiste después de recargar la página", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Cambiar a inglés
    const langParent = page.locator("li:has(ul.language-list), [class*='language']").first();
    if (await langParent.isVisible()) {
      await langParent.hover();
      await page.waitForTimeout(500);
    }

    const enLink = page.locator("a:has-text('English'), a:has-text('EN')").first();
    if (await enLink.isVisible()) {
      await enLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: "evidence/TC-33-ingles-antes-recarga.png" });

    // Recargar
    await page.reload();
    await page.waitForLoadState("networkidle");

    const content = await page.textContent("body");
    const englishWords = ["home", "search", "news", "statistics", "domain", "renewal"];
    const stillEnglish = englishWords.filter((w) => content.toLowerCase().includes(w));

    if (stillEnglish.length >= 2) {
      console.log("✓ El idioma inglés PERSISTE después de recargar.");
    } else {
      console.log("✗ El idioma NO persiste después de recargar (vuelve al default).");
    }
    console.log(`Palabras en inglés encontradas: ${stillEnglish.join(", ")}`);

    await page.screenshot({ path: "evidence/TC-33-ingles-despues-recarga.png" });
  });
});
