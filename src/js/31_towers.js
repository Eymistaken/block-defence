/* ============================ KULE MANTIĞI ============================ */
function towerCost(type,lvl){let c=TOWERS[type].lv[Math.min(lvl,3)].cost;if(lvl>0)c*=1-perk('master')*.04;return Math.round(c)}
function canAfford(c){return G.diff.creative||G.demo||G.money>=c}
function spend(c){if(!G.diff.creative&&!G.demo)G.money-=c}
function gain(c){G.money+=c;if(c>0)G.stats.earned+=c;if(G.money>=2000&&!G.diff.creative)unlockAch('rich')}
function canPlace(type,tx,ty){const c=cell(tx,ty);if(!c)return false;const D=TOWERS[type];
  if(D.trap)return c.t==='path'&&!c.trap;return(c.t==='ground'||c.t==='ice')&&!c.obs&&!c.tower}
function towerMaxHp(t){return Math.round(TOWER_HP[t.lvl]*(TOWERS[t.type].hpm||1)*(1+perk('unbreak')*.08))}
function placeTowerRaw(type,tx,ty,lvl,spent){const c=cell(tx,ty),x=tx*TILE+TILE/2,y=ty*TILE+TILE/2;
  const t={type,lvl,tx,ty,x,y,cd:.3,ang:-Math.PI/2,mode:type==='ballista'?2:0,kills:0,dmg:0,spent,stunT:0,recoil:0,punch:0,builtAt:G.wave,buff:{},trickT:0,fx:{},hp:1,maxHp:1,lastShot:-99,shots:0,charge:0,charges:type==='anchor'?1:0,ring:0,healFx:0,zapT:0,blubT:2};
  c.tower=t;G.towers.push(t);recomputeBuffs();t.maxHp=towerMaxHp(t);t.hp=t.maxHp;return t}
function buildTower(type,tx,ty){
  if(!unlockedTower(type)){sfx('error');return false}
  if(!canPlace(type,tx,ty)){sfx('error');return false}
  const cost=towerCost(type,0);if(!canAfford(cost)){sfx('error');floatText(tx*TILE+24,ty*TILE+10,'Yetersiz zümrüt!','#ff5555',15);return false}
  spend(cost);const x=tx*TILE+TILE/2,y=ty*TILE+TILE/2;
  if(TOWERS[type].trap){const tr={type,tx,ty,x,y,life:TOWERS[type].lv[0].life||1e9,dur:type==='web'?14:1};cell(tx,ty).trap=tr;G.traps.push(tr);sfx('place');dust(x,y,'#bbb',8);return true}
  placeTowerRaw(type,tx,ty,0,cost);
  sfx('place');dust(x,y+14,'#9a8a6a',12);G.stats.built++;
  if(G.stats.built>=12)unlockAch('builder');
  tutorialStep('built');return true;
}
function computeStats(t){
  const D=TOWERS[t.type],s=Object.assign({},towerLv(t.type,t.lvl)),b=t.buff||{};
  const dm=(1+perk('sharp')*.05)*(1+(b.dmg||0));
  for(const k of['dmg','dps','burn','zap'])if(s[k])s[k]*=dm;
  if(s.range)s.range*=(1+perk('range')*.03)*(1+(b.range||0));
  if(s.cd)s.cd/=(1+perk('haste')*.04)*(1+(b.rate||0));
  t.s=s;t.detect=t.lvl>=2||!!b.camo;
  const mh=towerMaxHp(t);if(t.maxHp&&mh!==t.maxHp){t.hp=t.hp*mh/t.maxHp}t.maxHp=mh;
}
function recomputeBuffs(){
  for(const t of G.towers)t.buff={};
  for(const bt of G.towers){if(bt.type!=='beacon'&&bt.type!=='conduit')continue;const L=towerLv(bt.type,bt.lvl),r2=(L.radius*TILE)**2;
    for(const t of G.towers){if(t===bt||TOWERS[t.type].support||TOWERS[t.type].eco||TOWERS[t.type].block)continue;if(d2(t.x,t.y,bt.x,bt.y)<=r2+1){const b=t.buff;b.dmg=Math.max(b.dmg||0,L.bDmg||0);b.range=Math.max(b.range||0,L.bRange||0);b.rate=Math.max(b.rate||0,L.bRate||0);if(bt.type==='beacon')b.camo=true;if(bt.type==='conduit')b.conduit=true}}}
  for(const t of G.towers)computeStats(t);
}
function upgradeTower(t){
  if(t.lvl>=3){if(t.lvl===3)toast('i:netherite','Netherit gerekli','Elmas kuleyi Netherit Külçesi ile yükseltebilirsin (Envanter → Kemer).','item');return}
  const c=towerCost(t.type,t.lvl+1);if(!canAfford(c)){sfx('error');return}
  spend(c);t.lvl++;t.spent+=c;const old=t.maxHp;recomputeBuffs();t.hp=Math.min(t.maxHp,t.hp+(t.maxHp-old));sfx('upgrade');sparkle(t.x,t.y,'#ffd83d',16);
  if(t.lvl===3)unlockAch('maxed');refreshPanel(true);
}
function applyNetherite(t){if(!t||t.lvl!==3||TOWERS[t.type].trap||TOWERS[t.type].block){sfx('error');floatText(G.mouse.x,G.mouse.y,'Elmas seviyede bir kule seç','#ff8080',15);return false}
  t.lvl=4;recomputeBuffs();t.hp=t.maxHp;sfx('netherite');sparkle(t.x,t.y,'#b890ff',24);ring(t.x,t.y,60,'180,140,255');unlockAch('netherite');refreshPanel(true);return true}
