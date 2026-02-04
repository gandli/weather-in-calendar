## 2026-02-04 - Localized Accessibility Labels
**Learning:** Hardcoded strings in client components (like `title` or `aria-label`) often bypass localization, creating mixed-language experiences for screen reader users.
**Action:** Always wrap accessible labels in `useTranslations()` even if the visible UI is an icon.
