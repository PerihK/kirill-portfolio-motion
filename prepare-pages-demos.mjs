import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir,mkdtemp,symlink,cp,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=import.meta.dirname;
const base='/kirill-portfolio-motion/';
const sources={
  poryadok:{path:resolve(root,'../../работы/poryadok-demo'),commit:'b12fd9f0652897a9b20373f688b01f6b91ceea2f'},
  // The original standalone portfolio demo, before account/API functionality.
  flow:{path:resolve(root,'../../работы/flow-app'),commit:'bf0c135cc66a9e6cfbc8a5bdf0bff1025b38a6bd'}
};
async function replace(file,from,to){
  const text=await readFile(file,'utf8');
  if(!text.includes(from))throw new Error('Source mismatch: '+file+' / '+from);
  await writeFile(file,text.replaceAll(from,to));
}
async function prepare(id){
  const source=sources[id];
  const work=await mkdtemp(join(root,'qa-commercial','pages-'+id+'-'));
  const archive=execFileSync('git',['archive',source.commit,'src','public','index.html','vite.config.'+(id==='flow'?'ts':'js'),'package.json','package-lock.json',...(id==='flow'?['tsconfig.json','tests']:[])],{cwd:source.path,maxBuffer:30e6});
  const tar=join(work,'source.tar');await writeFile(tar,archive);
  execFileSync('tar',['-xf',tar,'-C',work],{windowsHide:true});
  await symlink(join(source.path,'node_modules'),join(work,'node_modules'),'junction');
  const siteBase=base+'demos/'+id+'/';
  if(id==='poryadok'){
    await writeFile(join(work,'src/pages-routing.js'),`const base=import.meta.env.BASE_URL;\nexport const pageUrl=(url)=>url.startsWith('/')&&!url.startsWith('//')?base+url.slice(1):url;\nexport const routePath=()=>{const path=location.pathname.startsWith(base)?'/'+location.pathname.slice(base.length):location.pathname;return path.replace(/\\/$/,'')||'/';};\n`);
    const main=join(work,'src/main.jsx'),site=join(work,'src/Site.jsx');
    await replace(main,'let navigate;','import {pageUrl,routePath} from "./pages-routing.js";\nlet navigate;');
    await replace(main,'href={href}','href={pageUrl(href)}');
    await replace(main,'location.pathname','routePath()');
    await replace(main,'history.pushState({}, "", url);','history.pushState({}, "", pageUrl(url));');
    await replace(main,'history.replaceState({}, "", "/admin");','history.replaceState({}, "", pageUrl("/admin"));');
    await replace(main,'src="/hero.webp"','src={import.meta.env.BASE_URL+"hero.webp"}');
    let siteCode=await readFile(site,'utf8');
    siteCode='import {pageUrl} from "./pages-routing.js";\n'+siteCode.replace(/href="(\/[^"\n]*)"/g,(_,url)=>'href={pageUrl('+JSON.stringify(url)+')}');
    siteCode=siteCode.replace('href={`/order?service=${service.id}`}','href={pageUrl(`/order?service=${service.id}`)}').replaceAll('src="/hero.webp"','src={import.meta.env.BASE_URL+"hero.webp"}');
    await writeFile(site,siteCode);
  }
  const vite=join(source.path,'node_modules/vite/bin/vite.js');await access(vite);
  execFileSync(process.execPath,[vite,'build','--base',siteBase],{cwd:work,stdio:'inherit',windowsHide:true});
  const output=join(work,'dist');
  if(id==='poryadok'){
    const index=await readFile(join(output,'index.html'));
    for(const route of ['order','admin']){await mkdir(join(output,route),{recursive:true});await writeFile(join(output,route,'index.html'),index);}
  }
  // Only Vite's public build goes into the public site, never source/env/server files.
  const destination=join(root,'dist','demos',id);
  await cp(output,destination,{recursive:true});
  console.log(JSON.stringify({demo:id,sourceCommit:source.commit,url:siteBase}));
}
await mkdir(join(root,'qa-commercial'),{recursive:true});
await Promise.all(Object.keys(sources).map(prepare));
