## 2025-02-18 - Input Validation for API Parameters
**Vulnerability:** API routes (`weather`, `hourly`, `ics`) accepted unbounded `city` string parameters, allowing for potential DoS or CRLF injection (in ICS files).
**Learning:** Even with downstream API libraries, input validation (length limits) and sanitization (stripping control characters) are critical at the API gateway layer (Next.js route handlers) to prevent abuse and injection attacks.
**Prevention:** Always validate input length and type before processing. Use a dedicated `validation.ts` utility to share logic across routes. Strip control characters from user inputs that might be reflected in file generation or logs.

## 2025-02-18 - Missing HTTP Security Headers
**Vulnerability:** Application lacked standard security headers (HSTS, X-Frame-Options, etc.), exposing it to clickjacking and MIME-sniffing.
**Learning:** Default Next.js setup provides some security but not comprehensive headers. `Permissions-Policy` requires specific knowledge of app features (e.g., geolocation usage) to configure safely without breaking functionality.
**Prevention:** Enforce a standard set of security headers in `next.config.ts` for all projects, but manually verify feature-policy implications.
