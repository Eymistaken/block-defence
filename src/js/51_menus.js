/* ============================ OYUN AKIŞI & MENÜLER ============================ */
/* Bir bölgeye ilk girişte kısa bir mekanik hatırlatması */
const REALM_INTRO={
  ocean:['t:conduit','Okyanus Anıtı','Gardiyanlar kulelere lazer atar. Oluk kulesi yakındaki kuleleri güçlendirir ve şok verir.'],
  raid:['t:bell','Köy Baskını','Illager\'lar dalga dalga gelir. Çan baskıncıları parlatır, daha fazla hasar almalarını sağlar.'],
  pale:['e:creaking','Solgun Bahçe','Gece Gıcırtılar kalplerinden doğar. Bakılan Gıcırtı donar ama ölmez: kalbini kaz!'],
  deep:['pix:echoshard','Karanlık Derinlikler','Sculk sensörleri kulelerin titreşimini duyar. 4 uyarıda Muhafız çıkar! Yün Bloğu titreşimi yutar.'],
  ne:['tex:netherrack','Nether','Piglinler altına bayılır, Diriltici yıkılan kuleyi yeniden kurar. Güç: Patlayan Yatak (T).'],
  end:['tex:endstone','End','Shulker ve Nakarat kuleleri açıldı. Güç: End Kristali (T). Ejderhanın kristallerini kaz!'],
  sift:['pix:tide','Sift','Gelgit her 2 dalgada değişir. Ruh topla (öldür, Blub sev) ve güçleri kullan: T Y G. Ichor, Illager\'ları yakar.'],
};
function startGame(mapIdx,diffKey,endless){
  initAudio();hideTip();if(MP.mode==='jukebox')MP.mode='menu';
  document.body.classList.remove('menu');showScreen(null);
  UI.invOpen=false;setCarry(null);
  newGame(mapIdx,diffKey,endless,false);UI.inGame=true;UI.last={map:mapIdx,diff:diffKey,endless};UI.map=mapIdx;UI.dim=G.dim;
  SAVE.games++;SAVE.lastDim=G.dim;saveGame();hudCache={};UI.waveSig=null;UI.panelSig=null;
  buildHotbar();buildAbilities();buildBelt();updateAbilUI();updateWaveUI();updateXPUI();selectTower(null);
  $('stMap').textContent=G.map.name+' · '+G.diff.name;$('btnSpeed').textContent='1x';$('btnSpeed').classList.remove('on');
  $('bossbar').style.display='none';$('hint').classList.remove('show');
  MUS.boss=false;musicEnterWorld();fitCanvas();
  banner(G.map.name,`<small>${DIMS[G.dim].name} · ${G.endless?'Sonsuz Mod':G.totalWaves+' dalga'} · ${G.diff.name}</small>`);
  if(G.dim==='end')unlockAch('endEnter');if(G.dim==='sift')unlockAch('siftEnter');
  const intro=REALM_INTRO[G.realm];if(intro&&!SAVE.seenDim['r_'+G.realm]){SAVE.seenDim['r_'+G.realm]=true;saveGame();const gg=G;setTimeout(()=>{if(G===gg)toast(intro[0],intro[1],intro[2],'item')},1600)}
  tutorialStep('start');
}
function startDemo(){
  UI.inGame=false;UI.invOpen=false;setCarry(null);document.body.classList.add('menu');
  const opts=MAPS.filter(m=>mapUnlocked(m,false)).map(m=>m.idx);
  newGame(pick(opts.length?opts:[0]),'normal',true,true);
  $('bossbar').style.display='none';$('towerPanel').style.display='none';$('hint').classList.remove('show');
  $('hotbar').innerHTML='';$('abilities').innerHTML='';$('wavePreview').innerHTML='';updateBeltUI();
  MUS.boss=false;setMood('menu');musicEnterMenu();
  for(let i=0;i<10;i++)demoAI(99);
  fitCanvas();
}
/* Eşyalar: zaferde hepsi sandıkta kalır; yenilgide ya da yarıda bırakınca başlangıçtakinden fazlası kaybolur */
function settleItems(win){if(!G||G.demo||G.diff.creative||G.itemsSettled)return;G.itemsSettled=true;
  const out={},keys=new Set([...Object.keys(G.itemsStart),...Object.keys(G.items)]);
  for(const k of keys){const v=win?(G.items[k]||0):Math.min(G.itemsStart[k]||0,G.items[k]||0);if(v>0)out[k]=v}
  SAVE.items=out;saveGame()}
function gameOver(){if(G.over)return;G.over=true;sfx('defeat',true);musicDefeat();
  settleItems(G.endless);
  setTimeout(()=>showEnd(false),900)}
function nextMapOf(m){const n=MAPS.find(x=>x.dim===m.dim&&x.di===m.di+1);if(n)return n;
  const di=DIM_ORDER.indexOf(m.dim);for(let i=di+1;i<DIM_ORDER.length;i++){const f=MAPS.find(x=>x.dim===DIM_ORDER[i]&&x.di===0);if(f&&dimUnlocked(f.dim))return f}return null}
