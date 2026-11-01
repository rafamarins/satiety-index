import test from 'node:test';
import assert from 'node:assert/strict';
import {beginnerContent} from './home-truths-beginner.js';
import {topics} from './home-truths-content.js';
import {resolveRoute} from './home-truths-navigation.js';

test('The beginner route is directly addressable without changing existing links',()=>{
  assert.equal(resolveRoute('#/start').kind,'start');
  assert.equal(resolveRoute('#/start/unknown').canonical,'#/start');
  assert.equal(resolveRoute('#/deposit/kiwisaver').card.id,'kiwisaver');
});
test('Every supported language has a complete journey and a working next step for every topic',()=>{
  const english=beginnerContent('en');
  for(const code of ['en','pt-BR','es','zh-Hans']){
    const content=beginnerContent(code);
    assert.equal(content.steps.length,6);
    assert.deepEqual(Object.keys(content.nextSteps).sort(),topics.map(t=>t.id).sort());
    assert.deepEqual(Object.keys(content.shared).sort(),Object.keys(english.shared).sort());
    for(const step of [...content.steps,...Object.values(content.nextSteps)]){
      assert(step.body && step.action);
      assert.equal(resolveRoute(`#/${step.topicId}`).topic.id,step.topicId);
    }
    for(const value of Object.values(content.shared))assert(Array.isArray(value)?value.every(s=>s.trim()):value.trim());
    if(code!=='en')assert.notEqual(content.title,english.title);
  }
  assert.deepEqual(beginnerContent('unknown'),english);
});

import {featuredQuestions} from './home-truths-featured.js';
import {faqs,chapters} from './guide-content.js';
import {resources} from './resources.js';
import {localizedReference} from './home-truths-reference.js';
import {readFile} from 'node:fs/promises';
test('Every topic opens three relevant sourced questions in every language',async()=>{
  for(const code of ['en','pt-BR','es','zh-Hans']){
    const translation=code==='en'?null:JSON.parse(await readFile(`locales/deep-${code}.json`,'utf8'));
    const reference=localizedReference({chapters,faqs},{resources},translation);
    for(const topic of topics){
      const selected=featuredQuestions(topic,reference.faqs);
      assert.equal(selected.length,3,`${code}/${topic.id}`);
      assert.equal(new Set(selected.map(f=>f.question)).size,3);
      assert(selected.every(f=>f.answer&&f.url.startsWith('https://')));
    }
    const first=id=>featuredQuestions(topics.find(t=>t.id===id),reference.faqs)[0];
    assert.equal(first('viewing').searchQuestion||first('viewing').question,'What should I notice during an open home?');
    assert.equal(first('living').searchQuestion||first('living').question,'Which costs keep coming after I move in?');
  }
});
