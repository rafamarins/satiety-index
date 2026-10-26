import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`), puppeteer=require('puppeteer-core');
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage();const results=[];
try{
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});await page.emulateCPUThrottling(4);
 await page.goto('http://127.0.0.1:4185/#/decide/life',{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>{window.eventSamples=[];new PerformanceObserver(l=>eventSamples.push(...l.getEntries().map(e=>({name:e.name,duration:e.duration,interactionId:e.interactionId})))).observe({type:'event',durationThreshold:16});});
 for(const selector of ['[data-question="decide/compare"]>summary','[data-question="decide/compare"]>summary','[data-question="decide/compare"]>summary','#search-button']){
  await page.$eval(selector,e=>{e.scrollIntoView({block:'center'});e.focus()});await new Promise(r=>setTimeout(r,300));await page.evaluate(()=>eventSamples=[]);await page.keyboard.press('Enter');await new Promise(r=>setTimeout(r,500));results.push({action:selector,samples:await page.evaluate(()=>eventSamples)});
 }
 await page.type('#guide-search','curtains fridge');await new Promise(r=>setTimeout(r,500));await page.evaluate(()=>eventSamples=[]);await page.keyboard.press('Escape');await new Promise(r=>setTimeout(r,300));results.push({action:'Escape search',samples:await page.evaluate(()=>eventSamples)});
}finally{await browser.close();}
await writeFile('qa/quality-2026-10-26/interaction-timing.json',JSON.stringify({environment:'Isolated headless Chrome, mobile 390x844, 4x CPU slowdown, local server; lab samples, not field INP',results},null,2));console.log(JSON.stringify(results));
