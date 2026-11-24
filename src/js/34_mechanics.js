/* ============================ HARİTA MEKANİKLERİ ============================ */
function updateMechanics(dt){
  const M=G.map,mech=M.mech||{};
  if(G.darkT>0){G.darkT-=dt;if(G.darkT<=0)G.darkAmt=0}
  G.darkPulse=Math.max(0,G.darkPulse-dt);
  for(const k of['deafT','gazeT','revealT','eyeT','lullT','sandT'])if(G[k]>0)G[k]-=dt;
  /* Sift gelgiti: Gelgit Çağrısı süresi bitince dalganın gelgitine dön */
  if(G.tideOverT>0){G.tideOverT-=dt;if(G.tideOverT<=0&&G.waves.length){const w=G.waves[G.waves.length-1];if(w.tide!=null&&w.tide!==G.tide){G.tide=w.tide;banner('GELGİT: '+TIDES[G.tide].name.toUpperCase());sfx('tide')}}}
  /* Sift: bereket gelgitinde ruhlar kendiliğinden toplanır */
  if(G.realm==='sift'&&G.tide===2&&G.waves.length){G.soulTick=(G.soulTick||0)+dt;if(G.soulTick>2){G.soulTick=0;G.souls=Math.min(999,G.souls+1)}}
  /* Çöl: kum fırtınası */
  if(mech.sandstorm&&G.waves.length){G.sandCd-=dt;if(G.sandCd<=0){G.sandCd=rand(30,45);G.sandT=10;banner('KUM FIRTINASI','<small>Kulelerin menzili 10 sn boyunca %15 düşük</small>')}}
  /* Ova: fırtınada yıldırım Creeper'ları elektrikler */
  if(mech.lightning&&G.rain){G.boltT=(G.boltT||rand(6,12))-dt;if(G.boltT<=0){G.boltT=rand(8,14);const cr=G.enemies.filter(e=>e.alive&&e.def.creeper&&!e.charged);const e=cr.length?pick(cr):null;
    const x=e?e.x:rand(40,W-40),y=e?e.y:rand(40,H-40);G.bolts.push({pts:jag([{x:x+rand(-30,30),y:-10},{x,y}]),t:.3});G.flash=.3;G.flashCol='255,255,255';sfx('thunder');
    if(e){e.charged=true;e.hp=Math.min(e.maxHp*1.5,e.hp+20);floatText(e.x,e.y-30,'ELEKTRİKLİ!','#8ad8ff',15)}}}
  /* End Kükürt Kaynakları: bacalar */
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(!c.obs)continue;
    if(c.obs==='vent'){c.vT=(c.vT==null?rand(3,8):c.vT)-dt;if(c.vT<=0){c.vT=rand(7,10);const cx=x*TILE+24,cy=y*TILE+24;for(const e of G.enemies)if(e.alive&&!e.def.flying&&d2(e.x,e.y,cx,cy)<(1.6*TILE)**2)damage(e,(40+G.wave*6),'magic',null);
      for(let k=0;k<22;k++)addP({x:cx+rand(-6,6),y:cy-10,vx:rand(-30,30),vy:rand(-220,-120),life:1,max:1,sz:rand(3,6),c:pick(['#e8f080','#f8ffd0','#c8d860']),g:120,smoke:true});sfx('hiss');ring(cx,cy,1.6*TILE,'230,240,120')}}
    else if(c.obs==='generator'&&G.storm&&G.waves.length){c.gT=(c.gT==null?3:c.gT)-dt;if(c.gT<=0){c.gT=6;const cx=x*TILE+24,cy=y*TILE+24;let bi=0,bd=Infinity,bdist=0;G.walk.forEach(i=>{const r=nearestDist(G.paths[i],cx,cy);if(r.dd<bd){bd=r.dd;bi=i;bdist=r.d}});
      const w=G.waves[G.waves.length-1];const en=spawnEnemy(pick(['seedling','nester','sentinel','stalker']),bi,w,bdist);if(en){G.beams.push({x1:cx,y1:cy-20,x2:en.x,y2:en.y-10,t:.6,max:.6,col:'255,90,90'});sfx('rift')}}}
    else if(c.obs==='nest'&&G.waves.length){c.nT=(c.nT==null?rand(12,20):c.nT)-dt;if(c.nT<=0){c.nT=rand(16,24);const cx=x*TILE+24,cy=y*TILE+24;let bi=0,bd=Infinity,bdist=0;G.walk.forEach(i=>{const r=nearestDist(G.paths[i],cx,cy);if(r.dd<bd){bd=r.dd;bi=i;bdist=r.d}});
      const en=spawnEnemy('stalker',bi,G.waves[G.waves.length-1],bdist);if(en){puff(cx,cy,'#2a2040',10);floatText(cx,cy-20,'Yuvadan İz Sürücü!','#c8a8ff',13)}}}}
  updateBlubs(dt);
}
/* Sift ambiyansı: Blub'lar otlar arasında zıplar */
function updateBlubs(dt){
  for(const b of G.blubs){b.t+=dt;b.petCd-=dt;if(b.moving){const dx=b.tx-b.x,dy=b.ty-b.y,dl=Math.hypot(dx,dy);if(dl<2){b.moving=false;b.wait=rand(2,5)}else{b.x+=dx/dl*28*dt;b.y+=dy/dl*28*dt;b.dir=dx>0?1:-1}}
    else{b.wait-=dt;if(b.wait<=0){const tx=Math.floor(b.x/TILE)+randi(-1,1),ty=Math.floor(b.y/TILE)+randi(-1,1),c=cell(tx,ty);if(c&&c.t==='ground'&&!c.obs&&!c.tower){b.tx=tx*TILE+rand(14,34);b.ty=ty*TILE+rand(20,38);b.moving=true}else b.wait=1}}}
  for(let i=G.blubBlocks.length-1;i>=0;i--){const b=G.blubBlocks[i];b.t+=dt;
    if(!b.land){const f=Math.min(1,b.t/.6);b.cx=lerp(b.x,b.tx,f);b.cy=lerp(b.y,b.ty,f)-Math.sin(f*Math.PI)*30;if(f>=1){b.land=true;dust(b.tx,b.ty+6,'#9ad8f0',5)}}
    else{b.life-=dt;b.cx=b.tx;b.cy=b.ty;if(b.life<=0){G.blubBlocks.splice(i,1);puff(b.tx,b.ty,'#9ad8f0',6)}}}
}
function petBlub(x,y){for(const b of G.blubs){if(d2(b.x,b.y-6,x,y)<16*16){sfx('squeak');b.moving=false;b.wait=2;sparkle(b.x,b.y-14,'#ff9ad8',6);
  if(b.petCd<=0){b.petCd=15;addSouls(3,b.x,b.y);SAVE.blubs=(SAVE.blubs||0)+1;if(SAVE.blubs>=25)unlockAch('blub')}return true}}return false}
