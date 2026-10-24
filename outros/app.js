const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let savedTheme;

try {
  savedTheme = localStorage.getItem("outros-theme");
} catch {
  // The page remains usable when browser storage is unavailable.
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeColor.content = theme === "dark" ? "#191a18" : "#f2f0e9";
}

applyTheme(
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : systemTheme.matches
      ? "dark"
      : "light",
);
themeToggle.hidden = false;

themeToggle.addEventListener("click", () => {
  savedTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(savedTheme);
  try {
    localStorage.setItem("outros-theme", savedTheme);
  } catch {
    // Theme switching does not depend on persistence.
  }
});

systemTheme.addEventListener("change", (event) => {
  if (savedTheme !== "light" && savedTheme !== "dark") {
    applyTheme(event.matches ? "dark" : "light");
  }
});
