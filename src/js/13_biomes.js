/* ============================ BOYUTLAR & BİYOMLAR ============================ */
const DIMS={
  ow:{name:'Overworld',icon:['grass','dirt'],col:'#7dd65a',base:'Köy',
    desc:'Tanıdık dünya: ovalar, çöller, mağaralar, okyanus anıtı... ve yeni Solgun Bahçe ile yerin derinliklerindeki Karanlık Derinlikler.'},
  ne:{name:'Nether',icon:['netherrack','netherrack'],col:'#ff6a4a',base:'Portal',
    desc:'Nether Güncellemesi\'nin tüm biyomları: Kızıl ve Çarpık Ormanlar, Ruh Kumu Vadisi, Bazalt Deltaları, Bastionlar ve Nether Kalesi. Sonunda Wither bekliyor.',
    lock:'Overworld\'de "Damla Taş Mağaraları"nı bitir (obsidiyen bul, portalı yak).'},
  end:{name:'End',icon:['endstone','endstone'],col:'#d8c8ff',base:'Geçit',
    desc:'"End Güncellemesi" geldi: Nakarat Ormanları, Sisli Mantarlıklar, Kristal Dağları, Kehribar Diyarı, Gölge Ormanı, Kükürt Kaynakları ve End Şehri. Ejderha en sonda.',
    lock:'Nether\'de "Nether Kalesi"ni bitir (Blaze Tozu ile Ender Gözü yap).'},
  sift:{name:'Sift',icon:['siftgrass','siftsoil'],col:'#ff9aa8',base:'Şarkıcı',
    desc:'2027\'de gelecek dördüncü boyut. Turkuaz gökyüzü, mercan pembesi çayırlar, gökkuşağı renkli Ichor gölleri ve değişen GELGİTLER. Ruhları çalan Illager\'lardan Şarkıcı\'yı koru.',
    lock:'Overworld\'de "Antik Şehir"i bitir: Muhafız yenilince Antik Şehir\'in geçidi Sift\'e açılır.'},
};
const DIM_ORDER=['ow','ne','end','sift'];

/* Biyom görselliği:
   ground : [[doku, ağırlık], ...]  (yumuşak gürültüyle kümelenir)
   path   : yol dokusu        wall : yapı dokusu
   dn     : gece/gündüz kuralı (std | pale)   amb/col : sürekli karanlık ve rengi
   tint   : tüm ekrana renk filtresi          wx : hava durumu/parçacık türü
   decor  : küçük süs türü                    torch : rastgele meşale sayısı
   liquid : su dokusu türü                    base : yol sonundaki yapı */
