import { chapters as sourceChapters, faqs } from './guide-content.js';
import { meta, replies, mustKnow, journey } from './scenes.js';
import { resources } from './resources.js';
import { monthlyPayment } from './finance.js';
import { storyOrder, moments, storyScene, validChoices } from './story.js';
const chapters=storyOrder.map(id=>sourceChapters.find(c=>c.id===id));
const $ = s => document.querySelector(s);
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>new Intl.NumberFormat('en-NZ',{style:'currency',currency:'NZD',maximumFractionDigits:0}).format(v);
const ids=chapters.map(c=>c.id);
const imageNames={home:'home-world',decide:'rent-or-buy',deposit:'deposit',budget:'cost-iceberg',team:'your-team',search:'neighbourhood',inspect:'house-cutaway',offer:'agreement',mortgage:'mortgage-art',settlement:'keys',living:'maintenance'};
const imageMap=Object.fromEntries(Object.entries(imageNames).map(([id,name])=>[id,`assets/web/${name}.webp`]));
const descriptions={home:'A New Zealand home surrounded by buyers, a mortgage adviser, a building inspector and a garden workbench.',decide:'An engraved balance scale holds a suitcase on one side and a small home on the other.',deposit:'Three glass jars of savings stand in front of a miniature home.',budget:'A small home sits above a large underwater iceberg: the price is only part of the cost.',team:'An engraved bank, legal papers and an inspector’s magnifying glass.',search:'An illustrated New Zealand neighbourhood, including homes, shops, a bus and a park.',inspect:'A cutaway house reveals roof framing, plumbing, living spaces and foundations.',offer:'A fountain pen rests across contract papers beside a small house and keys.',mortgage:'A pocket watch, coins and a house key illustrate the cost of borrowing over time.',settlement:'An open hand holds the keys to a first home.',living:'A toolbox, a house and a growing seedling illustrate ongoing care.'};
const spots={
 home:[['Your money',18,84,'deposit'],['Your team',13,27,'team'],['Find a home',51,5,'search'],['The checks',88,28,'inspect'],['Paperwork',51,97,'offer'],['Life at home',85,85,'living']],
 decide:[['Keep renting',25,69,'rent'],['Buy a home',76,69,'buy']],
 deposit:[['Your savings',21,68,'Do I need a 20%'],['KiwiSaver',52,53,'How does a KiwiSaver'],['Family help',81,68,'Can family help']],
 budget:[['The mortgage',52,17,'How do I know'],['Council rates',25,55,'What are council rates'],['Ongoing costs',72,56,'Which costs keep'],['A repair buffer',49,80,'How much repair']],
 team:[['The lender',24,30,'bank'],['Your lawyer',73,28,'lawyer'],['Mortgage adviser',47,78,'broker']],
 search:[['The neighbourhood',71,30,'place'],['The home',31,65,'type'],['The title',39,43,'title']],
 inspect:[['Roof & water',49,20,0],['Pipes & services',74,53,1],['Ground & foundations',49,80,2],['Consents & changes',24,53,3]],
 offer:[['Ways to buy',29,62,'negotiation'],['The auction trap',70,28,'auction'],['The small print',57,47,'contract']],
 mortgage:[['Time & interest',24,62,'What are principal'],['Fixed or floating?',65,25,'Fixed, floating'],['Try the numbers',74,72,'calculator']],
 settlement:[['The handover',64,60,'What happens on settlement'],['One last inspection',30,57,'What do I check at the pre'],['Actually vacant?',53,37,'What if tenants already']],
 living:[['Repair',24,65,'repair'],['Renovate',60,38,'renovate'],['Keep it healthy',85,68,'review']]
};
const inspection=[['The roof & water','Ask about leaks, roof condition, gutters and inaccessible areas. A dry viewing day doesn’t prove a dry house.','How do I investigate'],['Pipes & services','Ask which plumbing, drainage and electrical checks are included. A general inspection does not test every service; separate specialists may be needed.','Do I need a LIM'],['Foundations & ground','Ask about piles, movement, retaining walls and drainage. Check council hazard information, previous claims and insurance before committing.','How do I check flood'],['Consents & changes','Compare the actual house with council records. Check the relevant building and resource consents, completion documents and title permissions.','The home has been renovated']];
let current='home',visualScene='home',focusState=null,world=null,worldReady=false,worldFailed=false,routeVersion=0,activeSpot=null;
let storyActive=false,storyPosition='decide',storyStarted=false,storyChoices={};
try{const saved=JSON.parse(sessionStorage.getItem('first-home-story')||'{}');storyPosition=storyOrder.includes(saved.position)?saved.position:'decide';storyChoices=validChoices(saved.choices);storyStarted=Boolean(saved.started);}catch{}
function saveStory(){try{sessionStorage.setItem('first-home-story',JSON.stringify({position:storyPosition,choices:storyChoices,started:storyStarted}));}catch{}}
const visited=new Set(),checks=new Set();
try{const saved=JSON.parse(sessionStorage.getItem('first-home-reading')||'{}');(saved.visited||[]).filter(id=>ids.includes(id)).forEach(id=>visited.add(id));(saved.checks||[]).forEach(id=>checks.add(id));}catch{}
function saveReading(){try{sessionStorage.setItem('first-home-reading',JSON.stringify({visited:[...visited],checks:[...checks]}));}catch{}}
function writeRoute(hash){if(location.hash!==hash)history.pushState({},'',hash);}
function homeFocus(index){const [x,y]=[[44,61],[21,51],[53,40],[82,45],[48,67],[77,74]][index];return {scene:'home',x,y,label:spots.home[index][0]};}
function readRoute(){
 const parts=location.hash.slice(1).split('/'),following=parts[0]==='story';
 if(following)parts.shift();const [scene,detail]=parts;
 if(scene==='home'&&detail){const i=spots.home.findIndex(s=>s[3]===detail);if(i>=0){travel(detail,{writeHash:false,focus:homeFocus(i)});return;}}
 travel(scene||'home',{writeHash:false,story:following});
 if(detail!==undefined&&/^\d+$/.test(detail)&&Number(detail)<spots[current].length&&current!=='home')activateSpot(Number(detail),current,{writeHash:false});
}
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');let motion=!motionPreference.matches;
const drawer=$('#guide-drawer');let drawerMode='',drawerTab='overview',drawerChapter=null;
function chapter(id=current){return chapters.find(c=>c.id===id);}
function external(url,label){return `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗<span class="sr-only"> (opens in a new tab)</span></a>`;}
function faqMarkup(f,tag=false){return `<details class="faq-item"><summary><span>${tag?`<span class="faq-tag">${escape(meta[f.chapter].label)}</span>`:''}${escape(f.question)}</span></summary><div class="faq-answer"><p>${escape(f.answer)}</p>${external(f.url,f.source)}</div></details>`;}
function findFaq(id,query){return chapter(id).details.find(f=>f.question.toLowerCase().includes(String(query).toLowerCase())) || faqs.find(f=>f.question.toLowerCase().includes(String(query).toLowerCase()));}
function updateMotion(){const b=$('#motion-button');b.setAttribute('aria-pressed',String(motion));b.setAttribute('aria-label',motion?'Motion enabled. Turn motion off':'Motion disabled. Turn motion on');world?.setMotion(motion);}
$('#motion-button').addEventListener('click',()=>{motion=!motion;updateMotion();});motionPreference.addEventListener('change',e=>{motion=!e.matches;updateMotion();});updateMotion();
function showStory(topic=null){
 const root=$('#story-content');root.getAnimations().forEach(a=>a.cancel());
 const preview=focusState?.scene==='home';
 if(current==='home'){
  root.innerHTML=`<p class="eyebrow">ONE BUYER. THE DECISIONS ALONG THE WAY.</p><h1 id="story-title" tabindex="-1">From “could I?”<br>to <em>“my place.”</em></h1><p class="story-lead">Meet Alex. Renting now. Wondering if buying could work. Follow the decisions—or explore the world at your own pace.</p><p class="story-fiction">Alex is a fictional buyer. The questions are real.</p><div class="story-actions"><button type="button" class="button" data-story="${storyStarted?storyPosition:'decide'}">${storyStarted?'Resume Alex’s story':'Follow Alex’s story'} <span aria-hidden="true">→</span></button><button type="button" class="quiet-button" data-open="faq">Find a specific answer</button></div><p class="intro-note">Get ready → Find &amp; check → Make it yours.</p>`;
 }else if(storyActive&&!topic){
  const m=moments[current],choice=storyChoices[current],selected=m.choices?.find(([key])=>key===choice);
  root.innerHTML=`<p class="eyebrow">ALEX’S STORY · ${String(ids.indexOf(current)+1).padStart(2,'0')} / 10</p><h2 id="story-title" tabindex="-1">${m.title}</h2><p class="story-lead">${escape(storyScene(current,storyChoices))}</p>${m.visual?`<div class="story-equation" aria-label="Your contribution plus a home loan equals the purchase price"><span>${m.visual[0]}</span><b>+</b><span>${m.visual[1]}</span><b>=</b><span>${m.visual[2]}</span></div>`:''}${m.choices?`<fieldset class="story-decision"><legend>${escape(m.question)}</legend><div>${m.choices.map(([key,label])=>`<button type="button" data-story-choice="${key}" aria-pressed="${key===choice}">${escape(label)}<span aria-hidden="true">${key===choice?'✓':'↗'}</span></button>`).join('')}</div></fieldset><p class="story-consequence" role="status">${escape(selected?.[2]||'Explore either possibility. You can change it at any time.')}</p>${current==='offer'?'<button type="button" class="quiet-button" data-open="examples">Tender or deadline sale? See all sale types →</button>':''}`:`<p class="story-takeaway">${escape(m.takeaway)}</p>`}<div class="story-actions"><button type="button" class="button" data-story-next>${escape(m.next)} <span aria-hidden="true">→</span></button><button type="button" class="quiet-button" data-open="chapter">${current==='offer'?'Sale types, checks & traps':'Checks, questions & common traps'}</button></div>`;
 }else{
  const m=meta[current],j=journey[current],step=String(ids.indexOf(current)+1).padStart(2,'0');
  const context=storyActive?`ALEX’S STORY · ${step} / 10`:preview?`WORLD MAP · CHAPTER ${step} PREVIEW`:`${step} / 10 · ${j.stage}`;
  root.innerHTML=`${topic?`<button type="button" class="topic-breadcrumb" data-topic-back>← ${storyActive?'Alex’s story':escape(m.label)+' overview'}</button>`:''}<p class="eyebrow">${escape(context)}</p><h2 id="story-title" tabindex="-1">${topic?escape(topic.title):m.title}</h2><p class="story-lead">${escape(topic?topic.copy:m.lead)}</p>${topic?.url?`<p class="topic-count">${external(topic.url,topic.source)}</p>`:''}${!topic?`<div class="next-move"><strong>YOUR NEXT MOVE</strong><p>${escape(j.task)}</p></div>`:''}${!topic&&!preview?`<div class="gotcha"><strong>Watch for this</strong>${mustKnow[current]}</div>`:''}<div class="story-actions">${preview?`<button type="button" class="button" data-explore-chapter>Explore ${escape(m.short.toLowerCase())} <span aria-hidden="true">→</span></button><button type="button" class="quiet-button" data-open="chapter">See the checklist</button>`:`<button type="button" class="button" data-open="chapter">${topic?'Checklist & common traps':'What to check before moving on'} <span aria-hidden="true">↗</span></button><button type="button" class="quiet-button" data-open="${current==='deposit'||current==='mortgage'?'calculator':'questions'}">${current==='deposit'||current==='mortgage'?'Try the numbers':'Questions about this step'}</button>`}</div>`;
 }
 if(current!=='home'&&!storyActive&&!topic)root.insertAdjacentHTML('beforeend',`<button type="button" class="quiet-button story-entry" data-story="${current}">Follow Alex through this decision →</button>`);
 $('.story').scrollTop=0;
 // Pin focus stays in the map. The named reading region is next in tab order.
 if(motion)root.animate([{opacity:.4},{opacity:1}],{duration:180,easing:'ease-out'});
}
function updateReadHint(){const pane=$('.story');$('#reading-hint').classList.toggle('visible',pane.scrollHeight-pane.scrollTop-pane.clientHeight>8);}
$('.story').addEventListener('scroll',updateReadHint,{passive:true});
const readingObserver=new ResizeObserver(updateReadHint);readingObserver.observe($('.story'));readingObserver.observe($('#story-content'));
function setTraveling(value){const layer=$('#scene-spots');layer.classList.toggle('traveling',value);layer.inert=value;}
function setReadingScene(focus){
 focusState=focus;
 $('#experience').classList.toggle('reading',Boolean(focus));
 $('#scene-reset').hidden=!focus;
 $('#scene-highlight').hidden=!focus;
 world?.setReading(Boolean(focus)||drawer.open);
 renderSpots();
}
function restoreScene(){
 const scene=visualScene,index=spots[scene].findIndex(s=>s[0]===focusState?.label);
 travel(scene==='home'?'home':current,{story:storyActive});
 requestAnimationFrame(()=>document.querySelector(`[data-spot="${index}"]`)?.focus({preventScroll:true}));
}
$('#scene-reset').addEventListener('click',restoreScene);
function renderSpots(){
 const layer=$('#scene-spots');
 layer.innerHTML=spots[visualScene].map(([label,x,y],i)=>`<button type="button" class="spot" data-spot="${i}" style="--x:${x};--y:${y}" aria-pressed="${focusState?.label===label}" aria-controls="story-content"><b aria-hidden="true">${focusState?.label===label?'✓':'+'}</b><span>${escape(label)}</span></button>`).join('');
 positionSpots();
}
function positionSpots(){const box=$('#world-stage'),w=box.clientWidth,h=box.clientHeight,artW=Math.min(w,h*1.5),artH=artW/1.5;document.querySelectorAll('.spot').forEach((b,i)=>{let x=Number(b.style.getPropertyValue('--x')),y=Number(b.style.getPropertyValue('--y'));if(artH<230){if(visualScene==='home')y=[80,25,5,26,99,80][i];const compact={budget:[[52,14],[22,51],[79,51],[49,87]],inspect:[[49,14],[83,52],[49,89],[17,52]],deposit:[[18,73],[50,36],[82,73]],search:[[76,22],[22,75],[43,49]],offer:[[22,76],[75,18],[58,48]],settlement:[[75,74],[24,30],[28,74]]};if(compact[visualScene])[x,y]=compact[visualScene][i];}const halfW=b.offsetWidth/2+3,halfH=b.offsetHeight/2+3;b.style.left=`${Math.max(halfW,Math.min(w-halfW,artH<230?w*x/100:(w-artW)/2+artW*x/100))}px`;b.style.top=`${Math.max(halfH,Math.min(h-halfH,artH<230?h*y/100:(h-artH)/2+artH*y/100))}px`;});
 const highlight=$('#scene-highlight');
 if(focusState){highlight.style.left=`${(w-artW)/2+artW*focusState.x/100}px`;highlight.style.top=`${(h-artH)/2+artH*focusState.y/100}px`;highlight.style.width=`${artW*(visualScene==='home'?.17:.24)}px`;highlight.style.height=`${artH*.32}px`;}
}
new ResizeObserver(positionSpots).observe($('#world-stage'));
function travel(id,{writeHash=true,focus=null,story=false}={}){
 if(!ids.includes(id)&&id!=='home')id='home';current=id;storyActive=story&&id!=='home';if(storyActive){storyPosition=id;storyStarted=true;saveStory();}visualScene=focus?.scene||id;activeSpot=null;const version=++routeVersion;
 setReadingScene(focus);
 if(id!=='home'&&!focus){visited.add(id);saveReading();}
 if(writeHash)writeRoute(storyActive?`#story/${id}`:focus?.scene==='home'?`#home/${id}`:`#${id}`);
 if(drawer.open)drawer.close();
 showStory();
 $('#world-label').textContent=visualScene==='home'?'AOTEAROA, NEW ZEALAND':`${String(ids.indexOf(id)+1).padStart(2,'0')} / ${meta[id].label.toUpperCase()}`;
 $('#world-hint').textContent=id==='home'?'A little world. A big life decision.':'Follow your curiosity.';
 $('#scene-caption').textContent=focus?`Selected: ${focus.label}`:id==='home'?'Choose a person or place.':'Choose a pin to explore this step.';
 $('#journey-label').textContent=storyActive?'ALEX’S STORY':'EXPLORE THE WORLD';$('#resume-story').hidden=storyActive||!storyStarted;$('.journey-heading').classList.toggle('has-resume',!storyActive&&storyStarted);
 $('#journey-progress').textContent=id==='home'?'10 decisions. Explore in any order.':`${journey[id].stage} · ${ids.indexOf(id)+1} of 10`;
 $('#previous').disabled=id==='home';const nextId=id==='home'?'decide':ids[ids.indexOf(id)+1];const nextLabel=id==='home'?'Begin story':nextId?`Next: ${meta[nextId].short}`:'Back to map';$('#next').innerHTML=`<span>${nextLabel}</span><b aria-hidden="true">→</b>`;$('#next').setAttribute('aria-label',nextId?`${nextLabel}. ${meta[nextId].label}`:nextLabel);$('#previous').setAttribute('aria-label',ids.indexOf(id)>0?`Previous chapter: ${meta[ids[ids.indexOf(id)-1]].label}`:'Return to the world map');
 document.querySelectorAll('.stop').forEach(a=>{const active=a.dataset.go===id;a.classList.toggle('visited',visited.has(a.dataset.go));if(active)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
 const stop=$(`.stop[data-go="${id}"]`);if(stop){const rail=$('#journey-stops');const r=stop.getBoundingClientRect(),rr=rail.getBoundingClientRect();if(r.left<rr.left||r.right>rr.right)rail.scrollTo({left:stop.offsetLeft-rail.clientWidth/2+stop.offsetWidth/2,behavior:'instant'});}
 const fallback=$('#scene-fallback');fallback.src=imageMap[visualScene];fallback.alt=descriptions[visualScene];
 if(world&&!worldFailed){setTraveling(true);$('#scene-loading').hidden=false;world.goTo(visualScene,{immediate:!motion}).then(ok=>{if(version===routeVersion){setTraveling(false);$('#scene-loading').hidden=true;if(!ok){fallback.hidden=false;}else{fallback.hidden=true;}}});}
 else{fallback.hidden=false;$('#scene-loading').hidden=true;setTraveling(false);}
 $('#route-status').textContent=id==='home'?'World map':`Chapter ${ids.indexOf(id)+1} of 10: ${meta[id].label}`;
}
function adjacent(direction){const index=ids.indexOf(current);travel(direction<0?(index<=0?'home':ids[index-1]):index===ids.length-1?'home':ids[index+1],{story:storyActive||(current==='home'&&direction>0)});}
$('#resume-story').addEventListener('click',()=>travel(storyPosition,{story:true}));
$('#previous').addEventListener('click',()=>adjacent(-1));$('#next').addEventListener('click',()=>adjacent(1));
$('#journey-stops').innerHTML=chapters.map((c,i)=>`<button type="button" data-go="${c.id}" class="stop" title="${escape(meta[c.id].label)}"><i>${String(i+1).padStart(2,'0')}</i> <small>${meta[c.id].short}</small></button>`).join('');
$('#map-button').addEventListener('click',()=>travel('home'));$('#all-chapters-button').addEventListener('click',()=>openDrawer('chapters'));$('#faq-button').addEventListener('click',()=>openDrawer('faq'));$('#sources-button').addEventListener('click',()=>openDrawer('sources'));$('#about-button').addEventListener('click',()=>openDrawer('about'));
$('.brand').addEventListener('click',e=>{e.preventDefault();travel('home');});
document.addEventListener('click',e=>{const story=e.target.closest('[data-story]');if(story){travel(story.dataset.story,{story:true});return;}if(e.target.closest('[data-story-next]')){adjacent(1);return;}const choice=e.target.closest('[data-story-choice]');if(choice&&storyActive&&moments[current].choices?.some(([key])=>key===choice.dataset.storyChoice)){storyChoices[current]=choice.dataset.storyChoice;saveStory();document.querySelectorAll('[data-story-choice]').forEach(b=>{const selected=b===choice;b.setAttribute('aria-pressed',String(selected));b.querySelector('span').textContent=selected?'✓':'↗';});$('.story-consequence').textContent=moments[current].choices.find(([key])=>key===choice.dataset.storyChoice)[2];return;}const go=e.target.closest('[data-go]');if(go){e.preventDefault();travel(go.dataset.go);return;}const open=e.target.closest('[data-open]');if(open){openDrawer(open.dataset.open);return;}if(e.target.closest('[data-topic-back]')){restoreScene();return;}if(e.target.closest('[data-explore-chapter]'))travel(current);});
function activateSpot(index,scene=visualScene,{writeHash=true}={}){
 const [label,x,y,target]=spots[scene][index];
 if(scene==='home'){travel(target,{writeHash,focus:homeFocus(index)});return;}
 activeSpot=index;if(writeHash)writeRoute(`#${storyActive?'story/':''}${current}/${index}`);
 let topic;
 if(current==='inspect'){const [title,copy,query]=inspection[target],f=findFaq('inspect',query);topic={title,copy,url:f.url,source:f.source};}
 else if(replies[current]?.[target])topic={title:label,copy:replies[current][target]};
 else if(current==='offer'&&target==='contract'){const f=findFaq('offer','Can I walk away');topic={title:'Read before you sign.',copy:f.answer,url:f.url,source:f.source};}
 else if(target!=='calculator'){const f=findFaq(current,target);if(f)topic={title:label,copy:f.answer,url:f.url,source:f.source};}
 setReadingScene({scene:current,x,y,label});
 showStory(topic);
 $('#scene-caption').textContent=`Selected: ${label}`;
 $('#route-status').textContent=`${label}. ${topic?.title||meta[current].label}`;
 if(target==='calculator')openDrawer('calculator');
}
$('#scene-spots').addEventListener('click',e=>{const btn=e.target.closest('[data-spot]');if(btn){const index=Number(btn.dataset.spot);if(btn.getAttribute('aria-pressed')==='true')restoreScene();else{activateSpot(index);document.querySelector(`[data-spot="${index}"]`)?.focus({preventScroll:true});}}});
window.addEventListener('hashchange',readRoute);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.open&&focusState){e.preventDefault();restoreScene();return;}if(drawer.open||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,textarea,select,summary,[contenteditable=true]'))return;if(['ArrowDown','ArrowUp','PageDown','PageUp'].includes(e.key)){e.preventDefault();const amount=e.key.startsWith('Page')?$('.story').clientHeight*.8:64;$('.story').scrollBy({top:e.key.endsWith('Down')?amount:-amount,behavior:'instant'});return;}if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();adjacent(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1);}});
function openDrawer(mode){world?.setReading(true);drawerMode=mode;drawerChapter=current==='home'?'decide':current;drawerTab=mode==='questions'?'questions':['calculator','examples'].includes(mode)?'overview':'checklist';renderDrawer();if(!drawer.open)drawer.showModal();$('#close-drawer').focus();if(motion)drawer.animate([{transform:'translateX(35px)',opacity:.6},{transform:'translateX(0)',opacity:1}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});}
drawer.addEventListener('close',()=>world?.setReading(Boolean(focusState)));
$('#close-drawer').addEventListener('click',()=>drawer.close());drawer.addEventListener('click',e=>{if(e.target===drawer&&e.clientX<drawer.getBoundingClientRect().left)drawer.close();});
function renderDrawer(){const body=$('#drawer-body');body.innerHTML='';$('#drawer-kicker').textContent='YOUR FIELD NOTES';
 if(['chapter','questions','calculator','examples'].includes(drawerMode)){const c=chapter(drawerChapter),m=meta[c.id];$('#drawer-title').textContent=m.label;body.innerHTML=`<div class="drawer-tabs" aria-label="Chapter detail views"><button type="button" data-detail-tab="overview" aria-pressed="${drawerTab==='overview'}">Explore</button><button type="button" data-detail-tab="checklist" aria-pressed="${drawerTab==='checklist'}">Checklist</button><button type="button" data-detail-tab="questions" aria-pressed="${drawerTab==='questions'}">Questions (${c.details.length})</button></div><div id="detail-content"></div>`;const content=$('#detail-content');
 if(drawerTab==='questions')content.innerHTML=c.details.map(f=>faqMarkup(f)).join('');
 if(drawerTab==='checklist')content.innerHTML=`<p>Bring these questions to the people helping you buy.</p><h3>Before you move on</h3><ul class="checklist">${c.checklist.map((s,i)=>`<li><label><input type="checkbox" data-checklist="${c.id}-${i}" ${checks.has(`${c.id}-${i}`)?'checked':''}><span>${escape(s)}</span></label></li>`).join('')}</ul><p class="check-note">A reading aid, not an approval. Ticks are saved in this browser tab.</p><p class="shortcut"><strong>A USEFUL SHORTCUT</strong>${escape(c.shortcut)}</p><p class="shortcut"><strong>A COMMON TRAP</strong>${escape(c.mistake)}</p>`;
 if(drawerTab==='overview'){content.innerHTML=`<p>${m.lead}</p>${m.controls}<p class="shortcut"><strong>WORTH KNOWING</strong>${mustKnow[c.id]}</p>`;if(c.id==='deposit'){$('.money-split').insertAdjacentHTML('beforebegin',`<div class="deposit-meter" role="img" aria-label="20% your contribution; 80% home loan">${Array.from({length:20},(_,i)=>`<span class="${i<4?'own':''}"></span>`).join('')}</div><div class="meter-key"><span>Your contribution</span><span>The bank’s part</span></div>`);}if(c.id==='mortgage'){$('#loan-total').insertAdjacentHTML('afterend','<div class="repayment-split"><strong>Your first monthly payment</strong><div><i id="interest-bar"></i></div><p class="small" id="interest-label"></p></div>');updateLoan();}if(c.id==='inspect')content.insertAdjacentHTML('beforeend',`<div class="inspection-links">${inspection.map(([t],i)=>`<button type="button" data-inspect="${i}" aria-pressed="${i===0}">${t}</button>`).join('')}</div>`);}
 }else if(drawerMode==='faq'){$('#drawer-title').innerHTML='The whole guide.<br><em>One place to look.</em>';body.innerHTML=`<div class="faq-tools"><label class="sr-only" for="faq-search">Search the whole field guide</label><input id="faq-search" type="search" placeholder="Try ‘consent’, ‘broker’ or ‘insurance’" autocomplete="off"><div class="guide-filters"><label class="sr-only" for="faq-kind">Kind of information</label><select id="faq-kind"><option value="all">Everything</option><option value="questions">Questions</option><option value="checklists">Checklists</option><option value="links">Official links</option></select><label class="sr-only" for="faq-topic">Choose a topic</label><select id="faq-topic"><option value="all">Every topic</option>${chapters.map(c=>`<option value="${c.id}">${meta[c.id].label}</option>`).join('')}</select></div></div><p id="faq-count" role="status"></p><div id="faq-list"></div>`;renderFaq();}
 else if(drawerMode==='sources'){$('#drawer-title').innerHTML='The right places<br><em>to look.</em>';body.innerHTML=`<p>Official tools, regulations and records. Check the rules for the specific property and your situation.</p><p class="small" style="margin:15px 0">Sources reviewed 25 October 2026. Links open in a new tab.</p>${resources.map(r=>`<article class="resource"><small>${escape(r.category)}</small>${external(r.url,r.title)}<p>${escape(r.description)}</p></article>`).join('')}<p class="small">Local rules and hazards depend on the address. Check the territorial and regional council. Legislation can have pending amendments; ask your lawyer what applies.</p>`;}
 else if(drawerMode==='chapters'){$('#drawer-title').innerHTML='Pick a decision.<br><em>Keep your place.</em>';body.innerHTML=`<p>Explore any topic. Resume Alex’s story whenever you like. Finance, insurance and property checks often overlap in real life.</p><div class="chapter-picker" style="margin-top:24px">${chapters.map((c,i)=>`<button type="button" data-go="${c.id}"><b>${String(i+1).padStart(2,'0')}</b><span>${meta[c.id].label}</span></button>`).join('')}</div><button class="quiet-button" data-go="home">← Back to the world</button>`;}
 else{$('#drawer-title').innerHTML='A little knowledge.<br><em>A big step.</em>';body.innerHTML=`<p>An independent illustrated concept for first-home buyers in Aotearoa. Alex is a fictional buyer; story choices explore examples, not your finances or eligibility. The short story stays in the world; the details stay in your field notes.</p><h3>Made for exploring</h3><p>Click a spot in a scene, follow the ten stops below, or use the arrow keys. The labelled Next button takes you to the following chapter. Motion can be turned off at the top.</p><h3>Read the detail before committing</h3><p>General education, not personal financial, legal or building advice. The guide covers the main journey and common traps; it cannot determine every rule or risk for a specific property. Ask your own advisers and check the official sources.</p><h3>About the examples</h3><p>Images are illustrative, not construction drawings. Calculations use example amounts and constant rates, not live offers. Chapters explored and checklist ticks are reading aids saved in this browser tab.</p><h3>Sources &amp; privacy</h3><p>Source review: 25 October 2026. No login, lead collection, analytics or sponsored recommendations. The guide and artwork load locally; external links only open when selected.</p><div class="story-actions"><button class="button" data-open="sources">Official links &amp; regulations <span>↗</span></button><a href="SOURCES.md">Source and coverage notes ↗</a></div>`;}
 drawer.scrollTop=0;
}
function renderFaq(){
 if($('#faq-kind').value==='links')$('#faq-topic').value='all';
 const term=$('#faq-search').value.trim().toLowerCase(),topic=$('#faq-topic').value,kind=$('#faq-kind').value;
 $('#faq-topic').disabled=kind==='links';
 const matchesText=text=>text.toLowerCase().includes(term);
 const questions=faqs.filter(f=>(topic==='all'||f.chapter===topic)&&matchesText(`${f.question} ${f.answer}`)).sort((a,b)=>Number(matchesText(b.question))-Number(matchesText(a.question)));
 const lists=chapters.filter(c=>(topic==='all'||c.id===topic)&&matchesText([meta[c.id].label,...c.checklist,c.shortcut,c.mistake].join(' ')));
 const links=resources.filter(r=>matchesText(`${r.category} ${r.title} ${r.description}`));
 if(!term&&topic==='all'&&kind==='all'){
  $('#faq-count').textContent='Short story above. All the detail here.';
  $('#faq-list').innerHTML=`<div class="guide-index"><button type="button" data-guide-kind="questions"><strong>Questions</strong><span>64 plain-language answers, with sources →</span></button><button type="button" data-guide-kind="checklists"><strong>Checklists</strong><span>10 sets of checks, shortcuts and common traps →</span></button><button type="button" data-guide-kind="links"><strong>Official links</strong><span>15 places to find rules, records and help →</span></button></div>`;return;
 }
 const showQ=kind==='all'||kind==='questions',showC=kind==='all'||kind==='checklists',showL=(kind==='all'&&topic==='all')||kind==='links';
 $('#faq-topic').disabled=kind==='links';
 const total=(showQ?questions.length:0)+(showC?lists.length:0)+(showL?links.length:0);
 $('#faq-count').textContent=`${total} ${total===1?'result':'results'}`;
 $('#faq-list').innerHTML=(showQ&&questions.length?`<h3>Questions</h3>${questions.map(f=>faqMarkup(f,true)).join('')}`:'')+(showC&&lists.length?`<h3>Checklists &amp; common traps</h3><div class="guide-index">${lists.map(c=>`<button type="button" data-guide-chapter="${c.id}"><strong>${escape(meta[c.id].label)}</strong><span>${term?escape(c.checklist.find(item=>matchesText(item))||c.shortcut).slice(0,180):`${c.checklist.length} checks · shortcut · common trap`} →</span></button>`).join('')}</div>`:'')+(showL&&links.length?`<h3>Official links</h3>${links.map(r=>`<article class="resource"><small>${escape(r.category)}</small>${external(r.url,r.title)}<p>${escape(r.description)}</p></article>`).join('')}`:'')||'<p>No matches. Try a broader word, “Everything” or “Every topic”.</p>';
}
function updateLoan(){if(!$('#loan-amount'))return;const p=Number($('#loan-amount').value),r=Number($('#loan-rate').value),y=Number($('#loan-years').value),monthly=monthlyPayment(p,r,y),interest=p*r/1200;$('#monthly-payment').textContent=money(monthly);$('#loan-total').textContent=`Total interest in this example: ${money(monthly*y*12-p)} over ${y} years.`;$('#interest-bar').style.width=`${interest/monthly*100}%`;$('#interest-label').textContent=`Interest: ${money(interest)} · Loan paid down: ${money(monthly-interest)}. The split changes as the balance falls.`;}
drawer.addEventListener('input',e=>{if(e.target.id==='faq-search')renderFaq();if(e.target.id==='deposit-range'){const p=Number(e.target.value);$('#deposit-percent').textContent=`${p}%`;$('#deposit-cash').textContent=money(700000*p/100);$('#deposit-loan').textContent=money(700000*(1-p/100));document.querySelectorAll('.deposit-meter span').forEach((b,i)=>b.classList.toggle('own',i<p/5));$('.deposit-meter').setAttribute('aria-label',`${p}% your contribution; ${100-p}% home loan`);}});
drawer.addEventListener('change',e=>{if(['faq-topic','faq-kind'].includes(e.target.id))renderFaq();if(e.target.id.startsWith('loan-'))updateLoan();if(e.target.dataset.checklist){if(e.target.checked)checks.add(e.target.dataset.checklist);else checks.delete(e.target.dataset.checklist);saveReading();}});
drawer.addEventListener('click',e=>{const kind=e.target.closest('[data-guide-kind]');if(kind){$('#faq-kind').value=kind.dataset.guideKind;renderFaq();$('#faq-kind').focus();return;}const guide=e.target.closest('[data-guide-chapter]');if(guide){drawerMode='chapter';drawerChapter=guide.dataset.guideChapter;drawerTab='checklist';renderDrawer();$('#drawer-title').setAttribute('tabindex','-1');$('#drawer-title').focus();return;}const tab=e.target.closest('[data-detail-tab]');if(tab){drawerTab=tab.dataset.detailTab;renderDrawer();$(`[data-detail-tab="${drawerTab}"]`).focus();return;}const choice=e.target.closest('[data-value]');if(choice){const group=choice.closest('[data-choices]');group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===choice)));$(`#${group.dataset.choices}-result`).textContent=replies[group.dataset.choices][choice.dataset.value];}const inspect=e.target.closest('[data-inspect]');if(inspect){const [t,copy]=inspection[Number(inspect.dataset.inspect)];$('#inspect-result').innerHTML=`<strong>${t}</strong>${copy}`;document.querySelectorAll('[data-inspect]').forEach(b=>b.setAttribute('aria-pressed',String(b===inspect)));}});
readRoute();
const bootWorld=async()=>{try{const {createWorld}=await import('./world.js');world=createWorld({mount:$('#world-canvas'),imageMap,reducedMotion:!motion,onReady:()=>{worldReady=true;$('#scene-fallback').hidden=true;},onError:()=>{worldFailed=true;$('#scene-fallback').hidden=false;$('#world-canvas').hidden=true;$('#scene-loading').hidden=true;setTraveling(false);},onRest:id=>{if(id===visualScene){setTraveling(false);$('#scene-loading').hidden=true;if(worldReady&&!worldFailed)$('#scene-fallback').hidden=true;}}});await world.goTo(visualScene,{immediate:true});world.setReading(Boolean(focusState)||drawer.open);}catch{worldFailed=true;$('#scene-fallback').hidden=false;}};
if('requestIdleCallback' in window)requestIdleCallback(bootWorld,{timeout:900});else setTimeout(bootWorld,200);
window.addEventListener('pagehide',e=>{if(!e.persisted)world?.dispose();});
window.addEventListener('pageshow',e=>{if(e.persisted&&world&&!worldFailed)world.goTo(visualScene,{immediate:true}).then(()=>{world.setReading(Boolean(focusState)||drawer.open);});});
$('.skip').addEventListener('click',e=>{e.preventDefault();$('#story-title').focus();});
