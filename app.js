import { FOODS, RANKED_FOODS } from "./foods.js";
import { loadEngraving } from "./engravings.js";
import { bindFoodNavigation } from "./food-navigation.js";

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const byId = (id) => document.getElementById(id);
const ui = Object.fromEntries(
  [
    "scene",
    "food-select",
    "food-name",
    "food-category",
    "food-description",
    "food-copy",
    "score-value",
    "plate-number",
    "plate-caption",
    "meter-fill",
    "meter-dot",
    "score-meter",
    "food-ratio",
    "ratio-description",
    "selection-announcement",
    "theme-toggle",
    "food-ranking",
    "category-filters",
    "filter-status",
  ].map((id) => [id, byId(id)]),
);
let food =
  FOODS.find((item) => item.id === location.hash.slice(1)) ||
  FOODS.find((item) => item.id === "potato");
let activeCategory = "All foods";
let keyboardInteraction = false;
let illustrationRequest = 0;
let scoreFrame = 0;

document.addEventListener("keydown", () => {
  keyboardInteraction = true;
});
document.addEventListener(
  "pointerdown",
  () => {
    keyboardInteraction = false;
  },
  { passive: true },
);

function canAnimate() {
  return !motionPreference.matches && !keyboardInteraction;
}

function animateScore(target, animate) {
  const number = ui["score-value"];
  const start = Number(number.textContent) || 0;
  cancelAnimationFrame(scoreFrame);
  const paint = (value) => {
    number.textContent = Math.round(value);
    ui["meter-fill"].style.transform = `scaleX(${value / 350})`;
    ui["meter-dot"].style.left = `${(value / 350) * 100}%`;
  };
  if (!animate) return paint(target);
  const began = performance.now();
  const tick = (now) => {
    const progress = Math.min(1, (now - began) / 650);
    paint(start + (target - start) * (1 - (1 - progress) ** 3));
    if (progress < 1) scoreFrame = requestAnimationFrame(tick);
  };
  scoreFrame = requestAnimationFrame(tick);
}

