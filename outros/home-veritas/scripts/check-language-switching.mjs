import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`);
const puppeteer=require('puppeteer-core');
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];
const expected={en:{html:'en-NZ',heading:'What’s on your mind?'},'pt-BR':{html:'pt-BR',heading:'Por onde quer começar?'},es:{html:'es',heading:'¿Por dónde quieres empezar?'},'zh-Hans':{html:'zh-Hans',heading:'你想先了解什么？'}};
try{
 for(const mode of ['mouse','touch','keyboard']){
  const context=await browser.createBrowserContext(),page=await context.newPage();
  await page.setViewport(mode==='mouse'?{width:1440,height:1000}:{width:390,height:844,isMobile:mode==='touch',hasTouch:mode==='touch'});
  await page.goto('http://127.0.0.1:4185/?lang=en#/');await page.waitForSelector('#topic-title');
  const activate=async selector=>{if(mode==='touch')await page.tap(selector);else await page.click(selector)};
  for(const [index,code] of ['pt-BR','es','zh-Hans','en'].entries()){
   if(mode==='keyboard'){
    await page.focus('#language-trigger');await page.keyboard.press('Enter');await page.keyboard.press('Home');
    for(let i=0;i<(['en','pt-BR','es','zh-Hans'].indexOf(code));i++)await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
   }else{await activate('#language-trigger');await activate(`[data-language="${code}"]`);}
   await page.waitForFunction((html,heading)=>document.documentElement.lang===html&&document.querySelector('#topic-title')?.textContent===heading&&!document.querySelector('#language-trigger').disabled,{},expected[code].html,expected[code].heading);
   const state=await page.evaluate(()=>({html:document.documentElement.lang,heading:document.querySelector('#topic-title').textContent,stored:localStorage.getItem('home-truths-language'),urlLanguage:new URL(location.href).searchParams.get('lang'),closed:document.querySelector('#language-menu').hidden,focus:document.activeElement.id}));
   assert.equal(state.stored,code);assert.equal(state.urlLanguage,code==='en'?null:code);assert(state.closed);assert.equal(state.focus,'language-trigger');results.push({mode,code,...state});
  }
  // Reload must keep a choice made through the actual control, not just a supplied URL.
  await activate('#language-trigger');await activate('[data-language="pt-BR"]');await page.waitForFunction(()=>document.documentElement.lang==='pt-BR'&&!document.querySelector('#language-trigger').disabled);
  await page.reload();await page.waitForFunction(()=>document.querySelector('#topic-title')?.textContent==='Por onde quer começar?');
  await page.click('a[href="#/decide"]');await page.waitForSelector('[data-question="decide/life"]');
  await page.click('[data-question="decide/life"]>summary');
  await page.waitForSelector('[data-question="decide/life"][open] .collage-answer');
  await page.click('[data-details="decide/life"]');await page.waitForSelector('#drawer-content .faq');
  const deep=await page.evaluate(()=>({lang:document.documentElement.lang,collage:document.querySelector('.collage-answer figcaption').textContent,question:document.querySelector('#drawer-content .faq>summary').textContent,answer:document.querySelector('#drawer-content .faq-answer').textContent}));
  assert.equal(deep.lang,'pt-BR');assert(deep.collage.includes('vida'));assert(!deep.question.includes('Where do I start'));results.push({mode,persistenceAndDeep:true,...deep});
  await page.keyboard.press('Escape');await page.focus('#language-trigger');await page.keyboard.press('Enter');await page.keyboard.press('Escape');
  assert(await page.$eval('#language-menu',e=>e.hidden));assert(await page.$eval('#language-trigger',e=>document.activeElement===e));
  await page.click('#language-trigger');await page.click('#topic-title');assert(await page.$eval('#language-menu',e=>e.hidden));
  await context.close();
 }
}finally{await browser.close();await writeFile('qa/2026-10-26-language-switching.json',JSON.stringify(results,null,2));}
console.log(`Passed ${results.length} language switching/persistence/deep-content cases, plus Escape and outside-click checks.`);
