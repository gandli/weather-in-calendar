## 2025-02-04 - [Semantic Lists for Grid Content]
**Learning:** Grids of content cards (like weather forecasts) are visually distinct but semantically flattened when using `div`s. Screen readers benefit significantly from `ul`/`li` structures with explicit `aria-label`s summarizing the card's content (e.g., "Monday, Cloudy, Low 10, High 20") rather than navigating through individual text nodes.
**Action:** When refactoring grid layouts, verify if they represent a list of items and convert to `ul`/`li` with summary labels.
