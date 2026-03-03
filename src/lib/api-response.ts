import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'INVALID_CITY'
  | 'CITY_NOT_FOUND'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';

export function jsonError(
  status: number,
  code: ApiErrorCode,
  message: string,
  headers?: HeadersInit
) {
  return NextResponse.json({ code, message }, { status, headers });
}
