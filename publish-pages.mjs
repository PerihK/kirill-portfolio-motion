import {execFileSync} from 'node:child_process';
const root=import.meta.dirname;
const run=(args,input)=>execFileSync('git',args,{cwd:root,encoding:'utf8',input,windowsHide:true,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'}}).trim();
if(run(['branch','--show-current'])!=='codex/commercial-portfolio-2026-10-17')throw new Error('Publish only the approved commercial source branch.');
if(run(['status','--porcelain','--untracked-files=no']))throw new Error('Commit tracked changes before publishing.');
if(run(['ls-files','--others','--exclude-standard','dist']))throw new Error('Commit all public export files before publishing.');
const source=run(['rev-parse','HEAD']);
const remoteSource=run(['ls-remote','--heads','origin','codex/commercial-portfolio-2026-10-17']).split(/\s+/)[0];
if(source!==remoteSource)throw new Error('Push the source commit before publishing.');
const tree=run(['rev-parse','HEAD:dist']);
const remote=run(['ls-remote','--heads','origin','gh-pages']);
let parent='';
if(remote){parent=remote.split(/\s+/)[0];run(['fetch','--no-tags','origin','refs/heads/gh-pages']);if(run(['rev-parse',parent+'^{tree}'])===tree){console.log('GitHub Pages export is already current.');process.exit(0);}}
const commit=run(['commit-tree',tree,...(parent?['-p',parent]:[])],`Publish GitHub Pages from ${source}\n`);
run(['push','--no-follow-tags','origin',commit+':refs/heads/gh-pages']);
console.log(JSON.stringify({sourceCommit:source,pagesCommit:commit,url:'https://perihk.github.io/kirill-portfolio-motion/'}));
