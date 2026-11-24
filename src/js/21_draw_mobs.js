/* ============================ ÇİZİM: YARATIKLAR ============================
   Yerel koordinat: (0,0) ayak hizası, yukarı = -y, yüz sağa (+x). Ölçek drawEnemy'de uygulanır.
   FL: vurulma/donma rengi (her dikdörtgenin üstüne yarı saydam boyanır). */
let FL=null;
function r(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);if(FL){g.fillStyle=FL;g.fillRect(x,y,w,h)}}
function limb(g,x,y,w,h,a,c){g.save();g.translate(x,y);g.rotate(a);r(g,-w/2,0,w,h,c);g.restore()}
function glowAt(g,x,y,s,tex,a){const ga=g.globalAlpha;g.globalAlpha=ga*(a==null?.6:a);g.drawImage(tex,x-s/2,y-s/2,s,s);g.globalAlpha=ga}
const PAL={
  zombie:{skin:'#5f9e4a',skinD:'#4b8239',hair:'#3f6e30',shirt:'#2c9a9a',shirtD:'#217575',pants:'#3a3f9a',pantsD:'#2b2f75',eye:'#1d2b16',arms:'fwd'},
  husk:{skin:'#a89a6a',skinD:'#8a7c52',hair:'#6a5e3e',shirt:'#6a6a5a',shirtD:'#55554a',pants:'#5a4a3a',pantsD:'#46392c',eye:'#2a2010',arms:'fwd'},
  drowned:{skin:'#5aa8a0',skinD:'#468a84',hair:'#2e6a66',shirt:'#3a6a8a',shirtD:'#2c5470',pants:'#7a6a4a',pantsD:'#5e523a',eye:'#7affe8',arms:'down',weapon:'trident'},
  frostbite:{skin:'#8ac0c8',skinD:'#6aa0aa',hair:'#e8f6ff',shirt:'#4a6a8a',shirtD:'#3a5470',pants:'#3a4a6a',pantsD:'#2c3a54',eye:'#1a4a8a',arms:'fwd',ice:true},
  armored:{skin:'#5f9e4a',skinD:'#4b8239',hair:'#3f6e30',shirt:'#2c9a9a',shirtD:'#217575',pants:'#a0a0a0',pantsD:'#7a7a7a',eye:'#1d2b16',arms:'fwd',armor:true},
  bossZombie:{skin:'#4a8a35',skinD:'#3a702a',hair:'#2a5020',shirt:'#7a2a2a',shirtD:'#5a1a1a',pants:'#3a2a1a',pantsD:'#2a1a0a',eye:'#ff2020',arms:'fwd',crown:true},
  bossIce:{skin:'#cfeeff',skinD:'#9fd0f0',hair:'#ffffff',shirt:'#6fa8d8',shirtD:'#4f88b8',pants:'#3f6f9f',pantsD:'#2f5a85',eye:'#1040c0',arms:'down',ice:true},
  golem:{skin:'#c8c0b8',skinD:'#a8a098',hair:'#4a7a2a',shirt:'#b8b0a8',shirtD:'#98908a',pants:'#a8a098',pantsD:'#888078',eye:'#cc2020',arms:'down',golem:true},
  piglin:{skin:'#e3a08e',skinD:'#c47e6c',hair:'#b06a58',shirt:'#6a4a2a',shirtD:'#523820',pants:'#4a3420',pantsD:'#382616',eye:'#2a1a1a',arms:'down',snout:true,weapon:'goldsword',gold:true},
  piglinx:{skin:'#e3a08e',skinD:'#c47e6c',hair:'#b06a58',shirt:'#5a4a3a',shirtD:'#463a2c',pants:'#4a3420',pantsD:'#382616',eye:'#2a1a1a',arms:'down',snout:true,weapon:'crossbow',gold:true},
  brute:{skin:'#c98a78',skinD:'#a86c5c',hair:'#7a4a3a',shirt:'#2a2a2e',shirtD:'#1e1e22',pants:'#2a2a2e',pantsD:'#1e1e22',eye:'#ff4040',arms:'down',snout:true,weapon:'goldaxe',armor:'gold'},
  bruteChief:{skin:'#c98a78',skinD:'#a86c5c',hair:'#7a4a3a',shirt:'#3a1a1a',shirtD:'#2a1010',pants:'#2a2a2e',pantsD:'#1e1e22',eye:'#ff4040',arms:'down',snout:true,weapon:'goldaxe',armor:'gold',crown:true},
  zpiglin:{skin:'#d8907e',skinD:'#6aa04a',hair:'#8a5a4a',shirt:'#6a5a3a',shirtD:'#4a6a3a',pants:'#4a3a2a',pantsD:'#3a2a1a',eye:'#2a2a1a',arms:'down',snout:true,weapon:'goldsword',rot:true},
  pillager:{skin:'#9aa4a0',skinD:'#7e8884',hair:'#3a3a40',shirt:'#4a4a52',shirtD:'#3a3a42',pants:'#3a3a40',pantsD:'#2e2e34',eye:'#2a5a2a',arms:'down',nose:true,weapon:'crossbow'},
  vindicator:{skin:'#9aa4a0',skinD:'#7e8884',hair:'#2a2a2e',shirt:'#3a3a40',shirtD:'#2c2c32',pants:'#2a2a30',pantsD:'#202026',eye:'#2a5a2a',arms:'down',nose:true,weapon:'axe',robe:'#2e2e34'},
  evoker:{skin:'#9aa4a0',skinD:'#7e8884',hair:'#2a2a2e',shirt:'#2a2a30',shirtD:'#1e1e24',pants:'#2a2a30',pantsD:'#1e1e24',eye:'#2a5a2a',arms:'up',nose:true,robe:'#222228',trim:'#e8b830'},
  harvester:{skin:'#9aa4a0',skinD:'#7e8884',hair:'#2a3a5a',shirt:'#2a3a5a',shirtD:'#1e2a44',pants:'#1e2a44',pantsD:'#141e34',eye:'#2adfeb',arms:'down',nose:true,robe:'#22304a',weapon:'lantern'},
  harvBoss:{skin:'#8a9490',skinD:'#6e7874',hair:'#1a2a4a',shirt:'#1a2a4a',shirtD:'#121e36',pants:'#121e36',pantsD:'#0a1426',eye:'#2adfeb',arms:'up',nose:true,robe:'#18243c',trim:'#7af0e8',weapon:'lantern',crown:true},
  grandIllusioner:{skin:'#9aa4a0',skinD:'#7e8884',hair:'#2a4a8a',shirt:'#2a4a9a',shirtD:'#1e3a7a',pants:'#1e3a7a',pantsD:'#142a5a',eye:'#7ac0ff',arms:'up',nose:true,robe:'#22408a',trim:'#e0e8ff',weapon:'staff',hood:true},
  bekci:{skin:'#46564f',skinD:'#34423c',hair:'#2a3632',shirt:'#3e4e48',shirtD:'#2e3c36',pants:'#3a4a44',pantsD:'#2a3832',eye:'#5affe8',arms:'down',statue:true},
  basaltGiant:{skin:'#4e4e56',skinD:'#3e3e45',hair:'#2a2a30',shirt:'#45454d',shirtD:'#35353c',pants:'#3e3e45',pantsD:'#2e2e34',eye:'#ffa020',arms:'down',magmaCracks:true},
  crystalGolem:{skin:'#b8d8ff',skinD:'#90b8e8',hair:'#e8c0f8',shirt:'#a8ccf8',shirtD:'#88a8d8',pants:'#98bcec',pantsD:'#7898c8',eye:'#ff70e0',arms:'down',crystalSpikes:true},
  amberGiant:{skin:'#d88a34',skinD:'#b86e22',hair:'#ffc060',shirt:'#c87a2a',shirtD:'#a8621c',pants:'#b86e22',pantsD:'#985a18',eye:'#fff0a0',arms:'down',amberGlow:true},
  skeleton:{bone:'#d6d6d6',boneD:'#9b9b9b'},
  stray:{bone:'#c8d4d8',boneD:'#8a9aa0',rags:'#6a7a80'},
  bogged:{bone:'#b8c4a0',boneD:'#7e8a68',moss:'#4a6a2a',shroom:true},
  wither:{bone:'#3a3a3e',boneD:'#222226',sword:true,eyeC:'#ff4040'},
  bossBone:{bone:'#c8c4b8',boneD:'#8a867a',robe:'#3a1a4a',robeD:'#2a1035',crown:true,staff:true},
  witherGeneral:{bone:'#2e2e32',boneD:'#1a1a1e',sword:true,crown:true,eyeC:'#2adfeb',soulfire:true},
  spider:{body:'#2f2721',bodyL:'#3e342c',mark:'#5a2a2a',head:'#3a302a',leg:'#3a302a',legD:'#241d18',eye:'#ff2b2b'},
  cave:{body:'#1e3a40',bodyL:'#2a4a52',mark:'#3a6a6a',head:'#1e3a40',leg:'#1e3a40',legD:'#12282c',eye:'#ff2b2b'},
  bossSpider:{body:'#2a1838',bodyL:'#3e2850',mark:'#b040d0',head:'#33204a',leg:'#33204a',legD:'#1e1030',eye:'#ff40ff',crown:true},
  crystal:{body:'#6a7aa8',bodyL:'#8a9ac8',mark:'#e8c0ff',head:'#5a6a98',leg:'#4a5a88',legD:'#3a4a78',eye:'#ffffff',crystalSpikes:true},
  slime:{outer:'#76d65e',inner:'#4fae3c',eye:'#1f3a15'},
  resin:{outer:'#f08a2a',inner:'#c85a10',eye:'#4a1a00'},
  endslime:{outer:'#b070d8',inner:'#7a40a8',eye:'#2a0a3a'},
  bossEndSlime:{outer:'#9a5ac8',inner:'#6a2a98',eye:'#ffe0ff',crown:true},
  sculkcube:{outer:'#0e333d',inner:'#29dfeb',eye:'#bfffff'},
  magma:{outer:'#4a1208',inner:'#ff7a1a',eye:'#ffe060',magma:true},
  bossMagma:{outer:'#3a0e06',inner:'#ff8a20',eye:'#fff080',magma:true,crown:true},
  witch:{robe:'#3d2257',robeD:'#2e1844',skin:'#c59878',skinD:'#a87e60',hat:'#1f142b',band:'#4f9a3a'},
  swampWitch:{robe:'#2a4a2a',robeD:'#1e3a1e',skin:'#a8b878',skinD:'#889858',hat:'#1a2a1a',band:'#a040c0',crown:true},
  phantom:{body:'#3a4a7a',bodyD:'#2a3660',wing:'#4a5a8a',bone:'#c8c8c8',eye:'#7aff6a'},
  dragonfly:{body:'#6a3a9a',bodyD:'#4a2a7a',wing:'rgba(120,230,255,.55)',bone:'#9af0ff',eye:'#ffe060'},
  moth:{body:'#d8d0b8',bodyD:'#b8b098',wing:'#eee6d0',bone:'#a89878',eye:'#2a2a2a',pattern:'#8a7a5a'},
  mothQueen:{body:'#e8e0c8',bodyD:'#c8c0a8',wing:'#f8f0e0',bone:'#c8a8e8',eye:'#a040ff',pattern:'#a080c0',crown:true},
  vex:{body:'#b8c8d8',bodyD:'#8898a8',wing:'rgba(220,230,255,.6)',eye:'#ff4040'},
  echosoul:{body:'#2adfeb',bodyD:'#0e6a76',wing:'rgba(120,240,255,.4)',eye:'#e0ffff'},
  enderman:{body:'#161616',bodyD:'#0a0a0a',eye:'#e070ff',eyeG:'#a020d0'},
  shadow:{body:'#241a34',bodyD:'#140e20',eye:'#ffffff',eyeG:'#8a6aff',ghost:true},
  ancientEnder:{body:'#1a1228',bodyD:'#0e0a18',eye:'#ff60ff',eyeG:'#c020ff',crown:true},
  shadowLord:{body:'#1a1026',bodyD:'#0a0612',eye:'#ffffff',eyeG:'#c0a0ff',crown:true,ghost:true},
  crawler:{seg:'#0e333d',segD:'#082128',glow:'#29dfeb',eye:'#bfffff'},
  endermite:{seg:'#3a1a4a',segD:'#2a0e38',glow:'#a060d0',eye:'#e080ff'},
  wyrm:{seg:'#b8b030',segD:'#8a8420',glow:'#e8ff7a',eye:'#ff4020',crown:true},
  guardian:{body:'#6a9a8a',bodyD:'#4a7a6a',spike:'#e0d8b0',eye:'#e04020',tail:'#c87a40'},
  elder:{body:'#c8c0a8',bodyD:'#a8a088',spike:'#f0e8d0',eye:'#8a2a8a',tail:'#a88a6a',crown:true},
  hoglin:{body:'#c8846a',bodyD:'#a86a52',hair:'#e8c8a0',snout:'#e8a088',tusk:'#f0ead8',eye:'#2a1010'},
  hoglinChief:{body:'#b06a52',bodyD:'#8a5240',hair:'#f0d0a8',snout:'#e8a088',tusk:'#fff6e0',eye:'#ff3020',crown:true,bigTusk:true},
  zoglin:{body:'#a88a7a',bodyD:'#6a8a5a',hair:'#c8d8b0',snout:'#d8a090',tusk:'#f0ead8',eye:'#ff2020',rot:true},
  ravager:{body:'#5a5a62',bodyD:'#44444a',hair:'#3a3a40',snout:'#6a6a72',tusk:'#e8e0d0',eye:'#2a2a2a',horns:true,saddle:true},
  greatHog:{body:'#7a4a3a',bodyD:'#5a3428',hair:'#2a2a2e',snout:'#c8846a',tusk:'#fff6e0',eye:'#ff6020',armor:'#d8a020',horns:true,banner:true,bigTusk:true},
  nester:{body:'#3aa0a8',bodyD:'#2a8088',hair:'#d8b880',snout:'#d8b880',tusk:null,eye:'#1a1a3a',antenna:'#4ac8c8'},
  beetle:{body:'#a89a78',bodyD:'#887a5a',hair:'#5a4a3a',snout:'#7a6a4a',tusk:null,eye:'#2a1a1a',shell:'#6a5a3a'},
  carapaceGiant:{body:'#a89a78',bodyD:'#887a5a',hair:'#5a4a3a',snout:'#7a6a4a',tusk:'#e8e0c8',eye:'#7af0e8',shell:'#5a4a30',crown:true},
  ghast:{body:'#f0f0f0',bodyD:'#c8c8c8',eye:'#1a1a1a',tent:'#e0e0e0',mouth:true,tears:true},
  ghastMother:{body:'#f4ecec',bodyD:'#d0c4c4',eye:'#8a1a1a',tent:'#e8dcdc',mouth:true,tears:true,crown:true},
  sprout:{body:'#2a3050',bodyD:'#1a2038',eye:'#4a9ad8',band:'#d8b880',tent:'#22283e',oneEye:true},
  harmonizer:{body:'#3a2a5a',bodyD:'#2a1a44',eye:'#e8e8ff',band:'#d8b880',tent:'#3a2a62',oneEye:true,cloak:'#4a3478',antenna:'#5a4a8a'},
  cubozoa:{body:'rgba(120,230,240,.55)',bodyD:'rgba(60,180,200,.55)',eye:'#e0ffff',tent:'rgba(140,240,255,.6)',core:'#8affff',jelly:true},
  jellyQueen:{body:'rgba(255,150,220,.55)',bodyD:'rgba(200,90,180,.55)',eye:'#ffffff',tent:'rgba(255,180,240,.6)',core:'#ffd0f8',jelly:true,crown:true},
  blaze:{head:'#e8a020',headD:'#c07810',rod:'#ffcc40',eye:'#2a1a00',smoke:'#6a4a3a'},
  blazeKing:{head:'#f0c030',headD:'#c89010',rod:'#fff080',eye:'#ff2a00',smoke:'#8a5a2a',crown:true},
  eyewisp:{head:'#ff9a2a',headD:'#d87010',rod:'#ffe080',eye:'#3a1a00',petal:true},
  shulker:{shell:'#9a6a9e',shellL:'#c090c4',head:'#f0e8a0',eye:'#2a2a2a'},
  shulkerQueen:{shell:'#5a3a7a',shellL:'#8a5aa8',head:'#ffe0f8',eye:'#a020a0',crown:true},
  strider:{body:'#a83a2a',bodyD:'#882a1e',hair:'#4a3a3a',leg:'#6a2a2a',eye:'#2a0a0a',cold:'#8a6aa8'},
  dragon:{body:'#1f1e26',bodyL:'#2c2b36',spine:'#4a4a58',eye:'#e070ff',wing:'#24232c',wingL:'#4a3a5e'},
  boneDragon:{body:'#d8d0b8',bodyL:'#ece6d4',spine:'#a89a80',eye:'#4ae8f0',wing:'rgba(200,190,170,.35)',wingL:'#c8bca0',bones:true},
  creeper:{body:'#4fb43a',bodyD:'#3a8a2a',dots:'#2e6e20',face:'#0a0a0a'},
  palecreeper:{body:'#b8bdb1',bodyD:'#9a9f94',dots:'#8a8f84',face:'#2a2a2a',moss:true},
  creaking:{bark:'#5e5048',barkD:'#43382f',moss:'#a6ab9c',eye:'#ff9a2a',eyeOff:'#6a4a2a'},
  bigCreaking:{bark:'#4e423a',barkD:'#352b24',moss:'#c2c7bb',eye:'#ff7a10',eyeOff:'#6a3a1a',crown:true,extraEye:true},
  warden:{body:'#0f3a44',bodyD:'#0a2830',glow:'#29dfeb',rib:'#1a6a74',horn:'#0c3038',soul:'#9affff'},
  ancientWarden:{body:'#0b2a34',bodyD:'#061c24',glow:'#5af8ff',rib:'#1a7a88',horn:'#0a2a34',soul:'#e0ffff',crown:true,bigHorn:true},
  seedling:{top:'#5ac8b0',topD:'#3aa890',bot:'#d8b880',botD:'#b89860',leaf:'#7ae8c8',eye:'#1a1a3a'},
  sentinel:{top:'#2e6aa8',topD:'#225488',band:'#d8b880',frill:'#4ac8e8',leg:'#2a5a90',eye:'#1a1a3a'},
  hunter:{body:'#13242e',bodyD:'#0a161e',glow:'#29dfeb',claw:'#c8d8d8'},
  stalker:{body:'#1e1a2e',bodyD:'#120e1e',glow:'#8a6aff',claw:'#d8c8e8'},
  monarch:{body:'#1a1a2a',bodyD:'#0e0e1a',cape:'#6af0d0',capeD:'#2aa890',horn:'#2a3a3a',eye:'#e8ffff'},
  monarchEcho:{body:'rgba(60,200,200,.45)',bodyD:'rgba(30,140,140,.45)',cape:'rgba(140,255,230,.5)',capeD:'rgba(60,200,180,.5)',horn:'rgba(80,160,160,.5)',eye:'#ffffff'},
  monstrosity:{body:'#0e2a3a',bodyD:'#08202c',bone:'#e8dcb0',glow:'#3ae8ff',fire:'#7af8ff'},
  witherBoss:{bone:'#2a2a2e',boneD:'#18181c',eye:'#e8e8e8',shield:'rgba(120,120,200,.35)'},
  corrupt:{soul:'#ff4a4a',body:'#5a4a4e'},
};
/* --------- temel insansı --------- */
function crownAt(g,x,y,w){r(g,x,y,w,1.5,'#ffd83d');for(let i=0;i<3;i++)r(g,x+i*(w-1)/2,y-1.5,1,1.5,'#ffd83d');r(g,x+w/2-.5,y-.1,1,1,'#e02020')}
function weaponDraw(g,w,e){
  if(w==='goldsword'||w==='sword'){r(g,-.7,-11,1.4,10,w==='goldsword'?'#f5d63a':'#e6e6e6');r(g,-2,-1,4,1.2,'#6a4a2a');r(g,-.6,0,1.2,2.5,'#4a3a2a')}
  else if(w==='axe'||w==='goldaxe'){r(g,-.6,-11,1.2,12,'#6a4a2a');r(g,-.5,-11,4,4,w==='goldaxe'?'#f5d63a':'#c8c8c8');r(g,2.5,-11,1,4,w==='goldaxe'?'#c8a020':'#9a9a9a')}
  else if(w==='crossbow'){r(g,-1,-6,9,1.4,'#6a4a2a');r(g,5,-9,1.2,7,'#7a5a3a');r(g,2,-5.7,6,.6,'#ddd')}
  else if(w==='trident'){r(g,-.6,-14,1.2,15,'#3aa0a0');r(g,-2.5,-15,1,3,'#5ad8d0');r(g,1.5,-15,1,3,'#5ad8d0');r(g,-.5,-16,1,3,'#5ad8d0')}
  else if(w==='staff'){r(g,-.6,-16,1.2,17,'#4a3a2a');r(g,-1.6,-19,3.2,3.2,'#7ac0ff');r(g,-1,-18.4,1.2,1.2,'#fff')}
  else if(w==='lantern'){r(g,-.4,-4,.8,4,'#3a3a3a');r(g,-1.8,0,3.6,4,'#2a2a3a');r(g,-1.2,.6,2.4,2.6,'#3ae8ff')}
}
function humanoid(g,e,p,time){
  const sw=Math.sin(e.anim)*.6,pa=e.punch>0?Math.sin(e.punch/.35*Math.PI):0;
  const fwd=p.arms==='fwd',up=p.arms==='up'&&(e.cast>0||Math.sin(time*2+e.t)>.3);
  const armA=fwd?-1.45:up?-2.6:sw*.8;
  if(p.robe){r(g,-2.6,-12.5,5.2,12.5,p.robe);r(g,-2.6,-12.5,1.2,12.5,p.shirtD)}
  limb(g,0,-12,2.6,7.5,fwd?armA+sw*.1:up?-2.6:-sw*.8,p.skinD);
  if(!p.robe){limb(g,-.5,-6,3,6,-sw,p.pantsD);limb(g,.5,-6,3,6,sw,p.pants)}
  r(g,-2,-12.5,4,7,p.shirt);r(g,-2,-12.5,1.2,7,p.shirtD);
  if(p.trim){r(g,-2,-12.5,.6,12,p.trim);r(g,1.4,-12.5,.6,12,p.trim)}
  if(p.armor===true){r(g,-2.5,-12.8,5,5,'#c4c4c4');r(g,-2.5,-12.8,5,1,'#e8e8e8')}
  if(p.armor==='gold'){r(g,-2.5,-12.8,5,4,'#e8b830');r(g,-2.5,-12.8,5,1,'#fff2a0')}
  if(p.golem){r(g,-3,-14,6,9,p.shirt);r(g,-3,-14,6,2,'#d8d0c8');r(g,-2,-11,2,3,'#4a7a2a')}
  if(p.statue){r(g,-2,-10,4,1,'#5affe8')}
  if(p.magmaCracks){r(g,-1,-11,1,4,'#ff7a1a');r(g,1,-8,1,3,'#ffa030')}
  if(p.amberGlow)glowAt(g,0,-10,10,TX.glowO,.5);
  if(p.rot){r(g,.5,-11,1.5,3,'#e8e0d0')}
  /* kafa */
  r(g,-4,-20.5,8,8,p.skin);r(g,-4,-20.5,8,1.5,p.hair);r(g,-4,-20.5,1.5,8,p.skinD);
  if(p.snout){r(g,2.2,-17,3,3,'#f0b4a4');r(g,2.8,-16.2,.8,.8,'#6a3a3a');r(g,4,-16.2,.8,.8,'#6a3a3a');r(g,2,-14.5,1,2,p.gold||p.armor?'#f0e8d0':'#e8e0d0');r(g,-5,-20,1.5,4,p.hair);r(g,3.6,-20,1.5,4,p.hair);if(p.rot)r(g,-3,-17,2,2,'#6aa04a')}
  r(g,1.5,-18,2,1.5,p.eye);r(g,-1,-18,1.5,1.5,p.eye);
  if(p.nose){r(g,2.5,-16.5,1.6,3,p.skinD)}else if(!p.snout)r(g,1,-14.5,3,1,p.skinD);
  if(p.statue){r(g,-4,-20.5,8,1.5,'#2a3632');r(g,1.5,-18,2,1.5,'#5affe8');r(g,-1,-18,1.5,1.5,'#5affe8')}
  if(p.hood){r(g,-4.6,-21.5,9.2,3,p.robe);r(g,-4.6,-21.5,1.6,7,p.robe)}
  if(p.armor===true){r(g,-4.6,-21,9.2,4,'#cfcfcf');r(g,-4.6,-21,9.2,1,'#f0f0f0')}
  if(p.armor==='gold'){r(g,-4.6,-21,9.2,3,'#e8b830')}
  if(p.ice){r(g,-3,-23.5,1.6,3,'#eaffff');r(g,0,-24.5,1.6,4,'#eaffff');r(g,-5.5,-15,2,4,'#eaffff');r(g,-6,-11,2,3,'#d0f4ff')}
  if(p.crystalSpikes){r(g,-3,-24,1.6,4,'#f0d0ff');r(g,1,-25,1.6,5,'#d0e8ff');r(g,-6,-14,2,4,'#f0d0ff');r(g,4,-13,2,3,'#d0e8ff')}
  if(p.golem){r(g,-4.5,-21,9,2,p.skinD);r(g,3.5,-18,1.5,4,p.skinD)}
  if(p.crown)crownAt(g,-3.5,-22.5,7);
  /* ön kol + silah */
  const fa=fwd?armA-sw*.1-pa*.3:up?-2.6:(p.golem?-pa*1.5+sw*.8:sw*.8-pa*1.2);
  if(p.weapon){g.save();g.translate(0,-12);g.rotate(fa);r(g,-1.3,0,2.6,7.5,p.skin);g.translate(0,7);g.rotate(-fa+(p.weapon==='crossbow'||p.weapon==='lantern'?0:-.5));weaponDraw(g,p.weapon,e);g.restore()}
  else limb(g,0,-12,2.6,7.5,fa,p.skin);
  if(up&&p.arms==='up'){for(let i=0;i<2;i++){const a=time*6+i*3;r(g,Math.cos(a)*4-.6,-27+Math.sin(a)*2,1.2,1.2,p.trim||'#c8a0ff')}}
}
function skeletonDraw(g,e,p){
  const sw=Math.sin(e.anim)*.6;
  if(p.robe){r(g,-3,-13,6,13,p.robe);r(g,-3,-13,1.4,13,p.robeD);r(g,-3.5+sw*.5,-2,7,2,p.robe)}
  else{limb(g,-.3,-6,1.8,6,-sw,p.boneD);limb(g,.3,-6,1.8,6,sw,p.bone)}
  limb(g,0,-12,1.6,7,p.sword?-.4+sw*.3:-1.45,p.boneD);
  if(!p.robe){r(g,-1,-12.5,2,7,p.bone);r(g,-2,-11.5,4,1,p.bone);r(g,-2,-9.5,4,1,p.bone)}
  if(p.rags){r(g,-2.5,-12.5,5,4,p.rags);r(g,-2,-8.5,1,2,p.rags)}
  if(p.moss){r(g,-2.5,-12.5,5,2,p.moss);r(g,-4,-21,8,1.5,p.moss)}
  r(g,-4,-20.5,8,8,p.bone);r(g,-4,-20.5,1.5,8,p.boneD);r(g,1.5,-17.5,2,2,p.eyeC||'#2a2a2a');r(g,-1.5,-17.5,2,2,p.eyeC||'#2a2a2a');r(g,0,-14,4,1,'#555');
  if(p.shroom){r(g,-3,-23,3,2,'#c83a3a');r(g,1,-22.5,2,1.5,'#8a6a4a')}
  if(p.crown)crownAt(g,-3.5,-22,7);
  if(p.soulfire){glowAt(g,0,-24,14,TX.glowC,.7)}
  if(p.sword){g.save();g.translate(1,-11);g.rotate(-.9+Math.sin(e.anim)*.2);r(g,-.7,-11,1.4,10,p.bone==='#3a3a3e'||p.soulfire?'#5a5a5e':'#e6e6e6');r(g,-2,-1,4,1.2,'#6a4a2a');r(g,-.6,0,1.2,2.5,'#4a3a2a');g.restore()}
  else if(p.staff){r(g,4,-24,1.2,24,'#4a3a2a');r(g,3,-27,3.2,3.2,'#b040ff');r(g,3.6,-26.4,1.2,1.2,'#f0d0ff')}
  else{r(g,6,-16,1.2,11,'#7a5230');r(g,5,-17,1.2,1.5,'#7a5230');r(g,5,-6.5,1.2,1.5,'#7a5230');r(g,4.6,-16,.4,10,'#eee')}
  limb(g,0,-12,1.6,7,p.sword?-1.2:-1.45,p.bone);
}
function spiderDraw(g,e,p){
  const a=e.anim*1.7;
  const legs=(side)=>{g.strokeStyle=FL||(side?p.leg:p.legD);g.lineWidth=1.3;g.beginPath();
    for(let i=0;i<4;i++){const bx=-6+i*3.2,ph=Math.sin(a+i*1.4+side*Math.PI),fx=bx+(i-1.5)*2.2+ph*1.6,ky=-10-Math.max(0,ph)*1.5;g.moveTo(bx,-5);g.lineTo((bx+fx)/2+(i-1.5)*.8,ky);g.lineTo(fx,0-Math.max(0,-ph)*.8)}g.stroke()};
  legs(0);r(g,-10,-9,9,7,p.body);r(g,-10,-9,9,1.5,p.bodyL);r(g,-8,-6,5,1,p.mark);r(g,-7,-4,3,1,p.mark);
  if(p.crystalSpikes){r(g,-9,-12,2,3,'#e8c0ff');r(g,-6,-13,2,4,'#c8e0ff');r(g,-3,-11.5,2,2.5,'#e8c0ff')}
  r(g,-1.5,-8,6.5,5.5,p.head);r(g,3.5,-7,1.5,1.2,p.eye);r(g,3.5,-5,1.5,1,p.eye);r(g,1.8,-7.2,1,1,p.eye);
  if(p.crown)crownAt(g,-.5,-10,5);legs(1);
}
function slimeDraw(g,e,p){
  const hop=Math.abs(Math.sin(e.anim*.9));g.save();g.translate(0,-hop*4);const sq=hop<.15?1.12:1;g.scale(sq,1/sq);
  if(p.magma){r(g,-5,-10,10,10,p.outer);r(g,-5,-7.5,10,1.2,p.inner);r(g,-5,-4.5,10,1.2,'#ffb030');r(g,-5,-2,10,1,p.inner);r(g,-2.5,-9,5,4,'#1a0500');r(g,1,-8.5,1.5,1.5,p.eye);r(g,-2,-8.5,1.5,1.5,p.eye)}
  else{const ga=g.globalAlpha;g.globalAlpha=ga*.82;r(g,-5,-10,10,10,p.outer);g.globalAlpha=ga;r(g,-3,-7.5,6,5.5,p.inner);r(g,1,-8,2,2,p.eye);r(g,-2.5,-8,2,2,p.eye);r(g,0,-4.5,1.5,1,p.eye);r(g,-4.5,-9.5,2,1,'rgba(255,255,255,.5)')}
  if(p===PAL.sculkcube){r(g,-5,-10,10,1,p.inner);r(g,-5,-1,10,1,p.inner)}
  if(p.crown)crownAt(g,-3,-11.5,6);g.restore();
}
function witchDraw(g,e,p){
  p=p||PAL.witch;const sw=Math.sin(e.anim)*.5;
  r(g,-3.5,-13,7,13,p.robe);r(g,-3.5,-13,1.5,13,p.robeD);r(g,-4+sw,-2,8,2,p.robe);limb(g,-.5,-12,2.2,6,sw*.5,p.robeD);
  r(g,-4,-21,8,8,p.skin);r(g,-4,-21,1.5,8,p.skinD);r(g,4,-17.5,1.8,3,p.skinD);r(g,5,-15.5,.8,.8,'#5a8a3a');r(g,1.5,-18.5,1.5,1.2,'#2c8a2c');
  r(g,-6,-22.5,12,2,p.hat);r(g,-3.5,-26,7,3.5,p.hat);r(g,-2,-29,4,3,p.hat);r(g,-.5,-31,2.5,2,p.hat);r(g,-3.5,-23.5,7,1,p.band);
  if(p.crown)crownAt(g,-3,-33,6);
  limb(g,.5,-12,2.2,6,-.9,p.robe);r(g,4.2,-9.5,2.4,3,e.healFx>0?'#ff60ff':'#7ae04a');r(g,4.7,-10.5,1.4,1,'#ddd');
}
function batDraw(g,e){const f=Math.sin(e.t*24);g.fillStyle=FL||'#3a2a1e';
  g.beginPath();g.moveTo(-1,-4);g.lineTo(-9,-8+f*5);g.lineTo(-7,-2+f*2);g.lineTo(-3,-2);g.closePath();g.fill();
  g.beginPath();g.moveTo(1,-4);g.lineTo(9,-8+f*5);g.lineTo(7,-2+f*2);g.lineTo(3,-2);g.closePath();g.fill();
  r(g,-2,-6,4,5,'#4a3828');r(g,-1.5,-8.5,4,3,'#5a4632');r(g,-1,-10,1,1.5,'#4a3828');r(g,1.5,-10,1,1.5,'#4a3828');r(g,1.2,-7.8,1,.8,'#ff4040')}
