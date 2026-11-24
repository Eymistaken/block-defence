/* ============================ OYUN DURUMU & HARİTA ============================ */
let G=null;
const canvas=$('game'),ctx=canvas.getContext('2d');canvas.width=W;canvas.height=H;
const bgCanvas=mkCanvas(W,H),bctx=bgCanvas.getContext('2d');
const LW=W/2,LH=H/2,lightCanvas=mkCanvas(LW,LH),lctx=lightCanvas.getContext('2d');
[ctx,bctx].forEach(c=>c.imageSmoothingEnabled=false);

function buildPath(wps){const pts=wps.map(([c,r])=>({x:c*TILE+TILE/2,y:r*TILE+TILE/2})),seg=[];let len=0;
  for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],l=Math.hypot(b.x-a.x,b.y-a.y);seg.push({a,b,l,s:len,dx:(b.x-a.x)/l,dy:(b.y-a.y)/l});len+=l}return{pts,seg,len,wps}}
function pathPos(P,d){d=clamp(d,0,P.len);for(const s of P.seg){if(d<=s.s+s.l){const k=d-s.s;return{x:s.a.x+s.dx*k,y:s.a.y+s.dy*k,dx:s.dx,dy:s.dy}}}const s=P.seg[P.seg.length-1];return{x:s.b.x,y:s.b.y,dx:s.dx,dy:s.dy}}
/* bir noktaya yoldaki en yakın mesafe */
function nearestDist(P,x,y){let best=0,bd=Infinity;for(let d=0;d<=P.len;d+=6){const p=pathPos(P,d),dd=d2(p.x,p.y,x,y);if(dd<bd){bd=dd;best=d}}return{d:best,dd:bd}}
function cell(tx,ty){return(tx>=0&&ty>=0&&tx<COLS&&ty<ROWS)?G.grid[ty][tx]:null}
const isDayNight=()=>!!(G&&G.biome.dn);
function unlockedTower(type){const D=TOWERS[type];if(G&&(G.diff.creative||G.demo))return true;return(D.need||0)<=doneCount()}
function realmTowers(){return BASE_ORDER.concat(REALM_TOWERS[G.realm]||[])}

