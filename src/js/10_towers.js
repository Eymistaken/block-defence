/* ============================ KULELER ============================
   lv[0..3] = tahta → taş → demir → elmas. 5. seviye (Netherit) bir Netherit Külçesi
   ile yapılır ve istatistikleri elmas seviyesinden türetilir (netheriteLv).
   need  : açılması için tamamlanmış dünya sayısı
   realm : yalnızca o bölgede kullanılabilen özel kule (ocean, raid, pale, deep, ne, end, sift)
   vib   : Karanlık Derinlikler'de her atışta çıkan titreşim (Sculk sensörleri duyar)
   hpm   : kule canı çarpanı */
const TOWER_HP=[80,135,200,290,400];
const LV_TEX=['planks','cobble','iron','diamond','netherite'];
const TOWERS={
  archer:{name:'Okçu Kulesi',need:0,air:true,dmgType:'phys',proj:true,vib:1,desc:'Hızlı ve ucuz. Ok atar, uçan yaratıkları da vurur.',
    lv:[{cost:70,dmg:9,cd:.75,range:3.2},{cost:85,dmg:14,cd:.62,range:3.5},{cost:160,dmg:22,cd:.52,range:3.8},{cost:300,dmg:34,cd:.42,range:4.2,multi:2}]},
  ice:{name:'Buz Kulesi',need:0,air:true,dmgType:'ice',proj:true,vib:1,desc:'Buz parçaları fırlatır, düşmanları yavaşlatır. Son seviyede dondurur. Blaze\'lere çift hasar verir.',
    lv:[{cost:90,dmg:4,cd:1,range:2.8,slow:.35,slowT:1.6},{cost:90,dmg:6,cd:.9,range:3,slow:.45,slowT:1.8},{cost:170,dmg:9,cd:.8,range:3.2,slow:.55,slowT:2,splash:.7},{cost:300,dmg:14,cd:.7,range:3.5,slow:.6,slowT:2.2,splash:.9,freeze:.12}]},
  tnt:{name:'TNT Topu',need:0,air:false,dmgType:'blast',vib:2,desc:'TNT fırlatır. Alan hasarı verir ama uçanları vuramaz.',
    lv:[{cost:120,dmg:32,cd:2.3,range:3.4,splash:.95},{cost:120,dmg:52,cd:2.1,range:3.6,splash:1.05},{cost:220,dmg:85,cd:1.9,range:3.8,splash:1.2},{cost:400,dmg:130,cd:1.7,range:4.1,splash:1.35,cluster:3}]},
  fire:{name:'Ateş Kulesi',need:1,air:false,dmgType:'fire',proj:true,vib:1,hpm:.9,desc:'Kısa menzilli, çok hızlı ateş topları. Düşmanları tutuşturur. Zırhı yok sayar.',
    lv:[{cost:110,dmg:5,cd:.32,range:2.4,burn:5,burnT:2},{cost:110,dmg:8,cd:.3,range:2.6,burn:8,burnT:2.2},{cost:200,dmg:12,cd:.27,range:2.8,burn:13,burnT:2.5},{cost:360,dmg:18,cd:.22,range:3,burn:22,burnT:3,spread:3}]},
  piston:{name:'Piston Kulesi',need:1,air:false,dmgType:'phys',vib:1,hpm:1.35,desc:'Yanındaki düşmanlara yumruk atar ve onları yolda geri iter. Çok sağlamdır.',
    lv:[{cost:100,dmg:20,cd:1.4,range:1.6,knock:.45},{cost:100,dmg:32,cd:1.3,range:1.7,knock:.55},{cost:180,dmg:50,cd:1.15,range:1.8,knock:.65},{cost:330,dmg:80,cd:1,range:1.9,knock:.8,allHit:true}]},
  potion:{name:'İksir Kulesi',need:2,air:false,dmgType:'magic',vib:1,desc:'Patlayıcı zehir iksiri atar, zeminde zehir bulutu bırakır. Zırhı yok sayar.',
    lv:[{cost:130,dps:9,cloudT:3,radius:.9,cd:2.6,range:3},{cost:120,dps:15,cloudT:3.2,radius:1,cd:2.4,range:3.2},{cost:220,dps:24,cloudT:3.5,radius:1.1,cd:2.2,range:3.4,weak:.2},{cost:380,dps:38,cloudT:4,radius:1.3,cd:2,range:3.6,weak:.3,slowCloud:.25}]},
  lightning:{name:'Paratoner',need:2,air:true,dmgType:'magic',vib:2,desc:'Bakır paratoner. Düşmandan düşmana sekip zincirleme yıldırım çaktırır.',
    lv:[{cost:175,dmg:24,cd:1.7,range:3.2,chain:3},{cost:150,dmg:36,cd:1.55,range:3.4,chain:4},{cost:260,dmg:54,cd:1.4,range:3.6,chain:5},{cost:450,dmg:80,cd:1.2,range:3.9,chain:7,stun:.35}]},
  ballista:{name:'Balista',need:3,air:true,dmgType:'phys',proj:true,vib:1,desc:'Çok uzun menzil, devasa hasar. Mızrağı birden fazla düşmanı deler.',
    lv:[{cost:200,dmg:75,cd:2.8,range:6,pierce:2},{cost:170,dmg:115,cd:2.6,range:6.5,pierce:2},{cost:290,dmg:170,cd:2.4,range:7,pierce:3},{cost:480,dmg:260,cd:2.1,range:7.5,pierce:5,crit:.25}]},
  beacon:{name:'Fener',need:3,support:true,vib:0,desc:'Işık sütunu yükselten Fener. Etrafındaki kuleleri güçlendirir ve gizli yaratıkları görmelerini sağlar.',
    lv:[{cost:240,radius:2.2,bDmg:.15},{cost:200,radius:2.4,bDmg:.2,bRange:.1},{cost:300,radius:2.6,bDmg:.25,bRange:.12,bRate:.1},{cost:450,radius:3,bDmg:.35,bRange:.15,bRate:.15}]},
  anvil:{name:'Örs',need:2,support:true,vib:0,hpm:1.5,desc:'Yakınındaki hasarlı kuleleri sürekli onarır. Saldırgan yaratıklara karşı can simidi.',
    lv:[{cost:140,radius:1.6,heal:3},{cost:120,radius:1.8,heal:5},{cost:200,radius:2,heal:8},{cost:320,radius:2.3,heal:12,shield:.15}]},
  mine:{name:'Zümrüt Madeni',need:0,eco:true,vib:0,desc:'Her dalga sonunda zümrüt üretir. Erken kur, çok kazan!',
    lv:[{cost:150,income:25},{cost:130,income:42},{cost:200,income:64},{cost:320,income:95,trickle:1}]},
  web:{name:'Örümcek Ağı',need:0,trap:true,vib:0,desc:'Yola kurulur. İçinden geçen yaratıkları %60 yavaşlatır. Örümcekleri etkilemez.',lv:[{cost:35,slow:.6,life:40}]},
  landmine:{name:'TNT Mayını',need:1,trap:true,vib:0,desc:'Yola gömülür. Üstüne basan ilk yaratıkla birlikte büyük bir patlama yapar.',lv:[{cost:60,dmg:150,splash:1.3}]},
  /* ---------- bölgeye özel kuleler ---------- */
  conduit:{name:'Oluk',realm:'ocean',support:true,vib:0,desc:'Okyanus Anıtı\'na özel. Yakındaki kulelere "Oluk Gücü" verir (hasar ve hız) ve menzilindeki yaratıklara düzenli şok atar.',
    lv:[{cost:220,radius:2.2,bDmg:.12,bRate:.08,zap:16,zapCd:2},{cost:180,radius:2.4,bDmg:.16,bRate:.1,zap:26,zapCd:1.8},{cost:280,radius:2.6,bDmg:.2,bRate:.12,zap:40,zapCd:1.6},{cost:420,radius:3,bDmg:.26,bRate:.15,zap:62,zapCd:1.3}]},
  bell:{name:'Çan',realm:'raid',support:true,vib:0,desc:'Köy Baskını\'na özel. Çalındığında yakındaki baskıncılar (Illager\'lar) "Parlama" alır: görünür olurlar ve %25 fazla hasar alırlar.',
    lv:[{cost:120,radius:3,cd:6,glowT:3,amp:.25},{cost:100,radius:3.4,cd:5,glowT:3.5,amp:.3},{cost:160,radius:3.8,cd:4.5,glowT:4,amp:.35,stun:.4},{cost:260,radius:4.4,cd:4,glowT:5,amp:.45,stun:.8}]},
  wool:{name:'Yün Bloğu',realm:'deep',block:true,vib:0,hpm:.6,desc:'Karanlık Derinlikler\'e özel. Minecraft\'taki gibi titreşimi yutar: çevresindeki kulelerin atışlarını Sculk sensörleri duyamaz.',
    lv:[{cost:30,radius:1.5}]},
  calsensor:{name:'Ayarlanmış Sculk Sensörü',realm:'deep',air:true,dmgType:'magic',vib:0,desc:'Karanlık Derinlikler\'e özel. Yakındaki kulelerin titreşimlerini yakalar (haritadaki sensörlere ulaşmaz) ve yeterince yük birikince sonik bir dalga salar.',
    lv:[{cost:160,radius:2,charge:6,dmg:40,pulse:1.7,slow:.3},{cost:140,radius:2.2,charge:5,dmg:62,pulse:1.9,slow:.35},{cost:230,radius:2.4,charge:5,dmg:95,pulse:2.1,slow:.4},{cost:380,radius:2.7,charge:4,dmg:140,pulse:2.4,slow:.45,dark:1}]},
  eyepot:{name:'Göz Çiçeği Saksısı',realm:'pale',support:true,vib:0,desc:'Solgun Bahçe\'ye özel. Açık Göz Çiçeği etrafını "izler": menzilindeki Gıcırtılar donar, diğer yaratıklar yavaşlar ve gizliler görünür olur. Gece daha güçlüdür.',
    lv:[{cost:110,radius:2,slow:.2},{cost:100,radius:2.3,slow:.25},{cost:160,radius:2.6,slow:.3},{cost:260,radius:3,slow:.38}]},
  resin:{name:'Reçine Atıcı',realm:'pale',air:false,dmgType:'phys',proj:true,vib:1,desc:'Solgun Bahçe\'ye özel. Yapışkan reçine topları atar; isabet alan yaratık kısa süre yere yapışır.',
    lv:[{cost:130,dmg:10,cd:1.6,range:3,root:.7},{cost:110,dmg:16,cd:1.5,range:3.2,root:.85},{cost:200,dmg:26,cd:1.4,range:3.4,root:1,splash:.6},{cost:340,dmg:40,cd:1.25,range:3.7,root:1.2,splash:.8}]},
  soulfire:{name:'Ruh Kamp Ateşi',realm:'ne',air:false,dmgType:'soul',vib:0,hpm:1.2,desc:'Nether\'e özel. Mavi ruh ateşi etrafındaki yaratıkları sürekli yakar. Ruh ateşi, ateşe bağışık yaratıklara bile yarı hasar verir.',
    lv:[{cost:150,radius:1.3,dps:14},{cost:130,radius:1.45,dps:22},{cost:220,radius:1.6,dps:34},{cost:360,radius:1.8,dps:52,slow:.2}]},
  anchor:{name:'Diriltici',realm:'ne',support:true,vib:0,hpm:1.6,desc:'Nether\'e özel. Işık Taşı ile dolar. Yakınında bir kule yıkılırsa bir yük harcayıp onu yarı canla yeniden kurar. Her dalga 1 yük dolar.',
    lv:[{cost:200,radius:2.2,charges:1},{cost:160,radius:2.5,charges:2},{cost:240,radius:2.8,charges:3},{cost:380,radius:3.2,charges:4}]},
  shulker:{name:'Shulker Kulesi',realm:'end',air:true,dmgType:'magic',proj:true,vib:1,desc:'End\'e özel. Hedefi takip eden Shulker mermileri atar. Vurulan yaratık "Yükselme" alır, havada süzülür ve düşünce ek hasar alır.',
    lv:[{cost:180,dmg:12,cd:1.8,range:3.6,lev:1.4,fall:2},{cost:150,dmg:18,cd:1.65,range:3.9,lev:1.6,fall:2.2},{cost:260,dmg:28,cd:1.5,range:4.2,lev:1.8,fall:2.5},{cost:420,dmg:42,cd:1.3,range:4.6,lev:2,fall:3,multi:2}]},
  chorus:{name:'Nakarat Kulesi',realm:'end',air:false,dmgType:'magic',vib:1,desc:'End\'e özel. Nakarat Meyvesi gibi: menzilindeki en ilerdeki yaratığı yolda geriye ışınlar.',
    lv:[{cost:170,cd:5,range:3,tp:2.2,n:1,dmg:10},{cost:140,cd:4.5,range:3.2,tp:2.6,n:1,dmg:18},{cost:230,cd:4,range:3.5,tp:3,n:2,dmg:28},{cost:380,cd:3.4,range:3.9,tp:3.6,n:3,dmg:44}]},
  echogolem:{name:'Yankı Golemi',realm:'sift',air:true,dmgType:'magic',vib:0,hpm:1.3,desc:'Sift\'e özel. Başındaki ruh bloğuyla çalışan dost golem; şarkı dalgalarıyla alandaki yaratıkları vurup yavaşlatır. Ichor\'a komşuysa daha hızlı şarj olur.',
    lv:[{cost:190,dmg:20,cd:1.5,range:2.5,splash:1,slow:.2},{cost:160,dmg:32,cd:1.4,range:2.7,splash:1.1,slow:.25},{cost:260,dmg:48,cd:1.3,range:2.9,splash:1.2,slow:.3},{cost:420,dmg:72,cd:1.15,range:3.2,splash:1.35,slow:.35}]},
  blubhut:{name:'Blub Yuvası',realm:'sift',support:true,vib:0,desc:'Sift\'e özel. Hasar almayan, itilemeyen Blub\'lar yola zıplar; çarpışan yaratıklar bir süre ilerleyemez.',
    lv:[{cost:150,cd:9,n:1,block:1.6,life:7},{cost:130,cd:8,n:1,block:2,life:8},{cost:210,cd:7,n:2,block:2.3,life:9},{cost:340,cd:6,n:3,block:2.6,life:10}]},
};
const BASE_ORDER=['archer','ice','tnt','fire','piston','potion','lightning','ballista','beacon','anvil','mine','web','landmine'];
const REALM_TOWERS={ocean:['conduit'],raid:['bell'],pale:['eyepot','resin'],deep:['wool','calsensor'],ne:['soulfire','anchor'],end:['shulker','chorus'],sift:['echogolem','blubhut']};
const TARGET_MODES=['İlk','Son','Güçlü','Zayıf','Yakın'];
/* Netherit seviyesi: elmas istatistiklerinden türetilir */
function netheriteLv(L){const n=Object.assign({},L);n.cost=0;
  for(const k of['dmg','dps','burn','zap','income','heal','bDmg','bRate','bRange','amp']) if(n[k]!=null)n[k]=+(n[k]*(k[0]==='b'||k==='amp'?1.25:1.4)).toFixed(3);
  for(const k of['range','radius','splash','pulse']) if(n[k]!=null)n[k]=+(n[k]*1.08).toFixed(2);
  if(n.cd)n.cd=+(n.cd*.88).toFixed(3);if(n.charges)n.charges++;if(n.chain)n.chain+=2;if(n.pierce)n.pierce+=2;if(n.n)n.n++;return n}
function towerLv(type,lvl){const D=TOWERS[type];return lvl>=4?netheriteLv(D.lv[3]):D.lv[Math.min(lvl,D.lv.length-1)]}
