/* ============================ DOKULAR ============================
   Tüm bloklar 16x16 piksel, kodla üretilir. TX[ad] = [varyant canvas'ları] */
const TX={};
function makeTex(seed,fn,w=16,h=16){const c=mkCanvas(w,h),g=c.getContext('2d');fn(g,mulberry32(seed),w,h);return c}
function speck(g,r,cols,pw=1.6){for(let y=0;y<16;y++)for(let x=0;x<16;x++){g.fillStyle=cols[Math.min(cols.length-1,Math.floor(Math.pow(r(),pw)*cols.length))];g.fillRect(x,y,1,1)}}
function dots(g,r,n,c){for(let i=0;i<n;i++)R(g,Math.floor(r()*16),Math.floor(r()*16),1,1,typeof c==='string'?c:c[Math.floor(r()*c.length)])}
function blockTex(base,mid,hi,lo){return(g,r)=>{R(g,0,0,16,16,base);for(let i=0;i<40;i++){g.fillStyle=r()<.5?mid:base;g.fillRect(1+Math.floor(r()*14),1+Math.floor(r()*14),1,1)}
  R(g,0,0,16,1,hi);R(g,0,0,1,16,hi);R(g,0,15,16,1,lo);R(g,15,0,1,16,lo);R(g,2,2,4,1,hi);R(g,2,3,2,1,hi);R(g,11,13,3,1,lo);R(g,13,11,1,3,lo)}}
function cobbleTex(g,r,cols=['#8a8a8a','#7a7a7a','#9b9b9b','#6e6e6e','#838383'],bg='#4f4f4f',hi='#a5a5a5',lo='#5c5c5c'){R(g,0,0,16,16,bg);
  for(let i=0;i<14;i++){const x=Math.floor(r()*16),y=Math.floor(r()*16),w=3+Math.floor(r()*4),h=2+Math.floor(r()*3),c=cols[Math.floor(r()*cols.length)];
    for(const ox of[0,-16])for(const oy of[0,-16]){R(g,x+ox,y+oy,w,h,c);R(g,x+ox,y+oy,w,1,hi);R(g,x+ox,y+oy+h-1,w,1,lo)}}}
function planksTex(cols=['#a2834f','#9a7b48','#ad8c56','#a48650'],line='#6b5430',dk='#8f7142',lt='#b8975f'){return(g,r)=>{
  for(let b=0;b<4;b++){const base=cols[b%cols.length];for(let y=0;y<4;y++)for(let x=0;x<16;x++){g.fillStyle=r()<.18?dk:(r()<.1?lt:base);g.fillRect(x,b*4+y,1,1)}
    R(g,0,b*4+3,16,1,line);const sx=(b*5+3)%16;R(g,sx,b*4,1,3,line)}}}
function oreTex(baseCols,oreCols){return(g,r)=>{speck(g,r,baseCols);for(let k=0;k<5;k++){const cx=1+Math.floor(r()*12),cy=1+Math.floor(r()*12);
  for(let i=0;i<4;i++){const x=cx+Math.floor(r()*3),y=cy+Math.floor(r()*3);R(g,x,y,1,1,oreCols[0]);if(r()<.5)R(g,x+1,y,1,1,oreCols[1]||oreCols[0])}
  R(g,cx,cy,1,1,oreCols[2]||oreCols[0])}}}
/* tuğla deseni: cols = tuğla renkleri, mortar = derz rengi */
function bricksTex(cols,mortar,bh=4,bw=8,hi){return(g,r)=>{R(g,0,0,16,16,mortar);
  for(let row=0;row<16/bh;row++){const off=row%2?bw/2:0;for(let bx=-1;bx<=16/bw;bx++){const x=bx*bw+off,y=row*bh;
    for(let yy=0;yy<bh-1;yy++)for(let xx=0;xx<bw-1;xx++){const px=x+xx,py=y+yy;if(px<0||px>15)continue;g.fillStyle=cols[Math.floor(r()*cols.length)];g.fillRect(px,py,1,1)}
    if(hi){for(let xx=0;xx<bw-1;xx++){const px=x+xx;if(px>=0&&px<16)R(g,px,y,1,1,hi)}}}}}}
