import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {stages,topics} from './home-truths-content.js';
import {chapters} from './guide-content.js';
import {areas,resolveRoute,areaForTopic} from './home-truths-navigation.js';
test('Interest areas cover every topic once and preserve existing card links',()=>{
  const ids=areas.flatMap(a=>a.topics);
  assert.equal(ids.length,topics.length);
  assert.equal(new Set(ids).size,topics.length);
  for(const t of topics){assert(areaForTopic(t.id));assert.equal(resolveRoute(`#/${t.id}`).topic,t);for(const c of t.cards)assert.equal(resolveRoute(`#/${t.id}/${c.id}`).card,c);}
  for(const a of areas)assert.equal(resolveRoute(`#/explore/${a.id}`).area,a);
  for(const hash of ['', '#/', '#/unknown', '#/explore/unknown', '#/%E0%A4%A'])assert.equal(resolveRoute(hash).kind,'home');
  assert.equal(resolveRoute('#/homes/unknown').canonical,'#/homes');
});
test('Every stage is reachable, topic routes are unique, and all deep chapters are connected',()=>{
  assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
  for(const s of stages)assert(topics.some(t=>t.stage===s.id),s.id);
  for(const ch of chapters)assert(topics.some(t=>t.chapterIds.includes(ch.id)),ch.id);
  for(const t of topics){assert(stages.some(s=>s.id===t.stage));assert(t.cards.length>0);assert.equal(new Set(t.cards.map(c=>c.id)).size,t.cards.length);for(const c of t.cards){assert(c.title&&c.body&&c.gotcha);assert(c.checks.length>0);}for(const id of t.chapterIds)assert(chapters.some(ch=>ch.id===id),id);}
});
test('Each topic has a local visual and HTTPS sources',async()=>{
  for(const t of topics){await access(`assets/home-truths/${t.image}.webp`);assert(t.sourceLinks.length>=2);for(const link of t.sourceLinks){assert.equal(new URL(link.url).protocol,'https:');assert(link.label);}}
});

// Locale files must cover the complete short guide without changing route or card identifiers.
import {readFile} from 'node:fs/promises';
import {localizedContent,normalizeLanguage,translate} from './home-truths-i18n.js';
import {searchScore,faqSearchText,orderTopicFAQs} from './home-truths-search.js';
import {faqs} from './guide-content.js';
test('Every locale preserves complete topic/check coverage and stable IDs',async()=>{
  for(const code of ['pt-BR','es','zh-Hans']){
    const data=JSON.parse(await readFile(`locales/${code}.json`,'utf8'));
    assert.deepEqual(Object.keys(data.topics).sort(),topics.map(t=>t.id).sort());
    assert.deepEqual(Object.keys(data.areas).sort(),areas.map(a=>a.id).sort());
    for(const t of topics){
      const local=data.topics[t.id];
      for(const key of ['label','headline','intro','bridge'])assert.equal(typeof local[key],'string',`${code}/${t.id}/${key}`);
      assert.deepEqual(Object.keys(local.cards).sort(),t.cards.map(c=>c.id).sort());
      for(const c of t.cards){const translated=local.cards[c.id];for(const key of ['label','title','body','gotcha'])assert(translated[key]?.trim(),`${code}/${t.id}/${c.id}/${key}`);assert.equal(translated.checks.length,c.checks.length);assert(translated.checks.every(s=>typeof s==='string'&&s.trim()));}
    }
    const result=localizedContent(topics,areas,data);
    assert.deepEqual(result.topics.flatMap(t=>t.cards.map(c=>`${t.id}/${c.id}`)),topics.flatMap(t=>t.cards.map(c=>`${t.id}/${c.id}`)));
    assert.deepEqual(result.topics[0].sourceLinks.map(l=>l.url),topics[0].sourceLinks.map(l=>l.url));
    assert.notEqual(translate(code,'Questions & sources ↗'),'Questions & sources ↗');
    assert(!translate(code,'Loan: {value}',{value:'NZ$123'}).includes('{'));
  }
  assert.equal(normalizeLanguage('unsupported'),'en');
  assert.equal(resolveRoute('#/saved/print').kind,'home');
  assert.equal(resolveRoute('#/saved').canonical,'#/');
});
test('Search finds renovation variants and multilingual terms without LIM substring noise',()=>{
  const paperwork=faqs.find(f=>f.question.includes('home has been renovated'));
  for(const q of ['renovation','renovated','reforma','renovación','装修','roof approval'])assert(searchScore(q,faqSearchText(paperwork))>0,q);
  assert.equal(searchScore('LIM','Set your borrowing limit.'),0);
  assert(searchScore('LIM','Do I need a LIM report?')>0);
  assert(searchScore('leilão','Buying at auction')>0);
  const deposits=faqs.find(f=>f.question.includes('bank deposit and sales deposit'));
  assert(searchScore('two deposits',faqSearchText(deposits))>0);
  const included=faqs.find(f=>f.question.startsWith('What stays with the house'));
  for(const q of ['curtains','appliances','cortinas','窗帘'])assert(searchScore(q,faqSearchText(included))>0,q);
  const delayed=faqs.find(f=>f.question.startsWith('What if settlement is delayed'));
  assert(searchScore('settlement delay',faqSearchText(delayed))>0);
  const grouped=orderTopicFAQs(topics.find(t=>t.id==='records'),faqs);
  assert(grouped.focused.some(f=>f.question.includes('LIM')));
  assert(grouped.other.length>0);
  assert.equal(grouped.focused.length+grouped.other.length,faqs.filter(f=>topics.find(t=>t.id==='records').chapterIds.includes(f.chapter)).length);
});