function victory(){if(G.over)return;G.over=true;G.won=true;sfx('victory',true);musicVictory();
  const ratio=G.lives/G.maxLives,stars=ratio>=.9?3:ratio>=.5?2:1;G.stars=stars;
  if(!G.diff.creative){const M=G.map,wasDone=!!SAVE.done[M.id],dimsBefore=DIM_ORDER.filter(dimUnlocked);
    SAVE.stars[M.id]=Math.max(SAVE.stars[M.id]||0,stars);SAVE.done[M.id]=true;settleItems(true);
    if(!wasDone){let dl=1200;
      const nx=MAPS.find(x=>x.dim===M.dim&&x.di===M.di+1);if(nx){setTimeout(()=>toast('pix:star','Yeni Dünya Açıldı!',nx.name),dl);dl+=1200}
      DIM_ORDER.filter(d=>dimUnlocked(d)&&!dimsBefore.includes(d)).forEach(d=>{SAVE.seenDim[d]=true;setTimeout(()=>{toast('tex:'+DIMS[d].icon[0],'Yeni Boyut: '+DIMS[d].name,'Dünya seçiminde yeni sekme açıldı!');sfx('rift')},dl);dl+=1400});
      const nt=Object.keys(TOWERS).filter(t=>!TOWERS[t].realm&&(TOWERS[t].need||0)===doneCount());
      if(nt.length)setTimeout(()=>toast('t:'+nt[0],'Yeni Kuleler!',nt.map(t=>TOWERS[t].name).join(', ')),dl)}
    addXP(Math.round((30+12*(M.di+1)+DIM_ORDER.indexOf(M.dim)*30)*stars*(G.endless?.5:1)));
    if(G.stats.leaked===0)unlockAch('perfect');if(G.diffKey==='hard')unlockAch('hard');
    if(M.dim==='ne')unlockAch('nether');
    if(G.realm==='deep'&&G.sneakOk)unlockAch('sneak');
    if(DIM_ORDER.every(d=>MAPS.some(m=>m.dim===d&&SAVE.done[m.id])))unlockAch('alldims');
    if(MAPS.every(m=>SAVE.done[m.id]))unlockAch('allMaps');saveGame()}
  setTimeout(()=>showEnd(true),1200)}
const DEFEAT_TITLE={village:'Köy Düştü!',bell:'Köy Düştü!',ancient:'Antik Şehir Düştü!',portal:'Portal Söndü!',gateway:'Geçit Kapandı!',singer:'Şarkıcı Sustu!',singerportal:'Şarkıcı Sustu!',rift:'Şarkıcı Sustu!'};
function showEnd(win){
  const s=G.stats;$('endTitle').textContent=win?'Zafer!':(DEFEAT_TITLE[G.baseKind]||'Yenildin!');$('endTitle').style.color=win?'#7dff8f':'#ff6b6b';
  $('endStars').innerHTML=win&&!G.diff.creative?[1,2,3].map(i=>`<span class="${i<=G.stars?'on':''}">★</span>`).join(''):'';
  $('endMsg').textContent=win?(G.diff.creative?'Yaratıcı modda tamamlandı.':`${G.map.name} kurtarıldı! Kalan can: ${G.lives}/${G.maxLives}`):
    (G.endless?`Sonsuz modda ${G.wave}. dalgaya ulaştın. En iyi: ${SAVE.endlessBest[G.map.id]||0}`:`${G.wave}. dalgada yenildin. Tekrar dene!`);
  const rows=[['Dalga',G.wave],['Yok edilen',s.kills],['Kurulan kule',s.built],['Yıkılan kule',s.lost||0],['Onarılan can',fmt(s.repaired||0)],['Kazılan blok',s.mined],['Toplam hasar',fmt(s.dmg)],['Kazanılan zümrüt',fmt(s.earned)],['Kazanılan XP',s.xp],['Kaçan yaratık',s.leaked]];
  if(G.realm==='sift')rows.push(['Ruh',Math.floor(G.souls)]);
  if(G.map.mech&&G.map.mech.vib)rows.push(['Muhafız uyandı mı?',G.sneakOk?'Hayır':'Evet']);
  $('endStats').innerHTML=rows.map(([a,b])=>`<span>${a}</span><span>${b}</span>`).join('');
  /* ganimet */
  const L=$('endLoot');L.innerHTML='';
  if(!G.diff.creative){const kept=win||G.endless;let any=false;
    for(const id of ITEM_ORDER){const d=(G.items[id]||0)-(G.itemsStart[id]||0);if(d<=0)continue;any=true;
      const el=document.createElement('div');el.className='lt';const c=mkCanvas(28,28),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(itemIcon(id,40),0,0,28,28);el.appendChild(c);
      el.insertAdjacentHTML('beforeend',`<span style="color:${kept?'#7fe8ff':'#888'}">+${d} ${ITEMS[id].name}</span>`);tipOn(el,()=>itemTip(id));L.appendChild(el)}
    if(any)L.insertAdjacentHTML('afterbegin',`<div style="width:100%;font-size:18px;color:${kept?'#7fe8ff':'#ff8080'}">${kept?'Sandığa eklenen ganimet':'Yenilgide yeni ganimet kayboldu'}</div>`)}
  const nx=nextMapOf(G.map);const nextOk=win&&!G.endless&&nx&&(mapUnlocked(nx,false)||G.diff.creative);
  $('enNext').style.display=nextOk?'':'none';$('enNext').dataset.idx=nextOk?nx.idx:'';
  showScreen('scrEnd');
}
function togglePause(force){if(!G||G.demo||G.over)return;if(UI.invOpen){closeInventory();return}
  G.paused=force!=null?force:!G.paused;if(G.paused){showScreen('scrPause');sfx('click',true)}else showScreen(null)}
function toggleSpeed(){if(!G||G.demo)return;G.speed=G.speed===1?2:G.speed===2?3:1;$('btnSpeed').textContent=G.speed+'x';$('btnSpeed').classList.toggle('on',G.speed>1);sfx('click',true)}

