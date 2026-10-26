import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {dirname} from 'node:path';
import {topics,stages} from '../home-truths-content.js';
import {areas} from '../home-truths-navigation.js';
import {chapters} from '../guide-content.js';
import {resources} from '../resources.js';
import {localizedContent,translate,languages} from '../home-truths-i18n.js';
import {localizedReference} from '../home-truths-reference.js';
import {agentsSalesSearchCases} from '../qa/agents-sales-cases.js';
import {journeySearchCases} from '../qa/multilingual-journey-cases.js';
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`),puppeteer=require('puppeteer-core');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4185/';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const output=process.env.QA_OUTPUT||'qa/2026-10-26-multilingual-journey.json';
await mkdir(dirname(output),{recursive:true});
const codes=(process.env.QA_LANGUAGES||'pt-BR,es,zh-Hans').split(',');
const mobileOnly=process.env.QA_MOBILE_ONLY==='1';
const report={date:new Date().toISOString(),base,accessibility:[],kind:'Automated functional coverage; separate agent language/persona review',languages:[],failures:[],errors:[]};
const normal=s=>s.replace(/\s/g,'');
const english=topics.flatMap(t=>[t.headline,t.intro,...t.cards.flatMap(c=>[c.title,c.body,c.gotcha,...c.checks])]).concat(chapters.flatMap(c=>c.details.flatMap(f=>[f.question,f.answer]))).filter(s=>s.length>35);
async function inspect(page,label){
 const visible=await page.evaluate(()=>document.body.innerText);
 const leaks=label.startsWith('en/')?[]:english.filter(text=>visible.includes(text));
 assert(!leaks.length,`${label}: English copy ${leaks[0]}`);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label}: overflow`);
 if(process.env.QA_AXE==='1'){
  if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}});
  report.accessibility.push({label,...result});assert(!result.violations.length,`${label}: accessibility ${result.violations.map(v=>v.id)}`);
 }
}
async function close(page){await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#drawer').open);}
async function settle(page){await page.waitForFunction(()=>!!document.querySelector('#topic-title')&&!document.querySelector('#language-trigger').disabled);}
try{
 for(const code of codes){
  const context=await browser.createBrowserContext(),page=await context.newPage();page.on('pageerror',e=>report.errors.push({code,error:e.message}));
  await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  const core=code==='en'?null:JSON.parse(await readFile(`locales/${code}.json`)),deep=code==='en'?null:JSON.parse(await readFile(`locales/deep-${code}.json`));
  const local=localizedContent(topics,areas,core),guide=localizedReference({chapters},{resources},deep);
  const result={code,areas:0,topics:0,shortAnswers:0,deepAnswers:[],search:[],calculators:0,otherStates:[]};report.languages.push(result);
  await page.goto(base+'?lang=en#/');await settle(page);
  await page.tap('#language-trigger');await page.tap(`[data-language="${code}"]`);await page.waitForFunction(html=>document.documentElement.lang===html&&!document.querySelector('#language-trigger').disabled,{},languages.find(l=>l.code===code).html);
  await inspect(page,`${code}/home`);
  await page.tap('#language-trigger');await inspect(page,`${code}/language-menu`);await page.keyboard.press('Escape');
  // Every interest area is entered through its visible home tile.
  for(const area of local.areas){
   await page.click('#topics-button');await page.waitForFunction(heading=>location.hash==='#/'&&document.querySelector('#topic-title')?.textContent===heading,{},translate(code,'What’s on your mind?'));await page.waitForSelector('.interest-grid');
   const href=area.topics.length===1?`#/${area.topics[0]}`:`#/explore/${area.id}`;
   await page.click(`.interest-block[href="${href}"]`);await page.waitForFunction((hash,title)=>location.hash===hash&&document.querySelector('#topic-title')?.textContent.replace(/\s/g,'')===title.replace(/\s/g,''),{},href,area.topics.length===1?local.topics.find(t=>t.id===area.topics[0]).headline:area.title);await settle(page);await inspect(page,`${code}/area/${area.id}`);result.areas++;
  }
  const seen=new Set();
  for(const topic of local.topics){
   await page.goto(`${base}?lang=${code}#/${topic.id}`);await settle(page);await page.waitForSelector(`[data-question="${topic.id}/${topic.cards[0].id}"]`);
   assert.equal(normal(await page.$eval('#topic-title',e=>e.textContent)),normal(topic.headline));
   for(const card of topic.cards){
    const selector=`[data-question="${topic.id}/${card.id}"]`;
    await page.click(`${selector}>summary`);await page.waitForSelector(`${selector}[open]`);
    await page.$eval(`${selector} .full-explanation`,e=>e.open=true).catch(()=>{});
    const text=normal(await page.$eval(selector,e=>e.innerText));
    for(const expected of [card.title,card.body,card.gotcha,...card.checks])assert(text.includes(normal(expected)),`${code}/${topic.id}/${card.id}: missing ${expected}`);
    result.shortAnswers++;
   }
   await inspect(page,`${code}/${topic.id}/short`);
   await page.click('[data-topic-faq]');await page.waitForFunction(()=>document.querySelector('#drawer-content .faq'));
   await page.evaluate(()=>document.querySelectorAll('#drawer-content details').forEach(e=>e.open=true));
   const rendered=await page.$$eval('#drawer-content .faq',items=>items.map(e=>({question:e.querySelector('summary').textContent,answer:[...e.querySelectorAll('.answer-blocks p')].map(e=>e.textContent).join(''),url:e.querySelector('.source-link')?.href,full:!!e.querySelector('.full-explanation')})));
   const expected=guide.faqs.filter(f=>topic.chapterIds.includes(f.chapter));assert.equal(rendered.length,expected.length);
   for(const faq of expected){const actual=rendered.find(f=>f.question===faq.question);assert(actual,`${code}: missing FAQ ${faq.question}`);assert.equal(normal(actual.answer),normal(faq.answer));assert.equal(actual.url,faq.url);seen.add(faq.key);}
   await inspect(page,`${code}/${topic.id}/deep`);await close(page);
   await page.click('.topic-sources');await page.waitForSelector('#drawer-content .source-list');await inspect(page,`${code}/${topic.id}/sources`);
   const sourceText=await page.$eval('#drawer-content',e=>e.innerText);for(const link of topic.sourceLinks)assert(sourceText.includes(link.label));await close(page);
   if(['deposit','mortgage','budget'].includes(topic.id)){
    await page.click('[data-calculator]');await page.waitForSelector('#calc-result');await inspect(page,`${code}/${topic.id}/calculator`);
    const previous=await page.$eval('#calc-result',e=>e.innerText);await page.focus('.calc-grid input');await page.keyboard.press('ArrowRight');const next=await page.$eval('#calc-result',e=>e.innerText);assert.notEqual(previous,next);await close(page);result.calculators++;
   }
   result.topics++;
  }
  assert.equal(seen.size,guide.faqs.length);result.deepAnswers=[...seen];
  await page.click('#search-button');await page.waitForSelector('#guide-search');
  const originalCases=journeySearchCases[code]||['preapproval','two deposits','curtains fridge','LIM inspection','renovation consent','flood insurance','settlement delayed'].map((query,i)=>[query,journeySearchCases['es'][i][1]]);
  const searchCases=[...originalCases,...agentsSalesSearchCases[code]];
  for(const [query,englishQuestion] of searchCases){
   const wanted=guide.faqs.find(f=>f.searchQuestion===englishQuestion);
   await page.$eval('#guide-search',e=>{e.value='';e.dispatchEvent(new Event('input',{bubbles:true}))});await page.type('#guide-search',query);
   await page.waitForFunction(question=>[...document.querySelectorAll('#search-results .faq>summary')].some(e=>e.textContent===question),{timeout:4000},wanted.question);
   const faq=await page.$$('#search-results .faq');for(const item of faq){if(await item.$eval('summary',e=>e.textContent)===wanted.question){await item.$eval('summary',e=>e.click());await item.$$eval('.full-explanation',es=>es.forEach(e=>e.open=true));const text=normal(await item.evaluate(e=>e.innerText));assert(text.includes(normal(wanted.answer)));break;}}
   await inspect(page,`${code}/search/${query}`);result.search.push({query,question:wanted.question,pass:true});
  }
  await page.$eval('#guide-search',e=>{e.value='zzznomatch987';e.dispatchEvent(new Event('input',{bubbles:true}))});assert((await page.$eval('#search-results',e=>e.innerText)).includes(translate(code,'No match yet.')));result.otherStates.push('translated no-results');
  await close(page);await page.click('#about-button');await page.waitForSelector('#drawer-content .detail-section');await inspect(page,`${code}/about`);assert((await page.$eval('#drawer-content',e=>e.innerText)).includes(translate(code,'Keep your own advisers close.')));await close(page);
  await page.reload();await settle(page);assert.equal(await page.$eval('html',e=>e.lang),languages.find(l=>l.code===code).html);result.otherStates.push('preference retained on reload');
  await page.setViewport({width:320,height:844,isMobile:true,hasTouch:true});await inspect(page,`${code}/320`);
  await page.screenshot({path:`${dirname(output)}/journey-${code}-320.png`,fullPage:true});
  await page.setViewport(mobileOnly?{width:844,height:390,isMobile:true,hasTouch:true}:{width:1440,height:1000});await inspect(page,`${code}/${mobileOnly?'landscape':'desktop'}`);
  await page.screenshot({path:`${dirname(output)}/journey-${code}-${mobileOnly?'landscape':'desktop'}.png`,fullPage:true});
  // Fail the optional deep chunk in a clean context: the fallback must stay localized.
  const failContext=await browser.createBrowserContext(),fail=await failContext.newPage();await fail.setRequestInterception(true);fail.on('request',r=>/home-truths-(?:deep-|guide-content)/.test(r.url())?r.abort():r.continue());
  await fail.goto(`${base}?lang=${code}#/team/prepare`);await settle(fail);await fail.click('[data-topic-faq]');await fail.waitForFunction(text=>document.querySelector('#drawer-content').innerText.includes(text),{},translate(code,'The detailed guide could not load. Close this panel and try again, or open the official guide below.'));result.otherStates.push('translated deep-load failure');await failContext.close();
  await context.close();
 }
}catch(error){report.failures.push(error.message);throw error;}finally{await writeFile(output,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({languages:report.languages.map(r=>({code:r.code,areas:r.areas,topics:r.topics,short:r.shortAnswers,deep:r.deepAnswers.length,search:r.search.length,calculators:r.calculators,other:r.otherStates})),accessibilityStates:report.accessibility.length,errors:report.errors,failures:report.failures},null,2));assert.equal(report.errors.length,0);