function repairCost(t){return Math.ceil((t.maxHp-t.hp)/t.maxHp*Math.max(40,t.spent)*.35)}
function repairTower(t){if(t.hp>=t.maxHp)return;if(t.fx.dotK==='wither'&&t.fx.dotT>0){sfx('error');floatText(t.x,t.y-24,'Solma onarımı engelliyor!','#aaaaaa',14);return}
  const c=repairCost(t);if(!canAfford(c)){sfx('error');return}spend(c);G.stats.repaired+=t.maxHp-t.hp;t.hp=t.maxHp;sfx('repair');sparkle(t.x,t.y,'#a8ffb0',10);refreshPanel(true);checkRepairAch()}
function checkRepairAch(){if(G.stats.repaired>=2000)unlockAch('repair')}
function sellValue(t){return(t.builtAt===G.wave&&G.waves.length===0&&G.enemies.length===0)?t.spent:Math.floor(t.spent*.7*(.5+.5*t.hp/t.maxHp))}
function removeTower(t){const c=cell(t.tx,t.ty);if(c&&c.tower===t)c.tower=null;const i=G.towers.indexOf(t);if(i>=0)G.towers.splice(i,1);if(G.sel===t)selectTower(null);recomputeBuffs()}
function sellTower(t){const v=sellValue(t);G.money+=v;removeTower(t);sfx('sell');floatText(t.x,t.y-10,'+'+v,'#7dff8f',16);blockBreak(t.x,t.y,TX[LV_TEX[t.lvl]][0])}
/* ---------- kuleye hasar ---------- */
function damageTower(t,amt,eff,opt){
  if(!t||!G.towers.includes(t)||G.demo)return;opt=opt||{};
  let a=amt*G.diff.atk;
  if(!opt.pierce){if(t.lvl>=4)a*=.8;for(const an of G.towers)if(an.type==='anvil'&&an.s.shield&&d2(an.x,an.y,t.x,t.y)<=(an.s.radius*TILE)**2){a*=1-an.s.shield;break}}
  if(eff&&eff.burn&&t.lvl>=4)eff=null;
  t.hp-=a;t.hitT=.15;if(a>=1&&SAVE.settings.dmgNums)floatText(t.x+rand(-6,6),t.y-30,'-'+Math.round(a),'#ff9a6a',12);sfx('towerHit');
  if(eff)applyTowerEffect(t,eff);
  if(t.hp<=0)destroyTower(t);
}
function applyTowerEffect(t,e){const f=t.fx;
  if(e.stun)t.stunT=Math.max(t.stunT,e.stun);
  if(e.freeze){t.stunT=Math.max(t.stunT,e.freeze);f.frozenT=Math.max(f.frozenT||0,e.freeze)}
  if(e.lev){t.stunT=Math.max(t.stunT,e.lev);f.levT=Math.max(f.levT||0,e.lev);sfx('levitate')}
  if(e.silk){t.stunT=Math.max(t.stunT,e.silk);f.silkT=Math.max(f.silkT||0,e.silk)}
  if(e.amber){t.stunT=Math.max(t.stunT,e.amber);f.amberT=Math.max(f.amberT||0,e.amber)}
  if(e.moss){t.stunT=Math.max(t.stunT,e.moss);f.mossT=Math.max(f.mossT||0,e.moss)}
  if(e.slow){f.slow=Math.max(f.slowT>0?f.slow:0,e.slow);f.slowT=Math.max(f.slowT||0,e.t||3)}
  if(e.weak){f.weak=Math.max(f.weakT>0?f.weak:0,e.weak);f.weakT=Math.max(f.weakT||0,e.t||3)}
  if(e.resin){f.resinT=Math.max(f.resinT||0,e.resin)}
  if(e.dark){f.dark=e.dark;f.darkT=Math.max(f.darkT||0,e.t||3)}
  for(const k of['poison','burn','wither'])if(e[k]){f.dotK=k;f.dotDps=Math.max(f.dotT>0?f.dotDps:0,e[k]);f.dotT=Math.max(f.dotT||0,e.t||3)}
}
function destroyTower(t){
  const lvl=t.lvl,type=t.type;removeTower(t);G.stats.lost++;
  blockBreak(t.x,t.y,TX[LV_TEX[lvl]][0]);blockBreak(t.x,t.y-12,TX[LV_TEX[lvl]][0]);sfx('towerBreak');shake(4);floatText(t.x,t.y-20,'YIKILDI!','#ff5040',17);
  /* Diriltici: yakındaki yüklü bir çapa kuleyi yeniden kurar */
  for(const an of G.towers){if(an.type!=='anchor'||an.charges<=0)continue;if(d2(an.x,an.y,t.x,t.y)<=(an.s.radius*TILE)**2){an.charges--;
    const nt=placeTowerRaw(type,t.tx,t.ty,lvl,t.spent);nt.hp=nt.maxHp*.5;nt.kills=t.kills;nt.dmg=t.dmg;nt.mode=t.mode;sfx('anchor');ring(t.x,t.y,50,'190,120,255');
    G.beams.push({x1:an.x,y1:an.y-14,x2:t.x,y2:t.y-10,t:.6,max:.6,col:'200,120,255'});floatText(t.x,t.y-34,'Diriltildi!','#d8a8ff',16);return}}
}
function findTarget(t,range,exclude){
  const D=TOWERS[t.type],r2=(range*TILE)**2,seeAll=G.revealT>0||G.eyeT>0;let best=null,bv=-Infinity;
  for(const e of G.enemies){if(!e.alive||(exclude&&exclude.has(e)))continue;if(!targetable(e,t,D,seeAll))continue;
    const dd=d2(t.x,t.y,e.x,e.y);if(dd>r2)continue;let v;
    switch(t.mode){case 0:v=-(e.path.len-e.dist);break;case 1:v=e.path.len-e.dist;break;case 2:v=e.hp;break;case 3:v=-e.hp;break;default:v=-dd}
    if(e.def.illusion)v+=1e5;if(v>bv){bv=v;best=e}}
  return best;
}
function targetable(e,t,D,seeAll){
  if(e.def.flying&&!D.air&&!(e.levT>0))return false;
  if(e.def.camo&&!(t&&t.detect)&&!seeAll&&!(e.glowT>0)&&!(e.revealT>0))return false;
  if(e.invuln&&e.def.creaking)return false;
  if(e.burrowT>0||e.emergeT>0)return false;
  if(e.def.physImm&&D.dmgType==='phys')return false;
  if(e.shieldOn&&D.proj)return false;
  if(e.invisT>0&&!seeAll)return false;
  return true;
}
function critRoll(base){return Math.random()<perk('luck')*.03+(base||0)}
/* anlık çarpanlar */
function towerRateMul(t){let m=1;if(G.appleT>0)m*=1.5;if(G.tide===2)m*=1.25;const f=t.fx;if(f.slowT>0)m*=1-f.slow;if(f.resinT>0)m*=.5;
  if(G.fatigue)m*=1-G.fatigue;for(const c of G.crystals)if(d2(c.x,c.y,t.x,t.y)<(2.5*TILE)**2){m*=1.4;break}return m}
