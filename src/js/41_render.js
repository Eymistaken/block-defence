/* ============================ ÇİZİM: SAHNE ============================ */
function drawEnemy(g,e){
  const d=e.def,S=enemyScale(d)*(e.grow||1),fly=d.flying;let y=e.y+8;
  if(fly){y=e.y-10+Math.sin(e.t*3)*3;if(d.boss)y-=16}
  if(e.swoop){const f=Math.sin(Math.min(1,e.swoop.t/.6)*Math.PI);y=lerp(y,e.swoop.tw.y,f*.7)}
  y-=e.levH||0;
  if(e.burrowT>0){R(g,e.x-14,e.y+2,28,8,'rgba(90,80,30,.7)');for(let i=0;i<3;i++)R(g,e.x-10+i*8+rand(-1,1),e.y-1,4,4,'#a8a040');return}
  const sw=(d.draw==='spider'?10:d.draw==='dragon'?14:d.draw==='slime'?5.5:d.draw==='quad'?9:5)*S*(fly?.6:1);
  if(!e.levH){g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(e.x,e.y+8,sw,sw*.35,0,0,TAU);g.fill()}
  else{g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(e.x,e.y+8,sw*.7,sw*.25,0,0,TAU);g.fill()}
  g.save();g.translate(e.x+(e.sway>0?Math.sin(e.sway*40)*2:0),y);let sc=S;if(e.fuse>0)sc*=1+((d.creeper?d.creeper.fuse:1.3)-e.fuse)*.14;g.scale(e.dir*sc,sc);
  let alpha=1;if(d.camo&&!(e.glowT>0)&&!(e.revealT>0))alpha=.42+.12*Math.sin(e.t*4);if(e.invisT>0)alpha=.18;if(d.illusion)alpha=.75;
  if(d.vibCamo&&!(e.revealT>0)&&!(G.revealT>0))alpha=.15;
  g.globalAlpha=alpha;
  FL=e.flash>0?'rgba(255,30,30,.55)':e.freezeT>0?'rgba(160,220,255,.55)':e.calmT>0?'rgba(255,150,220,.35)':e.rootT>0?'rgba(230,120,30,.3)':null;
  try{EDRAW[d.draw](g,e,G.time)}catch(err){}
  FL=null;g.restore();g.globalAlpha=1;
  const hh=(d.h||20)*S;
  if(d.omen){g.globalAlpha=.25+.1*Math.sin(G.time*4);g.drawImage(TX.glowP,e.x-hh*.5,y-hh,hh,hh);g.globalAlpha=1}
  if(e.glowT>0){g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1;g.strokeRect(e.x-6*S,y-hh-1,12*S,hh+2)}
  if(e.freezeT>0){g.fillStyle='rgba(175,225,255,.32)';g.fillRect(e.x-7*S,y-hh-2,14*S,hh+4)}
  else if(e.stunT>0||e.twitchT>0){for(let i=0;i<3;i++){const a=G.time*5+i*2.1;R(g,e.x+Math.cos(a)*8-1.5,y-hh-4+Math.sin(a)*2,3,3,'#ffe040')}}
  if(e.admireT>0){drawPix(g,'goldingot',e.x-10,y-hh-12,2)}
  if(e.calmT>0)R(g,e.x-6,y-hh-8,12,2,'#ff9ad8');
  if(e.slow>0&&e.freezeT<=0)R(g,e.x-5,e.y+9,10,2,'rgba(140,200,255,.7)');
  if(e.weakT>0)R(g,e.x-5,e.y+12,10,2,'rgba(120,40,160,.8)');
  if(e.linkBuff>0||e.buffT>0){g.strokeStyle='rgba(255,224,96,.7)';g.lineWidth=1;g.beginPath();g.arc(e.x,y-hh/2,hh*.6,0,TAU);g.stroke()}
  if(e.lifelink&&e.lifelink.alive){g.strokeStyle='rgba(255,224,96,.8)';g.lineWidth=2;g.beginPath();g.moveTo(e.x,y-hh*.6);g.lineTo(e.lifelink.x,e.lifelink.y-10);g.stroke()}
  if(e.laserTw&&G.towers.includes(e.laserTw)){const f=1-Math.max(0,e.laserT||0)/(e.laserMax||1.6);g.strokeStyle=`rgba(${d.pal==='elder'?'200,120,255':'255,90,60'},${.3+f*.7})`;g.lineWidth=1+f*3;g.beginPath();g.moveTo(e.x,y-hh*.6);g.lineTo(e.laserTw.x,e.laserTw.y-12);g.stroke()}
  if(e.shriekT>0){g.globalAlpha=.5;g.drawImage(TX.glowC,e.x-30,y-hh-20,60,60);g.globalAlpha=1}
  if(e.cast>0&&d.draw==='warden'){const f=1-e.cast/1.3;g.strokeStyle=`rgba(60,230,255,${f})`;g.lineWidth=2;g.beginPath();g.arc(e.x,y-hh*.55,10+f*14,0,TAU);g.stroke()}
}
function enemyTopY(e){const d=e.def,S=enemyScale(d)*(e.grow||1);let y=e.y+8;if(d.flying){y=e.y-10+Math.sin(e.t*3)*3;if(d.boss)y-=16}return y-(d.h||20)*S-(e.levH||0)}
function drawGolem(g,gm){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(gm.x,gm.y+8,12,4,0,0,TAU);g.fill();
  g.save();g.translate(gm.x,gm.y+8);g.scale(gm.dir*2.3,2.3);FL=gm.life<3&&((G.time*8)|0)%2?'rgba(255,255,255,.3)':null;humanoid(g,gm,PAL.golem,G.time);FL=null;g.restore();
  R(g,gm.x-14,gm.y-48,28,4,'#000');R(g,gm.x-13,gm.y-47,26*Math.max(0,gm.life)/18,2,'#9a9a9a')}
