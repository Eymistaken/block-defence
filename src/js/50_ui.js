/* ============================ ARAYÜZ: HUD, HIZLI ERİŞİM, PANEL, ENVANTER ============================ */
const UI={map:0,dim:'ow',diff:'normal',mode:'campaign',bookTab:'help',bookFilter:'all',inGame:false,fromPause:false,
  invOpen:false,invFromPause:false,carry:null,waveSig:null,panelSig:null,beltSig:null,abilSig:null,wipe:0,
  last:{map:0,diff:'normal',endless:false}};
const REALM_NAMES={ow:'Overworld',ocean:'Okyanus Anıtı',raid:'Köy Baskını',deep:'Karanlık Derinlikler',pale:'Solgun Bahçe',ne:'Nether',end:'End',sift:'Sift'};
const BELT_KEYS=['Z','X','C','V'];

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('show',s.id===id));hideTip()}
function banner(t,sub){const b=$('banner');b.innerHTML=t+(sub||'');b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
function toast(icon,t1,t2,cls){const el=document.createElement('div');el.className='toast '+(cls||'');el.appendChild(iconFor(icon));
  const d=document.createElement('div');d.innerHTML=`<div class="t1">${t1}</div><div class="t2">${t2}</div>`;el.appendChild(d);
  const box=$('toasts');while(box.children.length>4)box.firstChild.remove();box.appendChild(el);setTimeout(()=>el.remove(),5200)}
/* Yaratıcı modda yalnızca küçük, oyun içi başarımlar açılır */
const CREATIVE_ACH=['firstKill','golem','diamond','miner','chain','boom','maxed','builder','craft','blub','heart','netherite','tide'];
function unlockAch(id){if(!G||G.demo||SAVE.ach[id])return;if(G.diff.creative&&!CREATIVE_ACH.includes(id))return;
  const A=ACHS.find(a=>a.id===id);if(!A)return;SAVE.ach[id]=Date.now();saveGame();sfx('ach',true);toast(A.icon,'Başarım Kazanıldı!',A.name)}
const tip=$('tooltip');
function showTip(html,x,y){tip.innerHTML=html;tip.style.display='block';const r=tip.getBoundingClientRect();let px=x+16,py=y-r.height-10;
  if(px+r.width>innerWidth-6)px=x-r.width-16;if(py<6)py=y+20;if(py+r.height>innerHeight-4)py=innerHeight-r.height-4;tip.style.left=Math.max(4,px)+'px';tip.style.top=py+'px'}
function hideTip(){tip.style.display='none'}
/* bir öğeye tooltip bağla (html her seferinde yeniden üretilir) */
function tipOn(el,fn){el.onmouseenter=e=>showTip(fn(),e.clientX,e.clientY);el.onmousemove=e=>showTip(fn(),e.clientX,e.clientY);el.onmouseleave=hideTip}

/* ---------- HUD ---------- */
function setupStatic(){
  drawPix($('icoHeart').getContext('2d'),'heart',0,0,1);drawPix($('icoEm').getContext('2d'),'emerald',0,0,1);
  const sc=$('icoSoul');sc.width=8;sc.height=8;drawPix(sc.getContext('2d'),'soul',0,0,1);
  const dirt=mkCanvas(32,32),dg=dirt.getContext('2d');dg.drawImage(TX.dirt[0],0,0);dg.drawImage(TX.dirt[1],16,0);dg.drawImage(TX.dirt[2],0,16);dg.drawImage(TX.dirt[0],16,16);
  document.documentElement.style.setProperty('--dirt',`url(${dirt.toDataURL()})`);
  const st=mkCanvas(16,16);st.getContext('2d').drawImage(TX.cobble[0],0,0);document.documentElement.style.setProperty('--stone',`url(${st.toDataURL()})`);
  $('splash').textContent=pick(SPLASHES);
}
let hudCache={};
function hudSet(id,v,prop){prop=prop||'textContent';const k=id+prop;if(hudCache[k]===v)return;hudCache[k]=v;if(prop==='display')$(id).style.display=v;else if(prop==='color')$(id).style.color=v;else $(id)[prop]=v}
function timeLabel(){
  let s;
  if(G.biome.dn==='pale')s=G.tod>.5?'☾ Gece · Gıcırtılar uyanık':'☀ Gündüz';
  else if(G.biome.dn)s=G.tod>.5?'☾ Gece':'☀ Gündüz';
  else s=({ne:'🔥 Nether',end:'✧ End',sift:'✿ Sift'})[G.dim]||({deep:'◆ Karanlık Derinlikler',ocean:'≈ Okyanus Anıtı'})[G.realm]||'⛏ Yeraltı';
  if(G.rain)s+=' ☂';if(G.storm)s+=' ⚡';if(G.sandT>0)s+=' · Kum Fırtınası';if(G.darkT>0)s+=' · Karanlık';
  return s}
function mechLabel(){
  const M=G.map.mech||{};
  if(M.vib){if(G.wardenOut&&G.wardenOut.alive)return['⚠ MUHAFIZ DIŞARIDA','#ff5a5a'];
    return['Uyarı '+[0,1,2,3].map(i=>i<G.warn?'●':'○').join('')+(G.deafT>0?' · Sağır '+Math.ceil(G.deafT):''),G.warn>=3?'#ff8a6a':'#7af0e8']}
  if(G.tide!=null){const T=TIDES[G.tide];return['Gelgit: '+T.name+(G.tideOverT>0?' ('+Math.ceil(G.tideOverT)+' sn)':''),T.col]}
  if(G.fatigue>0)return['Madenci Yorgunluğu','#c8b060'];
  return null}
function updateHUD(){
  if(!G||G.demo)return;
  hudSet('stMoney',G.diff.creative?'∞':fmt(G.money));
  hudSet('stLives',String(G.lives));
  hudSet('stHearts',G.lifeLabel+' canı','title');
  hudSet('stWave',G.endless?`Dalga ${G.wave} ∞`:`Dalga ${G.wave}/${G.totalWaves}`);
  hudSet('stTime',timeLabel());
  const sift=G.realm==='sift'||G.souls>0;hudSet('stSoulBox',sift?'flex':'none','display');if(sift)hudSet('stSouls',String(Math.floor(G.souls)));
  const m=mechLabel();hudSet('stMechBox',m?'flex':'none','display');if(m){hudSet('stMech',m[0]);hudSet('stMech',m[1],'color')}
  if(G.boss&&G.boss.alive){const b=G.boss;$('bossFill').style.width=clamp(b.hp/b.maxHp*100,0,100)+'%';
    let sub='';
    if(b.heartsAlive>0)sub='Kadim Kalpler: '+b.heartsAlive+' · kalpleri kaz, yoksa ölümsüz!';
    else if(b.crystalsAlive>0)sub='End Kristalleri: '+b.crystalsAlive+' · kristaller ejderhayı iyileştiriyor';
    else if(b.shieldOn)sub='Wither Zırhı: mermiler işlemiyor';
    else if(b.invuln)sub='Dokunulmaz';
    else if(b.emergeT>0)sub='Topraktan çıkıyor...';
    hudSet('bossSub',sub)}
}
function updateXPUI(){$('xplvl').textContent=SAVE.level;$('xpfill').style.width=clamp(SAVE.xp/xpNeed(SAVE.level)*100,0,100)+'%';$('footLvl').textContent='Seviye '+SAVE.level}

/* ---------- hızlı erişim çubuğu (9 yuva) ---------- */
function realmTag(D){return D.realm?`<div class="p">✦ ${REALM_NAMES[D.realm]} kulesi</div>`:''}
function towerTip(type,slot){
  const D=TOWERS[type];let h=`<div class="t">${D.name}</div>${realmTag(D)}<div class="gr">${D.desc}</div>`;
  if(!unlockedTower(type))return h+`<div class="r">🔒 Kilitli: ${D.need} dünya bitirince açılır (şu an ${doneCount()}).</div>`;
  h+=`<div class="g">Maliyet: ${towerCost(type,0)} zümrüt</div>`;
  statLines(type,0).forEach(([k,v])=>h+=`<div><span class="gr">${k}:</span> ${v}</div>`);
  if(!D.trap&&!D.block)h+=`<div><span class="gr">Can:</span> ${Math.round(TOWER_HP[0]*(D.hpm||1)*(1+perk('unbreak')*.08))}</div>`;
  if(!D.trap&&!D.eco&&!D.support&&!D.block)h+=`<div class="${D.air?'b':'r'}">${D.air?'✔ Uçanları vurur':'✘ Uçanları vuramaz'}</div>`;
  if(G&&G.map&&G.map.mech&&G.map.mech.vib&&D.vib)h+=`<div class="y">〰 Titreşim: ${D.vib} (Sculk sensörleri duyar)</div>`;
  return h+(slot!=null?`<div class="y">Kısayol: ${slot+1}</div>`:'');
}
function buildHotbar(){
  const hb=$('hotbar');hb.innerHTML='';if(!G||G.demo)return;
  G.hotbar.forEach((type,i)=>{const s=document.createElement('div');s.className='slot';s.dataset.i=i;
    if(type&&TOWERS[type]){s.dataset.type=type;if(TOWERS[type].realm)s.classList.add('special');
      const cc=mkCanvas(56,56);cc.getContext('2d').drawImage(towerIcon(type),0,0);s.appendChild(cc);
      s.insertAdjacentHTML('beforeend',`<span class="key">${i+1}</span><span class="cost">${towerCost(type,0)}</span>`);
      s.onclick=()=>selectSlot(i);tipOn(s,()=>towerTip(type,i))}
    else{s.classList.add('empty');s.insertAdjacentHTML('beforeend',`<span class="key">${i+1}</span>`);s.onclick=()=>openInventory();
      tipOn(s,()=>'<div class="t">Boş yuva</div><div class="gr">Envanteri aç (Tab) ve buraya bir kule yerleştir.</div>')}
    hb.appendChild(s)});
  updateHotbar();
}
function updateHotbar(){if(!G)return;document.querySelectorAll('#hotbar .slot').forEach(s=>{const t=s.dataset.type;if(!t)return;const lock=!unlockedTower(t);
  s.classList.toggle('locked',lock);s.classList.toggle('poor',!lock&&!canAfford(towerCost(t,0)));s.classList.toggle('sel',G.place===t)})}
function updateHotbarSel(){document.querySelectorAll('#hotbar .slot').forEach(s=>s.classList.toggle('sel',!!G&&!!s.dataset.type&&G.place===s.dataset.type))}
function selectPlace(type){if(!G||G.demo||G.paused||!type)return;if(!unlockedTower(type)){sfx('error',true);return}sfx('click',true);
  G.place=G.place===type?null:type;G.hbSel=G.hotbar.indexOf(type);G.aim=null;selectTower(null,true);updateHotbarSel();updateAbilUI();updateBeltUI();tutorialStep('select')}
function selectSlot(i){if(!G||G.demo)return;const t=G.hotbar[i];if(!t){sfx('error',true);return}selectPlace(t)}

/* ---------- yetenekler (Q W E R) ve bölge güçleri (T, Sift'te Y G) ---------- */
function buildAbilities(){const ab=$('abilities');ab.innerHTML='';UI.abilSig=null;if(!G||G.demo)return;
  ABIL.forEach(A=>{const d=document.createElement('div');d.className='abil';d.dataset.kind='abil';d.dataset.id=A.id;const c=abilIcon(A.id);c.className='ic';d.appendChild(c);
    d.insertAdjacentHTML('beforeend',`<div class="cdov"></div><div class="cdt"></div><span class="key">${A.key}</span>`);
    d.onclick=()=>useAbility(A.id);
    tipOn(d,()=>`<div class="t">${A.name}</div><div class="gr">${A.desc}</div><div class="y">Bekleme: ${Math.round(A.cd*(1-perk('magic')*.07))} sn · Kısayol: ${A.key}</div>${A.aim?'<div class="b">Nişan al ve haritaya tıkla</div>':''}`);ab.appendChild(d)});
  (REALM_POWERS[G.realm]||[]).forEach(id=>{const P=POWERS[id],d=document.createElement('div');d.className='abil power';d.dataset.kind='power';d.dataset.id=id;
    const c=abilIcon(id);c.className='ic';d.appendChild(c);
    d.insertAdjacentHTML('beforeend',`<div class="cdov"></div><div class="cdt"></div><span class="key">${P.key}</span>${P.soul?`<span class="cost">${P.soul}</span>`:''}`);
    d.onclick=()=>usePower(id);
    tipOn(d,()=>`<div class="t">${P.name}</div><div class="p">✦ ${REALM_NAMES[G.realm]} gücü</div><div class="gr">${P.desc}</div><div class="y">Bekleme: ${Math.round(powerCd(id))} sn${P.soul?' · <span class="b">Bedel: '+P.soul+' ruh</span>':''} · Kısayol: ${P.key}</div>`);
    ab.appendChild(d)});
}
function updateAbilUI(){if(!G||G.demo)return;
  document.querySelectorAll('#abilities .abil').forEach(d=>{const id=d.dataset.id,kind=d.dataset.kind;let cd,max,poor=false;
    if(kind==='abil'){const A=ABIL.find(a=>a.id===id);cd=G.abil[id]||0;max=A.cd*(1-perk('magic')*.07)}
    else{const P=POWERS[id];cd=G.pow[id]||0;max=powerCd(id);poor=!!P.soul&&G.souls<P.soul}
    const ov=d.querySelector('.cdov'),tx=d.querySelector('.cdt');
    if(cd>0){ov.style.display='block';ov.style.background=`conic-gradient(rgba(0,0,0,.7) ${clamp(cd/max,0,1)*360}deg, rgba(0,0,0,.15) 0)`;tx.textContent=Math.ceil(cd)}
    else{ov.style.display=poor?'block':'none';if(poor)ov.style.background='rgba(0,0,0,.45)';tx.textContent=''}
    d.classList.toggle('ready',cd<=0&&!poor);d.classList.toggle('poor',poor);d.classList.toggle('aim',!!G.aim&&G.aim.kind===kind&&G.aim.id===id)})}

/* ---------- kemer (Z X C V) ---------- */
function itemTip(id,keyIdx){const I=ITEMS[id],n=G&&!G.demo?(G.items[id]||0):(SAVE.items[id]||0);
  const use={aim:'Nişan al ve haritaya tıkla',self:'Anında kullanılır',tower:'Elmas seviyedeki bir kuleye tıkla',passive:'Kendiliğinden tetiklenir'}[I.use]||'Üretim malzemesi';
  const rec=RECIPES.find(r=>r.out===id);
  return`<div class="t">${I.name}</div><div class="gr">${I.desc}</div><div class="b">${use}</div><div>Adet: ${n}</div>`+
    (rec?`<div class="y">Tarif: ${rec.ing.map(([k,c])=>c+'× '+ITEMS[k].name).join(' + ')}</div>`:'')+(keyIdx!=null?`<div class="y">Kısayol: ${BELT_KEYS[keyIdx]}</div>`:'')}
function buildBelt(){UI.beltSig=null;updateBeltUI()}
function updateBeltUI(){
  const box=$('belt');if(!G||G.demo){if(box.innerHTML){box.innerHTML='';UI.beltSig=null}return}
  const sig=SAVE.belt.map(id=>id?id+':'+(G.items[id]||0):'-').join('|')+'|'+(G.aim&&G.aim.kind==='item'?G.aim.id:'');
  if(sig===UI.beltSig)return;UI.beltSig=sig;box.innerHTML='';
  SAVE.belt.forEach((id,i)=>{const s=document.createElement('div');s.className='bslot';
    if(id&&ITEMS[id]){const n=G.items[id]||0;const c=itemIcon(id,40),cc=mkCanvas(40,40);cc.getContext('2d').drawImage(c,0,0);if(!n)cc.style.opacity=.3;s.appendChild(cc);
      s.insertAdjacentHTML('beforeend',`<span class="key">${BELT_KEYS[i]}</span><span class="cnt">${n}</span>`);
      if(G.aim&&G.aim.kind==='item'&&G.aim.id===id)s.classList.add('aim');
      s.onclick=()=>useBelt(i);tipOn(s,()=>itemTip(id,i))}
    else{s.insertAdjacentHTML('beforeend',`<span class="key">${BELT_KEYS[i]}</span>`);s.onclick=()=>openInventory();
      tipOn(s,()=>'<div class="t">Boş kemer yuvası</div><div class="gr">Envanterden (Tab) bir eşya yerleştir.</div>')}
    box.appendChild(s)});
}
function useBelt(i){if(!G||G.demo||G.over||G.paused)return;const id=SAVE.belt[i];if(!id){sfx('error',true);return}
  if(G.aim&&G.aim.kind==='item'&&G.aim.id===id&&G.mouse.in&&ITEMS[id].use==='aim'){useItem(id,G.mouse.x,G.mouse.y);return}
  if(G.aim&&G.aim.kind==='item'&&G.aim.id===id){G.aim=null;updateBeltUI();updateAbilUI();return}
  useItem(id)}

/* ---------- dalga önizlemesi ---------- */
function updateWaveUI(){
  if(!G||G.demo)return;const btn=$('btnWave'),pv=$('wavePreview');
  const done=!G.endless&&G.wave>=G.totalWaves,busy=G.waves.length>0||G.enemies.length>0,def=G.nextDef;
  const sig=G.wave+'|'+done+'|'+busy+'|'+(def&&def.n);if(sig===UI.waveSig)return;UI.waveSig=sig;
  if(done){btn.disabled=true;btn.innerHTML='Son dalga!';pv.innerHTML='';return}
  btn.disabled=false;
  btn.innerHTML=busy?`⏩ Erken Çağır <span class="bonus">+${Math.round((10+(G.wave+1)*2)*G.diff.money)}</span>`:`▶ Dalga ${G.wave+1}'i Başlat`;
  pv.innerHTML='';if(!def)return;
  const lab=(t,c,tp)=>{const d=document.createElement('div');d.className='wp';d.style.color=c;d.style.padding='0 5px';d.textContent=t;if(tp)tipOn(d,()=>tp);pv.appendChild(d)};
  if(def.night)lab(G.biome.dn==='pale'?'☾ Gıcırtı Gecesi':'☾ Gece',G.biome.dn==='pale'?'#ffb050':'#bcd3ff',G.biome.dn==='pale'?'<div class="t">Gıcırtı Gecesi</div><div class="gr">Gıcırtı Kalpleri aktif. Kulelerin baktığı Gıcırtılar donar; ölümsüzdürler, kalplerini kaz.</div>':'<div class="t">Gece</div><div class="gr">Yaratıklar %10 daha güçlü; Yarasalar, Kâbuslar ve Enderman\'ler gelir.</div>');
  if(def.tide!=null){const T=TIDES[def.tide];lab('≋ '+T.name,T.col,`<div class="t">Gelgit: ${T.name} (${T.en})</div><div class="gr">${T.desc}</div>`)}
  if(def.storm)lab('⚡ Fırtına','#c8a8ff','<div class="t">Ruh Fırtınası</div><div class="gr">Fırtına Jeneratörleri yaratık çağırır. Onları kazarak sustur.</div>');
  if(def.raid&&!def.boss)lab('⚑ Baskın','#ff9a7a');
  Object.entries(def.counts).forEach(([t,n])=>{const w=document.createElement('div');w.className='wp';const c=mkCanvas(48,48);c.getContext('2d').drawImage(enemyIcon(t),0,0);w.appendChild(c);
    w.insertAdjacentHTML('beforeend',`×${n}`);if(ENEMIES[t].boss)w.style.borderColor='#c040c0';tipOn(w,()=>enemyTip(t));pv.appendChild(w)});
}
const ATK_TAG={melee:'<span class="r">Kulelere vurur</span>',siege:'<span class="r">Kuşatır: kuleyi yıkana dek döver</span>',shoot:'<span class="r">Kulelere ateş eder</span>',swoop:'<span class="r">Kulelere pike yapar</span>',laser:'<span class="r">Kulelere ışın atar</span>'};
function enemyTags(d){const t=[];const add=(c,s)=>t.push(`<span class="${c}">${s}</span>`);
  if(d.boss)add('p','BOSS');if(d.omen)add('p','Uğursuz');if(d.flying)add('b','Uçan');if(d.camo)add('p','Gizli');if(d.vibCamo)add('p','Titreşimsiz görünmez');
  if(d.armor)add('gr','Zırh '+d.armor);if(d.fireImm)add('o','Ateşe bağışık');if(d.coldImm)add('b','Soğuğa bağışık');if(d.physImm)add('gr','Fiziksele bağışık');if(d.blastImm)add('gr','Patlamaya bağışık');
  if(d.magicRes)add('p','Büyüye dirençli');if(d.iceWeak)add('b','Buza zayıf');if(d.blastWeak)add('o','Patlamaya zayıf');
  if(d.creaking)add('o','Ölümsüz: kalbini kaz');if(d.creeper)add('r','Patlar');if(d.split)add('g','Bölünür');if(d.healer)add('p','İyileştirici');if(d.catalyst)add('p','Katalizör');
  if(d.summon)add('r','Çağırıcı');if(d.webImm)add('gr','Ağa bağışık');if(d.illager)add('o','Illager: Ichor yakar');if(d.sift)add('b','Sift yaratığı: Ichor iyileştirir');
  if(d.blink||d.tpChance)add('p','Işınlanır');if(d.deflect)add('gr','Mermi savuşturur');if(d.dodge)add('gr','Kaçınır');if(d.shell)add('gr','Kabuklu');if(d.lavaWalk)add('o','Lavda yürür');if(d.swim)add('b','Yüzer');
  if(d.goldLove)add('y','Altına bayılır');if(d.fungusFear)add('b','Çarpık Mantar\'dan korkar');if(d.horde)add('r','Sürü öfkesi');if(d.zog)add('r','Her şeye saldırır');if(d.shriek)add('b','Çığlık atar');
  if(d.gazeShield)add('o','Gıcırtıları korur');if(d.resinSplat)add('o','Reçine saçar');if(d.blindAura)add('p','Körlük aurası');if(d.silk)add('gr','İpek koza');if(d.arrowEat)add('g','Ok yutar');
  if(d.gallop)add('y','Dörtnala');if(d.lifelink)add('p','Can bağı');if(d.enrage)add('r','Öfkelenir');if(d.soulDrain)add('b','Ruh emer');if(d.illusion)add('p','Yanılsama');if(d.rider)add('gr','Binicili');
  if(d.atk)t.push(ATK_TAG[d.atk.t]||'');
  return t}
function enemyTip(t){const d=ENEMIES[t];const m=G&&G.nextDef?(d.boss?G.nextDef.bossMul:G.nextDef.hpMul):1;
  return`<div class="t">${d.name}</div><div class="gr">${d.desc||''}</div><div>Can: ${Math.round(d.hp*m)} · Hız: ${d.spd}${d.lives?' · Can kaybı: '+d.lives:''}</div><div>${enemyTags(d).join(' · ')}</div>`}

/* ---------- kule istatistikleri ---------- */
function statLines(type,lvl,buffed){
  const D=TOWERS[type],s=buffed||towerLv(type,lvl),out=[],P=v=>'%'+Math.round(v*100),sec=v=>(+v).toFixed(1).replace('.0','')+' sn';
  const interval=D.support||type==='chorus'||type==='calsensor';
  if(s.dmg!=null)out.push(['Hasar',Math.round(s.dmg)]);
  if(s.dps!=null)out.push([type==='soulfire'?'Ruh ateşi/sn':'Zehir/sn',Math.round(s.dps)]);
  if(s.zap!=null)out.push(['Şok hasarı',Math.round(s.zap)]);
  if(s.zapCd!=null)out.push(['Şok aralığı',sec(s.zapCd)]);
  if(s.cd!=null)out.push(interval?['Aralık',sec(s.cd)]:['Atış hızı',(1/s.cd).toFixed(2)+'/sn']);
  if(s.range!=null)out.push(['Menzil',s.range.toFixed(1)]);
  if(s.splash!=null&&type!=='landmine')out.push([type==='ice'?'Buz alanı':type==='echogolem'?'Dalga alanı':type==='resin'?'Reçine alanı':'Patlama alanı',s.splash.toFixed(2)]);
  if(s.slow!=null&&!D.trap)out.push(['Yavaşlatma',P(s.slow)]);
  if(s.freeze)out.push(['Dondurma şansı',P(s.freeze)]);
  if(s.burn)out.push(['Yanma/sn',Math.round(s.burn)]);
  if(s.spread)out.push(['Çoklu hedef',s.spread]);
  if(s.multi)out.push(['Çoklu atış',s.multi]);
  if(s.chain)out.push(['Zincir',s.chain]);
  if(s.stun)out.push(['Sersemletme',sec(s.stun)]);
  if(s.pierce)out.push(['Delme',s.pierce]);
  if(s.crit)out.push(['Kritik',P(s.crit)]);
  if(s.knock)out.push(['Geri itme',s.knock.toFixed(2)]);
  if(s.allHit)out.push(['Alan yumruğu','✔']);
  if(s.cluster)out.push(['Parça bomba',s.cluster]);
  if(s.radius!=null)out.push(['Etki alanı',s.radius.toFixed(1)]);
  if(s.cloudT)out.push(['Bulut süresi',sec(s.cloudT)]);
  if(s.weak)out.push(['Zayıflatma','+'+P(s.weak)]);
  if(s.slowCloud)out.push(['Bulut yavaşlatma',P(s.slowCloud)]);
  if(s.bDmg)out.push(['Hasar bonusu','+'+P(s.bDmg)]);
  if(s.bRange)out.push(['Menzil bonusu','+'+P(s.bRange)]);
  if(s.bRate)out.push(['Hız bonusu','+'+P(s.bRate)]);
  if(s.heal)out.push(['Onarım/sn',+s.heal.toFixed(1)]);
  if(s.shield)out.push(['Hasar kalkanı',P(s.shield)]);
  if(s.glowT)out.push(['Parlama',sec(s.glowT)]);
  if(s.amp)out.push(['Ek hasar','+'+P(s.amp)]);
  if(s.charge)out.push(['Gereken titreşim',s.charge]);
  if(s.pulse)out.push(['Dalga alanı',s.pulse.toFixed(1)]);
  if(s.dark)out.push(['Karanlık dalgası','✔']);
  if(s.root)out.push(['Yapıştırma',sec(s.root)]);
  if(s.lev)out.push(['Yükselme',sec(s.lev)]);
  if(s.fall)out.push(['Düşme hasarı','×'+s.fall]);
  if(s.tp)out.push(['Işınlama',s.tp.toFixed(1)+' kare']);
  if(s.n)out.push([type==='blubhut'?'Blub sayısı':'Hedef sayısı',s.n]);
  if(s.block)out.push(['Engelleme',sec(s.block)]);
  if(s.charges)out.push(['Yük',s.charges]);
  if(s.income)out.push(['Dalga geliri',Math.round(s.income)]);
  if(s.trickle)out.push(['Sürekli gelir','1 / 3 sn']);
  if(D.trap&&s.slow)out.push(['Yavaşlatma',P(s.slow)]);
  if(s.life)out.push([type==='blubhut'?'Blub ömrü':'Süre',sec(s.life)]);
  if(type==='landmine')out.push(['Patlama alanı',s.splash]);
  return out;
}

/* ---------- kule paneli ---------- */
const FX_NAMES={frozenT:'Donmuş',levT:'Havada',silkT:'İpek koza',amberT:'Kehribar',mossT:'Yosun',slowT:'Yavaşlık',weakT:'Zayıflık',resinT:'Reçine',darkT:'Karanlık',blindT:'Körlük'};
const DOT_NAMES={poison:'Zehir',burn:'Yanıyor',wither:'Solma (onarılamaz)'};
function towerDebuffs(t){const f=t.fx||{},out=[];for(const k in FX_NAMES)if(f[k]>0)out.push(FX_NAMES[k]+' '+Math.ceil(f[k]));if(f.dotT>0)out.push((DOT_NAMES[f.dotK]||'Zehir')+' '+Math.ceil(f.dotT));
  if(t.stunT>0&&!out.length)out.push('Sersem '+t.stunT.toFixed(1));return out.join(' · ')}
function selectTower(t,silent){if(!G)return;G.sel=t;if(t){G.place=null;G.aim=null;updateHotbarSel();updateBeltUI();if(!silent)sfx('click',true)}refreshPanel(true)}
function refreshPanel(force){
  const p=$('towerPanel'),t=G&&G.sel;
  if(!t||G.demo||!G.towers.includes(t)){if(G&&G.sel&&!G.towers.includes(G.sel))G.sel=null;p.style.display='none';UI.panelSig=null;return}
  const D=TOWERS[t.type],hurt=t.hp<t.maxHp-.5,rc=hurt?repairCost(t):0,next=t.lvl<3&&D.lv.length>t.lvl+1?towerLv(t.type,t.lvl+1):null,upCost=next?towerCost(t.type,t.lvl+1):0;
  const sig=[t.lvl,t.mode,next&&canAfford(upCost),hurt,hurt&&canAfford(rc),sellValue(t),JSON.stringify(t.buff),t.detect,G.items.netherite||0,t.charges].join('|');
  if(!force&&sig===UI.panelSig){
    const hp=$('tpHp'),ht=$('tpHpT'),db=$('tpFx'),k=$('tpKills'),dm=$('tpDmg'),rp=$('tpRep'),ch=$('tpCharge');
    if(hp){const r=clamp(t.hp/t.maxHp,0,1);hp.style.width=r*100+'%';hp.parentNode.className='hpbar'+(r<.3?' low':r<.6?' mid':'')}
    if(ht)ht.textContent=Math.ceil(t.hp)+' / '+t.maxHp;if(db)db.textContent=towerDebuffs(t);if(k)k.textContent=t.kills;if(dm)dm.textContent=fmt(t.dmg);if(rp)rp.textContent=rc;
    if(ch)ch.textContent=Math.floor(t.charge||0)+' / '+t.s.charge;return}
  UI.panelSig=sig;
  const neth=t.lvl>=4,cur=statLines(t.type,t.lvl,t.s),base=statLines(t.type,t.lvl),nx=next?statLines(t.type,t.lvl+1):null;
  let rows='';cur.forEach(([k,v],i)=>{let up='';if(nx){const n=nx.find(r=>r[0]===k);if(n&&base[i]&&String(n[1])!==String(base[i][1]))up=` <span class="up">→ ${n[1]}</span>`}rows+=`<div class="srow"><span>${k}</span><b>${v}${up}</b></div>`});
  if(nx)nx.forEach(([k,v])=>{if(!cur.find(r=>r[0]===k))rows+=`<div class="srow"><span>${k}</span><b><span class="up">yeni: ${v}</span></b></div>`});
  const b=t.buff||{};let buffs='';
  if(b.dmg||b.range||b.rate)buffs=`<div class="ptitle">✦ ${b.conduit?'Oluk Gücü':'Fener'}: +%${Math.round((b.dmg||0)*100)} hasar${b.range?', +%'+Math.round(b.range*100)+' menzil':''}${b.rate?', +%'+Math.round(b.rate*100)+' hız':''}</div>`;
  const combat=!D.eco&&!D.support&&!D.block&&!D.trap;
  const det=combat?`<div class="ptitle">${t.detect?'👁 Gizli yaratıkları görür':'<span style="color:#7a3a3a">✘ Gizlileri göremez (Sv.3 ya da Fener gerekir)</span>'}</div>`:'';
  const nLv=D.lv.length>1?(neth?5:4):1;
  const pips=Array.from({length:nLv},(_,i)=>`<i class="${i<=t.lvl?'on':''}${i===4?' nth':''}"></i>`).join('');
  const sv=sellValue(t),r=clamp(t.hp/t.maxHp,0,1);
  const lvTxt=D.lv.length===1?'Tek seviye':neth?'Netherit ★':`Seviye ${t.lvl+1}/4`;
  const extra=t.type==='anchor'?`<div class="srow"><span>Dolu yük</span><b>${t.charges||0} / ${t.s.charges}</b></div>`:
    t.type==='calsensor'?`<div class="srow"><span>Biriken titreşim</span><b id="tpCharge">${Math.floor(t.charge||0)} / ${t.s.charge}</b></div>`:'';
  let nethBtn='';
  if(t.lvl===3&&!D.trap&&!D.block&&D.lv.length>1)nethBtn=(G.items.netherite>0)?`<button class="mc-btn" data-act="neth" style="background:#4a3a5a;color:#e8d8ff">Netherit Uygula (${G.items.netherite})</button>`:
    `<div class="ptitle" style="color:#5a3a7a">◆ Netherit Külçesi ile 5. seviyeye çıkabilir (4 Hurda + 4 Altın)</div>`;
  p.innerHTML=`<span class="close-x" data-act="close">✕</span><div class="hd"><canvas width="56" height="56" id="tpIcon"></canvas><div><div class="nm">${D.name}</div><div class="lv">${lvTxt}</div><div class="pips">${pips}</div></div></div>
    ${D.trap?'':`<div class="hpbar${r<.3?' low':r<.6?' mid':''}"><i id="tpHp" style="width:${r*100}%"></i></div><div class="hptxt"><span>Can</span><b id="tpHpT">${Math.ceil(t.hp)} / ${t.maxHp}</b></div><div class="debuffs" id="tpFx">${towerDebuffs(t)}</div>`}
    ${rows}${extra}${buffs}${det}
    ${combat?`<div class="srow"><span>Yok edilen</span><b id="tpKills">${t.kills}</b></div><div class="srow"><span>Toplam hasar</span><b id="tpDmg">${fmt(t.dmg)}</b></div>`:''}
    ${combat&&!D.trap?`<div class="tmode"><span>Hedef (H):</span><button class="mc-btn" data-act="mode">◀ ${TARGET_MODES[t.mode]} ▶</button></div>`:''}
    ${nethBtn}
    <div class="tbtns">${next?`<button class="mc-btn green" data-act="up" ${canAfford(upCost)?'':'disabled'}>Yükselt (U) — ${upCost} ◆</button>`:(D.lv.length>1?`<button class="mc-btn" disabled>${neth?'Netherit ★':'Elmas ★'}</button>`:'')}
    ${hurt&&!D.trap?`<button class="mc-btn" data-act="repair" ${canAfford(rc)?'':'disabled'}>Onar (O) — <span id="tpRep">${rc}</span> ◆</button>`:''}
    <button class="mc-btn red" data-act="sell">Sat (S) — +${sv}${sv===t.spent?' (tam iade)':''}</button></div>`;
  const ic=$('tpIcon').getContext('2d');ic.imageSmoothingEnabled=false;ic.drawImage(towerIcon(t.type,Math.min(t.lvl,4)),0,0);
  p.style.display='block';p.style.left=t.x>W/2?'10px':'auto';p.style.right=t.x>W/2?'auto':'10px';
}
$('towerPanel').addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a||!G||!G.sel)return;const t=G.sel;
  switch(a.dataset.act){
    case'up':upgradeTower(t);break;
    case'sell':sellTower(t);break;
    case'close':selectTower(null);break;
    case'repair':repairTower(t);break;
    case'neth':if(G.items.netherite>0&&applyNetherite(t)){G.items.netherite--;updateBeltUI()}break;
    case'mode':cycleTargetMode(t);break}});
