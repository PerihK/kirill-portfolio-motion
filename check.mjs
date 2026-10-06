import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const root=resolve(import.meta.dirname,'dist');
const ids=['lesno','tiho','nival','plan','stebel','yasno','liniya','mile','hvost'];
const pages=['index.html',...ids.map(x=>`demos/${x}/index.html`)];
let count=0;const errors=[];
for(const page of pages){const html=await readFile(resolve(root,page),'utf8');for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){let url=match[1];if(/^(?:https?:|data:|mailto:|tel:|#|javascript:)/.test(url)||url.includes('\\'))continue;url=url.split(/[?#]/)[0];if(!url)continue;const p=url.startsWith('/')?resolve(root,'.'+url):resolve(dirname(resolve(root,page)),url);try{await stat(p);count++;}catch{errors.push(`${page}: ${url}`);}}}
const js=await readFile(resolve(root,'app.js'),'utf8');
for(const id of ids){
 if(!js.includes(`id:'${id}'`))errors.push('Missing project '+id);
 for(const asset of [`images/${id}.webp`,`images/${id}-mobile.webp`,`images/covers/${id}.webp`,...['800','1400'].map(size=>`images/covers/${id}-optimized-${size}.webp`),...['hero','detail'].map(kind=>`images/project-screens/${id}-${kind}.webp`)])await stat(resolve(root,asset));
}
const css=await readFile(resolve(root,'bundle.css'),'utf8');
for(const [,raw] of css.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)){
 if(/^(?:data:|https?:|#)/.test(raw))continue;
 try{await stat(resolve(root,raw.split(/[?#]/)[0]));count++;}catch{errors.push('bundle.css: '+raw);}
}
for(const id of ['lesno','tiho','nival','plan']){
 const html=await readFile(resolve(root,`demos/${id}/index.html`),'utf8');
 if(/в реальном сервисе|здесь было бы/i.test(html))errors.push('Placeholder product copy: '+id);
}
if(js.includes('cover-interface'))errors.push('Interface inset remains on covers');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`OK: ${pages.length} pages, ${ids.length} project previews, ${count} local asset/link targets.`);
