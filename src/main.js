import { i18n, t } from './i18n.js';
import { state, save, $, $$ } from './state.js';
import { avatars, renderCharacters } from './ui/avatars.js';
import { applyProgress, updateCity, xpAdd } from './ui/city.js';
import * as cg from './game/crystals.js';


(function(){
const jsChip=document.getElementById('jsState'); const setJS=(ok)=> jsChip && (jsChip.textContent = ok?'JS: ok':'JS: error');
try{ setJS(true);
const APP_VER='v1.0.0'; document.getElementById('ver').textContent=APP_VER;


// i18n
let lang = localStorage.getItem('hc_lang')||'ru';
function applyI18n(){ document.getElementById('langSel').value=lang; $$('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n'); el.textContent=t(lang,k);}); document.getElementById('verifyChip').textContent = state.verified? t(lang,'Verified'):t(lang,'Unverified'); }
document.getElementById('langSel').addEventListener('change',e=>{ lang=e.target.value; localStorage.setItem('hc_lang',lang); applyI18n(); renderQuests(); });


// Quests
const QUESTS=[{id:'q1', text:t(lang,'q1'), xp:60},{id:'q2', text:t(lang,'q2'), xp:120},{id:'q3', text:t(lang,'q3'), xp:90}];
function renderQuests(){ const ul=$('#questsList'); ul.innerHTML=''; QUESTS.forEach(q=>{ const li=document.createElement('li'); const done=!!state.quests[q.id]; li.innerHTML = `${q.text} — <b>${q.xp} XP</b> ${done ? '✅' : `<button data-q='${q.id}' class='btn ghost' style='padding:6px 10px; margin-left:6px'>Claim</button>`}`; ul.appendChild(li); }); ul.onclick=(e)=>{ const btn=e.target.closest('button[data-q]'); if(!btn) return; const id=btn.getAttribute('data-q'); if(state.quests[id]) return; state.quests[id]=1; xpAdd(QUESTS.find(x=>x.id===id).xp); renderQuests(); } }


// Tabs
const screens=['profile','quests','crystals','lore','wallet'];
function openTab(id){ screens.forEach(k=>{ const el=document.getElementById('screen-'+k); if(el) el.classList.toggle('active', k===id); }); $$('#nav .tab').forEach(b=> b.classList.toggle('active', b.dataset.tab===id)); movePill(); if(id==='crystals') cg.boot(); }
document.getElementById('nav').addEventListener('click',(e)=>{ const btn=e.target.closest('button.tab'); if(!btn) return; openTab(btn.dataset.tab); });
const tabsEl = document.querySelector('#nav .tabs'); const pill = document.getElementById('activePill');
function movePill(){ const active=document.querySelector('#nav .tab.active'); if(!active||!pill||!tabsEl) return; const a=active.getBoundingClientRect(); const b=tabsEl.getBoundingClientRect(); pill.style.width=a.width+'px'; pill.style.transform='translateX('+(a.left-b.left)+'px)'; }


// Inputs
document.getElementById('name').value=state.name; document.getElementById('name').addEventListener('input',e=>{ state.name=e.target.value; save(); });
$$('.add').forEach(b=> b.addEventListener('click', ()=>{ const attr=b.getAttribute('data-attr'); if(state.ap<=0) return; state.attrs[attr]=(state.attrs[attr]||0)+1; state.ap--; applyProgress(); }));


// Onboarding
function maybeOnboard(){ if(state.onboarded) return; const onb=$('#onb'); onb.classList.add('show'); $('#onb_name').value = state.name || 'Player'; let step=1; const setStep=(n)=>{ step=n; $('#step1').style.display = n===1?'block':'none'; $('#step2').style.display = n===2?'block':'none'; $('#st1').classList.toggle('active', n===1); $('#st2').classList.toggle('active', n===2); };
$('#onb_next').onclick=()=>{ state.name = $('#onb_name').value.trim()||'Player'; $('#name').value=state.name; save(); setStep(2); };
$('#onb_back').onclick=()=> setStep(1);
$('#onb_finish').onclick=()=>{ state.onboarded=true; localStorage.setItem('hc_onboarded','1'); save(); onb.classList.remove('show'); };
}


// Init
applyI18n(); renderCharacters('chars'); renderCharacters('onb_chars'); renderQuests(); updateCity(); openTab('profile'); setTimeout(movePill,0); window.addEventListener('resize', movePill, {passive:true}); maybeOnboard(); applyProgress();


}catch(err){ console.error(err); setJS(false); }
})();
