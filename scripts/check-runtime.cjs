// Development-only production interaction smoke test (external Playwright).
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

async function main() {
  const browser = await chromium.launch({
    executablePath:
      process.env.SATIETY_CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const { FOODS, RANKED_FOODS } = await import("../foods.js");
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    await page.goto(
      process.env.SATIETY_URL || "http://127.0.0.1:4174/outros/satiety-index/",
    );
    await page.waitForFunction(
      () =>
        document.querySelector("#scene")?.getAttribute("aria-busy") === "false",
    );
    assert.equal(await page.locator("#score-value").textContent(), "323");
    assert.equal(
      await page
        .locator("#scene")
        .evaluate((el) => el.getAnimations({ subtree: true }).length),
      0,
    );
    await page.route("**/*grapes-*.webp", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.continue();
    });
    await page.selectOption("#food-select", "grapes");
    await page.selectOption("#food-select", "cheese");
    await page.waitForFunction(() =>
      document.querySelector("#scene img")?.alt.endsWith("Cheese"),
    );
    await page.waitForTimeout(850);
    assert.equal(await page.locator("#score-value").textContent(), "146");
    assert.match(
      await page.locator("#scene img").getAttribute("alt"),
      /Cheese$/,
    );
    await page.locator("#next").focus();
    await page.keyboard.press("ArrowRight");
    const next =
      RANKED_FOODS[RANKED_FOODS.findIndex(({ id }) => id === "cheese") + 1];
    assert.equal(
      await page.locator("#score-value").textContent(),
      String(next.score),
    );
    assert.equal(await page.locator("#food-name").textContent(), next.name);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.selectOption("#food-select", "apples");
    assert.equal(
      await page.locator("#score-value").textContent(),
      String(FOODS.find(({ id }) => id === "apples").score),
    );
    await page.waitForFunction(() =>
      document.querySelector("#scene img")?.alt.endsWith("Apples"),
    );
    assert.equal(
      await page
        .locator("#scene")
        .evaluate((el) => el.getAnimations({ subtree: true }).length),
      0,
    );
    await page.route("**/*oranges-*.webp", (route) => route.abort());
    await page.selectOption("#food-select", "oranges");
    await page.locator("#scene [role=alert]").waitFor();
    await page.selectOption("#food-select", "potato");
    await page.waitForFunction(() =>
      document.querySelector("#scene img")?.alt.endsWith("Boiled potato"),
    );
    assert.equal(await page.locator("#score-value").textContent(), "323");
    await page.goBack();
    assert.equal(await page.locator("#food-select").inputValue(), "oranges");
    console.log(
      "PASS: initial static score/image; rapid selection race; score cancellation; instant keyboard values; reduced motion; image error/recovery; history.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
