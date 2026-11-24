/* ============================ YARATIK MANTIĞI ============================ */
function effSpeed(e){
  const d=e.def;
  if(e.stunT>0||e.freezeT>0||e.fuse>0||e.rootT>0||e.admireT>0||e.calmT>0||e.levT>0||e.siegeLock||e.shriekT>0||e.twitchT>0||e.emergeT>0||e.cast>0||e.blocked)return 0;
  if(d.creaking&&e.gazed&&!d.boss)return 0;
  if(d.sift&&e.lifelinkOn)return 0;
  let sp=d.spd*TILE*(1-e.slow);
  if(G.wave&&isNightWave(G.wave))sp*=1.08;
  const c=cell(Math.floor(e.x/TILE),Math.floor(e.y/TILE));
  if(c&&!d.flying){if(c.fx==='powder'&&!d.coldImm)sp*=.65;else if(c.fx==='mud')sp*=.8;else if(c.fx==='soul')sp*=.75;else if(c.fx==='slide')sp*=1.3;
    if(d.swim&&(c.under==='water'||G.map.biome==='ocean'))sp*=1.2}
  if(d.lavaWalk)sp*=e.onLava?1.35:.6;
  if(d.gallop&&e.gallopT<.7)sp*=1.9;
  if(e.angry)sp*=1.5;if(e.linkBuff>0)sp*=1.5;if(e.buffT>0)sp*=1.4;if(e.enrageT>0)sp*=1.2;
  if(d.boss&&d.creaking&&e.gazed)sp*=.5;
  if(e.fear)sp*=.5;
  if(G.gazeT>0)sp*=d.creaking?0:.65;
  if(G.lullT>0)sp*=.5;
  if(e.chargeT>0)sp*=5;
  return sp;
}
function hitEnemy(e,amt,type,src){if(!e.alive)return 0;let crit=false;if(src&&critRoll(src.s&&src.s.crit)){amt*=2;crit=true}return damage(e,amt,type,src,crit)}
function immText(e,t,c){if(Math.random()<.3)floatText(e.x,e.y-24,t,c||'#ffaa00',12)}
function damage(e,amt,type,src,crit){
  if(!e.alive)return 0;const d=e.def;
  if(d.illusion){e.hp=0;killEnemy(e,src,true);return amt}
  if(e.burrowT>0||e.emergeT>0)return 0;
  if(e.invuln&&(d.creaking||d.boss)){creakSway(e,src);return 0}
  if((type==='fire'||type==='burn')&&d.fireImm){if(type==='fire')immText(e,'BAĞIŞIK');return 0}
  if(type==='phys'&&d.physImm){immText(e,'İÇİNDEN GEÇTİ','#7af0e8');return 0}
  if(type==='blast'&&d.blastImm){immText(e,'BAĞIŞIK','#8af0e0');return 0}
  const T=src&&src.type?TOWERS[src.type]:null;
  if(src&&src.type==='archer'&&d.arrowEat&&Math.random()<d.arrowEat){floatText(e.x,e.y-20,'HAM!','#7ae8c8',13);sfx('sifter');return 0}
  if(d.dodge&&type==='phys'&&src&&src.type&&Math.random()<d.dodge){floatText(e.x,e.y-20,'KAÇTI','#c8f0ff',12);return 0}
  if(d.deflect&&T&&T.proj&&type==='phys'&&Math.random()<d.deflect){floatText(e.x,e.y-20,'SAVUŞTURDU','#c8d0ff',12);return 0}
  let a=amt;
  if(e.weakT>0)a*=1+e.weak;if(e.ampT>0)a*=1+e.amp;if(G.eyeT>0)a*=1.15;
  if(type==='ice'&&d.iceWeak)a*=2;
  if(type==='magic'&&d.magicRes)a*=1-d.magicRes;
  if(type==='blast'&&d.blastWeak)a*=d.blastWeak;
  let ar=d.armor||0;if(e.shellClosedT>0)ar=ar*3+10;if(d.shell&&!e.shellOpen)ar+=20;
  if(ar){if(type==='phys')a=Math.max(a*.2,a-ar);else if(type==='blast')a=Math.max(a*.3,a-ar*.5);else if(type==='ice')a=Math.max(a*.5,a-ar*.5);else if(d.shell&&!e.shellOpen)a*=.25}
  e.hp-=a;G.stats.dmg+=a;if(src)src.dmg=(src.dmg||0)+a;
  if(e.lifelink)e.lifelink=null;
  if(d.horde&&!e.angry)angerHorde(e);
  const dot=type==='burn'||type==='poison'||type==='soul';
  if(!dot){e.flash=.12;if(SAVE.settings.dmgNums&&!G.demo)floatText(e.x+rand(-6,6),e.y-(d.h||20)*enemyScale(d)*.8,(crit?'✦':'')+Math.round(a),crit?'#ffe040':'#ffffff',crit?17:13);hurtSound(e)}
  else e.dotAcc+=a;
  if(d.blink&&e.blinkCd<=0&&e.hp>0&&!d.boss){e.blinkCd=3.5;const ox=e.x,oy=e.y;e.dist=Math.min(e.path.len-TILE*.5,e.dist+TILE*1.6);puff(ox,oy,'#6a3a9a',10);sfx('blink')}
  if(d.tpChance&&e.hp>0&&Math.random()<d.tpChance*.25){e.dist=Math.min(e.path.len-TILE*.5,e.dist+TILE);puff(e.x,e.y,'#b070d8',6);sfx('blink')}
  if(e.hp<=0)killEnemy(e,src);
  return a;
}
function hurtSound(e){const s=e.def.snd;if(s==='zombie')sfx('hit');else if(s)sfx(s);else sfx('hit')}
/* Gıcırtı vurulunca sallanır; turuncu parçacıklar kalbine akar, kütüklerde reçine oluşur */
function creakSway(e,src){
  e.sway=.4;if(Math.random()<.35)sfx('creak');
  const h=e.heart;const hp=h?heartPos(h):null;
  if(hp){for(let i=0;i<3;i++)G.parts.length<PMAX()&&G.parts.push({x:e.x+rand(-4,4),y:e.y-20,vx:(hp.x-e.x)*rand(.6,1),vy:(hp.y-e.y)*rand(.6,1),life:1,max:1,sz:2,c:pick(['#ff9a2a','#c8ccbf']),g:0});
    if(isNightWave(G.wave)&&(G.resinCd||0)<G.time){G.resinCd=G.time+5;growResinNear(hp.tx,hp.ty)}}
  else if(Math.random()<.2)floatText(e.x,e.y-30,'ÖLÜMSÜZ','#ffb060',12);
}
function heartPos(c){for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(G.grid[y][x]===c)return{x:x*TILE+24,y:y*TILE+24,tx:x,ty:y};return null}
function growResinNear(tx,ty){for(const[i,j]of shuffle([[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]])){const c=cell(tx+i,ty+j);if(c&&c.t==='ground'&&!c.obs&&!c.tower){c.obs='resinlog';renderBG();sfx('resin');return}}}
function angerHorde(e){const r2=(e.def.horde.r*TILE)**2;let n=0;for(const o of G.enemies){if(o.alive&&o.def.horde&&!o.angry&&d2(o.x,o.y,e.x,e.y)<=r2){o.angry=true;n++;sparkle(o.x,o.y-20,'#ff4040',3)}}if(n){sfx('piglin');floatText(e.x,e.y-30,'SÜRÜ ÖFKELENDİ!','#ff6060',15)}}
function killEnemy(e,src,silent){
  if(!e.alive)return;const d=e.def;
  if(d.ab&&d.ab.some(a=>a.k==='resurrect')&&!e.resurrected){e.resurrected=true;e.hp=e.maxHp*d.ab.find(a=>a.k==='resurrect').hp;e.emergeT=2;banner(d.name+' YENİDEN KALKIYOR!','<small>Kemikler birleşiyor...</small>');sfx('roar');ring(e.x,e.y,90,'230,220,200');return}
  e.alive=false;e.wave.alive--;
  if(!G.demo&&!d.illusion){
    const rw=Math.round(d.reward*(1+G.wave*.03)*(1+perk('loot')*.06)*G.diff.money);if(rw>0){gain(rw);floatText(e.x,e.y-6,'+'+rw,'#7dff8f',13)}
    G.stats.kills++;SAVE.kills++;addXP(d.xp||1,e.x,e.y);
    if(G.stats.kills===1)unlockAch('firstKill');if(SAVE.kills>=1000)unlockAch('kill1000');
    if(G.realm==='sift'){let sg=d.boss?25:1;if(G.tide===1)sg*=.5;if(G.tide===2)sg*=2;addSouls(sg,e.x,e.y)}
    for(const[id,ch,n]of(d.drops||[]))if(Math.random()<ch)giveItem(id,n,e.x,e.y);
  }
  if(src&&src.kills!=null)src.kills++;
  if(d.illusion){puff(e.x,e.y-10,'#7ac0ff',12);sfx('blink');return}
  puff(e.x,e.y-8,'#e8e8e8',d.boss?40:10);
  if(!silent){if(d.snd==='zombie')sfx('zombieDie');else if(d.snd==='slime')sfx('slime');else if(d.snd==='magma')sfx('magma');else sfx('pop')}
  if(d.split){for(let i=0;i<d.splitN;i++){const c=spawnEnemy(d.split,e.pi,e.wave,Math.max(0,e.dist-i*10-rand(0,8)),e);if(c){c.off=rand(-10,10);c.stunT=.2}}}
  if(e.rider&&d.rider){const c=spawnEnemy(d.rider,G.walk[0]===e.pi||!e.path.lava?e.pi:G.walk[0],e.wave,e.path.lava?nearestDist(G.paths[G.walk[0]],e.x,e.y).d:e.dist);if(c)c.stunT=.4}
  if(d.onDeath){for(let i=0;i<d.onDeath.n;i++){const c=spawnEnemy(d.onDeath.spawn,e.pi,e.wave,e.dist);if(c){c.stunT=.6;banner('Uyandırıcı yere atladı!')}}}
  if(d.resinSplat){const tw=nearestTower(e.x,e.y,2*TILE);if(tw){applyTowerEffect(tw,{resin:d.resinSplat.t});for(let i=0;i<8;i++)addP({x:e.x,y:e.y-6,vx:(tw.x-e.x)*rand(.8,1.6),vy:(tw.y-e.y)*rand(.8,1.6)-40,life:.5,max:.5,sz:3,c:'#e87820',g:200})}}
  if(d.enrage){for(const o of G.enemies)if(o.alive&&o.def.sift&&d2(o.x,o.y,e.x,e.y)<(d.enrage.r*TILE)**2){o.enrageT=99;sparkle(o.x,o.y-14,'#ffd040',3)}}
  catalystBloom(e);
  if(e.roam){G.wardenOut=null;banner('Muhafız yenildi!','<small>Uyarı seviyesi sıfırlandı</small>')}
  if(d.boss&&!e.roam){if(G.boss===e){G.boss=null;$('bossbar').style.display='none';MUS.boss=false}
    for(const st of(e.carry||[]))dropStolen(st);
    if(!G.demo){explodeFX(e.x,e.y,90,true);sfx('explosion');shake(14);unlockAch('boss');SAVE.bossKills[e.type]=(SAVE.bossKills[e.type]||0)+1;
      const achMap={bossDragon:'dragon',witherBoss:'wither',bigCreaking:'creaking',warden:'warden',ancientWarden:'warden',grandIllusioner:'illusioner'};if(achMap[e.type])unlockAch(achMap[e.type]);
      banner(d.name+' YENİLDİ!','<small>+'+Math.round(d.reward*G.diff.money)+' zümrüt</small>');
      for(const o of G.enemies)if(o.alive&&(o.type==='monarchEcho'||o.def.illusion)){o.hp=0;killEnemy(o,null,true)}}}
}
function catalystBloom(e){
  if(!G.map.mech||!G.map.mech.vib)return;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.obs!=='catalyst')continue;const cx=x*TILE+24,cy=y*TILE+24;if(d2(cx,cy,e.x,e.y)>(2.5*TILE)**2)continue;
    c.fxT=G.time+1;c.blooms=(c.blooms||0)+1;sfx('bloom');for(let i=0;i<8;i++)addP({x:e.x,y:e.y-6,vx:(cx-e.x)*rand(.8,1.4),vy:(cy-e.y)*rand(.8,1.4),life:.8,max:.8,sz:2,c:'#29dfeb',g:0});
    if(!G.demo)addXP(1,cx,cy);
    if(c.blooms%5===0){for(const[i,j]of shuffle([[1,0],[-1,0],[0,1],[0,-1],[2,0],[0,2],[-2,0],[0,-2]])){const n=cell(x+i,y+j);if(n&&n.t==='ground'&&!n.obs&&!n.tower){n.obs='sensor';renderBG();floatText(cx,cy-24,'Sculk yayıldı: yeni sensör!','#7af0e8',14);break}}}}
  for(const o of G.enemies){if(!o.alive||!o.def.catalyst||o===e)continue;if(d2(o.x,o.y,e.x,e.y)<=(o.def.catalyst.r*TILE)**2){o.hp=Math.min(o.maxHp*1.5,o.hp+o.maxHp*o.def.catalyst.heal);o.maxHp=Math.max(o.maxHp,o.hp);o.grow=Math.min(1.5,(o.grow||1)+.06);sparkle(o.x,o.y-14,'#29dfeb',4)}}
}
function knockback(e,amt){if(e.def.boss)amt*=.15;e.dist=Math.max(0,e.dist-amt)}
function leak(e){
  e.alive=false;e.wave.alive--;e.wave.leaks++;
  if(G.demo||e.def.illusion)return;
  if(e.roam){G.wardenOut=null}
  const L=e.roam?5:(e.def.lives||1);G.lives-=L;G.stats.leaked+=L;G.lastLeak=L;sfx('leak');shake(5);G.hurtFx=.4;
  if(e.def.boss&&G.boss===e){G.boss=null;$('bossbar').style.display='none';MUS.boss=false}
  if(G.lives<=0){if((G.items.totem||0)>0){G.items.totem--;G.lives=6;totemFx()}else{G.lives=0;gameOver()}}
}
function totemFx(){sfx('levelup');G.flash=.5;G.flashCol='255,220,80';banner('ÖLÜMSÜZLÜK TOTEMİ!','<small>Seni 6 canla geri getirdi</small>');for(let i=0;i<60;i++)addP({x:W/2+rand(-40,40),y:H/2+rand(-40,40),vx:rand(-200,200),vy:rand(-250,50),life:1.4,max:1.4,sz:rand(2,4),c:pick(['#ffd83d','#20c050','#fff6b0']),g:200});unlockAch('totem')}
function nearestTower(x,y,r,filter){let best=null,bd=r*r;for(const t of G.towers){if(filter&&!filter(t))continue;const dd=d2(x,y,t.x,t.y);if(dd<bd){bd=dd;best=t}}return best}
function towersIn(x,y,r){const r2=(r*TILE)**2;return G.towers.filter(t=>d2(x,y,t.x,t.y)<=r2)}
function stunTowersAround(x,y,rad,dur,col,dmg){const list=towersIn(x,y,rad);for(const t of list){t.stunT=Math.max(t.stunT,dur);sparkle(t.x,t.y-10,col,5);if(dmg)damageTower(t,dmg)}if(list.length)sfx('stun');return list.length}
function atkScale(e){return(1+G.wave*.025)*(e.linkBuff>0?1.4:1)*(e.buffT>0?1.4:1)*(G.tide===1?1.15:1)*(e.enrageT>0?1.2:1)}
/* gözetleniyor mu? (Gıcırtı) — menzilindeki her kule ona "bakar" */
function isWatched(e){
  for(const o of G.enemies)if(o.alive&&o.def.gazeShield&&d2(o.x,o.y,e.x,e.y)<(o.def.gazeShield.r*TILE)**2)return false;
  for(const t of G.towers){const D=TOWERS[t.type];if(D.trap||D.block||D.eco||t.stunT>0)continue;
    let r=t.type==='eyepot'?t.s.radius*(G.tod>.5?1.25:1):(t.s.range||t.s.radius||2);if(d2(e.x,e.y,t.x,t.y)<=(r*TILE)**2)return true}
  return false}
