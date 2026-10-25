// Development-only browser check; Playwright is installed outside this project.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

async function main() {
  const { FOODS } = await import("../foods.js");
  const { STUDY_NUTRITION } = await import("../study-nutrition.js");
  const { STUDY_PREPARATION } = await import("../study-preparation.js");
  const browser = await chromium.launch({
    executablePath: process.env.SATIETY_CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: "reduce", hasTouch: true });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${process.env.SATIETY_URL || "http://127.0.0.1:4179/"}#brown-pasta`);
    await page.waitForFunction(() => document.querySelector("#food-select").options.length === 38);
    assert.equal(await page.locator("#portion-weight").innerText(), "218 g");
    assert.equal(await page.locator("#macro-carbs").innerText(), "48.5 g");
    assert.equal(await page.locator(".nutrition-details").evaluate((el) => el.open), false);
    await page.locator("summary").tap();
    assert.equal(await page.locator(".nutrition-details").evaluate((el) => el.open), true);
    await page.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".nutrition-details").evaluate((el) => el.open), false);
    await page.keyboard.press("Space");
    assert.equal(await page.locator(".nutrition-details").evaluate((el) => el.open), true);
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#food-select").inputValue(), "brown-pasta");
    const grams = (value) => `${value.toFixed(1)} g`;
    for (const food of FOODS) {
      await page.selectOption("#food-select", food.id);
      const row = STUDY_NUTRITION[food.id];
      assert.equal(await page.locator("#portion-weight").innerText(), `${row.servingGrams} g`, food.id);
      for (const [id, value] of [
        ["macro-protein", row.proteinGrams], ["macro-carbs", row.sugarsGrams + row.starchGrams], ["macro-fat", row.fatGrams],
        ["nutrition-sugars", row.sugarsGrams], ["nutrition-starch", row.starchGrams], ["nutrition-fibre", row.fibreGrams], ["nutrition-water", row.waterGrams],
      ]) assert.equal(await page.locator(`#${id}`).innerText(), grams(value), `${food.id}: ${id}`);
      assert.equal(await page.locator("#portion-preparation").innerText(), STUDY_PREPARATION[food.id]);
      assert.equal(await page.locator("#portion-milk").isVisible(), food.category === "Breakfast cereals");
      assert.equal(await page.locator(".nutrition-details").evaluate((el) => el.open), true);
      assert.match(await page.locator("#selection-announcement").textContent(), new RegExp(`${row.servingGrams} grams`));
      assert.equal(await page.locator("#score-value").innerText(), String(food.score));
    }
    await page.selectOption("#food-select", "brown-pasta");
    await page.selectOption("#food-select", "cornflakes");
    await page.goBack();
    assert.equal(await page.locator("#portion-weight").innerText(), "218 g");
    assert.equal(await page.locator("#portion-milk").isVisible(), false);
    for (const theme of ["light", "dark"]) {
      await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, theme);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${theme} ${width}`);
      }
    }
    assert.deepEqual(errors, []);
    console.log("PASS: all 38 food portions/macros/details, milk context, unchanged scores, deep link/history, touch/keyboard disclosure, both themes and responsive reflow.");
  } finally {
    await browser.close();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
