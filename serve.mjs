import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname, 'dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.json':'application/json'};
http.createServer(async(req,res)=>{
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = resolve(root, '.' + decodeURIComponent(url.pathname));
    if(file !== root && !file.startsWith(root + sep)){ res.writeHead(403);res.end();return; }
    if((await stat(file)).isDirectory()) {
      if(!url.pathname.endsWith('/')) {res.writeHead(302,{Location:url.pathname+'/'+url.search});res.end();return;}
      file = resolve(file, 'index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type': types[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Страница не найдена');}
}).listen(4188,'127.0.0.1',()=>console.log('Portfolio: http://127.0.0.1:4188'));