function newGame(mapIdx,diffKey,endless,demo){
  const M=MAPS[mapIdx],D=DIFFS[diffKey],B=BIOMES[M.biome];
  G={mapIdx,map:M,biome:B,realm:M.realm,dim:M.dim,diff:D,diffKey,endless:!!endless,demo:!!demo,
    money:Math.round((M.money*D.start)+(demo?0:perk('rich')*30)),lives:D.lives+(D.creative?0:perk('health')*2),
    wave:0,totalWaves:endless?Infinity:M.waves,waves:[],enemies:[],towers:[],traps:[],projs:[],eprojs:[],parts:[],texts:[],clouds:[],bolts:[],orbs:[],golems:[],drops:[],weather:[],rings:[],beams:[],
    blubs:[],blubBlocks:[],crystals:[],floods:[],stolen:[],
    time:0,speed:1,paused:false,over:false,sel:null,place:null,hover:null,mouse:{x:-99,y:-99,in:false},mining:null,shake:0,tod:0,todT:0,flash:0,hurtFx:0,rain:false,thunderT:rand(8,16),
    abil:{tnt:0,freeze:0,golem:0,apple:0},pow:{},aim:null,appleT:0,boss:null,eid:0,nextDef:null,autoT:-1,
    stats:{kills:0,built:0,leaked:0,earned:0,mined:0,dmg:0,xp:0,lost:0,repaired:0},grid:[],decor:[],lights:[],animTiles:[],rng:mulberry32(hashStr(M.id)),
    warn:0,noise:0,deafT:0,darkT:0,darkAmt:0,darkPulse:0,wardenOut:null,sneakOk:true,warnMax:0,
    tide:null,tideOverT:0,souls:0,gazeT:0,revealT:0,eyeT:0,sandT:0,sandCd:rand(25,40),storm:false,lastLeak:0,
    items:{},itemsStart:{},hotbar:[],hbSel:-1,lifeLabel:DIMS[M.dim].base};
  (REALM_POWERS[G.realm]||[]).forEach(p=>G.pow[p]=0);
  if(M.mech&&M.mech.tides){G.tide=0;G.souls=20}
  G.maxLives=G.lives;
  G.paths=M.paths.map(buildPath);G.walk=G.paths.map((p,i)=>i);
  (M.lavaPaths||[]).forEach(wp=>{const P=buildPath(wp);P.lava=true;G.paths.push(P)});
  G.lavaIdx=G.paths.map((p,i)=>p.lava?i:-1).filter(i=>i>=0);
  for(let y=0;y<ROWS;y++){G.grid.push([]);for(let x=0;x<COLS;x++)G.grid[y].push({t:'ground',obs:null,tower:null,trap:null,v:Math.floor(G.rng()*4)})}
  const T=M.terrain||{},rect=(list,t)=>(list||[]).forEach(([x,y,w,h])=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){const c=cell(i,j);if(c)c.t=t}});
  for(const k of['water','lava','void','ichor','acid','rift','chasm','wall','ice'])rect(T[k],k);
  for(const P of G.paths){if(P.lava)continue;const wps=P.wps;for(let i=0;i<wps.length-1;i++){let[x0,y0]=wps[i];const[x1,y1]=wps[i+1];const sx=Math.sign(x1-x0),sy=Math.sign(y1-y0);
    while(true){const c=cell(x0,y0);if(c){if(c.t!=='path')c.under=c.t;c.t='path'}if(x0===x1&&y0===y1)break;x0+=sx;y0+=sy}}}
  const FX=M.pathFx||{};for(const k in FX)FX[k].forEach(([x,y,w,h])=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){const c=cell(i,j);if(c&&c.t==='path')c.fx=k}});
  const rng=G.rng;
  for(const[k,x,y]of(M.feats||[])){const c=cell(x,y);if(c&&(c.t==='ground'||c.t==='ice')){c.obs=k;c.feat=true;if(k==='cheart'||k==='bheart')c.heartId=x+','+y}}
  const obsKeys=Object.keys(M.obs||{});
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if((c.t!=='ground'&&c.t!=='ice')||c.obs)continue;
    let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const n=cell(x+i,y+j);if(n&&n.t==='path')near=true}
    let roll=rng()*(near?1.9:1),acc=0;
    for(const k of obsKeys){acc+=M.obs[k];if(roll<acc){c.obs=k;break}}
    if(!c.obs&&rng()<.38)G.decor.push({x:x*TILE+6+rng()*36,y:y*TILE+6+rng()*36,k:Math.floor(rng()*6),s:rng()});
  }
  const torches=B.torch||0;for(let i=0,n=0;i<300&&n<torches;i++){const x=Math.floor(rng()*COLS),y=Math.floor(rng()*ROWS),c=cell(x,y);if(c&&c.t==='ground'&&!c.obs&&!c.torch){c.torch=true;n++}}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(['water','lava','void','ichor','acid','rift','chasm'].includes(c.t))G.animTiles.push({x,y,t:c.t})}
  /* yol sonu yapısı */
  const pe=G.paths[0].pts[G.paths[0].pts.length-1];
  G.base=M.baseAt?{x:M.baseAt[0]*TILE,y:M.baseAt[1]*TILE}:{x:pe.x,y:pe.y};G.baseKind=B.base;
  /* Sift: ambiyans Blub'ları */
  if(B.sift){for(let i=0;i<5;i++)spawnAmbientBlub()}
  /* hediye kuleler (Yankı İni) */
  if(M.gift&&!demo)for(const[t,x,y]of M.gift){const c=cell(x,y);if(c&&!c.obs&&!c.tower){c.obs=null;placeTowerRaw(t,x,y,0,0)}}
  /* eşyalar ve hızlı erişim çubuğu */
  if(!demo){G.items=Object.assign({},SAVE.items);G.itemsStart=Object.assign({},SAVE.items);G.hotbar=loadHotbar();}
  renderBG();
  if(!demo){SFX_MUTED=false;setMood(M.music)}else SFX_MUTED=true;
  G.nextDef=genWave(G.wave+1);
  return G;
}
function spawnAmbientBlub(){for(let k=0;k<40;k++){const x=randi(0,COLS-1),y=randi(0,ROWS-1),c=cell(x,y);if(c&&(c.t==='ground')&&!c.obs&&!c.tower){G.blubs.push({x:x*TILE+24,y:y*TILE+30,tx:x*TILE+24,ty:y*TILE+30,t:rand(0,6),wait:rand(1,4),moving:false,petCd:0,dir:1});return}}}
function loadHotbar(){
  const avail=realmTowers().filter(t=>TOWERS[t]);const saved=SAVE.loadouts[G.realm];
  let hb=Array.isArray(saved)&&saved.length===9?saved.map(t=>t&&avail.includes(t)?t:null):null;
  if(!hb){const special=REALM_TOWERS[G.realm]||[];const base=['archer','ice','tnt','fire','lightning','mine','potion','ballista','anvil','piston','beacon','web','landmine'];
    hb=special.slice();for(const t of base){if(hb.length>=9)break;if(!hb.includes(t))hb.push(t)}while(hb.length<9)hb.push(null)}
  return hb;
}
function saveHotbar(){SAVE.loadouts[G.realm]=G.hotbar.slice();saveGame()}

