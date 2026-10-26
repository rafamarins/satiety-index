import {faqs} from './guide-content.js';
import {resources} from './resources.js';
import {writeFile} from 'node:fs/promises';
const urls=[...new Set([...faqs.map(f=>f.url),...resources.map(r=>r.url)])];let index=0;const results=[];
async function worker(){while(index<urls.length){const url=urls[index++];try{const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(18000)});results.push({url,status:response.status,final:response.url});await response.body?.cancel();}catch(e){results.push({url,error:e.message});}}}
await Promise.all(Array.from({length:4},worker));await writeFile('qa/links.json',JSON.stringify(results,null,2));console.log(JSON.stringify({checked:results.length,ok:results.filter(r=>r.status>=200&&r.status<400).length,other:results.filter(r=>!r.status||r.status>=400)},null,2));
