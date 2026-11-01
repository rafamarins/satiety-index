import {test} from 'node:test';
import assert from 'node:assert/strict';
import {depositExample,repaymentExample,exampleHTML,updateExample} from './home-truths-examples.js';

test('contribution choices preserve the price while changing the borrowing needed',()=>{
  assert.deepEqual(depositExample(),{price:700000,percent:20,contribution:140000,loan:560000});
  assert.deepEqual(depositExample(10),{price:700000,percent:10,contribution:70000,loan:630000});
  for(const percent of [0,10,20,100]){
    const result=depositExample(percent);assert.equal(result.contribution+result.loan,result.price);
  }
  for(const value of [-1,101,NaN,Infinity])assert.throws(()=>depositExample(value),RangeError);
});
test('rate comparison displays rounded monthly payments with a matching difference',()=>{
  assert.deepEqual(repaymentExample(),{lower:3357,higher:3726,difference:369});
});
test('examples are available only for their relevant topics in every supported language',()=>{
  for(const language of ['en','pt-BR','es','zh-Hans']){
    for(const topic of ['deposit','mortgage','records']){
      const html=exampleHTML(topic,language);
      assert.match(html,new RegExp(`data-worked-example="${topic}"`));
      assert(!html.includes('undefined'));assert.match(html,/<summary>/);assert.match(html,topic==='records'?/check-limit/:/example-note/);
    }
    assert.equal(exampleHTML('viewing',language),'');
  }
  assert.equal(exampleHTML('deposit','unsupported'),exampleHTML('deposit','en'));
});
test('deposit input updates amounts and the existing proportional bar without replacing the control',()=>{
  const nodes={'.example-share-bar':{style:{}},'[data-example-contribution]':{},'[data-example-loan]':{}};
  const root={querySelector:selector=>nodes[selector]};
  const target={matches:()=>true,closest:()=>root,value:'10'};
  assert.equal(updateExample(target),true);
  assert.equal(nodes['.example-share-bar'].style.width,'10%');
  assert.match(nodes['[data-example-contribution]'].textContent,/70,000/);
  assert.match(nodes['[data-example-loan]'].textContent,/630,000/);
  target.value='20';updateExample(target);
  assert.equal(nodes['.example-share-bar'].style.width,'20%');
  assert.match(nodes['[data-example-contribution]'].textContent,/140,000/);
  assert.equal(updateExample({}),false);target.value='NaN';assert.equal(updateExample(target),false);
});
