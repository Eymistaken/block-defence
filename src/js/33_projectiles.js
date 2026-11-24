/* ============================ MERMİLER & ALAN ETKİLERİ ============================ */
function updateProjs(dt){
  for(let i=G.projs.length-1;i>=0;i--){const p=G.projs[i];let done=false;
    if(p.k==='arrow'||p.k==='ice'||p.k==='fire'||p.k==='resin'||p.k==='shulker'){
      if(p.tg&&p.tg.alive){p.lx=p.tg.x;p.ly=p.tg.y-8-(p.tg.def.flying?14:0)-(p.tg.levH||0)}
      const tx=p.lx??p.x,ty=p.ly??p.y,dx=tx-p.x,dy=ty-p.y,dl=Math.hypot(dx,dy);if(dl>.01)p.ang=Math.atan2(dy,dx);
      if(p.k==='shulker'){p.vx=lerp(p.vx,dx/dl*p.spd,Math.min(1,dt*3));p.vy=lerp(p.vy,dy/dl*p.spd,Math.min(1,dt*3));p.x+=p.vx*dt;p.y+=p.vy*dt;p.life=(p.life||0)+dt;if(Math.random()<.5)addP({x:p.x,y:p.y,vx:0,vy:0,life:.3,max:.3,sz:2,c:'#f0e8a0',g:0});
        if(dl<10||p.life>4){done=true;if(p.tg&&p.tg.alive){const e=p.tg;hitEnemy(e,p.dmg,'magic',p.src);if(e.alive){if(e.def.boss){}else{e.levT=p.s.lev;e.levFall=p.dmg*p.s.fall;e.levSrc=p.src;sfx('levitate')}}}}}
      else if(dl<p.spd*dt+4){done=true;if(p.tg&&p.tg.alive){const e=p.tg;
          if(p.k==='arrow')hitEnemy(e,p.dmg,'phys',p.src);
          else if(p.k==='ice'){const s=p.s,list=s.splash?G.enemies.filter(o=>o.alive&&d2(o.x,o.y,e.x,e.y)<(s.splash*TILE)**2):[e];
            for(const o of list){hitEnemy(o,o===e?p.dmg:p.dmg*.5,'ice',p.src);if(!o.alive)continue;const sl=o.def.boss?s.slow*.5:s.slow;if(sl>=o.slow){o.slow=sl;o.slowT=s.slowT}else o.slowT=Math.max(o.slowT,s.slowT*.5);
              if(s.freeze&&!o.def.boss&&Math.random()<s.freeze)o.freezeT=1.2}sparkle(e.x,e.y-8,'#bfe8ff',6)}
          else if(p.k==='resin'){const s=p.s,list=s.splash?G.enemies.filter(o=>o.alive&&!o.def.flying&&d2(o.x,o.y,e.x,e.y)<(s.splash*TILE)**2):[e];
            for(const o of list){hitEnemy(o,o===e?p.dmg:p.dmg*.5,'phys',p.src);if(o.alive)o.rootT=Math.max(o.rootT,o.def.boss?s.root*.3:s.root)}for(let k=0;k<6;k++)addP({x:e.x,y:e.y-6,vx:rand(-50,50),vy:rand(-60,0),life:.5,max:.5,sz:2,c:'#e87820',g:250})}
          else{hitEnemy(e,p.dmg,'fire',p.src);if(e.alive&&!e.def.fireImm){e.burnDps=e.burnT>0?Math.max(e.burnDps,p.s.burn):p.s.burn;e.burnT=p.s.burnT;e.burnSrc=p.src}}}}
      else{p.x+=dx/dl*p.spd*dt;p.y+=dy/dl*p.spd*dt;if(p.k==='fire'&&Math.random()<.6)addP({x:p.x,y:p.y,vx:rand(-10,10),vy:rand(-20,0),life:.25,max:.25,sz:3,c:pick(['#ff7a1a','#ffb020']),g:0});
        if(p.k==='ice'&&Math.random()<.3)addP({x:p.x,y:p.y,vx:0,vy:0,life:.3,max:.3,sz:2,c:'#dff6ff',g:0})}
    }
    else if(p.k==='tnt'||p.k==='potion'){p.t+=dt;const f=Math.min(1,p.t/p.T);p.x=lerp(p.sx,p.ex,f);p.y=lerp(p.sy,p.ey,f)-Math.sin(f*Math.PI)*60;p.rot+=dt*8;
      if(f>=1){done=true;
        if(p.k==='tnt'){explode(p.ex,p.ey,p.s.splash,p.s.dmg*(p.dm||1),p.src,{});if(p.s.cluster){for(let k=0;k<p.s.cluster;k++){const a=k/p.s.cluster*TAU+rand(0,1);G.drops.push({x:p.ex+Math.cos(a)*30,y:p.ey+Math.sin(a)*30,h:0,vh:0,fuse:.35,dmg:p.s.dmg*.4,rad:.7,src:p.src,mini:true})}}}
        else{G.clouds.push({x:p.ex,y:p.ey,r:p.s.radius*TILE,dps:p.s.dps*(p.dm||1),t:p.s.cloudT,max:p.s.cloudT,weak:p.s.weak||0,slow:p.s.slowCloud||0,src:p.src,col:p.col});sfx('glass');
          for(let k=0;k<12;k++)addP({x:p.ex,y:p.ey,vx:rand(-80,80),vy:rand(-120,-20),life:.5,max:.5,sz:2,c:'#dde8ff',g:300})}}}
    else if(p.k==='bolt'){const st=Math.hypot(p.vx,p.vy)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.left-=st;
      for(const e of G.enemies){if(!e.alive||p.hit.has(e))continue;if(!targetable(e,p.src,TOWERS.ballista,G.revealT>0)&&!(e.def.camo&&p.src.detect))continue;if(d2(p.x,p.y,e.x,e.y-8-(e.levH||0))<18*18){p.hit.add(e);hitEnemy(e,p.dmg,'phys',p.src);if(p.hit.size>=p.pierce){done=true;break}}}
      if(p.left<=0||p.x<-20||p.y<-20||p.x>W+20||p.y>H+20)done=true}
    if(done)G.projs.splice(i,1);
  }
  /* yaratık mermileri → kuleler */
  for(let i=G.eprojs.length-1;i>=0;i--){const p=G.eprojs[i];if(p.delay>0){p.delay-=dt;continue}
    const alive=G.towers.includes(p.tw);if(alive){p.tx=p.tw.x;p.ty=p.tw.y-8}
    const dx=p.tx-p.x,dy=p.ty-p.y,dl=Math.hypot(dx,dy);p.rot+=dt*10;
    if(dl<p.spd*dt+6){G.eprojs.splice(i,1);
      if(alive){damageTower(p.tw,p.dmg,p.eff);if(p.splash){for(const t of towersIn(p.tx,p.ty,p.splash))if(t!==p.tw)damageTower(t,p.dmg*.6,p.eff)}}
      if(p.k==='fireball'||p.k==='skull'||p.k==='soulball'){explodeFX(p.tx,p.ty,(p.splash||.6)*TILE,false);sfx('smallBoom')}
      else if(p.k==='potion')sfx('glass');else sparkle(p.tx,p.ty,p.k==='bullet'?'#f0e8a0':'#ffe040',4);continue}
    p.x+=dx/dl*p.spd*dt;p.y+=dy/dl*p.spd*dt;
    if(p.k==='fireball'&&Math.random()<.6)addP({x:p.x,y:p.y,vx:rand(-15,15),vy:rand(-15,15),life:.4,max:.4,sz:4,c:pick(['#ff7a1a','#ffb020','#3a2010']),g:0,smoke:true});
    else if(p.k==='skull'&&Math.random()<.5)addP({x:p.x,y:p.y,vx:0,vy:0,life:.4,max:.4,sz:3,c:'#2a2a2e',g:0,smoke:true});
    else if(p.k==='soulball'&&Math.random()<.6)addP({x:p.x,y:p.y,vx:0,vy:-10,life:.4,max:.4,sz:3,c:pick(['#3ae8ff','#bfffff']),g:0});
  }
  /* zehir bulutları */
  for(let i=G.clouds.length-1;i>=0;i--){const c=G.clouds[i];c.t-=dt;
    for(const e of G.enemies){if(!e.alive||(e.def.flying&&!c.air))continue;if(d2(e.x,e.y,c.x,c.y)<c.r*c.r){e.poisonDps=e.poisonT>0?Math.max(e.poisonDps,c.dps):c.dps;e.poisonT=.5;e.poisonSrc=c.src;
      if(c.weak){e.weakT=1;e.weak=Math.max(e.weak,c.weak)}if(c.slow){e.slow=Math.max(e.slow,c.slow);e.slowT=Math.max(e.slowT,.3)}}}
    if(Math.random()<dt*20)addP({x:c.x+rand(-c.r,c.r)*.8,y:c.y+rand(-c.r,c.r)*.6,vx:0,vy:-12,life:.8,max:.8,sz:rand(3,6),c:c.col,g:0,smoke:true,a:.5});
    if(c.t<=0)G.clouds.splice(i,1)}
  /* düşen TNT'ler / yataklar */
  for(let i=G.drops.length-1;i>=0;i--){const d=G.drops[i];if(d.h>0){d.vh+=900*dt;d.h-=d.vh*dt;if(d.h<=0){d.h=0;dust(d.x,d.y,'#aaa',5);sfx(d.bed?'bed':'place')}}
    else{d.fuse-=dt;if(d.fuse<=0){G.drops.splice(i,1);const kills=explode(d.x,d.y,d.rad,d.dmg,d.src,{small:d.mini,air:!!d.air,fire:d.bed});if(d.bed&&kills>=5)unlockAch('bed');if(d.bed){for(let k=0;k<30;k++)addP({x:d.x,y:d.y,vx:rand(-160,160),vy:rand(-220,-40),life:1,max:1,sz:rand(3,6),c:pick(['#ff7a1a','#ffd040','#c02828']),g:300})}}}}
  for(let i=G.bolts.length-1;i>=0;i--){G.bolts[i].t-=dt;if(G.bolts[i].t<=0)G.bolts.splice(i,1)}
  for(let i=G.beams.length-1;i>=0;i--){G.beams[i].t-=dt;if(G.beams[i].t<=0)G.beams.splice(i,1)}
  if(G.fangs)for(let i=G.fangs.length-1;i>=0;i--){G.fangs[i].t-=dt;if(G.fangs[i].t<=0)G.fangs.splice(i,1)}
  if(G.rifts)for(let i=G.rifts.length-1;i>=0;i--){G.rifts[i].t-=dt;if(G.rifts[i].t<=0)G.rifts.splice(i,1)}
  if(G.vortex){G.vortex.t-=dt;if(G.vortex.t<=0)G.vortex=null}
  if(G.geysers)for(let i=G.geysers.length-1;i>=0;i--){const g=G.geysers[i];g.t-=dt;if(g.t<=0){G.geysers.splice(i,1);if(G.towers.includes(g.tw))damageTower(g.tw,g.dmg);
    for(let k=0;k<26;k++)addP({x:g.x+rand(-8,8),y:g.y,vx:rand(-40,40),vy:rand(-320,-140),life:.9,max:.9,sz:rand(3,5),c:pick([g.col,'#fff0a0','#5a4a3a']),g:500});sfx('smallBoom')}}
  /* ichor seli */
  for(let i=G.floods.length-1;i>=0;i--){const f=G.floods[i];f.t-=dt;for(const e of G.enemies){if(!e.alive||e.def.flying)continue;if(d2(e.x,e.y,f.x,f.y)<f.r*f.r){if(e.def.illager)damage(e,60*dt,'magic',null);else if(e.def.sift&&!e.def.boss&&!e.calmed){e.calmed=true;e.calmT=4;sparkle(e.x,e.y-12,'#ff9ad8',6)}else if(!e.def.sift)damage(e,25*dt,'magic',null)}}
    if(Math.random()<dt*25)addP({x:f.x+rand(-f.r,f.r)*.8,y:f.y+rand(-f.r,f.r)*.6,vx:0,vy:-8,life:.6,max:.6,sz:3,c:pick(['#ff7ad8','#5ae8ff','#7aff9a','#ffe86a']),g:0});if(f.t<=0)G.floods.splice(i,1)}
  if(G.baits)for(let i=G.baits.length-1;i>=0;i--){G.baits[i].t-=dt;if(G.baits[i].t<=0)G.baits.splice(i,1)}
  /* End Kristali gücü */
  for(let i=G.crystals.length-1;i>=0;i--){const c=G.crystals[i];c.t-=dt;if(c.t<=0){G.crystals.splice(i,1);explode(c.x,c.y,1.6,c.dmg,null,{air:true});sfx('crystal')}}
}
function explode(x,y,rad,dmg,src,o){
  const r=rad*TILE;let kills=0;
  for(const e of G.enemies){if(!e.alive)continue;if(e.def.flying&&!o.air)continue;const dd=Math.hypot(e.x-x,e.y-y);
    if(dd<=r+6){hitEnemy(e,dmg*Math.max(.55,1-.45*dd/r),'blast',src);if(o.fire&&e.alive&&!e.def.fireImm){e.burnDps=Math.max(e.burnDps,12+G.wave);e.burnT=3}if(!e.alive)kills++}}
  if(kills>=6)unlockAch('boom');
  explodeFX(x,y,r,!o.small);sfx(o.small?'smallBoom':'explosion');shake(o.small?3:6);return kills;
}