/* Sinirbozan / Yankı Ruhu */
function vexDraw(g,e,p){const w=Math.sin(e.t*16);g.fillStyle=FL||p.wing;
  g.beginPath();g.moveTo(-1,-9);g.lineTo(-8,-14+w*3);g.lineTo(-6,-7);g.closePath();g.fill();
  r(g,-2.5,-12,5,6,p.body);r(g,-2,-6,4,3,p.bodyD);r(g,-1,-3,2,2,p.bodyD);r(g,-3,-17,6,5.5,p.body);r(g,1,-15,1.5,1.2,p.eye);r(g,-1.2,-15,1.2,1.2,p.eye);
  if(p===PAL.echosoul){glowAt(g,0,-11,18,TX.glowC,.6)}
  else{r(g,3,-11,1,6,'#c8c8c8');r(g,2.5,-12,2,1,'#8a6a3a')}}
/* Alev ruhu tabanı: Blaze ve Göz Çiçeği Ruhu */
function blazeDraw(g,e,p){const t=e.t;
  if(p.petal){glowAt(g,0,-10,26,TX.glowO,.7);for(let i=0;i<5;i++){const an=t*2+i*TAU/5;r(g,Math.cos(an)*5-1.5,-10+Math.sin(an)*5-1.5,3,3,p.head)}r(g,-3,-13,6,6,p.rod);r(g,-1,-11,2,2,p.eye);return}
  for(let i=0;i<4;i++){const an=t*3+i*TAU/4,x=Math.cos(an)*6,z=Math.sin(an);r(g,x-.8,-9+z*1.5,1.6,6,p.rod)}
  for(let i=0;i<3;i++)r(g,rand(-4,4),-2-rand(0,4),1.5,1.5,p.smoke);
  r(g,-4,-20,8,8,p.head);r(g,-4,-20,1.5,8,p.headD);r(g,1.5,-17,2,1.5,p.eye);r(g,-1,-17,1.5,1.5,p.eye);r(g,-1,-14.5,4,1,p.headD);
  for(let i=0;i<4;i++){const an=-t*2.4+i*TAU/4,x=Math.cos(an)*5;r(g,x-.8,-19+Math.sin(an),1.6,5,p.rod)}
  if(p.crown)crownAt(g,-3.5,-22,7);glowAt(g,0,-14,22,TX.glow,.5)}