function cycleTargetMode(t){const D=TOWERS[t.type];if(D.eco||D.support||D.block||D.trap)return;t.mode=(t.mode+1)%TARGET_MODES.length;sfx('click',true);refreshPanel(true)}

/* ---------- öğretici ---------- */
const TUT={select:'Hızlı erişim çubuğundan bir kule seç (1 = ilk yuva)',place:'Yolun yanındaki boş bir karoya tıklayarak kuleyi yerleştir',
  wave:'Hazır olunca ▶ Dalgayı Başlat (Boşluk tuşu)',mine:'İpucu: Ağaçlara ve cevherlere tıklayarak kaz. Zümrüt ve eşya kazanırsın! Envanter: Tab',done:''};
function tutorialStep(ev){if(!G||G.demo||SAVE.tutorial)return;const h=$('hint');
  if(ev==='start')G.tut='select';else if(ev==='select'&&G.tut==='select')G.tut='place';else if(ev==='built'&&(G.tut==='place'||G.tut==='select'))G.tut='wave';
  else if(ev==='wave'&&G.tut==='wave'){G.tut='mine';const gg=G;setTimeout(()=>{if(G===gg&&G.tut==='mine'){G.tut='done';SAVE.tutorial=true;saveGame();h.classList.remove('show')}},9000)}
  else if(ev==='mine'&&G.tut==='mine'){G.tut='done';SAVE.tutorial=true;saveGame()}
  const txt=TUT[G.tut]||'';h.textContent=txt;h.classList.toggle('show',!!txt)}

