/* ============================ ÇİZİM: KULELER ============================ */
function pedestal(g,X,Y,lvl){
  const tex=TX[LV_TEX[lvl]][0];
  g.fillStyle='rgba(0,0,0,.28)';g.fillRect(X+8,Y+12,40,36);
  g.drawImage(tex,X+4,Y+6,40,30);g.drawImage(tex,0,0,16,5,X+4,Y+36,40,10);
  R(g,X+4,Y+36,40,10,'rgba(0,0,0,.38)');R(g,X+4,Y+36,40,1,'rgba(0,0,0,.5)');
  g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=1;g.strokeRect(X+4.5,Y+6.5,39,39);
  const pc=lvl>=4?'#b890ff':'#ffd83d';for(let i=0;i<=Math.min(lvl,3);i++){R(g,X+8+i*7,Y+39,4,4,pc);R(g,X+8+i*7,Y+42,4,1,'#5a3a00')}
  if(lvl>=4){R(g,X+36,Y+38,5,5,'#2a2228');R(g,X+37,Y+39,3,3,'#9a7ab0')}
}
function crystal(g,x,y,w,h,c1,c2){g.beginPath();g.moveTo(x,y-h);g.lineTo(x+w/2,y-h+w*.6);g.lineTo(x+w/2,y);g.lineTo(x-w/2,y);g.lineTo(x-w/2,y-h+w*.6);g.closePath();g.fillStyle=c1;g.fill();
  g.beginPath();g.moveTo(x,y-h);g.lineTo(x+w/2,y-h+w*.6);g.lineTo(x+w/2,y);g.lineTo(x,y);g.closePath();g.fillStyle=c2;g.fill()}
