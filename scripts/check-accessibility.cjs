// Development-only audit. Install axe-core and playwright outside this project.
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const baseURL = process.env.SATIETY_URL || "http://127.0.0.1:4173/";
const output = path.resolve(__dirname, "../artifacts/qa/accessibility.json");
const report = {
  target: "WCAG 2.1 AA",
  states: [],
  layouts: [],
  typography: [],
  keyboard: {},
  contrast: [],
  filters: [],
};

function contrast(foreground, background) {
  const luminance = (color) => {
    const linear = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map((n) => {
        const v = Number(n) / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

async function layout(page, label) {
  return page.evaluate((name) => {
    const visible = (el) =>
      el.getClientRects().length &&
      getComputedStyle(el).visibility !== "hidden";
    return {
      label: name,
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      outside: [...document.querySelectorAll("h1,h2,p,button,select,a")]
        .filter((el) => visible(el) && !el.closest(".sr-only,.skip-link"))
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.left < -1 || b.right > innerWidth + 1;
        })
        .map((el) => ({
          tag: el.tagName,
          id: el.id,
          text: el.textContent.trim().slice(0, 60),
        })),
    };
  }, label);
}

async function typography(page, theme) {
  return page.evaluate((mode) => {
    const visible = (el) =>
      el.getClientRects().length &&
      getComputedStyle(el).visibility !== "hidden" &&
      !el.closest(".sr-only,.skip-link,svg");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    const sizes = [],
      small = [],
      outside = [];
    while (walker.nextNode()) {
      const node = walker.currentNode,
        el = node.parentElement;
      if (!node.textContent.trim() || !visible(el)) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      const text = node.textContent.trim().slice(0, 60);
      sizes.push(size);
      if (size < 14) small.push({ text, size });
      const range = document.createRange();
      range.selectNodeContents(node);
      if (
        [...range.getClientRects()].some(
          (r) => r.left < -1 || r.right > innerWidth + 1,
        )
      )
        outside.push(text);
    }
    const reading = [
      ...document.querySelectorAll(
        ".intro-copy,.food-description,.food-takeaway>p,.study-content>p:not(.study-lede),.collection-heading>p,.footer-notes>p,.ranking-name,.select-wrapper select",
      ),
    ]
      .filter(visible)
      .map((el) => ({
        selector: el.className || el.id,
        size: parseFloat(getComputedStyle(el).fontSize),
      }));
    return {
      width: innerWidth,
      theme: mode,
      minimum: Math.min(...sizes),
      small,
      outside,
      reading,
    };
  }, theme);
}

async function main() {
  const browser = await chromium.launch({
    executablePath:
      process.env.SATIETY_CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.locator("#scene svg").waitFor();
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const foods = await page.evaluate(async () =>
      (
        await import(new URL("./foods.js?v=copy-3", location.href).href)
      ).FOODS.map(({ id, name, score }) => ({
        id,
        name,
        score,
      })),
    );
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ["light", "dark"]) {
        await page.evaluate(
          (value) => (document.documentElement.dataset.theme = value),
          theme,
        );
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
        );
        const colors = await page.evaluate(() => ({
          caption: getComputedStyle(document.querySelector("#plate-caption"))
            .color,
          paper: getComputedStyle(document.querySelector(".specimen"))
            .backgroundColor,
          border: getComputedStyle(document.querySelector("#food-select"))
            .borderTopColor,
          background: getComputedStyle(document.body).backgroundColor,
        }));
        report.contrast.push({
          theme,
          caption: contrast(colors.caption, colors.paper),
          control: contrast(colors.border, colors.background),
        });
        const selected =
          process.argv.includes("--all") && width === 390
            ? foods
            : [foods.find((f) => f.id === "potato")];
        for (const food of selected) {
          await page.selectOption("#food-select", food.id);
          await page.waitForFunction(
            (name) =>
              document.querySelector("#scene").getAttribute("aria-busy") ===
                "false" &&
              document
                .querySelector("#scene svg")
                ?.getAttribute("aria-label")
                ?.endsWith(name),
            food.name,
          );
          await page.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              ),
          );
          const result = await page.evaluate(async () => {
            const audit = await axe.run(document, {
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
            return {
              violations: audit.violations.map(
                ({ id, impact, help, nodes }) => ({
                  id,
                  impact,
                  help,
                  nodes: nodes.map(({ target, failureSummary }) => ({
                    target,
                    failureSummary,
                  })),
                }),
              ),
              incomplete: audit.incomplete.map(({ id, nodes }) => ({
                id,
                nodes: nodes.map(({ target }) => target),
              })),
              passes: audit.passes.length,
            };
          });
          report.states.push({ width, theme, food: food.id, ...result });
          console.log(
            `${width} ${theme} ${food.id}: ${result.violations.length} violations`,
          );
        }
        await page.selectOption("#food-select", "crisps");
        await page.waitForFunction(() =>
          document
            .querySelector("#scene svg")
            ?.getAttribute("aria-label")
            ?.endsWith("Crisps"),
        );
        await page.screenshot({
          path: path.join(
            path.dirname(output),
            `typography-${width === 390 ? "mobile" : "desktop"}-${theme}.png`,
          ),
          fullPage: true,
        });
      }
    }
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) => (document.documentElement.dataset.theme = value),
        theme,
      );
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.selectOption("#food-select", "wholemeal-bread");
        report.typography.push(await typography(page, theme));
        report.layouts.push(await layout(page, `${theme} default ${width}`));
        const spacing = await page.addStyleTag({
          content:
            "* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p {margin-bottom:2em!important}",
        });
        report.layouts.push(
          await layout(page, `${theme} text spacing ${width}`),
        );
        if (width === 320)
          await page.locator(".food-information").screenshot({
            path: path.join(path.dirname(output), "text-spacing-mobile.png"),
          });
        await spacing.evaluate((el) => el.remove());
      }
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => {
          const sizes = [...document.querySelectorAll("body,body *")].map(
            (el) => [el, getComputedStyle(el).fontSize],
          );
          for (const [el, size] of sizes)
            el.style.fontSize = `${parseFloat(size) * 2}px`;
        });
        report.layouts.push(
          await layout(page, `${theme} 200% text size at ${width}`),
        );
        if (width === 320) {
          await page.locator(".site-header").screenshot({
            path: path.join(path.dirname(output), "text-resize-header.png"),
          });
          await page.locator(".food-information").screenshot({
            path: path.join(path.dirname(output), "text-resize-food.png"),
          });
          await page.locator('button[data-food="wholemeal-bread"]').screenshot({
            path: path.join(
              path.dirname(output),
              "text-resize-ranking-row.png",
            ),
          });
        }
        await page.evaluate(() =>
          document
            .querySelectorAll("body,body *")
            .forEach((el) => el.style.removeProperty("font-size")),
        );
      }
    }
    for (const button of await page.locator(".category-filter").all()) {
      await button.click();
      const category = await button.textContent();
      const actual = await page.locator("#food-ranking > li").count();
      const expected = await page.evaluate(
        (value) =>
          import(new URL("./foods.js?v=copy-3", location.href).href).then(
            ({ FOODS }) =>
              FOODS.filter((f) => value === "All foods" || f.category === value)
                .length,
          ),
        category,
      );
      report.filters.push({ category, actual, expected });
    }
    await page.reload({ waitUntil: "networkidle" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.keyboard.press("Tab");
    report.keyboard.firstTab = await page.evaluate(
      () => document.activeElement.className,
    );
    await page.keyboard.press("Enter");
    report.keyboard.skipTarget = await page.evaluate(
      () => document.activeElement.id,
    );
    await page.keyboard.press("Tab");
    report.keyboard.afterSelect = await page.evaluate(() => ({
      id: document.activeElement.id,
      outline: getComputedStyle(document.activeElement).outlineStyle,
    }));
    await page.keyboard.press("ArrowRight");
    report.keyboard.arrowChangedFood =
      (await page.locator("#food-select").inputValue()) !== "wholemeal-bread";
    report.keyboard.reducedMotionAnimations = await page
      .locator("#scene")
      .evaluate((el) => el.getAnimations({ subtree: true }).length);
    await page.locator("#theme-toggle").focus();
    const pressed = await page
      .locator("#theme-toggle")
      .getAttribute("aria-pressed");
    await page.keyboard.press("Space");
    report.keyboard.themeToggled =
      (await page.locator("#theme-toggle").getAttribute("aria-pressed")) !==
      pressed;
    await page.selectOption("#food-select", "potato");
    await page.locator("#next").click();
    await page.waitForFunction(
      () =>
        document.querySelector("#scene").getAttribute("aria-busy") === "false",
    );
    report.reducedMotion = {
      animations: await page
        .locator("#scene")
        .evaluate((el) => el.getAnimations({ subtree: true }).length),
      score: await page.locator("#score-value").textContent(),
      details: await page.evaluate(() => ({
        media: matchMedia("(prefers-reduced-motion: reduce)").matches,
        items: document
          .querySelector("#scene")
          .getAnimations({ subtree: true })
          .map((a) => ({
            type: a.constructor.name,
            property: a.transitionProperty,
            target: a.effect.target.getAttribute("class"),
            duration: a.effect.getTiming().duration,
          })),
      })),
    };
    const axSession = await page.context().newCDPSession(page);
    const axTree = await axSession.send("Accessibility.getFullAXTree");
    report.semantics = {
      lists: axTree.nodes.filter((node) => node.role?.value === "list").length,
      listItems: axTree.nodes.filter((node) => node.role?.value === "listitem")
        .length,
    };

    const touch = await browser.newPage({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      reducedMotion: "reduce",
    });
    await touch.goto(new URL("#popcorn", baseURL).href, {
      waitUntil: "networkidle",
    });
    await touch.locator(".specimen").scrollIntoViewIfNeeded();
    const cdp = await touch.context().newCDPSession(touch);
    const swipe = async (dx, dy) => {
      const rect = await touch.locator(".specimen").boundingBox();
      const x =
        dx < 0 ? rect.x + rect.width * 0.75 : rect.x + rect.width * 0.25;
      const y = rect.y + rect.height * 0.6;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (let i = 1; i <= 6; i++)
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x + (dx * i) / 6, y: y + (dy * i) / 6 }],
        });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await touch.waitForTimeout(150);
    };
    await swipe(-140, 2);
    const left = await touch.locator("#food-select").inputValue();
    await swipe(140, 2);
    const right = await touch.locator("#food-select").inputValue();
    const scrollBefore = await touch.evaluate(() => scrollY);
    await swipe(3, -100);
    report.touch = {
      left,
      right,
      verticalFood: await touch.locator("#food-select").inputValue(),
      verticalScrolled: await touch.evaluate(
        (before) => scrollY > before,
        scrollBefore,
      ),
    };
    await touch.close();
    report.errors = errors;
  } finally {
    await browser.close();
  }
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(report, null, 2) + "\n");
  console.log(`Report: ${output}`);
  assert.ok(
    report.states.every((s) => s.violations.length === 0),
    "Automated accessibility violations found",
  );
  assert.ok(
    report.layouts.every((s) => !s.overflow && s.outside.length === 0),
    "Reflow/text resize issues found",
  );
  assert.ok(
    report.typography.every(
      (s) =>
        s.small.length === 0 &&
        s.outside.length === 0 &&
        s.reading.every(({ size }) => size >= 16 && size <= 18),
    ),
    "Typography size or text overflow issues found",
  );
  assert.equal(report.keyboard.firstTab, "skip-link");
  assert.equal(report.keyboard.skipTarget, "food-select");
  assert.equal(report.keyboard.afterSelect.id, "next");
  assert.equal(report.keyboard.afterSelect.outline, "solid");
  assert.equal(report.keyboard.arrowChangedFood, true);
  assert.equal(report.keyboard.themeToggled, true);
  assert.equal(report.keyboard.reducedMotionAnimations, 0);
  assert.equal(report.reducedMotion.animations, 0);
  assert.equal(report.reducedMotion.score, "225");
  assert.equal(report.semantics.listItems, 38);
  assert.ok(report.contrast.every((c) => c.caption >= 4.5 && c.control >= 3));
  assert.ok(report.filters.every((f) => f.actual === f.expected));
  assert.equal(report.touch.left, "all-bran");
  assert.equal(report.touch.right, "popcorn");
  assert.equal(report.touch.verticalFood, "popcorn");
  assert.equal(report.touch.verticalScrolled, true);
  assert.deepEqual(report.errors, []);
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