/* ---------- dünya seçimi ---------- */
function dimProgress(d){const ms=MAPS.filter(m=>m.dim===d);return ms.filter(m=>SAVE.done[m.id]).length+'/'+ms.length}
function renderLevels(){
  const creative=UI.diff==='creative';
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===UI.mode));
  document.querySelectorAll('[data-diff]').forEach(b=>b.classList.toggle('on',b.dataset.diff===UI.diff));
  /* boyut sekmeleri */
  const tabs=$('dimTabs');tabs.innerHTML='';
  DIM_ORDER.forEach(d=>{const D=DIMS[d],lock=!dimUnlocked(d)&&!creative,b=document.createElement('button');
    b.className='mc-btn sm dimtab '+d+(UI.dim===d?' on':'')+(lock?' locked':'');
    const ic=dimIcon(d,32),c=mkCanvas(32,32);c.getContext('2d').drawImage(ic,0,0);b.appendChild(c);
    b.insertAdjacentHTML('beforeend',`<span>${lock?'🔒 ':''}${D.name}</span><span class="pg">${dimProgress(d)}</span>`);
    b.onclick=()=>{sfx('click',true);UI.dim=d;const ms=MAPS.filter(m=>m.dim===d);const f=ms.filter(m=>mapUnlocked(m,creative)).pop()||ms[0];UI.map=f.idx;renderLevels()};
    tabs.appendChild(b)});
  const D=DIMS[UI.dim],dlock=!dimUnlocked(UI.dim)&&!creative;
  $('dimDesc').innerHTML=`<span style="color:${D.col}">${D.name}</span> — ${D.desc}`+(dlock?`<br><span style="color:#ff8a8a">🔒 ${D.lock}</span>`:'');
  /* haritalar */
  const grid=$('levelGrid');grid.innerHTML='';
  let sel=MAPS[UI.map];if(!sel||sel.dim!==UI.dim){sel=MAPS.find(m=>m.dim===UI.dim);UI.map=sel.idx}
  MAPS.filter(m=>m.dim===UI.dim).forEach(m=>{
    const locked=!mapUnlocked(m,creative),endLock=UI.mode==='endless'&&!creative&&!SAVE.done[m.id],lock=locked||endLock;
    const c=document.createElement('div');c.className='card'+(lock?' locked':'')+(UI.map===m.idx?' sel':'');
    const pv=mapPreview(m.idx);pv.className='pv';c.appendChild(pv);
    const st=SAVE.stars[m.id]||0,B=ENEMIES[m.boss];
    c.insertAdjacentHTML('beforeend',`<div class="cn">${m.di+1}. ${m.name}</div><div class="bm">Boss: ${B?B.name:'?'}</div><div class="cd">${m.desc}</div>`);
    const stEl=document.createElement('div');stEl.className='st';
    stEl.innerHTML=UI.mode==='endless'?`<span style="font-size:17px;color:#ffe28a">En iyi: ${SAVE.endlessBest[m.id]||0}. dalga</span>`:
      [1,2,3].map(k=>`<span class="${k<=st?'on':''}">★</span>`).join('')+` <span style="font-size:16px;color:#999">${m.waves} dalga</span>`;
    const bi=mkCanvas(48,48);bi.getContext('2d').drawImage(enemyIcon(m.boss),0,0);if(lock)bi.style.filter='brightness(0)';stEl.appendChild(bi);c.appendChild(stEl);
    if(lock)c.insertAdjacentHTML('beforeend',`<div class="lock">🔒 ${dlock?'Boyut kilitli':endLock&&!locked?'Sonsuz mod için önce bu dünyayı bitir':'Önceki dünyayı bitir'}</div>`);
    c.onclick=()=>{if(lock){sfx('error',true);return}UI.map=m.idx;sfx('click',true);renderLevels()};
    c.ondblclick=()=>{if(!lock)startGame(m.idx,UI.diff,UI.mode==='endless')};
    grid.appendChild(c)});
  $('diffDesc').textContent=DIFFS[UI.diff].desc;
  const cur=MAPS[UI.map];$('lvStart').disabled=!mapUnlocked(cur,creative)||(UI.mode==='endless'&&!creative&&!SAVE.done[cur.id]);
}
const PREV={};
function drawAnimTilesStatic(g){const wtx=TX[G.biome.liquid||'water'];
  for(const a of G.animTiles){const X=a.x*TILE,Y=a.y*TILE;
    if(a.t==='water')g.drawImage(wtx[0],X,Y,TILE,TILE);else if(a.t==='lava')g.drawImage(TX.lava[0],X,Y,TILE,TILE);
    else if(a.t==='ichor')g.drawImage(TX.ichor[0],X,Y,TILE,TILE);else if(a.t==='acid')g.drawImage(TX.acid[0],X,Y,TILE,TILE);
    else if(a.t==='rift')g.drawImage(TX.rift[0],X,Y,TILE,TILE);else R(g,X,Y,TILE,TILE,a.t==='chasm'?'#020406':'#05020a')}}
function mapPreview(i){const c=mkCanvas(200,120),g=c.getContext('2d');
  if(!PREV[i]){const saveG=G,muted=SFX_MUTED;
    try{newGame(i,'normal',false,true);const p=mkCanvas(W,H),pg=p.getContext('2d');pg.imageSmoothingEnabled=false;pg.drawImage(bgCanvas,0,0);drawAnimTilesStatic(pg);
      try{drawObstacleOverlays(pg,0);drawBase(pg,0)}catch(e){}
      const B=G.biome;if(B.amb)R(pg,0,0,W,H,`rgba(${B.col||'0,0,0'},${B.amb*.45})`);if(B.tint)R(pg,0,0,W,H,B.tint);
      PREV[i]=p}
    catch(e){console.error('preview',i,e);PREV[i]=mkCanvas(W,H)}
    G=saveG;SFX_MUTED=muted;if(G)renderBG()}
  g.imageSmoothingEnabled=true;g.drawImage(PREV[i],0,0,W,H,0,0,200,120);return c}

