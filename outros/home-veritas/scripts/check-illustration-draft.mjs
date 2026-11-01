import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(`${process.env.QA_MODULES_ROOT||'/tmp/home-veritas-beginner-qa-20261101/node_modules'}/package.json`);
const {chromium,webkit}=require('playwright');
const path='concepts/2026-11-01-illustrations/qa';await mkdir(path,{recursive:true});
const result={states:[],errors:[],remoteRequests:[]};
try{
for(const engine of ['chromium','webkit']){
 const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{}:{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:1000}});
 page.on('pageerror',error=>result.errors.push(error.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4186/'))result.remoteRequests.push(r.url());});
 await page.goto('http://127.0.0.1:4186/concepts/2026-11-01-illustrations/');
 await page.locator('.worked-example').waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 assert.equal(await page.locator('iframe,.art-gallery,.art-play').count(),0);
 const artwork=await page.locator('img').evaluateAll(images=>images.map(i=>i.src));assert(artwork.every(src=>src.includes('/assets/home-truths/')));
 const arrows=await page.locator('select').evaluateAll(elements=>elements.map(e=>({padding:getComputedStyle(e).paddingRight,arrow:getComputedStyle(e).backgroundPosition})));for(const arrow of arrows){assert.equal(arrow.padding,'44px');assert(arrow.arrow.includes('16px'));}
 for(const language of ['en','pt-BR','es','zh-Hans']){
  await page.locator('#draft-language').selectOption(language);
  for(const topic of ['deposit','mortgage','records']){
   await page.locator(`[data-topic=${topic}]`).click();await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
   if(topic==='deposit'){
    await page.locator('[data-example-deposit]').selectOption('10');
    assert.equal((await page.locator('[data-example-loan]').innerText()).replace(/\D/g,''),'630000');
   }
   if(topic==='mortgage'){await page.locator('[data-example-rate="7"]').click();assert((await page.locator('.example-status').innerText()).includes('369'));}
   if(topic==='records'){assert.equal(await page.locator('.record-collage').count(),2);assert.equal(await page.locator('.check-limit').count(),2);}
   for(const width of [320,390,1280]){
    await page.setViewportSize({width,height:900});
    const state=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}})).violations.map(v=>({id:v.id,target:v.nodes.map(n=>n.target)}))}));
    result.states.push({engine,language,topic,width,...state});assert(!state.overflow,`${language}/${topic}/${width}`);assert.deepEqual(state.violations,[],`${language}/${topic}/${width}`);
    if(engine==='chromium'&&language==='en'&&width===390)await page.locator('#draft-example').screenshot({path:`${path}/collage-${topic}-mobile.png`});
   }
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-topic=deposit]').click();assert.equal(await page.locator('.example-share-bar').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 await page.locator('[data-topic=deposit]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-topic=mortgage]').getAttribute('aria-selected'),'true');
 await page.setViewportSize({width:1280,height:1000});await page.locator('#draft-language').selectOption('en');await page.locator('[data-topic=deposit]').click();
 if(engine==='chromium')await page.screenshot({path:`${path}/collage-draft-desktop.png`,fullPage:true});
 }finally{await browser.close();}
}
assert.deepEqual(result.errors,[]);assert.deepEqual(result.remoteRequests,[]);
}finally{await writeFile(`${path}/collage-report.json`,JSON.stringify(result,null,2));}
console.log(JSON.stringify({states:result.states.length,errors:result.errors,remoteRequests:result.remoteRequests},null,2));
