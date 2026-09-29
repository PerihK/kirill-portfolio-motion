import {mkdir,writeFile} from 'node:fs/promises';
const root=new URL('./dist/fonts/',import.meta.url);await mkdir(root,{recursive:true});
const r=await fetch('https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&display=swap',{headers:{'User-Agent':'Mozilla/5.0'}});if(!r.ok)throw Error('Font CSS unavailable');
let css=await r.text();let i=0;
for(const url of [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))]) {const f=await fetch(url);if(!f.ok)throw Error('Font unavailable');const name='manrope-'+i+++(url.endsWith('.woff2')?'.woff2':'.ttf');await writeFile(new URL(name,root),Buffer.from(await f.arrayBuffer()));css=css.replaceAll(url,'./'+name);}
await writeFile(new URL('fonts.css',root),css);console.log('Saved '+i+' font files');
