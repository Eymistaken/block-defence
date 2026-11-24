/* ============================ EŞYALAR ============================
   use : aim   → haritada bir noktaya nişan alınır (r = etki yarıçapı, kare)
         self  → anında kullanılır
         tower → bir kuleye uygulanır (Netherit)
         passive → kendiliğinden tetiklenir (Totem)
         (yok) → üretim malzemesi
   Kazanılan dünyadan kalan eşyalar Sandık'ta (SAVE.items) saklanır. */
const ITEMS={
  healpot:{name:'Patlayıcı İyileştirme İksiri',icon:'healpot',use:'aim',r:1.6,desc:'Fırlatıldığı yerdeki kuleleri canlarının %50\'si kadar onarır.'},
  totem:{name:'Ölümsüzlük Totemi',icon:'totem',use:'passive',desc:'Canın sıfıra inerse kendiliğinden parçalanır ve seni 6 canla geri getirir.'},
  pearl:{name:'Ender İncisi',icon:'pearl',use:'aim',r:1.2,desc:'Bölgedeki yaratıkları (boss hariç) yolda 3 kare geriye ışınlar.'},
  wind:{name:'Rüzgâr Topu',icon:'wind',use:'aim',r:1.4,desc:'Patlayan rüzgâr: yaratıkları 1.6 kare geri savurur ve sersemletir.'},
  goldingot:{name:'Altın Külçesi',icon:'goldingot',use:'aim',r:2,desc:'Yere atılan altın: Piglinler 6 sn durup hayranlıkla bakar. Netherit üretiminde de kullanılır.'},
  resinclump:{name:'Reçine Yığını',icon:'resinclump',use:'aim',r:1.2,desc:'Yapışkan reçine: bölgedeki yaratıklar 3 sn yere yapışır (boss 1 sn).'},
  chorusfruit:{name:'Nakarat Meyvesi',icon:'chorusfruit',use:'aim',r:1.3,desc:'Bölgedeki yaratıkları yolun gerisinde rastgele bir yere ışınlar.'},
  breath:{name:'Ejderha Nefesi',icon:'breath',use:'aim',r:1.5,desc:'6 sn süren mor bir bulut bırakır; içindekiler büyü hasarı alır.'},
  firecharge:{name:'Ateş Topu',icon:'firecharge',use:'aim',r:1.1,desc:'Ateşli patlama; yaratıkları tutuşturur.'},
  iceball:{name:'Buz Topu',icon:'iceball',use:'aim',r:1.2,desc:'Bölgedeki yaratıkları 3 sn dondurur (boss 1 sn).'},
  tnt:{name:'TNT',icon:'tnt',use:'aim',r:1.3,desc:'Seçtiğin yere düşen tek bir güçlü TNT.'},
  eyeblossom:{name:'Göz Çiçeği',icon:'eyeblossom',use:'self',desc:'8 sn boyunca tüm Gıcırtılar donar, bütün yaratıklar %30 yavaşlar ve gizliler görünür.'},
  endereye:{name:'Ender Gözü',icon:'endereye',use:'self',desc:'20 sn boyunca gizli yaratıkları ortaya çıkarır ve tüm yaratıklar %15 fazla hasar alır.'},
  soulfruit:{name:'Ruh Meyvesi',icon:'soulfruit',use:'self',desc:'Sift meyvesi: +40 Ruh ve +2 can.'},
  compass:{name:'Kurtarma Pusulası',icon:'compass',use:'self',desc:'Kaybettiğin son canları geri getirir (en fazla 5).'},
  netherite:{name:'Netherit Külçesi',icon:'netherite',use:'tower',desc:'Elmas seviyesindeki (4.) bir kuleyi NETHERİT seviyesine yükseltir: daha güçlü, daha sağlam, alev ve patlamaya dirençli.'},
  scrap:{name:'Netherit Hurdası',icon:'scrap',desc:'Antik Kalıntı\'dan çıkar. 4 Hurda + 4 Altın Külçesi = Netherit Külçesi.'},
  echoshard:{name:'Yankı Parçacığı',icon:'echoshard',desc:'Antik Şehir\'in sandıklarından. Kurtarma Pusulası yapımında kullanılır.'},
  coal:{name:'Kömür',icon:'coal',desc:'Ateş Topu yapımında kullanılır.'},
  gunpowder:{name:'Barut',icon:'gunpowder',desc:'Creeper\'lardan düşer. TNT ve Ateş Topu yapımında kullanılır.'},
  blazepowder:{name:'Blaze Tozu',icon:'blazepowder',desc:'Blaze\'lerden düşer. Ender Gözü ve Ateş Topu yapımında kullanılır.'},
  breezerod:{name:'Esinti Çubuğu',icon:'breezerod',desc:'Esinti\'lerden düşer. 1 çubuk = 4 Rüzgâr Topu.'},
};
const ITEM_ORDER=Object.keys(ITEMS);
/* Üretim tarifleri (çoğu Minecraft'taki gerçek tariflerin sadeleştirilmiş hali) */
const RECIPES=[
  {out:'netherite',n:1,ing:[['scrap',4],['goldingot',4]]},
  {out:'firecharge',n:3,ing:[['blazepowder',1],['coal',1],['gunpowder',1]]},
  {out:'endereye',n:1,ing:[['pearl',1],['blazepowder',1]]},
  {out:'tnt',n:1,ing:[['gunpowder',4]]},
  {out:'wind',n:4,ing:[['breezerod',1]]},
  {out:'compass',n:1,ing:[['echoshard',4]]},
];

