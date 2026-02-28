export const MAX_CITY_LENGTH = 100;

export function validateCityInput(city: string | null): asserts city is string {
  if (!city) {
    throw new Error('City parameter is required');
  }
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error('City parameter is required');
  }
  if (trimmed.length > MAX_CITY_LENGTH) {
    throw new Error(`City name too long (max ${MAX_CITY_LENGTH} chars)`);
  }
}
