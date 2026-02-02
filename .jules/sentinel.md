## 2025-02-18 - Input Validation for API Parameters
**Vulnerability:** API routes (`weather`, `hourly`, `ics`) accepted unbounded `city` string parameters, allowing for potential DoS or CRLF injection (in ICS files).
**Learning:** Even with downstream API libraries, input validation (length limits) and sanitization (stripping control characters) are critical at the API gateway layer (Next.js route handlers) to prevent abuse and injection attacks.
**Prevention:** Always validate input length and type before processing. Use a dedicated `validation.ts` utility to share logic across routes. Strip control characters from user inputs that might be reflected in file generation or logs.

## 2025-02-18 - Input Validation Gap in Daily Route
**Vulnerability:** The 'daily' API route was missed in the initial validation sweep, leaving it vulnerable to long input strings and potential resource exhaustion.
**Learning:** When applying security patterns across multiple endpoints, explicitly audit *all* similar files (e.g., all `route.ts` files) to ensure 100% coverage.
**Prevention:** Use shared middleware or higher-order functions for validation to enforce consistency automatically, rather than relying on per-route manual implementation.