function dragonDraw(g,e,p){
  p=p||PAL.dragon;const t=e.t,f=Math.sin(t*3.5);
  for(let i=0;i<7;i++){const tx=-14-i*3.6,ty=-7+Math.sin(t*3-i*.6)*2;r(g,tx,ty-1.5+i*.15,4,3-i*.3,p.body);r(g,tx+1,ty-3,1.4,1.4,p.spine)}
  const wing=(x,y,k,c1,c2)=>{g.fillStyle=FL||c1;g.beginPath();g.moveTo(x-5,y);g.lineTo(x+6,y);g.lineTo(x+2,y-20*k);g.lineTo(x-10,y-17*k);g.lineTo(x-16,y-6*k);g.closePath();g.fill();
    g.strokeStyle=c2;g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+2,y-20*k);g.moveTo(x,y);g.lineTo(x-10,y-17*k);g.moveTo(x,y);g.lineTo(x-16,y-6*k);g.stroke()};
  wing(-1,-10,f*.8+.1,p.wing,p.wingL);
  r(g,-14,-11,24,8,p.body);r(g,-14,-11,24,2,p.bodyL);for(let i=0;i<6;i++)r(g,-12+i*4,-13,2,2,p.spine);
  if(p.bones){for(let i=0;i<5;i++)r(g,-12+i*5,-9,1,6,'rgba(60,50,40,.5)')}
  r(g,9,-13,6,5,p.body);r(g,14,-16,10,7,p.body);r(g,16,-10,8,2,p.bodyL);r(g,19,-14.5,2.5,1.5,p.eye);r(g,14,-18,2,3,p.spine);r(g,17,-18.5,1.5,2.5,p.spine);
  r(g,-8,-3,3,5,p.body);r(g,4,-3,3,5,p.body);wing(1,-10,-f*.2+f*.9,p.wing,p.wingL);
}
/* --------- yeni çizimler --------- */
function creeperDraw(g,e,p){const sw=Math.sin(e.anim)*.5,fl=e.fuse>0&&((G.time*14)|0)%2===0;
  r(g,-4,-3,3,3,p.bodyD);r(g,1,-3,3,3,p.bodyD);r(g,-3+sw,-3,2.5,3,p.body);r(g,1.5-sw,-3,2.5,3,p.body);
  r(g,-3,-12,6,10,p.body);r(g,-3,-12,1.5,10,p.bodyD);r(g,-1,-9,2,2,p.dots);r(g,1,-5,1,2,p.dots);
  r(g,-4,-17,8,7,p.body);r(g,-4,-17,1.5,7,p.bodyD);r(g,-2.5,-15,2,2,p.face);r(g,1,-15,2,2,p.face);r(g,-.5,-13,2,3,p.face);r(g,-1.5,-11.5,1,2,p.face);r(g,1.5,-11.5,1,2,p.face);
  if(p.moss){r(g,-4,-17.5,8,1.5,'#d0d4c8');r(g,-4.5,-14,1.5,4,'#c8ccbf')}
  if(e.charged){g.strokeStyle='rgba(120,200,255,.8)';g.lineWidth=.8;g.strokeRect(-5,-18,10,18)}
  if(fl){g.fillStyle='rgba(255,255,255,.7)';g.fillRect(-4,-17,8,17)}}