/* ============================ DALGALAR ============================ */
function isNightWave(w){if(!G.biome.dn||w<=0)return false;if(G.biome.dn==='pale')return w%4===3||w%4===0||(!G.endless&&w===G.map.waves);return w%6===5||w%6===0}
function tideOfWave(w){return Math.floor((w-1)/2)%3}
const BOSSES_OF={};MAPS.forEach(m=>{(BOSSES_OF[m.dim]=BOSSES_OF[m.dim]||[]).push(m.boss)});
function genWave(w){
  const M=G.map,E=G.endless,night=isNightWave(w),tide=M.mech&&M.mech.tides?tideOfWave(w):null;
  const total=E?9999:M.waves,boss=E?(w%10===0):(w===total);
  const avail=M.pool.filter(p=>w>=p[1]&&(!p[3]||(p[3]==='night'&&night)||(p[3]==='day'&&!night)||(p[3]==='endure'&&tide===1)));
  let budget=4+w*1.9+Math.pow(w,1.5)*.45;if(boss)budget*=.55;if(tide===1)budget*=1.08;
  const nG=w<3?1:w<8?2:3,groups=[];
  const wf=p=>p[2]*(1+(w-p[1])*.05)*(p[3]?1.6:1);
  const wsum=avail.reduce((a,p)=>a+wf(p),0);
  for(let i=0;i<nG&&avail.length;i++){let roll=Math.random()*wsum,tp=avail[0][0];for(const p of avail){roll-=wf(p);if(roll<=0){tp=p[0];break}}
    const d=ENEMIES[tp],cnt=Math.max(tp==='creaking'?1:2,Math.round(budget/nG/d.threat));groups.push({type:tp,count:Math.min(cnt,tp==='creaking'?3+Math.floor(w/6):999),iv:clamp(.95/d.spd,.32,1.5)*(cnt>20?.75:1),delay:i*3})}
  if(night&&G.biome.dn==='std'){groups.push({type:'bat',count:3+Math.floor(w/3),iv:.5,delay:2});if(w>=7)groups.push({type:'phantom',count:1+Math.floor(w/5),iv:1.4,delay:6});if(w>=10)groups.push({type:'enderman',count:1+Math.floor(w/8),iv:1.6,delay:8})}
  if(night&&G.biome.dn==='pale'&&w>=3&&!groups.some(g=>g.type==='creaking'))groups.push({type:'creaking',count:1+Math.floor(w/7),iv:3,delay:4});
  if(w%5===0&&!boss&&w>=5&&M.elite){groups.push({type:M.elite,count:2+Math.floor(w/5),iv:1.2,delay:5})}
  let bossType=null;if(boss){bossType=E?BOSSES_OF[M.dim][(w/10-1)%BOSSES_OF[M.dim].length]:M.boss;groups.push({type:bossType,count:1,iv:1,delay:6})}
  let hpMul=(1+(w-1)*.11+(w-1)*(w-1)*.005)*G.diff.hp*(night?1.1:1)*(M.hpm||1)*(tide===1?1.25:1);
  if(E&&w>20)hpMul*=Math.pow(1.035,w-20);
  const bossMul=G.diff.hp*(E?(.5+w*.05):1);
  const spawns=[];let pc=0;
  for(const gr of groups)for(let i=0;i<gr.count;i++){const d=ENEMIES[gr.type];let path;
    if(d.lavaWalk&&G.lavaIdx.length)path=pick(G.lavaIdx);else path=G.walk[(pc++)%G.walk.length];
    spawns.push({t:gr.delay+i*gr.iv,type:gr.type,path,heart:gr.type==='creaking'})}
  spawns.sort((a,b)=>a.t-b.t);
  const counts={};groups.forEach(g=>counts[g.type]=(counts[g.type]||0)+g.count);
  const storm=!!(M.mech&&M.mech.storm&&w%3===0&&!boss);
  return{n:w,spawns,hpMul,bossMul,night,boss:bossType,counts,tide,storm,raid:!!(M.mech&&M.mech.raid)};
}
function startNextWave(){
  if(!G||G.over)return;if(!G.endless&&G.wave>=G.totalWaves)return;
  const early=G.waves.length>0||G.enemies.length>0;
  const def=G.nextDef||genWave(G.wave+1);G.wave++;
  const w={...def,n:G.wave,idx:0,time:0,alive:0,leaks:0};G.waves.push(w);
  G.nextDef=(!G.endless&&G.wave>=G.totalWaves)?null:genWave(G.wave+1);
  G.autoT=-1;
  if(early&&!G.demo){const b=Math.round((10+G.wave*2)*G.diff.money);gain(b);floatText(W-80,H-30,'+'+b+' erken bonus','#7dff8f',16)}
  G.todT=def.night?1:0;
  if(G.map.biome==='plains'||G.map.biome==='raid')G.rain=Math.random()<.3||(def.night&&Math.random()<.5);else G.rain=false;
  const prevTide=G.tide;if(def.tide!=null&&G.tideOverT<=0)G.tide=def.tide;
  G.storm=def.storm;
  if(!G.demo){
    if(def.raid&&!def.boss)sfx('raidHorn');else sfx('horn');
    if(def.boss)banner('⚠ BOSS DALGASI ⚠','<small>'+ENEMIES[def.boss].name+' yaklaşıyor!</small>');
    else if(def.storm)banner('RUH FIRTINASI','<small>Fırtına Jeneratörleri yaratık çağırıyor — onları kaz!</small>');
    else if(def.tide!=null&&def.tide!==prevTide){banner('GELGİT: '+TIDES[def.tide].name.toUpperCase(),'<small>'+TIDES[def.tide].desc+'</small>');sfx('tide')}
    else if(def.night&&!isNightWave(G.wave-1))banner(G.biome.dn==='pale'?'GIcIRTILAR UYANIYOR':'GECE ÇÖKTÜ',G.biome.dn==='pale'?'<small>Gıcırtı Kalpleri aktif. Bakmayı bırakma!</small>':'<small>Yaratıklar %10 daha güçlü, Kâbuslar uyandı!</small>');
    else if(def.raid)banner('BASKIN '+G.wave,'<small>Illager\'lar köye saldırıyor!</small>');
    else banner('DALGA '+G.wave);
    if(def.night&&G.biome.dn==='pale')sfx('creakAwake');
    tutorialStep('wave');
  }
  updateWaveUI();
}
function waveCleared(w){
  if(G.demo)return;
  const bonus=Math.round((20+w.n*3)*G.diff.money);gain(bonus);
  let inc=0;for(const t of G.towers)if(t.type==='mine'){const v=Math.round(t.s.income*G.diff.money);inc+=v;floatText(t.x,t.y-20,'+'+v,'#7dff8f',16);sparkle(t.x,t.y-10,'#2fd15a',8)}
  gain(inc);if(inc)sfx('coin');
  /* dalga arası onarım ve yük dolumu */
  const rep=.35+perk('mending')*.06;for(const t of G.towers){if(t.hp<t.maxHp&&!(t.fx&&t.fx.dotK==='wither'&&t.fx.dotT>0)){const a=Math.min(t.maxHp-t.hp,t.maxHp*rep);t.hp+=a;G.stats.repaired+=a}
    if(t.type==='anchor')t.charges=Math.min(t.s.charges,(t.charges||0)+1)}
  if(G.map.mech&&G.map.mech.vib&&w.n%2===0&&G.warn>0){G.warn--;floatText(W/2,40,'Uyarı seviyesi düştü','#7af0e8',16)}
  addXP(5+w.n);
  if(w.night&&w.leaks===0)unlockAch('night');
  const all=G.waves.length===0&&G.enemies.length===0;
  if(all&&(G.endless||G.wave<G.totalWaves)){banner('Dalga '+w.n+' Temizlendi!','<small>+'+(bonus+inc)+' zümrüt · kuleler onarıldı</small>');if(G.realm==='sift')musicBetweenWaves()}
  if(all&&G.biome.dn==='pale'&&!isNightWave(G.wave+1))dawnCrumble();
  if(G.endless){const best=SAVE.endlessBest[G.map.id]||0;if(w.n>best){SAVE.endlessBest[G.map.id]=w.n;saveGame()}if(w.n>=30)unlockAch('endless30')}
  if(SAVE.settings.autoWave&&all)G.autoT=3;
}
function updateWaves(dt){
  for(const w of G.waves){w.time+=dt;while(w.idx<w.spawns.length&&w.spawns[w.idx].t<=w.time){const s=w.spawns[w.idx++];
    if(s.heart)spawnFromHeart(s.type,w);else spawnEnemy(s.type,s.path,w,0)}}
  for(let i=G.waves.length-1;i>=0;i--){const w=G.waves[i];if(w.idx>=w.spawns.length&&w.alive<=0){G.waves.splice(i,1);waveCleared(w);updateWaveUI()}}
  if(G.autoT>0){G.autoT-=dt;if(G.autoT<=0&&G.waves.length===0)startNextWave()}
  if(G.demo&&G.waves.length===0&&G.time>2){G.demoT=(G.demoT||0)+dt;if(G.demoT>3){G.demoT=0;if(G.wave>=8){G.wave=1;G.nextDef=genWave(2)}startNextWave()}}
}
function spawnEnemy(type,pathIdx,w,dist,parent,opt){
  const d=ENEMIES[type],P=G.paths[pathIdx];if(!d||!P)return null;
  let hp=d.hp*(d.boss?w.bossMul:w.hpMul);if(parent&&parent.def.boss)hp=d.hp*w.hpMul*1.5;
  if(opt&&opt.hpScale)hp*=opt.hpScale;
  const p=pathPos(P,dist);
  const e={id:++G.eid,type,def:d,hp,maxHp:hp,dist,path:P,pi:pathIdx,x:p.x,y:p.y,off:d.boss?0:rand(-7,7),dir:p.dx<0?-1:1,anim:rand(0,6),t:rand(0,10),alive:true,wave:w,
    slowT:0,slow:0,burnT:0,burnDps:0,poisonT:0,poisonDps:0,weakT:0,weak:0,stunT:0,freezeT:0,rootT:0,flash:0,healCd:3,healFx:0,blinkCd:0,
    sumCd:d.summon?d.summon.every:0,fuse:0,dotAcc:0,dotT:0,punch:0,inWeb:false,soundT:rand(1,5),atkCd:rand(.5,2),siege:null,
    ab:(d.ab||[]).map(a=>({cd:a.every?a.every*rand(.6,1):0,used:false})),glowT:0,levT:0,levH:0,calmT:0,admireT:0,admired:{},angry:false,shellOpen:false,shellT:rand(0,2),
    gazed:false,twitchT:0,invuln:false,emergeT:0,shriekT:0,lifelink:null,linkBuff:0,gallopT:rand(1,3),onLava:false,buffT:0,ampT:0,amp:0};
  if(d.rider)e.rider=true;
  w.alive++;G.enemies.push(e);
  if(d.boss&&!G.demo&&opt&&opt.roam){bossInit(e)}
  else if(d.boss&&!G.demo){G.boss=e;const bb=$('bossbar');bb.className=BOSS_THEME[type]||(G.dim==='ne'?'nether':'');bb.style.display='flex';$('bossName').textContent=d.name;MUS.boss=true;sfx(d.snd==='wither'?'wither':'roar');shake(6);bossInit(e)}
  if(d.creaking||(d.ab&&d.ab.some(a=>a.k==='hearts')))e.invuln=true;
  return e;
}
/* Gıcırtı: canlı bir kalpten doğar, yola en yakın noktadan girer */
function spawnFromHeart(type,w){
  const hearts=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.obs==='cheart')hearts.push({c,x,y})}
  if(!hearts.length)return null;
  const h=pick(hearts),hx=h.x*TILE+24,hy=h.y*TILE+24;let bi=0,bd=Infinity,bdist=0;
  G.walk.forEach(i=>{const r=nearestDist(G.paths[i],hx,hy);if(r.dd<bd){bd=r.dd;bi=i;bdist=r.d}});
  const e=spawnEnemy(type,bi,w,bdist);if(!e)return null;e.heart=h.c;e.invuln=true;
  ring(hx,hy,40,'255,150,40');puff(hx,hy,'#c8ccbf',10);sfx('creak');
  G.beams.push({x1:hx,y1:hy-10,x2:e.x,y2:e.y-20,t:.8,max:.8,col:'255,154,42'});
  return e;
}
function dawnCrumble(){let n=0;for(const e of G.enemies)if(e.alive&&e.def.creaking){e.twitchT=1.2;e.dawn=true;n++}if(n)floatText(W/2,60,'Şafak söktü — Gıcırtılar ufalanıyor','#ffd8a0',18)}