function drawProj(g,p){
  g.save();
  switch(p.k){
  case'arrow':g.translate(p.x,p.y);g.rotate(p.ang||0);R(g,-8,-1,12,2,'#d8d8d8');R(g,4,-2,3,4,'#8a8a8a');R(g,-9,-2,3,4,'#e04040');break;
  case'ice':g.translate(p.x,p.y);g.rotate(p.ang||0);R(g,-5,-2,10,4,'#9fd4ff');R(g,-2,-3,5,6,'#e8f8ff');break;
  case'fire':g.globalAlpha=.6;g.drawImage(TX.glow,p.x-14,p.y-14,28,28);g.globalAlpha=1;R(g,p.x-4,p.y-4,8,8,'#ff6a10');R(g,p.x-2.5,p.y-2.5,5,5,'#ffd040');break;
  case'resin':R(g,p.x-4,p.y-4,8,8,'#e87820');R(g,p.x-2,p.y-3,3,2,'#ffc070');break;
  case'shulker':g.globalAlpha=.5;g.drawImage(TX.glowW,p.x-10,p.y-10,20,20);g.globalAlpha=1;R(g,p.x-3,p.y-3,6,6,'#f8f0c0');R(g,p.x-1,p.y-1,2,2,'#c8a8e8');break;
  case'tnt':case'potion':{const f=Math.min(1,p.t/p.T),gx=lerp(p.sx,p.ex,f),gy=lerp(p.sy,p.ey,f);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(gx,gy+6,6,2.5,0,0,TAU);g.fill();
    g.translate(p.x,p.y);g.rotate(p.rot);if(p.k==='tnt'){g.drawImage(TX.tntSide,-7,-7,14,14);R(g,-1,-10,2,3,'#555');R(g,-1,-12,2,2,((G.time*20)|0)%2?'#ffe060':'#ff8020')}
    else{R(g,-3,-3,6,7,'rgba(220,235,255,.85)');R(g,-2,0,4,4,p.col);R(g,-1,-6,2,3,'#ccc')}break}
  case'bolt':g.translate(p.x,p.y);g.rotate(p.ang);R(g,-14,-1.5,26,3,'#cfcfcf');R(g,12,-3,6,6,'#777');R(g,-16,-2.5,4,5,'#3070d0');break;
  }
  g.restore();
}
function drawEProj(g,p){if(p.delay>0)return;const a=Math.atan2(p.ty-p.y,p.tx-p.x);g.save();g.translate(p.x,p.y);
  switch(p.k){
  case'arrow':case'curse':case'bolt':g.rotate(a);R(g,-7,-1,10,2,p.k==='curse'?'#c060ff':p.k==='bolt'?'#a8a8a8':'#cfcfcf');R(g,3,-2,3,4,'#777');break;
  case'trident':g.rotate(a);R(g,-9,-1,14,2,'#3aa0a0');R(g,5,-3,4,1,'#5ad8d0');R(g,5,2,4,1,'#5ad8d0');R(g,5,-1,5,2,'#5ad8d0');break;
  case'iceball':R(g,-4,-4,8,8,'#e8f6ff');R(g,-2,-2,3,3,'#b8e0ff');break;
  case'potion':g.rotate(p.rot);R(g,-3,-3,6,7,'rgba(220,235,255,.85)');R(g,-2,0,4,4,'#5a6ad8');break;
  case'fireball':g.globalAlpha=.7;g.drawImage(TX.glow,-18,-18,36,36);g.globalAlpha=1;R(g,-7,-7,14,14,'#3a2010');R(g,-5,-5,10,10,'#ff7a10');R(g,-2,-2,4,4,'#ffe040');break;
  case'smallfire':g.globalAlpha=.6;g.drawImage(TX.glow,-10,-10,20,20);g.globalAlpha=1;R(g,-3,-3,6,6,'#ff8a20');break;
  case'skull':g.rotate(p.rot*.3);R(g,-5,-5,10,10,'#2a2a2e');R(g,-3,-2,2,2,'#e8e8e8');R(g,1,-2,2,2,'#e8e8e8');break;
  case'soulball':g.globalAlpha=.7;g.drawImage(TX.glowC,-16,-16,32,32);g.globalAlpha=1;R(g,-5,-5,10,10,'#3ae8ff');R(g,-2,-2,4,4,'#e0ffff');break;
  case'bullet':g.globalAlpha=.5;g.drawImage(TX.glowW,-10,-10,20,20);g.globalAlpha=1;R(g,-3,-3,6,6,'#f8f0c0');R(g,-1,-1,2,2,'#a070c0');break;
  case'dart':g.rotate(a+p.rot);R(g,-4,-1,8,2,'#4ac8e8');R(g,-1,-4,2,8,'#2e6aa8');break;
  case'wind':g.strokeStyle='rgba(220,230,255,.9)';g.lineWidth=1.5;g.beginPath();g.arc(0,0,5,p.rot,p.rot+4.5);g.stroke();break;
  case'shard':g.rotate(a);crystal(g,0,3,5,10,'#e8d0ff','#b0c8ff');break;
  case'feather':g.rotate(a);R(g,-6,-1,12,2,'#6af0d0');R(g,-6,-2,5,1,'#bfffee');break;
  default:R(g,-3,-3,6,6,'#fff');
  }g.restore()}
