import {cp, mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
const base = import.meta.dirname;
const projects = {tiho:'tiho-climate/dist',stebel:'stebel-flowers/dist',lesno:'lesno-landscape/dist/client',yasno:'yasno-cleaning/dist',liniya:'liniya-beauty/dist',hvost:'hvost-grooming/dist',mile:'mile-english-usa/dist',plan:'plan-development/dist'};
for(const [slug,source] of Object.entries(projects)) {
 const dest=resolve(base,'dist/demos',slug);await mkdir(dest,{recursive:true});await cp(resolve(base,'..',source),dest,{recursive:true});
 // The exported Lesno app uses absolute asset URLs; scope its assets to this demo.
 if(slug==='lesno') {
  async function scope(dir) {for(const e of await readdir(dir,{withFileTypes:true})) {const p=resolve(dir,e.name);if(e.isDirectory())await scope(p);else if(['.html','.js','.css'].includes(extname(p))){let t=await readFile(p,'utf8');t=t.replaceAll('/assets/','/demos/lesno/assets/').replaceAll('/images/','/demos/lesno/images/').replaceAll('/_next/','/demos/lesno/_next/').replaceAll('https://t.me/laimick','https://t.me/kiriw8');await writeFile(p,t);}}}await scope(dest);
 }
 const entry=resolve(dest,'index.html');let html=await readFile(entry,'utf8');
 html=html.replace('</head>','<meta name="robots" content="noindex,follow"></head>');
 const embedStyle='.embedded-preview body>a[aria-label="Вернуться к портфолио Кирилла Перих"]{display:none}'+(slug==='yasno'?'.embedded-preview{scrollbar-width:none}.embedded-preview::-webkit-scrollbar{display:none}':'');
 html=html.replace('</head>','<script data-portfolio-embed>if(new URLSearchParams(location.search).has("embedded"))document.documentElement.classList.add("embedded-preview");</script><style>'+embedStyle+'</style></head>');
 const badge='<a href="../../?project='+slug+'" style="position:fixed;bottom:16px;right:16px;z-index:99999;background:#171918;color:#fff;padding:12px 16px;border-radius:2px;font:13px Arial,sans-serif;text-decoration:none;box-shadow:0 2px 12px #0003" aria-label="Вернуться к портфолио Кирилла Перих">Портфолио Кирилла · Закрыть демо</a>';
 html=html.replace('</body>',badge+'</body>');await writeFile(entry,html);
 console.log('Prepared '+slug);
}


