import { build } from 'esbuild';
import { mkdir, copyFile, readdir, writeFile, rm } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import { chapters, faqs } from './guide-content.js';
import { resources } from './resources.js';
const result=await build({entryPoints:['app.js'],bundle:true,splitting:true,format:'esm',outdir:'.',entryNames:'app.bundle',chunkNames:'assets/js/[name]-[hash]',minify:true,metafile:true,target:['es2022'],logLevel:'warning'});
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const p of ['index.html','styles.css','app.bundle.js','SOURCES.md'])await copyFile(p,`dist/${p}`);
async function copyDir(src,dest){await mkdir(dest,{recursive:true});for(const entry of await readdir(src,{withFileTypes:true})){if(entry.isDirectory())await copyDir(`${src}/${entry.name}`,`${dest}/${entry.name}`);else await copyFile(`${src}/${entry.name}`,`${dest}/${entry.name}`);}}
await copyDir('assets/fonts','dist/assets/fonts');
await mkdir('dist/assets/web',{recursive:true});
for(const file of await readdir('assets/web'))if(file.endsWith('.webp')&&file!=='first-home.webp')await copyFile(`assets/web/${file}`,`dist/assets/web/${file}`);
await mkdir('dist/assets/js',{recursive:true});
for(const file of Object.keys(result.metafile.outputs))if(file.startsWith('assets/js/'))await copyFile(file,`dist/${file}`);
await copyFile('assets/favicon.svg','dist/assets/favicon.svg');
await mkdir('dist/licenses',{recursive:true});
await copyFile('node_modules/three/LICENSE','dist/licenses/three.txt');
await writeFile('dist/licenses/gsap.txt','GSAP 3.15.0 — Standard no-charge license: https://gsap.com/standard-license\n');
const outputs=[];for(const p of Object.keys(result.metafile.outputs)){const b=await readFile(p);outputs.push({file:p,bytes:b.length,gzip:gzipSync(b).length});}
const report={chapters:chapters.length,faqs:faqs.length,resourceLinks:resources.length,outputs};await mkdir('qa',{recursive:true});await writeFile('qa/build.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
