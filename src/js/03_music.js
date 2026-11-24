/* ============================ MÜZİK ============================
   1) Gömülü C418 parçaları (musics/muzik-haritasi.md'ye göre atanmış)
      - Her dünyada önce "ana parça" çalar, sonra Minecraft'taki gibi
        sessizlik aralıklarıyla listeden rastgele parçalar gelir.
      - Boss dalgası, gece, Sift gelgiti ve Muhafız'ın ortaya çıkışı listeyi değiştirir.
   2) Parçalar yoksa ya da ayarlardan kapatıldıysa prosedürel müzik (yedek). */

const TRACK_TITLES={minecraft:'Minecraft',mutation:'Mutation',sweden:'Sweden',clark:'Clark',aria_math:'Aria Math',dreiton:'Dreiton',equinoxe:'Équinoxe',mice_on_venus:'Mice on Venus',dry_hands:'Dry Hands',kyoto:'Kyoto',wet_hands:'Wet Hands',haggstrom:'Haggstrom',excuse:'Excuse',key:'Key',flake:'Flake',concrete_halls:'Concrete Halls',dead_voxel:'Dead Voxel',warmth:'Warmth',ballad_of_the_cats:'Ballad of the Cats',the_end:'The End',alpha:'Alpha',floating_trees:'Floating Trees',axolotl:'Axolotl',dragon_fish:'Dragon Fish',subwoofer_lullaby:'Subwoofer Lullaby',moog_city_2:'Moog City 2',mall:'Mall',ki:'Ki',eleven:'Eleven',thirteen:'Thirteen',ward:'Ward'};

/* Çalma listeleri. main = ana parça; night = gece dalgaları; boss = boss parçası;
   tides = Sift gelgitlerine göre [Akış, Direniş, Bereket]; gap = parçalar arası sessizlik (sn). */
const PLAYLISTS={
  menu:{name:'Ana Menü',main:'minecraft',list:['minecraft','mutation'],gap:[6,16]},
  plains:{name:'Ova',main:'minecraft',list:['minecraft','sweden','clark','aria_math'],night:['dreiton','aria_math']},
  desert:{name:'Çöl',main:'equinoxe',list:['equinoxe','mice_on_venus','dry_hands']},
  tundra:{name:'Tundra',main:'kyoto',list:['kyoto','wet_hands','haggstrom']},
  cave:{name:'Mağaralar',main:'excuse',list:['excuse','key','flake']},
  swamp:{name:'Bataklık',main:'aria_math',list:['aria_math','clark','sweden'],night:['dreiton']},
  ocean:{name:'Okyanus Anıtı',main:'dragon_fish',list:['dragon_fish','axolotl','wet_hands']},
  raid:{name:'Köy Baskını',main:'clark',list:['clark','mutation','sweden'],night:['dreiton'],boss:'dreiton'},
  /* Solgun Bahçe: gerçek oyunda bu biyomda müzik çalmaz. Burada uzun sessizlikler,
     seyrek ve soluk parçalar; Gıcırtı uyanınca (gece / boss) Dreiton. */
  pale:{name:'Solgun Bahçe',main:'flake',list:['flake','mutation','haggstrom'],night:['dreiton'],boss:'dreiton',gap:[45,90]},
  /* Karanlık Derinlikler: müzik az ve seyrek; Muhafız ortaya çıkınca Eleven. */
  deep:{name:'Karanlık Derinlikler',main:'thirteen',list:['thirteen','ward','excuse','key','mice_on_venus'],boss:'eleven',gap:[30,60]},
  nether:{name:'Nether',main:'concrete_halls',list:['concrete_halls','dead_voxel','warmth','ballad_of_the_cats']},
  end:{name:'End',main:'the_end',list:['the_end'],boss:'the_end',gap:[20,40]},
  sift:{name:'Sift',main:'floating_trees',list:['floating_trees','axolotl','dragon_fish','subwoofer_lullaby','moog_city_2','mall'],
    tides:[['floating_trees','axolotl'],['subwoofer_lullaby','dragon_fish'],['moog_city_2','mall','floating_trees']],between:'ki',gap:[10,28]},
};