function towerRangeMul(t){let m=1;if(G.darkT>0)m*=1-G.darkAmt;if(G.sandT>0)m*=.85;if(t.fx.darkT>0)m*=1-t.fx.dark;if(t.fx.blindT>0)m*=1-t.fx.blind;return m}
function towerDmgMul(t){return t.fx.weakT>0?1-t.fx.weak:1}
function updateTower(t,dt){
  const s=t.s,f=t.fx;t.recoil=Math.max(0,t.recoil-dt*4);t.punch=Math.max(0,t.punch-dt);t.ring=Math.max(0,t.ring-dt);t.healFx-=dt;t.hitT=Math.max(0,(t.hitT||0)-dt);
  for(const k of['frozenT','levT','silkT','amberT','mossT','slowT','weakT','resinT','darkT','blindT'])if(f[k]>0)f[k]-=dt;
  if(f.dotT>0){f.dotT-=dt;t.hp-=f.dotDps*dt*G.diff.atk;if(t.hp<=0){destroyTower(t);return}}
  if(perk('mending')&&t.hp<t.maxHp&&!(f.dotK==='wither'&&f.dotT>0))t.hp=Math.min(t.maxHp,t.hp+t.maxHp*.002*perk('mending')*dt);
  if(G.tide===2&&t.hp<t.maxHp)t.hp=Math.min(t.maxHp,t.hp+t.maxHp*.01*dt);
  if(t.stunT>0){t.stunT-=dt;return}
  const rate=towerRateMul(t);
  switch(t.type){
  case'mine':if(s.trickle){t.trickT+=dt;if(t.trickT>=3){t.trickT=0;if(G.waves.length)gain(1)}}return;
  case'beacon':case'wool':return;
  case'anvil':{const r2=(s.radius*TILE)**2;let any=false;for(const o of G.towers){if(o===t||o.hp>=o.maxHp)continue;if(o.fx.dotK==='wither'&&o.fx.dotT>0)continue;if(d2(o.x,o.y,t.x,t.y)<=r2){const a=Math.min(o.maxHp-o.hp,s.heal*dt);o.hp+=a;G.stats.repaired+=a;any=true;if(Math.random()<dt*3)sparkle(o.x,o.y-12,'#c8ffd0',1)}}
    if(any){t.healFx=.3;t.anvT=(t.anvT||0)-dt;if(t.anvT<=0){t.anvT=1.4;sfx('anvil')}}checkRepairAch();return}
  case'anchor':return;
  case'conduit':{t.zapT-=dt*rate;if(t.zapT<=0){const tg=findTarget(t,s.radius);if(tg){t.zapT=s.zapCd;hitEnemy(tg,s.zap*towerDmgMul(t),'magic',t);G.bolts.push({pts:jag([{x:t.x,y:t.y-14},{x:tg.x,y:tg.y-10}]),t:.15,col:'cyan'});sfx('zap')}else t.zapT=.3}return}
  case'bell':{t.cd-=dt*rate;if(t.cd<=0){const r2=(s.radius*TILE)**2;let hit=0;for(const e of G.enemies){if(!e.alive||!e.def.illager)continue;if(d2(e.x,e.y,t.x,t.y)<=r2){e.glowT=s.glowT;e.amp=s.amp;e.ampT=s.glowT;if(s.stun&&!e.def.boss)e.stunT=Math.max(e.stunT,s.stun);hit++}}
      if(hit){t.cd=s.cd;t.ring=1;sfx('bell');ring(t.x,t.y,s.radius*TILE,'255,220,120')}else t.cd=.5}return}
  case'eyepot':return;
  case'blubhut':{t.blubT-=dt*rate;if(t.blubT<=0&&G.enemies.some(e=>e.alive&&!e.def.flying)){t.blubT=s.cd;for(let i=0;i<s.n;i++)sendBlub(t,s)}return}
  case'soulfire':{const r2=(s.radius*TILE)**2;for(const e of G.enemies){if(!e.alive||e.def.flying)continue;if(d2(e.x,e.y,t.x,t.y)<=r2){damage(e,s.dps*dt*(e.def.fireImm?.5:1)*towerDmgMul(t),'soul',t);if(s.slow){e.slow=Math.max(e.slow,s.slow);e.slowT=Math.max(e.slowT,.3)}}}
    if(Math.random()<dt*10)addP({x:t.x+rand(-s.radius*TILE,s.radius*TILE)*.7,y:t.y+rand(-12,12),vx:0,vy:-25,life:.6,max:.6,sz:2,c:pick(['#2ab8d8','#8af0ff']),g:0});return}
  case'calsensor':{if(t.charge>=s.charge){t.charge=0;const r2=(s.pulse*TILE)**2;for(const e of G.enemies){if(!e.alive)continue;if(d2(e.x,e.y,t.x,t.y)<=r2){hitEnemy(e,s.dmg*towerDmgMul(t),'magic',t);e.slow=Math.max(e.slow,s.slow);e.slowT=Math.max(e.slowT,2)}}
      ring(t.x,t.y,s.pulse*TILE,'60,230,255');sfx('sonicBoom');addLight(t.x,t.y,120,.8)}return}
  }
  t.cd-=dt*rate;
  const range=(s.range||0)*towerRangeMul(t);
  const tg=findTarget(t,range);
  if(tg){const a=Math.atan2(tg.y-t.y,tg.x-t.x);let da=a-t.ang;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;t.ang+=da*Math.min(1,dt*14)}
  if(t.cd>0||!tg)return;
  t.cd=s.cd;fireTower(t,tg,s,range);t.lastShot=G.time;t.shots++;emitVibration(t);
}
function fireTower(t,tg,s,range){
  const mx=t.x+Math.cos(t.ang)*14,my=t.y-4+Math.sin(t.ang)*14,dm=towerDmgMul(t);
  switch(t.type){
  case'archer':{const targets=[tg];if(s.multi){const ex=new Set([tg]);for(let i=1;i<s.multi;i++){const o=findTarget(t,range,ex);if(o){targets.push(o);ex.add(o)}}}
    targets.forEach((e,i)=>G.projs.push({k:'arrow',x:mx,y:my+i*3,tg:e,spd:560,dmg:s.dmg*dm,src:t}));sfx('arrow');break}
  case'ice':G.projs.push({k:'ice',x:mx,y:my,tg,spd:420,dmg:s.dmg*dm,src:t,s});sfx('ice');break;
  case'fire':{const targets=[tg];if(s.spread){const ex=new Set([tg]);for(let i=1;i<s.spread;i++){const o=findTarget(t,range,ex);if(o){targets.push(o);ex.add(o)}}}
    targets.forEach(e=>G.projs.push({k:'fire',x:mx,y:my,tg:e,spd:380,dmg:s.dmg*dm,src:t,s}));sfx('fire');break}
  case'resin':G.projs.push({k:'resin',x:mx,y:my,tg,spd:330,dmg:s.dmg*dm,src:t,s});sfx('resin');break;
  case'shulker':{const targets=[tg];if(s.multi){const o=findTarget(t,range,new Set([tg]));if(o)targets.push(o)}targets.forEach(e=>G.projs.push({k:'shulker',x:t.x,y:t.y-14,tg:e,spd:200,dmg:s.dmg*dm,src:t,s,vx:rand(-60,60),vy:-80}));sfx('shulker');break}
  case'tnt':{const ft=.8,fp=pathPos(tg.path,tg.dist+effSpeed(tg)*ft);G.projs.push({k:'tnt',x:mx,y:my,sx:mx,sy:my,ex:fp.x-fp.dy*tg.off,ey:fp.y+fp.dx*tg.off,T:ft,t:0,src:t,s,rot:0,dm});t.recoil=1;sfx('fuse');break}
  case'potion':{const ft=.75,fp=pathPos(tg.path,tg.dist+effSpeed(tg)*ft);G.projs.push({k:'potion',x:t.x,y:t.y-20,sx:t.x,sy:t.y-20,ex:fp.x,ey:fp.y,T:ft,t:0,src:t,s,rot:0,col:pick(['#a040c0','#40c060']),dm});sfx('throwIt');break}
  case'ballista':{const a=Math.atan2(tg.y-t.y,tg.x-t.x);G.projs.push({k:'bolt',x:t.x,y:t.y-4,vx:Math.cos(a)*720,vy:Math.sin(a)*720,left:range*TILE*1.15,hit:new Set(),pierce:s.pierce,dmg:s.dmg*dm,src:t,s,ang:a});sfx('ballista');break}
  case'piston':{const list=s.allHit?G.enemies.filter(e=>e.alive&&!e.def.flying&&targetable(e,t,TOWERS.piston,false)&&d2(t.x,t.y,e.x,e.y)<=(range*TILE)**2):[tg];
    t.punch=.3;sfx('piston');for(const e of list){hitEnemy(e,s.dmg*dm,'phys',t);knockback(e,s.knock*TILE);dust(e.x,e.y+8,'#bbb',4)}break}
  case'lightning':{const hit=new Set(),pts=[{x:t.x,y:t.y-32}];let cur=tg,dmg=s.dmg*dm,chain=s.chain+prismBonus(t);
    for(let i=0;i<chain&&cur;i++){hit.add(cur);pts.push({x:cur.x,y:cur.y-10});hitEnemy(cur,dmg,'magic',t);if(s.stun&&cur.alive&&!cur.def.boss)cur.stunT=Math.max(cur.stunT,s.stun);
      dmg*=.85;let nx=null,nd=(1.8*TILE)**2;for(const e of G.enemies){if(!e.alive||hit.has(e))continue;if(!targetable(e,t,TOWERS.lightning,false))continue;const dd=d2(cur.x,cur.y,e.x,e.y);if(dd<nd){nd=dd;nx=e}}cur=nx}
    G.bolts.push({pts:jag(pts),t:.2});if(hit.size>=5)unlockAch('chain');sfx('zap');addLight(t.x,t.y-30,90,.9);break}
  case'chorus':{const ex=new Set();for(let i=0;i<s.n;i++){const e=i===0?tg:findTarget(t,range,ex);if(!e)break;ex.add(e);hitEnemy(e,s.dmg*dm,'magic',t);
      if(e.alive&&!e.def.boss){const ox=e.x,oy=e.y;e.dist=Math.max(0,e.dist-s.tp*TILE);const p=pathPos(e.path,e.dist);e.x=p.x;e.y=p.y;chorusFx(ox,oy,e.x,e.y)}}sfx('chorus');break}
  case'echogolem':{const adj=adjIchor(t.tx,t.ty);const r2=(s.splash*TILE)**2;for(const e of G.enemies){if(!e.alive)continue;if(d2(e.x,e.y,tg.x,tg.y)<=r2&&(D_air(t)||!e.def.flying)){hitEnemy(e,s.dmg*dm*(e===tg?1:.6),'magic',t);e.slow=Math.max(e.slow,s.slow);e.slowT=Math.max(e.slowT,1.5)}}
    ring(tg.x,tg.y,s.splash*TILE,'120,240,230');G.beams.push({x1:t.x,y1:t.y-24,x2:tg.x,y2:tg.y-10,t:.25,max:.25,col:'120,240,230',wave:true});sfx('sing');if(adj)t.cd*=.7;break}
  }
}
const D_air=t=>!!TOWERS[t.type].air;
function adjIchor(tx,ty){for(const[i,j]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=cell(tx+i,ty+j);if(c&&(c.t==='ichor'||c.under==='ichor'))return true}return false}
function prismBonus(t){let n=0;for(const[i,j]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const c=cell(t.tx+i,t.ty+j);if(c&&c.obs==='cryst')n++}return Math.min(2,n)}
function chorusFx(x1,y1,x2,y2){for(let i=0;i<10;i++){const f=i/9;addP({x:lerp(x1,x2,f),y:lerp(y1,y2,f)-10,vx:rand(-10,10),vy:rand(-20,0),life:.6,max:.6,sz:2,c:pick(['#c8a0d8','#8a5ab0']),g:0,star:true})}}
function jag(pts){const out=[pts[0]];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];for(let k=1;k<=4;k++){const f=k/4;out.push({x:lerp(a.x,b.x,f)+(k<4?rand(-7,7):0),y:lerp(a.y,b.y,f)+(k<4?rand(-7,7):0)})}}return out}
/* Blub Yuvası: blub yola zıplar, çarpan yaratıkları durdurur */
function sendBlub(t,s){let best=null,bd=Infinity;for(const i of G.walk){const r=nearestDist(G.paths[i],t.x,t.y);if(r.dd<bd){bd=r.dd;best={pi:i,d:r.d}}}
  if(!best||bd>(3.2*TILE)**2)return;const P=G.paths[best.pi];const d=Math.max(TILE,best.d-rand(0,TILE));const p=pathPos(P,d);
  G.blubBlocks.push({P,dist:d,x:t.x,y:t.y,tx:p.x,ty:p.y,hop:0,life:s.life,block:s.block,land:false,t:0});sfx('squeak')}