/* ---------- büyü masası & başarımlar ---------- */
function renderPerks(){
  const spent=PERKS.reduce((a,p)=>a+perk(p.id),0),pts=SAVE.level-spent;
  $('perkPts').textContent=`Seviye ${SAVE.level} · Harcanabilir puan: ${pts}`;
  const grid=$('perkGrid');grid.innerHTML='';
  PERKS.forEach(p=>{const rk=perk(p.id),d=document.createElement('div');d.className='perk';d.appendChild(perkIcon(p));
    d.insertAdjacentHTML('beforeend',`<div class="info"><div class="pn">${p.name} ${['','I','II','III','IV','V'][rk]}</div><div class="pd">${p.desc}</div><div class="ranks">${[0,1,2,3,4].map(i=>`<i class="${i<rk?'on':''}"></i>`).join('')}</div></div>`);
    const b=document.createElement('button');b.className='mc-btn green';b.textContent='+';b.disabled=pts<=0||rk>=PERK_MAX;b.onclick=()=>{SAVE.perks[p.id]=rk+1;saveGame();sfx('levelup',true);renderPerks()};d.appendChild(b);grid.appendChild(d)});
}
function renderAch(){const grid=$('achGrid');grid.innerHTML='';const n=ACHS.filter(a=>SAVE.ach[a.id]).length;$('achInfo').textContent=`${n} / ${ACHS.length} başarım`;
  ACHS.forEach(a=>{const d=document.createElement('div');d.className='ach'+(SAVE.ach[a.id]?'':' lock');d.appendChild(iconFor(a.icon));d.insertAdjacentHTML('beforeend',`<div class="info"><div class="an">${a.name}</div><div class="ad">${a.desc}</div></div>`);grid.appendChild(d)})}

/* ---------- ansiklopedi ---------- */
const DIM_MECH={
  ow:[['Gece ve Gündüz','Ova, çöl, tundra, bataklık ve baskın dünyalarında birkaç dalgada bir gece çöker: yaratıklar %10 güçlenir, Yarasa, Kâbus ve Enderman gelir.'],
    ['Okyanus Anıtı','Boğuklar yüzer, Gardiyanlar kulelere lazer atar. Özel kule: <b>Oluk</b> (güç ve şok).'],
    ['Köy Baskını','Illager dalgaları, Uğursuz liderler ve Yıkıcı. Özel kule: <b>Çan</b> (baskıncıları parlatır).'],
    ['Solgun Bahçe','Soluk Meşe\'lerin arasında <b>Gıcırtı Kalpleri</b> var. Gece Gıcırtılar kalplerinden doğar; bir kule onlara bakarken donarlar, ölümsüzdürler. Kalbi kazınca Gıcırtı ufalanır. Boss: Kadim Gıcırtı (3 Kadim Kalp). Özel kuleler: <b>Göz Çiçeği Saksısı</b>, <b>Reçine Atıcı</b>. Güç: Göz Çiçeği Bakışı.'],
    ['Karanlık Derinlikler','Sculk sensörleri kule atışlarının titreşimini duyar, Çığırtkanlar uyarı seviyesini artırır. 4. uyarıda gezgin bir <b>Muhafız</b> çıkar. <b>Yün Bloğu</b> titreşimi yutar, <b>Ayarlanmış Sculk Sensörü</b> titreşimi sonik dalgaya çevirir. Güç: Keçi Boynuzu (sensörleri sağırlaştırır).'],
    ['Antik Şehir','Derinliklerin dibi. Kadim Muhafız yenilince şehrin geçidi <b>Sift</b>\'e açılır.']],
  ne:[['Piglinler ve Altın','Piglinler altına bayılır: Altın Külçesi atınca durup bakarlar. Piglin Vahşileri ise altına aldırmaz.'],
    ['Hoglinler','Çarpık Mantar\'dan korkarlar. Sürü halinde öfkelenirler.'],['Lav Yolları','Striderlar lav üstünden ayrı bir yoldan gelir.'],
    ['Özel Kuleler','<b>Ruh Kamp Ateşi</b> ateşe bağışıklara bile işler; <b>Diriltici</b> yıkılan kuleyi yeniden kurar.'],
    ['Netherit','Antik Kalıntı kazınca Netherit Hurdası düşer. 4 Hurda + 4 Altın = Netherit Külçesi: elmas kuleyi 5. seviyeye çıkarır.'],
    ['Wither','Son boss. Canı yarıya inince Wither Zırhı mermileri durdurur; vurduğu kuleler solar ve onarılamaz.']],
  end:[['End Güncellemesi','Yeni biyomlar: Nakarat Ormanı, Sisli Mantarlık, Kristal Dağları, Kehribar Diyarı, Gölge Ormanı, Kükürt Kaynakları, Ejderha Mezarlığı ve End Şehri.'],
    ['Özel Kuleler','<b>Shulker Kulesi</b> yaratıkları havaya kaldırır, düşünce ek hasar alırlar. <b>Nakarat Kulesi</b> yaratıkları yolda geriye ışınlar.'],
    ['End Kristali','Güç (T): yakındaki kuleleri hızlandıran, sonunda patlayan bir kristal.'],
    ['Ender Ejderhası','Ejderha Adası\'ndaki kristaller ejderhayı iyileştirir: kristalleri kaz!']],
  sift:[['Gelgitler','Her iki dalgada bir değişir: <b>Akış</b> (olağan), <b>Direniş</b> (yaratıklar dayanıklı, ruh yarı), <b>Bereket</b> (kuleler hızlı, güçler hızlı dolar, ruh iki kat).'],
    ['Ruh','Yaratık öldürmek, Blub sevmek ve Sift bitkilerini kazmak ruh verir. Güçler ruh harcar: <b>T</b> Şarkıcının Şarkısı, <b>Y</b> Gelgit Çağrısı, <b>G</b> Ichor Seli.'],
    ['Ichor','Gökkuşağı renkli sıvı. Illager\'ları yakar, Sift yaratıklarını iyileştirir. Ichor Seli yozlaşmış yaratıkları sakinleştirir.'],
    ['Blub\'lar','Ortalıkta dolaşan dost yaratıklar. Tıklayıp sevebilirsin; Blub Yuvası onları yola gönderip yaratıkları durdurur.'],
    ['Şarkıcı','Yolun sonunda korunan dev, iyi kalpli yaratık. Ruhları çalan Illager\'lar ve yozlaşmış Sift yaratıkları ona ulaşmaya çalışır.'],
    ['Fırtına ve Yarıklar','Ruh Fırtınası\'nda jeneratörler yaratık çağırır; kazarak susturabilirsin. Bazı bosslar yarık açıp ileriye yaratık yollar.']],
};
function bookEntry(icon,html){const e=document.createElement('div');e.className='entry';if(icon){const c=mkCanvas(56,56),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(icon,0,0,56,56);e.appendChild(c)}
  e.insertAdjacentHTML('beforeend',`<div style="flex:1;min-width:0">${html}</div>`);return e}
