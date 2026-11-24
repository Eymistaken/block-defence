/* ============================ ANA GÜNCELLEME & DÖNGÜ ============================ */
function update(dt){
  G.time+=dt;G.fatigue=0;
  updateWaves(dt);
  for(let i=0;i<G.enemies.length;i++){const e=G.enemies[i];if(e.alive)updateEnemy(e,dt)}
  for(let i=G.towers.length-1;i>=0;i--){const t=G.towers[i];if(t)updateTower(t,dt)}
  updateProjs(dt);updateGolems(dt);updateMining(dt);updateMechanics(dt);updateParts(dt);updateWeather(dt);
  for(let i=G.traps.length-1;i>=0;i--){const tr=G.traps[i];if(tr.type==='web'){tr.life-=dt;if(tr.life<=0||tr.dur<=0){removeTrap(tr);puff(tr.x,tr.y,'#ddd',5)}}}
  G.enemies=G.enemies.filter(e=>e.alive);
  for(const k in G.abil)if(G.abil[k]>0)G.abil[k]=Math.max(0,G.abil[k]-dt);
  const pr=G.tide===2?1.5:1;for(const k in G.pow)if(G.pow[k]>0)G.pow[k]=Math.max(0,G.pow[k]-dt*pr);
  if(G.appleT>0)G.appleT-=dt;
  G.tod=lerp(G.tod,G.todT,Math.min(1,dt*.6));
  G.shake=Math.max(0,G.shake-dt*30);G.flash=Math.max(0,G.flash-dt);G.hurtFx=Math.max(0,G.hurtFx-dt);
  if(!G.demo&&!G.over&&!G.endless&&G.wave>=G.totalWaves&&G.waves.length===0&&G.enemies.length===0)victory();
  if(G.demo)demoAI(dt);
}
/* Menü arkasındaki demo: rastgele kule kurar ve yükseltir */
function demoAI(dt){G.demoBuild=(G.demoBuild||0)-dt;if(G.demoBuild>0)return;G.demoBuild=1.2;
  if(G.towers.length>=14){const t=pick(G.towers);const D=TOWERS[t.type];if(t.lvl<3&&!D.eco&&D.lv.length>1){t.lvl++;recomputeBuffs()}return}
  const pool=['archer','archer','ice','tnt','fire','lightning','potion','ballista','piston'].concat((REALM_TOWERS[G.realm]||[]).filter(t=>!TOWERS[t].block));
  for(let tries=0;tries<30;tries++){const tx=randi(0,COLS-1),ty=randi(0,ROWS-1);let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const n=cell(tx+i,ty+j);if(n&&n.t==='path')near=true}
    const type=pick(pool);if(near&&canPlace(type,tx,ty)){buildTower(type,tx,ty);break}}}

let lastT=performance.now(),acc=0,uiT=0;const STEP=1/60;
function frame(now){
  const dt=Math.min(.1,(now-lastT)/1000);lastT=now;
  try{
    if(G&&!G.paused&&!(G.over&&!G.demo)){acc+=dt*G.speed;let n=0;while(acc>=STEP&&n<12){update(STEP);acc-=STEP;n++}if(n>=12)acc=0}
    else if(G&&G.over)updateParts(dt);
    if(G)render();
    uiT-=dt;if(uiT<=0&&G&&!G.demo){uiT=.15;updateHUD();updateHotbar();updateAbilUI();updateBeltUI();refreshPanel(false);updateWaveUI()}
  }catch(err){console.error(err)}
  requestAnimationFrame(frame);
}
/* ---------- açılış ---------- */
loadSave();buildTextures();setupStatic();updateXPUI();
if(SAVE.lastDim&&dimUnlocked(SAVE.lastDim))UI.dim=SAVE.lastDim;
startDemo();showScreen('scrMenu');
requestAnimationFrame(frame);
