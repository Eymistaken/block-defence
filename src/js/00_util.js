'use strict';
/* =====================================================================
   BLOK SAVUNMASI v2 — Minecraft temalı kule savunma
   Dört boyut: Overworld · Nether · End · Sift (her birinde 10 dünya)
   Kaynak: src/js/*.js dosyaları sırayla birleştirilir (build.py).
   Tüm grafikler ve ses efektleri kodla üretilir; müzikler gömülü C418 parçalarıdır.
   ===================================================================== */

/* ---------- sabitler ---------- */
const TILE=48, COLS=20, ROWS=12, W=COLS*TILE, H=ROWS*TILE;

/* ---------- küçük yardımcılar ---------- */
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const rand=(a,b)=>a+Math.random()*(b-a);
const randi=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const d2=(ax,ay,bx,by)=>{const dx=ax-bx,dy=ay-by;return dx*dx+dy*dy};
const fmt=n=>{n=Math.round(n);return n>=10000?(n/1000).toFixed(1)+'B':String(n)};
const TAU=Math.PI*2;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function R(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h)}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* yumuşak gürültü: zemin dokularını kümelemek için (harita tohumuna bağlı) */
function snoise(x,y,s){return(Math.sin(x*.71+s*1.3)+Math.cos(y*.93-s*.7)+Math.sin((x+y)*.43+s*2.1)+Math.cos((x-y)*.37+s*.4))/4}
/* "#rrggbb" + alfa → rgba() */
function rgba(hex,a){const n=parseInt(hex.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
