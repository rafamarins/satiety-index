import {exampleHTML,updateExample,updateRepayment} from '../../home-truths-examples.js';
import {topics} from '../../home-truths-content.js';
const translations=Object.fromEntries(await Promise.all(['pt-BR','es','zh-Hans'].map(async language=>[language,await (await fetch(`../../locales/${language}.json`)).json()])));
const panel=document.querySelector('#draft-example');
const tabs=[...document.querySelectorAll('[data-topic]')];
const copy={
 en:{tabs:['Deposit & loan','Monthly repayments','Records & inspection'],rate:'Example interest rate',small:'With a 10% contribution, you need to borrow NZ$630,000.',large:'With a 20% contribution, you need to borrow NZ$560,000.',lower:'At 6%: NZ$3,357 a month.',higher:'At 7%: NZ$3,726 a month — NZ$369 more.',recordsTitle:'What do records and an inspection tell you?',recordsIntro:'They answer different questions about the same home.',recordsLimit:'Records do not confirm the home’s current physical condition.',inspectionLimit:'An inspection does not confirm council approval.'},
 'pt-BR':{tabs:['Entrada e empréstimo','Prestações mensais','Documentos e inspeção'],rate:'Juros de exemplo',small:'Com uma entrada de 10%, o empréstimo seria de NZ$630.000.',large:'Com uma entrada de 20%, o empréstimo seria de NZ$560.000.',lower:'Com 6%: NZ$3.357 por mês.',higher:'Com 7%: NZ$3.726 por mês — NZ$369 a mais.',recordsTitle:'O que os documentos e a inspeção mostram?',recordsIntro:'Eles respondem a perguntas diferentes sobre o mesmo imóvel.',recordsLimit:'Os documentos não confirmam o estado físico atual do imóvel.',inspectionLimit:'A inspeção não confirma a aprovação do council.'},
 es:{tabs:['Entrada y préstamo','Cuotas mensuales','Registros e inspección'],rate:'Interés de ejemplo',small:'Con una entrada del 10%, el préstamo sería de NZ$630.000.',large:'Con una entrada del 20%, el préstamo sería de NZ$560.000.',lower:'Con 6%: NZ$3.357 al mes.',higher:'Con 7%: NZ$3.726 al mes — NZ$369 más.',recordsTitle:'¿Qué muestran los registros y la inspección?',recordsIntro:'Responden a preguntas distintas sobre la misma vivienda.',recordsLimit:'Los registros no confirman el estado físico actual de la vivienda.',inspectionLimit:'La inspección no confirma la aprobación municipal.'},
 'zh-Hans':{tabs:['首付和贷款','每月还款','档案与验房'],rate:'示例利率',small:'出资 10%，需要借款 630,000 新西兰元。',large:'出资 20%，需要借款 560,000 新西兰元。',lower:'利率为 6%：每月 3,357 新西兰元。',higher:'利率为 7%：每月 3,726 新西兰元，多付 369 元。',recordsTitle:'档案和验房分别能告诉你什么？',recordsIntro:'它们回答关于同一栋房屋的不同问题。',recordsLimit:'档案不能确认房屋目前的实际状况。',inspectionLimit:'验房不能确认议会批准情况。'}
};
let selected='deposit',language='en';
function announce(text){panel.querySelector('.example-status').textContent=text;}
function render(){
 const c=copy[language];panel.innerHTML=exampleHTML(selected,language);
 panel.querySelectorAll('.record-collage img').forEach(img=>img.setAttribute('src','../../'+img.getAttribute('src')));
 const details=panel.querySelector('details'),summary=details.querySelector('summary');
 // The review surface shows each complete example; no redundant disclosure control.
 const article=document.createElement('section');article.className=details.className;article.dataset.workedExample=selected;
 const heading=document.createElement('h3');heading.className='example-heading';heading.textContent=summary.querySelector('span').lastChild.textContent;
 article.append(heading,details.querySelector('.example-body'));details.replaceWith(article);
 const original=topics.find(topic=>topic.id===selected),translated=translations[language]?.topics?.[selected];
 document.querySelector('#context-caption').textContent=translated?.label||original.label;
 document.querySelector('#context-detail').textContent=translated?.intro||original.intro;
 document.querySelector('.context-description').lang=language;
 document.querySelector('#context-collage').src=`../../assets/home-truths/${original.image}.webp`;
 panel.lang=language==='en'?'en-NZ':language;panel.setAttribute('aria-labelledby',`tab-${selected}`);
 tabs.forEach((tab,i)=>{const active=tab.dataset.topic===selected;tab.setAttribute('aria-selected',active);tab.tabIndex=active?0:-1;tab.textContent=c.tabs[i];});
 const body=panel.querySelector('.example-body');
 if(selected==='deposit'){
  const status=document.createElement('p');status.className='example-status';status.setAttribute('role','status');body.querySelector('.example-values').after(status);

 }
}
tabs.forEach(tab=>tab.addEventListener('click',()=>{selected=tab.dataset.topic;render();}));
document.querySelector('.draft-tabs').addEventListener('keydown',event=>{
 const index=tabs.indexOf(document.activeElement);if(index<0||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 selected=tabs[next].dataset.topic;render();tabs[next].focus();
});
document.querySelector('#draft-language').addEventListener('change',event=>{language=event.target.value;render();});
panel.addEventListener('change',event=>{if(updateExample(event.target,language))announce(copy[language][Number(event.target.value)===10?'small':'large']);});
panel.addEventListener('click',event=>updateRepayment(event.target,language));
render();
