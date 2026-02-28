## 2026-02-01 - Icon-only Links Accessibility
**Learning:** Icon-only links (anchor tags styled as buttons) using `lucide-react` icons require explicit `aria-label` attributes. The `title` attribute is insufficient for screen readers.
**Action:** When using `buttonVariants({ size: "icon" })` on an `<a>` tag, always add a descriptive `aria-label`.
