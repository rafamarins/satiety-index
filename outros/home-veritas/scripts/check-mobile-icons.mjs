import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir, writeFile} from 'node:fs/promises';

const require = createRequire(`${process.env.QA_MODULES_ROOT}/package.json`);
const {chromium, webkit} = require('playwright');
const axePath = process.env.QA_AXE_PATH || require.resolve('axe-core/axe.min.js');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4185/';
const output = process.env.QA_REPORT_DIR || 'qa/mobile-icons-2026-10-28';
await mkdir(output, {recursive:true});
const report = {base, states:[], errors:[]};

async function inspect(page, name) {
  const state = await page.evaluate(() => {
    const icons = [...document.querySelectorAll('.ui-icon')];
    const glyphs = [...document.querySelectorAll('a,button,.block-arrow,.question-plus')]
      .filter(el => /[↗↖↘↙←→↑↓☷⌕×]/u.test(el.textContent));
    const pseudoGlyphs = [...document.querySelectorAll('a,button,.question-plus')]
      .filter(el => ['::before','::after'].some(pseudo => /[↗↖↘↙←→↑↓☷⌕×]/u.test(getComputedStyle(el,pseudo).content)));
    return {
      icons:icons.length,
      decorative:icons.every(el => el.namespaceURI === 'http://www.w3.org/2000/svg' && el.getAttribute('aria-hidden') === 'true' && el.getAttribute('focusable') === 'false'),
      textIcons:glyphs.length + pseudoGlyphs.length,
      overflow:document.documentElement.scrollWidth > innerWidth,
    };
  });
  assert(state.icons > 0 && state.decorative && !state.textIcons && !state.overflow, `${name}: ${JSON.stringify(state)}`);
  if (!await page.evaluate(() => !!window.axe)) await page.addScriptTag({path:axePath});
  const violations = await page.evaluate(async () => (await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}})).violations.map(v => ({id:v.id,targets:v.nodes.map(n=>n.target)})));
  assert.deepEqual(violations, [], name);
  report.states.push({name,...state,violations});
}

try {
  for (const engine of (process.env.QA_ENGINES || 'chromium,webkit').split(',')) {
    const browser = await (engine === 'webkit' ? webkit : chromium).launch(engine === 'webkit' ? {} : {executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    try {
      for (const language of ['en','pt-BR','es','zh-Hans']) {
        const context = await browser.newContext({viewport:{width:428,height:926},isMobile:true,hasTouch:true,deviceScaleFactor:3});
        const page = await context.newPage();
        page.on('pageerror', error => report.errors.push({engine,language,error:error.message}));
        await page.goto(`${base}?lang=${language}#/`);
        await page.locator('.interest-grid').waitFor();
        await page.waitForFunction(() => !document.querySelector('#language-trigger').disabled);
        for (const width of [320,428,1440]) {
          await page.setViewportSize({width,height:926});
          await page.evaluate(() => document.fonts.ready);
          await inspect(page,`${engine}/${language}/home/${width}`);
          const geometry = await page.locator('.interest-block .block-arrow').evaluateAll(elements => elements.map(el => {
            const svg = el.querySelector('svg'), before = svg.getBBox();
            el.style.fontFamily = '"Apple Color Emoji"';
            const after = svg.getBBox(), box = el.getBoundingClientRect(), arrow = svg.getBoundingClientRect();
            return {unchanged:['x','y','width','height'].every(key=>before[key]===after[key]),centered:Math.abs((box.left+box.right)-(arrow.left+arrow.right))<1 && Math.abs((box.top+box.bottom)-(arrow.top+arrow.bottom))<1};
          }));
          assert(geometry.length === 6 && geometry.every(g=>g.unchanged && g.centered), `${engine}/${language}/${width}: arrow geometry`);
          if (width === 428) await page.screenshot({path:`${output}/${engine}-${language}-home.png`,fullPage:true});
        }
        await page.setViewportSize({width:428,height:926});
        await page.locator('.interest-block[href="#/explore/money"]').click();
        await page.locator('.topic-block-grid').waitFor();
        await inspect(page,`${engine}/${language}/area`);
        await page.locator('.topic-block[href="#/deposit"]').click();
        await page.locator('.question-stack').waitFor();
        await inspect(page,`${engine}/${language}/topic`);
        const summary = page.locator('.question-block>summary').first();
        await summary.click();
        const vertical = page.locator('.question-block .icon-vertical').first();
        assert.equal(await vertical.evaluate(el=>getComputedStyle(el).display), 'none');
        await summary.click();
        assert.notEqual(await vertical.evaluate(el=>getComputedStyle(el).display), 'none');
        await page.locator('[data-topic-faq]').click();
        await page.locator('#drawer-content .faq').first().waitFor();
        await page.locator('#drawer-content .faq>summary').first().click();
        await inspect(page,`${engine}/${language}/faq`);
        await page.locator('#close-drawer').click();
        await page.locator('.topic-sources').click();
        await page.locator('#drawer-content .source-list').first().waitFor();
        await inspect(page,`${engine}/${language}/sources`);
        await page.locator('#close-drawer').click();
        await page.locator('#search-button').focus();
        await page.keyboard.press('Enter');
        await page.locator('.topic-result').first().waitFor();
        await inspect(page,`${engine}/${language}/search`);
        await page.keyboard.press('Escape');
        await page.waitForFunction(()=>!document.querySelector('#drawer').open);
        await page.waitForFunction(()=>document.activeElement.id === 'search-button');
        assert.equal(await page.evaluate(()=>document.activeElement.id), 'search-button');
        await context.close();
      }
    } finally { await browser.close(); }
  }
  assert.deepEqual(report.errors, []);
} finally {
  await writeFile(`${output}/results.json`,JSON.stringify(report,null,2));
}
console.log(`PASS: ${report.states.length} Chrome/WebKit states; four languages, SVG geometry, no text/emoji icons, accessibility, navigation and dialog focus.`);
