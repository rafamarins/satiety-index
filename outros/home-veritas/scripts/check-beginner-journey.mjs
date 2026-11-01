import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {beginnerContent} from '../home-truths-beginner.js';
import {topics} from '../home-truths-content.js';
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`);
const {chromium,webkit}=require('playwright');
const axePath=process.env.QA_AXE_PATH||require.resolve('axe-core/axe.min.js');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4186/';
const output=process.env.QA_REPORT_DIR||'qa/beginner-2026-11-01';
await mkdir(output,{recursive:true});
const report={states:[],journeys:[],errors:[]};
async function ready(page){await page.locator('body:not([data-loading]) #topic-title').waitFor();await page.waitForFunction(()=>!document.querySelector('#language-trigger').disabled);await page.locator('#common-questions[aria-busy="true"]').waitFor({state:'detached'});}
async function audit(page,name){
  await page.evaluate(()=>document.fonts.ready);
  if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({path:axePath});
  const result=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}));
  report.states.push({name,...result});
  assert(!result.overflow,`${name}: overflow`);assert.deepEqual(result.violations,[],`${name}: accessibility`);
}
try{
  for(const engine of (process.env.QA_ENGINES||'chromium,webkit').split(',')){
    const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{}:{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    try{
      for(const language of ['en','pt-BR','es','zh-Hans']){
        const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
        const page=await context.newPage();page.on('pageerror',e=>report.errors.push({engine,language,error:e.message}));
        const copy=beginnerContent(language);
        await page.goto(`${base}?lang=${language}#/`);await ready(page);await audit(page,`${engine}/${language}/home`);
        await page.locator('.start-invitation').click();await page.locator('.journey-steps').waitFor();
        assert.equal(await page.locator('.journey-steps>li').count(),6);
        await audit(page,`${engine}/${language}/start`);
        assert.equal(await page.locator('.guide-trust').count(),0);
        assert(!/undefined|Sources reviewed:|Source reviews:|educational prototype/.test(await page.locator('body').innerText()));
        for(const panel of ['about','links']){
          await page.locator(`#${panel}-button`).click();
          await page.locator('#drawer-content .loading-note').waitFor({state:'detached'});
          assert(!/undefined|Sources reviewed:|Source reviews:|educational prototype|17 topics/.test(await page.locator('#drawer-content').innerText()));
          await audit(page,`${engine}/${language}/${panel}`);
          await page.keyboard.press('Escape');
        }
        await page.locator('.journey-steps>li a').first().click();await page.locator('.common-questions .faq').first().waitFor();
        assert.equal(await page.locator('.common-questions .faq[open]').count(),1);
        assert(await page.locator('.next-action').isVisible());
        await page.locator('.back-to-steps').click();await page.locator('.journey-steps').waitFor();
        await page.locator('#topics-button').click();await page.locator('#home-search-form').waitFor();
        for(const query of copy.shared.searchExamples){
          await page.locator('#home-question').fill(query);await page.locator('#home-question').press('Enter');
          await page.locator('#search-results .faq').first().waitFor();
          assert(await page.locator('#search-results .faq').count()>0,query);
          await page.locator('#search-results .faq>summary').first().click();
          assert(await page.locator('#search-results .faq[open] .answer-tools a').first().isVisible());
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#drawer').evaluate(e=>e.open),false);
          assert.equal(await page.evaluate(()=>document.activeElement.id),'home-question');
        }
        await page.goto(`${base}?lang=${language}#/deposit`);await ready(page);await audit(page,`${engine}/${language}/deposit`);
        await page.locator('[data-calculator]').click();await page.locator('#calc-result').waitFor();
        assert((await page.locator('#calc-result').innerText()).length>20);
        await page.keyboard.press('Escape');
        assert(await page.locator('[data-calculator]').evaluate(e=>e===document.activeElement));
        for(const width of [320,1440]){
          await page.setViewportSize({width,height:900});
          await audit(page,`${engine}/${language}/deposit/${width}`);
        }
        report.journeys.push(`${engine}/${language}: start, first step, return, 3 searches, calculator, modal focus`);
        await context.close();
      }
      if(engine==='chromium'){
        const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
        page.on('pageerror',e=>report.errors.push({engine,error:e.message}));
        for(const topic of topics){
          await page.goto(`${base}?lang=en#/${topic.id}`);await ready(page);
          assert.equal(await page.locator('.common-questions .faq').count(),3,topic.id);
          assert.equal(await page.locator('.topic-evidence .source-list a').count(),topic.sourceLinks.length,topic.id);
          await audit(page,`${engine}/en/topic/${topic.id}`);
        }
        await page.goto(`${base}?lang=en#/deposit/kiwisaver`);await ready(page);
        assert(await page.locator('[data-question="deposit/kiwisaver"]').evaluate(e=>e.open));
        await page.locator('#start-link').click();await page.locator('.journey-steps').waitFor();await page.goBack();await page.locator('.common-questions').waitFor();
        assert.equal(new URL(page.url()).hash,'#/deposit/kiwisaver');
        for(const width of [390,1440]){
          await page.setViewportSize({width,height:900});
          for(const route of ['','start','deposit']){
            await page.goto(`${base}?lang=en#/${route}`);await ready(page);
            await page.screenshot({path:`${output}/${route||'home'}-${width}.png`,fullPage:true});
          }
        }
        // The brief guide remains useful when the optional detailed library cannot load.
        await page.route('**/assets/js/*',route=>route.request().url().includes('guide-content')?route.abort():route.continue());
        await page.goto(`${base}?lang=en#/deposit`);await ready(page);
        assert.equal(await page.locator('.question-block').count(),3);
        assert(await page.locator('.topic-evidence a').first().isVisible());
        await page.unroute('**/assets/js/*');
        const held=[];
        await page.route('**/assets/js/*',route=>route.request().url().includes('guide-content')?held.push(route):route.continue());
        await page.goto(`${base}?lang=en&qa=slow#/deposit`,{waitUntil:'domcontentloaded'});
        await page.locator('.question-block').first().waitFor({timeout:5000});
        assert.equal(await page.locator('#common-questions').getAttribute('aria-busy'),'true');
        assert(await page.locator('.topic-evidence a').first().isVisible());
        await page.locator('#start-link').click();await page.locator('.journey-steps').waitFor();
        for(const request of held)await request.continue();
        await page.waitForLoadState('networkidle');
        assert.equal(await page.locator('.journey-steps>li').count(),6);
        assert.equal(await page.locator('#common-questions').count(),0);
        report.journeys.push('chromium: failed and delayed reference chunks preserve short guide, sources and navigation');
        await context.close();
      }
    }finally{await browser.close();}
  }
}finally{await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));}
assert.deepEqual(report.errors,[]);
console.log(JSON.stringify({states:report.states.length,journeys:report.journeys,errors:report.errors},null,2));