function enderDraw(g,e,p){const sw=Math.sin(e.anim)*.5;
  if(p.ghost)g.globalAlpha*=.75;
  limb(g,-.4,-14,1.4,14,-sw*.6,p.bodyD);limb(g,.4,-14,1.4,14,sw*.6,p.body);
  r(g,-2,-22,4,8,p.body);limb(g,0,-21.5,1.3,13,-.15+sw*.2,p.bodyD);
  r(g,-3.5,-29,7,7,p.body);r(g,-3.5,-29,1.2,7,p.bodyD);r(g,-2.5,-25.5,2.5,1,p.eyeG);r(g,1,-25.5,2.5,1,p.eyeG);r(g,-2,-25.5,1.5,1,p.eye);r(g,1.5,-25.5,1.5,1,p.eye);
  if(e.carry){r(g,2,-19,5,5,'#8a6a4a');r(g,2,-19,5,1,'#b89a6a')}
  limb(g,0,-21.5,1.3,13,.1-sw*.2,p.body);if(p.crown)crownAt(g,-3,-30.5,6);
  if(Math.random()<.15)r(g,rand(-5,5),rand(-28,-4),1,1,p.eyeG)}
function wormDraw(g,e,p){const t=e.t*8;
  for(let i=5;i>=0;i--){const x=-i*2.6,y=-2.5-Math.abs(Math.sin(t-i*.8))*1.2,s=3.8-i*.25;r(g,x-s/2,y-s/2,s,s,i%2?p.segD:p.seg);if(i%2===0)r(g,x-.5,y-s/2-.5,1,1,p.glow)}
  r(g,1.5,-4.5,3,3,p.seg);r(g,3.5,-4,1,1,p.eye);if(p.crown)crownAt(g,1,-7,4);
  if(p===PAL.crawler||p===PAL.wyrm)glowAt(g,-6,-3,14,p===PAL.wyrm?TX.glowG:TX.glowC,.35)}
