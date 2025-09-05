import { state, save } from '../state.js';


export function levelCap(lv){ return 100 + (lv-1)*80; }
export function applyProgress(){
document.getElementById('levelChip').textContent='Lv '+state.level;
const cap=levelCap(state.level);
const p=Math.max(0,Math.min(100, Math.round(100*state.xp/cap)));
document.getElementById('xpBar').style.width=p+'%';
document.getElementById('xpTxt').textContent=`${state.xp}/${cap} XP`;
const a=state.attrs; const pct=(v)=>Math.max(4,Math.min(100, v*8));
document.getElementById('bar_str').style.width=pct(a.str)+'%';
document.getElementById('bar_int').style.width=pct(a.int)+'%';
document.getElementById('bar_intu').style.width=pct(a.intu)+'%';
save();
}


function citySVG(p){
const slot=(x,y,w,h,thr,name)=>`<g>
<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='10' fill='rgba(20,30,44,${p>=thr?0.85:0.6})' stroke='${p>=thr?"#ff7a18":"#2a3340"}' stroke-width='2' stroke-dasharray='${p>=thr?"":"6 6"}'/>
${p>=thr?`<text x='${x+w/2}' y='${y+h/2}' fill='#ffd166' font-size='13' text-anchor='middle' dominant-baseline='middle'>${name}</text>`:`<text x='${x+w/2}' y='${y+h/2}' fill='#a3b5c7' font-size='12' text-anchor='middle' dominant-baseline='middle'>Locked ${thr}%</text>`}
</g>`;
return `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160' width='100%' height='100%'>
<linearGradient id='sky' x1='0' x2='0' y1='0' y2='1'>
<stop offset='0' stop-color='#122131'/><stop offset='1' stop-color='#0b0f14'/>
</linearGradient>
<rect width='400' height='160' fill='url(#sky)'/>
${slot(22,112,100,36,20,'Harbor')}
${slot(150,108,110,42,50,'Core Grid')}
${slot(292,112,86,34,80,'Aether Hub')}
<rect x='0' y='148' width='400' height='12' fill='#0b0f14'/>
</svg>`;
}
export function updateCity(){
const p=Math.max(0,Math.min(100,state.city));
const lbl=document.getElementById('cityLabel'); if(lbl) lbl.textContent=p+'% восстановлено';
const inner=document.getElementById('citySceneInner'); if(inner) inner.innerHTML = citySVG(p);
save();
}
export function xpAdd(n){
state.xp+=n; let up=false; while(state.xp>=levelCap(state.level)){ state.xp-=levelCap(state.level); state.level++; state.ap++; up=true; }
if(up){ console.log('Level up!', state.level); }
const addCity = Math.max(0, Math.floor(n/50)); if(addCity>0) state.city = Math.min(100, state.city + addCity);
applyProgress(); updateCity();
}
