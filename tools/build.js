// node tools/build.js  → מקמפל app.jsx ל-app.js (מכווץ). דורש: npm i esbuild
const fs=require('fs'),es=require('esbuild');
const src=fs.readFileSync('app.jsx','utf8');
const r=es.transformSync(src,{loader:'jsx',minify:true,target:'es2019'});
fs.writeFileSync('app.js',r.code);
console.log('app.js',r.code.length,'bytes');
