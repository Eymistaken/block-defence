/* ============================ İKONLAR ============================ */
const ICONS={};
function towerIcon(type,lvl=0){const k='t'+type+lvl;if(ICONS[k])return ICONS[k];const c=mkCanvas(56,56),g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const D=TOWERS[type];if(D.trap){g.translate(4,4);type==='web'?drawWeb(g,0,0,1):drawMine(g,0,0)}else drawTower(g,type,lvl,4,12,-.5,0,null);return ICONS[k]=c}
function enemyIcon(type){const k='e'+type;if(ICONS[k])return ICONS[k];const c=mkCanvas(48,48),g=c.getContext('2d');g.imageSmoothingEnabled=false;
  if(type==='blub'){g.translate(24,40);g.scale(2.6,2.6);blubDraw(g,{t:0,moving:false});return ICONS[k]=c}
  const d=ENEMIES[type];if(!d)return c;
  const fake={anim:.8,t:.3,dir:1,def:d,punch:0,fuse:0,healFx:0,atkCd:2,shellOpen:true,onLava:true,emergeT:0};
  const s=enemyScale(d),hh=(d.h||21)*s,ww=(DRAW_W[d.draw]||12)*s;
  let fit=Math.min(1,38/hh,42/ww);
  const prevG=G;if(!G)G={time:0};
  g.translate(24,d.flying&&d.draw!=='bat'?32+hh*fit*.25:44);g.scale(s*fit,s*fit);if(d.draw==='dragon')g.translate(4,6);
  FL=null;try{EDRAW[d.draw](g,fake,0)}catch(err){}if(!prevG)G=null;
  if(d.omen){g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(150,60,220,.25)';g.fillRect(0,0,48,48)}
  return ICONS[k]=c}
function itemIcon(id,size=40){const k='i'+id+size;if(ICONS[k])return ICONS[k];const I=ITEMS[id];return ICONS[k]=pixIcon(I?I.icon:'book',size)}
function iconFor(spec){const[k,v]=spec.split(':');if(k==='t')return towerIcon(v);if(k==='e')return enemyIcon(v);if(k==='pix')return pixCanvas(v,4);if(k==='i')return itemIcon(v);
  if(k==='tex'){const c=mkCanvas(32,32),g=c.getContext('2d');g.imageSmoothingEnabled=false;const t=TX[v];g.drawImage(Array.isArray(t)?t[0]:t,0,0,32,32);return c}return mkCanvas(8,8)}
function abilIcon(id){const c=mkCanvas(40,40),g=c.getContext('2d');g.imageSmoothingEnabled=false;
  if(id==='tnt'){g.drawImage(TX.tntSide,6,10,26,26);g.drawImage(TX.tntTop,6,4,26,8);R(g,18,0,2,5,'#555');R(g,17,0,4,2,'#ffb020')}
  else if(id==='freeze'){g.drawImage(TX.ice[0],4,4,32,32);g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();for(let i=0;i<3;i++){const a=i*Math.PI/3;g.moveTo(20+Math.cos(a)*12,20+Math.sin(a)*12);g.lineTo(20-Math.cos(a)*12,20-Math.sin(a)*12)}g.stroke()}
  else if(id==='golem'){g.drawImage(TX.iron[0],6,4,28,30);R(g,10,14,6,4,'#cc2020');R(g,24,14,6,4,'#cc2020');R(g,18,18,4,9,'#8a8078');R(g,8,26,24,3,'#4a7a2a')}
  else if(id==='apple'){drawPix(g,'apple',4,2,4)}
  else if(POWERS[id]){g.drawImage(pixIcon(POWERS[id].icon,40),0,0)}
  return c}
function perkIcon(p){const c=mkCanvas(36,36),g=c.getContext('2d');drawPix(g,'book',0,0,4);R(g,14,10,8,10,p.col);R(g,15,11,2,2,'rgba(255,255,255,.7)');return c}
function dimIcon(dim,size=32){const k='d'+dim+size;if(ICONS[k])return ICONS[k];const D=DIMS[dim];return ICONS[k]=blockIcon(D.icon[0],D.icon[1],size)}
