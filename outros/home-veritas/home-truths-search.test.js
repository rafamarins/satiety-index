import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as guide from './guide-content.js';
import * as links from './resources.js';
import {localizedReference} from './home-truths-reference.js';
import {searchScore,faqSearchScore} from './home-truths-search.js';

const results=(query,faqs=guide.faqs)=>faqs
  .map(faq=>({faq,score:faqSearchScore(query,faq)}))
  .filter(({score})=>score>0)
  .sort((a,b)=>b.score-a.score)
  .map(({faq})=>faq.searchQuestion||faq.question);

test('Everyday deposit and affordability questions rank their existing answers first',()=>{
  for(const query of ['How much deposit do I need?','Please tell me about the minimum deposit','How much deposit would we need?']){
    assert.equal(results(query)[0],'Do I need a 20% deposit?',query);
  }
  assert.equal(results('How much can I borrow?')[0],'What does a bank want to see?');
  assert.deepEqual(new Set(results('How much can I borrow?').slice(0,3)),new Set([
    'What does a bank want to see?',
    'How do I know if the repayments will be comfortable?',
    'What does pre-approval actually approve?',
  ]));
  assert.equal(results('What can I afford?')[0],'How do I know if the repayments will be comfortable?');
  assert.equal(results('What is a LIM?')[0],'Do I need a LIM as well as a building inspection?');
});

test('Meaningful constraints stay required and filler alone does not produce random answers',()=>{
  assert.equal(searchScore('LIM','Set your borrowing limit'),0);
  assert.equal(searchScore('deposit scam','The deposit funds part of the price'),0);
  assert.equal(results('How do I avoid a deposit scammer?')[0],'How do I avoid sending my deposit to a scammer?');
  assert.equal(results('lunar deposit').length,0);
  assert.equal(results('How much do I need?').length,0);
  assert.equal(searchScore('','Any topic'),1);
  assert(searchScore('How much can I borrow?','Borrowing approval')>0);
});

test('Natural deposit questions work with translated answers and English identity',async()=>{
  for(const [language,query] of [
    ['pt-BR','Quanto preciso de entrada?'],
    ['es','¿Cuánto depósito necesito?'],
    ['zh-Hans','我需要多少首付？'],
  ]){
    const translation=JSON.parse(await readFile(new URL(`./locales/deep-${language}.json`,import.meta.url),'utf8'));
    const localized=localizedReference(guide,links,translation);
    assert.equal(results(query,localized.faqs)[0],'Do I need a 20% deposit?',language);
    assert.equal(results('How much can I borrow?',localized.faqs)[0],'What does a bank want to see?',language);
  }
});

import {beginnerContent} from './home-truths-beginner.js';
test('Every displayed search suggestion finds the intended answer in its language',async()=>{
  const expected=[
    'Do I need a 20% deposit?',
    'What does a bank want to see?',
    'Do I need a LIM as well as a building inspection?',
  ];
  for(const language of ['en','pt-BR','es','zh-Hans']){
    const translation=language==='en'?null:JSON.parse(await readFile(new URL(`./locales/deep-${language}.json`,import.meta.url),'utf8'));
    const localized=localizedReference(guide,links,translation);
    for(const [index,query] of beginnerContent(language).shared.searchExamples.entries()){
      assert.equal(results(query,localized.faqs)[0],expected[index],`${language}: ${query}`);
    }
  }
  assert.equal(results('Quanto posso pegar emprestado?')[0],expected[1]);
  assert.equal(results('Where do I start?')[0],'Where do I start, and what order do I do things in?');
});
