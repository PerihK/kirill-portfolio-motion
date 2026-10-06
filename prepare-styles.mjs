import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'dist');
const css=await Promise.all(['fonts/fonts.css','styles.css','typography.css','preview-motion.css','curation.css','polish.css'].map(f=>readFile(resolve(root,f),'utf8')));
// Font URLs were relative to fonts/fonts.css; the bundled file lives one level up.
css[0]=css[0].replaceAll('url(./','url(./fonts/').replaceAll("url('","url('fonts/").replaceAll('url("','url("fonts/');
await writeFile(resolve(root,'bundle.css'),css.join('\n').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' '));
console.log('Prepared one stylesheet, preserving source cascade.');
