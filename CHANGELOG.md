# Changelog

## 1.0.3 - 2026-08-28

- `l` (label) now works from inside an open message — it was gated behind an inbox-list selection check that never passed while reading a message, unlike `e`/`Shift+3` which already routed through the shared focus-aware action handler.
- `g+i` now refreshes the inbox after returning from an open message, not just when already sitting in the inbox — makes the shortcut behave the same everywhere.
- Fixed focus getting permanently stuck on a stray/hidden editable element (e.g. the label picker's filter input left behind after the dropdown closes), which was silently blocking every shortcut via the `isInputFocused()` guard.
- Fixed a crash (`Cannot read properties of undefined (reading 'toLowerCase')`) in the keydown handler when some other script dispatches a synthetic keydown-shaped event with no `key` property — this was silently swallowing shortcuts and letting Proton's native hotkey handler act on the real keypress instead.
- Added `all_frames`/`match_origin_as_fallback` injection into the sandboxed message-body iframe plus a diagnostic log — groundwork for a fix to the still-open issue where clicking directly into the message body can prevent shortcuts from reaching the extension at all (under investigation).

## 1.0.1 - 2026-06-11

- Fixed stale cursor highlight — the blue cursor outline could linger on a previously-selected row; now only the active item keeps `.pf-cursor`.
- `g+i` (and other `g+` nav shortcuts) now work while a message is open — previously blocked if focus was inside the message/content area.
- Read/unread toggles (`Shift+I` / `U`) made state-aware, then reworked again in a follow-up fix — button detection now matches broader labels (`toolbar:unread`, `mark as unread`, etc.) so mark-read/unread reliably fires regardless of current state.
- Delete from an open message now returns you to the inbox (`Shift+3` behavior) instead of leaving you on a blank/closed view.
- Route-change detection now also covers `replaceState` and `popstate`, not just `pushState` — keeps the cursor in sync across all of Proton's navigation patterns.

## 1.0.0 - 2026-04-08

- Initial Chrome Web Store release.