/* ---------- prosedürel yedek müzik ---------- */
const MOODS={
  menu:{root:57,scale:[0,2,4,7,9],prog:[[0,4,7],[-3,0,4],[-7,-3,0],[-5,-1,2]],beat:.6,dens:.42},
  plains:{root:60,scale:[0,2,4,6,7,9,11],prog:[[0,4,7,11],[5,9,12],[-3,0,4,7],[7,11,14]],beat:.52,dens:.46},
  desert:{root:52,scale:[0,1,4,5,7,8,10],prog:[[0,4,7],[1,5,8],[0,4,7],[-2,1,5]],beat:.46,dens:.42},
  tundra:{root:54,scale:[0,2,3,7,8],prog:[[0,3,7],[-4,0,3],[-2,2,5],[-5,-2,2]],beat:.62,dens:.36},
  cave:{root:45,scale:[0,1,3,7,8],prog:[[0,7],[1,8],[0,7],[-2,5]],beat:.8,dens:.26},
  nether:{root:43,scale:[0,1,3,6,7,10],prog:[[0,3,6],[1,4,7],[0,3,7],[-1,3,6]],beat:.5,dens:.32},
  end:{root:50,scale:[0,2,4,6,8,10],prog:[[0,4,8],[2,6,10],[-2,2,6],[0,4,8]],beat:.7,dens:.32},
  pale:{root:47,scale:[0,2,3,7,10],prog:[[0,7],[3,10],[-2,5],[0,7]],beat:.95,dens:.18},
  deep:{root:38,scale:[0,1,6,7],prog:[[0,7],[1,6],[0,6],[-1,6]],beat:1.1,dens:.14},
  sift:{root:62,scale:[0,2,4,7,9,11],prog:[[0,4,7,11],[2,7,9],[-3,4,7],[5,9,12]],beat:.55,dens:.5},
};
const MOOD_OF={plains:'plains',desert:'desert',tundra:'tundra',cave:'cave',swamp:'plains',ocean:'tundra',raid:'plains',pale:'pale',deep:'deep',nether:'nether',end:'end',sift:'sift',menu:'menu'};
const MUS={nextT:0,step:0,chord:0,mood:'menu',boss:false,timer:null,procOn:false};
const midi=m=>440*Math.pow(2,(m-69)/12);
function musicStart(){if(MUS.timer)return;MUS.nextT=AU.ctx.currentTime+.3;MUS.timer=setInterval(()=>{procTick();trackTick(.11)},110)}
function setMood(m){m=MOOD_OF[m]||m;if(MUS.mood!==m){MUS.mood=m;MUS.step=0}}
function procTick(){
  const c=AU.ctx;if(!c||c.state!=='running')return;
  if(!MUS.procOn||SAVE.settings.music<=.001||document.hidden){MUS.nextT=c.currentTime+.2;return}
  const M=MOODS[MUS.mood]||MOODS.menu;
  if(MUS.nextT<c.currentTime)MUS.nextT=c.currentTime+.05;
  while(MUS.nextT<c.currentTime+.45){
    const when=MUS.nextT-c.currentTime,s=MUS.step;
    if(s%16===0){MUS.chord=(MUS.chord+1)%M.prog.length;const dur=M.beat*8;
      M.prog[MUS.chord].forEach(n=>tone(midi(M.root+n-12),dur*1.05,{type:'sine',v:.022,a:dur*.35,hold:dur*.3,when,dest:AU.musBus,detune:rand(-7,7)}));
      tone(midi(M.root+M.prog[MUS.chord][0]-24),dur,{type:'triangle',v:.03,a:.4,hold:dur*.4,when,dest:AU.musBus})}
    if((s%2===0&&Math.random()<M.dens)||Math.random()<M.dens*.18){
      const deg=M.scale[randi(0,M.scale.length-1)],oct=pick([12,12,24,0]),f=midi(M.root+deg+oct);
      tone(f,2.4,{type:'triangle',v:.045,a:.008,when,dest:AU.musBus,lp:2600});tone(f*2,1.1,{type:'sine',v:.012,a:.008,when,dest:AU.musBus})}
    if(MUS.boss&&s%2===0){tone(midi(M.root-12+M.prog[MUS.chord][0]),.25,{type:'sawtooth',v:.035,lp:380,when,dest:AU.musBus});if(s%8===4)noise(.08,{type:'lowpass',f:200,v:.12,when,dest:AU.musBus})}
    MUS.step++;MUS.nextT+=M.beat/2;
  }
}

/* ---------- gömülü parça çalar ---------- */
const MP={cur:null,waitT:2,mode:'menu',ctx:'menu',last:null,urls:{},first:{},next:null,canOpus:null,hiddenPaused:false};
function trackEl(key){return document.getElementById('mus-'+key)}
function tracksEmbedded(){return!!(trackEl('minecraft')||MP.urls.minecraft)}
function tracksEnabled(){
  if(SAVE.settings.musicMode==='proc')return false;
  if(MP.canOpus==null){const a=document.createElement('audio');MP.canOpus=!!(a.canPlayType&&a.canPlayType('audio/ogg; codecs=opus'))}
  return MP.canOpus&&tracksEmbedded();
}
/* base64 → Blob URL (bir kez). Çözülen metin DOM'dan silinir, bellek boşalır. */
async function trackURL(key){
  if(MP.urls[key])return MP.urls[key];
  const el=trackEl(key);if(!el)return null;
  const b64=el.textContent.trim();if(!b64)return null;
  const blob=await(await fetch('data:audio/ogg;base64,'+b64)).blob();
  const url=URL.createObjectURL(blob);MP.urls[key]=url;el.textContent='';return url;
}
function mpStop(fade){const c=MP.cur;if(!c)return;MP.cur=null;const t=AU.ctx.currentTime;
  try{c.g.gain.cancelScheduledValues(t);c.g.gain.setValueAtTime(c.g.gain.value,t);c.g.gain.linearRampToValueAtTime(0,t+(fade||1.5))}catch(e){}
  setTimeout(()=>{try{c.a.pause();c.a.removeAttribute('src');c.a.load()}catch(e){}},(fade||1.5)*1000+120)}