async function showIllustration(selectedFood, animate) {
  const scene = ui.scene;
  const request = ++illustrationRequest;
  scene.setAttribute("aria-busy", "true");
  let next;
  try {
    next = await loadEngraving(selectedFood);
  } catch {
    if (request !== illustrationRequest) return;
    scene.innerHTML =
      '<p class="illustration-error" role="alert">The illustration could not load.<br />Refresh the page to try again.</p>';
    scene.setAttribute("aria-busy", "false");
    return;
  }
  if (request !== illustrationRequest) return;
  scene.setAttribute("aria-busy", "false");
  scene
    .getAnimations({ subtree: true })
    .forEach((animation) => animation.cancel());
  scene.replaceChildren(next);
  if (animate && !motionPreference.matches && !keyboardInteraction) {
    next.animate(
      [
        { opacity: 0.45, transform: "translateY(6px) scale(0.99)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 220, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  }
}

function updateCopy(animate, initial = false) {
  ui["food-name"].textContent = food.name;
  ui["food-category"].textContent = food.category;
  ui["food-description"].textContent = food.description;
  ui["plate-caption"].textContent = food.caption;
  ui["plate-number"].textContent = String(
    RANKED_FOODS.indexOf(food) + 1,
  ).padStart(2, "0");
  ui["food-select"].value = food.id;
  ui["score-meter"].setAttribute(
    "aria-label",
    `${food.name}. Satiety score: ${food.score} percent. White bread: 100 percent.`,
  );
  ui["food-ratio"].textContent = `${(food.score / 100).toFixed(2)}×`;
  ui["ratio-description"].textContent =
    food.id === "white-bread"
      ? "the reference score used to compare every food in the study."
      : "the measured fullness response to white bread, for the same calories.";
  ui["selection-announcement"].textContent =
    `${food.name}. Satiety score: ${food.score}%. White bread: 100%.`;
  document.title = `${food.name} | ${food.score}% | The Satiety Index`;
  const index = RANKED_FOODS.indexOf(food);
  byId("previous").setAttribute(
    "aria-label",
    `Previous food: ${RANKED_FOODS[(index - 1 + FOODS.length) % FOODS.length].name}`,
  );
  byId("next").setAttribute(
    "aria-label",
    `Next food: ${RANKED_FOODS[(index + 1) % FOODS.length].name}`,
  );
  ui["food-ranking"]
    .querySelectorAll("button")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.food === food.id),
      ),
    );
  if (animate && !initial) {
    ui["food-copy"].getAnimations().forEach((animation) => animation.cancel());
    ui["food-copy"].animate(
      [
        { opacity: 0.3, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 230, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  }
  animateScore(food.score, animate);
}

function selectFood(next, { animate = canAnimate(), updateUrl = true } = {}) {
  if (!next || next.id === food.id) return;
  food = next;
  updateCopy(animate);
  showIllustration(food, animate);
  if (updateUrl) history.pushState(null, "", `#${food.id}`);
}

function step(direction) {
  const next =
    (RANKED_FOODS.indexOf(food) + direction + RANKED_FOODS.length) %
    RANKED_FOODS.length;
  selectFood(RANKED_FOODS[next]);
}

function renderRanking() {
  const visible = RANKED_FOODS.filter(
    (item) =>
      activeCategory === "All foods" || item.category === activeCategory,
  );
  const buttons = visible.map((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ranking-row";
    button.dataset.food = item.id;
    button.setAttribute("aria-pressed", String(item.id === food.id));
    button.innerHTML = `<span class="ranking-number" aria-hidden="true"><span class="ranking-index">${String(RANKED_FOODS.indexOf(item) + 1).padStart(2, "0")}</span><svg class="ui-icon ranking-selected-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14" /></svg></span><span class="ranking-name">${item.name}</span><span class="ranking-bar" style="--score:${(item.score / 350) * 100}%" aria-hidden="true"></span><span class="ranking-score">${item.score}%</span><span class="sr-only">satiety score. White bread scores 100%. Select to compare.</span>`;
    button.addEventListener("click", () => {
      selectFood(item);
      byId("explorer").scrollIntoView({
        behavior: canAnimate() ? "smooth" : "instant",
        block: "start",
      });
      ui["food-select"].focus({ preventScroll: true });
    });
    const listItem = document.createElement("li");
    listItem.append(button);
    return listItem;
  });
  ui["food-ranking"].replaceChildren(...buttons);
  ui["filter-status"].textContent = `${visible.length} foods shown.`;
}

function setupControls() {
  [...new Set(FOODS.map((item) => item.category))].forEach((category) => {
    const group = document.createElement("optgroup");
    group.label = category;
    FOODS.filter((item) => item.category === category).forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} · ${item.score}%`;
      group.append(option);
    });
    ui["food-select"].append(group);
  });
  ["All foods", ...new Set(FOODS.map((item) => item.category))].forEach(
    (category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-filter";
      button.textContent = category;
      button.setAttribute("aria-pressed", String(category === activeCategory));
      button.addEventListener("click", () => {
        activeCategory = category;
        ui["category-filters"]
          .querySelectorAll("button")
          .forEach((filter) =>
            filter.setAttribute("aria-pressed", String(filter === button)),
          );
        renderRanking();
      });
      ui["category-filters"].append(button);
    },
  );
  ui["food-select"].addEventListener("change", (event) =>
    selectFood(FOODS.find((item) => item.id === event.target.value)),
  );
  byId("previous").addEventListener("click", () => step(-1));
  byId("next").addEventListener("click", () => step(1));
  bindFoodNavigation({
    explorer: byId("explorer"),
    surface: document.querySelector(".specimen-layout"),
    step,
  });
  const onHashChange = () =>
    selectFood(
      FOODS.find((item) => item.id === location.hash.slice(1)),
      { updateUrl: false },
    );
  window.addEventListener("popstate", onHashChange);
  window.addEventListener("hashchange", onHashChange);
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      showIllustration(food, false);
      animateScore(food.score, false);
      ui["food-copy"]
        .getAnimations()
        .forEach((animation) => animation.cancel());
    }
  });
}

function applyTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  ui["theme-toggle"].setAttribute("aria-pressed", String(theme === "dark"));
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#191a18" : "#f7f6f2";
  if (persist) {
    try {
      localStorage.setItem("satiety-theme", theme);
    } catch {}
  }
}

setupControls();
renderRanking();
applyTheme(document.documentElement.dataset.theme, false);
ui["theme-toggle"].addEventListener("click", () =>
  applyTheme(
    document.documentElement.dataset.theme === "dark" ? "light" : "dark",
  ),
);
updateCopy(false, true);
if (food.id === "potato") ui.scene.setAttribute("aria-busy", "false");
else showIllustration(food, false);
