import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server.mjs';

test('accounts, approval, room permissions, chat, DJ state and moderation persist', async t => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nrs-test-'));
  const port = 20000 + Math.floor(Math.random() * 10000);
  const origin = `http://127.0.0.1:${port}`;
  let app = await createApp({ dataDir, origin, adminEmail: 'admin@example.test', adminPassword: 'correct horse admin password' });
  await new Promise(resolve => app.server.listen(port, '127.0.0.1', resolve));
  let address = `http://127.0.0.1:${app.server.address().port}`;
  t.after(async () => { await app.close(); rmSync(dataDir, { recursive: true, force: true }); });
  function client() {
    return { cookie: '', csrf: '', user: null, async request(path, method = 'GET', body, extra = {}) {
      const response = await fetch(address + path, { method, headers: { connection: 'close', host: new URL(origin).host, origin, 'Content-Type': 'application/json', cookie: this.cookie, 'X-CSRF-Token': this.csrf, ...extra }, body: body === undefined ? undefined : JSON.stringify(body) });
      const data = await response.json();
      if (response.headers.get('set-cookie')) this.cookie = response.headers.get('set-cookie').split(';')[0];
      if (data.csrf) this.csrf = data.csrf;
      if (data.user) this.user = data.user;
      return { status: response.status, data, headers: response.headers };
    } };
  }
  const admin = client(), performer = client(), guest = client(), outsider = client(), dj = client();
  assert.equal((await admin.request('/api/login', 'POST', { email: 'admin@example.test', password: 'wrong' })).status, 401);
  assert.equal((await admin.request('/api/login', 'POST', { email: 'admin@example.test', password: 'correct horse admin password' })).status, 200);
  const register = (c, role, name) => c.request('/api/register', 'POST', { email: `${name}@example.test`, name, password: 'a long strong password', role, adult: true, terms: true });
  assert.equal((await register(performer, 'performer', 'Performer')).status, 201);
  assert.equal((await register(guest, 'viewer', 'Guest')).status, 201);
  assert.equal((await register(outsider, 'viewer', 'Outsider')).status, 201);
  assert.equal((await register(dj, 'dj', 'DJ')).status, 201);
  assert.equal((await register(client(), 'admin', 'Escalation')).status, 400);
  assert.equal((await performer.request('/api/rooms', 'POST', { title: 'Denied', private: false })).status, 403);
  const approve = (c, approved = true, disabled = false) => admin.request('/api/admin/users', 'POST', { id: c.user.id, approved, disabled });
  assert.equal((await approve(performer)).status, 200);
  assert.equal((await approve(dj)).status, 200);
  assert.equal((await outsider.request('/api/admin/users')).status, 403);
  const created = await performer.request('/api/rooms', 'POST', { title: 'Public room', private: false });
  assert.equal(created.status, 201); const publicId = created.data.id;
  const privateId = (await performer.request('/api/rooms', 'POST', { title: 'Private room', private: true })).data.id;
  assert.equal((await performer.request('/api/rooms', 'POST', { title: 'Third room', private: false })).status, 409);
  assert.equal((await guest.request('/api/rooms')).data.rooms.length, 1);
  assert.equal((await guest.request(`/api/rooms/${privateId}/messages`)).status, 404);
  assert.equal((await outsider.request(`/api/rooms/${privateId}/access`, 'POST', { email: 'Outsider@example.test' })).status, 404);
  assert.equal((await performer.request(`/api/rooms/${privateId}/access`, 'POST', { email: 'Guest@example.test' })).status, 200);
  assert.equal((await guest.request('/api/rooms')).data.rooms.length, 2);
  // Exercise real SSE transport and authenticated signaling, without pretending this tests browser codecs or ICE.
  const streams = [];
  async function connect(c, room) {
    const response = await fetch(`${address}/api/rooms/${room}/events`, { headers: { cookie: c.cookie } });
    assert.equal(response.status, 200);
    const reader = response.body.getReader(), queue = []; let buffer = '';
    streams.push(reader);
    const pumping = (async () => {
      try { while (true) { const chunk = await reader.read(); if (chunk.done) break; buffer += new TextDecoder().decode(chunk.value); let end;
        while ((end = buffer.indexOf('\n\n')) >= 0) { const part = buffer.slice(0, end); buffer = buffer.slice(end + 2); const type = part.match(/event: (.*)/)?.[1], data = part.match(/data: (.*)/)?.[1]; if (type && data) queue.push({ type, data: JSON.parse(data) }); }
      } } catch { /* cancellation during cleanup */ }
    })();
    async function next(type) {
      for (let n = 0; n < 200; n++) { const at = queue.findIndex(x => x.type === type); if (at >= 0) return queue.splice(at, 1)[0].data; await new Promise(r => setTimeout(r, 5)); }
      throw new Error(`No SSE event: ${type}`);
    }
    return { next, reader, pumping };
  }
  const ownerStream = await connect(performer, publicId), viewerStream = await connect(guest, publicId);
  const ownerPeer = (await ownerStream.next('welcome')).peer, viewerPeer = (await viewerStream.next('welcome')).peer;
  assert.equal((await performer.request(`/api/rooms/${publicId}/broadcast`, 'POST', { peer: ownerPeer, live: true })).status, 200);
  assert.equal((await viewerStream.next('broadcast-started')).peer, ownerPeer);
  assert.equal((await ownerStream.next('viewer')).peer, viewerPeer);
  assert.equal((await performer.request(`/api/rooms/${publicId}/signal`, 'POST', { from: ownerPeer, to: viewerPeer, type: 'offer', data: { type: 'offer', sdp: 'test transport payload' } })).status, 200);
  assert.equal((await viewerStream.next('signal')).from, ownerPeer);
  assert.equal((await guest.request(`/api/rooms/${publicId}/signal`, 'POST', { from: ownerPeer, to: viewerPeer, type: 'offer', data: {} })).status, 403);
  assert.equal((await guest.request(`/api/rooms/${publicId}/signal`, 'POST', { from: viewerPeer, to: ownerPeer, type: 'offer', data: {} })).status, 403);
  assert.equal((await performer.request(`/api/rooms/${publicId}/broadcast`, 'POST', { peer: ownerPeer, live: false })).status, 200);
  await viewerStream.next('broadcast-ended');
  for (const reader of streams) await reader.cancel();
  assert.equal((await guest.request(`/api/rooms/${privateId}/messages`, 'POST', { body: '<script>alert(1)</script>' })).status, 201);
  assert.equal((await guest.request(`/api/rooms/${privateId}/messages`)).data.messages[0].body, '<script>alert(1)</script>');
  assert.equal((await guest.request(`/api/rooms/${publicId}/messages`, 'POST', { body: 'CSRF' }, { 'X-CSRF-Token': 'wrong' })).status, 403);
  assert.equal((await guest.request(`/api/rooms/${publicId}/messages`, 'POST', { body: 'Cross origin' }, { origin: 'https://evil.example' })).status, 403);
  assert.equal((await performer.request(`/api/rooms/${privateId}/access`, 'DELETE', { email: 'Guest@example.test' })).status, 200);
  assert.equal((await guest.request(`/api/rooms/${privateId}/messages`)).status, 404);
  assert.equal((await guest.request(`/api/rooms/${publicId}/broadcast`, 'POST', { live: true, peer: 'forged' })).status, 403);
  assert.equal((await performer.request(`/api/rooms/${publicId}/signal`, 'POST', { from: 'forged', to: 'forged', type: 'offer', data: {} })).status, 403);
  const track = { title: 'My mix', url: 'https://example.test/mix.mp3', position: 12, playing: true, rights: true };
  assert.equal((await guest.request('/api/dj', 'POST', track)).status, 403);
  assert.equal((await dj.request('/api/dj', 'POST', { ...track, url: 'javascript:alert(1)' })).status, 400);
  assert.equal((await dj.request('/api/dj', 'POST', track)).status, 200);
  assert.equal((await guest.request('/api/dj')).data.state.title, 'My mix');
  await approve(dj, false);
  assert.equal((await guest.request('/api/dj')).data.state, null, 'withdrawing DJ approval must withdraw their feed');
  await approve(dj);
  const uploadHeaders = { origin, cookie: dj.cookie, 'X-CSRF-Token': dj.csrf, 'Content-Type': 'audio/mpeg', 'X-Track-Title': 'Test%20mix', 'X-Rights-Confirmed': 'true' };
  assert.equal((await fetch(address + '/api/mixes', { method: 'POST', headers: uploadHeaders, body: Buffer.from('not an mp3') })).status, 400);
  const audioBytes = Buffer.from('ID3\x04\x00\x00test fixture bytes');
  const upload = await fetch(address + '/api/mixes', { method: 'POST', headers: uploadHeaders, body: audioBytes });
  assert.equal(upload.status, 201); const mixId = (await upload.json()).id;
  assert.equal((await guest.request(`/api/media/${mixId}`)).status, 404);
  assert.equal((await admin.request('/api/admin/mixes', 'POST', { id: mixId, state: 'approved' })).status, 200);
  const media = await fetch(`${address}/api/media/${mixId}`, { headers: { cookie: guest.cookie, range: 'bytes=0-2' } });
  assert.equal(media.status, 206); assert.equal(await media.text(), 'ID3');
  assert.equal((await fetch(`${address}/api/media/${mixId}`, { headers: { cookie: guest.cookie, range: 'bytes=999-1000' } })).status, 416);
  assert.equal((await dj.request('/api/dj', 'POST', { ...track, url: `/api/media/${mixId}` })).status, 200);
  await admin.request('/api/admin/mixes', 'POST', { id: mixId, state: 'rejected' });
  assert.equal((await guest.request(`/api/media/${mixId}`)).status, 404);
  assert.equal((await guest.request('/api/dj')).data.state, null, 'withdrawing a mix must withdraw its feed');
  await dj.request('/api/dj', 'POST', track);
  assert.equal((await guest.request(`/api/rooms/${publicId}/report`, 'POST', { reason: 'Test report' })).status, 201);
  const report = (await admin.request('/api/admin/reports')).data.reports[0];
  assert.equal((await admin.request('/api/admin/reports', 'POST', { id: report.id, state: 'resolved' })).status, 200);
  assert.equal((await guest.request('/api/checkout', 'POST', {})).status, 503);
  assert.equal((await approve(performer, false)).status, 200);
  assert.equal((await guest.request(`/api/rooms/${publicId}/messages`)).status, 404);
  await approve(performer);
  await app.close();
  app = await createApp({ dataDir, origin });
  await new Promise(resolve => app.server.listen(port, '127.0.0.1', resolve)); address = `http://127.0.0.1:${app.server.address().port}`;
  assert.equal((await admin.request('/api/me')).data.user.role, 'admin');
  assert.equal((await guest.request('/api/dj')).data.state.title, 'My mix');
  assert.equal((await performer.request('/api/rooms')).data.rooms.length, 2);
  assert.equal((await admin.request('/api/admin/reports')).data.reports[0].state, 'resolved');
  await approve(guest, true, true);
  assert.equal((await guest.request('/api/me')).data.user, null);
  assert.equal((await guest.request('/api/rooms')).status, 401);
  await admin.request('/api/logout', 'POST', {});
  assert.equal((await admin.request('/api/admin/users')).status, 401);
});

test('first-start admin and secure production origin are required', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nrs-setup-'));
  try {
    await assert.rejects(createApp({ dataDir, origin: 'http://localhost:3000' }), /ADMIN_EMAIL/);
    await assert.rejects(createApp({ dataDir, production: true, origin: 'http://example.test' }), /HTTPS/);
  } finally { rmSync(dataDir, { recursive: true, force: true }); }
});
