# Changelog

## 1.0.1 - 2026-06-11

- Fixed stale cursor highlight — the blue cursor outline could linger on a previously-selected row; now only the active item keeps `.pf-cursor`.
- `g+i` (and other `g+` nav shortcuts) now work while a message is open — previously blocked if focus was inside the message/content area.
- Read/unread toggles (`Shift+I` / `U`) made state-aware, then reworked again in a follow-up fix — button detection now matches broader labels (`toolbar:unread`, `mark as unread`, etc.) so mark-read/unread reliably fires regardless of current state.
- Delete from an open message now returns you to the inbox (`Shift+3` behavior) instead of leaving you on a blank/closed view.
- Route-change detection now also covers `replaceState` and `popstate`, not just `pushState` — keeps the cursor in sync across all of Proton's navigation patterns.

## 1.0.0 - 2026-04-08

- Initial Chrome Web Store release.
