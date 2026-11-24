/* ============================ PİKSEL İKONLAR ============================
   Eşyalar ve arayüz simgeleri. Her harf bir renge karşılık gelir; '.' boş piksel. */
const PIX={
  heart:{p:{k:'#2a0505',r:'#e3201c',w:'#ff9a9a',d:'#a01010'},d:[".kk...kk.","kwrk.krrk","kwrrkrrrk","krrrrrrdk",".krrrrdk.","..krrdk..","...kdk...","....k...."]},
  emerald:{p:{k:'#0b3d1a',l:'#a5f7b8',g:'#2fd15a',d:'#139a3c'},d:["..kkkk..",".kllggk.","kllgggdk","klgggddk","kggggddk",".kgggdk.","..kgdk..","...kk..."]},
  diamond:{p:{k:'#0a3a40',l:'#d2fdff',g:'#5decf5',d:'#2a9aa2'},d:["..kkkk..",".kllggk.","kllgggdk","klgggddk","kggggddk",".kgggdk.","..kgdk..","...kk..."]},
  apple:{p:{k:'#3a2a00',s:'#6b4a2a',l:'#3fae3f',g:'#ffd83d',w:'#fff6b0',d:'#c89a10'},d:["....sl..","...sll..",".kkskkk.","kwgggggk","kwgggggk","kggggdgk","kgggggdk",".kggddk.","..kkkk.."]},
  star:{p:{k:'#5a4000',y:'#ffd83d',w:'#fff6b0'},d:["....k....","...kyk...","...kwk...","kkkywykkk","kyywyyyyk",".kyyyyyk.","..kyyyk..",".kyykyyk.",".kk...kk."]},
  orb:{p:{k:'#1a3a00',l:'#e8ff9a',g:'#9adf2a',d:'#5a9a10'},d:["..kkk..",".kllgk.","klllggk","klgggdk","kggggdk",".kgddk.","..kkk.."]},
  skull:{p:{k:'#222',w:'#e8e8e8',g:'#aaa'},d:[".kkkkkk.","kwwwwwwk","kwkkwkkk","kwkkwkkk","kwwwwwwk",".kwgwgk.",".kkkkkk."]},
  book:{p:{k:'#2a1608',b:'#7a3a1a',l:'#a8582a',w:'#eee',p:'#c080ff'},d:[".kkkkkkk.","kblllllbk","kbllpllbk","kblppplbk","kbllpllbk","kblllllbk","kbbbbbbbk","kwwwwwwwk",".kkkkkkk."]},
  soul:{p:{c:'#2ab8d8',w:'#a8f4ff',b:'#0a3a5a'},d:["..c..c..",".cwc.cc.",".cwwcwc.","cwwwwwc.","cwbwbwc.","cwwwwwc.",".cwwwc..","..ccc..."]},
  healpot:{p:{k:'#2a1a1a',g:'#c8c8d8',w:'#ffd0e0',r:'#f03a6a',p:'#a01a4a'},d:["...kkk...","...kgk...","...kgk...","..kkgkk..",".kwrrrrk.","kwrrrrrrk","krrrrrrrk","krrrrrprk",".krrrppk.","..kkkkk.."]},
  totem:{p:{k:'#5a3a00',y:'#ffd83d',g:'#20c050',d:'#c89a10'},d:["..kkkk..",".kyyyyk.",".kygygk.",".kyyyyk.","kkyddykk","kyyyyyyk","kk.yy.kk","..kyyk..","..kddk..","...kk..."]},
  pearl:{p:{k:'#08201c',t:'#1a6a5a',l:'#3ab89a',w:'#c8fff0',d:'#0e3e34'},d:["..kkkk..",".kttttk.","kttllttk","ktlwlttk","kttlttdk","ktttttdk",".kttddk.","..kkkk.."]},
  wind:{p:{b:'#7a8ad8',w:'#e0e8ff'},d:["..bbbb..",".bwwwwb.","bwbbbwwb","bwbwwbwb","bwbwbbwb","bwwbbwwb",".bwwwwb.","..bbbb.."]},
  goldingot:{p:{k:'#6a4a00',w:'#fff6b0',y:'#ffd83d',d:'#c8a020'},d:["...kkkkkk.","..kwyyyyyk",".kwyyyyydk","kyyyyyyddk","kddddddkk.",".kkkkkk..."]},
  resinclump:{p:{o:'#e87820',w:'#ffc070',d:'#b04e0a'},d:["...oo...","..owoo..",".owoooo.","ooooodo.",".oodddo.","..oddo..","...oo..."]},
  chorusfruit:{p:{k:'#3a1a4a',p:'#a070c0',w:'#e8d0f8',d:'#6a3a8a'},d:["..kk.kk.",".kppkppk","kpwppppk","kppppdpk","kpdppppk",".kpppdk.","..kddk..","...kk..."]},
  breath:{p:{k:'#2a1030',g:'#d8c8e8',p:'#e070d0',w:'#ffd0f8',m:'#9a30a0'},d:["...kk...","..kggk..","..kggk..",".kpppppk","kpwppppk","kpppppmk","kppmpmmk",".kmmmmk.","..kkkk.."]},
  firecharge:{p:{k:'#1a0a00',d:'#3a2010',o:'#ff7a10',y:'#ffd040'},d:["..kkkk..",".kdodok.","kdoyodok","kooydook","kdoyoodk","kdooyodk",".kdodok.","..kkkk.."]},
  iceball:{p:{b:'#8ac8f0',w:'#f0f8ff',l:'#b8e0ff'},d:["..bwwb..",".bwwwwb.","bwwlwwwb","wwlwwwww","wwwwwlww","bwwwlwwb",".bwwwwb.","..bwwb.."]},
  eyeblossom:{p:{o:'#ff9a2a',y:'#ffe080',k:'#3a1a00',g:'#7a8a72'},d:[".o....o.","oyo..oyo",".oyooyo.","..okko..","..okyo..","...oo...","...gg...","..g.g...","...g...."]},
  soulfruit:{p:{g:'#3a9a5a',k:'#0a3a4a',c:'#4ad8f0',w:'#e0ffff',b:'#1a8aa8'},d:["....g...","...gg...",".kccck..","kcwcccck","kcccccck","kccccbck",".kccbbk.","..kkkk.."]},
  netherite:{p:{k:'#1a1418',w:'#8a7a8a',y:'#4a4048',d:'#2e262c'},d:["...kkkkkk.","..kwyyyyyk",".kwyyyyydk","kyyyyyyddk","kddddddkk.",".kkkkkk..."]},
  scrap:{p:{k:'#2a1a16',d:'#5e4440',s:'#8a6a5e'},d:["..kkk...",".kddsk..","kdsddsk.","kddsdddk","ksddsddk",".kdddsk.","..kkkk.."]},
  echoshard:{p:{k:'#03181c',c:'#0e5a66',l:'#4ae8f0'},d:["......kc",".....kcl","....kclk","...kcck.","..kcck..",".kcck...","kcck....","kck.....",".k......"]},
  coal:{p:{k:'#0a0a0a',d:'#2a2a2a',g:'#555'},d:["..kkkk..",".kddgdk.","kdgddddk","kddddgdk","kdgddddk",".kdddgk.","..kkkk.."]},
  gunpowder:{p:{g:'#7a7a7a',d:'#4a4a4a'},d:["........","...gg...","..gdgg..",".gggdgg.","gdgggggd","ggdggdgg",".gggggg."]},
  blazepowder:{p:{g:'#ffb020',d:'#d06a10'},d:["........","...gg...","..gdgg..",".gggdgg.","gdgggggd","ggdggdgg",".gggggg."]},
  breezerod:{p:{b:'#6a7ac8',w:'#c8d8ff'},d:["......bb",".....bwb","....bwb.","...bwb..","..bwb...",".bwb....","bwb.....","bb......"]},
  endereye:{p:{k:'#0a2a10',g:'#3ab05a',w:'#d0ffd0',d:'#1a6a30',b:'#0a0a0a'},d:["..kkkk..",".kggggk.","kggwgggk","kgdbbdgk","kgdbbdgk","kggddggk",".kggggk.","..kkkk.."]},
  compass:{p:{k:'#0a1a1c',c:'#1a5a60',l:'#4ae8f0',w:'#e0ffff',b:'#06282c'},d:["..kkkk..",".kccclk.","kccwlcck","kclwccck","kcccbcck","kccbccck",".kccccck","..kkkkk."]},
  disc:{p:{k:'#000',d:'#2a2a2a',g:'#3aa04a',w:'#e8e8e8'},d:["..kkkk..",".kddddk.","kddggddk","kdgwwgdk","kdgwwgdk","kddggddk",".kddddk.","..kkkk.."]},
  bed:{p:{w:'#f0f0f0',r:'#c02828',d:'#8a1a1a',p:'#8a6a3a'},d:["ww......","wwrrrrrr","wwrrrrrr","wddddddd","pppppppp","p......p"]},
  mace:{p:{k:'#1a1a1a',g:'#8a8a9a',w:'#d8d8e8',b:'#6a4a2a'},d:[".....kkkk","....kgggk","....kgwgk","....kgggk","...kbkkk.","..kbk....",".kbk.....","kbk......","kk......."]},
  horn:{p:{k:'#4a3a2a',w:'#d8c8a8'},d:["kk.......","kwk......",".kwkk....","..kwwkk..","...kwwwkk","....kkwwk","......kk."]},
  crystal:{p:{g:'#c8e8ff',p:'#e070c8',w:'#ffd0f0',k:'#5a2050'},d:[".gggggg.","gkppppkg","gppwpppg","gpwpppkg","gppppppg","gkpppppg",".gggggg.","..kkkk.."]},
  song:{p:{c:'#7af0e8',k:'#0a4a48'},d:[".....kkk","....kccc","....kckc","....kc..","..kkc...",".kccc...",".kcck...","..kk...."]},
  tide:{p:{c:'#5ad8d0',p:'#ff8ac8'},d:["........",".cc..cc.","c..cc..c","........",".pp..pp.","p..pp..p","........"]},
  ichor:{p:{p:'#ff7ad8',c:'#5ae8ff',g:'#7aff9a',y:'#ffe86a'},d:["...p....","..ppc...",".pcccg..",".ccggy..","pcgyyyp.","pcgyypp.",".ppppp.."]},
  tnt:{p:{r:'#d42e1c',w:'#eeeeee',k:'#1a1a1a',d:'#a8200f'},d:["rrdrrdrr","rrdrrdrr","wwwwwwww","wkkwkwkw","wwwwwwww","rrdrrdrr","rrdrrdrr"]},
  gaze:{p:{o:'#ffa040',y:'#fff0a0',k:'#2a1000',g:'#c8ccbf'},d:["..gggg..",".goooog.","goyyyyog","goykkyog","goykkyog","goyyyyog",".goooog.","..gggg.."]},
};
function pixCanvas(name,scale=1){const P=PIX[name],h=P.d.length,w=Math.max(...P.d.map(r=>r.length)),c=mkCanvas(w*scale,h*scale),g=c.getContext('2d');
  P.d.forEach((row,y)=>{for(let x=0;x<row.length;x++){const ch=row[x];if(ch!=='.'&&P.p[ch])R(g,x*scale,y*scale,scale,scale,P.p[ch])}});return c}
function drawPix(g,name,x,y,s){const P=PIX[name];if(!P)return;P.d.forEach((row,yy)=>{for(let xx=0;xx<row.length;xx++){const ch=row[xx];if(ch!=='.'&&P.p[ch])R(g,x+xx*s,y+yy*s,s,s,P.p[ch])}})}
/* pikseli ortalanmış ikon (size x size) */
function pixIcon(name,size=40){const P=PIX[name],h=P.d.length,w=Math.max(...P.d.map(r=>r.length)),s=Math.max(1,Math.floor(size*.86/Math.max(w,h)));
  const c=mkCanvas(size,size),g=c.getContext('2d');drawPix(g,name,Math.floor((size-w*s)/2),Math.floor((size-h*s)/2),s);return c}
