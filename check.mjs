import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const root=resolve(import.meta.dirname,'dist');
const pages=['index.html',...['tiho','stebel','lesno','yasno','liniya','hvost','mile','plan'].map(x=>`demos/${x}/index.html`)];
let count=0;const errors=[];
for(const page of pages){const html=await readFile(resolve(root,page),'utf8');for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){let url=match[1];if(/^(?:https?:|data:|mailto:|tel:|#|javascript:)/.test(url)||url.includes('\\'))continue;url=url.split(/[?#]/)[0];if(!url)continue;const p=url.startsWith('/')?resolve(root,'.'+url):resolve(dirname(resolve(root,page)),url);try{await stat(p);count++;}catch{errors.push(`${page}: ${url}`);}}}
const js=await readFile(resolve(root,'app.js'),'utf8');
for(const id of ['tiho','stebel','lesno','yasno','liniya','hvost','mile','plan']){if(!js.includes(`id:'${id}'`))errors.push('Missing project '+id);await stat(resolve(root,`images/${id}.webp`));}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`OK: 9 pages, 8 project previews, ${count} local asset/link targets.`);