function renderBookFilter(){const F=$('bookFilter');F.innerHTML='';if(UI.bookTab!=='enemies')return;
  [['all','Hepsi'],['ow','Overworld'],['pale','Solgun Bahçe'],['deep','Karanlık Derinlikler'],['ne','Nether'],['end','End'],['sift','Sift']].forEach(([k,n])=>{
    const b=document.createElement('button');b.className='mc-btn sm'+(UI.bookFilter===k?' on':'');b.textContent=n;b.onclick=()=>{UI.bookFilter=k;sfx('click',true);renderBook()};F.appendChild(b)})}
function renderBook(){
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===UI.bookTab));
  renderBookFilter();
  const B=$('bookBody');B.innerHTML='';B.scrollTop=0;const tab=UI.bookTab;
  if(tab==='help'){B.innerHTML=`<div class="help">
    <h3>Amaç</h3>Yaratıklar yol boyunca köye, portala, geçide ya da Şarkıcı'ya ilerler. Kaçan her yaratık can götürür (bosslar çok daha fazla!). Tüm dalgaları atlat ve dünyayı kurtar.
    <h3>Temel Kontroller</h3><kbd>1</kbd>–<kbd>9</kbd> hızlı erişim (fare tekerleği de çevirir) · <kbd>Sol tık</kbd> yerleştir / seç / kaz · <kbd>Shift</kbd>+tık art arda yerleştir · <kbd>Sağ tık</kbd> iptal<br>
    <kbd>Tab</kbd>/<kbd>I</kbd> envanter · <kbd>Boşluk</kbd> dalga başlat / erken çağır · <kbd>F</kbd> hız · <kbd>P</kbd>/<kbd>Esc</kbd> duraklat<br>
    Seçili kule: <kbd>U</kbd> yükselt · <kbd>O</kbd> onar · <kbd>S</kbd>/<kbd>Delete</kbd> sat · <kbd>H</kbd> hedef modu<br>
    <kbd>Q</kbd> TNT Yağmuru · <kbd>W</kbd> Kar Fırtınası · <kbd>E</kbd> Demir Golem · <kbd>R</kbd> Altın Elma · <kbd>T</kbd> bölge gücü (Sift'te ayrıca <kbd>Y</kbd> <kbd>G</kbd>) · <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd> <kbd>V</kbd> kemerdeki eşyalar
    <h3>Kuleler Hasar Alır</h3>Yaratıkların çoğu kulelere saldırır: yumruklar, oklar, iksirler, lazerler, patlamalar. Kuleler dalga sonunda %35 onarılır; <b>Örs</b> sürekli onarır, <kbd>O</kbd> ile zümrütle tamamen onarabilirsin. Kulelerin üstündeki etkiler (donma, ipek koza, zehir, solma...) panelde görünür.
    <h3>Envanter</h3>Her bölgenin kendi 9 yuvalı hızlı erişim çubuğu vardır; envanterden istediğin kuleleri diz. Eşyalar yaratıklardan ve kazdığın bloklardan düşer, kemere (4 yuva) koyup kullanırsın. Üretim bölümünde eşya birleştirebilirsin. Kazandığın dünyalardan kalan eşyalar <b>Sandık</b>'ta saklanır; yenilirsen o oyunda bulduğun yeni eşyalar kaybolur.
    <h3>Zümrüt Kazanmak</h3>Yaratıkları yok et, dalgaları temizle, <b>Zümrüt Madeni</b> kur ve haritadaki ağaç ve cevherleri <b>kaz</b>. Dalga sürerken erken çağırmak ekstra bonus verir.
    <h3>Kule Seviyeleri</h3>Tahta → taş → demir → elmas → <b>Netherit</b> (Netherit Külçesi ile). 3. seviyedeki kuleler ve Fener yanındakiler <span class="p">gizli</span> yaratıkları görür.
    <h3>Hasar Türleri</h3><span class="gr">Fiziksel</span> zırhtan etkilenir · <span class="o">Ateş</span> zırhı deler ama ateşe bağışıklara işlemez · <span class="b">Ruh ateşi</span> ateşe bağışıklara yarı işler · <span class="p">Büyü</span> zırhı yok sayar · <span class="r">Patlama</span> zırhın yarısını deler.
    <h3>Kalıcı İlerleme</h3>XP kazandıkça seviye atlarsın; her seviye <b>Büyü Masası</b>'nda 1 puan verir. Nether için Overworld'de "Damla Taş Mağaraları"nı, End için Nether'de "Nether Kalesi"ni, Sift için "Antik Şehir"i bitir.</div>`;return}
  if(tab==='dims'){DIM_ORDER.forEach(d=>{const D=DIMS[d],ms=MAPS.filter(m=>m.dim===d),lock=!dimUnlocked(d);
      const e=document.createElement('div');e.className='dimcard';const pv=mapPreview(ms[0].idx);if(lock)pv.style.filter='grayscale(1) brightness(.5)';e.appendChild(pv);
      e.insertAdjacentHTML('beforeend',`<div style="flex:1;min-width:0"><div class="en" style="color:${D.col}">${D.name} <span style="font-size:18px;color:#ffe28a">${dimProgress(d)}</span></div>
        <div class="ed">${D.desc}</div>${lock?`<div class="ed r">🔒 ${D.lock}</div>`:''}
        <div class="ed" style="margin-top:4px">${ms.map(m=>`<span class="tag">${m.di+1}. ${m.name}${SAVE.done[m.id]?' ✔':''} · <span class="p">${ENEMIES[m.boss].name}</span></span>`).join('')}</div>
        ${(DIM_MECH[d]||[]).map(([h,t])=>`<div class="ed" style="margin-top:4px"><span class="y">${h}:</span> ${t}</div>`).join('')}</div>`);
      B.appendChild(e)});return}
  if(tab==='towers'){const order=BASE_ORDER.concat(...Object.values(REALM_TOWERS));
    order.forEach(t=>{const D=TOWERS[t];const lvls=D.lv.length>1&&!D.trap&&!D.block?[0,1,2,3,4]:[0];
      const keys=[];lvls.forEach(i=>statLines(t,i).forEach(r=>{if(!keys.includes(r[0]))keys.push(r[0])}));
      const rows=lvls.map(i=>{const sl=statLines(t,i);return`<tr><td>${i===4?'<span class="p">N</span>':i+1}</td><td class="g">${i===4?'Külçe':(i?'+':'')+towerCost(t,i)}</td><td>${D.trap?'-':Math.round(TOWER_HP[i]*(D.hpm||1))}</td>${keys.map(k=>`<td>${(sl.find(r=>r[0]===k)||[0,'-'])[1]}</td>`).join('')}</tr>`}).join('');
      const lock=(D.need||0)>doneCount()?` <span class="r" style="font-size:18px">🔒 ${D.need} dünya</span>`:'';
      const rl=D.realm?` <span class="p" style="font-size:18px">✦ ${REALM_NAMES[D.realm]}</span>`:'';
      const air=D.air?'<span class="b">✔ Hava</span>':(!D.trap&&!D.eco&&!D.support&&!D.block?'<span class="r">✘ Hava</span>':'');
      B.appendChild(bookEntry(towerIcon(t),`<div class="en">${D.name}${rl}${lock}</div><div class="ed">${D.desc} ${air}${D.vib?` <span class="gr">· Titreşim ${D.vib}</span>`:''}</div><table><tr><th>Sv</th><th>Bedel</th><th>Can</th>${keys.map(k=>`<th>${k}</th>`).join('')}</tr>${rows}</table>`))});return}
  if(tab==='enemies'||tab==='bosses'){
    Object.entries(ENEMIES).forEach(([k,d])=>{if(d.hide)return;if(tab==='enemies'&&(d.boss||(UI.bookFilter!=='all'&&d.tag!==UI.bookFilter)))return;if(tab==='bosses'&&!d.boss)return;
      const where=tab==='bosses'?MAPS.filter(m=>m.boss===k).map(m=>m.name).join(', '):'';
      const drops=(d.drops||[]).map(([id,p,n])=>`${n>1?n+'× ':''}${ITEMS[id]?ITEMS[id].name:id} (%${Math.round(p*100)})`).join(', ');
      const atk=d.atk?` · Kuleye hasar: ${d.atk.dmg}`:'';
      B.appendChild(bookEntry(enemyIcon(k),`<div class="en">${d.name}${tab==='bosses'&&SAVE.bossKills[k]?` <span class="g" style="font-size:18px">✔ ${SAVE.bossKills[k]} kez yenildi</span>`:''}</div><div class="ed">${d.desc||''}</div>
        <div class="ed">Can: ${d.hp} · Hız: ${d.spd} · Ödül: ${d.reward} · Can kaybı: ${d.lives||1}${atk}</div>${where?`<div class="ed y">Nerede: ${where}</div>`:''}${drops?`<div class="ed b">Düşürür: ${drops}</div>`:''}
        <div>${enemyTags(d).map(t=>`<span class="tag">${t}</span>`).join('')}</div>`))});return}
  if(tab==='items'){
    ITEM_ORDER.forEach(id=>{const I=ITEMS[id];const src=[];
      for(const[k,d]of Object.entries(ENEMIES))if(!d.hide&&(d.drops||[]).some(x=>x[0]===id))src.push(d.name);
      for(const[k,o]of Object.entries(OBS))if((o.drops||[]).some(x=>x[0]===id))src.push(o.name);
      const rec=RECIPES.find(r=>r.out===id);
      const use={aim:'Nişan alınarak kullanılır',self:'Anında etki',tower:'Kuleye uygulanır',passive:'Kendiliğinden tetiklenir'}[I.use]||'Üretim malzemesi';
      B.appendChild(bookEntry(itemIcon(id,40),`<div class="en">${I.name} <span class="b" style="font-size:18px">Sandıkta: ${SAVE.items[id]||0}</span></div><div class="ed">${I.desc}</div><div class="ed gr">${use}</div>
        ${rec?`<div class="ed y">Tarif: ${rec.ing.map(([k,n])=>n+'× '+ITEMS[k].name).join(' + ')} → ${rec.n}× ${I.name}</div>`:''}${src.length?`<div class="ed g">Kaynak: ${[...new Set(src)].slice(0,8).join(', ')}</div>`:''}`))});return}
  if(tab==='mine'){B.innerHTML='<div class="help"><h3>Madencilik</h3>Haritadaki engellere tıklayarak kazmaya başla. Kazma sırasında oyun devam eder; bitince blok kırılır, yerine kule kurabilirsin, zümrüt ve bazen eşya kazanırsın. Bazı bloklar (Gıcırtı Kalbi, Sculk Çığırtkanı, End Kristali, Fırtına Jeneratörü...) haritanın mekaniğini değiştirir.</div>';
    Object.entries(OBS).forEach(([k,o])=>{const c=mkCanvas(48,48),g=c.getContext('2d');g.imageSmoothingEnabled=false;try{drawObstacle(g,0,0,k,'plains')}catch(e){}
      const drops=(o.drops||[]).map(([id,p,n])=>`${n>1?n+'× ':''}${ITEMS[id]?ITEMS[id].name:id}${p<1?' (%'+Math.round(p*100)+')':''}`).join(', ');
      B.appendChild(bookEntry(c,`<div class="en">${o.name}</div><div class="ed">Süre: ${o.time} sn · Ödül: <span class="g">+${o.reward} zümrüt</span>${o.souls?` · <span class="b">+${o.souls} ruh</span>`:''}${o.light?' · <span class="y">Işık yayar</span>':''}</div>${o.desc?`<div class="ed">${o.desc}</div>`:''}${drops?`<div class="ed b">Düşürür: ${drops}</div>`:''}`))});return}
  if(tab==='music'){renderJukebox(B);return}
}
function renderJukebox(B){
  const on=tracksEnabled(),playing=MP.mode==='jukebox'?MP.jukebox:null;
  B.insertAdjacentHTML('beforeend',`<div class="help"><h3>Müzik Kutusu</h3>${on?'Oyunun içine gömülü C418 parçaları. Bir parçayı dinlemek için ▶\'e bas.':'Gömülü parça bulunamadı ya da ayarlardan prosedürel müzik seçildi.'}
    ${playing?`<div style="margin-top:6px">Çalıyor: <b>${TRACK_TITLES[playing]}</b> <button class="mc-btn sm red" id="jbStop">■ Durdur</button></div>`:''}</div>`);
  const st=$('jbStop');if(st)st.onclick=()=>{jukeboxStop();sfx('click',true);renderBook()};
  for(const[k,P]of Object.entries(PLAYLISTS)){const tracks=[...new Set([P.main,...P.list,...(P.night||[]),P.boss,...(P.tides?P.tides.flat():[]),P.between].filter(Boolean))];
    const e=document.createElement('div');e.className='entry';
    const disc=pixIcon('disc',40),c=mkCanvas(56,56),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(disc,8,8,40,40);e.appendChild(c);
    const d=document.createElement('div');d.style.flex='1';
    d.innerHTML=`<div class="en">${P.name}</div><div class="ed gr">${[P.night?'Gece: '+P.night.map(t=>TRACK_TITLES[t]).join(', '):'',P.boss?'Boss: '+TRACK_TITLES[P.boss]:'',P.tides?'Gelgitler: '+P.tides.map((l,i)=>TIDES[i].name+' → '+l.map(t=>TRACK_TITLES[t]).join(', ')).join(' · '):'',P.between?'Dalga arası: '+TRACK_TITLES[P.between]:''].filter(Boolean).join(' · ')}</div>`;
    const row=document.createElement('div');
    tracks.forEach(t=>{const b=document.createElement('button');b.className='mc-btn sm'+(playing===t?' green':'');b.style.margin='2px';b.textContent=(playing===t?'♪ ':'▶ ')+(TRACK_TITLES[t]||t);b.disabled=!on;
      b.onclick=()=>{if(playing===t)jukeboxStop();else jukeboxPlay(t);sfx('click',true);setTimeout(renderBook,60)};row.appendChild(b)});
    d.appendChild(row);e.appendChild(d);B.appendChild(e)}
}

