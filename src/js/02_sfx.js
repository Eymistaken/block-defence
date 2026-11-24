/* ============================ SES MOTORU ============================
   Web Audio: master → kompresör → hoparlör.
   AU.sfx  : ses efektleri    AU.mus : prosedürel müzik    AU.trk : gömülü C418 parçaları */
const AU={ctx:null,last:{}};
function initAudio(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  let c;try{c=AU.ctx=new AC()}catch(e){return}
  AU.master=c.createGain();AU.master.gain.value=.85;
  const comp=c.createDynamicsCompressor();comp.threshold.value=-15;comp.knee.value=10;comp.ratio.value=5;comp.attack.value=.003;comp.release.value=.25;
  AU.master.connect(comp);comp.connect(c.destination);
  AU.sfx=c.createGain();AU.sfx.connect(AU.master);
  AU.mus=c.createGain();AU.mus.connect(AU.master);
  AU.trk=c.createGain();AU.trk.connect(c.destination);
  AU.musBus=c.createGain();AU.musBus.connect(AU.mus);
  const dl=c.createDelay(2);dl.delayTime.value=.43;const fb=c.createGain();fb.gain.value=.36;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1700;
  AU.musBus.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(AU.mus);
  const len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.noise=buf;
  applyVolumes();musicStart();
}
function applyVolumes(){if(!AU.ctx)return;AU.sfx.gain.value=SAVE.settings.sfx;AU.mus.gain.value=SAVE.settings.music*.55;AU.trk.gain.value=SAVE.settings.music*.75}
function tone(f,d,o={}){
  const c=AU.ctx;if(!c)return;const t=c.currentTime+(o.when||0);
  const osc=c.createOscillator();osc.type=o.type||'square';osc.frequency.setValueAtTime(f,t);
  if(o.f2)osc.frequency.exponentialRampToValueAtTime(Math.max(20,o.f2),t+(o.slide||d));
  if(o.detune)osc.detune.value=o.detune;
  const g=c.createGain(),v=o.v==null?.15:o.v,a=o.a||.004;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);
  if(o.hold)g.gain.setValueAtTime(v,t+a+o.hold);
  g.gain.exponentialRampToValueAtTime(.0001,t+d);
  let n=osc;
  if(o.lp||o.hp||o.bp){const fl=c.createBiquadFilter();fl.type=o.lp?'lowpass':o.hp?'highpass':'bandpass';fl.frequency.value=o.lp||o.hp||o.bp;if(o.q)fl.Q.value=o.q;osc.connect(fl);n=fl}
  n.connect(g);g.connect(o.dest||AU.sfx);
  if(o.vib){const l=c.createOscillator();l.frequency.value=o.vib;const lg=c.createGain();lg.gain.value=o.vibAmt||f*.05;l.connect(lg);lg.connect(osc.frequency);l.start(t);l.stop(t+d+.05)}
  osc.start(t);osc.stop(t+d+.05);
}
function noise(d,o={}){
  const c=AU.ctx;if(!c)return;const t=c.currentTime+(o.when||0);
  const s=c.createBufferSource();s.buffer=AU.noise;s.loop=true;
  const fl=c.createBiquadFilter();fl.type=o.type||'lowpass';fl.frequency.setValueAtTime(o.f||2000,t);
  if(o.f2)fl.frequency.exponentialRampToValueAtTime(o.f2,t+d);fl.Q.value=o.q||1;
  const g=c.createGain(),v=o.v==null?.2:o.v,a=o.a||.003;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(fl);fl.connect(g);g.connect(o.dest||AU.sfx);s.start(t,Math.random()*1.5);s.stop(t+d+.05);
}
const SFX={
  /* --- kuleler ve genel --- */
  arrow(){noise(.12,{type:'bandpass',f:2600,f2:900,q:2,v:.16});tone(rand(480,560),.08,{type:'triangle',f2:240,v:.07})},
  hit(){tone(rand(170,200),.06,{type:'square',f2:90,v:.05,lp:900})},
  explosion(){noise(1.1,{type:'lowpass',f:1500,f2:70,v:.55,a:.005});tone(95,.6,{type:'sine',f2:28,v:.5});noise(.25,{type:'highpass',f:1500,v:.14})},
  smallBoom(){noise(.45,{type:'lowpass',f:1200,f2:100,v:.28});tone(110,.3,{type:'sine',f2:40,v:.28})},
  fuse(){noise(.6,{type:'highpass',f:3200,v:.07,a:.05})},
  hiss(){noise(1.2,{type:'highpass',f:1800,f2:5200,v:.14,a:.3})},
  place(){noise(.13,{type:'lowpass',f:520,v:.38});tone(140,.1,{type:'triangle',f2:80,v:.14})},
  dig(){noise(.07,{type:'bandpass',f:rand(700,1150),q:1.5,v:.24})},
  breakBlock(){for(let i=0;i<3;i++)noise(.09,{type:'bandpass',f:rand(450,1200),q:1,v:.27,when:i*.04});tone(120,.15,{type:'square',f2:60,v:.05,lp:600})},
  towerBreak(){for(let i=0;i<5;i++)noise(.12,{type:'bandpass',f:rand(300,1000),q:1,v:.3,when:i*.05});tone(90,.4,{type:'square',f2:40,v:.1,lp:500})},
  towerHit(){noise(.06,{type:'bandpass',f:rand(500,900),q:2,v:.12})},
  repair(){[392,523,659].forEach((f,i)=>tone(f,.12,{type:'square',v:.05,when:i*.05,lp:2500}));noise(.08,{type:'bandpass',f:3000,v:.08})},
  anvil(){tone(1800,.25,{type:'triangle',v:.08});tone(2600,.18,{type:'sine',v:.05,when:.02});noise(.05,{type:'highpass',f:4000,v:.1})},
  upgrade(){[523,659,784,1046].forEach((f,i)=>tone(f,.2,{type:'square',v:.055,when:i*.07,lp:3000}))},
  netherite(){[262,330,392,523,659].forEach((f,i)=>tone(f,.35,{type:'sawtooth',v:.045,when:i*.06,lp:1800}));noise(.4,{type:'bandpass',f:900,v:.12})},
  sell(){[784,523].forEach((f,i)=>tone(f,.15,{type:'triangle',v:.12,when:i*.08}))},
  orb(){tone(rand(1300,1900),.1,{type:'sine',v:.06,f2:2300})},
  coin(){tone(1568,.08,{type:'square',v:.045});tone(2093,.16,{type:'square',v:.045,when:.06})},
  levelup(){[523,659,784,1046,1318].forEach((f,i)=>tone(f,.4,{type:'triangle',v:.12,when:i*.09}))},
  zap(){noise(.18,{type:'bandpass',f:3500,q:.8,v:.24});tone(rand(800,1400),.15,{type:'sawtooth',f2:200,v:.06,hp:500})},
  ice(){tone(rand(1800,2300),.18,{type:'sine',f2:900,v:.06});noise(.08,{type:'highpass',f:5000,v:.07})},
  fire(){noise(.2,{type:'lowpass',f:900,f2:300,v:.11,a:.02})},
  glass(){for(let i=0;i<4;i++)tone(rand(2500,4200),.12,{type:'sine',v:.045,when:i*.02});noise(.1,{type:'highpass',f:4000,v:.11})},
  piston(){tone(70,.12,{type:'square',f2:45,v:.14,lp:500});noise(.06,{type:'bandpass',f:1500,v:.2})},
  ballista(){tone(200,.25,{type:'triangle',f2:70,v:.2});noise(.15,{type:'bandpass',f:1200,f2:400,v:.2})},
  leak(){tone(330,.22,{type:'square',f2:170,v:.11,lp:1500});tone(220,.3,{type:'sawtooth',f2:110,v:.07,lp:800,when:.03})},
  horn(){[0,.95].forEach(w=>{tone(196,.9,{type:'sawtooth',v:.09,lp:900,when:w,a:.15,f2:186});tone(294,.9,{type:'sawtooth',v:.055,lp:900,when:w,a:.15})})},
  raidHorn(){[0,.7,1.4].forEach(w=>{tone(147,.6,{type:'sawtooth',v:.1,lp:700,when:w,a:.1,f2:139});tone(220,.6,{type:'sawtooth',v:.06,lp:700,when:w,a:.1})})},
  victory(){[523,659,784,659,784,1046].forEach((f,i)=>tone(f,.3,{type:'square',v:.07,when:i*.15,lp:2500}));tone(1046,1.2,{type:'triangle',v:.12,when:.9});tone(1318,1.2,{type:'triangle',v:.08,when:.9})},
  defeat(){[392,370,349,330].forEach((f,i)=>tone(f,.5,{type:'sawtooth',v:.07,when:i*.32,lp:1200,vib:6,vibAmt:6}))},
  click(){tone(900,.04,{type:'square',v:.05,lp:3000})},
  error(){tone(120,.18,{type:'square',v:.09,lp:700})},
  thunder(){noise(2.6,{type:'lowpass',f:520,f2:55,v:.5,a:.02});noise(.3,{type:'highpass',f:2000,v:.2})},
  roar(){tone(85,1.4,{type:'sawtooth',f2:52,v:.2,lp:700,vib:9,vibAmt:12});noise(1.2,{type:'lowpass',f:600,v:.2,a:.1})},
  heal(){[1046,1318,1568].forEach((f,i)=>tone(f,.2,{type:'sine',v:.045,when:i*.06}))},
  blink(){tone(900,.25,{type:'sine',f2:180,v:.09});tone(1800,.2,{type:'sine',f2:400,v:.045})},
  freeze(){for(let i=0;i<7;i++)tone(rand(1500,3200),.45,{type:'sine',v:.045,when:i*.05});noise(.9,{type:'highpass',f:3000,f2:8000,v:.12})},
  golem(){tone(60,.45,{type:'square',f2:40,v:.18,lp:300});noise(.35,{type:'lowpass',f:300,v:.3})},
  punch(){noise(.1,{type:'lowpass',f:700,v:.32});tone(100,.1,{type:'sine',f2:50,v:.2})},
  apple(){[784,988,1175,1568].forEach((f,i)=>tone(f,.28,{type:'triangle',v:.1,when:i*.06}))},
  ach(){[659,784,988,1318].forEach((f,i)=>tone(f,.32,{type:'square',v:.055,when:i*.1,lp:2500}))},
  stun(){tone(600,.2,{type:'square',f2:200,v:.05})},
  pop(){tone(rand(500,700),.06,{type:'sine',f2:1200,v:.08})},
  tick(){tone(1200,.03,{type:'square',v:.03})},
  item(){[880,1175,1480].forEach((f,i)=>tone(f,.15,{type:'square',v:.04,when:i*.05,lp:3500}))},
  craft(){noise(.08,{type:'bandpass',f:1200,v:.2});noise(.08,{type:'bandpass',f:900,v:.2,when:.1});tone(660,.2,{type:'triangle',v:.08,when:.2})},
  throwIt(){noise(.18,{type:'bandpass',f:1800,f2:600,q:1.2,v:.12})},
  bell(){[0,.02].forEach(w=>tone(1318,1.6,{type:'sine',v:.12,when:w}));tone(2637,1.1,{type:'sine',v:.05});tone(659,1.8,{type:'triangle',v:.05})},
  /* --- Overworld yaratıkları --- */
  zombie(){tone(rand(105,135),.4,{type:'sawtooth',f2:rand(65,85),v:.08,lp:600,vib:7,vibAmt:9})},
  zombieDie(){tone(150,.55,{type:'sawtooth',f2:50,v:.09,lp:500,vib:5,vibAmt:10})},
  skeleton(){for(let i=0;i<3;i++)noise(.04,{type:'highpass',f:2400,v:.11,when:i*.05})},
  spider(){noise(.25,{type:'bandpass',f:4200,q:3,v:.09});tone(90,.15,{type:'sawtooth',v:.04,lp:400})},
  slime(){tone(rand(260,330),.13,{type:'sine',f2:110,v:.18});noise(.1,{type:'lowpass',f:700,v:.09})},
  witch(){tone(rand(500,700),.25,{type:'triangle',f2:900,v:.05,vib:12,vibAmt:40})},
  ghost(){tone(rand(300,400),.6,{type:'sine',f2:200,v:.05,vib:5,vibAmt:20})},
  bat(){tone(rand(2600,3600),.05,{type:'square',v:.025})},
  magma(){tone(rand(140,180),.15,{type:'sine',f2:70,v:.18});noise(.12,{type:'lowpass',f:500,v:.13})},
  phantom(){tone(rand(700,900),.5,{type:'sawtooth',f2:300,v:.04,lp:1500,vib:14,vibAmt:60})},
  guardian(){tone(rand(600,800),.6,{type:'sine',f2:1600,v:.05,vib:20,vibAmt:30})},
  laser(){tone(400,1.2,{type:'sawtooth',f2:2400,v:.04,lp:3000})},
  illager(){tone(rand(180,240),.25,{type:'square',f2:150,v:.05,lp:900,vib:8,vibAmt:15})},
  fangs(){for(let i=0;i<4;i++)noise(.08,{type:'bandpass',f:1600,q:2,v:.18,when:i*.07})},
  spell(){tone(800,.6,{type:'sine',f2:1600,v:.05,vib:10,vibAmt:80});noise(.4,{type:'highpass',f:3000,v:.06})},
  crossbow(){noise(.1,{type:'bandpass',f:1800,q:3,v:.18});tone(300,.1,{type:'square',f2:150,v:.05})},
  ravager(){tone(70,1,{type:'sawtooth',f2:45,v:.22,lp:500,vib:6,vibAmt:10});noise(.8,{type:'lowpass',f:400,v:.25,a:.05})},
  enderman(){tone(rand(150,250),.6,{type:'sawtooth',f2:90,v:.05,lp:800,vib:30,vibAmt:40})},
  creeper(){noise(1.4,{type:'highpass',f:2400,f2:5800,v:.16,a:.2})},
  /* --- Solgun Bahçe --- */
  creak(){noise(.5,{type:'bandpass',f:rand(300,500),q:6,v:.22,a:.05});tone(rand(80,120),.5,{type:'sawtooth',v:.05,lp:300,vib:22,vibAmt:18})},
  creakFreeze(){noise(.16,{type:'bandpass',f:240,q:8,v:.25});tone(70,.2,{type:'square',v:.04,lp:250})},
  creakAwake(){tone(55,1.6,{type:'sawtooth',f2:40,v:.14,lp:300,vib:4,vibAmt:6});noise(1.4,{type:'bandpass',f:420,q:5,v:.18,a:.3})},
  heartbeat(){tone(55,.18,{type:'sine',v:.35});tone(50,.2,{type:'sine',v:.28,when:.25})},
  resin(){tone(rand(200,260),.18,{type:'sine',f2:90,v:.12});noise(.12,{type:'lowpass',f:900,v:.1})},
  crumble(){for(let i=0;i<6;i++)noise(.1,{type:'bandpass',f:rand(200,700),q:2,v:.18,when:i*.06})},
  /* --- Karanlık Derinlikler --- */
  sensor(){for(let i=0;i<3;i++)tone(rand(2000,2800),.06,{type:'sine',v:.03,when:i*.04});noise(.15,{type:'bandpass',f:3200,q:4,v:.06})},
  shriek(){noise(1.6,{type:'bandpass',f:2600,f2:1400,q:3,v:.28,a:.05});tone(1400,1.4,{type:'sawtooth',f2:900,v:.06,lp:3500,vib:18,vibAmt:120})},
  wardenBeat(){tone(48,.2,{type:'sine',v:.45});tone(44,.25,{type:'sine',v:.35,when:.22})},
  sonicCharge(){tone(120,1.5,{type:'sawtooth',f2:900,v:.06,lp:1800});noise(1.5,{type:'bandpass',f:400,f2:2400,q:2,v:.1,a:.6})},
  sonicBoom(){tone(60,1,{type:'sine',f2:30,v:.6});noise(.9,{type:'lowpass',f:2000,f2:100,v:.5});noise(.35,{type:'bandpass',f:1200,q:.5,v:.25})},
  emerge(){noise(2.4,{type:'lowpass',f:300,v:.35,a:.4});tone(50,2.2,{type:'sawtooth',v:.08,lp:200,vib:3,vibAmt:5})},
  darkness(){tone(36,1.6,{type:'sine',v:.3,a:.3})},
  bloom(){noise(.5,{type:'bandpass',f:500,q:3,v:.12,a:.05});tone(300,.5,{type:'sine',f2:120,v:.05})},
  goat(){tone(330,1.6,{type:'sawtooth',v:.12,lp:1400,a:.05,vib:4,vibAmt:5});tone(495,1.6,{type:'sawtooth',v:.06,lp:1400,a:.05})},
  /* --- Nether --- */
  ghast(){tone(rand(700,900),.9,{type:'sine',f2:400,v:.07,vib:9,vibAmt:60})},
  ghastShoot(){tone(300,.3,{type:'sine',f2:120,v:.1});noise(.3,{type:'lowpass',f:900,v:.15})},
  blaze(){noise(.5,{type:'bandpass',f:700,q:2,v:.12,a:.1});tone(rand(200,300),.4,{type:'sawtooth',v:.03,lp:700,vib:20,vibAmt:40})},
  piglin(){tone(rand(160,220),.22,{type:'sawtooth',f2:110,v:.06,lp:700,vib:25,vibAmt:30})},
  hoglin(){tone(rand(90,120),.35,{type:'sawtooth',f2:70,v:.1,lp:500,vib:18,vibAmt:20})},
  wither(){tone(70,1.8,{type:'sawtooth',f2:40,v:.18,lp:600,vib:6,vibAmt:10});noise(1.6,{type:'bandpass',f:300,q:2,v:.2,a:.2})},
  witherShoot(){tone(180,.3,{type:'square',f2:80,v:.08,lp:800});noise(.2,{type:'lowpass',f:700,v:.12})},
  bed(){noise(.2,{type:'bandpass',f:1000,v:.15});tone(400,.15,{type:'square',v:.04})},
  anchor(){tone(220,.8,{type:'sine',f2:440,v:.1,vib:5,vibAmt:10});noise(.6,{type:'bandpass',f:800,v:.1,a:.2})},
  /* --- End --- */
  shulker(){noise(.12,{type:'lowpass',f:600,v:.2});tone(150,.12,{type:'square',v:.05,lp:500})},
  levitate(){tone(600,.5,{type:'sine',f2:1400,v:.06})},
  dragonfly(){noise(.3,{type:'bandpass',f:180,q:8,v:.1,a:.05})},
  jelly(){tone(rand(300,420),.3,{type:'sine',f2:160,v:.1,vib:12,vibAmt:20})},
  crystal(){for(let i=0;i<5;i++)tone(rand(2400,4400),.25,{type:'sine',v:.04,when:i*.03})},
  chorus(){tone(rand(500,700),.35,{type:'sine',f2:1500,v:.07});tone(rand(900,1200),.3,{type:'sine',f2:300,v:.05,when:.08})},
  /* --- Sift --- */
  squeak(){tone(rand(1600,2200),.08,{type:'sine',f2:rand(2400,3000),v:.09});tone(rand(1800,2400),.07,{type:'sine',f2:1500,v:.06,when:.09})},
  sing(){[523,659,784,988].forEach((f,i)=>tone(f*(.5+Math.random()*.02),1.8,{type:'sine',v:.05,a:.3,when:i*.18,vib:5,vibAmt:4}))},
  tide(){for(let i=0;i<6;i++)tone(rand(700,1500),1.2,{type:'sine',v:.03,a:.3,when:i*.12});noise(1.6,{type:'bandpass',f:900,f2:2500,v:.08,a:.6})},
  soul(){tone(rand(900,1300),.3,{type:'sine',f2:1800,v:.035})},
  rift(){tone(110,1.4,{type:'sawtooth',v:.05,lp:900,vib:3,vibAmt:5});tone(165,1.4,{type:'triangle',v:.04,vib:5,vibAmt:4});noise(1.2,{type:'bandpass',f:1500,q:3,v:.06,a:.4})},
  sifter(){tone(rand(400,600),.18,{type:'triangle',f2:rand(800,1000),v:.05})},
  ichor(){tone(rand(200,280),.25,{type:'sine',f2:90,v:.1});noise(.2,{type:'bandpass',f:600,q:3,v:.08})},
};
const SFX_GAP={arrow:.05,hit:.035,zombie:.5,zombieDie:.15,skeleton:.25,spider:.35,slime:.12,fire:.09,orb:.045,dig:.05,zap:.07,ice:.07,explosion:.09,smallBoom:.06,piston:.06,glass:.08,ballista:.08,leak:.1,bat:.3,witch:.6,ghost:.6,magma:.2,pop:.04,stun:.2,heal:.3,punch:.08,
  towerHit:.08,phantom:.8,guardian:.8,illager:.6,enderman:.8,creak:.4,creakFreeze:.25,sensor:.12,ghast:1,blaze:.6,piglin:.5,hoglin:.6,shulker:.2,dragonfly:.5,jelly:.5,squeak:.08,soul:.06,sifter:.4,ichor:.4,crossbow:.06,resin:.15,bloom:.3,levitate:.2,crystal:.15,chorus:.2};
let SFX_MUTED=false;
function sfx(name,force){
  if(!AU.ctx||SAVE.settings.sfx<=0)return;if(SFX_MUTED&&!force)return;
  const now=AU.ctx.currentTime,gap=SFX_GAP[name]??.03;
  if(AU.last[name]&&now-AU.last[name]<gap)return;AU.last[name]=now;
  try{SFX[name]()}catch(e){}
}
