## 2025-02-18 - Next.js API Route Caching
**Learning:** Next.js App Router API routes that access `request` (e.g., `request.url`) are dynamic by default and do not emit `Cache-Control` headers, even if the underlying data fetch is cached via `next: { revalidate }`. The client will re-fetch from the server on every request unless explicit `Cache-Control` headers are set in the response.
**Action:** Always verify `Cache-Control` headers on API routes using `curl` or a script, especially for read-heavy endpoints, and manually add `Cache-Control` headers to `NextResponse` when appropriate.

## 2025-02-18 - NextResponse Content-Type
**Learning:** `NextResponse.json()` automatically sets the `Content-Type: application/json` header. Manually setting it is redundant.
**Action:** Rely on `NextResponse.json()` for content type and only set custom headers like `Cache-Control`.