function addSouls(n,x,y){n=Math.round(n);if(n<=0)return;G.souls=Math.min(999,G.souls+n);if(x!=null){for(let i=0;i<Math.min(4,n);i++)G.orbs.push({x,y,vx:rand(-60,60),vy:rand(-120,-40),t:0,soul:true})}}
/* ============================ MADENCİLİK ============================ */
function canMine(c){if(!c||!c.obs)return false;if(c.obs==='bheart'&&!(G.boss&&G.boss.def.ab&&G.boss.def.ab.some(a=>a.k==='hearts'))){return false}return true}
function startMining(tx,ty){const c=cell(tx,ty);if(!c||!c.obs)return;
  if(!canMine(c)){sfx('error');floatText(tx*TILE+24,ty*TILE,'Kalp uykuda — Kadim Gıcırtı gelince kazılabilir','#ffb060',14);return}
  if(G.mining&&G.mining.tx===tx&&G.mining.ty===ty)return;
  const O=OBS[c.obs];let tm=O.time*(1-perk('mining')*.12);if(G.fatigue)tm*=1.6;
  G.mining={tx,ty,prog:0,total:tm,k:c.obs,sndT:0};tutorialStep('mine')}
function updateMining(dt){const m=G.mining;if(!m)return;const c=cell(m.tx,m.ty);if(!c||c.obs!==m.k){G.mining=null;return}
  m.prog+=dt;m.sndT-=dt;const x=m.tx*TILE+24,y=m.ty*TILE+24;
  if(m.sndT<=0){m.sndT=.24;sfx('dig');dust(x+rand(-10,10),y+rand(-10,6),obsColor(m.k),2)}
  if(m.prog>=m.total){const O=OBS[m.k];c.obs=null;G.mining=null;
    const rw=Math.round(O.reward*(1+perk('mining')*.15));gain(rw);floatText(x,y-10,'+'+rw,'#7dff8f',16);sfx('breakBlock');if(rw>=10)sfx('coin');
    blockBreak(x,y,obsTex(m.k));G.stats.mined++;if(!G.demo){SAVE.mined++;addXP(2,x,y)}
    for(const[id,ch,n]of(O.drops||[]))if(Math.random()<ch)giveItem(id,n,x,y);
    if(O.souls&&G.realm==='sift')addSouls(O.souls,x,y);
    mineFeature(m.k,x,y,m.tx,m.ty);
    if(m.k==='diamond'||m.k==='ddiamond')unlockAch('diamond');if(SAVE.mined>=50)unlockAch('miner');renderBG()}}