function mpPlay(key,fade,forced,ctx){
  if(!AU.ctx)return;if(MP.cur)mpStop(fade);
  const a=new Audio();a.preload='auto';
  const g=AU.ctx.createGain();g.gain.value=0;
  try{AU.ctx.createMediaElementSource(a).connect(g)}catch(e){return}
  g.connect(AU.trk);
  const cur={a,g,key,forced:!!forced,ctx:ctx||MP.ctx};MP.cur=cur;MP.last=key;
  a.onended=()=>{if(MP.cur===cur){MP.cur=null;MP.waitT=rand(...musicGap())}};
  trackURL(key).then(url=>{if(MP.cur!==cur||!url){if(MP.cur===cur)MP.cur=null;return}
    a.src=url;a.play().then(()=>{const t=AU.ctx.currentTime;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+(fade||1.5))}).catch(()=>{if(MP.cur===cur){MP.cur=null;MP.waitT=4}})
  }).catch(()=>{if(MP.cur===cur){MP.cur=null;MP.waitT=6}});
}
function curPlaylist(){
  if(MP.mode==='menu'||!G||G.demo)return PLAYLISTS.menu;
  return PLAYLISTS[G.map.music]||PLAYLISTS.plains;
}
function musicGap(){const P=curPlaylist();return P.gap||[10,35]}
/* Şu an ne çalmalı? */
function musicWant(){
  if(MP.mode==='jukebox')return{force:MP.jukebox,ctx:'jukebox'};
  if(MP.mode==='victory')return{force:'alpha',ctx:'victory'};
  if(MP.mode==='defeat')return{silent:true,ctx:'defeat'};
  const P=curPlaylist();
  if(MP.mode==='menu'||!G||G.demo)return{list:P.list,main:P.main,ctx:'menu'};
  const ctx='map:'+G.map.id;
  const bossTrack=P.boss&&((G.boss&&G.boss.alive)||(G.wardenOut&&G.wardenOut.alive));
  if(bossTrack)return{force:P.boss,ctx:'boss:'+G.map.id};
  let list=P.list;
  if(P.tides&&G.tide!=null)list=P.tides[G.tide];
  else if(P.night&&G.tod>.5)list=P.night;
  return{list,main:P.main,ctx};
}
function trackTick(dt){
  if(!AU.ctx||AU.ctx.state!=='running')return;
  const on=tracksEnabled();
  MUS.procOn=!on&&document.readyState!=='loading';
  if(!on){if(MP.cur)mpStop(1);return}
  if(document.hidden){if(MP.cur&&!MP.cur.a.paused){MP.cur.a.pause();MP.hiddenPaused=true}return}
  if(MP.hiddenPaused&&MP.cur){MP.cur.a.play().catch(()=>{});MP.hiddenPaused=false}
  const w=musicWant();
  if(w.silent){if(MP.cur)mpStop(2.5);return}
  if(w.force){if(!MP.cur||MP.cur.key!==w.force)mpPlay(w.force,2.5,true,w.ctx);return}
  /* bağlam değiştiyse (başka dünya, menü, boss bitti) çalan parça yumuşakça susar */
  if(MP.cur&&MP.cur.ctx!==w.ctx){const wasForced=MP.cur.forced;mpStop(3);MP.waitT=wasForced?4:1.5}
  MP.ctx=w.ctx;
  if(!MP.cur){MP.waitT-=dt;if(MP.waitT<=0){
    let key=MP.next;MP.next=null;
    if(!key){if(!MP.first[w.ctx]&&w.main){key=w.main;MP.first[w.ctx]=true}
      else{const opts=w.list.filter(k=>k!==MP.last);key=pick(opts.length?opts:w.list)}}
    mpPlay(key,1.5,false,w.ctx)}}
}
/* dünyaya girerken: ana parçayla başla */
function musicEnterWorld(){MP.mode='game';MP.first={};MP.waitT=1.2;if(MP.cur)mpStop(2)}
function musicEnterMenu(){if(MP.mode!=='menu'){MP.mode='menu';MP.waitT=1.5;if(MP.cur)mpStop(2)}}
function musicVictory(){MP.mode='victory'}
function musicDefeat(){MP.mode='defeat'}
/* Sift: dalga arasında kısa geçiş parçası (Ki) */
function musicBetweenWaves(){const P=curPlaylist();if(P.between&&!MP.cur&&MP.waitT>6){MP.next=P.between;MP.waitT=1}}
/* Müzik kutusu: ansiklopediden tek parça dinleme */
function jukeboxPlay(key){initAudio();if(!tracksEnabled()){toast('pix:disc','Müzik yok','Bu sürümde gömülü parça bulunamadı.');return}MP.mode='jukebox';mpPlay(key,1,true,'jukebox');MP.jukebox=key}
function jukeboxStop(){if(MP.mode==='jukebox'){MP.mode=(UI.inGame&&G&&!G.demo&&!G.over)?'game':'menu';mpStop(1.5);MP.waitT=3}}