/* ---------- ayarlar ---------- */
function renderSettings(){const S=SAVE.settings;$('setMusic').value=Math.round(S.music*100);$('setSfx').value=Math.round(S.sfx*100);
  $('lblMusic').textContent='Müzik: '+Math.round(S.music*100)+'%';$('lblSfx').textContent='Ses Efektleri: '+Math.round(S.sfx*100)+'%';
  const onf=v=>v?'AÇIK':'KAPALI';
  $('setMusMode').textContent='Müzik Türü: '+(S.musicMode==='proc'?'PROSEDÜREL':'C418 PARÇALARI');
  $('setDmg').textContent='Hasar Sayıları: '+onf(S.dmgNums);$('setShake').textContent='Ekran Sarsıntısı: '+onf(S.shake);
  $('setPart').textContent='Parçacıklar: '+(S.particles==='high'?'YÜKSEK':'DÜŞÜK');$('setAuto').textContent='Otomatik Dalga: '+onf(S.autoWave);
  $('setRanges').textContent='Tüm Menziller: '+onf(S.showRanges);$('setHp').textContent='Kule Can Çubukları: '+onf(S.hpBars);
  if(!UI.wipe)$('setWipe').textContent='Tüm Verileri Sil'}

/* ---------- buton bağlantıları ---------- */
const on=(id,f)=>$(id).addEventListener('click',e=>{initAudio();sfx('click',true);f(e)});
on('mPlay',()=>{if(!dimUnlocked(UI.dim))UI.dim='ow';if(SAVE.lastDim&&dimUnlocked(SAVE.lastDim)&&!UI.dimChosen){UI.dim=SAVE.lastDim;UI.dimChosen=true;
    const ms=MAPS.filter(m=>m.dim===UI.dim);UI.map=(ms.filter(m=>mapUnlocked(m,false)&&!SAVE.done[m.id])[0]||ms.filter(m=>mapUnlocked(m,false)).pop()||ms[0]).idx}
  renderLevels();showScreen('scrLevels')});