function guardianDraw(g,e,p){const t=e.t,b=Math.sin(t*3)*.8;
  r(g,-14,-7+b,6,3,p.tail);r(g,-9,-8+b,4,4,p.body);
  r(g,-5,-12,11,11,p.body);r(g,-5,-12,11,2,p.bodyD);r(g,-5,-3,11,2,p.bodyD);
  for(const[sx,sy]of[[-6,-13],[5,-13],[-6,-2],[5,-2],[0,-14],[-7,-7],[6,-7]])r(g,sx,sy,1.5,1.5,p.spike);
  r(g,1,-9,4,4,'#f0f0f0');const ex=e.laserT>0?1.5:Math.sin(t)*.8;r(g,2+ex,-8,2,2,p.eye);if(p.crown)crownAt(g,-3,-15,6)}
function quadDraw(g,e,p){const sw=Math.sin(e.anim)*.7,lift=e.charge>0?-1.5:0;
  limb(g,-6,-6,2.4,6,sw,p.bodyD);limb(g,5,-6,2.4,6,-sw,p.bodyD);
  r(g,-9,-12+lift,16,7,p.body);r(g,-9,-12+lift,16,1.5,p.hair);
  if(p.shell){r(g,-10,-15+lift,18,6,p.shell);r(g,-10,-15+lift,18,1.5,'rgba(255,255,255,.15)');r(g,-1,-15+lift,1,6,'rgba(0,0,0,.3)')}
  if(p.saddle){r(g,-4,-14+lift,7,2.5,'#5a3a1e');r(g,-3,-15.5+lift,2,2,'#8a6a3a')}
  if(p.armor){r(g,-9,-12+lift,16,3,p.armor);r(g,-9,-9+lift,16,1,'#8a6a10')}
  if(p.banner){r(g,-8,-22+lift,1,10,'#5a3a1e');r(g,-7,-22+lift,5,6,'#2a2a2a');r(g,-6,-20+lift,3,2,'#e8b830')}
  if(p.antenna){r(g,8,-20+lift,1,5,p.antenna);r(g,10,-19+lift,1,4,p.antenna)}
  limb(g,-6,-6,2.4,6,-sw,p.body);limb(g,5,-6,2.4,6,sw,p.body);
  r(g,6,-14+lift,6,7,p.body);r(g,6,-14+lift,6,1.5,p.hair);r(g,11,-11+lift,3,3,p.snout);r(g,9,-12+lift,1.5,1.5,p.eye);
  if(p.tusk){r(g,11,-9+lift,1,p.bigTusk?3.5:2,p.tusk);r(g,13,-9+lift,1,p.bigTusk?3.5:2,p.tusk)}
  if(p.horns){r(g,6,-17+lift,1.5,3,'#e8e0d0');r(g,10,-17+lift,1.5,3,'#e8e0d0')}
  if(p.rot)r(g,-4,-11+lift,3,2,'#e8e0d0');if(p.crown)crownAt(g,6.5,-16.5+lift,5)}
