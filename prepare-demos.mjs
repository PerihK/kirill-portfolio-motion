import {cp, mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
const base = import.meta.dirname;
const projects = {tiho:'tiho-climate/dist',stebel:'stebel-flowers/dist',lesno:'lesno-landscape/dist/client',yasno:'yasno-cleaning/dist',liniya:'liniya-beauty/dist',hvost:'hvost-grooming/dist',mile:'mile-english-usa/dist',plan:'plan-development/dist',nival:'nival-residences/dist'};
for(const [slug,source] of Object.entries(projects)) {
 const dest=resolve(base,'dist/demos',slug);await mkdir(dest,{recursive:true});await cp(resolve(base,'..',source),dest,{recursive:true});
 // The exported Lesno app uses absolute asset URLs; scope its assets to this demo.
 if(slug==='lesno') {
  async function scope(dir) {for(const e of await readdir(dir,{withFileTypes:true})) {const p=resolve(dir,e.name);if(e.isDirectory())await scope(p);else if(['.html','.js','.css','.rsc'].includes(extname(p))){let t=await readFile(p,'utf8');t=t.replaceAll('/assets/','/demos/lesno/assets/').replaceAll('/images/','/demos/lesno/images/').replaceAll('/_next/','/demos/lesno/_next/').replaceAll('"_next/','"demos/lesno/_next/').replaceAll('https://t.me/laimick','https://t.me/KiriwPerih').replaceAll('@laimick','@KiriwPerih');await writeFile(p,t);}}}await scope(dest);
 }
 const entry=resolve(dest,'index.html');let html=await readFile(entry,'utf8');
 if(slug==='nival')html=html.replace('content="/assets/photos-v2/hero-2400.webp"','content="/demos/nival/assets/photos-v2/hero-2400.webp"');
 html=html.replace('</head>','<meta name="robots" content="noindex,follow"></head>');
 const embedStyle='.embedded-preview{scroll-behavior:auto!important}.embedded-preview body>a[aria-label="Портфолио Кирилла · Закрыть демо"]{display:none!important}'+(slug==='yasno'?'.embedded-preview{scrollbar-width:none}.embedded-preview::-webkit-scrollbar{display:none}':'');
 html=html.replace('</head>','<script data-portfolio-embed>if(new URLSearchParams(location.search).has("embedded"))document.documentElement.classList.add("embedded-preview");</script><style>'+embedStyle+'</style></head>');
 const badge='<a href="../../?project='+slug+'" style="position:fixed;bottom:max(12px,env(safe-area-inset-bottom));right:12px;z-index:99999;display:flex;align-items:center;min-height:44px;background:#171918ed;color:#fff;padding:10px 15px;border:1px solid #ffffff40;border-radius:30px;font:12px Arial,sans-serif;text-decoration:none;box-shadow:0 2px 12px #0002" aria-label="Портфолио Кирилла · Закрыть демо">← Портфолио</a>';
 html=html.replace('</body>',badge+'</body>');await writeFile(entry,html);
 console.log('Prepared '+slug);
}