function cube3(g,x,y,s,top,side,dark){R(g,x,y,s,s*.3,top);R(g,x,y+s*.3,s,s*.7,side);R(g,x,y+s*.3,s,1,'rgba(255,255,255,.18)');R(g,x+s*.6,y+s*.3,s*.4,s*.7,dark||'rgba(0,0,0,.25)')}
function drawTower(g,type,lvl,X,Y,ang,time,tw){
  const cx=X+24,cy=Y+21;
  if(type==='web'){drawWeb(g,X,Y,1);return}
  if(type==='landmine'){drawMine(g,X,Y);return}
  if(type==='wool'){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(X+8,Y+14,36,32);block3D(g,X+6,Y+8,36,28,8,(TX.wool||(TX.wool=[makeTex(31,(gg,r)=>{speck(gg,r,['#ececec','#e0e0e0','#f6f6f6','#d4d4d4'],1);for(let i=0;i<6;i++)R(gg,Math.floor(r()*14),Math.floor(r()*14),3,1,'#cfcfcf')})]))[0]);return}
  pedestal(g,X,Y,lvl);
  const L=Math.min(lvl,3);
  switch(type){
  case'archer':{R(g,cx-10,cy-8,20,16,'#4a3018');R(g,cx-9,cy-7,18,14,'#7a5630');R(g,cx-9,cy-7,18,2,'#9a7040');
    g.save();g.translate(cx,cy-2);g.rotate(ang);const pull=tw?clamp(1-tw.cd/(tw.s?tw.s.cd:1),0,1)*3:2;
    R(g,-9,-2,16,4,'#6b4423');R(g,-9,-2,16,1,'#8a5a2e');R(g,5,-12,3,4,'#7a4a20');R(g,7,-8,3,16,'#9b6a35');R(g,5,8,3,4,'#7a4a20');
    R(g,4-pull,-10,1,20,'#e8e8e8');R(g,-5-pull,-1,15,2,'#d8d8d8');R(g,10-pull,-2,3,4,'#8a8a8a');R(g,-7-pull,-2,3,4,'#e04040');
    if(lvl>=3){R(g,-5-pull,-5,15,2,'#d8d8d8');R(g,10-pull,-6,3,3,'#8a8a8a')}g.restore();break}
  case'ice':{const b=Math.sin(time*2.5)*1.5;g.globalAlpha=.35;g.drawImage(TX.light,cx-20,cy-28,40,40);g.globalAlpha=1;
    R(g,cx-11,cy+1,22,5,'#7ab8e8');R(g,cx-11,cy+1,22,1,'#bfe4ff');
    crystal(g,cx,cy+2+b*.3,8,22+L*2,'#bfe8ff','#8fc8f0');crystal(g,cx-8,cy+3,6,13+L,'#a8dcff','#78b0e0');crystal(g,cx+8,cy+3,6,14+L,'#a8dcff','#78b0e0');
    if(L>=2){crystal(g,cx-4,cy+4,4,9,'#d8f4ff','#a0d0f0');crystal(g,cx+4,cy+4,4,10,'#d8f4ff','#a0d0f0')}
    for(let i=0;i<3+L;i++){const a=time*1.5+i*2.1;R(g,cx+Math.cos(a)*14-1,cy-10+Math.sin(a)*5-1,2,2,'#ffffff')}break}
  case'tnt':{g.drawImage(TX.tntSide,X+30,Y+7,12,12);R(g,X+30,Y+7,12,2,'rgba(255,255,255,.2)');R(g,cx-9,cy-3,18,10,'#3c3c3c');R(g,cx-9,cy-3,18,2,'#5a5a5a');
    g.save();g.translate(cx-2,cy);g.rotate(ang);const rec=tw?Math.max(0,tw.recoil)*6:0;
    R(g,-8-rec,-5,20,10,'#2c2c2c');R(g,-8-rec,-5,20,2,'#565656');R(g,10-rec,-6,6,12,'#1c1c1c');R(g,11-rec,-4,4,8,'#000');
    R(g,-11-rec,-4,4,8,'#444');R(g,1-rec,-5,2,10,['#8a6a3a','#9a9a9a','#e8e8e8','#5decf5','#9a7ab0'][lvl]);g.restore();break}
  case'fire':{R(g,cx-12,cy-1,24,9,'#2a1a1a');R(g,cx-12,cy-1,24,2,'#5a3a3a');g.drawImage(TX.netherrack[0],cx-10,cy+1,20,5);
    g.globalAlpha=.45;g.drawImage(TX.glow,cx-22,cy-32,44,44);g.globalAlpha=1;
    for(let i=0;i<7;i++){const x=cx-9+i*2.6,h=6+(Math.sin(time*13+i*1.7)+1)*4+L*2;R(g,x,cy-h,3,h,'#ff6a10');R(g,x+.5,cy-h*.65,2,h*.65,'#ffb020');if(i%2)R(g,x+.5,cy-h-2,2,2,'#fff2a0')}break}
  case'piston':{g.save();g.translate(cx,cy-1);g.rotate(ang);const ext=tw&&tw.punch>0?Math.sin(tw.punch/.3*Math.PI)*15:0;
    g.drawImage(TX.cobble[0],-11,-11,22,22);g.strokeStyle='#222';g.lineWidth=1;g.strokeRect(-10.5,-10.5,21,21);
    R(g,8,-11,4,22,'#a2834f');R(g,9,-2,ext+1,4,'#c8a060');g.drawImage(TX.planks[0],10+ext,-12,5,24);R(g,10+ext,-12,5,24,'rgba(0,0,0,.15)');R(g,14+ext,-12,1,24,'#4a3a20');g.restore();break}
  case'potion':{R(g,cx-11,cy+2,22,4,'#5a5a5a');R(g,cx-11,cy+2,22,1,'#8a8a8a');R(g,cx-1.5,cy-17,3,20,'#8a7a5a');R(g,cx-3,cy-21,6,5,'#e0c050');R(g,cx-10,cy-9,20,2,'#6a6a6a');
    const cols=[['#a040c0','#d080f0'],['#40c060','#90f0a0'],['#c04040','#f09090'],['#4060e0','#90a8ff']];
    [[-12,-7],[6,-7],[-3,-3]].forEach(([dx,dy],i)=>{const cc=cols[(i+L)%4];R(g,cx+dx,cy+dy,6,8,'rgba(220,235,255,.65)');R(g,cx+dx+1,cy+dy+3,4,4,cc[0]);R(g,cx+dx+1,cy+dy+3,2,1,cc[1]);R(g,cx+dx+2,cy+dy-2,2,2,'#ddd')});
    for(let i=0;i<2;i++){const p=(time*.8+i*.5)%1;R(g,cx-1+Math.sin(time*3+i)*3,cy-22-p*10,2,2,`rgba(200,120,255,${1-p})`)}break}
  case'lightning':{const col=['#c8744a','#d08a5a','#e0a070','#7fd8c8','#7fd8c8'][lvl],hi=['#f0a080','#f5b890','#ffd0a0','#c0fff0','#c0fff0'][lvl];
    R(g,cx-7,cy-1,14,6,'#6a4a3a');R(g,cx-7,cy-1,14,1,'#8a6a5a');R(g,cx-2,cy-31,4,32,col);R(g,cx-2,cy-31,1,32,hi);R(g,cx-4,cy-34,8,4,col);R(g,cx-4,cy-34,8,1,hi);R(g,cx-5,cy-14,10,2,col);
    const charge=tw?clamp(1-tw.cd/(tw.s?tw.s.cd:1),0,1):.6;
    if(charge>.5||(time*8|0)%3===0){g.strokeStyle='rgba(180,240,255,.9)';g.lineWidth=1.5;g.beginPath();for(let k=0;k<2;k++){let x=cx,y=cy-32;g.moveTo(x,y);for(let s=0;s<4;s++){x+=rand(-5,5);y+=rand(-5,2);g.lineTo(x,y)}}g.stroke()}
    g.globalAlpha=.25+charge*.3;g.drawImage(TX.light,cx-14,cy-46,28,28);g.globalAlpha=1;break}
  case'ballista':{R(g,cx-11,cy-4,22,10,'#3a2a1a');R(g,cx-11,cy-4,22,2,'#5a4020');
    g.save();g.translate(cx,cy-1);g.rotate(ang);const loaded=!tw||tw.cd<(tw.s?tw.s.cd*.6:1);
    R(g,-15,-3,27,6,'#5a3a1e');R(g,-15,-3,27,2,'#7a5230');R(g,6,-17,4,34,'#3a2a1a');R(g,6,-17,4,3,'#aaa');R(g,6,14,4,3,'#aaa');
    g.strokeStyle='#ddd';g.lineWidth=1;g.beginPath();g.moveTo(8,-16);g.lineTo(loaded?-8:4,0);g.lineTo(8,16);g.stroke();
    if(loaded){R(g,-8,-1.5,25,3,'#cfcfcf');R(g,16,-3,5,6,'#7a7a7a');R(g,-9,-2,3,4,'#3070d0')}
    R(g,-4,-6,6,12,['#6a4a2a','#888','#ddd','#5decf5','#9a7ab0'][lvl]);g.restore();break}
  case'beacon':{const pul=.6+Math.sin(time*3)*.2;R(g,cx-12,cy-14,24,22,'rgba(190,235,255,.38)');g.strokeStyle='rgba(230,255,255,.9)';g.lineWidth=1;g.strokeRect(cx-11.5,cy-13.5,23,21);
    R(g,cx-12,cy+6,24,3,'#1c1530');g.drawImage(TX.diamond[0],cx-7,cy-9,14,13);g.globalAlpha=pul*.6;R(g,cx-7,cy-9,14,13,'#ffffff');g.globalAlpha=1;R(g,cx-10,cy-12,4,2,'rgba(255,255,255,.7)');break}
  case'anvil':{const hit=tw&&tw.healFx>0;R(g,cx-6,cy-2,12,9,'#3a3a3e');R(g,cx-10,cy+4,20,4,'#2e2e32');R(g,cx-13,cy-9,26,7,'#4a4a50');R(g,cx-13,cy-9,26,2,'#6a6a72');R(g,cx+9,cy-8,6,3,'#4a4a50');R(g,cx-4,cy-4,8,3,'#38383c');
    if(hit){R(g,cx-2,cy-14,4,4,'#ffe080');sparkleDot(g,cx,cy-16,time)}break}
  case'mine':{R(g,cx-12,cy-10,24,19,'#1a120a');R(g,cx-10,cy-8,20,15,'#050403');R(g,cx-12,cy-10,24,3,'#7a5630');R(g,cx-12,cy+6,24,3,'#7a5630');R(g,cx-12,cy-10,3,19,'#6a4a28');R(g,cx+9,cy-10,3,19,'#6a4a28');
    R(g,cx-6,cy-4,2,2,'#2fd15a');R(g,cx+3,cy+1,2,2,'#2fd15a');const pc=['#8a8a8a','#9a9a9a','#f5d63a','#5decf5','#6a5a6a'][lvl],pd=['#6a6a6a','#7a7a7a','#c8a020','#2aa8b0','#3a2a3a'][lvl];
    g.save();g.translate(cx+5,cy-1);g.rotate(Math.sin(time*6)*.7-.4);R(g,-1,-15,2,15,'#7a5230');R(g,-8,-17,16,3,pc);R(g,-9,-16,2,3,pd);R(g,7,-16,2,3,pd);g.restore();
    if(((time*2)|0)%2===0)drawPix(g,'emerald',cx-14,cy-20,1);break}
  case'conduit':{const a=time*1.6;g.globalAlpha=.35;g.drawImage(TX.glowC,cx-22,cy-32,44,44);g.globalAlpha=1;
    R(g,cx-9,cy-16,18,18,'#5a4a3a');R(g,cx-8,cy-15,16,16,'#8a7a5a');R(g,cx-6,cy-13,12,12,'#2a2a2a');
    const ex=Math.cos(a)*2;R(g,cx-4,cy-11,8,8,'#c8ecff');R(g,cx-2+ex,cy-9,4,4,'#1a4a8a');R(g,cx-1+ex,cy-8,1,1,'#fff');
    for(let i=0;i<4;i++){const an=a*.7+i*TAU/4;R(g,cx+Math.cos(an)*14-2,cy-7+Math.sin(an)*5-2,4,4,'#6dbaa8')}break}
  case'bell':{const sw=tw&&tw.ring>0?Math.sin(tw.ring*20)*.4*tw.ring:0;R(g,cx-12,cy-20,3,26,'#6a4a2a');R(g,cx+9,cy-20,3,26,'#6a4a2a');R(g,cx-12,cy-22,24,3,'#7a5630');
    g.save();g.translate(cx,cy-19);g.rotate(sw);R(g,-6,2,12,9,'#e8b830');R(g,-7,10,14,3,'#c89818');R(g,-4,3,3,6,'#fff2a0');R(g,-1,12,2,3,'#8a6a10');g.restore();break}
  case'calsensor':{R(g,cx-11,cy-4,22,11,'#0b2a33');R(g,cx-11,cy-4,22,2,'#14505a');R(g,cx-9,cy-1,18,6,'#0e3a44');
    const ch=tw?(tw.charge||0)/(tw.s?tw.s.charge:6):0;for(let i=0;i<4;i++){const x=cx-8+i*5,h=6+Math.sin(time*4+i)*1.5+ch*5;R(g,x,cy-4-h,2,h,ch>.5?'#7af8ff':'#2adfeb')}
    crystal(g,cx-6,cy-5,4,8,'#b88aec','#8a5ac8');crystal(g,cx+6,cy-5,4,9,'#b88aec','#8a5ac8');g.globalAlpha=.25+ch*.5;g.drawImage(TX.glowC,cx-18,cy-24,36,36);g.globalAlpha=1;break}
  case'eyepot':{const open=G&&(G.tod>.5||G.gazeT>0);R(g,cx-7,cy-2,14,9,'#8a4a2a');R(g,cx-8,cy-3,16,3,'#a8603a');R(g,cx-1,cy-14,2,12,'#7a8a72');
    if(open){g.globalAlpha=.45;g.drawImage(TX.glowO,cx-18,cy-34,36,36);g.globalAlpha=1;R(g,cx-7,cy-20,14,7,'#ff9a2a');R(g,cx-5,cy-22,10,11,'#ff9a2a');R(g,cx-3,cy-19,6,5,'#fff0a0');R(g,cx-1,cy-18,2,3,'#3a1a00')}
    else{R(g,cx-4,cy-21,8,8,'#8a8f84');R(g,cx-3,cy-22,6,3,'#a0a69a');R(g,cx-1,cy-19,2,4,'#5a5f56')}break}
  case'resin':{g.drawImage(TX.resinb[0],cx-11,cy-12,22,16);R(g,cx-11,cy-12,22,2,'rgba(255,255,255,.2)');
    g.save();g.translate(cx,cy-6);g.rotate(ang);R(g,-3,-3,15,6,'#8a4a14');R(g,9,-4,5,8,'#5a2a08');const gl=tw&&tw.cd<.4;if(!gl){R(g,3,-2,5,4,'#ffa040');R(g,4,-2,2,1,'#ffd090')}g.restore();break}
  case'soulfire':{R(g,cx-12,cy,24,4,'#4a3a2a');R(g,cx-10,cy-3,20,4,'#5a4a32');R(g,cx-12,cy,24,1,'#7a6a4a');g.globalAlpha=.5;g.drawImage(TX.glowC,cx-24,cy-34,48,48);g.globalAlpha=1;
    for(let i=0;i<6;i++){const x=cx-8+i*3,h=7+(Math.sin(time*11+i*1.9)+1)*4+L*2;R(g,x,cy-3-h,3,h,'#2ab8d8');R(g,x+.5,cy-3-h*.6,2,h*.6,'#8af0ff');if(i%2)R(g,x+.5,cy-5-h,2,2,'#e0ffff')}break}
  case'anchor':{g.drawImage(TX.cryobs[0],cx-11,cy-12,22,18);R(g,cx-11,cy-12,22,2,'rgba(255,255,255,.12)');const ch=tw?tw.charges||0:1,mx=tw&&tw.s?tw.s.charges:1;
    for(let i=0;i<4;i++){const on=i<ch;R(g,cx-8+i*4.5,cy-9,3,3,on?'#ffd070':'#3a2a4a');if(on&&((time*3+i)|0)%2)R(g,cx-8+i*4.5,cy-9,3,1,'#fff6c0')}
    R(g,cx-6,cy-4,12,6,'#1a1030');if(ch>0){g.globalAlpha=.35;g.drawImage(TX.glowP,cx-16,cy-22,32,32);g.globalAlpha=1}break}
  case'shulker':{const op=tw&&tw.cd<.5?1:0;R(g,cx-11,cy-6,22,12,'#8a5a8e');R(g,cx-11,cy-6,22,2,'#b07ab4');R(g,cx-11,cy-14+(op?-3:0),22,8,'#9a6a9e');R(g,cx-11,cy-14+(op?-3:0),22,2,'#c090c4');
    if(op){R(g,cx-5,cy-7,10,5,'#f0e8a0');R(g,cx-3,cy-6,2,2,'#2a2a2a');R(g,cx+1,cy-6,2,2,'#2a2a2a')}break}
  case'chorus':{R(g,cx-1.5,cy-18,3,20,'#6a4a7a');R(g,cx-8,cy-12,7,3,'#6a4a7a');R(g,cx-9,cy-19,3,8,'#6a4a7a');R(g,cx+1,cy-8,7,3,'#6a4a7a');R(g,cx+6,cy-15,3,8,'#6a4a7a');
    R(g,cx-10,cy-23,5,5,'#c8a0d8');R(g,cx+5,cy-19,5,5,'#c8a0d8');R(g,cx-3,cy-23,6,6,'#d8b8e8');g.globalAlpha=.3+.15*Math.sin(time*3);g.drawImage(TX.glowP,cx-16,cy-34,32,32);g.globalAlpha=1;break}
  case'echogolem':{drawEchoGolem(g,cx,cy+6,1,time,tw&&tw.cd<.3?1:0,'#7af0e8','#4a6a6e');break}
  case'blubhut':{R(g,cx-12,cy-6,24,12,'#d86c66');R(g,cx-12,cy-6,24,3,'#f08a84');R(g,cx-6,cy-3,12,7,'#3a1a1a');R(g,cx-12,cy+3,24,3,'#2a8a80');
    const peek=Math.sin(time*2)>0;if(peek){R(g,cx-5,cy-9,10,8,'#7ab0e0');R(g,cx-4,cy-13,2,5,'#7ab0e0');R(g,cx+2,cy-13,2,5,'#7ab0e0');R(g,cx-3,cy-6,2,1,'#2a1a5a');R(g,cx+1,cy-6,2,1,'#2a1a5a')}break}
  }
  if(tw)drawTowerStatus(g,tw,X,Y,cx,time);
}
function sparkleDot(g,x,y,t){const a=(t*6|0)%2;R(g,x-2,y,5,1,a?'#fff':'#ffe080');R(g,x,y-2,1,5,a?'#fff':'#ffe080')}
/* kule üstü durum efektleri */
function drawTowerStatus(g,tw,X,Y,cx,time){
  const f=tw.fx;if(!f)return;
  if(f.silkT>0){g.fillStyle='rgba(245,245,240,.75)';g.fillRect(X+6,Y+4,36,40);g.strokeStyle='rgba(200,200,190,.9)';g.lineWidth=1;for(let i=0;i<6;i++){g.beginPath();g.moveTo(X+6,Y+8+i*6);g.lineTo(X+42,Y+10+i*6+(i%2?3:-3));g.stroke()}}
  else if(f.amberT>0){g.fillStyle='rgba(255,160,40,.55)';g.fillRect(X+4,Y+2,40,44);g.strokeStyle='rgba(255,200,90,.9)';g.lineWidth=2;g.strokeRect(X+5,Y+3,38,42);R(g,X+9,Y+7,6,3,'rgba(255,240,190,.8)')}
  else if(f.frozenT>0){g.fillStyle='rgba(175,225,255,.45)';g.fillRect(X+5,Y+4,38,42);g.strokeStyle='rgba(230,250,255,.9)';g.lineWidth=1;g.strokeRect(X+5.5,Y+4.5,37,41)}
  else if(f.mossT>0){g.fillStyle='rgba(170,180,160,.7)';g.fillRect(X+5,Y+2,38,22);for(let i=0;i<6;i++)R(g,X+7+i*6,Y+24,3,4+(i*7)%9,'rgba(170,180,160,.8)')}
  if(f.levT>0){g.fillStyle='rgba(210,170,255,.35)';for(let i=0;i<3;i++){const p=(time*1.5+i/3)%1;g.fillRect(X+10+i*12,Y+44-p*36,3,3)}}
  if(f.resinT>0){g.fillStyle='rgba(230,120,30,.55)';g.fillRect(X+8,Y+24,32,10);R(g,X+12,Y+33,3,5,'rgba(230,120,30,.6)');R(g,X+30,Y+33,3,7,'rgba(230,120,30,.6)')}
  if(f.dotT>0){const c=f.dotK==='wither'?'#2a2a2a':f.dotK==='burn'?'#ff8a20':'#7ae04a';if(Math.random()<.2)addP({x:X+rand(10,38),y:Y+rand(6,30),vx:0,vy:-18,life:.5,max:.5,sz:2,c,g:0})}
  if(f.slowT>0)R(g,X+6,Y+44,36,2,'rgba(140,200,255,.8)');
  if(f.weakT>0)R(g,X+6,Y+46,36,2,'rgba(150,60,160,.9)');
  if(f.darkT>0){g.fillStyle='rgba(0,10,20,.35)';g.fillRect(X+4,Y+4,40,42)}
  if(tw.stunT>0){R(g,X+4,Y+6,40,40,'rgba(30,30,60,.3)');for(let i=0;i<3;i++){const a=time*4+i*2.1;R(g,cx+Math.cos(a)*10-2,Y+2+Math.sin(a)*3-2,4,4,'#ffe040')}}
}
function drawEchoGolem(g,x,y,s,time,sing,soulCol,bodyCol){
  g.save();g.translate(x,y);g.scale(s,s);
  R(g,-9,-20,18,20,bodyCol);R(g,-9,-20,18,2,'rgba(255,255,255,.15)');R(g,-9,-2,18,2,'rgba(0,0,0,.3)');
  g.strokeStyle='rgba(20,40,40,.6)';g.lineWidth=1;g.strokeRect(-6.5,-14.5,13,9);g.strokeRect(-3.5,-11.5,7,3);
  R(g,-7,-17,4,2,soulCol);R(g,3,-17,4,2,soulCol);R(g,-2,-9,4,3,'#d8e8e8');
  R(g,-11,-14,2,8,bodyCol);R(g,9,-14,2,8,bodyCol);
  g.globalAlpha=.85;R(g,-7,-31,14,12,soulCol);g.globalAlpha=1;R(g,-7,-31,14,2,'rgba(255,255,255,.55)');R(g,-5,-28,4,4,'rgba(255,255,255,.4)');
  if(sing){g.globalAlpha=.35+.25*Math.sin(time*12);g.drawImage(TX.glowC,-20,-46,40,40);g.globalAlpha=1}
  g.restore()}
function drawWeb(g,X,Y,a){g.save();g.globalAlpha=a;g.strokeStyle='rgba(235,235,235,.85)';g.lineWidth=1.2;const cx=X+24,cy=Y+24;g.beginPath();
  for(let i=0;i<8;i++){const an=i/8*TAU;g.moveTo(cx,cy);g.lineTo(cx+Math.cos(an)*21,cy+Math.sin(an)*21)}
  for(const rr of[6,12,18]){for(let i=0;i<=8;i++){const an=i/8*TAU,x=cx+Math.cos(an)*rr,y=cy+Math.sin(an)*rr;i?g.lineTo(x,y):g.moveTo(x,y)}}g.stroke();g.restore()}
function drawMine(g,X,Y){g.drawImage(TX.tntSide,X+15,Y+17,18,18);R(g,X+12,Y+14,24,22,'rgba(0,0,0,.25)');R(g,X+13,Y+15,22,19,'#8f8f8f');R(g,X+13,Y+15,22,2,'#b5b5b5');R(g,X+13,Y+32,22,2,'#5f5f5f');R(g,X+22,Y+22,4,4,'#d42e1c')}
