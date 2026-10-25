import assert from "node:assert/strict";
import { test } from "node:test";
import { FOODS } from "../foods.js";
import { STUDY_NUTRITION } from "../study-nutrition.js";
import { STUDY_PREPARATION } from "../study-preparation.js";

test("all 38 study foods have complete, finite portion data and preparation context", () => {
  const ids = FOODS.map(({ id }) => id).sort();
  assert.equal(ids.length, 38);
  assert.deepEqual(Object.keys(STUDY_NUTRITION).sort(), ids);
  assert.deepEqual(Object.keys(STUDY_PREPARATION).sort(), ids);
  for (const id of ids) {
    const row = STUDY_NUTRITION[id];
    assert.ok(Number.isInteger(row.servingGrams) && row.servingGrams > 0, id);
    for (const field of ["fatGrams", "proteinGrams", "sugarsGrams", "starchGrams", "fibreGrams", "waterGrams"]) {
      assert.ok(Number.isFinite(row[field]) && row[field] >= 0 && row[field] <= row.servingGrams, `${id}: ${field}`);
    }
    assert.equal(typeof row.sourceCalculated, "boolean");
    assert.ok(STUDY_PREPARATION[id].length > 0);
  }
});

test("Table 2 reference portions preserve cooked weights and separate carbohydrate components", () => {
  // Reference rows independently read from the printed table, p. 678.
  for (const [id, expected] of [
    ["potato", [368, 1, 10, 3.1, 45.9, 9.2, 290.8]],
    ["brown-pasta", [218, 1.6, 11.3, 0.7, 47.8, 10.9, 132.6]],
    ["croissant", [61, 14.4, 6.1, 3.1, 18.6, 1.8, 13.5]],
    ["oranges", [625, 0.6, 6.9, 50.6, 0, 12.5, 539.4]],
    ["cornflakes", [170, 2.1, 8.4, 10.2, 36.1, 1.5, 110.9]],
    ["porridge", [383, 6.2, 10.9, 7.5, 29, 4.7, 333.7]],
  ]) {
    assert.deepEqual(["servingGrams", "fatGrams", "proteinGrams", "sugarsGrams", "starchGrams", "fibreGrams", "waterGrams"].map((field) => STUDY_NUTRITION[id][field]), expected, id);
  }
  const cereals = FOODS.filter(({ category }) => category === "Breakfast cereals");
  assert.equal(cereals.length, 7);
  for (const { id } of cereals) assert.match(STUDY_PREPARATION[id], /Includes 125 ml.*milk/);
  assert.equal(FOODS.find(({ id }) => id === "porridge").score, 209);
});