/* ============================ ENVANTER EKRANI ============================
   Sol tık: yuvadaki şeyi al / elindekini bırak (yer değiştirir)
   Shift+tık: ilk boş yuvaya gönder · Sağ tık: yuvayı boşalt ya da elindekini bırak */
function openInventory(){if(!G||G.demo||G.over)return;if(UI.invOpen){closeInventory();return}
  UI.invFromPause=G.paused&&$('scrPause').classList.contains('show');UI.invOpen=true;G.paused=true;G.place=null;G.aim=null;UI.carry=null;
  showScreen('scrInv');renderInventory();sfx('click',true)}
function closeInventory(){if(!UI.invOpen)return;dropCarry();UI.invOpen=false;
  if(G&&!G.demo){saveHotbar();saveGame();buildHotbar();buildBelt();updateAbilUI()}
  if(UI.invFromPause)showScreen('scrPause');else{if(G)G.paused=false;showScreen(null)}sfx('click',true)}
function carryIcon(){const c=UI.carry;if(!c)return null;return c.kind==='tower'?towerIcon(c.id):itemIcon(c.id,40)}
function setCarry(c){UI.carry=c;const el=$('carry');el.innerHTML='';if(c){const cc=mkCanvas(40,40),g=cc.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(carryIcon(),0,0,40,40);el.appendChild(cc);el.style.display='block'}else el.style.display='none'}
/* elde kalan bir yuvadan alınmışsa geri koy */
function dropCarry(){const c=UI.carry;if(c&&c.from!=null&&G){const arr=c.kind==='tower'?G.hotbar:SAVE.belt;if(!arr[c.from]&&!arr.includes(c.id))arr[c.from]=c.id}setCarry(null)}
document.addEventListener('mousemove',e=>{if(UI.carry){const el=$('carry');el.style.left=(e.clientX-20)+'px';el.style.top=(e.clientY-20)+'px'}});
function invSlot(icon,opt){const s=document.createElement('div');s.className='islot'+(opt.cls?' '+opt.cls:'');
  if(icon){const cc=mkCanvas(40,40),g=cc.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(icon,0,0,40,40);s.appendChild(cc)}
  if(opt.key)s.insertAdjacentHTML('beforeend',`<span class="key">${opt.key}</span>`);
  if(opt.cnt!=null)s.insertAdjacentHTML('beforeend',`<span class="cnt">${opt.cnt}</span>`);
  if(opt.info)s.onmouseenter=()=>{$('invInfo').innerHTML=opt.info()};
  if(opt.click)s.onclick=e=>{opt.click(e);};
  s.oncontextmenu=e=>{e.preventDefault();if(opt.right)opt.right(e);else{dropCarry();renderInventory()}};
  return s}