on('mPerks',()=>{renderPerks();showScreen('scrPerks')});
on('mAch',()=>{renderAch();showScreen('scrAch')});
on('mBook',()=>{UI.fromPause=false;renderBook();showScreen('scrBook')});
on('mSettings',()=>{UI.fromPause=false;UI.wipe=0;renderSettings();showScreen('scrSettings')});
on('lvBack',()=>showScreen('scrMenu'));on('pkBack',()=>showScreen('scrMenu'));on('acBack',()=>showScreen('scrMenu'));
on('bkBack',()=>{jukeboxStop();showScreen(UI.fromPause?'scrPause':'scrMenu')});on('stBack',()=>showScreen(UI.fromPause?'scrPause':'scrMenu'));
on('lvStart',()=>{const m=MAPS[UI.map];if(!m||!mapUnlocked(m,UI.diff==='creative'))return;startGame(UI.map,UI.diff,UI.mode==='endless')});
on('pkReset',()=>{SAVE.perks={};saveGame();renderPerks()});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{UI.mode=b.dataset.mode;sfx('click',true);renderLevels()}));
document.querySelectorAll('[data-diff]').forEach(b=>b.addEventListener('click',()=>{UI.diff=b.dataset.diff;sfx('click',true);renderLevels()}));
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{UI.bookTab=b.dataset.tab;sfx('click',true);renderBook()}));
$('setMusic').addEventListener('input',e=>{SAVE.settings.music=e.target.value/100;applyVolumes();saveGame();renderSettings()});
$('setSfx').addEventListener('input',e=>{SAVE.settings.sfx=e.target.value/100;applyVolumes();saveGame();renderSettings()});
on('setMusMode',()=>{SAVE.settings.musicMode=SAVE.settings.musicMode==='proc'?'c418':'proc';saveGame();renderSettings()});
on('setDmg',()=>{SAVE.settings.dmgNums=!SAVE.settings.dmgNums;saveGame();renderSettings()});
on('setShake',()=>{SAVE.settings.shake=!SAVE.settings.shake;saveGame();renderSettings()});
on('setPart',()=>{SAVE.settings.particles=SAVE.settings.particles==='high'?'low':'high';saveGame();renderSettings()});
on('setAuto',()=>{SAVE.settings.autoWave=!SAVE.settings.autoWave;saveGame();renderSettings()});
on('setRanges',()=>{SAVE.settings.showRanges=!SAVE.settings.showRanges;saveGame();renderSettings()});
on('setHp',()=>{SAVE.settings.hpBars=!SAVE.settings.hpBars;saveGame();renderSettings()});
on('setWipe',()=>{if(!UI.wipe){UI.wipe=1;$('setWipe').textContent='Emin misin? Tekrar tıkla';return}if(UI.wipe===2)return;
  const st=SAVE.settings;SAVE=defaultSave();SAVE.settings=st;saveGame();updateXPUI();for(const k in PREV)delete PREV[k];UI.wipe=2;$('setWipe').textContent='Veriler silindi'});
on('psResume',()=>togglePause(false));
on('psInv',()=>openInventory());
on('invClose',()=>closeInventory());
on('btnInv',()=>openInventory());
on('psSettings',()=>{UI.fromPause=true;UI.wipe=0;renderSettings();showScreen('scrSettings')});
on('psBook',()=>{UI.fromPause=true;renderBook();showScreen('scrBook')});
on('psRestart',()=>{settleItems(false);const L=UI.last;startGame(L.map,L.diff,L.endless)});
on('psQuit',()=>{settleItems(false);startDemo();showScreen('scrMenu')});
on('enAgain',()=>{const L=UI.last;startGame(L.map,L.diff,L.endless)});
on('enNext',()=>{const i=+$('enNext').dataset.idx;if(isNaN(i))return;const L=UI.last;UI.map=i;startGame(i,L.diff,false)});
on('enMenu',()=>{startDemo();renderLevels();showScreen('scrLevels')});
on('btnPause',()=>togglePause());
on('btnSpeed',()=>toggleSpeed());
$('btnWave').addEventListener('click',()=>{initAudio();if(G&&!G.demo&&!G.over&&!G.paused)startNextWave()});
