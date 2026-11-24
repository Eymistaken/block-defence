/* ============================ YETENEKLER, GÜÇLER, EŞYALAR ============================
   G.aim = {kind:'abil'|'power'|'item', id}  — nişan alma modunda haritaya tıklanır. */
function aimRadius(){const a=G.aim;if(!a)return 0;if(a.kind==='abil')return(ABIL.find(x=>x.id===a.id).r||1.6);if(a.kind==='power')return POWERS[a.id].r||1.5;if(a.kind==='item')return ITEMS[a.id].r||1;return 1}
function setAim(kind,id){if(G.aim&&G.aim.kind===kind&&G.aim.id===id)G.aim=null;else G.aim={kind,id};G.place=null;updateHotbarSel();updateAbilUI();updateBeltUI();sfx('click',true)}
function useAbility(id,x,y){
  if(!G||G.over||G.demo||G.paused)return;if(G.abil[id]>0){sfx('error');return}
  const A=ABIL.find(a=>a.id===id);
  if(A.aim&&x==null){setAim('abil',id);return}
  const cd=A.cd*(1-perk('magic')*.07);
  if(id==='tnt'){for(let i=0;i<7;i++){const a=rand(0,TAU),rr=rand(0,1.6*TILE);G.drops.push({x:x+Math.cos(a)*rr,y:y+Math.sin(a)*rr,h:rand(220,380),vh:0,fuse:rand(.7,1.1),dmg:(70+G.wave*9)*(1+perk('sharp')*.05),rad:1.05,src:null,air:true})}sfx('fuse');G.aim=null}
  else if(id==='freeze'){for(const e of G.enemies){if(!e.alive)continue;e.freezeT=e.def.boss?1:3}sfx('freeze');G.flash=.25;G.flashCol='200,235,255';
    for(let i=0;i<80;i++)addP({x:rand(0,W),y:rand(0,H),vx:rand(-20,20),vy:rand(20,60),life:1.2,max:1.2,sz:rand(2,4),c:'#ffffff',g:0})}
  else if(id==='golem'){let pi=G.walk[0],best=-1;G.walk.forEach(i=>{const n=G.enemies.filter(e=>e.pi===i&&e.alive).length;if(n>best){best=n;pi=i}});
    const P=G.paths[pi],d=P.len-TILE*.6,p=pathPos(P,d);G.golems.push({P,dist:d,x:p.x,y:p.y,life:18,pcd:0,anim:0,dir:-1,punch:0,fuse:0,t:0});sfx('golem');shake(4);dust(p.x,p.y+10,'#888',14);unlockAch('golem')}
  else if(id==='apple'){G.lives+=3;G.appleT=8;sfx('apple');for(const t of G.towers){sparkle(t.x,t.y-10,'#ffd83d',5);t.hp=Math.min(t.maxHp,t.hp+t.maxHp*.2)}floatText(W/2,H/2,'+3 ❤','#ff7070',22)}
  G.abil[id]=cd;updateAbilUI();
}
function powerCd(id){return POWERS[id].cd*(1-perk('magic')*.07)}
function usePower(id,x,y){
  if(!G||G.over||G.demo||G.paused||!(id in G.pow))return;const P=POWERS[id];
  if(G.pow[id]>0){sfx('error');return}
  if(P.soul&&G.souls<P.soul){sfx('error');floatText(W/2,H-40,'Yetersiz ruh ('+P.soul+' gerekli)','#7fe8ff',16);return}
  if(P.aim&&x==null){setAim('power',id);return}
  const wv=G.wave,sh=1+perk('sharp')*.05;
  switch(id){
  case'mace':{for(const e of G.enemies){if(!e.alive||e.def.flying)continue;if(d2(e.x,e.y,x,y)<=(P.r*TILE)**2){hitEnemy(e,(150+wv*12)*sh,'phys',null);if(e.alive){knockback(e,TILE);if(!e.def.boss)e.stunT=Math.max(e.stunT,.6)}}}
    explodeFX(x,y,P.r*TILE,true);ring(x,y,P.r*TILE*1.3,'220,230,255');sfx('punch');sfx('explosion');shake(9);for(let i=0;i<20;i++)addP({x,y,vx:rand(-200,200),vy:rand(-120,0),life:.6,max:.6,sz:3,c:'#e0e8ff',g:0,smoke:true});break}
  case'horn':{for(const e of G.enemies)if(e.alive)e.stunT=Math.max(e.stunT,e.def.boss?.5:2);G.deafT=25;sfx('goat');ring(W/2,H/2,W*.6,'230,210,170');banner('KEÇİ BOYNUZU','<small>Sensörler 25 sn sağır</small>');break}
  case'gaze':{G.gazeT=10;G.revealT=10;sfx('creakFreeze');sfx('heal');G.flash=.3;G.flashCol='255,170,60';break}
  case'bed':{G.drops.push({x,y,h:300,vh:0,fuse:1.1,dmg:(200+wv*12)*sh,rad:P.r,src:null,bed:true});sfx('bed');break}
  case'ecrystal':{G.crystals.push({x,y,t:8,max:8,dmg:(250+wv*15)*sh});sfx('crystal');break}
  case'song':{for(const t of G.towers)t.hp=Math.min(t.maxHp,t.hp+t.maxHp*.35);G.lullT=4;sfx('sing');for(const t of G.towers)sparkle(t.x,t.y-10,'#7af0e8',4);banner('ŞARKICININ ŞARKISI');break}
  case'tidecall':{G.tide=2;G.tideOverT=25;sfx('tide');banner('GELGİT: BEREKET','<small>25 saniye boyunca</small>');unlockAch('tide');break}
  case'ichorflood':{G.floods.push({x,y,r:P.r*TILE,t:6});sfx('ichor');break}
  }
  if(P.soul)G.souls-=P.soul;G.pow[id]=powerCd(id);G.aim=null;updateAbilUI();
}
/* ---------- eşyalar ---------- */
function giveItem(id,n,x,y){if(!G||G.demo||!ITEMS[id])return;n=n||1;G.items[id]=(G.items[id]||0)+n;sfx('item');
  if(x!=null)G.texts.push({x,y:y-20,txt:'+'+n+' '+ITEMS[id].name,col:'#7fe8ff',size:13,t:1.4,max:1.4});
  const I=ITEMS[id];if(I.use&&I.use!=='passive'&&!SAVE.belt.includes(id)){const k=SAVE.belt.indexOf(null);if(k>=0){SAVE.belt[k]=id;saveGame()}}
  updateBeltUI();if(UI.invOpen)renderInventory()}
