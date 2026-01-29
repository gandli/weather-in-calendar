## 2025-02-18 - Input Validation for API Parameters
**Vulnerability:** API routes (`weather`, `hourly`, `ics`) accepted unbounded `city` string parameters, allowing for potential DoS or CRLF injection (in ICS files).
**Learning:** Even with downstream API libraries, input validation (length limits) and sanitization (stripping control characters) are critical at the API gateway layer (Next.js route handlers) to prevent abuse and injection attacks.
**Prevention:** Always validate input length and type before processing. Use a dedicated `validation.ts` utility to share logic across routes. Strip control characters from user inputs that might be reflected in file generation or logs.

## 2025-02-18 - Platform-Specific Configuration Gaps
**Vulnerability:** Security headers defined in `vercel.json` were ignored in the Cloudflare deployment environment, leaving the application without basic HTTP security protections.
**Learning:** Deployment platform configurations (e.g., `vercel.json` vs `wrangler.jsonc`) are not interchangeable. Framework-level configuration (e.g., `next.config.ts`) is the most reliable way to enforce security settings across different providers.
**Prevention:** define security headers and redirects in `next.config.ts` rather than relying on provider-specific configuration files unless absolutely necessary.
