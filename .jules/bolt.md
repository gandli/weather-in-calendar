# Bolt's Journal

This journal tracks critical performance learnings for this project.

## 2024-05-20 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for project-specific performance insights.

## 2024-05-20 - Dynamic API Route Caching
**Learning:** Next.js App Router API routes that access `request.url` or `searchParams` are dynamic by default and do not emit `Cache-Control` headers, even if the underlying data fetch is cached via `next: { revalidate: ... }`. This forces the server (lambda) to run on every request.
**Action:** Must manually add `Cache-Control` headers (e.g., `public, max-age=3600`) to dynamic API routes (like `/api/weather`) to enable CDN and browser caching for repeat requests.
