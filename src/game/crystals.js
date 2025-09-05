import { xpAdd } from '../ui/city.js';


const SIZE=6;
const EMO={cr_r:'💎',cr_g:'💎',cr_b:'💎',bot:'🤖',multi:'👥',ai:'🧠'};
const SCORE={cr_r:160,cr_g:160,cr_b:160,bot:110,ai:110,multi:110};
const WEIGHTS={cr_r:4,cr_g:4,cr_b:4,bot:24,ai:18,multi:16};


let grid=[], hp=[], lock=false, first=null, lastClickI=-1, lastClickAt=0, combo=1;
let timer=null, time=60, score=0, paused=false, booted=false;


const idx=(r,c)=>r*SIZE+c; const isAdj=(a,b)=>{const ra=Math.floor(a/SIZE),ca=a%SIZE,rb=Math.floor(b/SIZE),cb=b%SIZE;return (Math.abs(ra-rb)+Math.abs(ca-cb))===1};
function weighted(){ const pool=[]; for(const k in WEIGHTS){ for(let i=0;i<WEIGHTS[k];i++) pool.push(k);} return pool[Math.floor(Math.random()*pool.length)]; }
function swap(a,b){ const t=grid[a]; grid[a]=grid[b]; grid[b]=t; const th=hp[a]; hp[a]=hp[b]; hp[b]=th; }


function findMatches(){ const found=[]; for(let r=0;r<SIZE;r++){ let run=[idx(r,0)]; for(let c=1;c<SIZE;c++){ const cur=grid[idx(r,c)], prev=grid[run[run.length-1]]; if(cur===prev && cur!=null) run.push(idx(r,c)); else { if(run.length>=3) found.push([...run]); run=[idx(r,c)]; } } if(run.length>=3) found.push([...run]); }
for(let c=0;c<SIZE;c++){ let run=[idx(0,c)]; for(let r=1;r<SIZE;r++){ const cur=grid[idx(r,c)], prev=grid[run[run.length-1]]; if(cur===prev && cur!=null) run.push(idx(r,c)); else { if(run.length>=3) found.push([...run]); run=[idx(r,c)]; } } if(run.length>=3) found.push([...run]); }
return { list:found, unique:[...new Set(found.flat())] };
}


function render(){ const g=document.getElementById('cg_grid'); if(!g) return; g.innerHTML=''; for(let i=0;i<SIZE*SIZE;i++){ const d=document.createElement('div'); d.className='cg-cell '+grid[i]; d.dataset.i=i; d.innerHTML=EMO[grid[i]]||''; d.addEventListener('click', onClick); d.addEventListener('dblclick', onDblClick); g.appendChild(d);} document.getElementById('cg_score').textContent=score; document.getElementById('cg_time').textContent=time+'s'; document.getElementById('cg_combo').textContent='x'+combo; }


function onClick(e){ if(lock||paused) return; const i=Number(e.currentTarget.dataset.i); const now=Date.now(); if(i===lastClickI && (now-lastClickAt)<350){ lastClickI=-1; lastClickAt=0; return onDblClick(e); } lastClickI=i; lastClickAt=now; if(first==null){ first=i; e.currentTarget.style.transform='scale(.95)'; return; } const a=first, b=i; first=null; [...document.querySelectorAll('.cg-cell')].forEach(c=>c.style.transform=''); if(!isAdj(a,b)) return; swap(a,b); render(); const res=findMatches(); if(res.unique.length===0){ swap(a,b); render(); } else resolve(res); }
function onDblClick(e){ const i=Number(e.currentTarget.dataset.i); if(grid[i]==='multi'){ if(hp[i]>1){ hp[i]-=1; } else { remove([i]); } } }


function resolve(res){ lock=true; let gain=0; const toRemove=new Set(); res.list.forEach(run=>{ const t=grid[run[0]]; run.forEach(i=>{ if(grid[i]==='multi' && hp[i]>1){ hp[i]-=1; } else { toRemove.add(i); } }); gain+=(SCORE[t]||50)*run.length; }); const mult = 1 + 0.2*(combo-1); let step = Math.round(gain*mult); score += step; document.getElementById('cg_score').textContent=score; setTimeout(()=>{ remove([...toRemove]); const next=findMatches(); if(next.unique.length>0){ combo++; render(); setTimeout(()=>resolve(next), 140); } else { combo=1; render(); lock=false; } }, 160); }
function remove(ids){ if(!ids.length) return; ids.forEach(i=>{ grid[i]=null; hp[i]=1; }); collapse(); refill(); }
function collapse(){ for(let c=0;c<SIZE;c++){ let write=SIZE-1; for(let r=SIZE-1;r>=0;r--){ const i=idx(r,c); if(grid[i]!=null){ grid[idx(write,c)]=grid[i]; hp[idx(write,c)]=hp[i]; if(write!==r){ grid[i]=null; hp[i]=1; } write--; } } } render(); }
function refill(){ for(let i=0;i<SIZE*SIZE;i++){ if(grid[i]==null){ grid[i]=weighted(); hp[i]=grid[i]==='multi'?2:1; } } render(); }


function newGrid(){ grid=Array(SIZE*SIZE).fill(null).map(()=>weighted()); hp=grid.map(t=> t==='multi'?2:1); let safe=0; while(findMatches().unique.length>0 && safe<40){ grid=grid.map(()=>weighted()); hp=grid.map(t=> t==='multi'?2:1); safe++; } render(); }


function tick(){ time--; document.getElementById('cg_time').textContent=time+'s'; if(time<=0){ stop(); const xp=Math.round(score/10); if(xp>0) xpAdd(xp); }
}
export function start(){ stop(); time=60; score=0; combo=1; paused=false; newGrid(); document.getElementById('cg_pause').textContent='Pause'; document.getElementById('cg_combo').textContent='x1'; timer=setInterval(tick,1000); }
export function stop(){ if(timer){ clearInterval(timer); timer=null; } }
export function boot(){ if(booted) return; booted=true; document.getElementById('cg_restart').addEventListener('click', start); document.getElementById('cg_pause').addEventListener('click', ()=>{ if(paused){ paused=false; document.getElementById('cg_pause').textContent='Pause'; if(!timer) timer=setInterval(tick,1000); } else { paused=true; document.getElementById('cg_pause').textContent='Resume'; if(timer){ clearInterval(timer); timer=null; } } }); document.getElementById('cg_shuffle').addEventListener('click', ()=>{ for(let k=0;k<8;k++){ const a=Math.floor(Math.random()*grid.length), b=Math.floor(Math.random()*grid.length); swap(a,b);} render(); }); start(); }
