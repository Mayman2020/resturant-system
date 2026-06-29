/**
 * Restaurant RMS — full API ↔ frontend integration smoke test.
 * Usage: node scripts/api-integration-test.mjs [baseUrl]
 * Default: http://localhost:8083/api/v1
 */
const BASE = (process.argv[2] || 'http://localhost:8083/api/v1').replace(/\/$/, '');
const LOGIN = { username: 'admin', password: 'Dev@Local2026!' };

const results = [];
let token = '';
let branchId = 1;

function pass(name, detail = '') {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
}

async function request(method, path, { body, expect = [200, 201], auth = true, branch = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  if (branch && branchId) headers['X-Active-Branch-Id'] = String(branchId);
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let json = null;
  const text = await res.text();
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  const ok = expect.includes(res.status);
  return { ok, status: res.status, json, path, method };
}

async function check(name, method, path, opts = {}) {
  try {
    const r = await request(method, path, opts);
    if (r.ok) {
      pass(name, `${r.status}`);
      return r.json;
    }
    fail(name, `HTTP ${r.status} ${r.json?.message || ''}`.trim());
    return null;
  } catch (err) {
    fail(name, err.message);
    return null;
  }
}

async function main() {
  console.log(`\nRMS API Integration Test\nBase: ${BASE}\n`);

  const loginRes = await check('POST /auth/login', 'POST', '/auth/login', {
    body: LOGIN,
    auth: false,
    branch: false
  });
  token = loginRes?.data?.accessToken || loginRes?.data?.token || '';
  if (!token) {
    console.error('\nLogin failed — cannot continue.\n');
    process.exit(1);
  }

  const branches = await check('GET /branches', 'GET', '/branches');
  if (branches?.data?.length) branchId = branches.data[0].id;

  await check('GET /dashboard/summary', 'GET', `/dashboard/summary?branchId=${branchId}`);
  await check('GET /menu/categories', 'GET', `/menu/categories?branchId=${branchId}`);
  await check('GET /menu/items', 'GET', `/menu/items?branchId=${branchId}`);
  await check('GET /orders', 'GET', `/orders?branchId=${branchId}`);
  await check('GET /tables', 'GET', `/tables?branchId=${branchId}`);
  await check('GET /tables/reservations', 'GET', `/tables/reservations?branchId=${branchId}`);
  await check('GET /kitchen/active', 'GET', `/kitchen/active?branchId=${branchId}`);
  await check('GET /delivery', 'GET', `/delivery?branchId=${branchId}`);
  await check('GET /customers', 'GET', '/customers?page=0&size=10');
  await check('GET /loyalty/coupons', 'GET', '/loyalty/coupons');
  await check('GET /inventory', 'GET', `/inventory?branchId=${branchId}`);
  await check('GET /inventory/low-stock', 'GET', `/inventory/low-stock?branchId=${branchId}`);
  await check('GET /users', 'GET', '/users?page=0&size=10');
  await check('GET /settings', 'GET', `/settings?branchId=${branchId}`);
  const today = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  await check('GET /reports/sales/daily', 'GET', `/reports/sales/daily?branchId=${branchId}&date=${today}`);
  await check('GET /reports/top-items', 'GET', `/reports/top-items?branchId=${branchId}&from=${from}&to=${today}&limit=5`);
  await check('GET /reports/branch-performance', 'GET', `/reports/branch-performance?from=${from}&to=${today}`);
  await check('GET /billing/receipts', 'GET', `/billing/receipts?branchId=${branchId}`);
  await check('GET /permissions', 'GET', '/permissions');

  const notif = await request('GET', '/notifications?page=0&size=5');
  if (notif.status === 404) {
    fail('GET /notifications', 'HTTP 404 — backend has no notifications API (frontend uses localStorage fallback)');
  } else if (notif.ok) {
    pass('GET /notifications', `${notif.status}`);
  } else {
    fail('GET /notifications', `HTTP ${notif.status}`);
  }

  const qr = await request('GET', '/menu/qr/QR-T01', { auth: false, branch: false });
  if (qr.ok) pass('GET /menu/qr/{code} (public)', `${qr.status}`);
  else fail('GET /menu/qr/{code} (public)', `HTTP ${qr.status}`);

  await check('POST /auth/logout', 'POST', '/auth/logout', { body: {} });

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${'─'.repeat(48)}`);
  console.log(`Passed: ${passed}  Failed: ${failed}  Total: ${results.length}`);
  if (failed) {
    console.log('\nFailed checks:');
    results.filter((r) => !r.ok).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
    process.exit(1);
  }
  console.log('\nAll API checks passed.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
