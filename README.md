# Tarea 4 — Pruebas de Caja Negra: Dominios .GT

Proyecto de Playwright para pruebas automatizadas sobre https://gt.nic.gt/

## Setup

```bash
npm install
npx playwright install
```

## Ejecutar pruebas

```bash
# Todas las pruebas (headless, genera video + screenshots)
npx playwright test

# Con navegador visible (recomendado para grabar el video de evidencia)
npx playwright test --headed

# Una sola suite de pruebas
npx playwright test tests/rf-2.1-buscador-dominios.spec.js --headed

# Un solo test case
npx playwright test -g "TC-10" --headed

# Con interfaz gráfica de Playwright
npx playwright test --ui
```

## Ver reporte

```bash
npx playwright show-report
```

## Evidencia

- **Screenshots:** se guardan en `evidence/`
- **Videos:** se guardan en `test-results/` (automático)
- **Traces:** se guardan en `test-results/` (para depuración)

## Estructura

```
tests/
  rf-1.1-contenido-principal.spec.js   (TC-01, TC-02, TC-03)
  rf-1.2-noticias.spec.js              (TC-04, TC-05, TC-06)
  rf-1.3-estadisticas.spec.js          (TC-07, TC-08, TC-09)
  rf-2.1-buscador-dominios.spec.js     (TC-10, TC-11, TC-12)
  rf-2.2-whois.spec.js                 (TC-13, TC-14, TC-15)
  rf-2.3-idn-punycode.spec.js          (TC-16, TC-17, TC-18)
  rf-3.1-carrito-localstorage.spec.js   (TC-19, TC-20, TC-21)
  rf-3.2-login-compra.spec.js          (TC-22, TC-23*, TC-24)
  rf-4.1-renovacion-rapida.spec.js     (TC-25, TC-26, TC-27)
  rf-4.2-pago-renovacion.spec.js       (TC-28*, TC-29*, TC-30*)
  rf-5.1-internacionalizacion.spec.js  (TC-31, TC-32, TC-33)
```

*Tests marcados con `*` son manuales o parcialmente automatizados (OAuth/pagos).

## Usar con dev2.registro.gt

```bash
BASE_URL=https://dev2.registro.gt npx playwright test --headed
```

## NOTA IMPORTANTE

Los selectores (CSS/XPath) pueden necesitar ajustes después de inspeccionar
el sitio real. Corran primero con `--headed` para ver cómo se comporta el
sitio y ajusten los selectores según los elementos reales de la interfaz.
