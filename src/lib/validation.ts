export const MAX_CITY_LENGTH = 100;

/**
 * Validates that the city input is within the allowed length.
 * @param city The city name string.
 * @returns true if valid, false otherwise.
 */
export function validateCityInput(city: string): boolean {
  return city.length <= MAX_CITY_LENGTH;
}

/**
 * Sanitizes the city input by removing control characters.
 * This helps prevent CRLF injection and other issues.
 * @param city The city name string.
 * @returns The sanitized city name.
 */
export function sanitizeCityInput(city: string): string {
  // Remove control characters (including newlines)
  return city.replace(/[\x00-\x1F\x7F]/g, '');
}
