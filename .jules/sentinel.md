## 2025-02-18 - API Input Length Validation
**Vulnerability:** Missing length checks on 'city' parameter in API routes, allowing potential DoS via large inputs.
**Learning:** API routes often trust client-side validation or assume reasonable inputs. BFF (Backend for Frontend) layers must independently validate all inputs.
**Prevention:** Implemented centralized `validateCityInput` with `MAX_CITY_LENGTH` constraint and applied it to all weather endpoints.
