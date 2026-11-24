/* ============================ GİRİŞ: FARE & KLAVYE ============================ */
function toCanvas(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
function cancelAction(){if(!G||G.demo)return;G.place=null;G.aim=null;selectTower(null);updateHotbarSel();updateAbilUI();updateBeltUI()}
canvas.addEventListener('pointermove',e=>{if(!G)return;const p=toCanvas(e);G.mouse={x:p.x,y:p.y,in:true};G.hover={tx:Math.floor(p.x/TILE),ty:Math.floor(p.y/TILE)};hoverTip(e,p)});
canvas.addEventListener('pointerleave',()=>{if(G){G.mouse.in=false;hideTip()}});
canvas.addEventListener('contextmenu',e=>{e.preventDefault();cancelAction()});
canvas.addEventListener('pointerdown',e=>{
  initAudio();if(!G||G.demo||G.over||G.paused)return;if(e.button!==0)return;
  const p=toCanvas(e),tx=Math.floor(p.x/TILE),ty=Math.floor(p.y/TILE);G.mouse={x:p.x,y:p.y,in:true};G.hover={tx,ty};
  if(G.aim){const a=G.aim;
    if(a.kind==='abil')useAbility(a.id,p.x,p.y);else if(a.kind==='power')usePower(a.id,p.x,p.y);else if(a.kind==='item')useItem(a.id,p.x,p.y);
    updateAbilUI();updateBeltUI();return}
  if(G.place){if(buildTower(G.place,tx,ty)&&!e.shiftKey){G.place=null;updateHotbarSel()}updateHotbar();return}
  if(G.realm==='sift'&&petBlub(p.x,p.y))return;
  const c=cell(tx,ty);if(!c)return;
  if(c.tower){selectTower(c.tower);return}
  if(c.obs){startMining(tx,ty);selectTower(null);return}
  selectTower(null);
});
/* fare tekerleği: hızlı erişim çubuğunda dolaş */
function cycleHotbar(dir){if(!G||G.demo||G.over||G.paused)return;const n=G.hotbar.length;let i=G.hbSel<0?(dir>0?-1:0):G.hbSel;
  for(let k=0;k<n;k++){i=(i+dir+n)%n;const t=G.hotbar[i];if(t&&unlockedTower(t)){G.hbSel=i;G.place=null;selectPlace(t);return}}}
function onWheel(e){if(!G||G.demo||UI.invOpen)return;e.preventDefault();cycleHotbar(e.deltaY>0?1:-1)}
canvas.addEventListener('wheel',onWheel,{passive:false});
$('bottombar').addEventListener('wheel',onWheel,{passive:false});

function hoverTip(e,p){
  if(G.demo||G.place||G.aim||G.paused){hideTip();return}
  let en=null,bd=20*20;for(const ee of G.enemies){if(!ee.alive||(ee.def.camo&&!(ee.revealT>0)&&!(G.revealT>0))||(ee.def.vibCamo&&!(ee.revealT>0)&&!(G.revealT>0)))continue;
    const yy=(enemyTopY(ee)+ee.y+8)/2,dd=d2(p.x,p.y,ee.x,yy);if(dd<bd){bd=dd;en=ee}}
  if(en){const d=en.def;showTip(`<div class="t">${d.name}</div><div>❤ ${en.invuln?'∞':Math.ceil(en.hp)+' / '+Math.round(en.maxHp)}</div><div>${enemyTags(d).join(' · ')}</div>`,e.clientX,e.clientY);return}
  if(G.realm==='sift'){for(const b of G.blubs)if(d2(b.x,b.y-6,p.x,p.y)<16*16){showTip('<div class="t">Blub</div><div class="gr">Sift\'in dost yaratığı. Tıkla ve sev: +3 ruh.</div>',e.clientX,e.clientY);return}}
  const c=cell(G.hover.tx,G.hover.ty);
  if(c&&c.obs){const O=OBS[c.obs],ok=canMine(c);
    const drops=(O.drops||[]).map(([id,pr])=>ITEMS[id]?ITEMS[id].name+(pr<1?' %'+Math.round(pr*100):''):id).join(', ');
    showTip(`<div class="t">${O.name}</div>${O.desc?`<div class="gr">${O.desc}</div>`:''}<div class="g">Kaz: +${Math.round(O.reward*(1+perk('mining')*.15))} zümrüt${O.souls?' · +'+O.souls+' ruh':''}</div>`+
      (drops?`<div class="b">Düşürür: ${drops}</div>`:'')+
      (ok?`<div class="gr">Süre: ${(O.time*(1-perk('mining')*.12)*(G.fatigue?1.6:1)).toFixed(1)} sn · Tıkla ve kaz</div>`:'<div class="r">Şimdilik kazılamaz</div>'),e.clientX,e.clientY);return}
  if(c&&c.tower&&c.tower!==G.sel){const t=c.tower,D=TOWERS[t.type];const fx=towerDebuffs(t);
    showTip(`<div class="t">${D.name} <span class="gr">${t.lvl>=4?'Netherit':'Sv.'+(t.lvl+1)}</span></div>${D.trap?'':`<div>❤ ${Math.ceil(t.hp)} / ${t.maxHp}</div>`}${fx?`<div class="p">${fx}</div>`:''}<div class="gr">Tıkla: seç</div>`,e.clientX,e.clientY);return}
  hideTip();
}
function screenShown(id){return $(id).classList.contains('show')}
window.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT')return;initAudio();
  const k=e.key,lk=k.length===1?k.toLowerCase():k;
  /* envanter açıkken yalnızca kapatma tuşları */
  if(UI.invOpen){if(k==='Escape'||k==='Tab'||lk==='i'){e.preventDefault();closeInventory()}return}
  if(k==='Escape'){
    if(!G||G.demo){if(screenShown('scrBook'))jukeboxStop();if(!screenShown('scrMenu'))showScreen('scrMenu');return}
    if(G.over)return;
    if(G.place||G.aim||G.sel){cancelAction();return}
    if(screenShown('scrSettings')||screenShown('scrBook')){if(screenShown('scrBook'))jukeboxStop();showScreen('scrPause');return}
    togglePause();return}
  if(!G||G.demo||G.over)return;
  if(k==='Tab'||lk==='i'){e.preventDefault();if(!G.paused||screenShown('scrPause'))openInventory();return}
  if(lk==='p'){togglePause();return}
  if(G.paused)return;
  if(k>='1'&&k<='9'){selectSlot(+k-1);e.preventDefault();return}
  if(k===' '){e.preventDefault();startNextWave();return}
  if(lk==='f'){toggleSpeed();return}
  if(G.sel){
    if(lk==='u'){upgradeTower(G.sel);return}
    if(lk==='s'||k==='Delete'){sellTower(G.sel);return}
    if(lk==='o'){repairTower(G.sel);return}
    if(lk==='h'){cycleTargetMode(G.sel);return}}
  const ai=['q','w','e','r'].indexOf(lk);
  if(ai>=0){const id=ABIL[ai].id;if(G.aim&&G.aim.kind==='abil'&&G.aim.id===id&&G.mouse.in)useAbility(id,G.mouse.x,G.mouse.y);else useAbility(id);updateAbilUI();return}
  const pw=(REALM_POWERS[G.realm]||[]).find(id=>POWERS[id].key.toLowerCase()===lk);
  if(pw){if(G.aim&&G.aim.kind==='power'&&G.aim.id===pw&&G.mouse.in)usePower(pw,G.mouse.x,G.mouse.y);else usePower(pw);updateAbilUI();return}
  const bi=['z','x','c','v'].indexOf(lk);if(bi>=0){useBelt(bi);return}
});
document.addEventListener('pointerdown',()=>initAudio());
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G&&!G.demo&&!G.over&&!G.paused)togglePause(true)});

/* ---------- boyutlandırma ---------- */
function fitCanvas(){const r=$('stage').getBoundingClientRect();const s=Math.max(.1,Math.min(r.width/W,r.height/H));canvas.style.width=Math.floor(W*s)+'px';canvas.style.height=Math.floor(H*s)+'px'}
window.addEventListener('resize',fitCanvas);
if(window.ResizeObserver)new ResizeObserver(fitCanvas).observe($('stage'));
