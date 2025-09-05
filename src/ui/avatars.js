import { state, save } from '../state.js';


// Ожидаемые файлы в public/avatars/ (HTTPS — дружит с CSP Telegram)
export const AVATAR_IMAGES = {
'warrior_m': 'public/avatars/warrior_m.webp.png',
'warrior_f': 'public/avatars/warrior_f.webp.png',
'hacker_m' : 'public/avatars/hacker_m.webp.png',
'hacker_f' : 'public/avatars/hacker_f.webp.png',
'seer_m' : 'public/avatars/seer_m.webp.png',
'seer_f' : 'public/avatars/seer_f.webp.png'
};


function svgFallback(kind, sex){
const pal={
warrior_m:['#ff9f1a','#ff5433'], warrior_f:['#ff7ad9','#ff3a9e'],
hacker_m:['#23d3ff','#3b73ff'], hacker_f:['#7affc7','#23d3ff'],
seer_m:['#b18cff','#5e3aff'], seer_f:['#ffb86b','#ff7a18']
}[kind+'_'+sex] || ['#23d3ff','#ff7a18'];
return `<svg class='avatar' xmlns='http://www.w3.org/2000/svg' width='360' height='110' viewBox='0 0 360 220'>
<defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${pal[0]}'/><stop offset='1' stop-color='${pal[1]}'/></linearGradient></defs>
<rect width='100%' height='100%' fill='url(#g)'/>
<circle cx='60' cy='60' r='26' fill='rgba(255,255,255,.85)'/>
</svg>`;
}


export const avatars = [
['warrior_m','Warrior (M)'],['warrior_f','Warrior (F)'],
['hacker_m','Hacker (M)'],['hacker_f','Hacker (F)'],
['seer_f','Seer (F)'],['seer_m','Seer (M)']
];


export function renderCharacters(targetId){
const wrap=document.getElementById(targetId); if(!wrap) return; wrap.innerHTML='';
avatars.forEach(([key,label])=>{
const div=document.createElement('label');
div.className='char'+(state.character===key?' selected':'');
const [kind,sex]=key.split('_');
const imgPath = AVATAR_IMAGES[key];
if(imgPath){
const img=document.createElement('img');
img.className='avatar';
img.loading='lazy';
img.src = imgPath; // относительный путь от index.html
img.onerror = ()=>{ img.outerHTML = svgFallback(kind,sex); };
div.appendChild(img);
} else {
div.innerHTML = svgFallback(kind,sex);
}
const tag=document.createElement('span'); tag.className='label'; tag.textContent=label; div.appendChild(tag);
div.addEventListener('click',()=>{ state.character=key; localStorage.setItem('hc_character',key); renderCharacters(targetId); });
wrap.appendChild(div);
});
}
