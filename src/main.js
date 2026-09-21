import './style.css';

const KEY='forja_v1';
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const fresh=()=>({
 profile:{name:'Guerrero',level:1,xp:0,streak:0,lastDay:null},
 goals:[{id:uid(),title:'Convertirme en mi mejor versión',area:'disciplina',target:30,progress:0,icon:'🔥'}],
 missions:[
  {id:uid(),title:'Entrenar 30 minutos',area:'fisico',xp:40,done:false},
  {id:uid(),title:'Leer 15 minutos',area:'mente',xp:20,done:false},
  {id:uid(),title:'Completar una tarea difícil',area:'disciplina',xp:30,done:false},
  {id:uid(),title:'Cuidar mis finanzas',area:'finanzas',xp:20,done:false},
  {id:uid(),title:'Dedicar tiempo a mi familia',area:'relaciones',xp:20,done:false},
  {id:uid(),title:'Dormir a una hora adecuada',area:'control',xp:30,done:false}
 ],
 history:{},
 stats:{fisico:0,mente:0,disciplina:0,finanzas:0,relaciones:0,control:0}
});
let data=JSON.parse(localStorage.getItem(KEY)||'null')||fresh();
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const areas={fisico:['💪','Físico'],mente:['🧠','Mente'],disciplina:['🔥','Disciplina'],finanzas:['💰','Finanzas'],relaciones:['❤️','Relaciones'],control:['🧘','Control']};
const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const need=()=>500+(data.profile.level-1)*150;
const pct=()=>Math.min(100,Math.round(data.profile.xp/need()*100));
const doneCount=()=>data.missions.filter(m=>m.done).length;
function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),1700)}
function resetDay(){if(data.profile.lastDay!==today()){data.missions.forEach(m=>m.done=false);data.profile.lastDay=today();save()}}
function nav(page){
 document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
 document.querySelector('#'+page).classList.add('active');
 document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===page));
}
function shell(){
 resetDay();
 app.innerHTML=`<div class="app">
 <header><div class="brand"><span>⚡</span><div><b>FORJA</b><small>Tu vida. Tu misión.</small></div></div><button id="restart" class="ghost">↻</button></header>
 <main>
  <section id="home" class="screen active"></section>
  <section id="goals" class="screen"></section>
  <section id="progress" class="screen"></section>
  <section id="coach" class="screen"></section>
 </main>
 <nav class="nav">
  <button class="active" data-page="home"><span>⌂</span>Hoy</button>
  <button data-page="goals"><span>🎯</span>Metas</button>
  <button data-page="progress"><span>🏆</span>Progreso</button>
  <button data-page="coach"><span>🧠</span>Coach</button>
 </nav></div>`;
 document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>nav(b.dataset.page));
 document.querySelector('#restart').onclick=()=>{if(confirm('¿Reiniciar las misiones de hoy?')){data.missions.forEach(m=>m.done=false);save();renderHome()}};
 renderHome();renderGoals();renderProgress();renderCoach();
}
function renderHome(){
 const d=doneCount();
 document.querySelector('#home').innerHTML=`
 <div class="greeting"><div><small>BUENOS DÍAS,</small><h1>${esc(data.profile.name)} 👋</h1></div><div class="streak">🔥 <b>${data.profile.streak}</b><span>días</span></div></div>
 <section class="level"><div class="levelhead"><div><small>NIVEL ${data.profile.level}</small><h2>Forjando mi mejor versión</h2></div><strong>${data.profile.level<5?'🌱':data.profile.level<10?'⚔️':data.profile.level<20?'🔥':'👑'}</strong></div>
 <div class="xp"><b>⭐ ${data.profile.xp} XP</b><span>${need()} XP</span></div><div class="bar"><i style="width:${pct()}%"></i></div></section>
 <div class="section"><div><small>MISIÓN DE HOY</small><h2>${d}/${data.missions.length} completadas</h2></div><b>${Math.round(d/data.missions.length*100)}%</b></div>
 <div class="missions">${data.missions.map(m=>`<button class="mission ${m.done?'done':''}" data-id="${m.id}"><span class="check">${m.done?'✓':'○'}</span><div><b>${esc(m.title)}</b><small>${areas[m.area][0]} ${areas[m.area][1]} · +${m.xp} XP</small></div><span>›</span></button>`).join('')}</div>
 <button class="boss" id="boss"><span>⚔️</span><div><small>MISIÓN JEFE</small><b>Haz algo que estás evitando</b></div><strong>+100 XP</strong></button>
 <div class="quote">“ No necesitas motivación. Necesitas dar el siguiente paso.”</div>`;
 document.querySelectorAll('.mission').forEach(b=>b.onclick=()=>toggle(b.dataset.id));
 document.querySelector('#boss').onclick=boss;
}
function toggle(id){
 const m=data.missions.find(x=>x.id===id);if(!m)return;
 m.done=!m.done;
 if(m.done){data.profile.xp+=m.xp;data.stats[m.area]++;toast(`+${m.xp} XP ⚡`)}
 else{data.profile.xp=Math.max(0,data.profile.xp-m.xp);data.stats[m.area]=Math.max(0,data.stats[m.area]-1)}
 while(data.profile.xp>=need()){data.profile.xp-=need();data.profile.level++;toast(`🎉 NIVEL ${data.profile.level}`)}
 if(data.missions.every(x=>x.done)){data.profile.streak++;data.history[today()]={done:data.missions.length}}
 save();renderHome();renderProgress();
}
function boss(){
 const t=prompt('¿Qué estás evitando hacer hoy?');if(!t)return;
 data.profile.xp+=100;data.stats.disciplina++;data.history[today()]={...(data.history[today()]||{}),boss:t};
 while(data.profile.xp>=need()){data.profile.xp-=need();data.profile.level++}
 save();toast('⚔️ JEFE DERROTADO +100 XP');renderHome();renderProgress();
}
function renderGoals(){
 document.querySelector('#goals').innerHTML=`<div class="title"><small>CONSTRUYE TU FUTURO</small><h1>Mis metas 🎯</h1><button id="add" class="primary">+ Nueva meta</button></div>
 <div class="goals">${data.goals.map(g=>{const p=Math.min(100,Math.round(g.progress/g.target*100));return`<article class="goal"><div class="goalicon">${g.icon}</div><div class="goalbody"><div class="goalrow"><b>${esc(g.title)}</b><strong>${p}%</strong></div><small>${areas[g.area][0]} ${areas[g.area][1]}</small><div class="bar"><i style="width:${p}%"></i></div><small>${g.progress}/${g.target} días</small><button class="small" data-goal="${g.id}">+1 día cumplido</button></div></article>`}).join('')}</div>`;
 document.querySelector('#add').onclick=addGoal;
 document.querySelectorAll('[data-goal]').forEach(b=>b.onclick=()=>advance(b.dataset.goal));
}
function addGoal(){
 const title=prompt('¿Qué quieres conseguir?');if(!title)return;
 const area=prompt('Área: fisico, mente, disciplina, finanzas, relaciones o control','disciplina')||'disciplina';
 data.goals.push({id:uid(),title,area:areas[area]?area:'disciplina',target:30,progress:0,icon:areas[area]?.[0]||'🎯'});
 save();renderGoals();toast('🎯 Meta creada');
}
function advance(id){const g=data.goals.find(x=>x.id===id);if(!g)return;g.progress=Math.min(g.target,g.progress+1);save();renderGoals();toast('🔥 Progreso registrado')}
function renderProgress(){
 const entries=Object.entries(data.stats);
 document.querySelector('#progress').innerHTML=`<div class="title"><small>TU TRANSFORMACIÓN</small><h1>Progreso 🏆</h1></div>
 <section class="profile"><div class="avatar">${data.profile.level<5?'🌱':data.profile.level<10?'⚔️':data.profile.level<20?'🔥':'👑'}</div><div><small>NIVEL ${data.profile.level}</small><h2>${data.profile.level<5?'Aprendiz':data.profile.level<10?'Guerrero':data.profile.level<20?'Forjador':'Maestro'}</h2><p>Racha ${data.profile.streak} 🔥 · ${Object.keys(data.history).length} días registrados</p></div></section>
 <h3>ATRIBUTOS</h3><div class="attrs">${entries.map(([a,v])=>{const n=Math.min(100,v*5);return`<div class="attr"><span>${areas[a][0]}</span><div><b>${areas[a][1]}</b><small>${n}/100</small><div class="bar"><i style="width:${n}%"></i></div></div></div>`}).join('')}</div>`;
}
function renderCoach(){
 document.querySelector('#coach').innerHTML=`<div class="title"><small>COACH DE DISCIPLINA</small><h1>Coach 🧠</h1></div>
 <section class="coach"><div class="coachavatar">⚡</div><h2>Vamos a convertir problemas en acciones.</h2><p>No frases vacías. Un siguiente paso pequeño y concreto.</p>
 <div class="coachbuttons"><button data-m="ganas">😮‍💨 No tengo ganas</button><button data-m="procrastino">⏳ Procrastino</button><button data-m="falle">🔄 Fallé varios días</button><button data-m="disciplina">🔥 Quiero disciplina</button></div><div id="answer">Elige una opción.</div></section>`;
 const ans={ganas:'No necesitas ganas. Haz solo 5 minutos de la tarea más importante. La misión ahora es empezar.',procrastino:'Elige una sola tarea. Pon 10 minutos en el reloj y empieza sin buscar perfección.',falle:'No estás en cero. Mañana reduce la carga a 3 misiones y vuelve a construir la racha.',disciplina:'La disciplina se entrena cumpliendo promesas pequeñas. Hoy completa una misión difícil.'};
 document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>document.querySelector('#answer').innerHTML=`<b>⚡ FORJA DICE:</b><p>${ans[b.dataset.m]}</p>`);
}
shell();
