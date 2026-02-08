## 2026-02-08 - Verification Scripts and Next.js Imports
**Learning:** Standalone verification scripts executed with `tsx` cannot resolve `next/server` imports because they lack the Next.js build environment. This makes verifying logic inside API routes difficult.
**Action:** Extract pure logic (e.g., data formatting, generation) into separate files (like `src/lib/ics.ts`) that don't depend on `next/server`. This allows easy unit testing and verification without mocking the entire Next.js runtime.