function cubetDraw(g,e,p){const t=e.t,ga=g.globalAlpha;
  const n=p.jelly?6:5;for(let i=0;i<n;i++){const x=-6+i*12/(n-1),sw=Math.sin(t*3+i)*1.6;g.strokeStyle=FL||p.tent;g.lineWidth=p.jelly?1:1.4;g.beginPath();g.moveTo(x,-5);g.quadraticCurveTo(x+sw,0,x+sw*1.5,5+(i%2)*2);g.stroke()}
  if(p.cloak){r(g,-8,-8,16,4,p.cloak);for(let i=0;i<4;i++)r(g,-8+i*4.5,-4,3,3+i%2*2,p.cloak)}
  if(p.jelly){g.globalAlpha=ga*.9}
  r(g,-6,-17,12,12,p.body);r(g,-6,-17,12,2,p.bodyD);r(g,-6,-7,12,2,p.bodyD);g.globalAlpha=ga;
  if(p.band)r(g,-6,-8,12,2,p.band);
  if(p.jelly){glowAt(g,0,-11,16,p.crown?TX.glowP:TX.glowC,.7);r(g,-2,-13,4,4,p.core)}
  else if(p.oneEye){r(g,-1,-14,4,4,p.eye);r(g,1,-13,1.4,2,'#fff')}
  else{const blink=e.atkCd<.6&&p.mouth;r(g,1,-13,2,blink?2:1,p.eye);r(g,-2.5,-13,2,blink?2:1,p.eye);if(p.mouth)r(g,-1,-9,3,blink?2:1,'#3a3a3a');if(p.tears){r(g,1.5,-11.5,.8,2,'#c8d8e8');r(g,-2,-11.5,.8,2,'#c8d8e8')}}
  if(p.antenna){r(g,-5,-22,1,5,p.antenna);r(g,4,-22,1,5,p.antenna)}
  if(p.crown)crownAt(g,-3.5,-19,7)}
function shulkerDraw(g,e,p){const op=e.shellOpen?1:0,lid=op?-4:0;
  r(g,-7,-8,14,8,p.shell);r(g,-7,-8,14,1.5,p.shellL);
  if(op){r(g,-4,-11,8,4,p.head);r(g,-2.5,-10,1.5,1.5,p.eye);r(g,1,-10,1.5,1.5,p.eye)}
  r(g,-7,-15+lid,14,7,p.shell);r(g,-7,-15+lid,14,1.5,p.shellL);r(g,-7,-9+lid,14,1,'rgba(0,0,0,.3)');if(p.crown)crownAt(g,-3,-17+lid,6)}
function flyerDraw(g,e,p){const f=Math.sin(e.t*(p===PAL.dragonfly?40:p===PAL.phantom?7:12)),moth=!!p.pattern;
  g.fillStyle=FL||p.wing;
  if(p===PAL.phantom){g.beginPath();g.moveTo(-6,-6);g.lineTo(-2,-14-f*5);g.lineTo(3,-6);g.closePath();g.fill();g.beginPath();g.moveTo(-6,-4);g.lineTo(-2,4+f*5);g.lineTo(3,-4);g.closePath();g.fill()}
  else{const wl=moth?7:9;g.beginPath();g.ellipse(-1,-9-f*1.5,wl,3.2,-.3-f*.3,0,TAU);g.fill();g.beginPath();g.ellipse(-1,-1+f*1.5,wl,3.2,.3+f*.3,0,TAU);g.fill();
    if(moth){r(g,-4,-10,2,1,p.pattern);r(g,-4,-2,2,1,p.pattern)}}
  r(g,-9,-6,14,3,p.body);r(g,-9,-6,14,1,p.bodyD);r(g,4,-7,4,4,p.body);r(g,6,-6.5,1.5,1.5,p.eye);
  if(p===PAL.phantom){r(g,-12,-5.5,3,2,p.body);r(g,-1,-7,1,1,p.bone)}
  if(moth){r(g,7,-9,1,3,p.bone);r(g,8,-10,1,2,p.bone)}if(p.crown)crownAt(g,4,-9.5,4)}
function striderDraw(g,e,p){const sw=Math.sin(e.anim)*.6,cold=!e.onLava;
  limb(g,-2,-7,2,7,sw,cold?p.cold:p.leg);limb(g,2,-7,2,7,-sw,cold?p.cold:p.leg);
  r(g,-5,-16,10,9,cold?p.cold:p.body);r(g,-5,-16,10,1.5,p.bodyD);for(let i=0;i<4;i++)r(g,-4+i*2.6,-19+Math.sin(e.t*4+i),.8,3,p.hair);
  r(g,1,-13,1.5,1.5,p.eye);r(g,3,-13,1.5,1.5,p.eye);
  if(e.rider){g.save();g.translate(0,-15);g.scale(.8,.8);humanoid(g,e,PAL.piglin,G.time);g.restore()}
  if(cold&&((e.t*10)|0)%2)g.translate(.5,0)}
function witherDraw(g,e,p){const t=e.t,b=Math.sin(t*2)*1;
  r(g,-1,-14+b,2,12,p.boneD);for(let i=0;i<3;i++)r(g,-4,-12+i*2.5+b,8,1,p.bone);r(g,-1,-3+b,2,6,p.boneD);r(g,-2,2+b,1.5,3,p.boneD);
  r(g,-9,-16+b,18,2,p.bone);
  const head=(x,y,s)=>{r(g,x-s/2,y-s,s,s,p.bone);r(g,x-s/2,y-s,s,s*.2,p.boneD);r(g,x-s*.25,y-s*.6,s*.18,s*.18,p.eye);r(g,x+s*.1,y-s*.6,s*.18,s*.18,p.eye);r(g,x-s*.25,y-s*.25,s*.5,s*.1,p.boneD)};
  head(-7,-15+b,4.5);head(7,-15+b,4.5);head(0,-17+b,6.5);
  if(e.shieldOn){g.strokeStyle='rgba(170,170,255,.6)';g.lineWidth=1;g.beginPath();g.arc(0,-10,13,0,TAU);g.stroke();g.fillStyle=p.shield;g.fill()}}
