## 2025-02-18 - Input Validation for API Parameters
**Vulnerability:** API routes (`weather`, `hourly`, `ics`) accepted unbounded `city` string parameters, allowing for potential DoS or CRLF injection (in ICS files).
**Learning:** Even with downstream API libraries, input validation (length limits) and sanitization (stripping control characters) are critical at the API gateway layer (Next.js route handlers) to prevent abuse and injection attacks.
**Prevention:** Always validate input length and type before processing. Use a dedicated `validation.ts` utility to share logic across routes. Strip control characters from user inputs that might be reflected in file generation or logs.

## 2025-02-18 - Daily Forecast API Validation Gap
**Vulnerability:** The `daily` API route (`src/app/api/daily/route.ts`) was missing input validation and sanitization for the `city` parameter, unlike other endpoints, exposing it to potential DoS or injection risks.
**Learning:** Consistency is key in security. When applying security patterns (like input validation), ensure they are applied to *all* relevant endpoints, not just the ones initially identified. Automated scanning or shared middleware can help prevent these gaps.
**Prevention:** Audit all API routes for consistent application of security utilities (`validateCityInput`, `sanitizeCityInput`). Consider using middleware or a higher-order function to enforce validation on all city-based endpoints.
