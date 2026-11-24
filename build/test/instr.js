window.__dmg={};window.__cur=null;
(function(){const oU=updateEnemy;updateEnemy=function(e,dt){window.__cur=e.type;try{return oU(e,dt)}finally{window.__cur=null}};
const oF=fireEProj;fireEProj=function(e,...a){const n=G.eprojs.length;const r=oF(e,...a);for(let i=n;i<G.eprojs.length;i++)G.eprojs[i].srcType=e.type;return r};
const oD=damageTower;damageTower=function(t,amt,eff,opt){let k=window.__cur;
  if(!k){let best=null,bd=1e9;for(const p of G.eprojs){const d=d2(p.x,p.y,t.x,t.y);if(d<bd){bd=d;best=p}}k=best&&best.srcType?best.srcType+'(proj)':'other:'+((new Error().stack.split('\n')[3]||'').trim().split(' ')[1])}
  const before=t.hp;const r=oD(t,amt,eff,opt);if(G.towers.includes(t)||before>0){window.__dmg[k]=(window.__dmg[k]||0)+Math.max(0,before-Math.max(0,t.hp))}return r};})();
