## 2026-02-04 - Inconsistent API Caching
**Learning:** Found that `src/app/api/weather/route.ts` was missing `Cache-Control` headers despite `daily` and `hourly` routes having them. This caused unnecessary server load for the most frequent request type. Next.js API routes using `request.url` are dynamic by default, making explicit headers crucial.
**Action:** Always audit all similar API routes when checking for caching behavior; do not assume consistency across endpoints.