function tilesTex(cols,mortar,s=4){return(g,r)=>{R(g,0,0,16,16,mortar);for(let y=0;y<16;y+=s)for(let x=0;x<16;x+=s){const c=cols[Math.floor(r()*cols.length)];R(g,x,y,s-1,s-1,c);R(g,x,y,s-1,1,'rgba(255,255,255,.08)')}}}
function logTex(cols,dark){return(g,r)=>{for(let x=0;x<16;x++){const c=cols[Math.floor(r()*cols.length)];for(let y=0;y<16;y++){g.fillStyle=r()<.2?dark:c;g.fillRect(x,y,1,1)}}for(let i=0;i<4;i++)R(g,Math.floor(r()*16),0,1,16,dark)}}
function leavesTex(cols,holes){return(g,r)=>{speck(g,r,cols,1.2);if(holes)dots(g,r,holes,'rgba(0,0,0,.35)')}}
const STONE=['#7f7f7f','#767676','#8a8a8a','#6b6b6b','#939393'];
const NRACK=['#6e2b2b','#7c3333','#612323','#8a3c3c','#542020'];
const ESTONE=['#dde0a6','#d2d69a','#e6e9b6','#c7cb8c'];
const DEEPS=['#4b4b52','#43434a','#55555b','#3b3b41'];
function buildTextures(){
  const V=(name,n,fn)=>{TX[name]=[];for(let i=0;i<n;i++)TX[name].push(makeTex(hashStr(name)+i*977,typeof fn==='function'?fn:(g,r)=>speck(g,r,fn)))};
  /* ----- Overworld ----- */
  V('grass',4,(g,r)=>{speck(g,r,['#5d9b3a','#538f33','#67a842','#4a822d','#76b84d']);dots(g,r,7,'#86cf5a')});
  V('dirt',3,['#866043','#77553a','#96704d','#5f432c']);
  V('path',4,(g,r)=>{speck(g,r,['#a08458','#94784e','#ad9165','#86693f','#b89c6e']);dots(g,r,5,['#7d7466','#c9bc9f'])});
  V('sand',3,['#dccf91','#d3c582','#e5d9a2','#c8b976']);
  V('sandpath',3,(g,r)=>{speck(g,r,['#c9a66b','#bd9a5f','#d4b27a','#b08a52']);dots(g,r,4,'#9a7a4a')});
  V('snow',3,['#f3f7fa','#e8eff5','#ffffff','#dbe5ee']);
  V('snowpath',3,['#b5c2cd','#a7b5c2','#c4cfd9','#96a4b1','#d4dde5']);
  V('powder',2,(g,r)=>{speck(g,r,['#f8fbff','#eef4fb','#ffffff'],1);dots(g,r,14,'#d8e6f4')});
  V('ice',2,(g,r)=>{speck(g,r,['#9fc6f2','#93bcee','#acd0f6'],1.2);g.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<3;i++){const x=Math.floor(r()*16),y=Math.floor(r()*16);for(let k=0;k<5;k++)g.fillRect((x+k)%16,(y+k)%16,1,1)}});
  V('stone',3,STONE);
  V('cobble',2,(g,r)=>cobbleTex(g,r));
  V('mossy',1,(g,r)=>{cobbleTex(g,r);dots(g,r,30,['#4a7a2a','#5a8f35'])});
  V('sbricks',1,bricksTex(['#7a7a7a','#838383','#727272'],'#4a4a4a',8,8,'#9a9a9a'));
  V('gravel',3,(g,r)=>speck(g,r,['#857f7c','#6f6a68','#9a9390','#5e5856','#a8a19c'],1));
  V('deep',3,DEEPS);
  V('cdeep',2,(g,r)=>cobbleTex(g,r,['#545459','#4a4a50','#5e5e64','#404046'],'#2a2a2f','#6a6a70','#333338'));
  V('dtiles',2,tilesTex(['#3a3a40','#36363c','#424248','#2f2f35'],'#1f1f24',4));
  V('dbricks',2,bricksTex(['#46464c','#4e4e54','#3e3e44'],'#232328',4,8,'#5a5a60'));
  V('pdeep',1,blockTex('#4a4a50','#45454b','#5a5a60','#2f2f34'));
  V('reinforced',1,(g,r)=>{R(g,0,0,16,16,'#3a4a4a');tilesTex(['#46564f','#3e4e48','#4e5e58'],'#20302c',8)(g,r);R(g,3,3,10,10,'#2a3a38');R(g,5,5,6,6,'#5ab8a8');R(g,6,6,4,4,'#c8e8d0');R(g,7,7,2,2,'#2a3a38')});
  V('mud',2,(g,r)=>{speck(g,r,['#3c3a3e','#46424a','#353338','#4e4a52']);dots(g,r,6,'#5a5662')});
  V('swampgrass',3,(g,r)=>{speck(g,r,['#4c6a2c','#557530','#435f27','#5f7f37','#3a5522']);dots(g,r,6,'#6a8a3a')});
  V('mangrove',1,(g,r)=>{speck(g,r,['#4a3a2a','#3f3124','#55432f']);g.strokeStyle='#6a4a30';g.lineWidth=1;for(let i=0;i<5;i++){g.beginPath();const x=r()*16;g.moveTo(x,0);g.lineTo(x+r()*6-3,16);g.stroke()}});
  V('seabed',3,(g,r)=>{speck(g,r,['#a89e72','#9c9268','#b2a87c','#8a8260']);dots(g,r,8,['#6e7b70','#c6bc90'])});
  V('prismarine',2,(g,r)=>{speck(g,r,['#5fa59a','#6bb3a4','#4f9488','#77c0ae','#5aa08f'],1.1);dots(g,r,10,'#8ad4c0')});
  V('pbricks',1,bricksTex(['#6dbaa8','#63ae9d','#78c4b2'],'#3f7f72',4,8,'#94dccb'));
  V('dprism',1,tilesTex(['#335b4c','#2c5243','#3a6455'],'#1a3a30',8));
  V('sealantern',1,(g,r)=>{R(g,0,0,16,16,'#bfd8d0');tilesTex(['#e8f8f0','#d8f0e8','#f4fffa'],'#9ec0b6',4)(g,r);R(g,6,6,4,4,'#ffffff')});
  V('sponge',1,(g,r)=>{speck(g,r,['#a6a23a','#b4b048','#97932e']);dots(g,r,18,'#6c6a1c')});
  V('podzol',2,(g,r)=>{speck(g,r,['#5a3e22','#6a4a2a','#4e351c','#7a5a32']);dots(g,r,10,'#3a5a20')});
  V('darkgrass',3,(g,r)=>{speck(g,r,['#3f6a2a','#365e24','#47762f','#2e5220']);dots(g,r,5,'#5a8a3a')});
  V('dirtpath',3,(g,r)=>{speck(g,r,['#947a46','#8a7040','#9e844f','#7d6538']);dots(g,r,5,'#6a5a30')});
  V('planks',1,planksTex());
  V('darkplanks',1,planksTex(['#4a321a','#42301a','#523a20','#3d2a16'],'#2a1a0c','#362412','#5a4026'));
  V('dripstone',1,(g,r)=>{speck(g,r,['#866b5c','#7a6152','#937868','#6d5649']);for(let i=0;i<4;i++)R(g,Math.floor(r()*16),0,1,16,'rgba(60,40,30,.25)')});
  V('moss',2,(g,r)=>{speck(g,r,['#5a7a2a','#4f6e24','#678a31','#476420'],1.2);dots(g,r,8,'#7aa03a')});
  V('calcite',1,['#e2e3dd','#d6d7d1','#ececea','#cfd0ca']);
  V('leaves',3,leavesTex(['#3f7f22','#356f1c','#4b9128','#2a5a15','#58a030']));
  V('darkleaves',2,leavesTex(['#2e5a1a','#264e15','#376821','#1e4010'],6));
  V('spruce',2,leavesTex(['#2f5a32','#284f2b','#376638','#1f4022']));
  V('cactus',1,(g,r)=>{speck(g,r,['#4f8f2f','#45822a','#5aa036']);for(let y=1;y<16;y+=4)for(let x=1;x<16;x+=4)R(g,x+(y%8?2:0),y,1,1,'#d8e8b0')});
  V('log',1,(g,r)=>{speck(g,r,['#6b5233','#5f472b','#76603c']);g.strokeStyle='#a2834f';g.lineWidth=1;g.strokeRect(3.5,3.5,9,9);g.strokeRect(6.5,6.5,3,3)});
  /* Solgun Bahçe */
  V('palegrass',3,(g,r)=>{speck(g,r,['#8a9384','#7f887a','#949d8d','#77806f','#9ea795']);dots(g,r,6,'#b0b8a6')});
  V('palemoss',2,(g,r)=>{speck(g,r,['#b8bdb1','#aeb3a6','#c2c7bb','#a3a89b'],1.1);dots(g,r,10,'#d0d4c8')});
  V('palelog',1,logTex(['#d8d2cc','#cfc8c1','#e2dcd6','#c4bdb5'],'#7a726c'));
  V('paleleaves',2,leavesTex(['#c8ccbf','#bcc0b2','#d2d6ca','#aeb2a4'],5));
  V('resinb',1,bricksTex(['#d8641c','#e0742a','#cc5812'],'#7a3008',4,8,'#f09040'));
  V('resin',1,(g,r)=>{speck(g,r,['#e07820','#d86a14','#ec8a30','#c85a0c'],1.2);dots(g,r,6,'#ffb060')});
  /* Karanlık Derinlikler */
  V('sculk',3,(g,r)=>{speck(g,r,['#0b2a33','#0e333d','#082128','#103a44','#06181d'],1.3);dots(g,r,7,['#1a8a96','#29dfeb'])});
  V('sculkpath',3,(g,r)=>{cobbleTex(g,r,['#3e4248','#363a40','#464a50','#2f3338'],'#1c1e22','#555a60','#25282c');dots(g,r,6,'#0e4a55')});
  /* cevherler ve değerli bloklar */
  V('iron',1,blockTex('#d8d8d8','#c4c4c4','#f6f6f6','#9a9a9a'));
  V('gold',1,blockTex('#f5d63a','#e6c22a','#fff6a0','#b08a10'));
  V('diamond',1,blockTex('#62e6ee','#46d2da','#d2fdff','#2a9aa2'));
  V('emeraldb',1,blockTex('#2fd15a','#22b94b','#a5f7b8','#127a32'));
  V('netherite',1,(g,r)=>{blockTex('#4a4248','#3f383d','#6a6068','#2a2428')(g,r);dots(g,r,8,'#5e4e60');R(g,3,3,2,1,'#8a7090')});
  V('glowstone',1,(g,r)=>{speck(g,r,['#c9a24a','#e8c062','#fbe19a','#a07a2a','#fff2c0'],1)});
  V('ore_coal',1,oreTex(STONE,['#2b2b2b','#1a1a1a','#444']));
  V('ore_iron',1,oreTex(STONE,['#d8af93','#c59478','#f0cdb5']));
  V('ore_gold',1,oreTex(STONE,['#fcee4b','#d8b520','#fffbb0']));
  V('ore_redstone',1,oreTex(STONE,['#e01010','#a00000','#ff6a6a']));
  V('ore_diamond',1,oreTex(STONE,['#5decf5','#2ab8c2','#d0ffff']));
  V('ore_emerald',1,oreTex(STONE,['#17dd62','#0a9a3a','#a8ffc8']));
  V('ore_quartz',1,oreTex(NRACK,['#ece6dc','#c8c0b0','#ffffff']));
  V('ore_ngold',1,oreTex(NRACK,['#fcee4b','#d8b520','#fffbb0']));
  V('ore_dgold',1,oreTex(DEEPS,['#fcee4b','#d8b520','#fffbb0']));
  V('ore_ddiamond',1,oreTex(DEEPS,['#5decf5','#2ab8c2','#d0ffff']));
  V('debris',1,(g,r)=>{speck(g,r,['#5e4440','#4e3834','#6a504a','#3e2c28']);for(let i=0;i<5;i++){const x=Math.floor(r()*13),y=Math.floor(r()*13);g.strokeStyle='#8a6a5e';g.lineWidth=1;g.strokeRect(x+.5,y+.5,3,3)}});
  V('amethyst',1,(g,r)=>{speck(g,r,['#8a5ac8','#7a4ab8','#a070dc','#6a3aa6','#b88aec'],1);dots(g,r,6,'#e0c8ff')});
  /* ----- Nether ----- */
  V('netherrack',3,NRACK);
  V('nbricks',1,bricksTex(['#3e1c22','#46222a','#36161c'],'#1a0a0e',4,8,'#5a2a32'));
  V('rnbricks',1,bricksTex(['#5e0a0a','#6a1010','#520606'],'#2a0202',4,8,'#7a1a1a'));
  V('crimson',3,(g,r)=>{speck(g,r,['#8a1818','#9a2020','#7a1212','#a82a2a','#6a0e0e'],1.2);dots(g,r,6,'#c84040')});
  V('warped',3,(g,r)=>{speck(g,r,['#14796e','#168a7d','#0f6a60','#1c9a8c','#0b5a52'],1.2);dots(g,r,6,'#2ac8b4')});
  V('cstem',1,logTex(['#7a2a4a','#6a2240','#8a3456','#5e1c38'],'#3a0e22'));
  V('wstem',1,logTex(['#2a6a6a','#225e5e','#327676','#1c5252'],'#0e3434'));
  V('nwart',1,leavesTex(['#7a0a0a','#8a1212','#6a0606','#9a1a1a'],4));
  V('wwart',1,leavesTex(['#16857a','#128070','#1c9a8c','#0e6a60'],4));
  V('shroom',1,(g,r)=>{speck(g,r,['#f09a3a','#ffb050','#e88a2a','#ffc870'],1);for(let i=0;i<4;i++)R(g,Math.floor(r()*14),Math.floor(r()*14),3,3,'#fff0b0')});
  V('soulsand',3,(g,r)=>{speck(g,r,['#5a4436','#4e3a2e','#66503f','#433228']);for(let i=0;i<3;i++){const x=Math.floor(r()*12),y=Math.floor(r()*12);R(g,x,y,3,1,'#2e221a');R(g,x+1,y+1,1,1,'#2e221a');R(g,x+3,y+1,1,1,'#2e221a')}});
  V('soulsoil',3,['#4a3a2e','#423328','#544336','#3a2d23']);
  V('basalt',2,(g,r)=>{speck(g,r,['#4e4e56','#45454d','#58585f','#3e3e45']);g.strokeStyle='rgba(20,20,26,.55)';g.lineWidth=1;g.strokeRect(2.5,2.5,11,11);g.strokeRect(5.5,5.5,5,5)});
  V('pbasalt',1,(g,r)=>{for(let x=0;x<16;x++){const c=['#5a5a62','#52525a','#62626a'][Math.floor(r()*3)];R(g,x,0,1,16,c)}for(let i=0;i<3;i++)R(g,Math.floor(r()*16),0,1,16,'#3e3e46')});
  V('blackstone',3,['#2b2529','#342e33','#231e22','#3d363c','#48404a']);
  V('pbsb',1,bricksTex(['#38323a','#302a32','#403a42'],'#18141a',4,8,'#4a444c'));
  V('gilded',1,(g,r)=>{speck(g,r,['#2b2529','#342e33','#231e22','#3d363c']);dots(g,r,14,['#fcd04a','#e8a820','#fff0a0'])});
  V('magma',1,(g,r)=>{speck(g,r,['#5a1a06','#6a2408','#4a1404'],1.2);for(let i=0;i<6;i++){const x=Math.floor(r()*14),y=Math.floor(r()*14);R(g,x,y,2+Math.floor(r()*3),1,'#ff7a1a');R(g,x+1,y,1,1,'#ffd040')}});
  V('cryobs',1,(g,r)=>{speck(g,r,['#15101f','#1d1530','#100b18','#2a1d45'],1.3);dots(g,r,10,['#8a3aff','#c070ff'])});
  V('bonebk',1,(g,r)=>{speck(g,r,['#e6e0c8','#ddd6bc','#ece8d4','#d2cab0'],1);R(g,0,0,16,2,'#c8c0a4');R(g,0,14,16,2,'#c8c0a4')});
  /* ----- End ----- */
  V('endstone',3,(g,r)=>{speck(g,r,ESTONE);dots(g,r,6,'#b6ba7a')});
  V('esbricks',1,bricksTex(['#e2e6ac','#dadea2','#eaeeb8'],'#a8ac72',4,8,'#f4f8c8'));
  V('purpur',1,tilesTex(['#a97aa8','#a072a0','#b282b0','#9a6a9a'],'#6e486e',4));
  V('purpill',1,(g,r)=>{for(let x=0;x<16;x++){const c=['#aa7caa','#a274a2','#b486b4'][Math.floor(r()*3)];R(g,x,0,1,16,c)}R(g,0,0,1,16,'#7a547a');R(g,15,0,1,16,'#7a547a');R(g,7,0,2,16,'#c49cc4')});
  V('obsidian',2,(g,r)=>{speck(g,r,['#15101f','#1d1530','#100b18','#2a1d45'],1.3);dots(g,r,4,'#6a44a8')});
  V('endmoss',3,(g,r)=>{speck(g,r,['#3aa88a','#349a7e','#42b896','#2c8a70','#4ec8a4'],1.2);dots(g,r,6,'#8affd8')});
  V('lavstone',3,(g,r)=>{speck(g,r,['#8a6ab0','#7e60a4','#9676bc','#70549a']);dots(g,r,5,'#c0a0e8')});
  V('amberst',3,(g,r)=>{speck(g,r,['#c87a2a','#b86e22','#d88a34','#a8621c']);dots(g,r,6,'#ffc060')});
  V('umbral',3,(g,r)=>{speck(g,r,['#2a2236','#241d2f','#30283e','#1e1828'],1.3);dots(g,r,4,'#5a3a8a')});
  V('jade',3,(g,r)=>{speck(g,r,['#3a8aa0','#348096','#4298ae','#2c7488']);dots(g,r,5,'#8ad8e8')});
  V('painted',3,(g,r)=>{const L=['#d8a05a','#c87a4a','#e8c87a','#a8584a','#e0b070'];for(let y=0;y<16;y++){const c=L[(y>>1)%L.length];for(let x=0;x<16;x++){g.fillStyle=r()<.15?'#8a4a3a':c;g.fillRect(x,y,1,1)}}});
  V('starice',2,(g,r)=>{speck(g,r,['#b8d8ff','#a8ccf8','#c8e4ff','#9ac0f0'],1.1);dots(g,r,6,'#ffffff');g.fillStyle='rgba(255,255,255,.5)';for(let k=0;k<6;k++)g.fillRect(3+k,3+k,1,1)});
  V('chorus',1,(g,r)=>{speck(g,r,['#5a3a6a','#4e3060','#664476','#3e2650']);dots(g,r,6,'#8a6a9a')});
  V('chorusfl',1,(g,r)=>{speck(g,r,['#b48ac0','#a87cb4','#c09ccc','#9a6ea8'],1);dots(g,r,6,'#e8d0f0')});
  V('crystalb',1,(g,r)=>{speck(g,r,['#a8d8ff','#f0a8e8','#c8c0ff','#90c8f8'],1);dots(g,r,8,'#ffffff')});
  V('glowcap',1,(g,r)=>{speck(g,r,['#3ad8c8','#2ac0b0','#4ae8d8','#20a898'],1);dots(g,r,10,'#c8fff4')});
  V('lanternleaf',1,leavesTex(['#3a6a5a','#32604f','#427866','#2a5244'],3));
  V('ore_ender',1,oreTex(ESTONE,['#1aa888','#0a6a5a','#7affe0']));
  V('ore_amber',1,oreTex(ESTONE,['#ffa020','#c86a0a','#ffe080']));
  /* ----- Sift ----- */
  V('siftgrass',4,(g,r)=>{speck(g,r,['#f08a84','#e87a76','#f49a92','#dc6e6c','#f8aaa0'],1.2);dots(g,r,6,'#ffc0b4')});
  V('siftsoil',3,(g,r)=>{speck(g,r,['#e07a6a','#d46c5e','#ea8a78','#c86052']);dots(g,r,5,'#b04848')});
  V('redsculk',3,(g,r)=>{speck(g,r,['#a8403e','#9a3836','#b44a46','#8a302e','#c05650'],1.3);dots(g,r,7,['#ff8a6a','#ffd0a0'])});
  V('tealgrass',3,(g,r)=>{speck(g,r,['#2a8a80','#24807a','#32968a','#1e7068','#3aa898'],1.2);dots(g,r,6,'#7ae8d8')});
  V('carapace',3,(g,r)=>{speck(g,r,['#c8c0a0','#bcb492','#d4ccae','#ada484']);dots(g,r,6,['#9a9070','#e4dcc0'])});
  V('darksculk',3,(g,r)=>{speck(g,r,['#1e2a3a','#1a2434','#243244','#141c2a'],1.3);dots(g,r,6,['#2a8ab0','#6ad8ff'])});
  V('driprock',2,(g,r)=>{speck(g,r,['#c6d2d8','#b8c6cc','#d2dce2','#a8b6bd'],1);for(let i=0;i<4;i++){const x=Math.floor(r()*16);R(g,x,8+Math.floor(r()*6),1,8,'#2a3a42')}});
  V('echostone',1,(g,r)=>{R(g,0,0,16,16,'#4a6a6e');g.fillStyle='#38585c';[[1,1,14,1],[1,1,1,14],[1,14,14,1],[14,1,1,14],[4,4,8,1],[4,4,1,6],[4,9,5,1],[8,7,1,3],[6,7,3,1]].forEach(a=>g.fillRect(...a));dots(g,r,8,'#6a8a8e');R(g,7,11,2,2,'#7af0e8')});
  V('whitestone',2,(g,r)=>{bricksTex(['#e8eaee','#dfe2e8','#f0f2f6'],'#a8aeb8',8,8,'#ffffff')(g,r)});
  V('siftpath',3,(g,r)=>{speck(g,r,['#c06a5a','#b45e50','#cc7666','#a85446','#d48474']);dots(g,r,5,['#8a3a34','#f0a090'])});
  V('siftleaf',2,leavesTex(['#9ad8d0','#8ccac2','#a8e4dc','#e8f8f4','#7abcb4'],4));
  /* TNT */
  TX.tntSide=makeTex(5,(g)=>{R(g,0,0,16,16,'#d42e1c');for(let x=0;x<16;x+=4)R(g,x+2,0,1,16,'#a8200f');R(g,0,5,16,6,'#eeeeee');R(g,0,5,16,1,'#bdbdbd');R(g,0,10,16,1,'#bdbdbd');
    const L=[["###",".#.",".#.",".#."],["#..#","##.#","#.##","#..#"],["###",".#.",".#.",".#."]];let ox=2;
    for(const l of L){l.forEach((row,y)=>{for(let x=0;x<row.length;x++)if(row[x]==='#')R(g,ox+x,6+y,1,1,'#1a1a1a')});ox+=l[0].length+1}});
  TX.tntTop=makeTex(6,(g)=>{R(g,0,0,16,16,'#c8301e');R(g,0,0,16,1,'#e85a40');R(g,0,15,16,1,'#8a1a0a');R(g,5,5,6,6,'#8a8a8a');R(g,6,6,4,4,'#5a5a5a');R(g,7,7,2,2,'#2a2a2a')});
  /* ----- animasyonlu sıvılar ----- */
  const animTex=(cols,seed,amp,frames=4)=>{const out=[],rr=mulberry32(seed),nz=[];for(let i=0;i<256;i++)nz.push(rr());
    for(let f=0;f<frames;f++)out.push(makeTex(seed+f,(g)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const P=TAU,ff=f/frames;
      let v=Math.sin(P*(x/16*2+ff))+Math.sin(P*(y/16+x/16-ff))*.8+Math.sin(P*(y/16*2-ff))*.5+(nz[y*16+x]-.5)*amp;
      v=(v+2.6)/5.2;g.fillStyle=cols[clamp(Math.floor(v*cols.length),0,cols.length-1)];g.fillRect(x,y,1,1)}}));return out};
  TX.lava=animTex(['#a52c08','#c8460c','#e26412','#f58a1e','#ffb238','#ffde78'],77,1.6);
  TX.water=animTex(['#2a55c0','#3260cf','#3a6cdb','#4579e4','#5a8ced','#80aaf4'],99,.9);
  TX.acid=animTex(['#1f8a5a','#26a06a','#34bf89','#5ad49a','#8ce8a8','#c8f8b0'],131,1.1);
  TX.swampwater=animTex(['#2f4f3a','#355a42','#3c6448','#466e50','#56805c','#6a9068'],151,.9);
  /* ichor: yağ gibi gökkuşağı yansımalı, içinde ruhlar yüzen Sift sıvısı */
  const hsl=(h,s,l)=>{const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return`rgb(${f(0)},${f(8)},${f(4)})`};
  TX.ichor=[];{const rr=mulberry32(4242),nz=[];for(let i=0;i<256;i++)nz.push(rr());
    for(let f=0;f<6;f++)TX.ichor.push(makeTex(500+f,(g)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ff=f/6;
      const v=Math.sin(TAU*(x/16+ff))*.5+Math.sin(TAU*(y/16*1.3-ff+x/32))*.5+Math.sin(TAU*((x+y)/20+ff*2))*.4+nz[y*16+x]*.25;
      const hue=((v+1.4)*150+f*20)%360;g.fillStyle=hsl(hue,.78,.66+nz[(x*7+y)%256]*.08);g.fillRect(x,y,1,1)}
      for(let i=0;i<3;i++)R(g,Math.floor(nz[(i*31+f*17)%256]*15),Math.floor(nz[(i*53+f*29)%256]*15),1,1,'rgba(255,255,255,.85)')}))}
  /* Sift yarığı: altında aurora-bulutsu görünen derin çatlak */
  TX.rift=[];{const rr=mulberry32(777),nz=[];for(let i=0;i<256;i++)nz.push(rr());
    for(let f=0;f<6;f++)TX.rift.push(makeTex(900+f,(g)=>{R(g,0,0,16,16,'#141a46');for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ff=f/6;
      const v=Math.sin(TAU*(x/22+ff))+Math.cos(TAU*(y/18-ff*.7+x/40));if(v>.55){g.fillStyle=v>1.2?'rgba(255,150,220,.85)':'rgba(120,220,255,.55)';g.fillRect(x,y,1,1)}
      else if(v<-1.3){g.fillStyle='rgba(140,255,180,.45)';g.fillRect(x,y,1,1)}}
      for(let i=0;i<4;i++){const k=(i*37+f*11)%256;R(g,Math.floor(nz[k]*16),Math.floor(nz[(k+5)%256]*16),1,1,nz[(k+9)%256]>.5?'#ffffff':'#c8f0ff')}}))}
  /* kırılma aşamaları */
  const cr=mulberry32(1234),segs=[];
  for(let k=0;k<8;k++){let x=8,y=8;const a0=k/8*TAU+cr()*.5;for(let s=0;s<5;s++){const a=a0+(cr()-.5)*1.2,nx=x+Math.cos(a)*2.2,ny=y+Math.sin(a)*2.2;segs.push([x,y,nx,ny,s]);x=nx;y=ny}}
  TX.crack=[];for(let st=0;st<10;st++){const c=mkCanvas(16,16),g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.75)';
    for(const s of segs){if(s[4]<=st/2){for(let i=0;i<=4;i++)g.fillRect(Math.round(lerp(s[0],s[2],i/4)),Math.round(lerp(s[1],s[3],i/4)),1,1)}}TX.crack.push(c)}
  /* ışık sprite'ları */
  TX.light=mkCanvas(64,64);{const g=TX.light.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.45,'rgba(255,255,255,.6)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)}
  const glowOf=(c1,c2)=>{const c=mkCanvas(64,64),g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(0,0,64,64);return c};
  TX.glow=glowOf('rgba(255,160,60,.55)','rgba(255,90,20,0)');
  TX.glowC=glowOf('rgba(90,230,255,.6)','rgba(20,160,200,0)');
  TX.glowP=glowOf('rgba(210,120,255,.6)','rgba(140,40,220,0)');
  TX.glowO=glowOf('rgba(255,170,60,.7)','rgba(255,120,20,0)');
  TX.glowW=glowOf('rgba(255,255,255,.6)','rgba(255,255,255,0)');
  TX.glowG=glowOf('rgba(140,255,120,.55)','rgba(60,200,40,0)');
}
/* biyom/boyut ikonları için 3B blok görüntüsü */
function blockIcon(top,side,size=32){const c=mkCanvas(size,size),g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const t=TX[top][0],s=TX[side||top][0],h=size/2;g.save();g.translate(h,size*.06);g.transform(1,.5,-1,.5,0,0);g.drawImage(t,0,0,h*1.02,h*1.02);g.restore();
  g.save();g.translate(0,size*.31);g.transform(1,.5,0,1,0,0);g.drawImage(s,0,0,h,h*1.1);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(0,0,h,h*1.1);g.restore();
  g.save();g.translate(h,size*.56);g.transform(1,-.5,0,1,0,0);g.drawImage(s,0,0,h,h*1.1);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,0,h,h*1.1);g.restore();return c}
