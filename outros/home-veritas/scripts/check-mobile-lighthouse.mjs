import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const execute=promisify(execFile);
const directory=process.env.QA_REPORT_DIR||'qa/final-mobile-2026-10-26';
const root=process.env.QA_MODULES_ROOT;
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4185/';
const packageInfo=JSON.parse(await readFile(resolve(root,'lighthouse/package.json')));
const cli=resolve(root,'lighthouse',packageInfo.bin.lighthouse);
await mkdir(directory,{recursive:true});
const result={date:new Date().toISOString(),version:packageInfo.version,method:'Fresh headless Chrome per navigation; default mobile simulated throttling; sequential runs',runs:[]};
const views=process.env.QA_VIEWS?process.env.QA_VIEWS.split(',').map(pair=>pair.split(':')):[['home','#/'],['answer','#/decide/life']];
for(const language of (process.env.QA_LANGUAGES||'en,pt-BR,es,zh-Hans').split(',')){
 for(const [view,route] of views){
  const prefix=resolve(directory,`${language}-${view}`),url=`${base}?lang=${language}${route}`;
  await execute(process.execPath,[cli,url,'--chrome-flags=--headless=new','--only-categories=performance,accessibility,best-practices,seo','--output=json','--output=html',`--output-path=${prefix}`,'--quiet'],{maxBuffer:4*1024*1024});
  const report=JSON.parse(await readFile(`${prefix}.report.json`));
  const row={language,view,url,fetchTime:report.fetchTime,scores:Object.fromEntries(Object.entries(report.categories).map(([key,value])=>[key,Math.round(value.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift'].map(key=>[key,{value:report.audits[key].numericValue,display:report.audits[key].displayValue}])),warnings:report.runWarnings,report:`${language}-${view}.report.html`};
  result.runs.push(row);await writeFile(`${directory}/lighthouse-summary.json`,JSON.stringify(result,null,2));
  console.log(JSON.stringify({language,view,scores:row.scores,LCP:row.metrics['largest-contentful-paint'].display,CLS:row.metrics['cumulative-layout-shift'].display}));
 }
}
