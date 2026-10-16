import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';

// Decorative Unicode arrows/checks/stars can become color emoji on iOS.
// Check actual HTML, dynamic templates, CSS pseudo-elements and current React chunks.
const root=resolve(import.meta.dirname,'dist/demos');
const forbidden=/[\u2190-\u2199\u2713\u2714\u2733\u2734\u2b50]|\\u(?:219[0-9]|271[34]|273[34]|2b50)/iu;
let checked=0;
async function check(file){
 const text=await readFile(file,'utf8');
 assert(!forbidden.test(text),`Use inline SVG for decorative symbols: ${file}`);
 checked++;
}
for(const demo of await readdir(root,{withFileTypes:true})){
 if(!demo.isDirectory())continue;
 const dir=resolve(root,demo.name);
 for(const entry of await readdir(dir,{withFileTypes:true})){
  if(entry.isFile()&&/\.(html|js|css)$/.test(entry.name))await check(resolve(dir,entry.name));
 }
 if(demo.name==='lesno'){
  const manifest=JSON.parse(await readFile(resolve(dir,'.vite/manifest.json'),'utf8'));
  for(const [key,entry] of Object.entries(manifest)){
   if(key.startsWith('app/')||key.startsWith('_ui-arrow'))await check(resolve(dir,entry.file));
  }
 }
}
console.log(`OK: ${checked} active demo files use vector UI symbols.`);
