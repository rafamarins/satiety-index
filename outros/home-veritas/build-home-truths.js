import { buildResponsiveImages } from './build-responsive-images.js';
import { build } from 'esbuild';
import { mkdir, copyFile, readdir, writeFile, rm, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { stages, topics } from './home-truths-content.js';
import { areas } from './home-truths-navigation.js';
import { chapters, faqs } from './guide-content.js';
await buildResponsiveImages();
const result = await build({entryPoints:['home-truths.js'],bundle:true,splitting:true,format:'esm',outdir:'.',entryNames:'home-truths.bundle',chunkNames:'assets/js/home-truths-[name]-[hash]',minify:true,metafile:true,target:['es2022'],logLevel:'warning'});
// Shared static imports are needed immediately; discover them from the HTML
// rather than waiting for the entry module to download and reveal the dependency.
const preloadImports=result.metafile.outputs['home-truths.bundle.js'].imports
  .filter(entry=>entry.kind==='import-statement'&&!entry.external)
  .map(entry=>`<link rel="modulepreload" href="${entry.path}">`).join('');
const outputNames=Object.keys(result.metafile.outputs);
const localeChunks=Object.fromEntries(['pt-BR','es','zh-Hans'].map(code=>[code,outputNames.find(name=>name.startsWith(`assets/js/home-truths-${code}-`))]));
const visualChunk=outputNames.find(name=>name.includes('home-truths-home-truths-answer-visuals-'));
// Only fetch the selected short-guide locale and topic artwork definitions early.
// This avoids serial entry → locale → visuals requests on direct topic links.
const routePreloads=`<script>(()=>{const locales=${JSON.stringify(localeChunks)},topics=${JSON.stringify(topics.map(topic=>topic.id))};let language='en';try{language=new URL(location.href).searchParams.get('lang')||localStorage.getItem('home-truths-language')||'en'}catch{}const files=[];if(locales[language])files.push(locales[language]);if(topics.includes(location.hash.replace(/^#\\/?/,'').split('/')[0]))files.push(${JSON.stringify(visualChunk)});for(const file of files){const link=document.createElement('link');link.rel='modulepreload';link.href=file;document.head.append(link)}})();</script>`;
await writeFile('index.html',(await readFile('home-truths.html','utf8')).replace('</head>',`${preloadImports}${routePreloads}</head>`));
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const p of ['index.html','home-truths.css','home-truths.bundle.js','SOURCES.md']) await copyFile(p,`dist/${p}`);
for(const dir of ['fonts','home-truths','js']) await mkdir(`dist/assets/${dir}`,{recursive:true});
for(const p of ['anton.woff2','Anton-OFL.txt','dm-sans.woff2','DM-Sans-OFL.txt']) await copyFile(`assets/fonts/${p}`,`dist/assets/fonts/${p}`);
const images=[];
for(const file of await readdir('assets/home-truths')){await copyFile(`assets/home-truths/${file}`,`dist/assets/home-truths/${file}`);images.push({file,bytes:(await stat(`assets/home-truths/${file}`)).size});}
for(const p of Object.keys(result.metafile.outputs))if(p.startsWith('assets/js/'))await copyFile(p,`dist/${p}`);
await copyFile('assets/favicon.svg','dist/assets/favicon.svg');
const outputs=[];for(const p of Object.keys(result.metafile.outputs)){const bytes=await readFile(p);outputs.push({file:p,bytes:bytes.length,gzip:gzipSync(bytes).length});}
const report={interestAreas:areas.length,stages:stages.length,topics:topics.length,cards:topics.reduce((n,t)=>n+t.cards.length,0),deepChapters:chapters.length,faqs:faqs.length,images,outputs};
await mkdir('qa',{recursive:true});await writeFile('qa/home-truths-build.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