function mineFeature(k,x,y,tx,ty){
  if(k==='dripstone'){/* sarkıt düşer: yanındaki yol karelerine ağır hasar */
    for(const e of G.enemies){if(!e.alive||e.def.flying)continue;if(Math.abs(e.x-x)<TILE*1.6&&Math.abs(e.y-y)<TILE*1.6)damage(e,80+G.wave*10,'phys',null)}
    for(let i=0;i<14;i++)addP({x:x+rand(-30,30),y:y+rand(-20,20),vx:rand(-60,60),vy:rand(-100,-20),life:.7,max:.7,sz:3,c:pick(['#866b5c','#937868']),g:500});sfx('breakBlock');shake(4);floatText(x,y-20,'DÜŞTÜ!','#d8b8a0',14)}
  if(k==='cheart'){unlockAch('heart');sfx('crumble');let n=0;for(const e of G.enemies)if(e.alive&&e.def.creaking&&e.heart&&e.heart.obs!=='cheart'&&e.twitchT<=0){e.twitchT=1.2;n++}
    if(n)floatText(x,y-30,n+' Gıcırtı ufalanıyor!','#ffb060',16)}
  if(k==='bheart'){sfx('creakAwake');ring(x,y,80,'255,120,20');shake(6);floatText(x,y-30,'Kadim Kalp kırıldı!','#ff9a30',16)}
  if(k==='ecrystal'){/* End Kristali patlar: yaratıklara ve yakındaki kulelere hasar */
    explode(x,y,1.8,300+G.wave*12,null,{air:true});for(const t of towersIn(x,y,1.05))damageTower(t,60);G.flash=.4;G.flashCol='255,160,240';shake(10)}
  if(k==='generator'){sfx('explosion');explodeFX(x,y,40,false);floatText(x,y-30,'Jeneratör susturuldu!','#ff8080',15)}
  if(k==='shrieker'){floatText(x,y-30,'Çığırtkan susturuldu','#7af0e8',14)}
  if(k==='sensor'){floatText(x,y-30,'Sensör sustu','#7af0e8',14)}
}
function obsTex(k){const O=OBS[k];if(O.tex)return TX[O.tex][0];const m={tree:'leaves',spruce:'spruce',darkoak:'darkleaves',mangrove:'leaves',cactus:'cactus',paleoak:'paleleaves',cheart:'palelog',bheart:'palelog',resinlog:'resin',eyeb:'palemoss',sensor:'sculk',shrieker:'bonebk',catalyst:'bonebk',cfungus:'nwart',wfungus:'wwart',basaltcol:'basalt',chorusp:'chorus',glowshroom:'glowcap',cryst:'crystalb',ambertree:'amberst',umbratree:'umbral',vent:'painted',endrod:'esbricks',ecrystal:'obsidian',driprock:'driprock',sifttree:'siftleaf',soulplant:'tealgrass',nest:'darksculk',generator:'iron',chest:'planks',hay:'sand',dripstone:'dripstone',temple:'planks',achest:'cdeep',ichorbarrel:'planks'};
  const t=TX[m[k]||'stone'];return t?t[0]:TX.stone[0]}
function obsColor(k){return{tree:'#3f7f22',spruce:'#2f5a32',cactus:'#4f8f2f',diamond:'#5decf5',gold:'#fcee4b',emerald:'#17dd62',redstone:'#e01010',glow:'#e8c062',netherrock:'#7c3333',quartz:'#ece6dc',ngold:'#fcee4b',endrock:'#dde0a6',paleoak:'#c8ccbf',cheart:'#ff9a2a',sensor:'#29dfeb',shrieker:'#e8e2c8',catalyst:'#29dfeb',cfungus:'#9a2020',wfungus:'#1c9a8c',chorusp:'#a070c0',glowshroom:'#3ad8c8',sifttree:'#9ad8d0',soulplant:'#4ad8f0'}[k]||'#888'}