const BIOMES={
  plains:{ground:[['grass',1]],path:'path',dn:'std',wx:'rain',decor:'plains',base:'village'},
  desert:{ground:[['sand',1]],path:'sandpath',dn:'std',wx:'sand',decor:'desert',base:'village'},
  tundra:{ground:[['snow',1]],path:'snowpath',dn:'std',wx:'snow',decor:'tundra',base:'village'},
  swamp:{ground:[['swampgrass',.75],['mud',.25]],path:'dirtpath',dn:'std',wx:'firefly',decor:'swamp',tint:'rgba(40,70,30,.08)',liquid:'swampwater',base:'village'},
  cave:{ground:[['stone',.62],['deep',.25],['moss',.13]],path:'gravel',amb:.62,col:'4,4,12',wx:'mote',decor:'cave',torch:8,base:'village'},
  ocean:{ground:[['seabed',.6],['gravel',.4]],path:'pbricks',wall:'dprism',amb:.3,col:'0,20,40',tint:'rgba(20,90,130,.22)',wx:'bubble',decor:'ocean',base:'village'},
  raid:{ground:[['darkgrass',.7],['podzol',.3]],path:'dirtpath',wall:'planks',dn:'std',wx:'rain',decor:'plains',base:'bell'},
  pale:{ground:[['palegrass',.7],['palemoss',.3]],path:'gravel',dn:'pale',amb:.14,col:'40,40,46',tint:'rgba(150,150,150,.10)',wx:'paleleaf',decor:'pale',base:'village'},
  deep:{ground:[['sculk',.55],['deep',.45]],path:'sculkpath',amb:.78,col:'2,6,10',wx:'sculkp',decor:'deep',base:'ancient'},
  city:{ground:[['dtiles',.5],['deep',.25],['sculk',.25]],path:'dbricks',wall:'dbricks',amb:.74,col:'2,6,10',wx:'sculkp',decor:'deep',base:'ancient'},
  wastes:{ground:[['netherrack',.8],['soulsand',.2]],path:'blackstone',amb:.3,col:'40,6,0',tint:'rgba(255,60,0,.05)',wx:'ember',decor:'nether',torch:6,base:'portal'},
  crimson:{ground:[['crimson',.75],['netherrack',.25]],path:'blackstone',amb:.3,col:'40,4,4',tint:'rgba(255,30,30,.06)',wx:'cspore',decor:'crimson',base:'portal'},
  warped:{ground:[['warped',.75],['netherrack',.25]],path:'blackstone',amb:.32,col:'0,20,24',tint:'rgba(20,200,180,.05)',wx:'wspore',decor:'warped',base:'portal'},
  soulvalley:{ground:[['soulsand',.6],['soulsoil',.4]],path:'pbasalt',amb:.34,col:'4,20,30',tint:'rgba(60,140,170,.08)',wx:'soulp',decor:'soul',base:'portal'},
  basalt:{ground:[['basalt',.6],['blackstone',.4]],path:'pbasalt',amb:.34,col:'20,16,16',tint:'rgba(120,110,110,.10)',wx:'ash',decor:'basalt',base:'portal'},
  fortress:{ground:[['nbricks',1]],path:'rnbricks',wall:'nbricks',amb:.3,col:'40,6,0',tint:'rgba(255,60,0,.05)',wx:'ember',decor:'none',torch:4,base:'portal'},
  bastion:{ground:[['blackstone',.75],['gilded',.06],['pbsb',.19]],path:'pbsb',wall:'blackstone',amb:.32,col:'30,10,6',wx:'ash',decor:'basalt',base:'portal'},
  lavasea:{ground:[['netherrack',.7],['magma',.3]],path:'pbsb',amb:.28,col:'40,8,0',tint:'rgba(255,90,0,.07)',wx:'ember',decor:'nether',base:'portal'},
  camp:{ground:[['crimson',.5],['netherrack',.5]],path:'pbsb',wall:'blackstone',amb:.3,col:'40,6,0',wx:'ember',decor:'crimson',base:'portal'},
  witherarena:{ground:[['soulsand',.55],['soulsoil',.45]],path:'nbricks',amb:.4,col:'6,10,20',tint:'rgba(40,60,90,.1)',wx:'soulp',decor:'soul',base:'portal'},
  outer:{ground:[['endstone',.8],['endmoss',.2]],path:'obsidian',amb:.48,col:'14,4,28',wx:'vsp',decor:'end',base:'gateway'},
  chorus:{ground:[['lavstone',.6],['endstone',.4]],path:'purpur',amb:.46,col:'20,4,30',tint:'rgba(150,80,200,.06)',wx:'vsp',decor:'chorus',base:'gateway'},
  fogshroom:{ground:[['endmoss',.8],['endstone',.2]],path:'esbricks',amb:.42,col:'4,24,26',tint:'rgba(120,220,210,.12)',wx:'spore',decor:'fog',base:'gateway'},
  crystalmt:{ground:[['jade',.55],['starice',.45]],path:'starice',amb:.36,col:'10,14,40',tint:'rgba(150,190,255,.07)',wx:'glint',decor:'crystal',base:'gateway'},
  amberland:{ground:[['amberst',.65],['endstone',.35]],path:'esbricks',amb:.4,col:'30,14,4',tint:'rgba(255,150,40,.07)',wx:'amberm',decor:'amber',base:'gateway'},
  shadowforest:{ground:[['umbral',1]],path:'purpur',amb:.68,col:'8,2,16',wx:'vsp',decor:'shadow',base:'gateway'},
  sulfur:{ground:[['painted',.6],['jade',.4]],path:'esbricks',amb:.38,col:'20,24,6',tint:'rgba(200,220,80,.07)',wx:'steam',decor:'sulfur',base:'gateway'},
  graveyard:{ground:[['endstone',.6],['bonebk',.15],['umbral',.25]],path:'obsidian',wall:'bonebk',amb:.55,col:'14,4,28',wx:'vsp',decor:'end',base:'gateway'},
  endcity:{ground:[['endstone',.7],['purpur',.3]],path:'esbricks',wall:'purpur',amb:.42,col:'16,4,26',wx:'vsp',decor:'end',base:'gateway'},
  dragonisle:{ground:[['endstone',1]],path:'obsidian',wall:'obsidian',amb:.5,col:'14,4,28',wx:'vsp',decor:'end',base:'gateway'},
  meadows:{ground:[['siftgrass',.8],['siftsoil',.2]],path:'siftpath',sift:true,wx:'trill',decor:'meadow',base:'singer'},
  singer:{ground:[['redsculk',.7],['tealgrass',.3]],path:'siftpath',sift:true,wx:'trill',decor:'singer',base:'singer'},
  lullaby:{ground:[['redsculk',.6],['siftsoil',.4]],path:'siftpath',sift:true,wx:'trill',decor:'singer',base:'singer'},
  ichorlake:{ground:[['tealgrass',.6],['redsculk',.4]],path:'siftpath',sift:true,wx:'trill',decor:'singer',base:'singer'},
  carapace:{ground:[['carapace',.7],['darksculk',.3]],path:'siftsoil',wall:'bonebk',sift:true,wx:'dust',decor:'carapace',base:'singer'},
  echoden:{ground:[['tealgrass',.5],['carapace',.5]],path:'echostone',wall:'echostone',sift:true,wx:'trill',decor:'singer',base:'singer'},
  ravine:{ground:[['redsculk',.6],['siftsoil',.4]],path:'siftpath',sift:true,wx:'trill',decor:'singer',base:'singer'},
  storm:{ground:[['darksculk',.55],['redsculk',.45]],path:'siftpath',sift:true,wx:'storm',decor:'carapace',base:'singer'},
  whitetower:{ground:[['tealgrass',.6],['siftgrass',.4]],path:'whitestone',wall:'whitestone',sift:true,wx:'trill',decor:'meadow',base:'rift'},
  siftheart:{ground:[['siftgrass',.45],['tealgrass',.3],['redsculk',.25]],path:'whitestone',wall:'whitestone',sift:true,wx:'trill',decor:'meadow',base:'singerportal'},
};
/* Sift gelgitleri (Minecraft Dungeons II'deki Akış / Direniş / Bereket döngüsü) */
const TIDES=[
  {name:'Akış',en:'Flow',col:'#5ad8d0',desc:'Olağan düzen. Ne iyi ne kötü.'},
  {name:'Direniş',en:'Endure',col:'#7a8aff',desc:'Gökyüzü kararır. Yaratıklar %25 daha dayanıklı, daha güçlü türler gelir; ruh kazancı yarıya iner.'},
  {name:'Bereket',en:'Thrive',col:'#ffa0c8',desc:'Sıcak ışık. Kuleler %25 hızlı ateş eder ve yavaşça onarılır, güçler hızlı dolar, ruh kazancı iki katına çıkar.'},
];
