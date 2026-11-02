import { answerBlocks } from './home-truths-answer-layout.js';
import { topics as englishTopics } from './home-truths-content.js';
import { areas as englishAreas, topicRoute, areaRoute, resolveRoute } from './home-truths-navigation.js';
import { localizedReference } from './home-truths-reference.js';
import { monthlyPayment } from './finance.js';
import { searchScore, faqSearchScore, orderTopicFAQs } from './home-truths-search.js';
import { languages, normalizeLanguage, localizedContent, translate } from './home-truths-i18n.js';
import { icon } from './home-truths-icons.js';
import { beginnerContent } from './home-truths-beginner.js';
import { featuredQuestions } from './home-truths-featured.js';
import { exampleHTML, updateExample, updateRepayment } from './home-truths-examples.js';

let language='en', topics=englishTopics, areas=englishAreas, languageRequest=0;
const tr=(key,values)=>translate(language,key,values);
const localeLoaders={'pt-BR':()=>import('./locales/pt-BR.json'),es:()=>import('./locales/es.json'),'zh-Hans':()=>import('./locales/zh-Hans.json')};

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const actionLabel = key => `${escape(tr(key).replace(/ ↗$/,''))} ${icon('arrow-up-right')}`;
const keyFor = (topic, card) => `${topic.id}/${card.id}`;
const routeFor = topicRoute;
let topic = topics[0], card = topic.cards[0], currentView, modalVersion = 0, renderVersion = 0, toastTimer;
let detailsPromise,exploreOnRender=false;
let answerVisual=()=>null,cardVisual=()=>null,visualsPromise;
function loadVisuals(){return visualsPromise ||= import('./home-truths-answer-visuals.js').then(module=>{answerVisual=module.answerVisual;cardVisual=module.cardVisual;return module;}).catch(error=>{visualsPromise=undefined;throw error;});}
const referencePromises=new Map();
const referenceLoaders={'pt-BR':()=>import('./locales/deep-pt-BR.json'),es:()=>import('./locales/deep-es.json'),'zh-Hans':()=>import('./locales/deep-zh-Hans.json')};
const artDescriptions = {
  decide: 'A couple considering a weatherboard home, with moving boxes, a path and keys.',
  costs: 'A house on a long receipt, alongside keys, a folder, an inspection torch, a gutter and an umbrella.',
  broker: 'A buyer and mortgage adviser talking across a table with a notebook and documents.',
  neighbourhood: 'A folded street map connects a home, bus stop, shops and a park.',
  inspection: 'A weatherboard home with one roof and a wall cutaway showing framing, insulation and foundation piles. An illustration, not a building assessment.',
  contract: 'A purchase document, pen, calendar and keys beside a home.',
  own: 'A homeowner carries a moving box to their front door, with plants and maintenance tools nearby.',
};

