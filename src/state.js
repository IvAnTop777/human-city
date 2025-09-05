export const state = {
onboarded: localStorage.getItem('hc_onboarded')==='1',
name: localStorage.getItem('hc_name')||'',
character: localStorage.getItem('hc_character')||'warrior_f',
verified: localStorage.getItem('hc_verified')==='1',
level: Number(localStorage.getItem('hc_level')||'1'),
xp: Number(localStorage.getItem('hc_xp')||'0'),
ap: Number(localStorage.getItem('hc_ap')||'0'),
attrs: (()=>{ try{return JSON.parse(localStorage.getItem('hc_attrs')||'{"str":1,"int":1,"intu":1}')}catch(e){return {str:1,int:1,intu:1}} })(),
city: Number(localStorage.getItem('hc_city')||'0'),
quests: (()=>{ try{return JSON.parse(localStorage.getItem('hc_quests')||'{}')}catch(e){return {}} })()
};
export function save(){ localStorage.setItem('hc_name',state.name); localStorage.setItem('hc_character',state.character); localStorage.setItem('hc_verified',state.verified?'1':'0'); localStorage.setItem('hc_level',String(state.level)); localStorage.setItem('hc_xp',String(state.xp)); localStorage.setItem('hc_ap',String(state.ap)); localStorage.setItem('hc_attrs', JSON.stringify(state.attrs)); localStorage.setItem('hc_city',String(state.city)); localStorage.setItem('hc_quests', JSON.stringify(state.quests)); }
export const $ = (s)=>document.querySelector(s);
export const $$ = (s)=>[...document.querySelectorAll(s)];
export function toast(msg){ const el=$('#toast'); if(!el) return; el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1500); }
