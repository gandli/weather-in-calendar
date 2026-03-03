export function createRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sanitizeForLog(value: string): string {
  return value
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[^\p{L}\p{N}\s,.-]/gu, '')
    .slice(0, 64)
    .trim();
}

export function logApiEvent(route: string, requestId: string, details: Record<string, unknown>) {
  console.info(`[api:${route}]`, { requestId, ...details });
}

export function logApiError(route: string, requestId: string, error: unknown, details: Record<string, unknown> = {}) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[api:${route}:error]`, {
    requestId,
    message,
    ...details,
  });
}
