import assert from "node:assert/strict";
import { test } from "node:test";
import { bindFoodNavigation } from "../food-navigation.js";

function setup() {
  const root = new EventTarget();
  root.defaultView = { innerHeight: 900 };
  const surface = new EventTarget();
  surface.getBoundingClientRect = () => ({ width: 360 });
  surface.setPointerCapture = () => {};
  surface.closest = () => null;
  let bounds = { top: 100, bottom: 700 };
  const steps = [];
  const cleanup = bindFoodNavigation({
    root,
    surface,
    explorer: { getBoundingClientRect: () => bounds },
    step: (direction) => steps.push(direction),
  });
  const send = (target, type, properties) => {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, properties);
    target.dispatchEvent(event);
    return event;
  };
  const key = (key, extra = {}) => send(root, "keydown", { key, ...extra });
  const pointer = (type, x, y = 100, extra = {}) => {
    const event = new Event(type);
    Object.assign(event, {
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
      clientX: x,
      clientY: y,
      ...extra,
    });
    Object.defineProperty(event, "timeStamp", {
      value: type === "pointerdown" ? 0 : 200,
    });
    surface.dispatchEvent(event);
  };
  return {
    root,
    surface,
    steps,
    cleanup,
    key,
    pointer,
    bounds: (value) => {
      bounds = value;
    },
  };
}

test("arrows navigate the visible explorer and prevent native horizontal scrolling", () => {
  const ui = setup();
  assert.equal(ui.key("ArrowRight").defaultPrevented, true);
  ui.key("ArrowLeft");
  assert.deepEqual(ui.steps, [1, -1]);
});

test("other keys and modified arrows keep their browser behaviour", () => {
  const ui = setup();
  for (const extra of [
    { altKey: true },
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { isComposing: true },
  ]) {
    assert.equal(ui.key("ArrowRight", extra).defaultPrevented, false);
  }
  ui.key("ArrowDown");
  assert.deepEqual(ui.steps, []);
});

test("native controls and editable content retain arrow keys", () => {
  const ui = setup();
  ui.root.closest = () => ({});
  assert.equal(ui.key("ArrowRight").defaultPrevented, false);
  assert.deepEqual(ui.steps, []);
});

test("shortcuts do not change hidden/offscreen food", () => {
  const ui = setup();
  ui.bounds({ top: 901, bottom: 1500 });
  ui.key("ArrowRight");
  ui.bounds({ top: -1000, bottom: 0 });
  ui.key("ArrowLeft");
  assert.deepEqual(ui.steps, []);
});

test("left swipe selects next; right swipe selects previous", () => {
  const ui = setup();
  ui.pointer("pointerdown", 250);
  ui.pointer("pointerup", 100);
  ui.pointer("pointerdown", 100);
  ui.pointer("pointerup", 250);
  assert.deepEqual(ui.steps, [1, -1]);
});

test("vertical, diagonal, tiny, and mouse drags do not navigate", () => {
  const ui = setup();
  for (const [dx, dy] of [
    [0, 180],
    [80, 100],
    [10, 0],
  ]) {
    ui.pointer("pointerdown", 100, 100);
    ui.pointer("pointerup", 100 + dx, 100 + dy);
  }
  ui.pointer("pointerdown", 250, 100, { pointerType: "mouse" });
  ui.pointer("pointerup", 100, 100, { pointerType: "mouse" });
  assert.deepEqual(ui.steps, []);
});

test("cancelled, multi-touch, and capture-lost gestures do not navigate", () => {
  const ui = setup();
  for (const type of ["pointercancel", "lostpointercapture"]) {
    ui.pointer("pointerdown", 250);
    ui.surface.dispatchEvent(new Event(type));
    ui.pointer("pointerup", 100);
  }
  ui.pointer("pointerdown", 250);
  ui.pointer("pointerdown", 260, 100, { pointerId: 2, isPrimary: false });
  ui.pointer("pointerup", 100);
  assert.deepEqual(ui.steps, []);
});

test("buttons and other interactive touch targets keep their own gestures", () => {
  const ui = setup();
  ui.surface.closest = () => ({});
  ui.pointer("pointerdown", 250);
  ui.pointer("pointerup", 100);
  assert.deepEqual(ui.steps, []);
});

test("a gesture navigates once, and cleanup detaches all listeners", () => {
  const ui = setup();
  ui.pointer("pointerdown", 250);
  ui.pointer("pointerup", 100);
  ui.pointer("pointerup", 80);
  ui.cleanup();
  ui.key("ArrowRight");
  ui.pointer("pointerdown", 250);
  ui.pointer("pointerup", 100);
  assert.deepEqual(ui.steps, [1]);
});