import {resources} from './resources.js';
import {localizedReference} from './home-truths-reference.js';
test('Deep translations cover every answer and source without changing evidence URLs',async()=>{
  const labels=[...new Set(topics.flatMap(t=>t.sourceLinks.map(l=>l.label)))].sort();
  for(const code of ['pt-BR','es','zh-Hans']){
    const data=JSON.parse(await readFile(`locales/deep-${code}.json`,'utf8'));
    assert.deepEqual(data.chapters.map(c=>c.id),chapters.map(c=>c.id));
    assert.deepEqual(Object.keys(data.sourceLabels).sort(),labels);
    const core=JSON.parse(await readFile(`locales/${code}.json`,'utf8'));
    assert.deepEqual(core.sourceLabels,data.sourceLabels);
    for(const [i,c] of chapters.entries()){
      const translated=data.chapters[i];
      assert.equal(translated.checklist.length,c.checklist.length);
      for(const value of [...translated.checklist,translated.mistake,translated.shortcut])assert(value.trim());
      assert.equal(translated.details.length,c.details.length);
      for(const [j,f] of c.details.entries()){
        const tf=translated.details[j];
        assert.equal(tf.url,f.url);
        for(const field of ['question','answer','source'])assert(tf[field]?.trim());
        assert.notEqual(tf.question,f.question);assert.notEqual(tf.answer,f.answer);
      }
    }
    assert.equal(data.resources.length,resources.length);
    for(const [i,r] of resources.entries()){
      const translated=data.resources[i];assert.equal(translated.url,r.url);
      for(const key of ['category','title','description'])assert(translated[key]?.trim());
    }
    const result=localizedReference({chapters},{resources},data);
    assert.equal(result.faqs.length,faqs.length);
    assert.deepEqual(result.faqs.map(f=>f.url),faqs.map(f=>f.url));
    assert.equal(result.faqs[0].searchQuestion,faqs[0].question);
    const grouped=orderTopicFAQs(topics.find(t=>t.id==='records'),result.faqs);
    assert(grouped.focused.some(f=>f.searchQuestion.includes('LIM')));
    const renovated=result.faqs.find(f=>f.searchQuestion.includes('home has been renovated'));
    assert(searchScore('renovation',faqSearchText(renovated))>0);
  }
});

import {answerBlocks} from './home-truths-answer-layout.js';
import {answerVisual,cardVisual} from './home-truths-answer-visuals.js';
test('Visual answers retain every source sentence and stable answer identity across languages',async()=>{
  const base=localizedReference({chapters},{resources},null);
  assert.equal(new Set(base.faqs.map(f=>f.key)).size,faqs.length);
  for(const language of ['en','pt-BR','es','zh-Hans']){
    const data=language==='en'?null:JSON.parse(await readFile(`locales/deep-${language}.json`,'utf8'));
    const guide=localizedReference({chapters},{resources},data);
    assert.deepEqual(guide.faqs.map(f=>f.key),base.faqs.map(f=>f.key));
    let count=0;
    for(const faq of guide.faqs){
      // Only whitespace can change when a paragraph becomes short reading blocks.
      assert.equal(answerBlocks(faq.answer,language).join('').replace(/\s/g,''),faq.answer.replace(/\s/g,''));
      const visual=answerVisual(faq,language);
      if(!visual)continue;
      count++;assert(visual.title);assert(['compare','sequence'].includes(visual.kind));
      assert(visual.items.length>=2&&visual.items.length<=4);
      for(const item of visual.items){assert(item.title&&item.body&&item.image);await access(`assets/home-truths/${item.image}.webp`);}
      if(language!=='en')assert.notEqual(visual.title,answerVisual(faq,'en').title);
    }
    assert.equal(count,11);
    assert(cardVisual('decide/compare',language));
    assert(cardVisual('budget/ongoing',language));
    const life=cardVisual('decide/life',language);
    assert.equal(life.kind,'compare');assert.equal(life.items.length,3);
    for(const item of life.items)await access(`assets/home-truths/${item.image}.webp`);
    const scenes=[...guide.faqs.map(f=>answerVisual(f,language)).filter(Boolean),life];
    const used=new Set();
    for(const scene of scenes){
      const panels=new Set();
      for(const item of scene.items){
        assert(item.panel>=0&&item.panel<item.columns*item.rows);
        const key=`${item.image}:${item.panel}`;
        assert(!panels.has(key),'Each panel illustrates a distinct part of the answer');panels.add(key);
      }
      for(const image of new Set(scene.items.map(item=>item.image))){
        assert(!used.has(image),'Unrelated answers must not reuse the same generic scene');used.add(image);
      }
    }
  }
  assert.equal(answerVisual({question:'Unknown question'}),null);
});