/* yol sonundaki yapı (korunan şey) */
function drawBase(g,T){
  const k=G.baseKind,b=G.base,pe=G.paths[0].pts[G.paths[0].pts.length-1],off=pe.x>W||pe.x<0||pe.y<0||pe.y>H;
  const bx=off?clamp(pe.x,24,W-24):b.x,by=off?clamp(pe.y,24,H-24):b.y;
  const portal=(x,y,w,h,c1,c2)=>{R(g,x-w/2-5,y-h/2-5,w+10,h+10,'#140c22');g.drawImage(TX.obsidian[0],x-w/2-5,y-h/2-5,w+10,5);g.drawImage(TX.obsidian[1],x-w/2-5,y+h/2,w+10,5);g.drawImage(TX.obsidian[0],x-w/2-5,y-h/2,5,h);g.drawImage(TX.obsidian[1],x+w/2,y-h/2,5,h);
    for(let i=0;i<14;i++){const yy=((T*30+i*13)%h),xx=(Math.sin(T*2+i)*.5+.5)*w;R(g,x-w/2+xx-2,y-h/2+yy-2,4,4,i%2?c1:c2)}g.globalAlpha=.25;R(g,x-w/2,y-h/2,w,h,c1);g.globalAlpha=1};
  switch(k){
  case'village':if(off&&pe.x>W){const Y=pe.y-TILE/2;R(g,W-14,Y-4,6,TILE+8,'#6b4a28');R(g,W-14,Y-4,6,3,'#8a6a3a');R(g,W-20,Y+10,18,4,'#7a5630');R(g,W-20,Y+30,18,4,'#7a5630');R(g,W-14,Y-14,6,10,'#5a3a1e');R(g,W-14,Y+TILE+4,6,10,'#5a3a1e')}
    else if(!off){R(g,bx-20,by-20,40,40,'#6b4a28');R(g,bx-16,by-16,32,32,'#8a6a3a')}break;
  case'bell':R(g,bx-46,by-46,92,92,'rgba(0,0,0,.2)');R(g,bx-30,by-36,4,40,'#6a4a2a');R(g,bx+26,by-36,4,40,'#6a4a2a');R(g,bx-34,by-40,68,6,'#4a3018');
    {const sw=Math.sin(T*2)*.15;g.save();g.translate(bx,by-34);g.rotate(sw);R(g,-10,2,20,16,'#e8b830');R(g,-12,16,24,4,'#c89818');R(g,-6,4,4,10,'#fff2a0');g.restore()}
    R(g,bx-20,by+8,40,14,'#7a7a7a');R(g,bx-16,by+10,32,8,'#3a60c0');break;
  case'portal':if(off){portal(W-18,pe.y,22,40,'#a040ff','#6a10c0')}else portal(bx,by,40,56,'#a040ff','#6a10c0');break;
  case'gateway':{const x=off?W-24:bx,y=off?pe.y:by;R(g,x-27,y-27,54,54,'#1a1030');g.drawImage(TX.bonebk?TX.obsidian[0]:TX.obsidian[0],x-27,y-27,54,6);
    R(g,x-22,y-22,44,44,'#05020a');for(let i=0;i<14;i++){const h=hashStr('g'+i),sx=h%40-20,sy=(h>>6)%40-20,tw=.4+.6*Math.abs(Math.sin(T*(1+(h%5)*.3)+i));R(g,x+sx,y+sy,2,2,`rgba(${200+(h%55)},${160+(h>>4)%80},255,${tw})`)}
    for(let i=0;i<10;i++){const a=T*1.5+i*.63,rr=10+((i*7)%14);R(g,x+Math.cos(a)*rr-2,y+Math.sin(a)*rr-2,4,4,i%2?'#a040ff':'#6a10c0')}break}
  case'ancient':{const open=G.over&&G.won;g.fillStyle=open?'rgba(255,150,220,.25)':'rgba(41,223,235,.12)';g.fillRect(bx-70,by-50,140,90);
    R(g,bx-62,by-44,124,8,'#2a3a38');R(g,bx-62,by-44,10,84,'#2a3a38');R(g,bx+52,by-44,10,84,'#2a3a38');for(let i=0;i<4;i++)R(g,bx-48+i*28,by-52,8,10,'#2a3a38');
    if(open){const fr=Math.floor(T*6)%6;g.drawImage(TX.rift[fr],bx-52,by-36,104,72)}else{R(g,bx-52,by-36,104,72,'rgba(5,10,14,.85)');for(let i=0;i<8;i++){const a=T+i;R(g,bx-48+((i*29)%96),by-32+((i*17+T*10)%64),2,2,'rgba(41,223,235,.6)')}}break}
  case'singer':case'singerportal':case'rift':{const x=off?W-26:bx,y=off?pe.y+8:by+8;
    if(k!=='singer'||off){g.globalAlpha=.55+.2*Math.sin(T*2);R(g,x-22,y-62,44,52,'#bff8ff');g.globalAlpha=1;g.strokeStyle='#e8ffff';g.lineWidth=2;g.strokeRect(x-22,y-62,44,52);
      for(let i=0;i<6;i++){R(g,x-20+((i*13+T*20)%40),y-60+((i*23)%48),3,3,'rgba(255,255,255,.7)')}glowAt(g,x,y-36,90,TX.glowC,.5)}
    if(k!=='rift')singerDraw(g,x,y,T,1.5);break}
  }
}
function drawStartPortals(g,T){for(const P of G.paths){if(P.lava)continue;const p=P.pts[0];if(p.x<0||p.y<0||p.x>W||p.y>H)continue;
  const x=p.x,y=p.y-10;R(g,x-17,y-27,34,46,'#140c22');g.drawImage(TX.obsidian[0],x-17,y-27,34,5);g.drawImage(TX.obsidian[0],x-17,y-27,5,46);g.drawImage(TX.obsidian[1],x+12,y-27,5,46);
  for(let i=0;i<10;i++){const yy=((T*30+i*13)%36),xx=(Math.sin(T*2+i)*.5+.5)*20;R(g,x-10+xx,y-22+yy,3,3,i%2?'#a040ff':'#6a10c0')}}}
