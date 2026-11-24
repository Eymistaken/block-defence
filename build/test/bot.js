// Balance bot: plays a map at a given difficulty like a reasonable player.
window.BOT={
  setPerks(k){const ids=['sharp','haste','range','unbreak','mending','health','rich','loot','master','magic','luck','mining'];SAVE.perks={};
    let pts=Math.min(60,Math.round(k*1.4));let i=0;while(pts>0){const id=ids[i%ids.length];if((SAVE.perks[id]||0)<5){SAVE.perks[id]=(SAVE.perks[id]||0)+1;pts--}i++;if(i>500)break}},
  coverage(tx,ty,r){let n=0;const x=tx*TILE+24,y=ty*TILE+24,r2=(r*TILE)**2;for(const P of G.paths){if(P.lava)continue;for(let d=0;d<P.len;d+=24){const p=pathPos(P,d);if(d2(p.x,p.y,x,y)<=r2)n+=1+d/P.len}}return n},
  spots:null,
  computeSpots(){const out=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.t!=='ground'&&c.t!=='ice')continue;out.push({x,y,cov:this.coverage(x,y,3.2),cov2:this.coverage(x,y,1.6)})}this.spots=out},
  pickType(){const hb=G.hotbar.filter(t=>t&&unlockedTower(t));const dmg=G.towers.filter(t=>!TOWERS[t.type].support&&!TOWERS[t.type].eco&&!TOWERS[t.type].block&&!TOWERS[t.type].trap);
    const has=t=>G.towers.filter(x=>x.type===t).length;const n=dmg.length;
    if(hb.includes('mine')&&has('mine')<Math.min(3,1+Math.floor(G.wave/4))&&n>=2&&G.wave<16)return'mine';
    if(hb.includes('anvil')&&n>=5&&has('anvil')<Math.floor(n/5))return'anvil';
    if(hb.includes('beacon')&&((this.camo>.05&&n>=4&&has('beacon')<1+Math.floor(n/7))||(n>=8&&has('beacon')<Math.floor(n/8))))return'beacon';
    for(const sp of['eyepot','conduit','bell','anchor','calsensor','blubhut'])if(hb.includes(sp)&&n>=4&&has(sp)<1+Math.floor(n/9))return sp;
    const pref=['archer','ice','tnt','fire','lightning','ballista','potion','piston','resin','soulfire','shulker','chorus','echogolem'].filter(t=>hb.includes(t));
    let pool=pref.length?pref:hb.filter(t=>!TOWERS[t].eco&&!TOWERS[t].trap&&!TOWERS[t].block);
    if(this.fireImm>.3&&pool.length>2)pool=pool.filter(t=>TOWERS[t].dmgType!=='fire');
    const air=dmg.filter(t=>TOWERS[t.type].air).length;let pl=pool;
    if(this.fly>.08&&air<n*Math.min(.9,this.fly+.3)){const a=pool.filter(t=>TOWERS[t].air);if(a.length)pl=a}
    return pl[(n*7+G.wave)%pl.length]},
  bestSpot(type){const D=TOWERS[type];let best=null,bs=-Infinity;const r=D.support?2.2:(D.lv[0].range||1.6);
    for(const s of this.spots){if(!canPlace(type,s.x,s.y))continue;let sc;
      if(type==='mine')sc=-s.cov+Math.random();
      else if(D.support){sc=0;for(const t of G.towers){if(TOWERS[t.type].support||TOWERS[t.type].eco)continue;if(d2(t.tx,t.ty,s.x,s.y)<=r*r)sc+=1+t.lvl}sc+=s.cov*.05}
      else sc=r<2?s.cov2:s.cov;
      if(sc>bs){bs=sc;best=s}}return best},
  act(){if(G.over)return;
    // repair
    for(const t of G.towers){if(t.hp<t.maxHp*.45&&!TOWERS[t.type].trap){const c=repairCost(t);if(canAfford(c)&&G.money>c+20)repairTower(t)}}
    // netherite
    if(G.items.netherite>0){const t=G.towers.filter(t=>t.lvl===3&&!TOWERS[t.type].support&&!TOWERS[t.type].eco).sort((a,b)=>b.dmg-a.dmg)[0];if(t&&applyNetherite(t))G.items.netherite--}
    // craft
    for(let i=0;i<RECIPES.length;i++)if(canCraft(RECIPES[i]))craft(i);
    const dmgT=G.towers.filter(t=>!TOWERS[t.type].support&&!TOWERS[t.type].eco&&!TOWERS[t.type].block&&!TOWERS[t.type].trap);
    const want=3+G.wave*.55;
    for(let k=0;k<4;k++){
      if(dmgT.length<want||G.towers.length<4){const type=this.pickType();const c=towerCost(type,0);if(!canAfford(c))break;const s=this.bestSpot(type);if(!s)break;if(!buildTower(type,s.x,s.y))break;
        if(G.realm==='deep'&&canAfford(30)){for(const[i,j]of[[1,0],[-1,0],[0,1],[0,-1]]){if(canPlace('wool',s.x+i,s.y+j)&&G.hotbar.includes('wool')){buildTower('wool',s.x+i,s.y+j);break}}}
        continue}
      const up=G.towers.filter(t=>t.lvl<3&&TOWERS[t.type].lv.length>1&&!(TOWERS[t.type].eco&&G.wave>14)).sort((a,b)=>(a.lvl-b.lvl)||(towerCost(a.type,a.lvl+1)-towerCost(b.type,b.lvl+1)))[0];
      if(!up)break;const c=towerCost(up.type,up.lvl+1);if(!canAfford(c))break;upgradeTower(up)}
  },
  mine(){if(G.mining)return;let best=null,bs=-1;
    const bossHearts=G.boss&&G.boss.def.ab&&G.boss.def.ab.some(a=>a.k==='hearts');
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(!c.obs||!canMine(c))continue;const O=OBS[c.obs];let sc=O.reward/O.time;
      if(c.obs==='bheart'&&bossHearts)sc+=1000;if(c.obs==='cheart'&&G.tod>.5)sc+=500;if(c.obs==='ecrystal')sc+=800;if(c.obs==='generator')sc+=600;if(c.obs==='shrieker'||c.obs==='sensor')sc+=300;if(c.obs==='catalyst')sc+=200;
      if(sc>bs){bs=sc;best={x,y}}}
    if(best)startMining(best.x,best.y)},
  cluster(){let best=null,bn=0;for(const e of G.enemies){if(!e.alive||e.def.flying)continue;let n=0;for(const o of G.enemies)if(o.alive&&d2(o.x,o.y,e.x,e.y)<(1.6*TILE)**2)n++;if(e.def.boss)n+=4;if(n>bn){bn=n;best=e}}return best?{x:best.x,y:best.y,n:bn}:null},
  abil(){const alive=G.enemies.filter(e=>e.alive).length;if(!alive)return;const cl=this.cluster();
    const deep=G.enemies.some(e=>e.alive&&e.dist>e.path.len*.75);
    if(cl&&cl.n>=5&&G.abil.tnt<=0)useAbility('tnt',cl.x,cl.y);
    if((deep&&alive>=6||G.boss&&G.boss.alive&&G.boss.dist>G.boss.path.len*.6)&&G.abil.freeze<=0)useAbility('freeze');
    if((alive>=10||G.boss&&G.boss.alive)&&G.abil.golem<=0)useAbility('golem');
    const hurt=G.towers.filter(t=>t.hp<t.maxHp*.6).length;if((G.lives<G.maxLives||hurt>=3)&&G.abil.apple<=0)useAbility('apple');
    for(const id of Object.keys(G.pow)){if(G.pow[id]>0)continue;const P=POWERS[id];if(P.soul&&G.souls<P.soul)continue;
      if(id==='tidecall'&&G.tide===2)continue;if(id==='song'&&hurt<2&&alive<8)continue;if(id==='horn'&&G.warn<2&&!(G.boss&&G.boss.alive))continue;
      if(P.aim){if(cl&&cl.n>=3)usePower(id,cl.x,cl.y)}else if(alive>=6||G.boss&&G.boss.alive)usePower(id)}
    for(const id of SAVE.belt){if(!id||!(G.items[id]>0))continue;const I=ITEMS[id];if(I.use==='aim'&&cl&&cl.n>=4){if(id==='healpot'){const t=G.towers.find(t=>t.hp<t.maxHp*.5);if(t)useItem(id,t.x,t.y)}else useItem(id,cl.x,cl.y)}
      else if(I.use==='self'&&(alive>=10||G.boss&&G.boss.alive)&&id!=='compass')useItem(id);else if(id==='compass'&&G.lives<G.maxLives-4)useItem(id)}},
  play(mapIdx,diff,maxSec){
    this.setPerks(MAPS[mapIdx].idx);SAVE.done={};for(const m of MAPS)if(m.idx<mapIdx)SAVE.done[m.id]=true;SAVE.items={};SAVE.belt=[null,null,null,null];SAVE.tutorial=true;
    startGame(mapIdx,diff,false);G.paused=false;this.computeSpots();
    {const P=G.map.pool;let tot=0,f=0;for(const p of P){tot+=p[2];if(ENEMIES[p[0]].flying)f+=p[2]}let cm=0;for(const p of P)if(ENEMIES[p[0]].camo)cm+=p[2];this.camo=cm/tot;let fi=0;for(const p of P)if(ENEMIES[p[0]].fireImm)fi+=p[2];this.fireImm=fi/tot;this.fly=f/tot+(ENEMIES[G.map.boss].flying?.15:0)+(G.biome.dn==='std'?.08:0)}
    let t=0,actT=0,waveT=1.5;const dt=1/60;let minLives=G.lives;const log=[];
    while(!G.over&&t<maxSec){update(dt);t+=dt;actT-=dt;
      if(actT<=0){actT=.25;this.act();this.mine();this.abil()}
      if(G.waves.length===0&&G.enemies.length===0){waveT-=dt;if(waveT<=0){waveT=1.5;startNextWave();log.push([G.wave,G.lives,G.towers.length,G.stats.lost,Math.round(G.money)].join(':'))}}
      minLives=Math.min(minLives,G.lives)}
    return{id:G.map.id,won:!!G.won,over:G.over,wave:G.wave,total:G.totalWaves,lives:G.lives,maxLives:G.maxLives,towers:G.towers.length,lost:G.stats.lost,kills:G.stats.kills,leaked:G.stats.leaked,secs:Math.round(t),money:Math.round(G.money),boss:G.boss?Math.round(G.boss.hp)+'/'+Math.round(G.boss.maxHp):null,log:log.join(' ')}}
};
