# Language switcher regression — 26 October 2026

User reported translation selection was not working. Reproduced with real pointer clicks: selecting BR, ES or Chinese closed the menu but left the entire site in English, without requesting a translation or showing an error.

Root cause: the picker focusout handler queued a microtask and inspected document.activeElement. During a native pointer focus transition between options, focus temporarily appears on body. The handler hid the menu between mousedown and mouseup, so the click landed on the page underneath rather than the language option.

Fix: determine whether focus leaves the picker from FocusEvent.relatedTarget, rather than transient activeElement. Keep the dropdown open for option-to-option focus changes; close it for actual exits. Mouse, touch, keyboard navigation, Escape and outside-click dismissal are preserved.

Earlier language audits used URL-selected locales or synthetic DOM clicks and therefore did not detect the pointer failure. The previous 31-state accessibility result remains a record of those inspected states, not proof that language selection worked.

Verification:
- New scripts/check-language-switching.mjs uses native Chrome mouse clicks, touch taps and keyboard Home/Arrow/Enter selection.
- All four languages checked in each input mode: translated heading, HTML language, URL preference, local persistence, closed menu and restored trigger focus.
- Reload persistence, topic navigation, visual caption and deep FAQ translations checked in Portuguese for all three input modes.
- Escape and outside-click dismissal verified in every mode.
- 15 switching/persistence/deep-content cases passed; raw results in 2026-10-26-language-switching.json.
- Fresh Chrome UI click from English to BR independently verified the visible translated homepage.
- All 12 unit/content checks and production build passed.

Changed application file: home-truths.js; generated bundle and dist rebuilt. Refresh existing tabs to load the correction. No deployment or commit.