function render(){
  const g=ctx,B=G.biome,T=G.time;g.imageSmoothingEnabled=false;
  g.save();if(G.shake>0)g.translate(Math.round(rand(-G.shake,G.shake)*.5),Math.round(rand(-G.shake,G.shake)*.5));
  g.drawImage(bgCanvas,0,0);
  const fr=Math.floor(T*3)%4,wtx=TX[B.liquid||'water'];
  for(const a of G.animTiles){const X=a.x*TILE,Y=a.y*TILE;
    if(a.t==='water')g.drawImage(wtx[fr],X,Y,TILE,TILE);
    else if(a.t==='lava'){g.drawImage(TX.lava[Math.floor(T*2)%4],X,Y,TILE,TILE);if(Math.random()<.004)addP({x:X+rand(4,44),y:Y+rand(4,44),vx:rand(-20,20),vy:rand(-90,-40),life:.7,max:.7,sz:2,c:'#ffb030',g:150})}
    else if(a.t==='ichor'){g.drawImage(TX.ichor[Math.floor(T*4)%6],X,Y,TILE,TILE);if(Math.random()<.006)addP({x:X+rand(6,42),y:Y+rand(6,42),vx:0,vy:-12,life:.8,max:.8,sz:2,c:'#ffffff',g:0,star:true})}
    else if(a.t==='acid')g.drawImage(TX.acid[fr],X,Y,TILE,TILE);
    else if(a.t==='rift')g.drawImage(TX.rift[Math.floor(T*3)%6],X,Y,TILE,TILE);
    else if(a.t==='chasm'){R(g,X,Y,TILE,TILE,'#020406');const up=cell(a.x,a.y-1);if(up&&up.t!=='chasm'){g.drawImage(TX.deep[0],0,0,16,5,X,Y,TILE,10);R(g,X,Y,TILE,10,'rgba(0,0,0,.5)')}if(((T*2+a.x)|0)%5===0)R(g,X+20,Y+24,2,2,'rgba(41,223,235,.4)')}
    else{R(g,X,Y,TILE,TILE,'#05020a');for(let i=0;i<4;i++){const h=hashStr(a.x+','+a.y+','+i),sx=h%44+2,sy=(h>>8)%44+2,tw=.4+.6*Math.abs(Math.sin(T*(1+(h%5)*.3)+i));R(g,X+sx,Y+sy,2,2,`rgba(${200+(h%55)},${160+(h>>4)%80},255,${tw})`)}
      const up=cell(a.x,a.y-1);if(up&&up.t!=='void'){g.drawImage(TX.endstone[0],0,0,16,5,X,Y,TILE,12);R(g,X,Y,TILE,12,'rgba(0,0,0,.45)');R(g,X,Y+12,TILE,3,'rgba(0,0,0,.6)')}}
    if(a.t==='water'||a.t==='lava'||a.t==='acid'||a.t==='ichor'){for(const[i,j]of[[0,-1],[-1,0]]){const n=cell(a.x+i,a.y+j);if(n&&n.t!==a.t){if(j)R(g,X,Y,TILE,4,'rgba(0,0,0,.28)');else R(g,X,Y,4,TILE,'rgba(0,0,0,.22)')}}}}
  drawObstacleOverlays(g,T);drawStartPortals(g,T);drawBase(g,T);
  for(const tr of G.traps){const X=tr.tx*TILE,Y=tr.ty*TILE;if(tr.type==='web')drawWeb(g,X,Y,clamp(Math.min(tr.life/8,tr.dur/4),.25,1));else drawMine(g,X,Y)}
  for(const c of G.clouds){const a=clamp(c.t/c.max*1.5,0,1)*.28;g.globalAlpha=a;g.fillStyle=c.col;g.beginPath();g.arc(c.x,c.y,c.r,0,TAU);g.fill();g.globalAlpha=a*1.5;g.strokeStyle=c.col;g.lineWidth=2;g.stroke();g.globalAlpha=1}
  for(const f of G.floods){g.globalAlpha=.35*clamp(f.t,0,1);g.drawImage(TX.ichor[Math.floor(T*4)%6],f.x-f.r,f.y-f.r,f.r*2,f.r*2);g.globalAlpha=1}
  if(G.baits)for(const b of G.baits){drawPix(g,'goldingot',b.x-10,b.y-6,2);g.strokeStyle='rgba(255,216,61,.3)';g.beginPath();g.arc(b.x,b.y,b.r*TILE,0,TAU);g.stroke()}
  if(G.fangs)for(const f of G.fangs){const h=Math.sin((1-f.t/.5)*Math.PI)*10;R(g,f.x-5,f.y-h,10,h+2,'#d8d0b8');R(g,f.x-5,f.y-h,10,2,'#fff8e0');R(g,f.x-3,f.y-h+3,2,3,'#2a2a2a')}
  if(G.rifts)for(const rf of G.rifts){const a=clamp(rf.t,0,1);g.globalAlpha=a;g.drawImage(TX.rift[Math.floor(T*6)%6],rf.x-24,rf.y-30,48,40);g.strokeStyle='#e8ffff';g.lineWidth=2;g.strokeRect(rf.x-24,rf.y-30,48,40);g.globalAlpha=1}
  if(SAVE.settings.showRanges&&!G.demo)for(const t of G.towers){if(t.s.range){g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1;g.beginPath();g.arc(t.x,t.y,t.s.range*TILE*towerRangeMul(t),0,TAU);g.stroke()}}
  if(G.sel){const t=G.sel,rr=(t.s.range?t.s.range*towerRangeMul(t):t.s.radius||0)*TILE;if(rr){const sup=TOWERS[t.type].support;g.fillStyle=sup?'rgba(120,240,255,.1)':'rgba(255,255,255,.09)';g.beginPath();g.arc(t.x,t.y,rr,0,TAU);g.fill();
    g.setLineDash([6,5]);g.strokeStyle=sup?'rgba(120,240,255,.8)':'rgba(255,255,255,.7)';g.lineWidth=2;g.stroke();g.setLineDash([])}
    g.strokeStyle='#fff';g.lineWidth=2;g.strokeRect(t.tx*TILE+2,t.ty*TILE+2,TILE-4,TILE-4)}
  if(G.place){g.strokeStyle='rgba(255,255,255,.07)';g.lineWidth=1;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(canPlace(G.place,x,y))g.strokeRect(x*TILE+.5,y*TILE+.5,TILE-1,TILE-1)}
  /* derinlik sıralı çizim */
  const list=[];
  for(const t of G.towers)list.push([t.y,0,t]);
  for(const e of G.enemies)if(!e.def.flying)list.push([e.y,1,e]);
  for(const gm of G.golems)list.push([gm.y,2,gm]);
  for(const b of G.blubs)list.push([b.y,3,b]);
  for(const b of G.blubBlocks)list.push([b.cy||b.y,4,b]);
  list.sort((a,b)=>a[0]-b[0]);
  for(const[,k,o]of list){if(k===0){drawTower(g,o.type,o.lvl,o.tx*TILE,o.ty*TILE,o.ang,T,o);if(o.hitT>0){g.fillStyle=`rgba(255,60,40,${o.hitT*2})`;g.fillRect(o.tx*TILE+4,o.ty*TILE+6,40,40)}}
    else if(k===1)drawEnemy(g,o);else if(k===2)drawGolem(g,o);
    else if(k===3){g.save();g.translate(o.x,o.y);g.scale(o.dir*1.6,1.6);blubDraw(g,o);g.restore();if(Math.random()<.004)sparkle(o.x,o.y-14,'#9ad8f0',1)}
    else{g.save();g.translate(o.cx||o.x,o.cy||o.y);g.scale(1.5,1.5);g.globalAlpha=o.life<1.5?.5+.5*Math.sin(T*20):1;blubDraw(g,{t:T,moving:!o.land});g.restore();g.globalAlpha=1}}
  g.globalCompositeOperation='lighter';
  for(const t of G.towers)if(t.type==='beacon'||t.type==='conduit'){const w=5+Math.min(t.lvl,3)*2,a=.28+Math.sin(T*3+t.x)*.08,col=t.type==='conduit'?'90,230,255':'150,240,255',gr=g.createLinearGradient(0,t.y-12,0,0);gr.addColorStop(0,`rgba(${col},${a*1.6})`);gr.addColorStop(1,`rgba(${col},${a*.4})`);g.fillStyle=gr;if(t.type==='beacon')g.fillRect(t.x-w/2,0,w,t.y-12)}
  if(G.appleT>0)for(const t of G.towers){g.globalAlpha=.25+.15*Math.sin(T*8);g.drawImage(TX.glow,t.x-24,t.y-30,48,48)}
  for(const c of G.crystals){g.globalAlpha=.5;g.drawImage(TX.glowP,c.x-30,c.y-50,60,60);for(const t of towersIn(c.x,c.y,2.5)){g.strokeStyle='rgba(255,150,240,.5)';g.lineWidth=2;g.beginPath();g.moveTo(c.x,c.y-24);g.lineTo(t.x,t.y-12);g.stroke()}}
  g.globalAlpha=1;g.globalCompositeOperation='source-over';
  for(const c of G.crystals){block3D(g,c.x-10,c.y-6,20,10,5,TX.obsidian[0]);g.save();g.translate(c.x,c.y-24+Math.sin(T*3)*3);g.rotate(T*2);R(g,-8,-8,16,16,'rgba(220,240,255,.5)');g.strokeStyle='#fff';g.strokeRect(-8,-8,16,16);R(g,-4,-4,8,8,'#e070c8');g.restore()}
  const fl=G.enemies.filter(e=>e.def.flying).sort((a,b)=>a.y-b.y);for(const e of fl)drawEnemy(g,e);
  for(const p of G.projs)drawProj(g,p);
  for(const p of G.eprojs)drawEProj(g,p);
  for(const d of G.drops){if(d.h>0){const s=clamp(1-d.h/400,.3,1);g.fillStyle=`rgba(0,0,0,${.3*s})`;g.beginPath();g.ellipse(d.x,d.y+6,9*s,3.5*s,0,0,TAU);g.fill()}
    if(d.bed){const X=d.x-12,Y=d.y-d.h-10;R(g,X,Y,24,10,'#c02828');R(g,X,Y,8,10,'#f0f0f0');R(g,X,Y+10,24,3,'#8a6a3a');if(d.h<=0&&((T*10)|0)%2)R(g,X,Y,24,13,'rgba(255,255,255,.5)');continue}
    const sz=d.mini?12:18,X=d.x-sz/2,Y=d.y-d.h-sz+4;g.drawImage(TX.tntSide,X,Y,sz,sz);g.drawImage(TX.tntTop,X,Y-sz*.35,sz,sz*.35);if(d.h<=0&&((T*10)|0)%2)R(g,X,Y-sz*.35,sz,sz*1.35,'rgba(255,255,255,.6)')}
  if(G.geysers)for(const gy of G.geysers){const f=1-gy.t;g.fillStyle=`rgba(255,120,30,${.3+f*.4})`;g.beginPath();g.ellipse(gy.x,gy.y+10,10+f*10,4+f*3,0,0,TAU);g.fill();if(Math.random()<.4)addP({x:gy.x+rand(-8,8),y:gy.y+8,vx:0,vy:-40,life:.4,max:.4,sz:2,c:gy.col,g:0})}
  if(G.vortex){const v=G.vortex;g.strokeStyle='rgba(180,120,255,.6)';g.lineWidth=2;for(let i=0;i<4;i++){g.beginPath();g.arc(v.x,v.y,v.r*(.3+i*.2),T*6+i,T*6+i+3.5);g.stroke()}}
  g.globalCompositeOperation='lighter';
  for(const bo of G.bolts){const a=clamp(bo.t/.2,0,1),cy=bo.col==='cyan';g.lineJoin='round';for(const[lw,col]of[[7,cy?`rgba(60,230,255,${.4*a})`:`rgba(90,160,255,${.4*a})`],[3,`rgba(200,240,255,${a})`],[1.2,`rgba(255,255,255,${a})`]]){g.strokeStyle=col;g.lineWidth=lw;g.beginPath();bo.pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke()}}
  for(const bm of G.beams){const a=clamp(bm.t/bm.max,0,1);if(bm.dash)g.setLineDash([4,4]);g.strokeStyle=`rgba(${bm.col},${a})`;g.lineWidth=bm.sonic?8*a+2:bm.wave?4:2;g.beginPath();g.moveTo(bm.x1,bm.y1);g.lineTo(bm.x2,bm.y2);g.stroke();g.setLineDash([]);
    if(bm.sonic){for(let i=0;i<6;i++){const f=(i/6+T*2)%1;g.beginPath();g.arc(lerp(bm.x1,bm.x2,f),lerp(bm.y1,bm.y2,f),6+a*6,0,TAU);g.stroke()}}}
  g.globalCompositeOperation='source-over';
  for(const rg of G.rings){const a=clamp(rg.t/.35,0,1);g.fillStyle=`rgba(${rg.col},${a*.25})`;g.beginPath();g.arc(rg.x,rg.y,Math.max(1,rg.r),0,TAU);g.fill();g.strokeStyle=`rgba(${rg.col},${a*.8})`;g.lineWidth=3;g.stroke()}
  for(const p of G.parts){const f=p.life/p.max;g.globalAlpha=p.smoke?(p.a||.75)*f:Math.min(1,f*2);const s=p.smoke?p.sz*(1+(1-f)*1.6):p.sz;
    if(p.star){R(g,p.x-s/2,p.y-.5,s,1.5,p.c);R(g,p.x-.5,p.y-s/2,1.5,s,p.c)}else R(g,p.x-s/2,p.y-s/2,s,s,p.c)}
  g.globalAlpha=1;
  if(G.mining){const m=G.mining,X=m.tx*TILE,Y=m.ty*TILE,f=m.prog/m.total;g.drawImage(TX.crack[clamp(Math.floor(f*10),0,9)],X+3,Y+3,42,34);
    g.save();g.translate(X+38,Y+6);g.rotate(Math.sin(T*16)*.6-.3);R(g,-1,-2,2,14,'#7a5230');R(g,-7,-4,14,3,'#5decf5');g.restore()}
  renderLighting(g,B);
  renderWeather(g);
  renderOverlays(g,B,T);
  for(const e of G.enemies){if(e.def.boss&&!e.roam||e.hp>=e.maxHp||e.def.illusion)continue;if(((e.def.vibCamo||e.invisT>0)&&!(e.revealT>0||e.glowT>0||G.revealT>0))||e.burrowT>0)continue;const w=e.roam?40:e.def.sz>1.2?30:22,top=enemyTopY(e)-6,f=clamp(e.hp/e.maxHp,0,1);
    R(g,e.x-w/2-1,top-1,w+2,5,'#000');R(g,e.x-w/2,top,w*Math.min(1,f),3,e.roam?'#29dfeb':f>.6?'#3ce03c':f>.3?'#ffd030':'#ff3a3a');if(e.def.armor)R(g,e.x-w/2,top+3,w,1,'#bbb')}
  if(SAVE.settings.hpBars)for(const t of G.towers){if(t.hp>=t.maxHp||TOWERS[t.type].trap)continue;const f=clamp(t.hp/t.maxHp,0,1),X=t.tx*TILE+6,Y=t.ty*TILE+44;R(g,X-1,Y-1,38,5,'#000');R(g,X,Y,36*f,3,f>.6?'#6ae05a':f>.3?'#e0c040':'#e04030')}
  g.textAlign='center';g.textBaseline='middle';
  for(const t of G.texts){g.globalAlpha=clamp(t.t/t.max*1.8,0,1);g.font=`${t.size+4}px VT323, monospace`;g.fillStyle='#000';g.fillText(t.txt,t.x+1.5,t.y+1.5);g.fillStyle=t.col;g.fillText(t.txt,t.x,t.y)}
  g.globalAlpha=1;
  for(const o of G.orbs){if(o.soul){R(g,o.x-3,o.y-3,6,6,'#0a3a5a');R(g,o.x-2,o.y-2,4,4,'#7fe8ff');continue}const p=.7+.3*Math.sin(T*20+o.x);R(g,o.x-3.5,o.y-3.5,7,7,'#2a4a00');R(g,o.x-2.5,o.y-2.5,5,5,`rgb(${200*p|0},255,80)`);R(g,o.x-1.5,o.y-1.5,2,2,'#f8ffc0')}
  if(G.place&&G.hover&&G.mouse.in){const{tx,ty}=G.hover,D=TOWERS[G.place],ok=canPlace(G.place,tx,ty)&&canAfford(towerCost(G.place,0));
    const L=D.lv[0],rr=(L.range?L.range*(1+perk('range')*.03):L.radius||0)*TILE;
    if(rr){g.fillStyle=ok?'rgba(255,255,255,.08)':'rgba(255,60,60,.08)';g.beginPath();g.arc(tx*TILE+24,ty*TILE+24,rr,0,TAU);g.fill();g.strokeStyle=ok?'rgba(255,255,255,.6)':'rgba(255,80,80,.6)';g.lineWidth=1.5;g.stroke()}
    g.globalAlpha=.65;drawTower(g,G.place,0,tx*TILE,ty*TILE,-Math.PI/2,T,null);g.globalAlpha=1;
    R(g,tx*TILE,ty*TILE,TILE,TILE,ok?'rgba(80,255,80,.16)':'rgba(255,50,50,.28)');g.strokeStyle=ok?'#7f7':'#f66';g.lineWidth=2;g.strokeRect(tx*TILE+1,ty*TILE+1,TILE-2,TILE-2)}
  else if(G.hover&&G.mouse.in&&!G.aim&&!G.demo){const c=cell(G.hover.tx,G.hover.ty);if(c&&(c.obs||c.tower)){g.strokeStyle=c.obs?(canMine(c)?'rgba(255,255,160,.8)':'rgba(255,120,80,.6)'):'rgba(255,255,255,.5)';g.lineWidth=1.5;g.strokeRect(G.hover.tx*TILE+1.5,G.hover.ty*TILE+1.5,TILE-3,TILE-3)}}
  if(G.mining){const m=G.mining,f=m.prog/m.total;R(g,m.tx*TILE+4,m.ty*TILE+43,40,5,'#000');R(g,m.tx*TILE+5,m.ty*TILE+44,38*f,3,'#7dff8f')}
  if(G.aim&&G.mouse.in){const x=G.mouse.x,y=G.mouse.y;if(G.aim.kind==='item'&&ITEMS[G.aim.id].use==='tower'){const c=cell(Math.floor(x/TILE),Math.floor(y/TILE));g.strokeStyle=c&&c.tower&&c.tower.lvl===3?'#c8a0ff':'#ff6060';g.lineWidth=3;g.strokeRect(Math.floor(x/TILE)*TILE+2,Math.floor(y/TILE)*TILE+2,TILE-4,TILE-4)}
    else{const rr=aimRadius()*TILE;g.setLineDash([5,4]);g.strokeStyle='rgba(255,140,40,.9)';g.lineWidth=2;g.beginPath();g.arc(x,y,rr,0,TAU);g.stroke();g.setLineDash([]);g.fillStyle='rgba(255,100,20,.12)';g.fill();R(g,x-8,y-1,16,2,'#ffa040');R(g,x-1,y-8,2,16,'#ffa040')}}
  if(G.flash>0){g.fillStyle=`rgba(${G.flashCol||'255,255,255'},${Math.min(.6,G.flash*1.6)})`;g.fillRect(0,0,W,H)}
  if(G.hurtFx>0){const gr=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);gr.addColorStop(0,'rgba(255,0,0,0)');gr.addColorStop(1,`rgba(255,0,0,${G.hurtFx})`);g.fillStyle=gr;g.fillRect(0,0,W,H)}
  g.restore();
}
function renderOverlays(g,B,T){
  if(G.biome.dn==='std'&&G.tod>.05&&G.tod<.95){g.fillStyle=`rgba(255,120,40,${.1*Math.sin(Math.PI*G.tod)})`;g.fillRect(0,0,W,H)}
  if(B.tint){g.fillStyle=B.tint;g.fillRect(0,0,W,H)}
  if(G.rain){g.fillStyle='rgba(20,30,60,.16)';g.fillRect(0,0,W,H)}
  if(G.sandT>0){g.fillStyle='rgba(220,190,120,.14)';g.fillRect(0,0,W,H)}
  if(B.dn==='pale'){g.fillStyle='rgba(200,200,200,.06)';g.fillRect(0,0,W,H)}
  if(B.sift){const tc=[[90,220,210,.04],[20,30,110,.16],[255,140,120,.09]][G.tide||0];g.fillStyle=`rgba(${tc[0]},${tc[1]},${tc[2]},${tc[3]})`;g.fillRect(0,0,W,H);
    /* aurora perdeleri */
    g.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const x=((T*14+i*230)%(W+200))-100,w=60+i*12,col=[[255,140,220],[120,255,200],[120,220,255],[255,200,150],[160,255,220]][i],a=(G.tide===1?.05:.08)+.03*Math.sin(T+i);
      const gr=g.createLinearGradient(0,0,0,H*.7);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.save();g.translate(x,0);g.transform(1,0,.25,1,0,0);g.fillRect(0,0,w,H*.7);g.restore()}
    g.globalCompositeOperation='source-over'}
  if(G.storm){g.fillStyle=`rgba(80,0,40,${.12+.05*Math.sin(T*3)})`;g.fillRect(0,0,W,H)}
  if(G.darkPulse>0){g.fillStyle=`rgba(0,0,0,${G.darkPulse*.35})`;g.fillRect(0,0,W,H)}
  if(G.gazeT>0){g.strokeStyle=`rgba(255,154,42,${.25+.1*Math.sin(T*6)})`;g.lineWidth=10;g.strokeRect(5,5,W-10,H-10)}
}
function renderLighting(g,B){
  let amb=B.amb||0,col=B.col||'6,10,38';
  if(B.dn==='std'){amb=G.tod*.62;col='6,10,38'}else if(B.dn==='pale'){amb=.14+G.tod*.5;col='20,20,30'}
  if(B.sift&&G.tide===1){amb=Math.max(amb,.42);col='8,14,50'}
  if(G.rain)amb=Math.max(amb,.22);
  if(G.darkT>0)amb=Math.min(.92,amb+G.darkAmt*.8*(.6+.4*Math.sin(G.time*3)));
  if(amb<.02)return;
  const L=lctx;L.globalCompositeOperation='source-over';L.globalAlpha=1;L.clearRect(0,0,LW,LH);L.fillStyle=`rgba(${col},${amb})`;L.fillRect(0,0,LW,LH);
  L.globalCompositeOperation='destination-out';
  const lt=(x,y,r,i)=>{L.globalAlpha=clamp(i,0,1);L.drawImage(TX.light,(x-r)/2,(y-r)/2,r,r)};
  for(const t of G.towers){const r=t.type==='beacon'?170:t.type==='fire'||t.type==='soulfire'?120:t.type==='lightning'||t.type==='conduit'?90:70;lt(t.x,t.y-8,r,.85);if(t.type==='beacon')for(let y=t.y-60;y>0;y-=70)lt(t.x,y,70,.6)}
  for(const a of G.animTiles)if(a.t==='lava')lt(a.x*TILE+24,a.y*TILE+24,90,.55);else if(a.t==='ichor')lt(a.x*TILE+24,a.y*TILE+24,80,.45);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=G.grid[y][x];if(c.torch)lt(x*TILE+24,y*TILE+18,130,.95);else if(c.obs&&OBS[c.obs].light)lt(x*TILE+24,y*TILE+20,c.obs==='cheart'&&G.tod<.5?40:80,.7)}
  for(const p of G.projs)if(p.k==='fire'||p.k==='shulker')lt(p.x,p.y,50,.7);
  for(const p of G.eprojs)if(p.k==='fireball'||p.k==='soulball')lt(p.x,p.y,70,.8);
  for(const e of G.enemies){const k=e.def.draw;if(k==='wisp'||k==='blaze')lt(e.x,e.y-14,70,.8);else if(e.def.pal==='magma'||e.def.pal==='bossMagma')lt(e.x,e.y,45*(e.def.sz||1),.5);
    else if(k==='warden')lt(e.x,e.y-30,60,.4);else if(e.def.pal==='cubozoa'||e.def.pal==='jellyQueen'||e.def.pal==='crawler'||k==='bearer')lt(e.x,e.y-10,50,.5)}
  for(const gm of G.golems)lt(gm.x,gm.y-20,60,.6);
  for(const l of G.lights)lt(l.x,l.y,l.r,l.i*(l.t/l.max));
  for(const bo of G.bolts)for(let i=0;i<bo.pts.length;i+=4)lt(bo.pts[i].x,bo.pts[i].y,70,.6);
  for(const c of G.crystals)lt(c.x,c.y-20,120,.8);
  lt(G.base.x,G.base.y,150,.9);
  if(G.mouse.in&&!G.demo)lt(G.mouse.x,G.mouse.y,60,.25);
  L.globalAlpha=1;L.globalCompositeOperation='source-over';
  g.imageSmoothingEnabled=true;g.drawImage(lightCanvas,0,0,W,H);g.imageSmoothingEnabled=false;
  if(amb>.2){g.globalCompositeOperation='lighter';g.globalAlpha=.35*amb;for(const a of G.animTiles)if(a.t==='lava')g.drawImage(TX.glow,a.x*TILE-24,a.y*TILE-24,96,96);
    for(const t of G.towers)if(t.type==='fire')g.drawImage(TX.glow,t.x-40,t.y-50,80,80);else if(t.type==='soulfire')g.drawImage(TX.glowC,t.x-40,t.y-50,80,80);g.globalAlpha=1;g.globalCompositeOperation='source-over'}
}
