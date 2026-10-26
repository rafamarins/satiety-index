import sharp from 'sharp';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
await mkdir('assets/web',{recursive:true});
const report=[];
for(const name of await readdir('assets')){
 if(!name.endsWith('.png'))continue;
 const output=`assets/web/${name.replace('.png','.webp')}`;
 await sharp(`assets/${name}`).resize({width:1200,withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(output);
 report.push({file:output,bytes:(await stat(output)).size});
}
await writeFile('qa/images.json',JSON.stringify(report,null,2));console.log(report);