test('Novice preapproval spellings find the same finance answer without matching council consents',()=>{
  const f=faqs.find(f=>f.question==='What does pre-approval actually approve?');
  assert(f);
  for(const query of ['preapproval','pre-approval','pre approval','pre‑approval','preapproved','pré-aprovação','preaprobación','预批'])assert(searchScore(query,faqSearchText(f))>0,query);
  assert.equal(searchScore('preapproval','Building consent and council approval'),0);
});


test('Everyday fridge searches find the included-items answer in every language',()=>{
  const f=faqs.find(f=>f.question.startsWith('What stays with the house'));
  for(const query of ['curtains fridge','refrigerator','cortinas geladeira','cortinas nevera','冰箱'])assert(searchScore(query,faqSearchText(f))>0,query);
});

import {journeySearchCases} from './qa/multilingual-journey-cases.js';
test('Natural questions find the relevant deeper answer in Portuguese, Spanish and unspaced Chinese',async()=>{
  for(const [language,cases] of Object.entries(journeySearchCases)){
    const translation=JSON.parse(await readFile(`locales/deep-${language}.json`,'utf8'));
    const guide=localizedReference({chapters},{resources},translation);
    for(const [query,question] of cases){
      const answer=guide.faqs.find(f=>f.searchQuestion===question);
      assert(answer,question);assert(searchScore(query,faqSearchText(answer))>0,`${language}: ${query}`);
    }
  }
  assert.equal(searchScore('preapproval','Building consent and council approval'),0);
  assert.equal(searchScore('LIM','A simple plumbing system'),0);
});

test('Localized explanations distinguish payment terms from fixed amounts and explain NZ terms',async()=>{
 const zh=await readFile('locales/deep-zh-Hans.json','utf8');
 assert(zh.includes('固定金额'));assert(zh.includes('约定金额'));assert(!/固预付款|约预付款/.test(zh));
 for(const code of ['pt-BR','es']){
  const text=await readFile(`locales/deep-${code}.json`,'utf8');
  assert(!/ao entidade|do entidade|del entidad|[Ee]l subvención/.test(text));
  assert(text.includes(code==='pt-BR'?'entidade dos proprietários (body corporate)':'entidad de propietarios (body corporate)'));
 }
});

import {agentsSalesSearchCases} from './qa/agents-sales-cases.js';
test('Agents and sale processes are discoverable with their protections in every language',async()=>{
 assert(areas.find(a=>a.id==='find').topics.includes('agents'));
 assert(areas.find(a=>a.id==='buy').topics.includes('sales'));
 const agent=faqs.find(f=>f.question==='Who does the real estate agent work for?');
 assert.match(agent.answer,/hire and pay.*written agreement/);
 const auction=faqs.find(f=>f.question.startsWith('What if an auction passes'));
 assert.match(auction.answer,/rules may continue/);
 const privateSale=faqs.find(f=>f.question==='How do I buy directly from a private owner?');
 assert.match(privateSale.answer,/trust.account/);assert.match(privateSale.answer,/private unlicensed seller/);
 const mortgagee=faqs.find(f=>f.question==='What extra risks come with a mortgagee sale?');
 assert.match(mortgagee.answer,/repays the mortgage before settlement/);
 for(const [code,cases] of Object.entries(agentsSalesSearchCases)){
  const translation=code==='en'?null:JSON.parse(await readFile(`locales/deep-${code}.json`,'utf8'));
  const guide=localizedReference({chapters},{resources},translation);
  for(const [query,question] of cases){const target=guide.faqs.find(f=>f.searchQuestion===question);assert(target,question);assert(searchScore(query,faqSearchText(target))>0,`${code}: ${query}`);}
  assert(cardVisual('agents/roles',code));assert(cardVisual('sales/process',code));
 }
});
