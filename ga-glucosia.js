/* GA Glucosia — premium visual bridge + natural language assistant.
   Runs outside React so the medical tracking logic remains untouched.
*/
(function(){
'use strict';
document.documentElement.classList.add('ga-premium');

const RECIPE_ART=['/assets/ga-recipe-salad.svg','/assets/ga-recipe-fish.svg','/assets/ga-recipe-breakfast.svg','/assets/ga-recipe-soup.svg'];
const LABELS={
  inicio:['inicio','home','início','accueil','start','首页'],
  glucosa:['glucosa','glucose','glicose','glycémie','glicemia','glukose','血糖'],
  presion:['presión','presion','pressure','pressão','tension','pressione','blutdruck','血压'],
  medicamentos:['medicinas','meds','remédios','médicaments','farmaci','medikamente','药物'],
  citas:['citas','appointments','consultas','rendez-vous','appuntamenti','termine','预约'],
  recetas:['recetas','recipes','receitas','recettes','ricette','rezepte','食谱'],
  perfil:['perfil','profile','meu perfil','mon profil','il mio profilo','mein profil','我的档案']
};
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
function activeNavText(){const e=document.querySelector('nav button[class*="text-yellow-400"] span');return norm(e&&e.textContent);}
function navTo(target){
  const words=(LABELS[target]||[]).map(norm),buttons=[...document.querySelectorAll('nav button')];
  const b=buttons.find(x=>{const t=norm(x.textContent);return words.some(w=>t===w||t.includes(w));});
  if(b){b.click();setTimeout(refreshVisuals,80);return true;}return false;
}
function contentRoot(){return document.querySelector('#root > div > div.px-5.py-5')||document.querySelector('#root > div > div[class*="px-5"]');}
function ensureHero(){
  const root=contentRoot();if(!root)return;let hero=document.getElementById('ga-glucosia-hero');const isHome=(LABELS.inicio||[]).map(norm).some(x=>activeNavText().includes(x));
  if(!hero){hero=document.createElement('div');hero.id='ga-glucosia-hero';hero.className='ga-glucosia-hero';hero.innerHTML='<img src="/assets/ga-glucosia-hero.svg" alt="GA Glucosia: seguimiento visual de glucosa y tendencia">';root.insertBefore(hero,root.firstChild);}
  hero.style.display=isHome?'block':'none';
}
function enhanceRecipes(){
  const root=contentRoot();if(!root)return;const isRecipes=(LABELS.recetas||[]).map(norm).some(x=>activeNavText().includes(x));if(!isRecipes)return;
  const cards=[...root.querySelectorAll('button')].filter(b=>/kcal/i.test(b.textContent||'')&&(/carb/i.test(b.textContent||'')||/min/i.test(b.textContent||'')));
  cards.forEach((b,i)=>{b.classList.add('ga-recipe-card');const d=b.querySelector(':scope > div:first-child');if(d){d.classList.add('ga-recipe-thumb');d.style.backgroundImage='url("'+RECIPE_ART[i%RECIPE_ART.length]+'")';d.setAttribute('aria-hidden','true');}});
}
function addAria(){
  [...document.querySelectorAll('header button')].forEach((b,i)=>{if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',i===0?'Ajustes de visualización':'Ayuda');});
  [...document.querySelectorAll('nav button')].forEach(b=>{if(!b.getAttribute('aria-label'))b.setAttribute('aria-label','Ir a '+(b.textContent||'sección').trim());});
}
function refreshVisuals(){ensureHero();enhanceRecipes();addAria();}

function assistantMarkup(){
  if(document.getElementById('ga-glucosia-assistant-fab'))return;
  const fab=document.createElement('button');fab.id='ga-glucosia-assistant-fab';fab.type='button';fab.setAttribute('aria-label','Abrir asistente conversacional GA');fab.textContent='GA';
  const p=document.createElement('section');p.id='ga-glucosia-assistant-panel';p.setAttribute('role','dialog');p.setAttribute('aria-modal','false');p.setAttribute('aria-label','Asistente conversacional GA Glucosia');p.innerHTML=[
    '<div class="ga-assistant-head"><div class="ga-assistant-logo">GA</div><div class="ga-assistant-title"><strong>Asistente Glucosia</strong><span>Habla o escribe con naturalidad</span></div><button class="ga-assistant-close" type="button" aria-label="Cerrar asistente">×</button></div>',
    '<div id="ga-assistant-response" role="status" aria-live="polite">Hola. Puedo llevarte a tu glucosa, presión, medicamentos, citas, recetas, perfil o historial. Dime qué necesitas.</div>',
    '<div class="ga-assistant-controls"><input id="ga-assistant-input" type="text" autocomplete="off" placeholder="Ej. Quiero ver mi glucosa"><button type="button" class="ga-assistant-mic" aria-label="Hablar con el asistente">🎙</button></div>',
    '<button type="button" class="ga-assistant-send">Enviar</button>',
    '<p class="ga-assistant-hint">La voz usa el permiso de micrófono del navegador. Las acciones sensibles, como compartir o eliminar datos, siempre requieren tu confirmación manual.</p>'
  ].join('');
  document.body.appendChild(fab);document.body.appendChild(p);
  fab.onclick=()=>{p.classList.toggle('ga-open');if(p.classList.contains('ga-open'))document.getElementById('ga-assistant-input')?.focus();};
  p.querySelector('.ga-assistant-close').onclick=()=>p.classList.remove('ga-open');
  const input=p.querySelector('#ga-assistant-input');p.querySelector('.ga-assistant-send').onclick=()=>{handleAssistant(input.value);input.value='';};input.onkeydown=e=>{if(e.key==='Enter'){handleAssistant(input.value);input.value='';}};
  setupVoice(p.querySelector('.ga-assistant-mic'));
}
function speak(text){try{if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-MX';u.rate=.96;window.speechSynthesis.speak(u);}catch(e){}}
function answer(text,voice=true){const r=document.getElementById('ga-assistant-response');if(r)r.textContent=text;if(voice)speak(text);}
function firstName(){const p=document.querySelector('header p');if(!p)return'';const m=(p.textContent||'').match(/(?:Hola|Hello|Olá|Bonjour|Ciao|Hallo)[, ]+([^,]+)/i);return m?m[1].trim():'';}
function visibleGlucose(){
  const root=contentRoot();if(!root)return null;const txt=root.innerText||'';const m=txt.match(/(\d{2,3})\s*mg\/dL/i);return m?m[1]:null;
}
function doNavigate(target,msg){if(navTo(target)){answer(msg);return true;}answer('No pude abrir esa sección en este momento. Puedes usar la barra inferior o pedirme otra sección.');return false;}
function handleAssistant(raw){
  const t=norm(raw);if(!t)return;const name=firstName();
  if(/^(hola|buenos dias|buenas tardes|buenas noches|hello|ola)\b/.test(t)){answer('Hola'+(name?', '+name:'')+'. ¿En qué te puedo ayudar? Puedes hablarme con tus propias palabras.');return;}
  if(/(ver|revisar|mostrar|consultar).*(glucosa|azucar)|mi glucosa|glucose/.test(t)){doNavigate('glucosa','Claro'+(name?', '+name:'')+'. Te llevo a tus mediciones de glucosa.');return;}
  if(/(ver|revisar|mostrar|consultar).*(presion|tension)|mi presion|blood pressure/.test(t)){doNavigate('presion','Te llevo a presión arterial. Si esta sección no aparece, revisa que hipertensión esté activada en tu perfil.');return;}
  if(/medicamento|medicina|pastilla|dosis|meds/.test(t)){doNavigate('medicamentos','Abriendo tus medicamentos. Antes de cambiar o eliminar algo, revísalo en pantalla.');return;}
  if(/cita|doctor|medico|consulta|appointment/.test(t)){doNavigate('citas','Abriendo tus citas médicas.');return;}
  if(/receta|comida|aliment|recipe/.test(t)){doNavigate('recetas','Abriendo el recetario. Las recetas son contenido de apoyo y no sustituyen tu plan profesional.');return;}
  if(/perfil|idioma|sensor|bluetooth|dispositivo|cuenta/.test(t)){doNavigate('perfil','Te llevo a tu perfil y configuración.');return;}
  if(/inicio|home|principal/.test(t)){doNavigate('inicio','Volviendo a Inicio.');return;}
  if(/ultima glucosa|cuanto tengo|que valor tengo/.test(t)){
    navTo('inicio');setTimeout(()=>{const v=visibleGlucose();answer(v?'Tu última glucosa visible en la app es '+v+' miligramos por decilitro. Revisa la fecha y el contexto en Glucosa.':'No encuentro una lectura visible todavía. Te llevo a Glucosa para revisarla o registrar una.');if(!v)navTo('glucosa');},160);return;
  }
  if(/reporte|historial medico|exportar|pdf/.test(t)){doNavigate('perfil','Te llevo a Perfil. Desde ahí puedes abrir Exportar historial médico y revisar el documento antes de descargarlo o compartirlo.');return;}
  if(/borrar|eliminar|delete|compartir|enviar/.test(t)){answer('Esa es una acción sensible. Puedo llevarte a la sección correcta, pero necesito que tú revises y confirmes la acción en pantalla.');return;}
  if(/ayuda|no encuentro|no veo|que puedo hacer|como funciona/.test(t)){answer('Puedo ayudarte a navegar por Inicio, Glucosa, Presión, Medicamentos, Citas, Recetas y Perfil. También puedo indicarte dónde está tu historial. Dime qué quieres hacer.');return;}
  answer('Entendí que necesitas ayuda, pero no quiero adivinar una acción de salud. Puedes decir, por ejemplo: “quiero ver mi glucosa”, “abre mis citas”, “busco mis medicamentos” o “dónde está mi historial”.');
}
function setupVoice(btn){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){btn.disabled=true;btn.title='Tu navegador no admite reconocimiento de voz';return;}
  let rec=null;btn.onclick=()=>{try{if(rec){rec.stop();rec=null;btn.classList.remove('ga-listening');return;}rec=new SR();rec.lang='es-MX';rec.interimResults=false;rec.maxAlternatives=1;btn.classList.add('ga-listening');answer('Te escucho. Dime qué necesitas.',false);rec.onresult=e=>{const text=e.results[0][0].transcript;handleAssistant(text);};rec.onerror=()=>answer('No pude escuchar con claridad. Puedes intentarlo otra vez o escribir tu mensaje.',false);rec.onend=()=>{btn.classList.remove('ga-listening');rec=null;};rec.start();}catch(e){btn.classList.remove('ga-listening');rec=null;answer('No se pudo activar el micrófono. Revisa el permiso del navegador o escribe tu mensaje.',false);}};
}

assistantMarkup();
let timer=null;const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(refreshVisuals,60);});
obs.observe(document.getElementById('root')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
document.addEventListener('click',()=>setTimeout(refreshVisuals,80));
setTimeout(refreshVisuals,80);setTimeout(refreshVisuals,500);
})();
