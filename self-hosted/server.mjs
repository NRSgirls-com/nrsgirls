import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync, readFileSync, writeFileSync, unlinkSync, createReadStream, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const derive = promisify(scrypt);
const here = dirname(fileURLToPath(import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const safeUser = u => u && ({ id: u.id, name: u.name, role: u.role, approved: !!u.approved, disabled: !!u.disabled });
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const field = (value, name, max = 160) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) fail(400, `Invalid ${name}`);
  return value.trim();
};

export async function createApp(options = {}) {
  const production = options.production ?? process.env.NODE_ENV === 'production';
  const origin = new URL(options.origin || process.env.PUBLIC_ORIGIN || 'http://localhost:3000').origin;
  if (production && !origin.startsWith('https://')) throw new Error('Production requires an HTTPS PUBLIC_ORIGIN');
  const dataDir = options.dataDir || process.env.DATA_DIR || join(here, 'data');
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  mkdirSync(join(dataDir, 'audio'), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(dataDir, 'platform.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      password TEXT NOT NULL, role TEXT NOT NULL, approved INTEGER NOT NULL DEFAULT 0, disabled INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE CASCADE, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS rooms(id TEXT PRIMARY KEY, owner TEXT REFERENCES users(id), title TEXT NOT NULL, private INTEGER NOT NULL, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS grants(room TEXT REFERENCES rooms(id) ON DELETE CASCADE, user_id TEXT REFERENCES users(id) ON DELETE CASCADE, PRIMARY KEY(room,user_id));
    CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT REFERENCES rooms(id), user_id TEXT REFERENCES users(id), body TEXT NOT NULL, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT, reporter TEXT REFERENCES users(id), room TEXT REFERENCES rooms(id), reason TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'open', created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS mixes(id TEXT PRIMARY KEY, owner TEXT REFERENCES users(id), title TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', size INTEGER NOT NULL, created INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS messages_room ON messages(room,id);
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires);`);
  const get = (sql, ...args) => db.prepare(sql).get(...args);
  const all = (sql, ...args) => db.prepare(sql).all(...args);
  const run = (sql, ...args) => db.prepare(sql).run(...args);
  async function passwordHash(password) {
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) fail(400, 'Password must have 12–128 characters');
    const salt = randomBytes(16).toString('hex');
    return `${salt}:${Buffer.from(await derive(password, salt, 64)).toString('hex')}`;
  }
  async function passwordMatches(password, encoded) {
    const [salt, expected] = encoded.split(':');
    const actual = Buffer.from(await derive(password, salt, 64));
    return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
  }
  const adminEmail = options.adminEmail || process.env.ADMIN_EMAIL;
  const adminPassword = options.adminPassword || process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword && !get('SELECT id FROM users WHERE role=?', 'admin')) {
    run('INSERT INTO users VALUES(?,?,?,?,?,1,0,?)', randomUUID(), adminEmail.toLowerCase().trim(), 'Administrator', await passwordHash(adminPassword), 'admin', Date.now());
  }
  if (!get('SELECT id FROM users WHERE role=?', 'admin')) {
    db.close();
    throw new Error('First start requires ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters). No public admin signup is allowed.');
  }
  const iceServers = options.iceServers || JSON.parse(process.env.ICE_SERVERS_JSON || '[]');
  if (!Array.isArray(iceServers)) throw new Error('ICE_SERVERS_JSON must be an array');
  const clients = new Map();
  const rates = new Map();
  const live = new Map();
  const send = (client, type, data) => {
    if (client.res.writableLength > 1048576) { client.res.destroy(); return; }
    if (!client.res.destroyed && !client.res.writableEnded) client.res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
  };
  const roomAccess = (room, user) => !room.private || room.owner === user.id || user.role === 'admin' || !!get('SELECT 1 FROM grants WHERE room=? AND user_id=?', room.id, user.id);
  function requireRoom(id, user) {
    const room = get('SELECT * FROM rooms WHERE id=?', id);
    const owner = room && get('SELECT approved,disabled FROM users WHERE id=?', room.owner);
    if (!room || !owner.approved || owner.disabled || !roomAccess(room, user)) fail(404, 'Room unavailable');
    return room;
  }
  function broadcast(room, type, data) {
    for (const c of clients.values()) if (c.room === room) send(c, type, data);
  }
  function detach(c) {
    if (!clients.delete(c.id)) return;
    const wasLive = live.get(c.room) === c.id;
    if (wasLive) { live.delete(c.room); broadcast(c.room, 'broadcast-ended', {}); }
    broadcast(c.room, 'peer-left', { peer: c.id });
    c.res.end();
  }
  function endUserConnections(userId, roomId) {
    for (const c of [...clients.values()]) if (c.userId === userId && (!roomId || c.room === roomId)) detach(c);
  }
  function rate(req, key, limit, window = 60_000) {
    // Do not trust arbitrary forwarded IP headers. A single-process perimeter proxy may set socket addresses differently.
    const id = `${req.socket.remoteAddress}:${key}`;
    const now = Date.now();
    const current = rates.get(id);
    if (!current || current.until < now) rates.set(id, { count: 1, until: now + window });
    else if (++current.count > limit) fail(429, 'Too many requests. Try again later.');
  }
  async function body(req) {
    if (!req.headers['content-type']?.startsWith('application/json')) fail(415, 'Use application/json');
    let size = 0; const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 65536) fail(413, 'Request too large');
      chunks.push(chunk);
    }
    try { const value = JSON.parse(Buffer.concat(chunks).toString()); if (!value || Array.isArray(value) || typeof value !== 'object') fail(400, 'Invalid JSON object'); return value; }
    catch { fail(400, 'Invalid JSON object'); }
  }
  function auth(req) {
    const raw = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('nrs_session='))?.slice(12);
    if (!raw) return null;
    const session = get('SELECT * FROM sessions WHERE token=? AND expires>?', hash(raw), Date.now());
    if (!session) return null;
    const user = get('SELECT * FROM users WHERE id=? AND disabled=0', session.user_id);
    return user ? { user, session } : null;
  }
  function sessionCookie(token, maxAge = 604800) {
    return `nrs_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${production ? '; Secure' : ''}`;
  }
  function startSession(res, user) {
    const token = randomBytes(32).toString('hex'), csrf = randomBytes(24).toString('hex');
    run('INSERT INTO sessions VALUES(?,?,?,?)', hash(token), user.id, csrf, Date.now() + 604800000);
    res.setHeader('Set-Cookie', sessionCookie(token));
    return { user: safeUser(user), csrf };
  }
  const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)); };
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; media-src 'self' https: blob:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    if (production) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    try {
      const url = new URL(req.url, origin), path = url.pathname;
      if (req.headers.host !== new URL(origin).host) fail(403, 'Unexpected host');
      const mutation = !['GET', 'HEAD'].includes(req.method);
      if (mutation && req.headers.origin !== origin) fail(403, 'Origin rejected');
      if (!path.startsWith('/api/')) {
        if (req.method !== 'GET') fail(405, 'Method not allowed');
        const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
        if (!files[path]) fail(404, 'Not found');
        const [file, type] = files[path];
        res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` }); return res.end(readFileSync(join(here, 'public', file)));
      }
      if (req.method === 'GET' && path === '/api/health') return json(res, 200, { status: 'ok', database: get('SELECT 1 AS ok').ok === 1 });
      if (req.method === 'POST' && ['/api/register', '/api/login'].includes(path)) {
        rate(req, 'auth', 12, 900000);
        const b = await body(req);
        const email = field(b.email, 'email', 254).toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Invalid email');
        if (typeof b.password !== 'string' || b.password.length > 128) fail(400, 'Invalid password');
        if (path === '/api/register') {
          if (b.adult !== true || b.terms !== true) fail(400, 'Adult confirmation and community rules acceptance required');
          const role = b.role;
          if (!['viewer', 'performer', 'dj'].includes(role)) fail(400, 'Invalid role');
          const name = field(b.name, 'display name', 60);
          const encoded = await passwordHash(b.password);
          if (get('SELECT id FROM users WHERE email=?', email)) fail(409, 'Registration unavailable for this email');
          const id = randomUUID();
          run('INSERT INTO users VALUES(?,?,?,?,?, ?,0,?)', id, email, name, encoded, role, role === 'viewer' ? 1 : 0, Date.now());
          return json(res, 201, startSession(res, get('SELECT * FROM users WHERE id=?', id)));
        }
        const user = get('SELECT * FROM users WHERE email=?', email);
        const dummy = '00000000000000000000000000000000:' + '0'.repeat(128);
        const valid = await passwordMatches(b.password, user?.password || dummy);
        if (!user || !valid || user.disabled) fail(401, 'Invalid credentials');
        return json(res, 200, startSession(res, user));
      }
      const identity = auth(req);
      if (path === '/api/me' && req.method === 'GET') return json(res, 200, identity ? { user: safeUser(identity.user), csrf: identity.session.csrf } : { user: null });
      if (!identity) fail(401, 'Sign in required');
      const { user, session } = identity;
      if (mutation && req.headers['x-csrf-token'] !== session.csrf) fail(403, 'Refresh this page and try again');
      if (mutation) rate(req, `write:${user.id}`, 180);
      if (path === '/api/logout' && req.method === 'POST') {
        run('DELETE FROM sessions WHERE token=?', session.token);
        for (const c of [...clients.values()]) if (c.session === session.token) detach(c);
        res.setHeader('Set-Cookie', sessionCookie('', 0)); return json(res, 200, { ok: true });
      }
      if (path === '/api/mixes' && req.method === 'GET') return json(res, 200, { mixes: all('SELECT m.*,u.name AS dj FROM mixes m JOIN users u ON u.id=m.owner WHERE u.disabled=0 AND (m.state=? OR m.owner=?) ORDER BY m.created DESC', 'approved', user.id) });
      if (path === '/api/mixes' && req.method === 'POST') {
        if (!user.approved || !['dj', 'admin'].includes(user.role)) fail(403, 'Approved DJ account required');
        rate(req, `upload:${user.id}`, 4, 3600000);
        if (req.headers['content-type'] !== 'audio/mpeg' || req.headers['x-rights-confirmed'] !== 'true') fail(400, 'MP3 and rights confirmation required');
        let title; try { title = decodeURIComponent(req.headers['x-track-title'] || ''); } catch { fail(400, 'Invalid track title'); }
        title = field(title, 'title', 100);
        const maxBytes = 20 * 1024 * 1024;
        const storageLimit = Number(process.env.AUDIO_STORAGE_LIMIT_MB || 200) * 1024 * 1024;
        const used = get('SELECT COALESCE(SUM(size),0) AS size FROM mixes').size;
        if (used >= storageLimit) fail(507, 'Local audio storage is full');
        let size = 0; const chunks = [];
        for await (const chunk of req) { size += chunk.length; if (size > maxBytes || used + size > storageLimit) fail(413, 'Audio exceeds the 20 MB upload or server storage limit'); chunks.push(chunk); }
        const audio = Buffer.concat(chunks);
        if (audio.length < 4 || !(audio.subarray(0, 3).toString() === 'ID3' || (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0))) fail(400, 'Expected MP3 signature');
        // Header recognition is not a malware scan or a full codec validation. All uploads remain pending human review.
        // Recheck after awaiting the body so simultaneous uploads cannot exceed the total quota.
        if (get('SELECT COALESCE(SUM(size),0) AS size FROM mixes').size + size > storageLimit) fail(507, 'Local audio storage is full');
        const id = randomUUID(), filename = join(dataDir, 'audio', `${id}.mp3`);
        writeFileSync(filename, audio, { flag: 'wx', mode: 0o600 });
        try { run('INSERT INTO mixes VALUES(?,?,?,?,?,?)', id, user.id, title, 'pending', size, Date.now()); }
        catch (error) { unlinkSync(filename); throw error; }
        return json(res, 201, { id, state: 'pending' });
      }
      const mediaMatch = path.match(/^\/api\/media\/([0-9a-f-]{36})$/);
      if (mediaMatch && ['GET', 'HEAD'].includes(req.method)) {
        const mix = get('SELECT m.* FROM mixes m JOIN users u ON u.id=m.owner WHERE m.id=? AND u.disabled=0 AND u.approved=1', mediaMatch[1]);
        if (!mix || (mix.state !== 'approved' && user.role !== 'admin')) fail(404, 'Audio unavailable');
        const filename = join(dataDir, 'audio', `${mix.id}.mp3`), size = statSync(filename).size;
        let start = 0, end = size - 1, status = 200;
        if (req.headers.range) {
          const range = req.headers.range.match(/^bytes=(\d*)-(\d*)$/);
          if (!range || (!range[1] && !range[2])) { res.setHeader('Content-Range', `bytes */${size}`); fail(416, 'Invalid byte range'); }
          if (!range[1]) start = Math.max(0, size - Number(range[2]));
          else { start = Number(range[1]); if (range[2]) end = Math.min(end, Number(range[2])); }
          if (start > end || start >= size || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) { res.setHeader('Content-Range', `bytes */${size}`); fail(416, 'Invalid byte range'); }
          status = 206; res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
        }
        res.writeHead(status, { 'Content-Type': 'audio/mpeg', 'Content-Length': end - start + 1, 'Accept-Ranges': 'bytes' });
        if (req.method === 'HEAD') return res.end();
        const stream = createReadStream(filename, { start, end }); stream.on('error', () => res.destroy()); res.on('close', () => stream.destroy()); return stream.pipe(res);
      }
      if (path === '/api/rooms' && req.method === 'GET') {
        const rooms = all('SELECT r.*, u.name AS creator FROM rooms r JOIN users u ON u.id=r.owner WHERE u.disabled=0 AND u.approved=1 ORDER BY r.created DESC');
        return json(res, 200, { rooms: rooms.filter(r => roomAccess(r, user)).map(r => ({ ...r, live: live.has(r.id) })) });
      }
      if (path === '/api/rooms' && req.method === 'POST') {
        if (!user.approved || !['performer', 'admin'].includes(user.role)) fail(403, 'Approved performer account required');
        const b = await body(req), title = field(b.title, 'title', 80);
        if (typeof b.private !== 'boolean') fail(400, 'Choose public or private');
        if (get('SELECT id FROM rooms WHERE owner=? AND private=?', user.id, Number(b.private))) fail(409, 'You already have a room of this type');
        const id = randomUUID(); run('INSERT INTO rooms VALUES(?,?,?,?,?)', id, user.id, title, Number(b.private), Date.now());
        return json(res, 201, { id });
      }
      const roomMatch = path.match(/^\/api\/rooms\/([^/]+)\/(messages|access|events|signal|broadcast|report)$/);
      if (roomMatch) {
        const [, id, action] = roomMatch, room = requireRoom(id, user);
        if (action === 'messages' && req.method === 'GET') return json(res, 200, { messages: all('SELECT m.id,m.body,m.created,u.name FROM messages m JOIN users u ON u.id=m.user_id WHERE m.room=? ORDER BY m.id DESC LIMIT 100', id).reverse() });
        if (action === 'messages' && req.method === 'POST') {
          rate(req, `chat:${user.id}`, 30);
          const b = await body(req), text = field(b.body, 'message', 1000), now = Date.now();
          const result = run('INSERT INTO messages(room,user_id,body,created) VALUES(?,?,?,?)', id, user.id, text, now);
          const message = { id: Number(result.lastInsertRowid), body: text, name: user.name, created: now };
          broadcast(id, 'message', message); return json(res, 201, message);
        }
        if (action === 'report' && req.method === 'POST') {
          rate(req, `report:${user.id}`, 5);
          const b = await body(req); run('INSERT INTO reports(reporter,room,reason,created) VALUES(?,?,?,?)', user.id, id, field(b.reason, 'reason', 2000), Date.now());
          return json(res, 201, { ok: true });
        }
        if (action === 'access' && ['GET', 'POST', 'DELETE'].includes(req.method)) {
          if (room.owner !== user.id && user.role !== 'admin') fail(403, 'Room owner required');
          if (!room.private) fail(400, 'Only private rooms use invitations');
          if (req.method === 'GET') return json(res, 200, { guests: all('SELECT u.id,u.name FROM grants g JOIN users u ON u.id=g.user_id WHERE g.room=?', id) });
          const b = await body(req), guest = get('SELECT id FROM users WHERE email=? AND disabled=0', field(b.email, 'email', 254).toLowerCase());
          if (!guest) fail(404, 'Registered account not found');
          if (req.method === 'POST') run('INSERT OR IGNORE INTO grants VALUES(?,?)', id, guest.id);
          else { run('DELETE FROM grants WHERE room=? AND user_id=?', id, guest.id); endUserConnections(guest.id, id); }
          return json(res, 200, { ok: true });
        }
        if (action === 'events' && req.method === 'GET') {
          rate(req, 'events', 40);
          if ([...clients.values()].filter(c => c.userId === user.id).length >= 4) fail(429, 'Close another room tab first');
          if (clients.size >= 200) fail(503, 'This small server is at capacity');
          if ([...clients.values()].filter(c => c.room === id).length >= 12) fail(503, 'This small-group room is full');
          res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Connection': 'keep-alive', 'X-Accel-Buffering': 'no' });
          const c = { id: randomUUID(), userId: user.id, room: id, res, session: session.token }; clients.set(c.id, c);
          send(c, 'welcome', { peer: c.id, broadcaster: live.get(id) || null, iceServers });
          const active = clients.get(live.get(id)); if (active) send(active, 'viewer', { peer: c.id });
          req.on('close', () => detach(c)); return;
        }
        if (action === 'broadcast' && req.method === 'POST') {
          if (room.owner !== user.id || !user.approved) fail(403, 'Approved room owner required');
          const b = await body(req), c = clients.get(b.peer);
          if (!c || c.userId !== user.id || c.room !== id || c.session !== session.token) fail(400, 'Connect to the room first');
          if (typeof b.live !== 'boolean') fail(400, 'Invalid broadcast state');
          if (!b.live) {
            if (live.get(id) === c.id) { live.delete(id); broadcast(id, 'broadcast-ended', {}); }
          } else {
            if (live.has(id) && live.get(id) !== c.id) fail(409, 'Another tab is broadcasting');
            live.set(id, c.id);
            broadcast(id, 'broadcast-started', { peer: c.id });
            for (const viewer of clients.values()) if (viewer.room === id && viewer.id !== c.id) send(c, 'viewer', { peer: viewer.id });
          }
          return json(res, 200, { ok: true });
        }
        if (action === 'signal' && req.method === 'POST') {
          const b = await body(req), from = clients.get(b.from), to = clients.get(b.to);
          if (!from || !to || from.userId !== user.id || from.session !== session.token || from.room !== id || to.room !== id) fail(403, 'Invalid peer');
          const active = live.get(id);
          if (!active || (from.id !== active && to.id !== active)) fail(403, 'No active broadcast for these peers');
          if (!['offer', 'answer', 'candidate'].includes(b.type) || !b.data || typeof b.data !== 'object') fail(400, 'Invalid signal');
          if ((b.type === 'offer' && from.id !== active) || (b.type === 'answer' && to.id !== active)) fail(403, 'Invalid signal direction');
          send(to, 'signal', { from: from.id, type: b.type, data: b.data }); return json(res, 200, { ok: true });
        }
        fail(405, 'Method not allowed');
      }
      if (path === '/api/dj' && req.method === 'GET') {
        const state = get('SELECT value FROM settings WHERE key=?', 'dj');
        return json(res, 200, { state: state ? JSON.parse(state.value) : null, serverTime: Date.now() });
      }
      if (path === '/api/dj' && req.method === 'POST') {
        if (!user.approved || !['dj', 'admin'].includes(user.role)) fail(403, 'Approved DJ account required');
        const b = await body(req), title = field(b.title, 'title', 100);
        if (b.rights !== true) fail(400, 'Confirm permission to broadcast this audio');
        const requestedUrl = field(b.url, 'audio URL', 2048);
        let audio; try { audio = new URL(requestedUrl, origin); } catch { fail(400, 'Invalid audio URL'); }
        if (audio.username || audio.password) fail(400, 'Audio URLs cannot contain credentials');
        const localMix = audio.origin === origin && audio.pathname.match(/^\/api\/media\/([0-9a-f-]{36})$/);
        if (localMix) {
          const mix = get('SELECT m.id FROM mixes m JOIN users u ON u.id=m.owner WHERE m.id=? AND m.state=? AND u.disabled=0 AND u.approved=1', localMix[1], 'approved');
          if (!mix) fail(400, 'Choose an approved mix');
        } else if (audio.protocol !== 'https:' || audio.username || audio.password) fail(400, 'Use an approved local mix or direct HTTPS audio URL without credentials');
        const position = Number(b.position || 0);
        if (!Number.isFinite(position) || position < 0 || position > 86400 || typeof b.playing !== 'boolean') fail(400, 'Invalid playback state');
        const state = { title, url: audio.href, position, playing: b.playing, updated: Date.now(), dj: user.name };
        run('INSERT INTO settings VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', 'dj', JSON.stringify(state));
        return json(res, 200, { state });
      }
      if (path.startsWith('/api/admin/')) {
        if (user.role !== 'admin') fail(403, 'Administrator required');
        if (path === '/api/admin/mixes' && req.method === 'GET') return json(res, 200, { mixes: all('SELECT m.*,u.name AS dj FROM mixes m JOIN users u ON u.id=m.owner ORDER BY m.created DESC') });
        if (path === '/api/admin/mixes' && req.method === 'POST') {
          const b = await body(req); if (!['pending', 'approved', 'rejected'].includes(b.state) || typeof b.id !== 'string') fail(400, 'Invalid mix review');
          run('UPDATE mixes SET state=? WHERE id=?', b.state, b.id); return json(res, 200, { ok: true });
        }
        if (path === '/api/admin/users' && req.method === 'GET') return json(res, 200, { users: all('SELECT * FROM users ORDER BY created DESC').map(u => ({ ...safeUser(u), email: u.email })) });
        if (path === '/api/admin/users' && req.method === 'POST') {
          const b = await body(req), target = get('SELECT * FROM users WHERE id=?', b.id);
          if (!target || target.role === 'admin') fail(400, 'Choose a non-admin account');
          if (typeof b.approved !== 'boolean' || typeof b.disabled !== 'boolean') fail(400, 'Invalid account state');
          run('UPDATE users SET approved=?,disabled=? WHERE id=?', Number(b.approved), Number(b.disabled), b.id);
          if (b.disabled || !b.approved) endUserConnections(b.id);
          if (b.disabled) run('DELETE FROM sessions WHERE user_id=?', b.id);
          return json(res, 200, { ok: true });
        }
        if (path === '/api/admin/reports' && req.method === 'GET') return json(res, 200, { reports: all('SELECT id,room,reason,state,created FROM reports ORDER BY id DESC LIMIT 200') });
        if (path === '/api/admin/reports' && req.method === 'POST') {
          const b = await body(req); if (!['open', 'resolved'].includes(b.state) || !Number.isInteger(b.id)) fail(400, 'Invalid report');
          run('UPDATE reports SET state=? WHERE id=?', b.state, b.id); return json(res, 200, { ok: true });
        }
      }
      if (path === '/api/checkout' && req.method === 'POST') fail(503, 'Payments are disabled. No charges can be collected by this app.');
      fail(404, 'Not found');
    } catch (error) {
      if (res.headersSent) return res.end();
      if (!error.status) console.error('Request failed:', error.code || error.name);
      json(res, error.status || 500, { error: error.status ? error.message : 'Internal server error' });
    }
  });
  server.requestTimeout = 20000; server.headersTimeout = 10000;
  const cleanup = setInterval(() => {
    const now = Date.now();
    run('DELETE FROM sessions WHERE expires<?', now);
    for (const [id, r] of rates) if (r.until < now) rates.delete(id);
    for (const c of [...clients.values()]) {
      const session = get('SELECT user_id FROM sessions WHERE token=? AND expires>?', c.session, now);
      const user = session && get('SELECT * FROM users WHERE id=? AND disabled=0', session.user_id);
      const room = get('SELECT * FROM rooms WHERE id=?', c.room);
      const owner = room && get('SELECT approved,disabled FROM users WHERE id=?', room.owner);
      if (!user || !room || !owner.approved || owner.disabled || !roomAccess(room, user)) detach(c);
      else c.res.write(': keepalive\n\n');
    }
  }, 15000); cleanup.unref();
  async function close() {
    clearInterval(cleanup);
    for (const c of [...clients.values()]) detach(c);
    await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
    db.close();
  }
  return { server, db, close };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const app = await createApp();
  const port = Number(process.env.PORT || 3000), host = process.env.HOST || '127.0.0.1';
  app.server.listen(port, host, () => console.log(`NRSgirls running on ${host}:${port}. Use PUBLIC_ORIGIN to access it.`));
  const shutdown = async () => { await app.close(); process.exit(0); };
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
}
