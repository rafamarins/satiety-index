import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyPayment } from './finance.js';
test('principal-and-interest example and interest-free case', () => {
  assert.ok(Math.abs(monthlyPayment(560000, 6, 30) - 3357.48) < 0.01);
  assert.equal(monthlyPayment(120000, 0, 10), 1000);
  assert.equal(monthlyPayment(0, 6, 30), 0);
});
test('higher interest costs more; shorter term raises payments but lowers total interest', () => {
  assert.ok(monthlyPayment(560000, 8, 30) > monthlyPayment(560000, 6, 30));
  const short = monthlyPayment(560000, 6, 20), long = monthlyPayment(560000, 6, 30);
  assert.ok(short > long); assert.ok(short * 240 < long * 360);
});
test('invalid values cannot become plausible quotes', () => {
  for (const values of [[-1,6,30],[1,-1,30],[1,6,0],[NaN,6,30],[1,Infinity,30]]) assert.throws(() => monthlyPayment(...values), RangeError);
});