function useItem(id,x,y){
  if(!G||G.over||G.demo||G.paused)return;const I=ITEMS[id];if(!I||!(G.items[id]>0)){sfx('error');return}
  if(I.use==='passive'){toast('i:'+id,I.name,'Bu eşya kendiliğinden tetiklenir.','item');return}
  if(!I.use){sfx('error');return}
  if((I.use==='aim'||I.use==='tower')&&x==null){setAim('item',id);return}
  const wv=G.wave,r=(I.r||1)*TILE,inR=e=>e.alive&&d2(e.x,e.y,x,y)<=r*r;
  switch(id){
  case'healpot':{for(const t of towersIn(x,y,I.r))t.hp=Math.min(t.maxHp,t.hp+t.maxHp*.5);sfx('glass');sfx('heal');ring(x,y,r,'255,110,160');for(let i=0;i<20;i++)addP({x,y,vx:rand(-90,90),vy:rand(-120,-20),life:.7,max:.7,sz:3,c:pick(['#f03a6a','#ffd0e0']),g:200});break}
  case'pearl':{for(const e of G.enemies)if(inR(e)&&!e.def.boss){const ox=e.x,oy=e.y;e.dist=Math.max(0,e.dist-3*TILE);const p=pathPos(e.path,e.dist);chorusFx(ox,oy,p.x,p.y)}sfx('blink');break}
  case'wind':{for(const e of G.enemies)if(inR(e)){damage(e,10,'phys',null);if(e.alive){knockback(e,1.6*TILE);if(!e.def.boss)e.stunT=Math.max(e.stunT,.5)}}ring(x,y,r,'200,210,255');sfx('smallBoom');break}
  case'goldingot':{G.baits=G.baits||[];G.baits.push({id:Math.random(),x,y,r:I.r,t:6});sfx('coin');break}
  case'resinclump':{for(const e of G.enemies)if(inR(e)&&!e.def.flying)e.rootT=Math.max(e.rootT,e.def.boss?1:3);sfx('resin');for(let i=0;i<14;i++)addP({x,y,vx:rand(-80,80),vy:rand(-80,0),life:.6,max:.6,sz:3,c:'#e87820',g:250});break}
  case'chorusfruit':{for(const e of G.enemies)if(inR(e)&&!e.def.boss){const ox=e.x,oy=e.y;e.dist=rand(0,e.dist);const p=pathPos(e.path,e.dist);chorusFx(ox,oy,p.x,p.y)}sfx('chorus');break}
  case'breath':{G.clouds.push({x,y,r,dps:45+wv*2,t:6,max:6,weak:.15,slow:0,src:null,col:'#d070d0',air:true});sfx('glass');break}
  case'firecharge':{explode(x,y,I.r,(90+wv*8),null,{fire:true});break}
  case'iceball':{for(const e of G.enemies)if(inR(e))e.freezeT=e.def.boss?1:3;sfx('freeze');ring(x,y,r,'200,235,255');break}
  case'tnt':{G.drops.push({x,y,h:320,vh:0,fuse:.9,dmg:(160+wv*12),rad:I.r,src:null,air:true});sfx('fuse');break}
  case'eyeblossom':{G.gazeT=8;G.revealT=8;sfx('creakFreeze');G.flash=.25;G.flashCol='255,170,60';break}
  case'endereye':{G.eyeT=20;sfx('blink');banner('ENDER GÖZÜ','<small>Gizliler açığa çıktı, yaratıklar %15 fazla hasar alıyor</small>');break}
  case'soulfruit':{addSouls(40,W/2,H/2);G.lives+=2;sfx('heal');break}
  case'compass':{const lost=Math.max(0,G.maxLives-G.lives);if(!lost){sfx('error');floatText(W/2,H-40,'Kaybedilmiş can yok','#ff8080',15);return}G.lives+=Math.min(5,lost);sfx('levelup');break}
  case'netherite':{const c=cell(Math.floor(x/TILE),Math.floor(y/TILE));if(!c||!c.tower||!applyNetherite(c.tower))return;break}
  }
  G.items[id]--;G.aim=null;updateBeltUI();updateAbilUI();if(UI.invOpen)renderInventory();
}
function canCraft(R){return R.ing.every(([id,n])=>(G.items[id]||0)>=n)}
function craft(i){const R=RECIPES[i];if(!G||G.demo||!canCraft(R)){sfx('error');return}for(const[id,n]of R.ing)G.items[id]-=n;G.items[R.out]=(G.items[R.out]||0)+R.n;sfx('craft');unlockAch('craft');SAVE.crafted++;
  const I=ITEMS[R.out];if(I.use&&I.use!=='passive'&&!SAVE.belt.includes(R.out)){const k=SAVE.belt.indexOf(null);if(k>=0)SAVE.belt[k]=R.out}saveGame();renderInventory();updateBeltUI()}
