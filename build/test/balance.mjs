// Balance test: the bot in bot.js plays whole maps; prints result and tower-damage sources per enemy.
// Usage: node balance.mjs mapId,mapId,... [easy|normal|hard] > out.txt && python3 summ.py out.txt
import {launch} from './cdp.mjs';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
const SP=fileURLToPath(new URL('.',import.meta.url));
const PAGE=new URL('../test.html',import.meta.url).href;

const ids=process.argv[2].split(',');const diff=process.argv[3]||'normal';
const b=await launch(PAGE);
await b.ev(fs.readFileSync(SP+'/bot.js','utf8'));await b.ev(fs.readFileSync(SP+'/instr.js','utf8'));
for(const id of ids){b.errors.length=0;
  const r=await b.ev(`(function(){try{window.__dmg={};SFX_MUTED=true;const r=BOT.play(MAP_BY_ID['${id}'].idx,'${diff}',6000);const tot=Object.values(__dmg).reduce((a,b)=>a+b,0);r.dmg=Object.entries(__dmg).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([k,v])=>k+':'+Math.round(v/tot*100)+'%').join(' ');r.totDmg=Math.round(tot);delete r.log;return r}catch(e){return{err:e.stack}}})()`);
  console.log(JSON.stringify(r),b.errors.slice(0,2));
}
await b.close();process.exit(0);