function updateEnemy(e,dt){
  const d=e.def;e.t+=dt;e.flash-=dt;e.blinkCd-=dt;e.punch=Math.max(0,e.punch-dt);e.healFx-=dt;e.sway=Math.max(0,(e.sway||0)-dt);
  for(const k of['glowT','ampT','rootT','admireT','calmT','revealT','linkBuff','buffT','invisT','shellClosedT','cast','chargeT','emergeT'])if(e[k]>0)e[k]-=dt;
  if(e.lifeT!=null){e.lifeT-=dt;if(e.lifeT<=0){e.alive=false;e.wave.alive--;puff(e.x,e.y-10,'#7ac0ff',8);return}}
  if(e.burrowT>0){e.burrowT-=dt;e.dist+=d.spd*TILE*1.6*dt;if(e.burrowT<=0){for(const t of towersIn(e.x,e.y,1.5))damageTower(t,30*atkScale(e));dust(e.x,e.y,'#8a8420',20);sfx('emerge');shake(6)}}
  if(e.slowT>0){e.slowT-=dt;if(e.slowT<=0)e.slow=0}
  if(e.inWeb){e.slow=Math.max(e.slow,.6);e.slowT=Math.max(e.slowT,.1)}
  if(e.burnT>0){e.burnT-=dt;damage(e,e.burnDps*dt,'burn',e.burnSrc);if(Math.random()<dt*14)addP({x:e.x+rand(-6,6),y:e.y-rand(4,20),vx:0,vy:-30,life:.4,max:.4,sz:3,c:pick(['#ff7a1a','#ffb020','#ffe080']),g:0});if(!e.alive)return}
  if(e.poisonT>0){e.poisonT-=dt;damage(e,e.poisonDps*dt,'poison',e.poisonSrc);if(Math.random()<dt*6)addP({x:e.x+rand(-6,6),y:e.y-rand(4,18),vx:0,vy:-18,life:.6,max:.6,sz:2,c:'#7ae04a',g:0});if(!e.alive)return}
  if(e.weakT>0)e.weakT-=dt;
  e.dotT-=dt;if(e.dotT<=0){e.dotT=.45;if(e.dotAcc>=1&&SAVE.settings.dmgNums&&!G.demo)floatText(e.x+rand(-5,5),e.y-24,Math.round(e.dotAcc),e.burnT>0?'#ffaa40':'#9aff60',12);e.dotAcc=0}
  if(e.freezeT>0)e.freezeT-=dt;if(e.stunT>0)e.stunT-=dt;
  e.inWeb=false;
  e.soundT-=dt;if(e.soundT<=0){e.soundT=rand(4,9);if(d.snd&&['zombie','ghast','piglin','hoglin','enderman','witch','phantom','guardian','blaze','illager','jelly','dragonfly','sifter'].includes(d.snd))sfx(d.snd)}
  /* ----- yükselme (Shulker Kulesi) ----- */
  if(e.levT>0){e.levT-=dt;e.levH=Math.min(20,(e.levH||0)+dt*40);if(e.levT<=0){const fd=e.levFall||0;e.levH=0;if(fd>0){damage(e,fd,'phys',e.levSrc);dust(e.x,e.y+8,'#c8b8d8',6)}}}
  /* ----- yer belirleme / zemin ----- */
  const c=cell(Math.floor(e.x/TILE),Math.floor(e.y/TILE));
  e.onLava=!!(c&&(c.t==='lava'||c.under==='lava'));
  if(c&&c.fx==='magma'&&!d.fireImm&&!d.flying)damage(e,6*dt*(1+G.wave*.03),'burn',null);
  if(G.biome.sift&&!d.flying&&(d.sift||d.illager)&&((e.ichorT=(e.ichorT||0)-dt)<=0)){e.ichorT=.5;let adj=false;const tx=Math.floor(e.x/TILE),ty=Math.floor(e.y/TILE);for(const[i,j]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=cell(tx+i,ty+j);if(n&&n.t==='ichor'){adj=true;break}}
    if(adj){if(d.illager){damage(e,e.maxHp*.02,'magic',null);if(Math.random()<.3)addP({x:e.x,y:e.y-10,vx:0,vy:-20,life:.5,max:.5,sz:2,c:'#ff7ad8',g:0})}else if(e.hp<e.maxHp){e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.012);if(Math.random()<.3)sparkle(e.x,e.y-12,'#5ae8ff',1)}}}
  /* ----- Gıcırtı ----- */
  if(d.creaking){if(e.twitchT>0){e.twitchT-=dt;if(e.twitchT<=0){crumble(e);return}}
    else if(e.heart&&e.heart.obs!=='cheart'){e.twitchT=1.2;sfx('creakFreeze')}
    const was=e.gazed;e.gazed=G.gazeT>0||isWatched(e);if(e.gazed&&!was)sfx('creakFreeze')}
  if(d.boss&&d.ab&&d.ab.some(a=>a.k==='hearts')){let alive=0;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(G.grid[y][x].obs==='bheart')alive++;e.heartsAlive=alive;const was=e.invuln;e.invuln=alive>0;if(was&&!e.invuln){banner('KALPLER KIRILDI!','<small>Kadim Gıcırtı artık ölümlü</small>');e.enrageT=99;sfx('creakAwake')}}
  if(d.shell){e.shellT-=dt;if(e.shellT<=0){e.shellOpen=!e.shellOpen;e.shellT=e.shellOpen?d.shell.open:d.shell.closed;sfx('shulker')}}
  if(d.gallop){e.gallopT-=dt;if(e.gallopT<=0)e.gallopT=rand(2.5,4)}
  if(d.vibCamo)e.revealedVib=e.revealT>0;
  if(d.goldLove&&e.admireT<=0)checkGold(e);
  if(d.fungusFear){e.fear=false;const tx=Math.floor(e.x/TILE),ty=Math.floor(e.y/TILE);for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const n=cell(tx+i,ty+j);if(n&&n.obs==='wfungus')e.fear=true}}
  if(d.blindAura){for(const t of towersIn(e.x,e.y,d.blindAura.r)){t.fx.blindT=.3;t.fx.blind=d.blindAura.amt}}
  if(d.zog){e.zogCd=(e.zogCd||0)-dt;if(e.zogCd<=0){e.zogCd=d.zog.cd;for(const o of G.enemies){if(o===e||!o.alive||o.def.zog||o.def.boss||o.def.flying)continue;if(d2(o.x,o.y,e.x,e.y)<(.9*TILE)**2){damage(o,d.zog.dmg,'phys',null);e.punch=.35;break}}}}
  if(d.lifelink&&e.stunT<=0){e.linkCd=(e.linkCd||0)-dt;if(!e.lifelink||!e.lifelink.alive){e.lifelinkOn=false;if(e.linkCd<=0){e.linkCd=3;let best=null,bd=(d.lifelink.r*TILE)**2;for(const o of G.enemies){if(!o.alive||o===e||o.def.lifelink||o.def.boss)continue;const dd=d2(o.x,o.y,e.x,e.y);if(dd<bd){bd=dd;best=o}}e.lifelink=best}}
    if(e.lifelink&&e.lifelink.alive){e.lifelinkOn=true;const o=e.lifelink;o.linkBuff=.3;o.hp=Math.min(o.maxHp*1.3,o.hp+o.maxHp*.03*dt);if(Math.random()<dt*8)addP({x:lerp(e.x,o.x,Math.random()),y:lerp(e.y-20,o.y-10,Math.random()),vx:0,vy:0,life:.3,max:.3,sz:2,c:'#ffe060',g:0})}}
  if(d.soulDrain){e.drainCd=(e.drainCd||d.soulDrain.every)-dt;if(e.drainCd<=0){e.drainCd=d.soulDrain.every;if(G.souls>0){const a=Math.min(G.souls,d.soulDrain.amt);G.souls-=a;e.hp=Math.min(e.maxHp,e.hp+e.maxHp*d.soulDrain.heal);floatText(e.x,e.y-30,'-'+a+' ruh','#7fe8ff',13);for(let i=0;i<6;i++)addP({x:rand(0,W),y:-5,vx:(e.x-W/2)*.3,vy:120,life:1,max:1,sz:2,c:'#7fe8ff',g:0,star:true});sfx('soul')}}}
  if(d.shriek){if(e.shriekT>0){e.shriekT-=dt;if(e.shriekT<=0){walkerShriek(e)}}else{e.shCd=(e.shCd||2)-dt;if(e.shCd<=0&&nearestTower(e.x,e.y,d.shriek.r*TILE)){e.shriekT=d.shriek.cast;e.shCd=7}}}
  if(e.roam){e.roamT-=dt;if(e.roamT<=0){burrowAway(e);return}}
  if(d.silk&&!e.silkDone){const tw=nearestTower(e.x,e.y,.8*TILE);if(tw){applyTowerEffect(tw,{silk:d.silk.t});e.silkDone=true;e.hp=0;killEnemy(e,null,true);return}}
  /* ----- saldırılar ve yetenekler ----- */
  e.siegeLock=false;
  if(e.stunT<=0&&e.freezeT<=0&&e.emergeT<=0&&e.calmT<=0&&e.rootT<=0&&!(d.creaking&&e.gazed&&!d.boss)&&e.twitchT<=0){
    if(d.atk)enemyAttack(e,d.atk,dt);
    if(d.healer){e.healCd-=dt;if(e.healCd<=0){e.healCd=3;let any=false;for(const o of G.enemies){if(!o.alive||o===e)continue;if(d2(o.x,o.y,e.x,e.y)<(2*TILE)**2&&o.hp<o.maxHp){o.hp=Math.min(o.maxHp,o.hp+o.maxHp*(o.def.boss?.03:.12));sparkle(o.x,o.y-12,'#ff70ff',4);any=true}}if(any){e.healFx=.5;sfx('heal')}}}
    if(d.creeper&&e.fuse<=0&&nearestTower(e.x,e.y,(d.creeper.fuse<.5?.8:1.2)*TILE)){e.fuse=d.creeper.fuse;sfx(d.creeper.fuse<.5?'pop':'creeper')}
    if(d.summon){e.sumCd-=dt;if(e.sumCd<=0){e.sumCd=d.summon.every;for(let i=0;i<d.summon.n;i++){const c=spawnEnemy(d.summon.type,e.path.lava?G.walk[0]:e.pi,e.wave,Math.max(0,(e.path.lava?nearestDist(G.paths[G.walk[0]],e.x,e.y).d:e.dist)-rand(10,40)),e);if(c)c.off=rand(-12,12)}puff(e.x,e.y,'#4a2a5a',16);sfx('spell')}}
    if(d.ab)d.ab.forEach((a,i)=>{const st=e.ab[i];if(a.every){st.cd-=dt;if(st.cd<=0){st.cd=a.every;const fn=BOSSAB[a.k];if(fn)fn(e,a,st)}}else{const fn=BOSSAB_P[a.k];if(fn)fn(e,a,st,dt)}});
  }
  if(e.fuse>0){e.fuse-=dt;if(e.fuse<=0){creeperBoom(e);return}}
  /* ----- hareket ----- */
  let blocked=false;
  if(!d.flying&&!d.boss){for(const gm of G.golems){const dd=d2(e.x,e.y,gm.x,gm.y);if(dd<26*26){const fp=pathPos(e.path,e.dist+6);if(d2(fp.x,fp.y,gm.x,gm.y)<dd){blocked=true;break}}}
    if(!blocked)for(const b of G.blubBlocks){if(!b.land||b.P!==e.path)continue;const dd=e.dist-b.dist;if(dd>-14&&dd<4){blocked=true;b.life-=dt*.5;break}}}
  e.blocked=blocked;
  const sp=effSpeed(e);
  e.dist+=sp*dt;if(sp>0)e.anim+=dt*sp/TILE*6;
  const p=pathPos(e.path,e.dist);let zz=0;if(d.zig)zz=Math.sin(e.t*7)*10;
  const nx=p.x-p.dy*(e.off+zz),ny=p.y+p.dx*(e.off+zz);
  if(Math.abs(nx-e.x)>.05)e.dir=nx>e.x?1:-1;e.x=nx;e.y=ny;
  if(!d.flying&&!e.path.lava){const cc=cell(Math.floor(e.x/TILE),Math.floor(e.y/TILE));if(cc&&cc.trap){const tr=cc.trap;
    if(tr.type==='web'&&!d.webImm){e.inWeb=true;tr.dur-=dt}
    else if(tr.type==='landmine'){const L=TOWERS.landmine.lv[0];removeTrap(tr);explode(tr.x,tr.y,L.splash,L.dmg*(1+perk('sharp')*.05)*(1+G.wave*.04),null,{})}}}
  if(e.chargeT>0&&e.chargeHit){for(const t of towersIn(e.x,e.y,1.25))if(!e.chargeHit.has(t)){e.chargeHit.add(t);damageTower(t,e.chargeDmg);dust(t.x,t.y+10,'#aaa',8)}}
  if(e.alive&&e.dist>=e.path.len)leak(e);
}
function checkGold(e){const tx=Math.floor(e.x/TILE),ty=Math.floor(e.y/TILE);
  for(const b of(G.baits||[]))if(b.t>0&&d2(b.x,b.y,e.x,e.y)<(b.r*TILE)**2&&!e.admired['bait'+b.id]){e.admired['bait'+b.id]=true;e.admireT=6;floatText(e.x,e.y-28,'✦ Altın! ✦','#ffd83d',13);SAVE.piglinBait=(SAVE.piglinBait||0)+1;if(SAVE.piglinBait>=10)unlockAch('piglin');return}
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const n=cell(tx+i,ty+j);if(n&&n.obs&&OBS[n.obs].feat==='gold'){const k=(tx+i)+','+(ty+j);if(!e.admired[k]){e.admired[k]=true;e.admireT=2.5;floatText(e.x,e.y-28,'✦','#ffd83d',14);return}}}}
function crumble(e){e.hp=0;sfx('crumble');blockBreak(e.x,e.y-20,TX.palelog[0]);killEnemy(e,null,true)}
function burrowAway(e){e.alive=false;e.wave.alive--;G.wardenOut=null;dust(e.x,e.y,'#0b2a33',20);sfx('emerge');floatText(e.x,e.y-30,'Muhafız toprağa döndü','#7af0e8',15)}
function walkerShriek(e){G.warn=Math.min(4,G.warn+1);G.warnMax=Math.max(G.warnMax,G.warn);sfx('shriek');ring(e.x,e.y,120,'41,223,235');
  for(const t of towersIn(e.x,e.y,2.4))applyTowerEffect(t,{dark:.25,t:4});darkness(3,.15);floatText(e.x,e.y-34,'ÇIĞLIK! Uyarı '+G.warn+'/4','#7af0e8',15);
  if(G.warn>=4){G.warn=0;G.sneakOk=false;const x=e.x,y=e.y;setTimeout(()=>{if(G&&!G.over)wardenEmerge(x,y)},1500)}}