function wardenDraw(g,e,p){const sw=Math.sin(e.anim)*.4,pa=e.punch>0?Math.sin(e.punch/.35*Math.PI):0,beat=(Math.sin(G.time*(e.anger?8:3))+1)/2;
  const em=e.emergeT>0?clamp(e.emergeT/2.5,0,1):0;g.save();g.translate(0,em*30);
  limb(g,-1.5,-8,3.6,8,-sw,p.bodyD);limb(g,1.5,-8,3.6,8,sw,p.body);
  limb(g,-3,-21,3.2,12,-sw*.6,p.bodyD);
  r(g,-6,-23,12,15,p.body);r(g,-6,-23,2,15,p.bodyD);
  r(g,-4,-21,8,8,p.rib);for(let i=0;i<3;i++)r(g,-4,-20+i*2.6,8,1,p.bodyD);
  g.globalAlpha*=.6+beat*.4;r(g,-2.5,-19,2,2.5,p.soul);r(g,.8,-17,2,2.5,p.soul);r(g,-1,-14.5,2,2,p.soul);g.globalAlpha=1;
  r(g,-5,-31,10,8,p.body);r(g,-5,-31,10,1.5,p.bodyD);r(g,-3,-25,6,1.5,p.bodyD);
  const hl=p.bigHorn?7:5;r(g,-7,-35,2,hl,p.horn);r(g,5,-35,2,hl,p.horn);r(g,-6.5,-34,1,hl-2,p.glow);r(g,5.5,-34,1,hl-2,p.glow);
  if(p.crown)crownAt(g,-3,-33,6);
  limb(g,3,-21,3.2,12,sw*.6-pa*1.6,p.body);
  glowAt(g,0,-18,22,TX.glowC,.25+beat*.3);g.restore()}
function creakingDraw(g,e,p){const sw=Math.sin(e.anim)*.5,frozen=e.gazed||e.twitchT>0,eyeC=frozen?p.eyeOff:p.eye,tw=e.twitchT>0?rand(-1,1):0;
  g.save();g.translate(tw,0);
  limb(g,-1.2,-10,2.2,10,frozen?.1:-sw,p.barkD);limb(g,1.2,-10,2.2,10,frozen?-.1:sw,p.bark);
  r(g,-3,-24,6,14,p.bark);r(g,-3,-24,1.5,14,p.barkD);r(g,-1,-20,1,8,p.barkD);r(g,1,-16,1,5,p.barkD);
  limb(g,-2,-23,1.8,14,frozen?.25:-sw*.5+.15,p.barkD);
  r(g,-4,-32,8,8,p.bark);r(g,-4,-32,8,2,p.moss);r(g,-4.5,-29,1.5,5,p.moss);r(g,3,-31,1.5,3,p.moss);
  r(g,-2,-28.5,1.6,1.6,eyeC);r(g,1.2,-28.5,1.6,1.6,eyeC);if(p.extraEye)r(g,-.4,-26,1.4,1.4,eyeC);
  if(!frozen)glowAt(g,0,-28,10,TX.glowO,.5);
  r(g,-5,-35,1.2,4,p.barkD);r(g,2,-36,1.2,5,p.barkD);r(g,3,-37,2,1,p.barkD);
  limb(g,2,-23,1.8,16,frozen?-.3:sw*.5-.2,p.bark);if(p.crown)crownAt(g,-3,-34,6);g.restore()}
function seedlingDraw(g,e,p){const hop=Math.abs(Math.sin(e.anim*1.2))*1.5,sw=Math.sin(e.anim)*.6;
  limb(g,-3,-3,2.2,3,sw,p.botD);limb(g,3,-3,2.2,3,-sw,p.botD);
  r(g,-6,-8-hop,12,5,p.bot);r(g,-6,-8-hop,2,5,p.botD);r(g,-6,-13-hop,12,6,p.top);r(g,-6,-13-hop,2,6,p.topD);
  r(g,-3.5,-11-hop,2,2,'#fff');r(g,2,-11-hop,2,2,'#fff');r(g,-3,-10.5-hop,1.2,1.5,p.eye);r(g,2.5,-10.5-hop,1.2,1.5,p.eye);
  r(g,-4,-17-hop,2,4,p.leaf);r(g,-5,-18-hop,2,2,p.leaf);r(g,4,-15-hop,3,2,p.leaf)}
function sentinelDraw(g,e,p){const sw=Math.sin(e.anim)*.5,shake=e.atkCd<.8?Math.sin(e.t*30)*1:0;
  limb(g,-2,-7,2.6,7,sw,p.leg);limb(g,2,-7,2.6,7,-sw,p.leg);
  g.save();g.translate(shake,0);r(g,-9,-17,18,8,p.top);r(g,-9,-17,18,2,p.topD);r(g,-9,-10,18,2,p.band);
  r(g,-5,-14,2,1.5,p.eye);r(g,4,-14,2,1.5,p.eye);
  for(let i=0;i<3;i++){r(g,-12,-15+i*2.4,3,1,p.frill);r(g,9,-15+i*2.4,3,1,p.frill)}g.restore()}
function hunterDraw(g,e,p){const sw=Math.sin(e.anim)*.8,lunge=e.punch>0?3:0;
  limb(g,-4,-6,1.6,6,sw,p.bodyD);limb(g,3,-6,1.6,6,-sw,p.bodyD);
  r(g,-7,-10,12,5,p.body);r(g,-7,-10,12,1,p.bodyD);
  r(g,4+lunge,-13,7,5,p.body);r(g,9+lunge,-11,3,2,p.claw);
  for(let i=0;i<3;i++)r(g,5+lunge+i*2,-16-i,1,4,p.glow);
  limb(g,-4,-6,1.6,6,-sw,p.body);limb(g,3,-6,1.6,6,sw,p.body);glowAt(g,6,-14,10,p===PAL.stalker?TX.glowP:TX.glowC,.35)}
function bearerDraw(g,e,p){const sw=Math.sin(e.anim)*.5;
  for(let i=0;i<3;i++){limb(g,-6+i*5,-5,1.8,5,sw*(i%2?1:-1),'#0a2028')}
  r(g,-9,-11,18,7,'#0f333d');r(g,-9,-11,18,1.5,'#14505a');
  r(g,-6,-19,12,8,'#e8e2c8');r(g,-6,-19,12,2,'#fff8e0');r(g,-4,-16,8,4,'#0b2a33');glowAt(g,0,-16,16,TX.glowC,.45+.2*Math.sin(e.t*3));r(g,-2,-15,4,2,'#29dfeb');
  r(g,8,-10,4,4,'#0f333d');r(g,10,-9,1,1,'#29dfeb');if(e.grow)g.scale(1,1)}
function shriekerwDraw(g,e,p){const sw=Math.sin(e.anim)*.6,sh=e.shriekT>0;
  limb(g,-3,-6,2,6,sw,'#0a2028');limb(g,3,-6,2,6,-sw,'#0a2028');limb(g,-6,-6,2,6,-sw,'#0a2028');limb(g,6,-6,2,6,sw,'#0a2028');
  r(g,-7,-12,14,7,'#0e333d');r(g,-7,-12,14,1.5,'#0b2a33');
  r(g,-6,-15-(sh?2:0),12,3,'#e8e2c8');r(g,-6,-15-(sh?2:0),12,1,'#fff8e0');r(g,-4,-13,8,1,'#2a4a4a');
  if(sh){g.strokeStyle='rgba(120,240,255,.7)';g.lineWidth=1;for(let i=0;i<3;i++){g.beginPath();g.arc(0,-16,4+((G.time*20+i*5)%14),Math.PI*1.1,Math.PI*1.9);g.stroke()}}}
