/* ============================ EFEKTLER ============================ */
const PMAX=()=>SAVE.settings.particles==='high'?900:280;
function addP(p){if(G&&G.parts.length<PMAX())G.parts.push(p)}
function puff(x,y,c,n){for(let i=0;i<n;i++)addP({x:x+rand(-8,8),y:y+rand(-10,6),vx:rand(-30,30),vy:rand(-50,-10),life:rand(.4,.8),max:.8,sz:rand(3,6),c,g:0,smoke:true})}
function dust(x,y,c,n){for(let i=0;i<n;i++)addP({x:x+rand(-10,10),y:y+rand(-4,4),vx:rand(-50,50),vy:rand(-70,-10),life:rand(.3,.6),max:.6,sz:rand(2,4),c,g:260})}
function sparkle(x,y,c,n){for(let i=0;i<n;i++)addP({x:x+rand(-12,12),y:y+rand(-12,12),vx:rand(-20,20),vy:rand(-50,-15),life:rand(.4,.9),max:.9,sz:rand(2,3),c,g:0,star:true})}
const TEXDATA=new Map();
function blockBreak(x,y,tex){let d=TEXDATA.get(tex);if(!d){d=tex.getContext('2d').getImageData(0,0,16,16).data;TEXDATA.set(tex,d)}
  for(let i=0;i<18;i++){const px=Math.floor(Math.random()*16),py=Math.floor(Math.random()*16),k=(py*16+px)*4;addP({x:x+rand(-14,14),y:y+rand(-14,10),vx:rand(-90,90),vy:rand(-160,-40),life:rand(.5,.9),max:.9,sz:rand(3,5),c:`rgb(${d[k]},${d[k+1]},${d[k+2]})`,g:500})}}
