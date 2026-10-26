import { createServer } from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = await realpath(resolve(process.env.SERVE_ROOT || '.'));
const port = Number(process.env.PORT || 4185);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const compressed = new Map();
createServer(async (request,response) => {
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405,{Allow:'GET, HEAD'});response.end();return; }
  try {
    const path = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let file = resolve(root,`.${path}`);
    if (file !== root && !file.startsWith(root+sep)) throw new Error('outside root');
    if ((await stat(file)).isDirectory()) file=resolve(file,'index.html');
    file=await realpath(file);
    if (!file.startsWith(root+sep)) throw new Error('outside root');
    const info=await stat(file), extension=extname(file);
    const gzip=/\bgzip\b/.test(request.headers['accept-encoding']||'')&&['.html','.css','.js','.json','.svg','.txt','.md'].includes(extension);
    const etag=`"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}${gzip?'-gz':''}"`;
    const headers={'Content-Type':types[extension]||'application/octet-stream','Cache-Control':'no-cache','ETag':etag,'Vary':'Accept-Encoding','X-Content-Type-Options':'nosniff'};
    if(request.headers['if-none-match']===etag){response.writeHead(304,headers);response.end();return;}
    let bytes;
    if(gzip){
      const cached=compressed.get(file);
      bytes=cached?.etag===etag?cached.bytes:gzipSync(await readFile(file));
      if(compressed.size>100)compressed.clear();
      compressed.set(file,{etag,bytes});headers['Content-Encoding']='gzip';
    }else bytes=await readFile(file);
    response.writeHead(200,{...headers,'Content-Length':bytes.length});
    response.end(request.method==='HEAD'?undefined:bytes);
  }catch{response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Home Veritas: http://127.0.0.1:${port}/`));
