import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../..');
await build({entryPoints:[path.join(dir,'comparison-src/compare.tsx')],outfile:path.join(dir,'comparison.bundle.js'),bundle:true,format:'esm',platform:'browser',jsx:'automatic',minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'comparison-imports',setup(b){
 b.onResolve({filter:/^next\/link$/},()=>({path:path.join(dir,'comparison-src/link.tsx')}));
 b.onResolve({filter:/^\.\/(Localized|ArrowIcon)$/},args=>({path:path.join(dir,'comparison-src/shared',args.path.slice(2)+'.tsx')}));
}}]});
const before=path.join(dir,'comparison-src/before/globals.css');
const result=await postcss([tailwind({base:root,optimize:true})]).process(await readFile(before,'utf8'),{from:before});
await writeFile(path.join(dir,'homepage-snapshot.css'),result.css);
await writeFile(path.join(dir,'project-folder.css'),await readFile(path.join(root,'app/project-folder.css')));
