import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`),puppeteer=require('puppeteer-core');
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];const pause=ms=>new Promise(r=>setTimeout(r,ms));
try{
 for(const code of ['en','pt-BR','es','zh-Hans']){
  const context=await browser.createBrowserContext(),page=await context.newPage();
  await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});await page.emulateCPUThrottling(4);
  await page.goto(`http://127.0.0.1:4185/?lang=${code}#/decide/life`,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
  await page.$eval('[data-question="decide/compare"]>summary',e=>{e.scrollIntoView({block:'center'});e.focus()});await pause(150);
  const before=await page.$eval('[data-question="decide/compare"]>summary',e=>e.getBoundingClientRect().y);
  await page.evaluate(()=>{window.mobileEvents=[];new PerformanceObserver(list=>mobileEvents.push(...list.getEntries().map(e=>({name:e.name,duration:e.duration,interactionId:e.interactionId})))).observe({type:'event',durationThreshold:16});});
  await page.keyboard.press('Enter');await pause(250);
  const accordion=await page.evaluate(before=>({keepsPrevious:document.querySelector('[data-question="decide/life"]').open,opensNext:document.querySelector('[data-question="decide/compare"]').open,shift:Math.abs(document.activeElement.getBoundingClientRect().y-before),animations:document.querySelector('.question-stack').getAnimations({subtree:true}).length,focusOutline:getComputedStyle(document.activeElement).outlineStyle}),before);
  assert(accordion.keepsPrevious&&accordion.opensNext&&accordion.shift<2&&accordion.animations===0);assert.notEqual(accordion.focusOutline,'none');
  await page.focus('#search-button');await page.keyboard.press('Enter');await page.waitForSelector('#guide-search');
  const query={en:'curtains fridge','pt-BR':'geladeira incluída',es:'nevera incluida','zh-Hans':'冰箱窗帘'}[code];await page.type('#guide-search',query);await page.waitForSelector('#search-results .faq');
  await page.keyboard.press('Escape');await pause(100);const closed=await page.evaluate(()=>!document.querySelector('#drawer').open&&document.activeElement.id==='search-button');assert(closed);
  await page.focus('#language-trigger');await page.keyboard.press('Enter');await page.keyboard.press('ArrowDown');await page.keyboard.press('Escape');
  const languageKeyboard=await page.evaluate(()=>document.querySelector('#language-menu').hidden&&document.activeElement.id==='language-trigger');assert(languageKeyboard);
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);const reduced=await page.evaluate(()=>document.getAnimations().length===0);assert(reduced);
  const samples=await page.evaluate(()=>mobileEvents);results.push({code,accordion,searchEscapeAndFocus:closed,languageKeyboard,reducedMotion:reduced,samples,maxObservedEvent:samples.length?Math.max(...samples.map(e=>e.duration)):null});await context.close();
 }
}finally{await browser.close();await writeFile('qa/final-mobile-2026-10-26/interactions.json',JSON.stringify({environment:'Isolated mobile Chrome 390x844, 4x CPU slowdown; 16ms event reporting threshold; lab samples only',results},null,2));}
console.log(JSON.stringify(results.map(r=>({code:r.code,shift:r.accordion.shift,maxEvent:r.maxObservedEvent,pass:r.searchEscapeAndFocus&&r.languageKeyboard&&r.reducedMotion}))));