function breezeDraw(g,e,p){const t=e.t;g.strokeStyle=FL||'rgba(200,210,255,.8)';g.lineWidth=1.4;
  for(let i=0;i<3;i++){g.beginPath();g.ellipse(0,-3-i*3,5-i*1.2,1.6,0,t*6+i,t*6+i+4.5);g.stroke()}
  for(let i=0;i<3;i++){const an=t*4+i*TAU/3;r(g,Math.cos(an)*5-.6,-14+Math.sin(an),1.2,4,'#a8b8f0')}
  r(g,-3.5,-20,7,6,'#c8d0f8');r(g,-3.5,-20,7,1.5,'#9aa8e8');r(g,.5,-18,2,1.5,'#3a3a8a');r(g,-2,-18,1.5,1.5,'#3a3a8a')}
function monarchDraw(g,e,p){const sw=Math.sin(e.anim)*.4,ga=g.globalAlpha;
  for(let i=0;i<4;i++){const x=-5+i*2.4,len=12+Math.sin(e.t*3+i)*2;r(g,x,-12,2,len,i%2?p.cape:p.capeD)}
  limb(g,-1.2,-12,2.2,12,-sw,p.bodyD);limb(g,1.2,-12,2.2,12,sw,p.body);
  r(g,-3,-25,6,13,p.body);r(g,-3,-25,1.5,13,p.bodyD);
  r(g,-3,-31,6,6,p.body);r(g,-1,-29,3,1,p.eye);
  r(g,-4,-37,1.4,6,p.horn);r(g,-5.5,-35,1.4,2,p.horn);r(g,3,-37,1.4,6,p.horn);r(g,4.3,-35,1.4,2,p.horn);
  g.save();g.translate(2,-22);g.rotate(-.7+sw*.3);r(g,-.6,-13,1.2,14,'#4a7a7a');r(g,-.4,-13,.6,14,'#9af0e0');g.restore();
  if(p.cape.startsWith('#'))glowAt(g,0,-8,16,TX.glowC,.3);g.globalAlpha=ga}
function monstroDraw(g,e,p){const sw=Math.sin(e.anim)*.4,pa=e.punch>0?Math.sin(e.punch/.35*Math.PI):0;
  limb(g,-4,-8,3.4,8,-sw,p.bodyD);limb(g,4,-8,3.4,8,sw,p.body);
  r(g,-8,-22,16,14,p.body);r(g,-8,-22,16,2,p.bodyD);for(let i=0;i<3;i++)r(g,-6,-19+i*3,12,1.2,p.bone);
  r(g,-4,-27,8,6,p.body);r(g,-2.5,-25,1.5,1.5,p.glow);r(g,1,-25,1.5,1.5,p.glow);
  limb(g,-9,-21,3.6,12,.3-sw*.4,p.bodyD);limb(g,9,-21,3.6,12,-.3+sw*.4-pa*1.4,p.body);
  for(const sx of[-10,8]){glowAt(g,sx+1,-26,14,TX.glowC,.8);for(let i=0;i<3;i++)r(g,sx+i,-26-((G.time*8+i)%4),1.2,2,p.fire)}
  r(g,-9,-23,3,3,p.bone);r(g,6,-23,3,3,p.bone)}
function echoGolemMob(g,e,p){drawEchoGolem(g,0,0,1,G.time,e.atkCd<.5,p.soul,p.body)}
function blubDraw(g,b,tint){const hop=Math.abs(Math.sin(b.t*4))*(b.moving?3:0);
  g.save();g.translate(0,-hop);r(g,-4,-1,2,1.5,'#9ad8f0');r(g,2,-1,2,1.5,'#9ad8f0');
  r(g,-5,-8,10,7,tint||'#7ab0e0');r(g,-5,-3,10,2,'#6ad0e0');r(g,-5,-8,10,1,'rgba(255,255,255,.25)');
  r(g,-3.5,-12,2,4,tint||'#7ab0e0');r(g,1.5,-12,2,4,tint||'#7ab0e0');r(g,-3,-11,1,2,'#5a90d0');r(g,2,-11,1,2,'#5a90d0');
  r(g,-3,-5.5,2,1,'#2a1a5a');r(g,1,-5.5,2,1,'#2a1a5a');r(g,-.5,-4,1.4,1,'#3a2a7a');g.restore()}
function singerDraw(g,x,y,t,s){g.save();g.translate(x,y);g.scale(s,s);const sing=Math.sin(t*2);
  glowAt(g,0,-16,40,TX.glowC,.35+.15*sing);
  r(g,-4,-2,3,2,'#e8dcc0');r(g,1,-2,3,2,'#e8dcc0');
  for(let i=0;i<5;i++)r(g,-6+i*2.6,-16,2.4,15,i%2?'#8ad8cc':'#a8e8dc');
  r(g,-5,-26,10,11,'#a8e8dc');for(let i=0;i<4;i++)r(g,-5+i*2.6,-16,2,2+(i%2),'#8ad8cc');
  r(g,-2.5,-23,5,5,'#e8e2d0');r(g,-1.5,-21.5,1,1,'#3a3a3a');r(g,.6,-21.5,1,1,'#3a3a3a');r(g,-.6,-19.5,1.2,.8,'#3a3a3a');
  r(g,-7,-33,1.5,7,'#efe6cc');r(g,-8.5,-31,1.5,2,'#efe6cc');r(g,5.5,-33,1.5,7,'#efe6cc');r(g,7,-31,1.5,2,'#efe6cc');
  if(sing>.3){for(let i=0;i<2;i++){const p=(t*.7+i*.5)%1;r(g,6+p*8,-26-p*14,2,2,`rgba(150,255,240,${1-p})`)}}
  g.restore()}
const EDRAW={
  hum:(g,e,t)=>humanoid(g,e,PAL[e.def.pal],t),skel:(g,e)=>skeletonDraw(g,e,PAL[e.def.pal]),spider:(g,e)=>spiderDraw(g,e,PAL[e.def.pal]),slime:(g,e)=>slimeDraw(g,e,PAL[e.def.pal]),
  witch:(g,e)=>witchDraw(g,e,PAL[e.def.pal]),bat:batDraw,vex:(g,e)=>vexDraw(g,e,PAL[e.def.pal]),wisp:(g,e)=>blazeDraw(g,e,PAL[e.def.pal]),blaze:(g,e)=>blazeDraw(g,e,PAL[e.def.pal]),
  dragon:(g,e)=>dragonDraw(g,e,PAL[e.def.pal]),creeper:(g,e)=>creeperDraw(g,e,PAL[e.def.pal]),ender:(g,e)=>enderDraw(g,e,PAL[e.def.pal]),worm:(g,e)=>wormDraw(g,e,PAL[e.def.pal]),
  guardian:(g,e)=>guardianDraw(g,e,PAL[e.def.pal]),quad:(g,e)=>quadDraw(g,e,PAL[e.def.pal]),cubet:(g,e)=>cubetDraw(g,e,PAL[e.def.pal]),shulker:(g,e)=>shulkerDraw(g,e,PAL[e.def.pal]),
  flyer:(g,e)=>flyerDraw(g,e,PAL[e.def.pal]),strider:(g,e)=>striderDraw(g,e,PAL[e.def.pal]),witherBoss:(g,e)=>witherDraw(g,e,PAL.witherBoss),warden:(g,e)=>wardenDraw(g,e,PAL[e.def.pal]),
  creaking:(g,e)=>creakingDraw(g,e,PAL[e.def.pal]),seedling:(g,e)=>seedlingDraw(g,e,PAL.seedling),sentinel:(g,e)=>sentinelDraw(g,e,PAL.sentinel),hunter:(g,e)=>hunterDraw(g,e,PAL[e.def.pal]),
  bearer:bearerDraw,shriekerw:shriekerwDraw,breeze:breezeDraw,monarch:(g,e)=>monarchDraw(g,e,PAL[e.def.pal]),monstro:(g,e)=>monstroDraw(g,e,PAL.monstrosity),echogolem:(g,e)=>echoGolemMob(g,e,PAL[e.def.pal]),
};
const PAL_IDX={};
function enemyScale(d){return(d.S||1.65)*(d.sz||1)}
/* ikon sığdırma için yaklaşık genişlik (yerel birim) */
const DRAW_W={dragon:50,spider:22,bat:20,quad:26,cubet:16,flyer:22,worm:20,guardian:24,shulker:16,sentinel:26,witherBoss:22,hunter:20,bearer:22,shriekerw:16,slime:12};
