import {readdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const base='/kirill-portfolio-motion';
async function walk(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const file=resolve(dir,entry.name);
    if(entry.isDirectory())await walk(file);
    else if(['.html','.js','.css','.rsc','.json'].includes(extname(file))){
      const text=await readFile(file,'utf8');
      const scoped=text
        // Older exports accumulated repeated demo prefixes in Vite preload maps.
        .replace(/(?:demos\/lesno\/(?:kirill-portfolio-motion\/)?)+(?=_next\/)/g,'demos/lesno/')
        .replace(/(?<!kirill-portfolio-motion)\/demos\//g,base+'/demos/')
        // Vite adds the leading slash itself for preload-map entries.
        .replace(/(["'`])(?:kirill-portfolio-motion\/)?demos\/lesno\/(?=_next\/)/g,'$1kirill-portfolio-motion/demos/lesno/')
        .replaceAll('https://nival-residences.vercel.app/','https://perihk.github.io/kirill-portfolio-motion/demos/nival/');
      if(process.argv.includes('--check')&&scoped!==text)throw new Error('Unscoped demo paths: '+file);
      if(scoped!==text)await writeFile(file,scoped);
    }
  }
}
await walk(resolve(import.meta.dirname,'dist/demos'));
