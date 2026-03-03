import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/lib/api-response';
import { makeCacheKey, withServerCache } from '@/lib/server-cache';
import { lookupCitySuggestions } from '@/lib/qweather';
import { createRequestId, logApiError, logApiEvent, sanitizeForLog } from '@/lib/observability';

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q) {
      return jsonError(400, 'BAD_REQUEST', 'q parameter is required', { 'X-Request-Id': requestId });
    }

    if (q.length < 2) {
      return NextResponse.json({ suggestions: [] }, { headers: { 'X-Request-Id': requestId } });
    }

    const cacheKey = makeCacheKey('city-suggest', [q.toLowerCase()]);
    const suggestions = await withServerCache(cacheKey, 24 * 60 * 60 * 1000, () =>
      lookupCitySuggestions(q, 8)
    );

    logApiEvent('city-suggest', requestId, {
      query: sanitizeForLog(q),
      count: suggestions.length,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(
      { suggestions },
      {
        headers: {
          'X-Request-Id': requestId,
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
          'Server-Timing': `total;dur=${Date.now() - startedAt}`,
        },
      }
    );
  } catch (error) {
    logApiError('city-suggest', requestId, error);
    return jsonError(500, 'INTERNAL_ERROR', 'Failed to fetch city suggestions', {
      'X-Request-Id': requestId,
    });
  }
}