/* ============================ TİTREŞİM (Karanlık Derinlikler) ============================ */
function emitVibration(t){
  if(!G.map.mech||!G.map.mech.vib)return;const v=TOWERS[t.type].vib||0;if(!v)return;
  for(const o of G.towers){if(o.type==='wool'&&d2(o.x,o.y,t.x,t.y)<=(o.s.radius*TILE)**2+1)return}
  for(const o of G.towers){if(o.type==='calsensor'&&o!==t&&d2(o.x,o.y,t.x,t.y)<=(o.s.radius*TILE)**2+1){o.charge=Math.min(o.s.charge,(o.charge||0)+v);return}}
  for(const e of G.enemies)if(e.alive&&e.def.vibCamo&&d2(e.x,e.y,t.x,t.y)<(3*TILE)**2)e.revealT=1.6;
  if(G.deafT>0)return;
  let heard=false;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.obs!=='sensor')continue;const sx=x*TILE+24,sy=y*TILE+24;
    if(d2(sx,sy,t.x,t.y)>(3.5*TILE)**2)continue;if((c.sCd||0)>G.time)continue;c.sCd=G.time+2.2;c.fxT=G.time+1;heard={x:sx,y:sy};
    G.beams.push({x1:t.x,y1:t.y-10,x2:sx,y2:sy-6,t:.45,max:.45,col:'41,223,235',dash:true})}
  if(!heard)return;sfx('sensor');G.noise+=v;
  if(G.noise>=6){G.noise=0;shriek(heard.x,heard.y)}
}
function shriek(x,y){
  let best=null,bd=Infinity;for(let yy=0;yy<ROWS;yy++)for(let xx=0;xx<COLS;xx++){const c=G.grid[yy][xx];if(c.obs!=='shrieker')continue;const dd=d2(x,y,xx*TILE+24,yy*TILE+24);if(dd<bd){bd=dd;best={c,x:xx*TILE+24,y:yy*TILE+24}}}
  if(!best)return;best.c.fxT=G.time+2;
  G.warn=Math.min(4,G.warn+1);G.warnMax=Math.max(G.warnMax,G.warn);sfx('shriek');ring(best.x,best.y,140,'41,223,235');
  for(let i=0;i<20;i++)addP({x:best.x,y:best.y-12,vx:rand(-30,30),vy:rand(-90,-40),life:1.2,max:1.2,sz:rand(2,4),c:pick(['#29dfeb','#bfffff']),g:0,smoke:true});
  darkness(4,.22);
  const txt=['','Muhafız yaklaşıyor...','Muhafız ilerliyor...','Muhafız çok yakın!','MUHAFIZ UYANDI!'][G.warn];
  floatText(best.x,best.y-30,txt,'#7af0e8',18);
  if(G.warn>=4){G.warn=0;G.sneakOk=false;setTimeout(()=>{if(G&&!G.over)wardenEmerge(best.x,best.y)},1500)}
}
function darkness(t,amt){G.darkT=Math.max(G.darkT,t);G.darkAmt=Math.max(G.darkT>0?G.darkAmt:0,amt);G.darkPulse=1;sfx('darkness')}
function wardenEmerge(x,y){
  if((G.wardenOut&&G.wardenOut.alive)||(G.boss&&G.boss.def.draw==='warden'))return;
  let bi=0,bd=Infinity,bdist=0;G.walk.forEach(i=>{const r=nearestDist(G.paths[i],x,y);if(r.dd<bd){bd=r.dd;bi=i;bdist=r.d}});
  const dw={alive:0,leaks:0,hpMul:1,bossMul:G.diff.hp*(G.map.hpm||1)*(1+G.wave*.03),n:G.wave};
  const e=spawnEnemy('warden',bi,dw,bdist,null,{roam:true,hpScale:.3});if(!e)return;
  e.roam=true;e.roamT=42;G.wardenOut=e;banner('MUHAFIZ UYANDI','<small>Kör ama her titreşimi duyuyor. 40 sn sonra toprağa döner.</small>');shake(10);
}
