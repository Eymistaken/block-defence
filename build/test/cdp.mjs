// Minimal CDP harness: launches headless Chrome, loads a page, runs scripts, collects errors.
// Requires Node 22+ (built-in WebSocket) and google-chrome on PATH.
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const SP=fileURLToPath(new URL('.',import.meta.url));
export async function launch(url,{w=1600,h=900}={}){
  const port=9300+Math.floor(Math.random()*500);
  const prof=SP+'/prof'+port;
  const ch=spawn('google-chrome',['--headless=new','--no-sandbox','--disable-gpu','--mute-audio','--autoplay-policy=no-user-gesture-required',`--remote-debugging-port=${port}`,`--user-data-dir=${prof}`,`--window-size=${w},${h}`,'about:blank'],{stdio:'ignore'});
  let ver;for(let i=0;i<50;i++){try{ver=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();if(ver.length)break}catch(e){}await new Promise(r=>setTimeout(r,200))}
  const tgt=ver.find(t=>t.type==='page');
  const ws=new WebSocket(tgt.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};const errors=[];const logs=[];
  ws.onmessage=ev=>{const m=JSON.parse(ev.data);if(m.id&&pend[m.id]){pend[m.id](m);delete pend[m.id];return}
    if(m.method==='Runtime.exceptionThrown'){const d=m.params.exceptionDetails;errors.push((d.exception&&d.exception.description||d.text)+' @'+d.lineNumber+':'+d.columnNumber)}
    if(m.method==='Runtime.consoleAPICalled'){const t=m.params.type;const txt=m.params.args.map(a=>a.value!==undefined?a.value:(a.description||'')).join(' ');if(t==='error')errors.push('console.error: '+txt);else logs.push(t+': '+txt)}};
  const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))});
  await send('Runtime.enable');await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url});await new Promise(r=>setTimeout(r,2500));
  const ev=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});if(r.result.exceptionDetails)return{err:r.result.exceptionDetails.exception?r.result.exceptionDetails.exception.description:r.result.exceptionDetails.text};return r.result.result.value};
  const shot=async(name)=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(SP+'/shots/'+name+'.png',Buffer.from(r.result.data,'base64'))};
  const close=async()=>{try{ws.close()}catch(e){}ch.kill('SIGKILL');await new Promise(r=>setTimeout(r,600));fs.rmSync(prof,{recursive:true,force:true})};
  return{send,ev,shot,close,errors,logs};
}
