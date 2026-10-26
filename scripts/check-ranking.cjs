// Development-only browser check; Playwright is installed outside this project.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function main() {
  const { FOODS } = await import('../foods.js');
  const { STUDY_NUTRITION } = await import('../study-nutrition.js');
  const browser = await chromium.launch({
    executablePath: process.env.SATIETY_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${process.env.SATIETY_URL || 'http://127.0.0.1:4179/'}#white-bread`);
    await page.waitForFunction(() => document.querySelectorAll('.ranking-row').length === 38);
    assert.equal(await page.locator('#ranking-sort').inputValue(), 'score-desc');
    for (const sort of ['portion-desc', 'portion-asc', 'score-asc', 'score-desc']) {
      await page.selectOption('#ranking-sort', sort);
      for (const category of ['All foods', 'Fruit', 'Breakfast cereals']) {
        await page.locator('.category-filter').getByText(category, { exact: true }).click();
        const rows = await page.locator('.ranking-row').evaluateAll(nodes => nodes.map(n => ({
          id: n.dataset.food,
          rank: Number(n.querySelector('.ranking-index').textContent),
          grams: Number.parseInt(n.querySelector('.ranking-portion').lastChild.textContent),
          score: Number.parseInt(n.querySelector('.ranking-score').textContent),
        })));
        const expectedFoods = FOODS.filter(f => category === 'All foods' || f.category === category);
        assert.deepEqual(new Set(rows.map(r => r.id)), new Set(expectedFoods.map(f => f.id)));
        rows.forEach((row, i) => {
          assert.equal(row.grams, STUDY_NUTRITION[row.id].servingGrams);
          assert.equal(row.score, FOODS.find(f => f.id === row.id).score);
          if (!i) return;
          const key = sort.startsWith('portion') ? 'grams' : 'score';
          assert.ok(sort.endsWith('asc') ? rows[i - 1][key] <= row[key] : rows[i - 1][key] >= row[key], `${sort}: ${category}`);
          assert.ok(rows[i - 1].rank < row.rank);
        });
        assert.equal(await page.locator('#food-select').inputValue(), 'white-bread');
        assert.equal(await page.locator('#ranking-sort').inputValue(), sort);
      }
    }
    await page.locator('.category-filter').getByText('All foods', { exact: true }).click();
    await page.selectOption('#ranking-sort', 'portion-desc');
    assert.equal(await page.locator('.ranking-row').first().getAttribute('data-food'), 'oranges');
    await page.locator('#ranking-sort').focus();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'ranking-sort');
    const intercepted = await page.locator('#ranking-sort').evaluate(el => {
      const key = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
      el.dispatchEvent(key);
      return key.defaultPrevented;
    });
    assert.equal(intercepted, false, 'Native select must retain arrow keys');
    assert.equal(await page.locator('#food-select').inputValue(), 'white-bread');
    await page.selectOption('#ranking-sort', 'portion-asc');
    await page.locator('.ranking-row[data-food="eggs"]').click();
    assert.equal(await page.locator('#portion-weight').innerText(), '159 g');
    assert.equal(await page.locator('#ranking-sort').inputValue(), 'portion-asc');
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.locator('#collection').evaluate(el => el.scrollIntoView({ block: 'start' }));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} ${width}`);
        if (process.env.SATIETY_SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SATIETY_SCREENSHOT_DIR}/sort-${theme}-${width}.png` });
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: four sort orders, all 38 values, category filters, row numbering, keyboard focus and shortcut isolation, retained food selection, row navigation and responsive themes.');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