function creeperBoom(e){const C=e.def.creeper,mul=e.charged?2:1,r=C.r*mul*(e.charged?.75:1);
  for(const t of towersIn(e.x,e.y,r)){const dd=Math.hypot(t.x-e.x,t.y-e.y)/(r*TILE);damageTower(t,C.dmg*mul*atkScale(e)*Math.max(.5,1-dd*.5),C.moss?{moss:C.moss}:null)}
  for(const o of G.enemies)if(o.alive&&o!==e&&d2(o.x,o.y,e.x,e.y)<(r*TILE)**2)damage(o,C.dmg*.3*mul,'blast',null);
  explodeFX(e.x,e.y,r*TILE,!(C.fuse<.5));sfx(C.fuse<.5?'smallBoom':'explosion');shake(C.fuse<.5?3:7);if(C.moss)for(let i=0;i<14;i++)addP({x:e.x,y:e.y,vx:rand(-90,90),vy:rand(-120,0),life:1,max:1,sz:3,c:'#b8bdb1',g:150});
  e.alive=false;e.wave.alive--}
/* ----- yaratığın kuleye saldırısı ----- */
function enemyAttack(e,A,dt){
  if(e.def.horde&&!e.angry)return;
  e.atkCd-=dt;const sc=atkScale(e);
  if(A.t==='melee'){if(e.atkCd<=0){const tw=nearestTower(e.x,e.y,(A.r||1.05)*TILE);if(tw){e.atkCd=A.cd;e.punch=.35;damageTower(tw,A.dmg*sc,A.eff);dust(tw.x,tw.y+10,'#bbb',3)}else e.atkCd=.25}}
  else if(A.t==='siege'){if(!e.siege||!G.towers.includes(e.siege)||d2(e.x,e.y,e.siege.x,e.siege.y)>((A.r+.3)*TILE)**2)e.siege=nearestTower(e.x,e.y,A.r*TILE,t=>!TOWERS[t.type].trap);
    if(e.siege){e.siegeLock=true;e.dir=e.siege.x>e.x?1:-1;if(e.atkCd<=0){e.atkCd=A.cd;e.punch=.35;damageTower(e.siege,A.dmg*sc,A.eff);dust(e.siege.x,e.siege.y+10,'#aaa',5);sfx('punch')}}}
  else if(A.t==='shoot'){if(e.atkCd<=0){if(e.def.shell&&!e.shellOpen){e.atkCd=.3;return}const tw=nearestTower(e.x,e.y,A.r*TILE);if(tw){e.atkCd=A.cd;for(let i=0;i<(A.n||1);i++)fireEProj(e,tw,A.p,A.dmg*sc,A.eff,A.splash,i*.15);if(A.p==='bolt'||A.p==='arrow')sfx(A.p==='bolt'?'crossbow':'arrow');else if(A.p==='fireball')sfx('ghastShoot');else if(A.p==='smallfire')sfx('blaze')}else e.atkCd=.4}}
  else if(A.t==='swoop'){if(!e.swoop&&e.atkCd<=0){const tw=nearestTower(e.x,e.y,A.r*TILE);if(tw){e.swoop={tw,t:0};sfx('phantom')}else e.atkCd=.5}
    if(e.swoop){e.swoop.t+=dt;if(e.swoop.t>=.6){if(G.towers.includes(e.swoop.tw))damageTower(e.swoop.tw,A.dmg*sc);e.swoop=null;e.atkCd=A.cd}}}
  else if(A.t==='laser'){if(e.laserT>0){e.laserT-=dt;if(e.laserT<=0){if(G.towers.includes(e.laserTw))damageTower(e.laserTw,A.dmg*sc);e.atkCd=A.cd;e.laserTw=null}}
    else if(e.atkCd<=0){const tw=nearestTower(e.x,e.y,A.r*TILE);if(tw){e.laserT=A.charge||1.6;e.laserMax=e.laserT;e.laserTw=tw;sfx('laser')}else e.atkCd=.4}}
}
function fireEProj(e,tw,k,dmg,eff,splash,delay){G.eprojs.push({x:e.x,y:e.y-(e.def.flying?24:14)*(e.def.S||1.6)/1.6,tw,tx:tw.x,ty:tw.y,k,dmg,eff,splash,spd:k==='fireball'?200:k==='bullet'?150:k==='skull'?240:300,delay:delay||0,rot:0,src:e})}