function explodeFX(x,y,r,big){
  G.rings.push({x,y,r:0,max:r,t:.35,col:'255,240,200'});addLight(x,y,r*2.6,1);
  const n=big?26:12;for(let i=0;i<n;i++){const a=rand(0,TAU),sp=rand(20,r*1.6);addP({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-20,life:rand(.5,1.1),max:1.1,sz:rand(5,11),c:pick(['#e8e8e8','#bdbdbd','#9a9a9a','#fff']),g:-20,smoke:true})}
  for(let i=0;i<n;i++){const a=rand(0,TAU),sp=rand(80,260);addP({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:rand(.2,.45),max:.45,sz:rand(2,4),c:pick(['#ffe080','#ffa020','#ff6010']),g:0})}
  for(let i=0;i<8;i++)addP({x:x+rand(-r*.4,r*.4),y:y+rand(-r*.4,r*.4),vx:rand(-60,60),vy:rand(-200,-80),life:.8,max:.8,sz:3,c:pick(['#6b4a30','#7f7f7f','#4a4a4a']),g:520});
}
function ring(x,y,r,col){G.rings.push({x,y,r:0,max:r,t:.5,col})}
function floatText(x,y,txt,col,size){if(!G)return;if(G.texts.length>140)G.texts.shift();G.texts.push({x,y,txt,col,size:size||13,t:.9,max:.9})}
function shake(a){if(SAVE.settings.shake&&!G.demo)G.shake=Math.max(G.shake,a)}
function addLight(x,y,r,i){G.lights.push({x,y,r,i,t:.25,max:.25})}
function addXP(n,x,y){
  if(G.demo)return;G.stats.xp+=n;SAVE.xp+=n;
  if(x!=null&&G.orbs.length<80)for(let i=0;i<Math.min(3,Math.ceil(n/2));i++)G.orbs.push({x,y,vx:rand(-60,60),vy:rand(-120,-40),t:0});
  let need=xpNeed(SAVE.level);while(SAVE.xp>=need){SAVE.xp-=need;SAVE.level++;need=xpNeed(SAVE.level);sfx('levelup');toast('pix:orb','Seviye Atladın!','Seviye '+SAVE.level+' — Büyü Masası\'nda yeni puan!','lvl');if(SAVE.level>=10)unlockAch('level10')}
  updateXPUI();
}
const xpNeed=l=>60+l*40;
function updateParts(dt){
  for(let i=G.parts.length-1;i>=0;i--){const p=G.parts[i];p.life-=dt;if(p.life<=0){G.parts.splice(i,1);continue}p.vy+=(p.g||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.smoke){p.vx*=.96;p.vy*=.96}}
  for(let i=G.texts.length-1;i>=0;i--){const t=G.texts[i];t.t-=dt;t.y-=28*dt;if(t.t<=0)G.texts.splice(i,1)}
  for(let i=G.orbs.length-1;i>=0;i--){const o=G.orbs[i];o.t+=dt;if(o.t<.35){o.vy+=300*dt;o.x+=o.vx*dt;o.y+=o.vy*dt}
    else{const tx=o.soul?150:W/2,ty=o.soul?-30:H+30,dx=tx-o.x,dy=ty-o.y,dl=Math.hypot(dx,dy)||1,sp=200+o.t*900;o.x+=dx/dl*sp*dt;o.y+=dy/dl*sp*dt;if(dl<30||o.y>H+10||o.y<-20){G.orbs.splice(i,1);sfx(o.soul?'soul':'orb')}}}
  for(let i=G.lights.length-1;i>=0;i--){G.lights[i].t-=dt;if(G.lights[i].t<=0)G.lights.splice(i,1)}
  for(let i=G.rings.length-1;i>=0;i--){const r=G.rings[i];r.t-=dt;r.r=lerp(r.r,r.max,.25);if(r.t<=0)G.rings.splice(i,1)}
}
/* ---------- hava durumu / ortam parçacıkları ---------- */
function updateWeather(dt){
  const kind=G.biome.wx,hi=SAVE.settings.particles==='high',WX=G.weather,max=hi?170:60;
  const spawn=(n,f)=>{for(let i=0;i<n&&WX.length<max;i++)WX.push(f())},ch=p=>Math.random()<p*(hi?1:.4);
  switch(kind){
  case'rain':if(G.rain)spawn(hi?5:2,()=>({k:'rain',x:rand(-50,W),y:-10,vx:60,vy:rand(600,750),l:1}));break;
  case'snow':if(ch(.7))spawn(1,()=>({k:'snow',x:rand(-20,W),y:-6,vx:rand(10,30),vy:rand(25,55),l:20,ph:rand(0,6)}));break;
  case'sand':if(ch(G.sandT>0?2.5:.25))spawn(G.sandT>0?3:1,()=>({k:'sand',x:-30,y:rand(0,H),vx:rand(300,500)*(G.sandT>0?1.4:1),vy:rand(-10,10),l:4}));break;
  case'firefly':if(ch(.06))spawn(1,()=>({k:'firefly',x:rand(0,W),y:rand(0,H),vx:rand(-8,8),vy:rand(-8,8),l:rand(4,8),ph:rand(0,6)}));break;
  case'mote':if(ch(.15))spawn(1,()=>({k:'mote',x:rand(0,W),y:rand(0,H),vx:rand(-6,6),vy:rand(-8,-2),l:6}));break;
  case'bubble':if(ch(.35))spawn(1,()=>({k:'bubble',x:rand(0,W),y:H+5,vx:rand(-4,4),vy:rand(-45,-25),l:16,ph:rand(0,6)}));break;
  case'paleleaf':if(ch(.18))spawn(1,()=>({k:'pleaf',x:rand(-20,W),y:-6,vx:rand(-10,15),vy:rand(18,32),l:24,ph:rand(0,6)}));break;
  case'sculkp':if(ch(.22))spawn(1,()=>({k:'sculk',x:rand(0,W),y:rand(0,H),vx:rand(-4,4),vy:rand(-14,-6),l:rand(3,6),ph:rand(0,6)}));break;
  case'ember':if(ch(.5))spawn(1,()=>Math.random()<.5?{k:'ash',x:rand(0,W),y:-6,vx:rand(-10,10),vy:rand(15,35),l:20}:{k:'ember',x:rand(0,W),y:H+5,vx:rand(-15,15),vy:rand(-50,-25),l:12});break;
  case'cspore':if(ch(.45))spawn(1,()=>({k:'cspore',x:rand(0,W),y:rand(0,H),vx:rand(-8,8),vy:rand(-12,4),l:rand(5,9),ph:rand(0,6)}));break;
  case'wspore':if(ch(.45))spawn(1,()=>({k:'wspore',x:rand(0,W),y:rand(0,H),vx:rand(-8,8),vy:rand(-4,12),l:rand(5,9),ph:rand(0,6)}));break;
  case'soulp':if(ch(.3))spawn(1,()=>({k:'soulp',x:rand(0,W),y:H+5,vx:rand(-6,6),vy:rand(-35,-18),l:18,ph:rand(0,6)}));break;
  case'ash':if(ch(1.1))spawn(1,()=>({k:'ash2',x:rand(-30,W),y:-6,vx:rand(5,25),vy:rand(25,45),l:20}));break;
  case'vsp':if(ch(.3))spawn(1,()=>({k:'vsp',x:rand(0,W),y:H+5,vx:rand(-5,5),vy:rand(-30,-12),l:20}));break;
  case'spore':if(ch(.35))spawn(1,()=>({k:'spore',x:rand(0,W),y:rand(0,H),vx:rand(-6,6),vy:rand(-10,-3),l:rand(5,9),ph:rand(0,6)}));break;
  case'glint':if(ch(.25))spawn(1,()=>({k:'glint',x:rand(0,W),y:rand(0,H),vx:0,vy:0,l:rand(.6,1.2),ph:rand(0,6)}));break;
  case'amberm':if(ch(.3))spawn(1,()=>({k:'amber',x:rand(0,W),y:H+5,vx:rand(-6,6),vy:rand(-26,-12),l:20}));break;
  case'steam':if(ch(.35))spawn(1,()=>({k:'steam',x:rand(0,W),y:H+5,vx:rand(-6,6),vy:rand(-30,-15),l:14,s:rand(3,7)}));break;
  case'trill':{if(ch(.012)){const y0=rand(20,H*.6),dir=Math.random()<.5?1:-1,col=pick(['#7ad8ff','#ffe060','#c08aff']);for(let i=0;i<14;i++)spawn(1,()=>({k:'trill',x:dir>0?-20-rand(0,80):W+20+rand(0,80),y:y0+rand(-24,24),vx:dir*rand(70,95),vy:0,l:16,ph:rand(0,6),c:col}))}
    if(ch(.25))spawn(1,()=>({k:'sift',x:rand(0,W),y:rand(0,H),vx:rand(-4,4),vy:rand(-10,-3),l:rand(4,7),ph:rand(0,6)}));break}
  case'dust':if(ch(.2))spawn(1,()=>({k:'dust',x:-20,y:rand(0,H),vx:rand(40,90),vy:rand(-6,6),l:12}));break;
  case'storm':if(ch(G.storm?1.2:.3))spawn(1,()=>({k:'stormp',x:rand(0,W),y:-6,vx:rand(-40,-10),vy:rand(60,120),l:8}));break;
  }
  for(let i=WX.length-1;i>=0;i--){const w=WX[i];w.l-=dt;w.x+=w.vx*dt;w.y+=w.vy*dt;if(w.ph!=null)w.x+=Math.sin(G.time*2+w.ph)*12*dt;
    if(w.l<=0||w.y>H+12||w.y<-14||w.x>W+120||w.x<-120){if(w.k==='rain'&&w.y>H-200&&Math.random()<.4)addP({x:w.x,y:w.y,vx:rand(-20,20),vy:-40,life:.15,max:.15,sz:2,c:'#a8c4ff',g:300});WX.splice(i,1)}}
  if(G.rain){G.thunderT-=dt;if(G.thunderT<=0){G.thunderT=rand(9,20);G.flash=.35;G.flashCol='255,255,255';setTimeout(()=>sfx('thunder'),rand(150,900))}}
}
function renderWeather(g){
  for(const w of G.weather){switch(w.k){
    case'rain':g.strokeStyle='rgba(170,195,255,.5)';g.lineWidth=1;g.beginPath();g.moveTo(w.x,w.y);g.lineTo(w.x-w.vx*.02,w.y-w.vy*.02);g.stroke();break;
    case'snow':R(g,w.x,w.y,2,2,'rgba(255,255,255,.9)');break;
    case'sand':g.strokeStyle=G.sandT>0?'rgba(240,220,160,.5)':'rgba(240,220,160,.28)';g.lineWidth=1;g.beginPath();g.moveTo(w.x,w.y);g.lineTo(w.x-30,w.y);g.stroke();break;
    case'firefly':{const a=.5+.5*Math.sin(G.time*5+w.ph);R(g,w.x,w.y,2,2,`rgba(255,240,120,${a})`);break}
    case'mote':R(g,w.x,w.y,1.5,1.5,'rgba(255,255,210,.45)');break;
    case'bubble':g.strokeStyle='rgba(220,250,255,.6)';g.lineWidth=1;g.strokeRect(w.x,w.y,3,3);break;
    case'pleaf':R(g,w.x,w.y,3,2,'rgba(220,224,212,.8)');break;
    case'sculk':{const a=.4+.4*Math.sin(G.time*3+w.ph);R(g,w.x,w.y,2,2,`rgba(41,223,235,${a})`);break}
    case'ash':R(g,w.x,w.y,2,2,'rgba(90,90,90,.7)');break;
    case'ash2':R(g,w.x,w.y,2,2,'rgba(150,150,150,.6)');break;
    case'ember':R(g,w.x,w.y,2,2,'rgba(255,150,40,.9)');break;
    case'cspore':R(g,w.x,w.y,2,2,'rgba(255,90,90,.75)');break;
    case'wspore':R(g,w.x,w.y,2,2,'rgba(90,240,220,.75)');break;
    case'soulp':{const a=.4+.3*Math.sin(G.time*4+w.ph);R(g,w.x,w.y,2,3,`rgba(120,220,255,${a})`);break}
    case'vsp':R(g,w.x,w.y,2,2,'rgba(200,120,255,.7)');break;
    case'spore':R(g,w.x,w.y,2,2,'rgba(150,255,230,.6)');break;
    case'glint':{const a=Math.sin(w.l*5);if(a>0){R(g,w.x-2,w.y,5,1,`rgba(255,255,255,${a})`);R(g,w.x,w.y-2,1,5,`rgba(255,255,255,${a})`)}break}
    case'amber':R(g,w.x,w.y,2,2,'rgba(255,180,60,.8)');break;
    case'steam':g.fillStyle='rgba(240,250,200,.12)';g.beginPath();g.arc(w.x,w.y,w.s+(14-w.l),0,TAU);g.fill();break;
    case'trill':{const f=Math.sin(G.time*30+w.ph)>0;R(g,w.x,w.y,2,1,w.c);if(f)R(g,w.x,w.y-1,1,1,'rgba(255,255,255,.7)');break}
    case'sift':{const a=.4+.4*Math.sin(G.time*3+w.ph);R(g,w.x,w.y,2,2,`rgba(${w.ph>3?'120,230,255':'255,170,210'},${a})`);break}
    case'dust':R(g,w.x,w.y,2,1,'rgba(220,210,180,.4)');break;
    case'stormp':R(g,w.x,w.y,2,3,'rgba(255,120,160,.6)');break;
  }}
}
