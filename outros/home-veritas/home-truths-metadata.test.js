import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';

const html=await readFile(new URL('./home-truths.html',import.meta.url),'utf8');
const head=html.split('</head>')[0];
const metadata=name=>{
  const values=[...head.matchAll(/<meta (?:name|property)="([^"]+)" content="([^"]*)">/g)]
    .filter(([,key])=>key===name).map(([, ,value])=>value);
  assert.equal(values.length,1,`${name} must appear exactly once in the initial HTML`);
  return values[0];
};

test('social crawlers receive complete consistent metadata without running JavaScript',()=>{
  const title=[...head.matchAll(/<title>([^<]+)<\/title>/g)];
  assert.equal(title.length,1);
  assert.equal(metadata('og:title'),title[0][1]);
  assert.equal(metadata('twitter:title'),title[0][1]);
  assert.equal(metadata('og:description'),metadata('description'));
  assert.equal(metadata('twitter:description'),metadata('description'));
  const canonical=[...head.matchAll(/<link rel="canonical" href="([^"]+)">/g)];
  assert.equal(canonical.length,1);
  assert.equal(canonical[0][1],'https://rafael.co.nz/outros/home-veritas/');
  assert.equal(metadata('og:url'),canonical[0][1]);
  assert.equal(metadata('og:type'),'website');
  assert.equal(metadata('og:locale'),'en_NZ');
  assert.equal(metadata('twitter:card'),'summary_large_image');
  assert.doesNotMatch(metadata('robots'),/noindex|nofollow|none/);
});

test('both sharing cards point at the same real, correctly sized JPEG',async()=>{
  const imageURL=new URL(metadata('og:image'));
  assert.equal(imageURL.origin,'https://rafael.co.nz');
  assert.equal(metadata('twitter:image'),imageURL.href);
  assert.equal(metadata('twitter:image:alt'),metadata('og:image:alt'));
  assert(metadata('og:image:alt').length>20);
  const relative=imageURL.pathname.replace('/outros/home-veritas/','');
  const bytes=await readFile(new URL(relative,import.meta.url));
  const image=await sharp(bytes).metadata();
  assert.equal(image.format,'jpeg');
  assert.equal(metadata('og:image:type'),'image/jpeg');
  assert.equal(image.width,1200);
  assert.equal(image.height,630);
  assert.equal(Number(metadata('og:image:width')),image.width);
  assert.equal(Number(metadata('og:image:height')),image.height);
  assert(bytes.length<400*1024,'Sharing image must stay under 400 KiB');
});