/* ============================ BOSS YETENEKLERİ ============================ */
function bossInit(e){const d=e.def;(d.ab||[]).forEach((a,i)=>{
  if(a.k==='emerge'){e.emergeT=2.5;sfx('emerge');shake(6);for(let k=0;k<30;k++)addP({x:e.x+rand(-20,20),y:e.y+rand(-4,8),vx:rand(-60,60),vy:rand(-140,-40),life:1,max:1,sz:rand(3,5),c:pick(['#0b2a33','#29dfeb','#3a3a40']),g:300})}
  if(a.k==='spawnBlast'){setTimeout(()=>{if(!G||!e.alive)return;for(const t of towersIn(e.x,e.y,a.r))damageTower(t,a.dmg);explodeFX(e.x,e.y,a.r*TILE,true);sfx('explosion');shake(10)},900)}})}
function towerPickLoud(e,r){let best=null,bl=-1;for(const t of towersIn(e.x,e.y,r)){if(t.lastShot>bl){bl=t.lastShot;best=t}}return best}
function randTowers(x,y,r,n){return shuffle(towersIn(x,y,r).filter(t=>!TOWERS[t.type].trap)).slice(0,n)}
const BOSSAB={
  stomp(e,a){e.punch=.35;const n=stunTowersAround(e.x,e.y,a.r,a.stun,'#bfe8ff',a.dmg);sfx('golem');shake(8);ring(e.x,e.y+10,a.r*TILE,'190,232,255')},
  breath(e,a){stunTowersAround(e.x,e.y,a.r,a.stun,'#c060ff',a.dmg);sfx('roar');ring(e.x,e.y,a.r*TILE,'200,100,255');for(let i=0;i<40;i++){const an=rand(0,TAU),sp=rand(40,160);addP({x:e.x,y:e.y-30,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,life:1,max:1,sz:rand(3,6),c:pick(e.def.pal==='boneDragon'?['#4ae8f0','#c8f8ff','#2a8a96']:['#b040ff','#e080ff','#6a1aa0']),g:0,smoke:true})}},
  sting(e,a){stunTowersAround(e.x,e.y,a.r,a.stun,'#8affff',a.dmg);sfx('jelly');ring(e.x,e.y,a.r*TILE,'140,240,255')},
  roar(e,a){stunTowersAround(e.x,e.y,a.r,a.stun,'#ffd0a0');sfx('ravager');shake(8);ring(e.x,e.y,a.r*TILE,'255,200,160')},
  charge(e,a){e.chargeT=.6;e.chargeDmg=a.dmg*atkScale(e)*.7;e.chargeHit=new Set();sfx(e.def.snd==='hoglin'?'hoglin':'ravager');shake(5)},
  sonic(e,a){const tw=towerPickLoud(e,a.r);if(!tw)return;e.cast=1.3;sfx('sonicCharge');const sx=e.x,sy=e.y;
    setTimeout(()=>{if(!G||!e.alive)return;const targets=[tw];if(a.chain){const o=nearestTower(tw.x,tw.y,2.5*TILE,t=>t!==tw);if(o)targets.push(o)}
      for(const t of targets){if(!G.towers.includes(t))continue;damageTower(t,a.dmg*atkScale(e)*.7,null,{pierce:true});G.beams.push({x1:e.x,y1:e.y-40,x2:t.x,y2:t.y-10,t:.6,max:.6,col:'60,230,255',sonic:true})}
      sfx('sonicBoom');shake(9);addLight(e.x,e.y-30,140,1)},1300)},
  darkness(e,a){darkness(a.dur,a.amt);G.darkPulse=1},
  laser(e,a){const tw=towerPickLoud(e,a.r)||nearestTower(e.x,e.y,a.r*TILE);if(!tw)return;e.laserT=1.6;e.laserMax=1.6;e.laserTw=tw;e.bigLaser=a.dmg;sfx('laser');
    setTimeout(()=>{if(G&&e.alive&&G.towers.includes(tw))damageTower(tw,a.dmg*atkScale(e)*.7);e.laserTw=null},1600)},
  barrage(e,a){if(a.openOnly&&!e.shellOpen)return;const list=randTowers(e.x,e.y,a.r,a.n);if(!list.length)return;for(let i=0;i<a.n;i++)fireEProj(e,list[i%list.length],a.p,a.dmg*atkScale(e)*.7,a.eff,a.splash,i*.18);
    sfx(a.p==='fireball'?'ghastShoot':a.p==='skull'?'witherShoot':a.p==='potion'?'witch':a.p==='bullet'?'shulker':'arrow')},
  fangs(e,a){const tw=nearestTower(e.x,e.y,a.r*TILE);if(!tw)return;e.cast=.8;sfx('spell');const n=6;for(let i=1;i<=n;i++){const f=i/n;setTimeout(()=>{if(!G)return;G.fangs=G.fangs||[];G.fangs.push({x:lerp(e.x,tw.x,f),y:lerp(e.y,tw.y,f),t:.5});if(i===n){if(G.towers.includes(tw))damageTower(tw,a.dmg*atkScale(e));sfx('fangs')}},i*90)}},
  webshot(e,a){for(const t of randTowers(e.x,e.y,4,a.n)){applyTowerEffect(t,{silk:a.t});G.beams.push({x1:e.x,y1:e.y-10,x2:t.x,y2:t.y-10,t:.4,max:.4,col:'235,235,235'})}sfx('spider')},
  invis(e,a){e.invisT=a.t;puff(e.x,e.y-12,'#6a3a9a',12);sfx('blink')},
  healAura(e,a){for(const o of G.enemies)if(o.alive&&o!==e&&d2(o.x,o.y,e.x,e.y)<(a.r*TILE)**2){o.hp=Math.min(o.maxHp,o.hp+o.maxHp*a.amt);sparkle(o.x,o.y-12,'#ff70ff',3)}sfx('heal')},
  teleport(e,a){const ox=e.x,oy=e.y;e.dist=Math.min(e.path.len-TILE*1.2,e.dist+a.dist*TILE);puff(ox,oy,'#a040ff',16);sfx('blink');const p=pathPos(e.path,e.dist);chorusFx(ox,oy,p.x,p.y)},
  steal(e,a){const tw=nearestTower(e.x,e.y,a.r*TILE,t=>!TOWERS[t.type].trap&&!TOWERS[t.type].block);if(!tw)return;e.carry=e.carry||[];e.carry.push({type:tw.type,lvl:tw.lvl,spent:tw.spent,tx:tw.tx,ty:tw.ty});
    G.beams.push({x1:e.x,y1:e.y-40,x2:tw.x,y2:tw.y-10,t:.6,max:.6,col:'200,80,255'});chorusFx(tw.x,tw.y,e.x,e.y);removeTower(tw);sfx('enderman');floatText(tw.x,tw.y-20,'KULE ÇALINDI!','#e070ff',16)},
  witherAura(e,a){for(const t of towersIn(e.x,e.y,a.r))applyTowerEffect(t,{wither:a.dps,t:a.t});ring(e.x,e.y,a.r*TILE,'60,60,70');sfx('witherShoot')},
  geyser(e,a){const list=shuffle(G.towers.filter(t=>!TOWERS[t.type].trap)).slice(0,a.n);for(const t of list){G.geysers=G.geysers||[];G.geysers.push({x:t.x,y:t.y,t:1,tw:t,dmg:a.dmg*atkScale(e)*.7,col:e.def.pal==='wyrm'?'#c8f040':'#ff7a1a'})}sfx('magma')},
  rally(e,a){let n=0;for(const o of G.enemies)if(o.alive&&o!==e&&o.def.goldLove!==undefined&&d2(o.x,o.y,e.x,e.y)<(a.r*TILE)**2){o.buffT=5;n++;sparkle(o.x,o.y-16,'#ffd83d',3)}if(n){sfx('piglin');floatText(e.x,e.y-50,'SALDIRIN!','#ffd83d',18)}},
  silk(e,a){for(const t of randTowers(e.x,e.y,4.5,a.n)){applyTowerEffect(t,{silk:a.t});G.beams.push({x1:e.x,y1:e.y-30,x2:t.x,y2:t.y-10,t:.5,max:.5,col:'245,240,220'})}},
  amber(e,a){for(const t of randTowers(e.x,e.y,4.5,a.n)){applyTowerEffect(t,{amber:a.t});G.beams.push({x1:e.x,y1:e.y-30,x2:t.x,y2:t.y-10,t:.5,max:.5,col:'255,170,50'})}sfx('crystal')},
  blind(e,a){for(const t of towersIn(e.x,e.y,a.r)){t.fx.blindT=a.dur;t.fx.blind=a.amt}ring(e.x,e.y,a.r*TILE,'40,20,60');darkness(1.5,.1)},
  burrow(e,a){e.burrowT=a.t;e.burrowDist=a.dist;dust(e.x,e.y,'#8a8420',16);sfx('emerge')},
  vortex(e,a){for(const t of towersIn(e.x,e.y,a.r)){t.stunT=Math.max(t.stunT,a.t);damageTower(t,a.dmg)}G.vortex={x:e.x,y:e.y,t:a.t,r:a.r*TILE};sfx('spell')},
  shellPhase(e,a){e.shellClosedT=a.t;sfx('shulker');floatText(e.x,e.y-40,'Kabuğuna çekildi','#c8c0a0',14)},
  roarSummon(e,a){sfx('roar');for(let i=0;i<a.n;i++){const c=spawnEnemy(pick(a.types),e.pi,e.wave,Math.max(0,e.dist-rand(10,50)),e);if(c){c.off=rand(-12,12);c.linkBuff=6;G.beams.push({x1:e.x,y1:e.y-30,x2:c.x,y2:c.y-10,t:.6,max:.6,col:'255,224,96'})}}},
  illusions(e,a){for(let i=0;i<a.n;i++){const c=spawnEnemy('illusion',e.pi,e.wave,Math.max(0,e.dist+rand(-40,40)),null);if(c){c.off=rand(-14,14);c.lifeT=7}}puff(e.x,e.y-14,'#7ac0ff',20);sfx('spell')},
  rift(e,a){const d=Math.min(e.path.len-TILE*2,e.dist+rand(3,5)*TILE),p=pathPos(e.path,d);G.rifts=G.rifts||[];G.rifts.push({x:p.x,y:p.y,t:2.5});sfx('rift');
    for(let i=0;i<a.n;i++)setTimeout(()=>{if(!G||!e.alive)return;const c=spawnEnemy(pick(a.types),e.pi,e.wave,d+rand(-10,10));if(c)c.off=rand(-10,10)},300+i*250)},
  summonHeart(e,a){for(let i=0;i<a.n;i++)spawnFromHeart('creaking',e.wave)},
  soulDrain(e,a){if(G.souls>0){const v=Math.min(G.souls,a.amt);G.souls-=v;e.hp=Math.min(e.maxHp,e.hp+e.maxHp*a.heal);floatText(e.x,e.y-50,'-'+v+' ruh','#7fe8ff',15);sfx('soul')}},
};
/* sürekli (pasif) yetenekler */
const BOSSAB_P={
  fatigue(e,a){G.fatigue=Math.max(G.fatigue||0,a.amt)},
  crystals(e,a,st,dt){let n=0;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(G.grid[y][x].obs==='ecrystal')n++;e.crystalsAlive=n;if(n&&e.hp<e.maxHp)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.006*n*dt)},
  shield(e,a){if(!e.shieldOn&&e.hp<e.maxHp*a.below){e.shieldOn=true;banner('WITHER ZIRHI','<small>Oklar ve mermiler artık işlemiyor! Büyü, patlama, ateş kullan.</small>');sfx('wither')}},
  clone(e,a,st,dt){if(!st.used&&e.hp<e.maxHp*a.at){st.used=true;st.respawn=0;spawnClone(e,a.type);banner('HÜKÜMDAR YANKISI','<small>Yankı ölürse yeniden doğar</small>')}
    if(st.used){const alive=G.enemies.some(o=>o.alive&&o.type===a.type);if(!alive){st.respawn=(st.respawn||0)+dt;if(st.respawn>8){st.respawn=0;spawnClone(e,a.type)}}}},
  hearts(){},emerge(){},spawnBlast(){},resurrect(){},
};
function spawnClone(e,type){const c=spawnEnemy(type,e.pi,e.wave,Math.max(0,e.dist-TILE),null);if(c){c.off=12;puff(c.x,c.y-14,'#6af0d0',18);sfx('spell')}}
function dropStolen(st){const c=cell(st.tx,st.ty);if(c&&!c.tower&&!c.obs&&(c.t==='ground'||c.t==='ice')){const t=placeTowerRaw(st.type,st.tx,st.ty,st.lvl,st.spent);sparkle(t.x,t.y,'#e070ff',12);floatText(t.x,t.y-20,'Kule geri düştü!','#e070ff',15)}else{gain(st.spent);floatText(st.tx*TILE+24,st.ty*TILE,'+'+st.spent,'#7dff8f',15)}}
function removeTrap(tr){const c=cell(tr.tx,tr.ty);if(c&&c.trap===tr)c.trap=null;const i=G.traps.indexOf(tr);if(i>=0)G.traps.splice(i,1)}
