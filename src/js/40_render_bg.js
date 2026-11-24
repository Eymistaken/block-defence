/* ============================ ÇİZİM: ARKA PLAN ============================ */
function groundTex(B,c,x,y){
  const L=B.ground;if(L.length===1)return TX[L[0][0]][c.v%TX[L[0][0]].length];
  const s=hashStr(G.map.id)%97,v=(snoise(x*.9,y*.9,s)+1)/2;let acc=0;
  for(const[t,w]of L){acc+=w;if(v<=acc*1.02){const T=TX[t];return T[c.v%T.length]}}const T=TX[L[L.length-1][0]];return T[c.v%T.length]}
function block3D(g,x,y,w,h,d,tex,shade){g.drawImage(tex,x,y,w,h);g.drawImage(tex,0,0,16,4,x,y+h,w,d);R(g,x,y+h,w,d,`rgba(0,0,0,${shade||.38})`);R(g,x,y+h,w,1,'rgba(0,0,0,.4)');g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=1;g.strokeRect(x+.5,y+.5,w-1,h+d-1)}
function shadowBox(g,X,Y){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(X+8,Y+12,40,36)}
function drawObstacle(g,X,Y,k,b){
  const O=OBS[k];shadowBox(g,X,Y);
  switch(O.draw||'block'){
  case'tree':R(g,X+20,Y+34,8,11,'#6b5233');R(g,X+20,Y+34,2,11,'#5a4329');block3D(g,X+3,Y+1,42,30,7,TX.leaves[(X+Y)%3]);R(g,X+10,Y+6,3,3,'rgba(255,255,255,.12)');break;
  case'darkoak':R(g,X+16,Y+32,16,13,'#3e2a18');block3D(g,X+1,Y,46,32,8,TX.darkleaves[(X+Y)%2]);R(g,X+8,Y+5,4,3,'rgba(255,255,255,.08)');break;
  case'mangrove':for(let i=0;i<4;i++)R(g,X+10+i*8,Y+30,2,15,'#5a3a24');block3D(g,X+4,Y+2,40,26,7,TX.leaves[1]);R(g,X+18,Y+28,12,8,'#6a4a2a');break;
  case'spruce':R(g,X+20,Y+36,8,10,'#4a3520');block3D(g,X+4,Y+14,40,20,6,TX.spruce[0]);block3D(g,X+11,Y+2,26,15,5,TX.spruce[1]);
    if(b==='tundra'){R(g,X+5,Y+15,38,5,'#f3f7fa');R(g,X+12,Y+3,24,4,'#ffffff')}break;
  case'cactus':block3D(g,X+12,Y+3,24,33,8,TX.cactus[0]);R(g,X+18,Y+3,12,2,'rgba(255,255,255,.15)');break;
  case'paleoak':R(g,X+19,Y+28,10,18,'#d8d2cc');R(g,X+19,Y+28,3,18,'#b8b0a8');block3D(g,X+2,Y,44,28,7,TX.paleleaves[(X+Y)%2]);
    for(let i=0;i<5;i++)R(g,X+6+i*9,Y+34,2,6+(i*5)%9,'#b8bdb1');break;
  case'cheart':R(g,X+16,Y+2,16,42,'#d8d2cc');R(g,X+16,Y+2,4,42,'#bdb5ad');R(g,X+16,Y+16,16,14,'#6a5248');R(g,X+19,Y+19,10,8,'#3a2a22');R(g,X+21,Y+21,6,4,'#5a3a1a');
    R(g,X+8,Y+36,32,6,'#a8a098');for(let i=0;i<3;i++)R(g,X+10+i*12,Y+2,3,6,'#b8bdb1');if(k==='bheart'){R(g,X+14,Y+2,20,2,'#ff9a30');R(g,X+14,Y+42,20,2,'#ff9a30')}break;
  case'resinlog':R(g,X+16,Y+4,16,40,'#d8d2cc');R(g,X+16,Y+4,4,40,'#bdb5ad');for(const[a,c2]of[[10,8],[26,20],[14,30]])R(g,X+12+(a%8),Y+c2,7,6,'#e87820');R(g,X+14,Y+10,3,2,'#ffc070');break;
  case'eyeb':R(g,X+23,Y+26,2,14,'#7a8a72');R(g,X+17,Y+34,6,3,'#8a9a82');R(g,X+26,Y+30,6,3,'#8a9a82');R(g,X+18,Y+18,12,10,'#8a8f84');R(g,X+20,Y+16,8,3,'#a0a69a');break;
  case'sensor':block3D(g,X+6,Y+18,36,18,7,TX.sculk[0]);for(let i=0;i<4;i++)R(g,X+11+i*8,Y+7,3,12,'#0e3a44');break;
  case'shrieker':block3D(g,X+6,Y+16,36,20,7,TX.sculk[1]);R(g,X+5,Y+10,38,7,'#e8e2c8');R(g,X+5,Y+10,38,2,'#fff8e0');R(g,X+12,Y+13,24,3,'#3a4a4a');break;
  case'catalyst':block3D(g,X+6,Y+14,36,22,7,TX.sculk[2]);R(g,X+6,Y+8,36,8,'#e8e2c8');R(g,X+6,Y+8,36,2,'#fff8e0');R(g,X+18,Y+18,12,8,'#29dfeb');R(g,X+21,Y+20,6,4,'#bfffff');break;
  case'dripstone':g.fillStyle='#866b5c';g.beginPath();g.moveTo(X+10,Y+42);g.lineTo(X+24,Y+2);g.lineTo(X+38,Y+42);g.closePath();g.fill();g.fillStyle='#6d5649';g.beginPath();g.moveTo(X+24,Y+2);g.lineTo(X+38,Y+42);g.lineTo(X+27,Y+42);g.closePath();g.fill();R(g,X+20,Y+18,3,2,'rgba(255,255,255,.15)');break;
  case'chest':{const c1=O.chest||'#8a5a2a';R(g,X+8,Y+14,32,24,c1);R(g,X+8,Y+14,32,10,'rgba(255,255,255,.12)');R(g,X+8,Y+23,32,2,'#2a1a0a');R(g,X+22,Y+21,4,6,O.chest?'#29dfeb':'#c8c8c8');g.strokeStyle='#1a1008';g.strokeRect(X+8.5,Y+14.5,31,23);break}
  case'hay':block3D(g,X+6,Y+10,36,24,8,TX.sand[0]);R(g,X+6,Y+16,36,3,'#8a2a2a');R(g,X+6,Y+28,36,3,'#8a2a2a');break;
  case'cfungus':R(g,X+20,Y+24,8,22,'#7a2a4a');block3D(g,X+3,Y+2,42,22,6,TX.nwart[0]);for(let i=0;i<3;i++)R(g,X+9+i*13,Y+28,3,5+i*2,'#9a1a1a');R(g,X+12,Y+8,6,6,'#ffb050');R(g,X+30,Y+12,5,5,'#ffb050');break;
  case'wfungus':R(g,X+20,Y+24,8,22,'#2a6a6a');block3D(g,X+3,Y+2,42,22,6,TX.wwart[0]);for(let i=0;i<3;i++)R(g,X+9+i*13,Y+28,3,5+i*2,'#1c9a8c');R(g,X+12,Y+8,6,6,'#ffb050');R(g,X+30,Y+12,5,5,'#ffb050');break;
  case'basaltcol':block3D(g,X+10,Y+2,28,36,6,TX.pbasalt[0]);g.drawImage(TX.basalt[0],X+10,Y+2,28,10);break;
  case'chorusp':R(g,X+22,Y+10,5,34,'#6a4a7a');R(g,X+10,Y+20,13,4,'#6a4a7a');R(g,X+10,Y+8,4,14,'#6a4a7a');R(g,X+26,Y+26,12,4,'#6a4a7a');R(g,X+34,Y+14,4,14,'#6a4a7a');
    R(g,X+8,Y+3,8,7,'#c8a0d8');R(g,X+32,Y+8,8,7,'#c8a0d8');R(g,X+20,Y+3,9,8,'#d8b8e8');break;
  case'glowshroom':R(g,X+20,Y+22,8,24,'#d8e8e0');R(g,X+20,Y+22,2,24,'#b8c8c0');block3D(g,X+3,Y+2,42,18,5,TX.glowcap[0]);R(g,X+8,Y+24,32,3,'#2ac0b0');break;
  case'cryst':for(const[a,h,w,c1,c2]of[[14,30,8,'#b8d8ff','#8ab8f0'],[26,38,10,'#f0b8f0','#d090e0'],[36,24,7,'#c8c0ff','#a098f0']])crystal(g,X+a,Y+42,w,h,c1,c2);break;
  case'ambertree':R(g,X+21,Y+20,6,26,'#8a4a1a');for(let i=0;i<4;i++){R(g,X+12+((i*7)%18),Y+4+i*7,24-((i*7)%10),6,i%2?'#ffb040':'#e88a20')}R(g,X+18,Y+2,12,4,'#ffd080');break;
  case'umbratree':R(g,X+21,Y+18,6,28,'#2a2236');block3D(g,X+4,Y+2,40,20,6,TX.umbral[0]);R(g,X+10,Y+8,4,3,'#8a5aff');R(g,X+30,Y+12,3,3,'#8a5aff');break;
  case'vent':block3D(g,X+12,Y+14,24,22,6,TX.painted[0]);R(g,X+16,Y+10,16,6,'#3a3a20');R(g,X+18,Y+11,12,3,'#1a1a10');break;
  case'endrod':R(g,X+22,Y+6,4,34,'#f8f4f0');R(g,X+18,Y+38,12,4,'#c8b8c8');break;
  case'ecrystal':block3D(g,X+12,Y+18,24,20,6,TX.obsidian[0]);g.drawImage(TX.bonebk[0],X+14,Y+14,20,5);break;
  case'driprock':block3D(g,X+4,Y+4,40,28,8,TX.driprock[(X+Y)%2]);for(let i=0;i<5;i++)R(g,X+7+i*8,Y+30,3,6+(i*7)%8,'#2a3a42');R(g,X+4,Y+4,40,6,'#e0eaee');break;
  case'sifttree':R(g,X+20,Y+24,8,22,'#2a6a64');R(g,X+20,Y+24,2,22,'#1e504a');block3D(g,X+2,Y+2,44,20,6,TX.siftleaf[(X+Y)%2]);for(let i=0;i<6;i++)R(g,X+5+i*7,Y+26,3,5+(i*3)%8,'#eef8f6');break;
  case'soulplant':R(g,X+22,Y+20,3,24,'#2a8a80');R(g,X+12,Y+26,12,4,'#3aa898');R(g,X+26,Y+22,12,4,'#3aa898');R(g,X+16,Y+12,8,8,'#4ad8f0');R(g,X+28,Y+10,7,7,'#4ad8f0');R(g,X+18,Y+13,3,2,'#e0ffff');break;
  case'nest':R(g,X+6,Y+22,36,20,'#1e2a3a');R(g,X+10,Y+16,28,10,'#243244');R(g,X+18,Y+24,12,10,'#05080e');R(g,X+12,Y+18,4,4,'#8a6aff');break;
  case'generator':R(g,X+10,Y+12,28,30,'#5a5a62');R(g,X+10,Y+12,28,3,'#8a8a92');R(g,X+16,Y+20,16,14,'#2a1a1a');R(g,X+14,Y+6,4,8,'#3a3a40');R(g,X+30,Y+6,4,8,'#3a3a40');R(g,X+8,Y+40,32,4,'#3a3a40');break;
  case'barrel':R(g,X+12,Y+10,24,30,'#6a4a2a');R(g,X+12,Y+16,24,2,'#3a3a3a');R(g,X+12,Y+32,24,2,'#3a3a3a');R(g,X+18,Y+8,12,4,'#ff7ad8');R(g,X+20,Y+9,4,2,'#5ae8ff');break;
  default:{const tex=TX[O.tex][0];block3D(g,X+3,Y+4,42,32,8,tex);R(g,X+3,Y+4,42,2,'rgba(255,255,255,.12)')}
  }
}
/* canlı engel katmanı: parlayan gözler, sensör dokunaçları, kristaller (her karede) */
function drawObstacleOverlays(g,T){
  const night=G.tod>.5||G.gazeT>0;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(!c.obs)continue;const X=x*TILE,Y=y*TILE,k=c.obs;
    if(k==='cheart'||k==='bheart'){const awake=k==='bheart'?!!(G.boss&&G.boss.invuln):night;if(awake){g.globalAlpha=.6+.3*Math.sin(T*3);g.drawImage(TX.glowO,X+4,Y+3,40,40);g.globalAlpha=1;R(g,X+21,Y+21,6,4,'#ff9a2a');R(g,X+23,Y+22,2,2,'#fff0a0')}
      if(G.gazeT>0&&k==='cheart'){g.strokeStyle='rgba(255,154,42,.8)';g.lineWidth=2;g.strokeRect(X+2,Y+2,44,44)}}
    else if(k==='eyeb'&&night){g.globalAlpha=.5;g.drawImage(TX.glowO,X+8,Y+6,32,32);g.globalAlpha=1;R(g,X+17,Y+16,14,12,'#ff9a2a');R(g,X+20,Y+19,8,6,'#fff0a0');R(g,X+23,Y+21,2,3,'#3a1a00')}
    else if(k==='sensor'){const act=(c.fxT||0)>T;for(let i=0;i<4;i++){const h=12+(act?Math.sin(T*30+i)*3:Math.sin(T*2+i));R(g,X+11+i*8,Y+19-h,3,h,act?'#9affff':'#29dfeb')}if(act){g.globalAlpha=.6;g.drawImage(TX.glowC,X,Y-6,48,48);g.globalAlpha=1}}
    else if(k==='shrieker'){const act=(c.fxT||0)>T;if(act){g.strokeStyle='rgba(120,240,255,.8)';g.lineWidth=2;for(let i=0;i<3;i++){g.beginPath();g.arc(X+24,Y+12,6+((T*40+i*9)%26),Math.PI*1.1,Math.PI*1.9);g.stroke()}R(g,X+12,Y+8,24,4,'#3ae8ff')}}
    else if(k==='catalyst'){const act=(c.fxT||0)>T;g.globalAlpha=act?.9:.35+.15*Math.sin(T*2);g.drawImage(TX.glowC,X+8,Y+2,32,32);g.globalAlpha=1}
    else if(k==='ecrystal'){const b=Math.sin(T*2+x)*3;g.save();g.translate(X+24,Y+6+b);g.rotate(T*1.5);R(g,-7,-7,14,14,'rgba(220,240,255,.5)');g.strokeStyle='#e8f8ff';g.lineWidth=1;g.strokeRect(-7,-7,14,14);R(g,-4,-4,8,8,'#e070c8');g.restore();
      g.globalAlpha=.5;g.drawImage(TX.glowP,X+6,Y-12+b,36,36);g.globalAlpha=1;
      if(G.boss&&G.boss.type==='bossDragon'){g.strokeStyle='rgba(255,150,240,.5)';g.lineWidth=2;g.beginPath();g.moveTo(X+24,Y+6+b);g.lineTo(G.boss.x,G.boss.y-46);g.stroke()}}
    else if(k==='vent'){if((c.vT||9)<1.2&&Math.random()<.5)addP({x:X+24+rand(-5,5),y:Y+12,vx:rand(-8,8),vy:rand(-40,-20),life:.6,max:.6,sz:3,c:'rgba(240,250,200,.5)',g:0,smoke:true})}
    else if(k==='generator'){const on=G.storm;R(g,X+18,Y+22,12,10,on?(((T*6)|0)%2?'#ff3030':'#ff9090'):'#5a2020');if(on){g.globalAlpha=.5;g.drawImage(TX.glow,X,Y,48,48);g.globalAlpha=1}}
    else if(k==='soulplant'||k==='glowshroom'){if(Math.random()<.01)sparkle(X+24,Y+16,k==='soulplant'?'#9af0ff':'#9affe8',1)}
  }
}
function drawDecor(g,d,b){
  const x=Math.floor(d.x),y=Math.floor(d.y),k=d.k;
  const flower=(c)=>{R(g,x,y,1,4,'#3a7a2a');R(g,x-1,y-2,3,3,c);R(g,x,y-1,1,1,'#ffeb3b')};
  const tuft=(c1,c2)=>{R(g,x,y,1,3,c1);R(g,x+2,y-1,1,4,c2);R(g,x+4,y,1,3,c1)};
  const peb=(c)=>{R(g,x,y,3,2,c);R(g,x,y,3,1,'rgba(255,255,255,.2)')};
  const tall=(c1,c2,h)=>{for(let i=0;i<4;i++)R(g,x+i*2-3,y-h+((i*3)%4),1.4,h,(i%2)?c1:c2)};
  switch(G.biome.decor){
  case'plains':[()=>flower('#e02a2a'),()=>flower('#ffe030'),()=>flower('#4aa0ff'),()=>tuft('#3f7a26','#4a8a2e'),()=>tuft('#4a8a2e','#56a034'),()=>flower('#f4f4f4')][k]();break;
  case'desert':if(k<2){R(g,x,y,1,4,'#8a6a3a');R(g,x-2,y-1,2,1,'#8a6a3a');R(g,x+1,y-2,2,1,'#8a6a3a')}else if(k===2){R(g,x,y,4,1,'#eee8d8');R(g,x+1,y-1,1,3,'#eee8d8')}else peb('#b8a070');break;
  case'tundra':if(k<3){R(g,x,y,5,2,'#ffffff');R(g,x+1,y-1,3,1,'#ffffff')}else peb('#9fb0c0');break;
  case'swamp':if(k<2)tuft('#5a7a2a','#6a8a32');else if(k===2){R(g,x,y,4,3,'#3a6a2a');R(g,x+1,y+1,1,1,'#a040c0')}else if(k===3)flower('#2a50c0');else peb('#4a4a40');break;
  case'cave':if(k===0){R(g,x,y,1,3,'#ddd');R(g,x-1,y-2,3,2,'#c03030')}else if(k===1){R(g,x,y,1,3,'#7a9a3a');R(g,x-1,y-2,3,2,'#ffb030')}else if(k===2){R(g,x,y,1,2,'#6af');R(g,x-1,y-2,3,2,'#40e0ff')}else peb('#5a5a5a');break;
  case'ocean':if(k<2){R(g,x,y-6,1,7,'#3a8a4a');R(g,x+2,y-8,1,9,'#4a9a5a')}else if(k===2){R(g,x,y,3,3,'#e060a0');R(g,x+1,y-1,1,1,'#ff90c0')}else if(k===3){R(g,x,y,2,2,'#5aff9a')}else peb('#8a8a70');break;
  case'pale':if(k<2){R(g,x,y,5,2,'#c8ccbf')}else if(k===2){R(g,x,y,1,4,'#7a8a72');R(g,x-1,y-2,3,2,'#8a8f84')}else tuft('#9aa292','#aeb6a6');break;
  case'deep':if(k<2){g.strokeStyle='rgba(20,120,130,.7)';g.lineWidth=1;g.beginPath();g.moveTo(x-4,y);g.lineTo(x,y-2);g.lineTo(x+4,y+1);g.stroke()}else if(k===2){R(g,x,y,2,4,'#e8e2c8');R(g,x,y-2,2,2,'#ffd070')}else if(k===3){R(g,x,y,4,3,'#e8e2c8');R(g,x+1,y+1,1,1,'#222')}else peb('#2a2a30');break;
  case'nether':if(k<2){R(g,x,y,1,3,'#7a2a2a');R(g,x-2,y-2,5,2,k?'#c02030':'#20a0a0')}else if(k===2)R(g,x,y,2,2,'#ff9020');else peb('#3a2020');break;
  case'crimson':if(k<3){R(g,x,y-3,1,4,'#9a1a1a');R(g,x+2,y-4,1,5,'#b02424');R(g,x-2,y-2,1,3,'#9a1a1a')}else if(k===3){R(g,x,y,3,3,'#c83a2a');R(g,x+1,y-1,1,1,'#ffb050')}else peb('#4a1010');break;
  case'warped':if(k<3){R(g,x,y-3,1,4,'#1c9a8c');R(g,x+2,y-4,1,5,'#2ab8a8');R(g,x-2,y-2,1,3,'#1c9a8c')}else if(k===3){R(g,x,y,3,3,'#2ab8a8');R(g,x+1,y-1,1,1,'#ffb050')}else peb('#0a3a36');break;
  case'soul':if(k<2){R(g,x,y-4,2,5,'#3ad8ff');R(g,x,y-2,2,3,'#c8ffff')}else if(k===2){R(g,x,y,4,2,'#e6e0c8');R(g,x+1,y-2,2,2,'#e6e0c8')}else peb('#3a2e24');break;
  case'basalt':peb(k<3?'#5a5a62':'#3a3a40');break;
  case'end':if(k<2){R(g,x,y,1,4,'#7a5a8a');R(g,x-1,y-2,3,3,'#c090d0')}else if(k===2)tuft('#3aa88a','#4ec8a4');else peb('#b8bc80');break;
  case'chorus':if(k<3){R(g,x,y-4,1,5,'#6a4a7a');R(g,x-1,y-6,3,3,'#c8a0d8')}else peb('#7a5aa0');break;
  case'fog':if(k<3){R(g,x,y-3,1,4,'#d8e8e0');R(g,x-2,y-5,5,2,'#4ae8d8')}else tuft('#3aa88a','#4ec8a4');break;
  case'crystal':if(k<3)crystal(g,x,y,3,6+k*2,'#c8e0ff','#98b8f0');else peb('#8ab0d0');break;
  case'amber':if(k<3){R(g,x,y-3,2,4,'#ffa030');R(g,x,y-4,2,1,'#ffe080')}else peb('#a8621c');break;
  case'shadow':if(k<2){R(g,x,y,2,2,'#8a5aff')}else peb('#1a1426');break;
  case'sulfur':if(k<3){R(g,x,y,3,2,'#e8f080');R(g,x+1,y-1,1,1,'#ffffff')}else peb('#a8584a');break;
  case'meadow':if(k<3)tall('#f49a92','#e8706a',8+k*2);else if(k===3){R(g,x,y,1,4,'#2a8a80');R(g,x-1,y-2,3,3,'#4a8aff')}else if(k===4){R(g,x,y-2,4,3,'#f8a030');R(g,x+1,y-4,2,2,'#ffd060')}else tuft('#3aa898','#2a8a80');break;
  case'singer':if(k<3)tall('#3aa898','#7ae8d8',9+k*2);else if(k===3){R(g,x,y,1,4,'#2a8a80');R(g,x-1,y-2,3,3,'#9ad8ff')}else if(k===4){R(g,x,y-2,4,3,'#ffd060')}else peb('#8a302e');break;
  case'carapace':if(k<2){R(g,x,y,4,2,'#e6e0c8');R(g,x+1,y-2,1,2,'#e6e0c8')}else if(k===2)tall('#c84a40','#e86a50',6);else peb('#9a9070');break;
  }
}
const LIQUIDS=['water','lava','void','ichor','acid','rift','chasm'];
function renderBG(){
  const g=bctx,M=G.map,B=G.biome;g.imageSmoothingEnabled=false;
  const pathTex=TX[B.path]||TX.path,wallTex=TX[B.wall||'stone'];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x],X=x*TILE,Y=y*TILE;let tex;
    if(c.t==='path'){tex=pathTex[c.v%pathTex.length];if(c.fx==='powder')tex=TX.powder[c.v%2];else if(c.fx==='mud')tex=TX.mud[c.v%2];else if(c.fx==='soul')tex=TX.soulsand[c.v%3];else if(c.fx==='slide')tex=TX.starice[c.v%2];else if(c.fx==='magma')tex=TX.magma[0]}
    else if(c.t==='ice')tex=TX.ice[c.v%2];else tex=groundTex(B,c,x,y);
    g.drawImage(tex,X,Y,TILE,TILE);
    if(c.t==='path'&&LIQUIDS.includes(c.under)){/* köprü: sıvı üstünden geçen yol */
      const br=c.under==='ichor'?'bonebk':(c.under==='lava'?'nbricks':'planks');g.drawImage(TX[br][0],X+2,Y+2,TILE-4,TILE-4);R(g,X,Y,TILE,2,'rgba(0,0,0,.35)');R(g,X,Y+TILE-2,TILE,2,'rgba(0,0,0,.35)')}}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.t!=='path')continue;const X=x*TILE,Y=y*TILE;
    const np=(i,j)=>{const n=cell(x+i,y+j);return!n||n.t==='path'};
    if(!np(0,-1))R(g,X,Y,TILE,5,'rgba(0,0,0,.25)');if(!np(-1,0))R(g,X,Y,4,TILE,'rgba(0,0,0,.2)');
    if(!np(0,1))R(g,X,Y+TILE-2,TILE,2,'rgba(255,255,255,.12)');if(!np(1,0))R(g,X+TILE-2,Y,2,TILE,'rgba(0,0,0,.1)')}
  for(const a of G.animTiles){for(const[i,j]of[[0,-1],[0,1],[-1,0],[1,0]]){const n=cell(a.x+i,a.y+j);if(n&&(n.t==='ground'||n.t==='ice')){const nx=(a.x+i)*TILE,ny=(a.y+j)*TILE;
    const col=a.t==='lava'?'rgba(40,10,0,.35)':a.t==='ichor'?'rgba(255,120,220,.18)':(a.t==='void'||a.t==='chasm'||a.t==='rift')?'rgba(0,0,0,.3)':'rgba(30,60,30,.25)';
    if(j===-1)R(g,nx,ny+TILE-4,TILE,4,col);if(j===1)R(g,nx,ny,TILE,3,col);if(i===-1)R(g,nx+TILE-3,ny,3,TILE,col);if(i===1)R(g,nx,ny,3,TILE,col)}}}
  for(const d of G.decor){const c=cell(Math.floor(d.x/TILE),Math.floor(d.y/TILE));if(c&&c.t!=='path'&&!c.obs&&c.t!=='wall')drawDecor(g,d,M.biome)}
  for(const P of G.paths){if(P.lava)continue;const p=P.pts[0];let gr;
    if(p.x<0){gr=g.createLinearGradient(0,0,46,0);gr.addColorStop(0,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,p.y-TILE/2,46,TILE)}
    else if(p.x>W){gr=g.createLinearGradient(W,0,W-46,0);gr.addColorStop(0,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(W-46,p.y-TILE/2,46,TILE)}
    else if(p.y<0){gr=g.createLinearGradient(0,0,0,46);gr.addColorStop(0,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(p.x-TILE/2,0,TILE,46)}
    else if(p.y>H){gr=g.createLinearGradient(0,H,0,H-46);gr.addColorStop(0,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(p.x-TILE/2,H-46,TILE,46)}}
  /* yapılar (duvar kareleri) */
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.t!=='wall')continue;const X=x*TILE,Y=y*TILE;
    const up=cell(x,y-1),hasUp=up&&up.t==='wall';g.drawImage(wallTex[(x+y)%wallTex.length],X,Y,TILE,TILE);
    if(!hasUp){R(g,X,Y,TILE,6,'rgba(255,255,255,.14)')}const dn=cell(x,y+1);if(!dn||dn.t!=='wall'){R(g,X,Y+TILE-8,TILE,8,'rgba(0,0,0,.4)')}
    const lf=cell(x-1,y);if(!lf||lf.t!=='wall')R(g,X,Y,3,TILE,'rgba(0,0,0,.25)');
    if(M.biome==='raid'&&!hasUp){R(g,X,Y,TILE,10,'#6a3a24');R(g,X,Y+8,TILE,2,'#4a2a18')}}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.obs)drawObstacle(bctx,x*TILE,y*TILE,c.obs,M.biome);
    if(c.torch){const X=x*TILE+22,Y=y*TILE+20,soul=G.dim==='ne'&&(M.biome==='soulvalley'||M.biome==='witherarena');R(g,X,Y,4,12,'#6b4a28');R(g,X-1,Y-4,6,5,soul?'#3ad8ff':'#ffcc40');R(g,X,Y-3,4,3,soul?'#c8ffff':'#fff6c0')}}
}
