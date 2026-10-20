import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname,relative} from 'node:path';
const root=resolve(import.meta.dirname,'dist');
const base='/kirill-portfolio-motion/';
const origin='https://perihk.github.io';
let files=0,bytes=0,links=0;
async function walk(folder){
  for(const item of await readdir(folder,{withFileTypes:true})){
    const path=resolve(folder,item.name);
    if(item.isDirectory()){assert.ok(!['.git','node_modules','src','server'].includes(item.name));await walk(path);continue;}
    assert.ok(!/^\.env|\.map$/.test(item.name),'No environment files or source maps in the public export');
    files++;bytes+=(await stat(path)).size;
    const extension=extname(path);if(!['.html','.css','.js'].includes(extension))continue;
    const text=await readFile(path,'utf8');
    assert.ok(!/https?:\/\/[^\s"'<>]*\.vercel\.app/.test(text),'Vercel dependency remains: '+relative(root,path));
    if(extension==='.js'){
      const preload=text.match(/m\.f=\[(.*?)\]/);
      if(preload)for(const dep of JSON.parse('['+preload[1]+']')){
        if(!dep.includes('demos/lesno/'))continue;
        assert.ok(dep.startsWith('kirill-portfolio-motion/demos/lesno/'),'Unscoped Vite preload map: '+dep);
        await stat(resolve(root,dep.slice('kirill-portfolio-motion/'.length)));
      }
    }
    const refs=extension==='.html'?[...text.matchAll(/(?:src|href)=["']([^"']+)["']/g)]:extension==='.css'?[...text.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)]:[];
    for(const [,ref] of refs){
      if(/^(?:data:|mailto:|tel:|#|javascript:)/.test(ref))continue;
      const current=new URL(base+relative(root,path).replaceAll('\\','/'),origin);
      const url=new URL(ref,current);if(url.origin!==origin)continue;
      assert.ok(url.pathname.startsWith(base),'Link escapes the Pages project: '+ref);
      let target=resolve(root,decodeURIComponent(url.pathname.slice(base.length)));
      if(url.pathname.endsWith('/'))target=resolve(target,'index.html');
      await stat(target);links++;
    }
  }
}
await walk(root);
await stat(resolve(root,'.nojekyll'));
const home=await readFile(resolve(root,'index.html'),'utf8');
assert.ok(home.includes('rel="canonical" href="'+origin+base+'"'));
const exported=await readFile(resolve(root,'demos/poryadok/index.html'),'utf8');
for(const route of ['order','admin'])assert.equal(await readFile(resolve(root,'demos/poryadok',route,'index.html'),'utf8'),exported,'Direct route needs an actual Pages entry point');
assert.ok(bytes<1024**3,'Pages export exceeds 1GB');
console.log(`OK: GitHub Pages prefix, ${files} public files, ${links} local HTML/CSS links, direct CRM routes; no Vercel URLs. ${(bytes/1024**2).toFixed(1)} MiB.`);
