// Development-only browser QA; use the same external Playwright/axe tools as the app audit.
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

async function main() {
  const base = process.env.OUTROS_URL || "http://127.0.0.1:4174/outros/";
  const output = path.resolve("artifacts/qa/outros");
  await fs.mkdir(output, { recursive: true });
  const report = { url: base, states: [], errors: [] };
  const browser = await chromium.launch({
    executablePath:
      process.env.SATIETY_CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ["light", "dark"]) {
        if ((await page.locator("html").getAttribute("data-theme")) !== theme)
          await page.locator(".theme-toggle").click();
        await page.evaluate(() => document.fonts.ready);
        const audit = await page.evaluate(async () => {
          const results = await axe.run(document, {
            runOnly: {
              type: "tag",
              values: [
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "best-practice",
              ],
            },
          });
          return results.violations.map(({ id, nodes }) => ({
            id,
            targets: nodes.map(({ target }) => target),
          }));
        });
        assert.deepEqual(
          audit,
          [],
          `${width} ${theme}: accessibility violations`,
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          "Horizontal overflow",
        );
        assert.equal(
          await page
            .locator(".project-art img")
            .evaluateAll((images) => images.length === 2 && images.every((image) => image.complete && image.naturalWidth > 0)),
          true,
          "Artwork failed to load",
        );
        const spacing = await page.addStyleTag({
          content:
            "* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p {margin-bottom:2em!important}",
        });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `Text spacing overflow at ${width}`,
        );
        await spacing.evaluate((el) => el.remove());
        report.states.push({
          width,
          theme,
          violations: audit.length,
          overflow: false,
        });
        if ([390, 1440].includes(width))
          await page.screenshot({
            path: path.join(output, `${width}-${theme}.png`),
            fullPage: true,
          });
      }
    }
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "dark",
      "Theme did not persist",
    );
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.className),
      "skip-link",
    );
    await page.keyboard.press("Enter");
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "projects",
    );
    assert.equal(
      await page.locator(".project-link").first().evaluate((a) => a.href),
      new URL("satiety-index/", base).href,
    );
    assert.equal(
      await page.locator(".project-link").nth(1).getAttribute("href"),
      "https://nzvotes.nz/",
    );
    for (const link of await page.locator('a[href="https://nzvotes.nz/"]').all()) {
      assert.equal(await link.getAttribute("target"), "_blank");
      assert.match(await link.getAttribute("rel"), /noopener/);
    }
    const popupPromise = page.waitForEvent("popup");
    await page.locator(".project-link").nth(1).click();
    const popup = await popupPromise;
    await popup.waitForURL("https://nzvotes.nz/**");
    assert.equal(await popup.evaluate(() => window.opener === null), true);
    await popup.close();
    await page.locator(".project-link").first().click();
    await page.waitForURL(new URL("satiety-index/", base).href);
    assert.equal(
      await page.locator("#food-name").textContent(),
      "Boiled potato",
    );
    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto(base);
    for (const link of await noJS.locator(".project-link").all())
      assert.equal(await link.isVisible(), true);
    assert.equal(await noJS.locator(".theme-toggle").isVisible(), false);
    await noJS.close();
    assert.deepEqual(report.errors, []);
    report.keyboard = "Skip link, project link and persistent theme passed";
    report.noJavaScript = "Project remains readable and linked";
    await fs.writeFile(
      path.join(output, "review.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(
      `PASS: ${report.states.length} Outros states; keyboard, themes, image, reflow, text spacing and no-JS navigation.`,
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
