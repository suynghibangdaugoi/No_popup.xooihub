(async()=>{
if(window._0x9a1f)return;
window._0x9a1f=1;

const H=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t)))).map(b=>b.toString(16).padStart(2,"0")).join("");

const K=await crypto.subtle.generateKey({name:"AES-GCM",length:128},!0,["encrypt","decrypt"]);
const E=async d=>{
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const e=await crypto.subtle.encrypt({name:"AES-GCM",iv},K,new TextEncoder().encode(d));
  return {iv,e};
};

const O=window.open;
let U=location.href;
const B=()=>window.open=()=>null;
const R=()=>window.open=O;
B();

setInterval(()=>{if(!window._0x9a1f)return;location.href!==U&&history.pushState(null,"",U)},200);

document.addEventListener("click",e=>{
 if(!window._0x9a1f)return;
 const a=e.target.closest&&e.target.closest("a");
 if(a)e.preventDefault();
},1);

const D=document.createElement("div");
D.textContent="ON";
D.style.cssText="position:fixed;bottom:18px;right:18px;width:38px;height:38px;background:#00c853;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:50%;font:bold 11px sans-serif;z-index:999999;cursor:pointer;box-shadow:0 0 6px rgba(0,0,0,.5);";

D.onclick=async()=>{
 window._0x9a1f=!window._0x9a1f;
 const s=await H("pop_toggle_secure");
 if(window._0x9a1f){
   U=location.href;B();
   D.style.background="#00c853";
   D.textContent="ON";
 }else{
   R();
   D.style.background="#d50000";
   D.textContent="OFF";
 }
};

document.body.appendChild(D);
})();
