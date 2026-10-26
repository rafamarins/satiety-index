import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {topics} from '../home-truths-content.js';
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`);
const puppeteer=require('puppeteer-core');
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const report={date:new Date().toISOString(),automated:[],interactions:[],errors:[]};
const page=await browser.newPage();
page.on('pageerror',e=>report.errors.push(e.message));
const pause=()=>new Promise(r=>setTimeout(r,150));
async function ready(){await page.waitForSelector('#topic-title');await pause();}
async function audit(name){await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),overflow:document.documentElement.scrollWidth>innerWidth}});report.automated.push({name,...result});}
try{
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await page.goto('http://127.0.0.1:4185/#/');await ready();await audit('home/mobile');
 await page.click('#language-trigger');await audit('language-menu');await page.keyboard.press('Escape');await pause();
 for(const topic of topics){await page.goto(`http://127.0.0.1:4185/#/${topic.id}`);await ready();await page.evaluate(()=>document.querySelectorAll('.question-block').forEach(e=>e.open=true));await pause();await audit(`${topic.id}/all-short-answers`);}
 for(const lang of ['pt-BR','es','zh-Hans']){await page.goto(`http://127.0.0.1:4185/?lang=${lang}#/decide/life`);await ready();await audit(`life/${lang}`);}
 await page.goto('http://127.0.0.1:4185/?lang=en#/deposit/savings');await ready();
 await page.click('[data-details="deposit/savings"]');await page.waitForSelector('#drawer-content .faq');await page.evaluate(()=>document.querySelectorAll('#drawer-content details').forEach(e=>e.open=true));await pause();await audit('deep-faqs/open');await page.keyboard.press('Escape');await pause();
 report.interactions.push({name:'dialog escape restores opener',pass:await page.$eval('[data-details="deposit/savings"]',e=>document.activeElement===e)});
 await page.click('[data-calculator]');await pause();await audit('calculator');await page.keyboard.press('Escape');await pause();
 await page.click('#search-button');await page.waitForSelector('#guide-search');await page.type('#guide-search','curtains fridge');await pause();await audit('search');report.interactions.push({name:'novice curtains fridge search',pass:await page.$$eval('.faq',items=>items.some(e=>e.innerText.includes('What stays with the house')))});await page.keyboard.press('Escape');await pause();
 await page.click('#links-button');await page.waitForSelector('.source-list');await audit('sources');await page.keyboard.press('Escape');await pause();
 await page.setViewport({width:320,height:844,isMobile:true,hasTouch:true});await page.goto('http://127.0.0.1:4185/?lang=en#/decide/life');await ready();await audit('life/320');
 await page.setViewport({width:1440,height:1000});await audit('life/desktop');
 // Real keyboard activation: the previous answer stays open, keeping the next summary stable.
 await page.$eval('[data-question="decide/compare"]>summary',e=>{e.scrollIntoView({block:'center'});e.focus()});await pause();const y=await page.$eval('[data-question="decide/compare"]>summary',e=>e.getBoundingClientRect().y);
 await page.keyboard.press('Enter');await pause();report.interactions.push({name:'accordion keeps previous answer and position',pass:await page.evaluate(before=>document.querySelector('[data-question="decide/life"]').open&&document.querySelector('[data-question="decide/compare"]').open&&Math.abs(document.activeElement.getBoundingClientRect().y-before)<2,y)});
 report.interactions.push({name:'no accordion animations',pass:await page.evaluate(()=>[...document.querySelectorAll('.question-block,.question-content,.collage-answer')].every(e=>!e.getAnimations().length))});
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);report.interactions.push({name:'reduced motion has no active animations',pass:await page.evaluate(()=>document.getAnimations().length===0)});
 await page.setViewport({width:720,height:500});await audit('life/200-percent-equivalent');
 await page.screenshot({path:'qa/quality-2026-10-26/reading-layout.png',fullPage:true});
}finally{await mkdir('qa/quality-2026-10-26',{recursive:true});await writeFile('qa/quality-2026-10-26/accessibility.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({states:report.automated.length,violations:report.automated.filter(r=>r.violations.length||r.overflow),interactions:report.interactions,errors:report.errors},null,2));
assert(report.automated.every(r=>!r.violations.length&&!r.overflow),'Accessibility violations or overflow');assert(report.interactions.every(r=>r.pass),'Interaction regression');assert(!report.errors.length,'Browser errors');
