import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

// Development-only renderer. The committed JPEG is copied directly by production builds.
// QA_MODULES_ROOT points to a folder containing Playwright's package.json or node_modules.
const require=createRequire(`${process.env.QA_MODULES_ROOT}/package.json`);
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.QA_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.goto(new URL('../concepts/social-card.html',import.meta.url).href);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0));
  const png=await page.screenshot();
  await sharp(png).jpeg({quality:90,mozjpeg:true}).toFile(fileURLToPath(new URL('../assets/social/home-veritas-v1.jpg',import.meta.url)));
}finally{await browser.close();}
