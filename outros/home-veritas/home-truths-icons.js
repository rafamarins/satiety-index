const shapes = {
  'arrow-up-right': '<path d="M5 19 19 5M5 5h14v14"/>',
  'arrow-right': '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  'arrow-left': '<path d="M19 12H5m7-7-7 7 7 7"/>',
  'arrow-down': '<path d="M12 5v14m-7-7 7 7 7-7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  plus: '<path d="M5 12h14"/><path class="icon-vertical" d="M12 5v14"/>',
};

export function icon(name) {
  return `<svg class="ui-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">${shapes[name]}</svg>`;
}
