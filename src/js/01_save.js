/* ============================ KAYIT ============================
   v2 kaydı; ilk açılışta v1 kaydı (blokSavunmasi_v1) varsa ilerleme taşınır.
   v1'deki dünya kimlikleri (cayir, col, tundra, magara, cehennem, bosluk)
   v2'de aynen korunduğu için yıldızlar ve tamamlananlar kaybolmaz. */
const SAVE_KEY='blokSavunmasi_v2', SAVE_KEY_V1='blokSavunmasi_v1';
function defaultSave(){return{done:{},stars:{},xp:0,level:0,perks:{},ach:{},kills:0,mined:0,games:0,endlessBest:{},tutorial:false,
  items:{},loadouts:{},belt:[null,null,null,null],blubs:0,crafted:0,bossKills:{},seenDim:{ow:true},lastDim:'ow',
  settings:{music:.5,sfx:.7,dmgNums:true,shake:true,particles:'high',autoWave:false,showRanges:false,musicMode:'c418',hpBars:true}}}
let SAVE=defaultSave();
function loadSave(){
  try{
    let raw=localStorage.getItem(SAVE_KEY),migrated=false;
    if(!raw){raw=localStorage.getItem(SAVE_KEY_V1);migrated=!!raw}
    if(raw){const s=JSON.parse(raw),d=defaultSave();SAVE=Object.assign(d,s);SAVE.settings=Object.assign(defaultSave().settings,s.settings||{});
      if(!Array.isArray(SAVE.belt)||SAVE.belt.length!==4)SAVE.belt=[null,null,null,null];
      if(migrated){delete SAVE.unlocked;SAVE.settings.musicMode='c418';if((SAVE.settings.music||0)<.3)SAVE.settings.music=.5;saveGame()}}
  }catch(e){SAVE=defaultSave()}
}
function saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(SAVE))}catch(e){}}
const doneCount=()=>Object.keys(SAVE.done).filter(k=>SAVE.done[k]).length;
