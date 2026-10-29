const { test } = require('node:test');
const assert = require('node:assert/strict');
let configured = false;
let offline = false;
require.cache[require.resolve('../db')] = { exports: {
  isConfigured: () => configured,
  getPool: async () => {
    if (offline) throw Object.assign(new Error('Simulated outage'), { code: 'ETIMEOUT' });
    return { request: () => ({ query: async () => ({ recordset: [{ OK: 1 }] }) }) };
  }
} };
const app = require('../server');
test('HTTP: assets, demo health, SQL status and API errors', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const page = await fetch(base);
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.match(html, /WeWine/);
    for (const id of ['login', 'products', 'order', 'manage', 'stats']) assert.ok(html.includes('id="page-' + id + '"'));
    for (const file of ['style.css', 'script.js']) {
      const result = await fetch(base + '/' + file);
      assert.equal(result.status, 200);
      assert.ok((await result.text()).length > 100);
    }
    const demo = await fetch(base + '/api/health');
    assert.equal(demo.status, 200);
    assert.equal((await demo.json()).database, 'Not configured');
    assert.equal(demo.headers.get('cache-control'), 'no-store');
    configured = true;
    assert.equal((await (await fetch(base + '/api/health')).json()).database, 'Connected');
    offline = true;
    assert.equal((await fetch(base + '/api/health')).status, 503);
    assert.equal((await fetch(base)).status, 200);
    offline = false;
    assert.equal((await fetch(base + '/api/health')).status, 200);
    assert.equal((await fetch(base + '/api/missing')).status, 404);
    const invalid = await fetch(base + '/api/missing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal(invalid.status, 400);
    for (const file of ['.env', 'db.js', 'schema.sql', 'package.json']) assert.equal((await fetch(base + '/' + file)).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});