/* ============================ ENGELLER (KAZILABİLİR) ============================
   time: kazma süresi (sn) · reward: zümrüt · tex: blok dokusu (draw yoksa küp çizilir)
   light: ışık rengi · drops: [eşya, olasılık, adet] · feat: özel harita mekaniği */
const OBS={
  /* Overworld */
  tree:{name:'Meşe Ağacı',time:2.2,reward:4,draw:'tree'},
  spruce:{name:'Ladin Ağacı',time:2.4,reward:4,draw:'spruce'},
  darkoak:{name:'Koyu Meşe',time:2.6,reward:5,draw:'darkoak'},
  mangrove:{name:'Mangrov Ağacı',time:2.6,reward:5,draw:'mangrove'},
  cactus:{name:'Kaktüs',time:1.6,reward:3,draw:'cactus'},
  rock:{name:'Taş',time:2.6,reward:2,tex:'stone'},
  mossrock:{name:'Yosunlu Kırık Taş',time:2.6,reward:3,tex:'mossy'},
  coal:{name:'Kömür Cevheri',time:3,reward:10,tex:'ore_coal',drops:[['coal',1,1]]},
  iron:{name:'Demir Cevheri',time:3.6,reward:18,tex:'ore_iron'},
  gold:{name:'Altın Cevheri',time:4.2,reward:30,tex:'ore_gold',drops:[['goldingot',.35,1]]},
  redstone:{name:'Redstone Cevheri',time:3.6,reward:22,tex:'ore_redstone',light:'#ff3030'},
  diamond:{name:'Elmas Cevheri',time:5.5,reward:60,tex:'ore_diamond'},
  emerald:{name:'Zümrüt Cevheri',time:5,reward:50,tex:'ore_emerald'},
  amethyst:{name:'Ametist Bloğu',time:3,reward:20,tex:'amethyst',light:'#c080ff'},
  dripstone:{name:'Sivri Damla Taş',time:1.8,reward:6,draw:'dripstone',feat:'dripstone',desc:'Kazınca düşer; yanındaki yol karelerindeki yaratıklara ağır hasar verir.'},
  sponge:{name:'Islak Sünger',time:2,reward:14,tex:'sponge'},
  prism:{name:'Prizmarin',time:3,reward:12,tex:'prismarine'},
  sealantern:{name:'Deniz Feneri',time:2,reward:16,tex:'sealantern',light:'#d0fff0'},
  temple:{name:'Çöl Tapınağı Sandığı',time:4,reward:40,draw:'chest',drops:[['gunpowder',1,2],['goldingot',.6,1],['tnt',.4,1]]},
  hay:{name:'Saman Balyası',time:1.5,reward:4,draw:'hay'},
  /* Solgun Bahçe */
  paleoak:{name:'Soluk Meşe',time:2.6,reward:5,draw:'paleoak'},
  cheart:{name:'Gıcırtı Kalbi',time:3.2,reward:30,draw:'cheart',feat:'heart',light:'#ff9a30',drops:[['resinclump',1,2]],desc:'Geceleri Gıcırtı doğurur. Kazarsan bağlı Gıcırtılar ufalanıp ölür.'},
  bheart:{name:'Kadim Kalp',time:5,reward:60,draw:'cheart',feat:'bheart',light:'#ff7a10',drops:[['resinclump',1,2]],desc:'Kadim Gıcırtı\'yı ölümsüz kılan üç kalpten biri.'},
  resinlog:{name:'Reçineli Soluk Meşe Kütüğü',time:1.6,reward:14,draw:'resinlog',drops:[['resinclump',1,1]]},
  eyeb:{name:'Göz Çiçeği',time:1,reward:3,draw:'eyeb',light:'#ff9a30',drops:[['eyeblossom',.5,1]]},
  palemoss:{name:'Soluk Yosun Bloğu',time:1.4,reward:2,tex:'palemoss'},
  /* Karanlık Derinlikler */
  sensor:{name:'Sculk Sensörü',time:2.2,reward:12,draw:'sensor',feat:'sensor',light:'#2adfeb',desc:'Kulelerin titreşimini duyar ve Çığırtkanları uyandırır. Kazarak susturabilirsin.'},
  shrieker:{name:'Sculk Çığırtkanı',time:3,reward:20,draw:'shrieker',feat:'shrieker',desc:'Sensörler titreşim duydukça çığlık atar; UYARI seviyesi 4 olunca Muhafız uyanır.'},
  catalyst:{name:'Sculk Katalizörü',time:3.5,reward:26,draw:'catalyst',feat:'catalyst',light:'#2adfeb',drops:[['echoshard',.3,1]],desc:'Yakında ölen yaratıklarla çiçeklenir ve sculk yayar; arada yeni sensör büyütür.'},
  deeprock:{name:'Kırık Kayrak Taşı',time:2.8,reward:3,tex:'cdeep'},
  ddiamond:{name:'Kayrak Elmas Cevheri',time:6,reward:70,tex:'ore_ddiamond'},
  dgold:{name:'Kayrak Altın Cevheri',time:4.6,reward:34,tex:'ore_dgold',drops:[['goldingot',.35,1]]},
  achest:{name:'Antik Sandık',time:4,reward:45,draw:'chest',chest:'#3a4a4a',drops:[['echoshard',1,1],['echoshard',.5,1],['totem',.08,1]]},
  /* Nether */
  netherrock:{name:'Netherrack',time:2,reward:2,tex:'netherrack'},
  glow:{name:'Işık Taşı',time:2.5,reward:14,tex:'glowstone',light:'#ffd070'},
  quartz:{name:'Nether Kuvarsı Cevheri',time:3.2,reward:16,tex:'ore_quartz'},
  ngold:{name:'Nether Altın Cevheri',time:3.6,reward:24,tex:'ore_ngold',feat:'gold',drops:[['goldingot',.5,1]]},
  gilded:{name:'Yaldızlı Karataş',time:3,reward:20,tex:'gilded',feat:'gold',drops:[['goldingot',.3,1]]},
  goldblock:{name:'Altın Bloğu',time:5,reward:70,tex:'gold',feat:'gold',drops:[['goldingot',1,3]]},
  debris:{name:'Antik Kalıntı',time:8,reward:40,tex:'debris',drops:[['scrap',1,1]],desc:'Netherit Hurdası verir.'},
  cfungus:{name:'Kızıl Mantar',time:2.6,reward:5,draw:'cfungus',light:'#ffb050'},
  wfungus:{name:'Çarpık Mantar',time:2.6,reward:5,draw:'wfungus',feat:'fungus',light:'#ffb050',desc:'Hoglinler bundan korkar ve yanından geçerken yavaşlar.'},
  basaltcol:{name:'Bazalt Sütunu',time:2.6,reward:3,draw:'basaltcol'},
  fossil:{name:'Kemik Fosili',time:2.4,reward:8,tex:'bonebk'},
  magmab:{name:'Magma Bloğu',time:2,reward:6,tex:'magma',light:'#ff7a20'},
  nwartb:{name:'Nether Yumrusu Bloğu',time:1.6,reward:3,tex:'nwart'},
  /* End */
  endrock:{name:'End Taşı',time:2.4,reward:2,tex:'endstone'},
  chorusp:{name:'Nakarat Bitkisi',time:1.8,reward:6,draw:'chorusp',drops:[['chorusfruit',.6,1]]},
  glowshroom:{name:'Dev Parlak Mantar',time:2.6,reward:7,draw:'glowshroom',light:'#4ae8d8'},
  cryst:{name:'Kristal Kümesi',time:3.4,reward:24,draw:'cryst',light:'#c8b8ff',feat:'prism',desc:'Yanındaki Paratoner kulelerinin zinciri +1 seker.'},
  enderore:{name:'Ender Cevheri',time:4,reward:30,tex:'ore_ender',drops:[['pearl',.5,1]]},
  amberore:{name:'Kehribar Cevheri',time:4,reward:32,tex:'ore_amber',light:'#ffa030'},
  ambertree:{name:'Kehribar Ağacı',time:2.6,reward:6,draw:'ambertree',light:'#ffb040'},
  umbratree:{name:'Gölge Ağacı',time:2.6,reward:6,draw:'umbratree'},
  vent:{name:'Kükürt Bacası',time:3,reward:18,draw:'vent',feat:'vent',desc:'Ara sıra patlayarak yanındaki yoldaki yaratıkları haşlar.'},
  bonepile:{name:'Ejderha Kemiği',time:2.4,reward:10,tex:'bonebk'},
  endrod:{name:'End Çubuğu',time:1.2,reward:8,draw:'endrod',light:'#ffffff'},
  ecrystal:{name:'End Kristali',time:1.2,reward:60,draw:'ecrystal',feat:'ecrystal',light:'#ff80e0',desc:'Ender Ejderhası\'nı iyileştirir. Kazınca PATLAR: yakındaki yaratıklara (ve kulelere!) hasar verir.'},
  /* Sift */
  driprock:{name:'Soluk Damla Kaya',time:2.6,reward:4,draw:'driprock'},
  sifttree:{name:'Sift Ağacı',time:2.6,reward:6,draw:'sifttree'},
  soulplant:{name:'Ruh Meyvesi Bitkisi',time:2,reward:8,draw:'soulplant',light:'#4ad8f0',drops:[['soulfruit',.5,1]],souls:6},
  echopillar:{name:'Yankı Sütunu',time:3,reward:10,tex:'echostone'},
  huskrib:{name:'Kabuklu Kaburgası',time:2.6,reward:10,tex:'bonebk'},
  nest:{name:'Sculker Yuvası',time:3.5,reward:24,draw:'nest',feat:'nest',desc:'Kazılmazsa ara sıra İz Sürücü çıkarır.'},
  generator:{name:'Fırtına Jeneratörü',time:4.5,reward:40,draw:'generator',feat:'generator',light:'#ff5a5a',souls:15,desc:'Illager makinesi. Ruh fırtınası dalgalarında yaratık çağırır. Kaz ve sustur!'},
  ichorbarrel:{name:'Ichor Fıçısı',time:2.4,reward:12,draw:'barrel',souls:10},
};
