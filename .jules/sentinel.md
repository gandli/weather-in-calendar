## 2025-02-18 - Input Validation for API Parameters
**Vulnerability:** API routes (`weather`, `hourly`, `ics`) accepted unbounded `city` string parameters, allowing for potential DoS or CRLF injection (in ICS files).
**Learning:** Even with downstream API libraries, input validation (length limits) and sanitization (stripping control characters) are critical at the API gateway layer (Next.js route handlers) to prevent abuse and injection attacks.
**Prevention:** Always validate input length and type before processing. Use a dedicated `validation.ts` utility to share logic across routes. Strip control characters from user inputs that might be reflected in file generation or logs.

## 2025-02-18 - Missing Security Headers in Next.js Config
**Vulnerability:** The application lacked essential HTTP security headers (HSTS, X-Frame-Options, Permissions-Policy, etc.) in `next.config.ts`. Headers in `vercel.json` were ignored by the Cloudflare OpenNext deployment.
**Learning:** Deployment platforms (like Cloudflare via OpenNext) may ignore platform-specific config files (like `vercel.json`). Security headers must be defined in `next.config.ts` using the `headers()` function to ensure they are applied regardless of the deployment target.
**Prevention:** Always define security headers in the framework's core configuration (`next.config.js/ts`) rather than relying on deployment-specific files. Verify headers are present in production builds.
