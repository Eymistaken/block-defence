/* ============================ ZORLUK, BÜYÜ MASASI, BAŞARIMLAR, GÜÇLER ============================ */
const DIFFS={
  easy:{name:'Kolay',hp:.75,money:1.15,lives:30,start:1.2,atk:.7,desc:'Yaratıklar %25 daha zayıf ve kulelere daha az vurur, 30 can, ekstra zümrüt.'},
  normal:{name:'Normal',hp:1,money:1,lives:20,start:1,atk:1,desc:'Dengeli bir macera. 20 can.'},
  hard:{name:'Zor',hp:1.35,money:.9,lives:10,start:.9,atk:1.3,desc:'Yaratıklar %35 daha güçlü ve kuleleri daha sert döver, sadece 10 can. Gerçek ustalar için.'},
  creative:{name:'Yaratıcı',hp:1,money:1,lives:999,start:1,atk:1,creative:true,desc:'Sınırsız zümrüt, tüm kuleler ve dünyalar açık. Yıldız ve ilerleme kazandırmaz.'},
};
/* Büyü Masası: isimlerin çoğu Minecraft'ın resmi Türkçe büyü adları */
const PERKS=[
  {id:'sharp',name:'Keskinlik',desc:'Tüm kulelerin hasarı +%5',col:'#ff6060'},
  {id:'range',name:'Uzak Görüş',desc:'Kule menzili +%3',col:'#60c0ff'},
  {id:'haste',name:'Acele',desc:'Atış hızı +%4',col:'#ffd060'},
  {id:'rich',name:'Servet',desc:'Başlangıç zümrüdü +30',col:'#40e070'},
  {id:'health',name:'Can Takviyesi',desc:'Başlangıç canı +2',col:'#ff4080'},
  {id:'loot',name:'Ganimet',desc:'Düşman ödülleri +%6',col:'#30d0a0'},
  {id:'mining',name:'Verimlilik',desc:'Kazma %12 hızlı, maden ödülü +%15',col:'#c0a070'},
  {id:'master',name:'Ustalık',desc:'Yükseltmeler %4 daha ucuz',col:'#a0a0ff'},
  {id:'magic',name:'Büyücülük',desc:'Yetenek ve güç bekleme süreleri -%7',col:'#d070ff'},
  {id:'luck',name:'Şans',desc:'Kritik vuruş şansı +%3 (2x hasar)',col:'#ffff60'},
  {id:'unbreak',name:'Kırılmazlık',desc:'Kulelerin canı +%8',col:'#9a9aaa'},
  {id:'mending',name:'Onarım',desc:'Dalga sonu onarımı +%6, kuleler yavaşça kendini onarır',col:'#7affb0'},
];
const PERK_MAX=5;
const perk=id=>SAVE.perks[id]||0;
const ACHS=[
  {id:'firstKill',name:'İlk Kan',desc:'İlk yaratığını yok et.',icon:'e:zombie'},
  {id:'kill1000',name:'Kıyım Makinesi',desc:'Toplam 1000 yaratık yok et.',icon:'pix:skull'},
  {id:'builder',name:'Mimar',desc:'Tek oyunda 12 kule kur.',icon:'t:archer'},
  {id:'maxed',name:'Tam Güç',desc:'Bir kuleyi elmas (4.) seviyeye yükselt.',icon:'tex:diamond'},
  {id:'netherite',name:'Netherit Kaplama',desc:'Bir kuleyi Netherit seviyesine yükselt.',icon:'pix:netherite'},
  {id:'diamond',name:'Elmaslar!',desc:'Bir elmas cevheri kaz.',icon:'pix:diamond'},
  {id:'miner',name:'Usta Madenci',desc:'Toplam 50 blok kaz.',icon:'tex:ore_iron'},
  {id:'boss',name:'Boss Avcısı',desc:'Bir boss yen.',icon:'e:bossZombie'},
  {id:'perfect',name:'Kusursuz Savunma',desc:'Bir dünyayı hiç can kaybetmeden bitir.',icon:'pix:heart'},
  {id:'night',name:'Gece Bekçisi',desc:'Bir gece dalgasını can kaybetmeden geç.',icon:'e:bat'},
  {id:'chain',name:'Zincirleme Reaksiyon',desc:'Tek yıldırımla 5 yaratığa çarp.',icon:'t:lightning'},
  {id:'boom',name:'Büyük Patlama',desc:'Tek patlamada 6 yaratık yok et.',icon:'tex:tntSide'},
  {id:'rich',name:'Zümrüt Baronu',desc:'Aynı anda 2000 zümrüte sahip ol.',icon:'pix:emerald'},
  {id:'golem',name:'Demir Kalp',desc:'Bir Demir Golem çağır.',icon:'tex:iron'},
  {id:'repair',name:'Örsün Sesi',desc:'Toplam 2000 kule canı onar.',icon:'t:anvil'},
  {id:'craft',name:'Zanaatkâr',desc:'Envanterde bir eşya üret.',icon:'pix:book'},
  {id:'totem',name:'Ölümü Aldat',desc:'Ölümsüzlük Totemi seni kurtarsın.',icon:'pix:totem'},
  {id:'nether',name:'Daha Derine İnmemiz Gerek',desc:'Nether\'de bir dünyayı bitir.',icon:'tex:netherrack'},
  {id:'bed',name:'Nether\'de Uyku Yok',desc:'Tek bir Patlayan Yatak ile 5 yaratık yok et.',icon:'pix:bed'},
  {id:'piglin',name:'Altın Göz Boyar',desc:'Piglinleri altınla 10 kez oyala.',icon:'pix:goldingot'},
  {id:'wither',name:'Wither\'ı Durdur',desc:'Wither\'ı yen.',icon:'e:witherBoss'},
  {id:'endEnter',name:'Son?',desc:'Bir End dünyasına gir.',icon:'tex:endstone'},
  {id:'dragon',name:'End\'i Özgür Bırak',desc:'Ender Ejderhası\'nı yen.',icon:'e:bossDragon'},
  {id:'creaking',name:'Gözünü Ayırma',desc:'Kadim Gıcırtı\'yı yen.',icon:'e:creaking'},
  {id:'heart',name:'Kalp Kırıcı',desc:'Bir Gıcırtı Kalbi kaz.',icon:'pix:eyeblossom'},
  {id:'warden',name:'Sessizliğin Bedeli',desc:'Muhafız\'ı yen.',icon:'e:warden'},
  {id:'sneak',name:'Çevik Gizlilik',desc:'Karanlık Derinlikler dünyalarından birini, uyarı seviyesi hiç 4\'e ulaşmadan bitir.',icon:'pix:echoshard'},
  {id:'siftEnter',name:'Dördüncü Boyut',desc:'Sift\'e adım at.',icon:'tex:siftgrass'},
  {id:'blub',name:'Blub Dostu',desc:'Toplam 25 kez bir Blub\'u sev.',icon:'e:blub'},
  {id:'tide',name:'Gelgitin Efendisi',desc:'Gelgit Çağrısı gücünü kullan.',icon:'pix:tide'},
  {id:'illusioner',name:'Sift\'in Koruyucusu',desc:'Büyük Hokkabaz\'ı yen.',icon:'e:grandIllusioner'},
  {id:'hard',name:'Demir İrade',desc:'Zor modda bir dünyayı bitir.',icon:'tex:iron'},
  {id:'endless30',name:'Sonsuzluğa Doğru',desc:'Sonsuz modda 30. dalgaya ulaş.',icon:'t:beacon'},
  {id:'alldims',name:'Boyut Gezgini',desc:'Dört boyutun her birinde en az bir dünya bitir.',icon:'pix:star'},
  {id:'allMaps',name:'Dünya Gezgini',desc:'40 dünyanın tamamını bitir.',icon:'pix:star'},
  {id:'level10',name:'Deneyimli',desc:'10. seviyeye ulaş.',icon:'pix:orb'},
];
/* Her yerde kullanılan dört yetenek */
const ABIL=[
  {id:'tnt',name:'TNT Yağmuru',key:'Q',cd:40,aim:true,r:1.6,desc:'Seçtiğin bölgeye gökten 7 TNT yağdırır.'},
  {id:'freeze',name:'Kar Fırtınası',key:'W',cd:55,desc:'Tüm yaratıkları 3 saniye dondurur (bosslar 1 sn).'},
  {id:'golem',name:'Demir Golem',key:'E',cd:65,desc:'Yolun sonundan yürüyen, yaratıkları durdurup yumruklayan bir Demir Golem çağırır.'},
  {id:'apple',name:'Altın Elma',key:'R',cd:90,desc:'+3 can, 8 sn boyunca tüm kuleler %50 daha hızlı ve tüm kuleler %20 onarılır.'},
];
/* Bölgeye özgü güçler (T, Sift'te ayrıca Y ve G) */
const POWERS={
  mace:{name:'Gürz Darbesi',key:'T',cd:35,aim:true,r:1.3,icon:'mace',desc:'Gökten Gürz ile çakılırsın: alandaki yaratıklara büyük hasar, Rüzgâr Patlaması ile geri savurma ve sersemletme.'},
  horn:{name:'Keçi Boynuzu',key:'T',cd:55,icon:'horn',desc:'Boynuzun yankısı: tüm yaratıklar 2 sn sersemler ve 25 sn boyunca Sculk sensörleri hiçbir titreşimi duyamaz.'},
  gaze:{name:'Göz Çiçeği Bakışı',key:'T',cd:50,icon:'gaze',desc:'10 sn boyunca bütün Gıcırtılar donar, her yaratık %35 yavaşlar ve kalplerin yeri turuncu ışıkla belirir.'},
  bed:{name:'Patlayan Yatak',key:'T',cd:45,aim:true,r:1.8,icon:'bed',desc:'Nether\'de uyumaya çalış: yatak koca bir patlamayla havaya uçar ve alanı ateşe verir.'},
  ecrystal:{name:'End Kristali',key:'T',cd:50,aim:true,r:2.4,icon:'crystal',desc:'8 sn boyunca yakındaki kulelere ışın verip %40 hızlandıran bir kristal kurar; sonunda büyük bir patlamayla parçalanır.'},
  song:{name:'Şarkıcının Şarkısı',key:'T',cd:30,soul:35,icon:'song',desc:'Tüm kuleler %35 onarılır, yaratıklar 4 sn boyunca ninniyle %50 yavaşlar.'},
  tidecall:{name:'Gelgit Çağrısı',key:'Y',cd:60,soul:60,icon:'tide',desc:'Gelgiti 25 sn boyunca BEREKET\'e çevirir.'},
  ichorflood:{name:'Ichor Seli',key:'G',cd:40,soul:45,aim:true,r:1.6,icon:'ichor',desc:'Seçilen bölgeyi 6 sn Ichor basar: Illager\'lar ruh-hastalığıyla yanar, yozlaşmış Sift yaratıkları arınıp 4 sn sakinleşir (durur).'},
};
const REALM_POWERS={ow:['mace'],ocean:['mace'],raid:['mace'],deep:['horn'],pale:['gaze'],ne:['bed'],end:['ecrystal'],sift:['song','tidecall','ichorflood']};
const SPLASHES=['Kaz, kur, koru!','Dört boyut!','Blub!','Gıcırtıya bakmaya devam et!','Şşş... Muhafız uyuyor.','Nether\'de yatakta uyuma!','Gelgit dönüyor!','Ichor\'a basma!','End Güncellemesi geldi!','Netherit kaplı!','C418 çalıyor!','Yün titreşimi yutar!','Piglinler altına bayılır!','Ejderha bekliyor!','Elmas buldun mu?','Ağaç yumruklamak yok!','Şarkıcı\'yı koru!','Tek dosya, dört boyut!','Örs her şeyi onarır!','Creeper sessiz gelir!','Kalbi kaz!'];
/* ---------- kilitler ---------- */
function dimUnlocked(dim){if(dim==='ow')return true;if(dim==='ne')return!!SAVE.done.magara;if(dim==='end')return!!SAVE.done.kale;if(dim==='sift')return!!SAVE.done.antik;return false}
function mapUnlocked(m,creative){if(creative)return true;if(!dimUnlocked(m.dim))return false;if(m.di===0)return true;const prev=MAPS.find(x=>x.dim===m.dim&&x.di===m.di-1);return!!SAVE.done[prev.id]}
