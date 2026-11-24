// Smoke test: every map in creative mode, builds towers, uses all powers/items, jumps to the boss wave.
// Usage: node smoke.mjs [mapId,mapId,...]   (screenshots go to ./shots)
import {launch} from './cdp.mjs';
import {fileURLToPath} from 'node:url';
const SP=fileURLToPath(new URL('.',import.meta.url));
const PAGE=new URL('../test.html',import.meta.url).href;

const only=process.argv[2]?process.argv[2].split(','):null;
const b=await launch(PAGE);
const setup=`
window.__sim=function(sec){for(let i=0;i<sec*60;i++){if(G.over)break;update(1/60)}};
window.__build=function(n){const types=G.hotbar.filter(Boolean).concat(realmTowers());let placed=0;
  for(let tries=0;tries<4000&&placed<n;tries++){const tx=randi(0,COLS-1),ty=randi(0,ROWS-1);let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const c=cell(tx+i,ty+j);if(c&&c.t==='path')near=true}
    if(!near)continue;const type=pick(types);if(canPlace(type,tx,ty)){if(buildTower(type,tx,ty))placed++}}
  for(const t of G.towers){const D=TOWERS[t.type];if(D.lv.length>1&&Math.random()<.6){while(t.lvl<3)upgradeTower(t)}}
  const d=G.towers.find(t=>t.lvl===3);if(d)applyNetherite(d);return placed};
window.__validate=function(){const M=G.map,out=[];
  for(const [k,x,y] of (M.feats||[])){const c=cell(x,y);if(!c)out.push('feat off-map '+k+' '+x+','+y);else if(c.obs!==k)out.push('feat skipped '+k+' '+x+','+y+' t='+c.t)}
  for(const [t,x,y] of (M.gift||[])){const c=cell(x,y);if(!c||!c.tower)out.push('gift missing '+t+' '+x+','+y+' t='+(c&&c.t))}
  for(const P of M.paths){for(let i=0;i<P.length-1;i++){const[a,b2]=[P[i],P[i+1]];if(a[0]!==b2[0]&&a[1]!==b2[1])out.push('diagonal path '+a+'->'+b2)}}
  if(M.baseAt){const c=cell(Math.floor(M.baseAt[0]),Math.floor(M.baseAt[1]));if(!c)out.push('baseAt off-map')}
  const pe=G.paths[0].pts[G.paths[0].pts.length-1];if(M.baseAt){const dx=Math.abs(M.baseAt[0]*TILE-pe.x),dy=Math.abs(M.baseAt[1]*TILE-pe.y);if(dx>TILE*2.5||dy>TILE*2.5)out.push('baseAt far from path end '+M.baseAt+' pe='+(pe.x/TILE).toFixed(1)+','+(pe.y/TILE).toFixed(1))}
  let obsN=0,free=0;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.obs)obsN++;if(c.t==='ground'&&!c.obs&&!c.tower)free++}
  return {issues:out,obs:obsN,free}};
`;
await b.ev(setup);
const n=await b.ev('MAPS.length');
const res=[];
for(let i=0;i<n;i++){
  const id=await b.ev(`MAPS[${i}].id`);if(only&&!only.includes(id))continue;
  b.errors.length=0;
  const r=await b.ev(`(function(){try{
    startGame(${i},'creative',false);const v=__validate();
    const placed=__build(16);
    openInventory();renderInventory();closeInventory();
    startNextWave();__sim(6);startNextWave();__sim(8);
    /* yetenekler, güçler, eşyalar */
    const P=G.paths[0],mid=pathPos(P,P.len*.4);
    for(const A of ABIL){G.abil[A.id]=0;useAbility(A.id,mid.x,mid.y)}
    G.souls=500;for(const id of (REALM_POWERS[G.realm]||[])){G.pow[id]=0;usePower(id,mid.x,mid.y)}
    for(const id of ITEM_ORDER){giveItem(id,2);const I=ITEMS[id];if(I.use&&I.use!=='passive'&&id!=='netherite')useItem(id,mid.x,mid.y)}
    __sim(10);
    for(let k=0;k<3;k++){startNextWave();__sim(7)}
    const lost=G.stats.lost;
    /* boss dalgasına atla */
    G.wave=G.totalWaves-1;G.nextDef=genWave(G.wave+1);startNextWave();
    __sim(14);const bossSeen=!!G.boss||G.enemies.some(e=>e.def.boss);const bossType=G.boss&&G.boss.type;
    render();
    return {id:G.map.id,dim:G.dim,placed,towers:G.towers.length,lost:G.stats.lost,kills:G.stats.kills,enemies:G.enemies.length,bossSeen,bossType,wave:G.wave,lives:G.lives,...v};
  }catch(e){return {err:e.stack}}})()`);
  await b.shot('map_'+String(i).padStart(2,'0')+'_'+id);
  // keep simulating boss fight
  const r2=await b.ev(`(function(){try{__sim(40);render();return {bossAlive:!!(G.boss&&G.boss.alive),bossHp:G.boss?Math.round(G.boss.hp)+'/'+Math.round(G.boss.maxHp):null,over:G.over,won:!!G.won,kills:G.stats.kills,towers:G.towers.length,lost:G.stats.lost}}catch(e){return {err:e.stack}}})()`);
  await b.shot('map_'+String(i).padStart(2,'0')+'_'+id+'_b');
  res.push({i,r,r2,errors:[...new Set(b.errors)].slice(0,6)});
  console.log(JSON.stringify({i,r,r2,errors:[...new Set(b.errors)].slice(0,6)}));
}
await b.close();process.exit(0);
