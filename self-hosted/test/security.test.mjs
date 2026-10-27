import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server.mjs';

async function fixture(t) {
  const dataDir = mkdtempSync(join(tmpdir(), 'nrs-regression-'));
  const port = 31000 + Math.floor(Math.random() * 10000), origin = `http://127.0.0.1:${port}`;
  const app = await createApp({ dataDir, origin, adminEmail: 'admin@example.test', adminPassword: 'administrator test password' });
  await new Promise(resolve => app.server.listen(port, '127.0.0.1', resolve));
  t.after(async () => { await app.close(); rmSync(dataDir, { recursive: true, force: true }); });
  const client = () => ({ cookie: '', csrf: '', user: null, async request(path, body, method = body ? 'POST' : 'GET') {
    const res = await fetch(origin + path, { method, headers: { origin, cookie: this.cookie, 'X-CSRF-Token': this.csrf, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json();
    if (res.headers.get('set-cookie')) this.cookie = res.headers.get('set-cookie').split(';')[0];
    if (data.csrf) this.csrf = data.csrf; if (data.user) this.user = data.user;
    return { status: res.status, data };
  } });
  const admin = client(); await admin.request('/api/login', { email: 'admin@example.test', password: 'administrator test password' });
  async function register(role, name) { const c = client(); await c.request('/api/register', { email: `${name}@example.test`, name, role, adult: true, terms: true, password: 'long enough test password' }); return c; }
  const approve = (c, approved = true, disabled = false) => admin.request('/api/admin/users', { id: c.user.id, approved, disabled });
  async function slow(c, path, data, type = 'application/json') {
    const bytes = Buffer.isBuffer(data) ? data : Buffer.from(JSON.stringify(data));
    const seen = new Promise(resolve => app.server.once('request', resolve));
    const req = http.request(origin + path, { method: 'POST', headers: { origin, cookie: c.cookie, 'X-CSRF-Token': c.csrf, 'Content-Type': type, 'Content-Length': bytes.length, 'X-Track-Title': 'Pending', 'X-Rights-Confirmed': 'true' } });
    const response = new Promise((resolve, reject) => { req.on('error', reject); req.on('response', res => { let text = ''; res.on('data', c => { text += c; }); res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(text) })); }); });
    req.write(bytes.subarray(0, 2)); await seen;
    return { finish: () => { req.end(bytes.subarray(2)); return response; } };
  }
  return { app, dataDir, origin, admin, client, register, approve, slow };
}

test('revocation during slow JSON requests prevents stale room and account writes', async t => {
  const f = await fixture(t), creator = await f.register('performer', 'Creator'), guest = await f.register('viewer', 'Guest');
  await f.approve(creator);
  const room = (await creator.request('/api/rooms', { title: 'Private', private: true })).data.id;
  await creator.request(`/api/rooms/${room}/access`, { email: 'guest@example.test' });
  const message = await f.slow(guest, `/api/rooms/${room}/messages`, { body: 'Must not be saved after revocation' });
  await creator.request(`/api/rooms/${room}/access`, { email: 'guest@example.test' }, 'DELETE');
  assert.equal((await message.finish()).status, 404);
  assert.equal((await creator.request(`/api/rooms/${room}/messages`)).data.messages.length, 0);
  const roomCreation = await f.slow(creator, '/api/rooms', { title: 'Disallowed room', private: false });
  await f.approve(creator, false);
  assert.equal((await roomCreation.finish()).status, 403);
});

test('suspension during slow audio upload prevents file persistence', async t => {
  const f = await fixture(t), dj = await f.register('dj', 'DJ'); await f.approve(dj);
  const upload = await f.slow(dj, '/api/mixes', Buffer.from('ID3\x04pending test bytes'), 'audio/mpeg');
  await f.approve(dj, true, true);
  assert.equal((await upload.finish()).status, 401);
  assert.equal(f.app.db.prepare('SELECT COUNT(*) AS n FROM mixes').get().n, 0);
});

test('invalid admin identifiers are rejected and nonexistent reviews are not reported as successful', async t => {
  const f = await fixture(t);
  assert.equal((await f.admin.request('/api/admin/users', { approved: true, disabled: false })).status, 400);
  assert.equal((await f.admin.request('/api/admin/users', { id: {}, approved: true, disabled: false })).status, 400);
  assert.equal((await f.admin.request('/api/admin/mixes', { id: 'missing', state: 'approved' })).status, 404);
  assert.equal((await f.admin.request('/api/admin/reports', { id: 999, state: 'resolved' })).status, 404);
});

test('invalid origin, storage, ICE and administrator settings fail before creating data', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nrs-config-'));
  try {
    for (const [config, expected] of [
      [{ origin: 'ftp://example.test' }, /PUBLIC_ORIGIN/],
      [{ storageLimitMB: 'not-a-number' }, /AUDIO_STORAGE_LIMIT_MB/],
      [{ storageLimitMB: -1 }, /AUDIO_STORAGE_LIMIT_MB/],
      [{ iceServers: [{}] }, /ICE_SERVERS_JSON/],
      [{ adminEmail: 'unusable-address' }, /administrator email/],
    ]) {
      let app;
      try { await assert.rejects(async () => { app = await createApp({ dataDir, origin: 'http://localhost:3000', adminEmail: 'admin@example.test', adminPassword: 'long test admin password', ...config }); }, expected); }
      finally { if (app) await app.close(); }
    }
  } finally { rmSync(dataDir, { recursive: true, force: true }); }
});

test('room capacity reserves a connection for the broadcaster', async t => {
  const f = await fixture(t), creator = await f.register('performer', 'Creator'); await f.approve(creator);
  const room = (await creator.request('/api/rooms', { title: 'Public stage', private: false })).data.id;
  const audience = [];
  for (const name of ['One', 'Two', 'Three']) audience.push(await f.register('viewer', name));
  const readers = [];
  t.after(async () => { for (const reader of readers) await reader.cancel().catch(() => {}); });
  async function connect(c) {
    const response = await fetch(`${f.origin}/api/rooms/${room}/events`, { headers: { cookie: c.cookie } });
    if (response.status === 200) readers.push(response.body.getReader()); else await response.text();
    return response.status;
  }
  for (let i = 0; i < 11; i++) assert.equal(await connect(audience[Math.floor(i / 4)]), 200);
  assert.equal(await connect(audience[2]), 503, 'audience must not occupy the broadcaster slot');
  assert.equal(await connect(creator), 200);
});

test('missing audio files return unavailable instead of an internal server error', async t => {
  const f = await fixture(t), dj = await f.register('dj', 'DJ'); await f.approve(dj);
  const id = '11111111-1111-4111-8111-111111111111';
  f.app.db.prepare('INSERT INTO mixes VALUES(?,?,?,?,?,?)').run(id, dj.user.id, 'Missing file', 'approved', 10, Date.now());
  assert.equal((await dj.request(`/api/media/${id}`)).status, 404);
});