/* ---------- Demir Golem ---------- */
function updateGolems(dt){
  for(let i=G.golems.length-1;i>=0;i--){const gm=G.golems[i];gm.life-=dt;gm.pcd-=dt;gm.t+=dt;gm.punch=Math.max(0,gm.punch-dt);
    let near=null,nd=40*40;for(const e of G.enemies){if(!e.alive||e.def.flying)continue;const dd=d2(e.x,e.y,gm.x,gm.y);if(dd<nd){nd=dd;near=e}}
    if(near){if(gm.pcd<=0){gm.pcd=.75;gm.punch=.35;hitEnemy(near,(50+G.wave*6)*(1+perk('sharp')*.05),'phys',null);knockback(near,.6*TILE);sfx('punch');dust(near.x,near.y,'#ccc',5);gm.dir=near.x>gm.x?1:-1}}
    else if(gm.dist>0){gm.dist-=TILE*.75*dt;gm.anim+=dt*4.5;const p=pathPos(gm.P,gm.dist);if(Math.abs(p.x-gm.x)>.05)gm.dir=p.x>gm.x?1:-1;gm.x=p.x;gm.y=p.y}
    if(gm.life<=0){blockBreak(gm.x,gm.y-10,TX.iron[0]);sfx('breakBlock');G.golems.splice(i,1)}}
}