/* bir diziye (hotbar ya da kemer) yerleştirme mantığı */
function placeInto(arr,i,kind){const c=UI.carry;const old=arr[i];
  if(!c){if(old){arr[i]=null;setCarry({kind,id:old,from:i});sfx('click',true)}return}
  if(c.kind!==kind){sfx('error',true);return}
  const dup=arr.indexOf(c.id);if(dup>=0&&dup!==i)arr[dup]=null;
  arr[i]=c.id;setCarry(old&&old!==c.id?{kind,id:old,from:null}:null);sfx('click',true)}
function firstEmpty(arr,id){if(arr.includes(id))return-1;return arr.indexOf(null)}
function renderInventory(){
  if(!UI.invOpen||!G)return;
  $('invRealm').textContent=(REALM_NAMES[G.realm]===G.map.name?'':REALM_NAMES[G.realm]+' · ')+G.map.name;
  /* kuleler */
  const tw=$('invTowers');tw.innerHTML='';
  realmTowers().forEach(type=>{const D=TOWERS[type],lock=!unlockedTower(type);
    const s=invSlot(towerIcon(type),{cls:(lock?'locked ':'')+(D.realm?'special ':'')+(G.hotbar.includes(type)?'inhb ':'')+(UI.carry&&UI.carry.id===type?'sel':''),
      info:()=>towerTip(type),
      click:e=>{if(lock){sfx('error',true);return}
        if(e.shiftKey){const k=firstEmpty(G.hotbar,type);if(k<0){sfx('error',true);return}G.hotbar[k]=type;sfx('click',true)}
        else if(UI.carry&&UI.carry.id===type)dropCarry();else{dropCarry();setCarry({kind:'tower',id:type,from:null})}
        renderInventory()}});
    tw.appendChild(s)});
  /* eşyalar (sandık) */
  const it=$('invItems');it.innerHTML='';
  ITEM_ORDER.forEach(id=>{const I=ITEMS[id],n=G.items[id]||0,usable=I.use&&I.use!=='passive';
    const s=invSlot(itemIcon(id,40),{cls:(n?'':'none ')+(SAVE.belt.includes(id)?'inhb ':'')+(UI.carry&&UI.carry.id===id?'sel':''),cnt:n||null,
      info:()=>itemTip(id),
      click:e=>{if(!usable){sfx('error',true);$('invInfo').innerHTML=itemTip(id)+'<div class="r">Bu eşya kemere konmaz.</div>';return}
        if(e.shiftKey){const k=firstEmpty(SAVE.belt,id);if(k<0){sfx('error',true);return}SAVE.belt[k]=id;sfx('click',true)}
        else if(UI.carry&&UI.carry.id===id)dropCarry();else{dropCarry();setCarry({kind:'item',id,from:null})}
        renderInventory()}});
    it.appendChild(s)});
  /* hızlı erişim */
  const hb=$('invHotbar');hb.innerHTML='';
  G.hotbar.forEach((type,i)=>{const s=invSlot(type?towerIcon(type):null,{cls:type?(TOWERS[type].realm?'special':''):'',key:i+1,
      info:()=>type?towerTip(type,i):'<div class="t">Boş yuva</div>Bir kule seçip buraya tıkla.',
      click:()=>{placeInto(G.hotbar,i,'tower');renderInventory()},
      right:()=>{if(UI.carry){dropCarry()}else G.hotbar[i]=null;renderInventory()}});
    hb.appendChild(s)});
  /* kemer */
  const bl=$('invBelt');bl.innerHTML='';
  SAVE.belt.forEach((id,i)=>{const s=invSlot(id?itemIcon(id,40):null,{key:BELT_KEYS[i],cnt:id?(G.items[id]||0):null,
      info:()=>id?itemTip(id,i):'<div class="t">Boş kemer yuvası</div>Bir eşya seçip buraya tıkla.',
      click:()=>{placeInto(SAVE.belt,i,'item');renderInventory()},
      right:()=>{if(UI.carry){dropCarry()}else SAVE.belt[i]=null;renderInventory()}});
    bl.appendChild(s)});
  /* üretim */
  const cr=$('invCraft');cr.innerHTML='';
  RECIPES.forEach((Rc,i)=>{const d=document.createElement('div');d.className='recipe';
    Rc.ing.forEach(([id,n])=>{const g=document.createElement('span');g.className='ing';const c=mkCanvas(26,26),cg=c.getContext('2d');cg.imageSmoothingEnabled=false;cg.drawImage(itemIcon(id,40),0,0,26,26);g.appendChild(c);
      const have=G.items[id]||0;g.insertAdjacentHTML('beforeend',`<span style="color:${have>=n?'#1a6a1a':'#8a1a1a'}">${have}/${n}</span>`);d.appendChild(g)});
    d.insertAdjacentHTML('beforeend','<span class="arrow">➜</span>');
    const o=mkCanvas(26,26),og=o.getContext('2d');og.imageSmoothingEnabled=false;og.drawImage(itemIcon(Rc.out,40),0,0,26,26);d.appendChild(o);
    d.insertAdjacentHTML('beforeend',`<span class="ing">×${Rc.n}</span>`);
    const b=document.createElement('button');b.className='mc-btn green';b.textContent='Üret';b.disabled=!canCraft(Rc);b.onclick=()=>craft(i);d.appendChild(b);
    d.onmouseenter=()=>{$('invInfo').innerHTML=itemTip(Rc.out)};cr.appendChild(d)});
}
$('scrInv').addEventListener('contextmenu',e=>e.preventDefault());
