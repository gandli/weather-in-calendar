import test from 'node:test';
import assert from 'node:assert/strict';

import { validateCityInput, sanitizeCityInput } from '../src/lib/validation';
import { withServerCache } from '../src/lib/server-cache';
import { jsonError } from '../src/lib/api-response';
import { sanitizeForLog } from '../src/lib/observability';

test('validateCityInput enforces max length', () => {
  assert.equal(validateCityInput('Shanghai'), true);
  assert.equal(validateCityInput('a'.repeat(101)), false);
});

test('sanitizeCityInput removes control chars', () => {
  assert.equal(sanitizeCityInput('Shang\nhai\t'), 'Shanghai');
});

test('sanitizeForLog strips unsafe chars and limits length', () => {
  const input = '福州<script>alert(1)</script>\n'.repeat(10);
  const output = sanitizeForLog(input);
  assert.equal(output.includes('<script>'), false);
  assert.equal(output.length <= 64, true);
});

test('withServerCache returns cached value within ttl', async () => {
  let calls = 0;
  const getValue = async () => {
    calls += 1;
    return { value: calls };
  };

  const first = await withServerCache('k1', 1_000, getValue);
  const second = await withServerCache('k1', 1_000, getValue);

  assert.deepEqual(first, { value: 1 });
  assert.deepEqual(second, { value: 1 });
  assert.equal(calls, 1);
});

test('jsonError returns unified payload', async () => {
  const res = jsonError(400, 'BAD_REQUEST', 'City parameter is required');
  assert.equal(res.status, 400);
  const payload = await res.json();
  assert.deepEqual(payload, {
    code: 'BAD_REQUEST',
    message: 'City parameter is required',
  });
});