function toast(message) { message=tr(message); clearTimeout(toastTimer); $('toast').textContent = message; $('toast').hidden = false; toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3200); }
function areaTile(a,index) {
  const href=a.topics.length===1?routeFor(topics.find(t=>t.id===a.topics[0])):areaRoute(a);
  return `<a class="interest-block tone-${a.tone}" href="${href}"><div class="block-copy"><span class="eyebrow">${escape(a.label)}</span><h2>${escape(a.title)}</h2></div><img src="${artPath(a.image)}" ${artSources(a.image,'(max-width:740px) 40vw, (max-width:1050px) 42vw, 30vw')} width="1200" height="800" alt="" decoding="async" loading="${index<2?'eager':'lazy'}" fetchpriority="${index===0?'high':'auto'}"><div class="block-bottom"><span>${escape(a.description)}</span><span class="block-arrow" aria-hidden="true">${icon('arrow-up-right')}</span></div></a>`;
}
function topicTile(t) {
  return `<a class="topic-block" href="${routeFor(t)}"><img src="${artPath(t.image)}" ${artSources(t.image,'(max-width:740px) 92px, (max-width:1050px) 100px, 260px')} width="1200" height="800" alt="" loading="lazy"><div><h2>${escape(t.label)}</h2><p>${escape(t.intro)}</p><span class="topic-preview">${t.cards.map(c=>escape(c.label)).join(' · ')}</span></div><span class="block-arrow" aria-hidden="true">${icon('arrow-up-right')}</span></a>`;
}
function questionBlock(t,c,open) {
  const key=keyFor(t,c);
  return `<details class="question-block" data-question="${escape(key)}" ${open?'open':''}><summary><h2><small>${escape(c.label)}</small>${escape(c.title)}</h2><span class="question-plus" aria-hidden="true">${icon('plus')}</span></summary><div class="question-content"><div class="card-explanation" data-explanation="${escape(key)}">${cardExplanation(t,c)||`<p class="question-answer">${escape(c.body)}</p>${learningPoints(c)}`}</div><p class="gotcha"><strong>${escape(tr('Easy to miss'))}</strong>${escape(c.gotcha)}</p></div></details>`;
}
function beginnerHome(copy){
  return `<section class="beginner-entry" aria-label="${escape(copy.startLabel)}"><a class="start-invitation" href="#/start"><div><h2>${escape(copy.homeTitle)}</h2><p>${escape(copy.homeIntro)}</p><span class="start-action">${escape(copy.homeAction)} ${icon('arrow-right')}</span></div><img src="${artPath('decide')}" ${artSources('decide','(max-width:740px) 110px, 180px')} width="1200" height="800" alt="" decoding="async"></a><div class="home-search"><form id="home-search-form" role="search"><label for="home-question">${escape(copy.shared.searchLabel)}</label><div class="home-search-field"><input id="home-question" name="question" type="search" placeholder="${escape(copy.shared.searchPlaceholder)}" autocomplete="off"><button type="submit" aria-label="${escape(copy.shared.searchAction)}">${icon('search')}</button></div></form><div class="search-examples">${copy.shared.searchExamples.map(q=>`<button type="button" data-search-query="${escape(q)}">${escape(q)}</button>`).join('')}</div></div></section>`;
}
function beginnerJourney(copy){
  return `<div class="beginner-journey"><section class="journey-intro"><span class="eyebrow">${escape(copy.startLabel)}</span><h1 id="topic-title" tabindex="-1">${escape(copy.title)}</h1><p>${escape(copy.intro)}</p><img src="${artPath('decide')}" ${artSources('decide','(max-width:740px) 220px, 500px')} width="1200" height="800" alt=""><a class="text-button" href="#/">${escape(copy.shared.allTopics)} ${icon('arrow-right')}</a></section><ol class="journey-steps">${copy.steps.map((step,index)=>`<li><span class="step-number" aria-hidden="true">${index+1}</span><div><h2>${escape(step.title)}</h2><p>${escape(step.body)}</p><a href="${routeFor({id:step.topicId},step.cardId?{id:step.cardId}:null)}">${escape(step.action)} ${icon('arrow-right')}</a></div></li>`).join('')}</ol></div>`;
}
function nextAction(t,copy){
  const next=copy.nextSteps[t.id];
  return `<section class="next-action" aria-label="${escape(copy.shared.nextStep)}"><span class="eyebrow">${escape(copy.shared.nextStep)}</span><p>${escape(next.body)}</p><a href="${routeFor({id:next.topicId})}">${escape(next.action)} ${icon('arrow-right')}</a></section>`;
}
function commonQuestions(t,reference,copy,pending=false){
  if(!reference)return `<section id="common-questions" class="common-questions" aria-busy="${pending}"><h2>${escape(copy.shared.commonQuestions)}</h2><p class="disclaimer">${escape(tr(pending?'Opening the guide…':'Detailed answers could not load. Topic navigation is still available.'))}</p><button class="text-button" data-topic-faq>${actionLabel('Questions & answers ↗')}</button></section>`;
  const questions=featuredQuestions(t,reference.faqs);
  return `<section id="common-questions" class="common-questions" aria-labelledby="common-title"><h2 id="common-title">${escape(copy.shared.commonQuestions)}</h2>${questions.map((f,index)=>`<details class="faq" ${index===0?'open':''}><summary>${escape(f.question)}</summary><div class="faq-answer">${textBlocks(f.answer)}<div class="answer-tools">${sourceLink(f.source,f.url)}</div></div></details>`).join('')}<button class="text-button" data-topic-faq>${escape(copy.shared.moreQuestions)} ${icon('arrow-up-right')}</button></section>`;
}
function topicSources(t,copy){
  return `<section class="topic-evidence"><h2>${escape(copy.shared.sourceTitle)}</h2>${linkList(t.sourceLinks)}<a class="back-to-steps" href="#/start">${escape(copy.shared.backToSteps)} ${icon('arrow-right')}</a></section>`;
}
async function render(initial=false) {
  const version=++renderVersion;
  const route=resolveRoute(location.hash);
  const beginner=beginnerContent(language);
  const referenceRequest=route.kind==='topic'?loadDetails().catch(()=>null):null;
  if(route.kind==='topic'){
    try{await loadVisuals();}catch{/* The complete text remains available if the optional visuals fail. */}
    if(version!==renderVersion)return;
  }
  if(route.topic){route.topic=topics.find(t=>t.id===route.topic.id);route.card=route.topic.cards.find(c=>c.id===route.card?.id);}
  if(route.area)route.area=areas.find(a=>a.id===route.area.id);
  if(location.hash!==route.canonical)history.replaceState(null,'',route.canonical);
  if($('drawer').open)closeDrawer();
  currentView=route;
  document.body.dataset.view=route.kind;
  let crumb=`<a href="#/">${escape(tr('All topics'))}</a>`;
  if(route.kind==='home'){
    document.title=`Home Veritas — ${tr('Your helper guide to buying a home')}`;
    $('breadcrumbs').hidden=true;
    $('main').innerHTML=`<section class="browse-heading"><div><span class="eyebrow">${escape(tr('BUYING A HOME IN NEW ZEALAND'))}</span><h1 id="topic-title" tabindex="-1">${escape(tr('What’s on your mind?'))}</h1></div></section>${beginnerHome(beginner)}<h2 id="browse-topics" tabindex="-1" class="browse-section-title">${escape(beginner.browseLabel)}</h2><section class="interest-grid" aria-label="${escape(tr('Choose an interest area'))}">${areas.map(areaTile).join('')}</section>`;
  }else if(route.kind==='start'){
    document.title=`${beginner.startLabel} — Home Veritas`;
    crumb+=`<span aria-hidden="true">/</span><span aria-current="page">${escape(beginner.startLabel)}</span>`;
    $('breadcrumbs').hidden=false;
    $('main').innerHTML=beginnerJourney(beginner);
  }else if(route.kind==='area'){
    const a=route.area;
    document.title=`${a.label} — Home Veritas`;
    crumb+=`<span aria-hidden="true">/</span><span aria-current="page">${escape(a.label)}</span>`;
    $('breadcrumbs').hidden=false;
    $('main').innerHTML=`<section class="area-heading"><div><span class="eyebrow">${escape(a.label)}</span><h1 id="topic-title" tabindex="-1">${escape(a.title)}</h1><p>${escape(a.description)}</p></div><img src="${artPath(a.image)}" ${artSources(a.image,'300px')} width="1200" height="800" alt=""></section><section class="topic-block-grid count-${a.topics.length}" aria-label="${escape(a.label)}">${a.topics.map(id=>topicTile(topics.find(t=>t.id===id))).join('')}</section><a class="back-area" href="#/">${icon('arrow-left')} ${escape(tr('Explore another area'))}</a>`;
  }else{
    topic=route.topic;card=route.card||topic.cards[0];
    const a=route.area;
    document.title=`${topic.label} — Home Veritas`;
    if(a.topics.length>1)crumb+=`<span aria-hidden="true">/</span><a href="${areaRoute(a)}">${escape(a.label)}</a>`;
    crumb+=`<span aria-hidden="true">/</span><span aria-current="page">${escape(topic.label)}</span>`;
    $('breadcrumbs').hidden=false;
    const siblings=a.topics.filter(id=>id!==topic.id);
    $('main').innerHTML=`<div class="topic-reading"><section class="topic-visual"><span class="eyebrow">${escape(a.label)}</span><h1 id="topic-title" tabindex="-1">${escape(topic.label)}</h1><p>${escape(topic.intro)}</p><a class="jump-questions" href="#questions" data-jump-questions>${escape(tr('See the questions'))} ${icon('arrow-down')}</a><img class="reading-art" src="${artPath(topic.image)}" ${artSources(topic.image,'(max-width:740px) 218px, (max-width:1050px) 45vw, 660px')} fetchpriority="high" width="1200" height="800" alt="${escape(tr(topic.id==='agents'?'A buyer and real estate agent discussing a property.':artDescriptions[topic.image]))}"><a class="back-area" href="${a.topics.length>1?areaRoute(a):'#/'}">${icon('arrow-left')} ${a.topics.length>1?escape(a.label):escape(tr('All topics'))}</a></section><section id="questions" class="question-stack" tabindex="-1" aria-label="${escape(topic.label)}">${commonQuestions(topic,null,beginner,true)}${exampleHTML(topic.id,language)}${nextAction(topic,beginner)}<div class="question-stack-heading"><h2 class="basics-heading">${escape(beginner.shared.topicBasics)}</h2></div>${topic.cards.map(c=>questionBlock(topic,c,c===route.card)).join('')}<div class="topic-actions"><button class="text-button" data-details="${escape(keyFor(topic,topic.cards[0]))}">${escape(tr('More about {topic}',{topic:topic.label}))} ${icon('arrow-right')}</button>${['deposit','mortgage','budget'].includes(topic.id)?`<button class="text-button" data-calculator>${actionLabel(topic.id==='deposit'?'Deposit calculator ↗':'Repayment calculator ↗')}</button>`:''}</div>${topicSources(topic,beginner)}</section></div>${siblings.length?`<section class="related"><h2>${escape(tr('Also in {area}',{area:a.label}))}</h2><div>${siblings.map(id=>{const t=topics.find(t=>t.id===id);return `<a href="${routeFor(t)}">${escape(t.label)} ${icon('arrow-up-right')}</a>`;}).join('')}</div></section>`:''}`;
  }
  $('breadcrumbs').innerHTML=crumb;
  $('footer-topics').hidden=route.kind==='home';
  $('start-link').toggleAttribute('aria-current',route.kind==='start');
  if(route.kind==='start')$('start-link').setAttribute('aria-current','page');
  delete document.body.dataset.loading;
  $('main').removeAttribute('aria-busy');
  $('route-status').textContent=document.title.replace(' — Home Veritas','');
  if(!initial){$('topic-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  if(exploreOnRender&&route.kind==='home'){exploreOnRender=false;$('browse-topics').focus({preventScroll:true});$('browse-topics').scrollIntoView({block:'start',behavior:'instant'});}
  if(referenceRequest)referenceRequest.then(reference=>{
    if(version!==renderVersion)return;
    const slot=$('common-questions'),restoreFocus=slot.contains(document.activeElement);
    slot.outerHTML=commonQuestions(route.topic,reference,beginner);
    if(restoreFocus)$('common-questions').querySelector('summary,button')?.focus({preventScroll:true});
  });
  if(route.kind==='topic')document.querySelectorAll('.question-block').forEach(el=>el.addEventListener('toggle',()=>{
    if(!el.isConnected)return;
    if(!el.open){if(!document.querySelector('.question-block[open]'))history.replaceState(null,'',routeFor(topic));return;}
    const entry=findCard(el.dataset.question);
    if(entry){topic=entry.t;card=entry.c;history.replaceState(null,'',routeFor(topic,card));}
  }));
}

function showDrawer(title,kicker='') {
  title=tr(title);kicker=tr(kicker);
  modalVersion++;
  $('drawer-title').textContent=title;$('drawer-kicker').textContent=kicker;$('drawer-kicker').hidden=!kicker;
  $('drawer-content').innerHTML=`<p class="loading-note">${escape(tr('Opening the guide…'))}</p>`;
  if(!$('drawer').open)$('drawer').showModal();
  document.body.style.overflow='hidden';$('drawer').scrollTop=0;
  return modalVersion;
}
function closeDrawer(){modalVersion++;$('drawer').close();document.body.style.overflow='';}
async function loadDetails(){
  const code=language;
  if(!referencePromises.has(code)){
    const base=detailsPromise ||= Promise.all([import('./guide-content.js'),import('./resources.js'),loadVisuals()]).catch(error=>{detailsPromise=undefined;throw error;});
    const request=Promise.all([base,code==='en'?null:referenceLoaders[code]().then(module=>module.default)]).then(([[guide,links,visuals],translation])=>{answerVisual=visuals.answerVisual;return localizedReference(guide,links,translation);}).catch(error=>{referencePromises.delete(code);throw error;});
    referencePromises.set(code,request);
  }
  return referencePromises.get(code);
}
function failDrawer(version){if(version===modalVersion)$('drawer-content').innerHTML=`<p class="drawer-intro">${escape(tr("The detailed guide could not load. Close this panel and try again, or open the official guide below."))}</p><a href="https://www.settled.govt.nz/buying-a-home/" target="_blank" rel="noopener noreferrer">${actionLabel("Settled · buying a home ↗")}</a>`;}
const sourceLink = (label,url,extra='') => `<a class="source-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ${icon('arrow-up-right')}</a>${extra}`;
function textBlocks(text){return `<div class="answer-blocks">${answerBlocks(text,language).map((part,i)=>`<p class="${i===0?'answer-lead':'answer-support'}">${escape(part)}</p>`).join('')}</div>`;}
function collageFrame(item,step,count){
  const columns=item.columns||1,rows=item.rows||1,panel=item.panel||0;
  const sprite=columns>1||rows>1;
  const topPair=sprite&&count===2;
  const cropRows=topPair?1.6:rows;
  const position=sprite?` style="--scene-columns:${columns};--scene-rows:${cropRows};--scene-x:${panel%columns};--scene-y:${Math.floor(panel/columns)};${topPair?'aspect-ratio:6/5':''}"`:'';
  return `<div class="collage-frame${sprite?' collage-sprite':''}"${position}><img src="${artPath(item.image)}" ${artSources(item.image,sprite?'(max-width:360px) 165vw, (max-width:740px) 80vw, 600px':'(max-width:740px) 40vw, 300px')} width="1200" height="800" alt="" loading="lazy" decoding="async">${step?`<span class="scene-number" aria-hidden="true">${step}</span>`:''}</div>`;
}
function collageHTML(visual){
  if(!visual)return '';
  return `<figure class="answer-diagram collage-answer ${visual.kind} count-${visual.items.length}"><figcaption>${escape(visual.title)}</figcaption><div class="diagram-items">${visual.items.map((item,i)=>`<div class="diagram-item">${collageFrame(item,visual.kind==='sequence'?i+1:0,visual.items.length)}<div class="scene-caption"><strong>${escape(item.title)}</strong><p>${escape(item.body)}</p></div></div>`).join('')}</div>${visual.note?`<p class="diagram-note">${escape(visual.note)}</p>`:''}</figure>`;
}
function visualHTML(f){return collageHTML(answerVisual(f,language));}
function cardExplanation(t,c){
  const visual=cardVisual(keyFor(t,c),language);
  const definition=t.id==='records'&&c.id==='council'?`<p class="question-answer">${escape(answerBlocks(c.body,language)[0])}</p>`:'';
  return visual?`${definition}${collageHTML(visual)}<details class="full-explanation card-full"><summary>${escape(tr('More detail'))}</summary>${textBlocks(c.body)}${learningPoints(c)}</details>`:null;
}
const faqHTML = f => {const visual=visualHTML(f);return `<details class="faq"><summary>${escape(f.question)}</summary><div class="faq-answer">${visual?`${visual}<details class="full-explanation"><summary>${escape(tr('Full explanation'))}</summary>${textBlocks(f.answer)}</details>`:textBlocks(f.answer)}<div class="answer-tools">${sourceLink(f.source,f.url)}</div></div></details>`;};
const linkList = links => `<ul class="source-list">${links.map(l=>`<li><a href="${escape(l.url)}" target="_blank" rel="noopener noreferrer">${escape(l.label||l.title)} ${icon('arrow-up-right')}${l.description?`<small>${escape(l.description)}</small>`:''}</a></li>`).join('')}</ul>`;

async function openDetails(){
  const t=topic,v=showDrawer(t.label);
  try {
    const {chapters,faqs}=await loadDetails();if(v!==modalVersion)return;
    const relevant=chapters.filter(ch=>t.chapterIds.includes(ch.id));
    const grouped=orderTopicFAQs(t,faqs);
    $('drawer-content').innerHTML=`<section class="detail-section"><h3 class="section-title">${escape(tr('Questions and answers'))}</h3>${grouped.focused.map(faqHTML).join('')}${grouped.other.length?`<details class="more-reference"><summary>${escape(tr('More related questions ({count})',{count:grouped.other.length}))}</summary>${grouped.other.map(faqHTML).join('')}</details>`:''}</section><section class="detail-section"><h3 class="section-title">${escape(tr('What to do next'))}</h3>${relevant.map(ch=>textBlocks(ch.shortcut)).join('')}</section><section class="detail-section"><h3 class="section-title">${escape(tr('Useful links'))}</h3>${linkList(t.sourceLinks)}</section>`;
  }catch{failDrawer(v);}
}
async function openTopics(focusSearch=false,query=''){
  const v=showDrawer('Search the guide');
  $('drawer-content').innerHTML=`<label class="search-label" for="guide-search">${escape(tr('Search topics, questions and useful links'))}</label><input id="guide-search" class="search-input" type="search" placeholder="${escape(tr('Try KiwiSaver, damp, auction, consents…'))}" autocomplete="off">${currentView.kind!=='start'?`<a class="search-start" href="#/start" data-route>${escape(beginnerContent(language).homeTitle)} ${icon('arrow-right')}</a>`:''}<div class="guide-actions"><button class="text-button" data-open-links>${actionLabel('Useful links ↗')}</button></div><div id="search-results" class="search-results"></div>`;
  $('guide-search').value=query;
  let library={faqs:[],resources:[]},libraryLoading=true;
  function results(){
    const q=$('guide-search').value.trim();
    const start=$('drawer-content').querySelector('.search-start');if(start)start.hidden=!!q;
    const matches=t=>searchScore(q,JSON.stringify(t)+(t.id?JSON.stringify(englishTopics.find(e=>e.id===t.id)||''):''))>0;
    const found=topics.filter(matches);
    const questions=q?library.faqs.filter(f=>faqSearchScore(q,f)>0).sort((a,b)=>faqSearchScore(q,b)-faqSearchScore(q,a)):[];
    const links=q?library.resources.filter(matches):[];
    $('search-results').innerHTML=(questions.length?`<section class="result-group"><h3>${escape(tr('Answers ({count})',{count:questions.length}))}</h3>${questions.map(faqHTML).join('')}</section>`:'')+areas.map(s=>{const list=found.filter(t=>s.topics.includes(t.id));return list.length?`<section class="result-group"><h3>${escape(s.label)}</h3>${list.map(t=>`<a class="topic-result" href="${routeFor(t)}" data-route><span><strong>${escape(t.label)}</strong><small>${escape(t.intro)}</small></span>${icon('arrow-right')}</a>`).join('')}</section>`:'';}).join('')+(links.length?`<section class="result-group"><h3>${escape(tr('Useful links'))}</h3>${linkList(links)}</section>`:'')+(libraryLoading?`<p class="loading-note" role="status">${escape(tr('Opening the guide…'))}</p>`:'')+(!libraryLoading&&!found.length&&!questions.length&&!links.length?`<div class="empty"><h3>${escape(tr('No match yet.'))}</h3><p>${escape(tr('Try a shorter word, like “loan”, “title” or “consent”. Clear the search to see every topic.'))}</p></div>`:'');
  }
  $('guide-search').addEventListener('input',results);results();
  if(focusSearch)$('guide-search').focus();
  try{library=await loadDetails();if(v!==modalVersion)return;libraryLoading=false;results();}catch{if(v===modalVersion){libraryLoading=false;results();$('search-results').insertAdjacentHTML('beforeend',`<p class="disclaimer">${escape(tr("Detailed answers could not load. Topic navigation is still available."))}</p>`);}}
}
function findCard(key){for(const t of topics){const c=t.cards.find(c=>keyFor(t,c)===key);if(c)return {t,c};}return null;}
async function openLinks(){
  const activeTopic=currentView.kind==='topic'?currentView.topic:null;
  const v=showDrawer('Useful links');
  try{
    const {resources}=await loadDetails();if(v!==modalVersion)return;
    const selected=activeTopic?.sourceLinks||[];
    const selectedURLs=new Set(selected.map(link=>link.url.replace(/\/$/,'')));
    const other=resources.filter(link=>!selectedURLs.has(link.url.replace(/\/$/,'')));
    const councilNote=activeTopic&&['records','renovate','inspection','homes','insurance'].includes(activeTopic.id)?`<p class="drawer-intro">${escape(tr('For property-specific records and consents, use the council responsible for the address.'))}</p>`:'';
    $('drawer-content').innerHTML=`${referenceNotice()}${councilNote}${activeTopic?`<h3 class="section-title">${escape(tr('For {topic}',{topic:activeTopic.label}))}</h3>${linkList(selected)}<details class="more-reference"><summary>${escape(tr('Links for other topics'))}</summary>${linkList(other)}</details>`:linkList(resources)}`;
  }catch{failDrawer(v);}
}
function openAbout(){
  showDrawer('About Home Veritas');
  $('drawer-content').innerHTML=`<p class="drawer-intro">${escape(tr('Understand the steps, costs and checks involved in buying a home in New Zealand.'))}</p><p>${escape(tr('For advice about a particular home or loan, speak to your own lawyer, mortgage adviser or building inspector.'))}</p><p><a class="text-button" href="https://rafael.co.nz/">${escape(tr('Made by Rafael'))}</a></p>${referenceNotice()}<button class="text-button" data-open-links>${actionLabel('Useful links ↗')}</button>`;
}
const money=n=>new Intl.NumberFormat(languages.find(l=>l.code===language).html,{style:'currency',currency:'NZD',maximumFractionDigits:0}).format(n);
function openCalculator(){
  const deposit=topic.id==='deposit';showDrawer(deposit?'Deposit calculator':'Repayment calculator');
  const slider=(id,label,min,max,step,value)=>`<label for="${id}"><span>${escape(tr(label))}<output id="${id}-value"></output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  $('drawer-content').innerHTML=`<p class="drawer-intro">${escape(tr(deposit?'Your contribution and the loan make up the price. Keep buying costs and emergency cash separate.':'Move one thing at a time. See how the loan, rate and term change a monthly principal-and-interest payment.'))}</p><div class="calc-grid">${deposit?slider('example-price','Example home price',300000,1500000,25000,700000)+slider('example-deposit','Your contribution (%)',5,50,1,20):slider('example-loan','Example loan',100000,1500000,10000,560000)+slider('example-rate','Illustrative annual interest (%)',0,12,.25,6)+slider('example-years','Loan term (years)',5,35,1,30)}</div><div class="calc-result" id="calc-result" aria-live="polite"></div><p class="disclaimer">${escape(tr(deposit?'This is not an eligibility test. Lenders assess affordability and the property; low-deposit lending has extra criteria and may cost more. The sales deposit under the contract is a part-payment toward the price.':'Illustration only, not current rates or a lender quote. Assumes monthly payments and a constant interest rate for the full term, with no fees or extra payments. Excludes rates, insurance and other ownership costs.'))}</p><section class="detail-section"><h3 class="section-title">${escape(tr('Read more'))}</h3>${linkList(topics.find(t=>t.id===(deposit?'deposit':'mortgage')).sourceLinks)}</section>`;
  function update(){if(deposit){const price=Number($('example-price').value),percent=Number($('example-deposit').value),cash=price*percent/100;$('example-price-value').textContent=money(price);$('example-deposit-value').textContent=percent+'%';$('calc-result').innerHTML=`<p>${escape(tr('Your contribution'))}</p><strong>${money(cash)}</strong><div class="deposit-bar" aria-hidden="true"><span style="width:${percent}%"></span></div><div class="legend"><span>${escape(tr('Your part: {value}',{value:percent+'%'}))}</span><span>${escape(tr('Loan: {value}',{value:money(price-cash)}))}</span></div>`;}else{const loan=Number($('example-loan').value),rate=Number($('example-rate').value),years=Number($('example-years').value),payment=monthlyPayment(loan,rate,years);$('example-loan-value').textContent=money(loan);$('example-rate-value').textContent=rate+'%';$('example-years-value').textContent=tr('{count} years',{count:years});$('calc-result').innerHTML=`<p>${escape(tr('Monthly principal + interest'))}</p><strong>${money(payment)}</strong><p>${escape(tr('Total repaid: {value}',{value:money(payment*years*12)}))}<br>${escape(tr('Including interest: {value}',{value:money(payment*years*12-loan)}))}</p>`;}}
  $('drawer-content').querySelectorAll('input').forEach(i=>i.addEventListener('input',update));update();
}
document.addEventListener('change',event=>updateExample(event.target,language));
document.addEventListener('click',event=>updateRepayment(event.target,language));
window.addEventListener('hashchange',()=>render());
$('topics-button').addEventListener('click',()=>{if(currentView.kind==='home'){$('browse-topics').focus({preventScroll:true});$('browse-topics').scrollIntoView({block:'start',behavior:'instant'});}else {exploreOnRender=true;location.hash='#/';}});$('search-button').addEventListener('click',()=>openTopics(true));
$('close-drawer').addEventListener('click',closeDrawer);
$('drawer').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeDrawer();}});$('drawer').addEventListener('close',()=>{if(!$('drawer').open){document.body.style.overflow='';modalVersion++;}});
$('links-button').addEventListener('click',openLinks);$('about-button').addEventListener('click',openAbout);

// WebKit does not focus clicked buttons; native dialogs restore the focused opener.
document.addEventListener('click',e=>{
  const opener=e.target.closest('#search-button,#links-button,#about-button,[data-topic-faq],[data-calculator],[data-details],[data-search-query]');
  if(opener&&!$('drawer').open)opener.focus({preventScroll:true});
},true);
document.addEventListener('submit',e=>{
  if(e.target.id==='home-search-form'){
    e.preventDefault();
    openTopics(true,new FormData(e.target).get('question')||'');
  }
});
document.addEventListener('click',e=>{
  const suggested=e.target.closest('[data-search-query]');
  if(suggested)openTopics(true,suggested.dataset.searchQuery);
  if(e.target.closest('[data-jump-questions]')){e.preventDefault();$('questions').focus({preventScroll:true});$('questions').scrollIntoView({block:'start',behavior:'instant'});}
  const route=e.target.closest('[data-route]');if(route){closeDrawer();if(route.hash===location.hash){e.preventDefault();$('topic-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}}

  const detail=e.target.closest('[data-details]');if(detail){const entry=findCard(detail.dataset.details);if(entry){topic=entry.t;card=entry.c;openDetails();}}


  if(e.target.closest('[data-topic-faq]'))openTopicFAQs();if(e.target.closest('[data-about]'))openAbout();if(e.target.closest('[data-calculator]'))openCalculator();if(e.target.closest('[data-open-topics]')){closeDrawer();if(location.hash==='#/')render();else location.hash='#/';}if(e.target.closest('[data-open-links]'))openLinks();
});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();$('topic-title').focus();});
initializeLanguage();

function artSources(name,sizes){return `srcset="${[320,480,640,960].map(width=>`assets/home-truths/${name}-${width}w.webp ${width}w`).join(', ')}, ${artPath(name)} 1200w" sizes="${sizes}"`;}
function artPath(name){return `assets/home-truths/${name}.webp${name==='inspection'?'?roof=2':''}`;}
function referenceNotice(){return language==='en'?'':`<p class="reference-notice">${escape(tr('Official websites may open in English.'))}</p>`;}
function updateLanguageShell(){
  document.documentElement.lang=languages.find(l=>l.code===language).html;
  updateLanguagePicker();
  document.querySelector('.brand span').textContent=tr('A HOME BUYING GUIDE');
  document.querySelector('.skip').textContent=tr('Skip to the guide');
  document.querySelector('.site-header nav').setAttribute('aria-label',tr('Guide tools'));
  $('start-link').textContent=beginnerContent(language).startLabel;
  $('topics-button').innerHTML=`${escape(tr('Explore'))} ${icon('menu')}`;

  $('search-button').innerHTML=`${escape(tr('Search'))} ${icon('search')}`;
  $('search-button').setAttribute('aria-label',tr('Search topics and questions'));
  $('breadcrumbs').setAttribute('aria-label',tr('Breadcrumb'));
  $('close-drawer').setAttribute('aria-label',tr('Close panel'));
  $('footer-topics').innerHTML=`${icon('arrow-left')} ${escape(tr('All topics'))}`;
  $('links-button').innerHTML=actionLabel('Useful links ↗');
  $('about-button').textContent=tr('About this guide');
  $('language-notice').hidden=true;
  $('language-notice').textContent='';
}
async function changeLanguage(requested,initial=false){
  const next=normalizeLanguage(requested),request=++languageRequest;
  $('language-trigger').disabled=true;
  $('main').setAttribute('aria-busy','true');
  try{
    const data=next==='en'?null:(await localeLoaders[next]()).default;
    if(request!==languageRequest)return;
    ({topics,areas}=localizedContent(englishTopics,englishAreas,data));language=next;
    try{localStorage.setItem('home-truths-language',language);}catch{/* The selected language still works for this visit. */}
    const url=new URL(location.href);if(language==='en')url.searchParams.delete('lang');else url.searchParams.set('lang',language);
    history.replaceState(null,'',url);
    updateLanguageShell();await render(initial);
  }catch{
    if(request===languageRequest){updateLanguageShell();await render(initial);toast('Language could not load. English is still available.');}
  }finally{
    if(request===languageRequest){$('language-trigger').disabled=false;$('main').removeAttribute('aria-busy');if(!initial)$('language-trigger').focus({preventScroll:true});}
  }
}
function initializeLanguage(){
  let preferred;try{preferred=localStorage.getItem('home-truths-language');}catch{}
  initializeLanguagePicker();
  changeLanguage(new URL(location.href).searchParams.get('lang')||preferred||'en',true);
}
function updateLanguagePicker(){
  const selected=languages.find(l=>l.code===language);
  $('language-trigger').innerHTML=`<strong>${selected.short}</strong><span class="language-flag" aria-hidden="true">${selected.flag}</span><span class="language-chevron" aria-hidden="true"></span>`;
  $('language-trigger').setAttribute('aria-label',`${selected.short} — ${tr('Language')}: ${selected.label}`);
  $('language-menu').setAttribute('aria-label',tr('Language'));
  $('language-menu').innerHTML=languages.map(l=>`<button type="button" role="option" data-language="${l.code}" aria-selected="${l.code===language}" aria-label="${escape(l.short)} — ${escape(l.label)}" lang="${l.html}" tabindex="-1"><strong>${l.short}</strong><span class="language-flag" aria-hidden="true">${l.flag}</span></button>`).join('');
}
function closeLanguageMenu(focus=false){$('language-menu').hidden=true;$('language-trigger').setAttribute('aria-expanded','false');if(focus)$('language-trigger').focus();}
function openLanguageMenu(){
  $('language-menu').hidden=false;$('language-trigger').setAttribute('aria-expanded','true');
  $('language-menu').querySelector('[aria-selected="true"]')?.focus();
}
function initializeLanguagePicker(){
  $('language-trigger').addEventListener('click',()=>{$('language-menu').hidden?openLanguageMenu():closeLanguageMenu(true);});
  $('language-trigger').addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();openLanguageMenu();}});
  $('language-menu').addEventListener('click',event=>{const option=event.target.closest('[data-language]');if(option){closeLanguageMenu(true);changeLanguage(option.dataset.language);}});
  $('language-menu').addEventListener('keydown',event=>{
    const options=[...$('language-menu').querySelectorAll('[role="option"]')],index=options.indexOf(document.activeElement);
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[next].focus();}
    if(event.key==='Escape'){event.preventDefault();closeLanguageMenu(true);}
    if(event.key==='Tab')closeLanguageMenu();
  });
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.language-picker'))closeLanguageMenu();});
  document.querySelector('.language-picker').addEventListener('focusout',event=>{
    // During a native pointer focus change, activeElement can briefly be body.
    // The destination tells us whether focus actually left the picker.
    if(!event.currentTarget.contains(event.relatedTarget))closeLanguageMenu();
  });
}

function learningPoints(c){return `<section class="learning-points"><h3>${escape(tr('What to check'))}</h3><ul>${c.checks.map(item=>`<li><span aria-hidden="true"></span><p>${escape(item)}</p></li>`).join('')}</ul></section>`;}
async function openTopicFAQs(){
  const t=topic,v=showDrawer(tr('Questions & answers ↗').replace(' ↗',''),t.label);
  try{
    const {faqs}=await loadDetails();if(v!==modalVersion)return;
    const grouped=orderTopicFAQs(t,faqs);
    $('drawer-content').innerHTML=`${grouped.focused.map(faqHTML).join('')}${grouped.other.length?`<details class="more-reference"><summary>${escape(tr('More related questions ({count})',{count:grouped.other.length}))}</summary>${grouped.other.map(faqHTML).join('')}</details>`:''}`;
  }catch{failDrawer(v);}
}
