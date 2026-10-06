import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const base=resolve(import.meta.dirname,'..');
const families={
 'tiho-climate':'IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800',
 'plan-development':'Manrope:wght@400;500;600;700;800',
 'stebel-flowers':'Golos+Text:wght@400;500;600;700;800',
};
for(const [project,family]of Object.entries(families)){
 const root=resolve(base,project,'dist'),fonts=resolve(root,'fonts');await mkdir(fonts,{recursive:true});
 const response=await fetch('https://fonts.googleapis.com/css2?family='+family+'&display=swap',{headers:{'User-Agent':'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36'}});if(!response.ok)throw Error('Font stylesheet failed: '+project);
 let css=await response.text(),index=0;
 for(const url of [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))]){const r=await fetch(url);if(!r.ok)throw Error('Font asset failed: '+project);const name='font-'+index+++(url.endsWith('.woff2')?'.woff2':'.ttf');await writeFile(resolve(fonts,name),Buffer.from(await r.arrayBuffer()));css=css.replaceAll(url,'./'+name);}
 await writeFile(resolve(fonts,'fonts.css'),css);
 const entry=resolve(root,'index.html');let html=await readFile(entry,'utf8');html=html.replace(/<link[^>]+href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>/g,'<link rel="stylesheet" href="fonts/fonts.css">').replace(/<link[^>]+rel="preconnect"[^>]*>/g,'');await writeFile(entry,html);
 console.log(project+': '+index+' fonts bundled locally.');
}
