import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolveRoute} from '../home-truths-navigation.js';
import {topics} from '../home-truths-content.js';
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`);
const {chromium,webkit}=require('playwright'),axePath=require.resolve('axe-core/axe.min.js');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4186/';
const out=process.env.QA_REPORT_DIR||'qa/links-examples-2026-11-01';
await mkdir(out,{recursive:true});
const report={states:[],journeys:[],errors:[]};
async function ready(page){await page.locator('body:not([data-loading]) #topic-title').waitFor();await page.locator('#common-questions[aria-busy="true"]').waitFor({state:'detached'});}
async function audit(page,name){
 await page.evaluate(()=>document.fonts.ready);
 if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({path:axePath});
 const result=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}));
 report.states.push({name,...result});assert(!result.overflow,name);assert.deepEqual(result.violations,[],name);
}
try{
for(const engine of ['chromium','webkit']){
 const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{}:{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 for(const language of ['en','pt-BR','es','zh-Hans']){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  const go=async hash=>{await page.goto(`${base}?lang=${language}#/${hash}`);await ready(page);};
  await go('');assert(!await page.locator('#footer-topics').isVisible());
  await page.locator('#topics-button').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'browse-topics');
  await page.locator('#search-button').click();await page.locator('#guide-search').fill('KiwiSaver');
  assert(!await page.locator('.search-start').isVisible());assert.equal(await page.locator('#drawer [data-about]').count(),0);
  await page.keyboard.press('Escape');
  for(const topic of ['deposit','mortgage','records']){
   await go(topic);assert(await page.locator('#footer-topics').isVisible());
   await page.locator('.worked-example>summary').click();
   if(topic==='deposit'){
    await page.locator('[data-example-deposit]').selectOption('10');
    assert.equal(await page.locator('.example-share-bar').evaluate(e=>e.style.width),'10%');
    assert.equal((await page.locator('[data-example-contribution]').innerText()).replace(/\D/g,''),'70000');
    assert.equal((await page.locator('[data-example-loan]').innerText()).replace(/\D/g,''),'630000');
    await page.locator('[data-example-deposit]').focus();
    await page.keyboard.press('Tab');assert(!await page.locator('[data-example-deposit]').evaluate(e=>e===document.activeElement));
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('.example-share-bar').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
   }
   if(topic==='mortgage'){
    await page.locator('[data-example-rate="7"]').click();
    assert.equal(await page.locator('[data-example-rate="7"]').getAttribute('aria-pressed'),'true');
    assert((await page.locator('.example-status').innerText()).includes('369'));
    assert.equal(await page.locator('.example-rates>div[data-active="true"]').count(),1);
    await page.locator('[data-example-rate="6"]').click();
    assert.equal(await page.locator('[data-example-rate="6"]').getAttribute('aria-pressed'),'true');
    assert(!(await page.locator('.example-status').innerText()).includes('369'));
   }
   if(topic==='records'){
    assert.equal(await page.locator('.record-collage').count(),2);
    assert.equal(await page.locator('.check-limit').count(),2);
    await page.waitForFunction(()=>[...document.querySelectorAll('.record-collage img')].every(img=>img.complete&&img.naturalWidth>0));
    assert.equal(await page.locator('.example-sketch,iframe').count(),0);
   }
   if(topic==='deposit'){
    const spacing=await page.locator('[data-example-deposit]').evaluate(e=>({padding:getComputedStyle(e).paddingRight,position:getComputedStyle(e).backgroundPosition}));
    assert.equal(spacing.padding,'44px');assert(spacing.position.includes('16px'));
   }
   for(const width of [320,390,1440]){
    await page.setViewportSize({width,height:900});await audit(page,`${engine}/${language}/${topic}/${width}`);
    if(engine==='chromium'&&language==='en'&&width!==320){await page.locator('.worked-example').screenshot({path:`${out}/${topic}-${width}.png`});}
   }
   await page.setViewportSize({width:390,height:844});
   assert.equal(await page.locator('[data-details]').count(),1);
   await page.locator('[data-details]').click();await page.locator('#drawer .faq').first().waitFor();
   assert.equal(await page.locator('#drawer-title').innerText(),await page.locator('#topic-title').innerText());
   await page.keyboard.press('Escape');
   await page.locator('#links-button').click();await page.locator('#drawer .source-list').first().waitFor();
   const urls=await page.locator('#drawer .source-list a').evaluateAll(els=>els.map(e=>e.href.replace(/\/$/,'')));
   assert.equal(new Set(urls).size,urls.length,'duplicate links');
   assert(!await page.locator('#drawer .more-reference').evaluate(e=>e.open));
   assert.equal(await page.locator('#drawer-content .drawer-intro').count(),topic==='records'?1:0);
   await page.keyboard.press('Escape');
  }
  await go('budget');await page.locator('[data-calculator]').click();await page.locator('#calc-result').waitFor();
  const source=topics.find(t=>t.id==='mortgage').sourceLinks[0].url;
  assert((await page.locator('#drawer .source-list a').evaluateAll(els=>els.map(e=>e.href))).includes(source));
  await page.keyboard.press('Escape');await page.locator('#topics-button').click();await page.locator('#browse-topics').waitFor();
  assert.equal(await page.evaluate(()=>document.activeElement.id),'browse-topics');
  for(const route of ['', 'start', ...topics.map(t=>t.id)]){
   await go(route);
   const hrefs=await page.locator('a[href^="#/"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')));
   for(const href of hrefs)assert.equal(resolveRoute(href).canonical,href,href);
  }
  report.journeys.push(`${engine}/${language}: contextual navigation, unique sources, examples, reduced motion, calculators and all internal routes`);
  await context.close();
 }
 }finally{await browser.close();}
}
assert.deepEqual(report.errors,[]);
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({states:report.states.length,journeys:report.journeys,errors:report.errors},null,2));
