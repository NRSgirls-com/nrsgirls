'use strict';
const $ = id => document.getElementById(id);
let identity = null, csrf = '', selected = null, events = null, peerId = null, media = null, broadcaster = null;
let iceServers = [], peers = new Map(), pending = new Map(), djState = null, offset = 0, roomGeneration = 0;
const notice = (text, error = false) => { $('status').textContent = text; $('status').classList.toggle('error', error); };
async function api(path, method = 'GET', data) {
  const response = await fetch(path, { method, headers: method === 'GET' ? {} : { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: data === undefined ? undefined : JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed');
  return result;
}
const guarded = fn => async event => {
  event?.preventDefault();
  const button = event?.submitter;
  if (button) button.disabled = true;
  try { await fn(event); } catch (e) { notice(e.message, true); }
  finally { if (button) button.disabled = false; }
};
const fields = form => Object.fromEntries(new FormData(form));
function node(tag, text, className) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; }
function action(label, fn) { const b = node('button', label); b.addEventListener('click', guarded(fn)); return b; }
function applyIdentity(result) {
  identity = result.user; csrf = result.csrf || '';
  $('auth').hidden = !!identity; $('workspace').hidden = !identity; $('logout').hidden = !identity;
  $('identity').textContent = identity ? `${identity.name} · ${identity.role}` : 'Local edition';
  $('approval').hidden = !identity || identity.approved;
  $('dj-panel').hidden = !identity?.approved || !['admin', 'dj'].includes(identity?.role);
  $('create-panel').hidden = !identity?.approved || !['admin', 'performer'].includes(identity?.role);
  $('admin-panel').hidden = identity?.role !== 'admin';
}
$('login').addEventListener('submit', guarded(async () => { applyIdentity(await api('/api/login', 'POST', fields($('login')))); $('login').reset(); notice('Signed in.'); await refresh(); }));
$('register').addEventListener('submit', guarded(async () => {
  const b = fields($('register')); b.adult = $('register').elements.adult.checked; b.terms = $('register').elements.terms.checked;
  applyIdentity(await api('/api/register', 'POST', b)); $('register').reset(); notice('Account created.'); await refresh();
}));
$('logout').onclick = guarded(async () => { await api('/api/logout', 'POST', {}); leaveRoom(); applyIdentity({ user: null }); $('audio').pause(); $('audio').removeAttribute('src'); djState = null; notice('Signed out.'); });
async function refresh() { await loadRooms(); await loadDj(); await loadMixes(); if (identity.role === 'admin') await loadAdmin(); }
async function loadRooms() {
  const result = await api('/api/rooms'); $('rooms').replaceChildren();
  if (!result.rooms.length) $('rooms').append(node('p', 'No accessible rooms yet. Approved performers can create their rooms above.', 'muted'));
  for (const room of result.rooms) {
    const card = node('article', undefined, 'card room-card');
    card.append(node('p', `${room.live ? 'LIVE' : 'OFFLINE'} · ${room.private ? 'INVITATION ONLY' : 'PUBLIC'}`, 'badge'), node('h3', room.title), node('p', `By ${room.creator}`, 'muted'), action('Enter room', () => enterRoom(room)));
    $('rooms').append(card);
  }
}
$('refresh').onclick = guarded(refresh);
$('create-room').addEventListener('submit', guarded(async () => {
  const b = fields($('create-room')); await api('/api/rooms', 'POST', { title: b.title, private: b.access === 'private' }); $('create-room').reset(); await loadRooms(); notice('Room created.');
}));
function clearPeers() { for (const pc of peers.values()) pc.close(); peers.clear(); pending.clear(); }
function stopMedia() { if (media) for (const track of media.getTracks()) track.stop(); media = null; clearPeers(); $('video').srcObject = null; $('stop-live').hidden = true; }
function leaveRoom() {
  ++roomGeneration;
  events?.close(); events = null; stopMedia(); selected = null; peerId = null; broadcaster = null; $('room').hidden = true;
}
$('leave-room').onclick = leaveRoom;
function showMessage(message) {
  if ($('messages').querySelector(`[data-id="${Number(message.id)}"]`)) return;
  const li = node('li'); li.dataset.id = Number(message.id); li.append(node('strong', message.name), document.createTextNode(message.body));
  $('messages').append(li); while ($('messages').children.length > 100) $('messages').firstChild.remove(); $('messages').scrollTop = $('messages').scrollHeight;
}
async function enterRoom(room) {
  leaveRoom(); selected = room; const generation = roomGeneration;
  $('room').hidden = false; $('room-title').textContent = room.title; $('messages').replaceChildren(); $('connection').textContent = 'Connecting…';
  $('go-live').hidden = !(room.owner === identity.id && identity.approved);
  $('owner-tools').hidden = !(room.private && (room.owner === identity.id || identity.role === 'admin'));
  const messages = await api(`/api/rooms/${room.id}/messages`); if (generation !== roomGeneration) return;
  messages.messages.forEach(showMessage);
  const stream = new EventSource(`/api/rooms/${room.id}/events`); events = stream;
  function event(type, fn) { stream.addEventListener(type, e => { if (generation !== roomGeneration) return; Promise.resolve().then(() => fn(JSON.parse(e.data))).catch(e => notice(e.message, true)); }); }
  event('welcome', data => { peerId = data.peer; iceServers = data.iceServers; broadcaster = data.broadcaster; $('connection').textContent = broadcaster ? 'Broadcast available. Connecting video…' : 'Room connected. Camera offline.'; });
  event('message', showMessage);
  event('viewer', async data => { if (media && broadcaster === peerId) await offer(data.peer); });
  event('broadcast-started', data => { broadcaster = data.peer; $('connection').textContent = 'Broadcast starting…'; });
  event('broadcast-ended', () => { broadcaster = null; clearPeers(); if (!media) $('video').srcObject = null; $('connection').textContent = 'Broadcast ended.'; });
  event('peer-left', data => { peers.get(data.peer)?.close(); peers.delete(data.peer); pending.delete(data.peer); });
  event('signal', receiveSignal);
  stream.onerror = () => { stream.close(); stopMedia(); peerId = null; $('connection').textContent = 'Room disconnected. Re-enter the room to reconnect; access may have changed.'; };
  if (!$('owner-tools').hidden) await loadGuests();
  $('room').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function loadGuests() {
  const result = await api(`/api/rooms/${selected.id}/access`); $('guests').replaceChildren(...result.guests.map(g => node('li', g.name)));
}
$('invite').addEventListener('submit', guarded(async e => { await api(`/api/rooms/${selected.id}/access`, e.submitter.value === 'revoke' ? 'DELETE' : 'POST', fields($('invite'))); await loadGuests(); notice('Guest access updated.'); }));
$('chat').addEventListener('submit', guarded(async () => { const room = selected; const message = await api(`/api/rooms/${room.id}/messages`, 'POST', fields($('chat'))); if (selected?.id === room.id) { showMessage(message); $('chat').reset(); } }));
$('report-room').onclick = guarded(async () => { const reason = window.prompt('Describe the concern. Do not include sensitive identity documents.'); if (!reason) return; await api(`/api/rooms/${selected.id}/report`, 'POST', { reason }); notice('Report submitted for administrator review.'); });
async function signal(to, type, data) { if (!selected || !peerId) throw new Error('Room disconnected'); return api(`/api/rooms/${selected.id}/signal`, 'POST', { from: peerId, to, type, data }); }
function makePeer(id) {
  if (peers.has(id)) return peers.get(id);
  const pc = new RTCPeerConnection({ iceServers }); peers.set(id, pc);
  pc.onicecandidate = e => { if (e.candidate) signal(id, 'candidate', e.candidate.toJSON()).catch(e => notice(e.message, true)); };
  pc.ontrack = e => { $('video').muted = false; $('video').srcObject = e.streams[0]; $('connection').textContent = 'Video connected. Use the player to enable sound if your browser blocks autoplay.'; };
  pc.onconnectionstatechange = () => { if (['failed', 'disconnected'].includes(pc.connectionState)) $('connection').textContent = 'Video connection interrupted. A configured TURN relay may be needed on this network.'; };
  if (media) media.getTracks().forEach(track => pc.addTrack(track, media));
  return pc;
}
async function offer(id) {
  if (peers.has(id)) return;
  const pc = makePeer(id); await pc.setLocalDescription(await pc.createOffer()); await signal(id, 'offer', pc.localDescription.toJSON());
}
async function receiveSignal(data) {
  const pc = makePeer(data.from);
  if (data.type === 'candidate') {
    if (pc.remoteDescription) await pc.addIceCandidate(data.data);
    else { const queue = pending.get(data.from) || []; if (queue.length < 100) queue.push(data.data); pending.set(data.from, queue); }
  } else {
    await pc.setRemoteDescription(data.data);
    for (const candidate of pending.get(data.from) || []) await pc.addIceCandidate(candidate);
    pending.delete(data.from);
    if (data.type === 'offer') { await pc.setLocalDescription(await pc.createAnswer()); await signal(data.from, 'answer', pc.localDescription.toJSON()); }
  }
}
$('go-live').onclick = guarded(async () => {
  if (!peerId) throw new Error('Wait for the room connection');
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera requires localhost or HTTPS and a supported browser');
  const generation = roomGeneration;
  const capture = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  if (generation !== roomGeneration) { capture.getTracks().forEach(t => t.stop()); return; }
  media = capture; clearPeers(); $('video').muted = true; $('video').srcObject = media;
  // Set locally before the request: viewer notifications may arrive before the HTTP response.
  broadcaster = peerId;
  try { await api(`/api/rooms/${selected.id}/broadcast`, 'POST', { peer: peerId, live: true }); }
  catch (e) { stopMedia(); broadcaster = null; throw e; }
  $('go-live').hidden = true; $('stop-live').hidden = false; $('connection').textContent = 'You are broadcasting. Keep this tab open.';
});
$('stop-live').onclick = guarded(async () => {
  try { await api(`/api/rooms/${selected.id}/broadcast`, 'POST', { peer: peerId, live: false }); }
  finally { stopMedia(); broadcaster = null; $('go-live').hidden = false; }
});
async function loadDj() {
  const start = Date.now(), result = await api('/api/dj'); offset = result.serverTime - (start + Date.now()) / 2;
  const previous = djState; djState = result.state;
  if (!djState) return;
  $('track').textContent = djState.title; $('dj-name').textContent = `Selected by ${djState.dj}. Browser playback permission required.`;
  if (previous?.url !== djState.url) { $('audio').src = djState.url; $('audio').load(); }
  if (!djState.playing) $('audio').pause();
  else if (!$('audio').paused) syncPosition();
}
function syncPosition() {
  if (!djState) return;
  const audio = $('audio');
  const target = djState.position + (djState.playing ? Math.max(0, Date.now() + offset - djState.updated) / 1000 : 0);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    if (target >= audio.duration) { audio.pause(); $('dj-name').textContent = 'The selected recording has ended.'; return; }
    if (Math.abs(audio.currentTime - target) > 1.5) audio.currentTime = target;
  }
}
$('audio').addEventListener('loadedmetadata', syncPosition);
$('audio').addEventListener('error', () => notice('The selected DJ URL could not be played. The DJ must supply a reachable direct audio URL.', true));
$('sync-audio').onclick = guarded(async () => { await loadDj(); if (!djState) throw new Error('No DJ feed selected'); if (!djState.playing) throw new Error('The DJ has paused the shared feed'); syncPosition(); await $('audio').play(); });
$('dj-form').addEventListener('submit', guarded(async () => { const b = fields($('dj-form')); b.position = Number(b.position); b.playing = $('dj-form').elements.playing.checked; b.rights = $('dj-form').elements.rights.checked; await api('/api/dj', 'POST', b); await loadDj(); notice('Shared feed updated.'); }));
async function loadMixes() {
  if ($('dj-panel').hidden) return;
  const result = await api('/api/mixes'); $('mixes').replaceChildren();
  for (const mix of result.mixes) {
    const row = node('div', undefined, 'review'); row.append(node('p', `${mix.title} · ${mix.dj} · ${mix.state}`));
    if (mix.state === 'approved') row.append(action('Select for DJ feed', () => { $('dj-form').elements.title.value = mix.title; $('dj-form').elements.url.value = `${location.origin}/api/media/${mix.id}`; notice('Mix selected. Confirm rights and update the shared feed.'); }));
    $('mixes').append(row);
  }
}
$('upload-form').addEventListener('submit', guarded(async () => {
  const form = $('upload-form'), file = form.elements.file.files[0];
  if (!file || file.size > 20 * 1024 * 1024) throw new Error('Choose an MP3 no larger than 20 MB');
  const response = await fetch('/api/mixes', { method: 'POST', headers: { 'Content-Type': 'audio/mpeg', 'X-CSRF-Token': csrf, 'X-Track-Title': encodeURIComponent(form.elements.title.value), 'X-Rights-Confirmed': String(form.elements.rights.checked) }, body: file });
  const result = await response.json(); if (!response.ok) throw new Error(result.error);
  form.reset(); await loadMixes(); notice('Mix uploaded and waiting for administrator review.');
}));
async function loadAdmin() {
  const [u, r, mixes] = await Promise.all([api('/api/admin/users'), api('/api/admin/reports'), api('/api/admin/mixes')]);
  $('users').replaceChildren(); $('reports').replaceChildren();
  for (const user of u.users) {
    const card = node('div', undefined, 'review'); card.append(node('strong', user.name), node('p', `${user.role} · ${user.disabled ? 'suspended' : user.approved ? 'approved' : 'pending'}`));
    if (user.role !== 'admin') {
      const update = async (approved, disabled) => { await api('/api/admin/users', 'POST', { id: user.id, approved, disabled }); await loadAdmin(); await loadRooms(); };
      card.append(action(user.approved ? 'Withdraw approval' : 'Approve after review', () => update(!user.approved, user.disabled)), action(user.disabled ? 'Restore account' : 'Suspend account', () => update(user.approved, !user.disabled)));
    }
    $('users').append(card);
  }
  if (!r.reports.length) $('reports').append(node('p', 'No reports.'));
  for (const report of r.reports) {
    const card = node('div', undefined, 'review'); card.append(node('strong', `Report ${report.id} · ${report.state}`), node('p', report.reason), node('p', `Room: ${report.room}`, 'muted'));
    card.append(action(report.state === 'open' ? 'Resolve' : 'Reopen', async () => { await api('/api/admin/reports', 'POST', { id: report.id, state: report.state === 'open' ? 'resolved' : 'open' }); await loadAdmin(); })); $('reports').append(card);
  }
  $('mix-reviews').replaceChildren();
  for (const mix of mixes.mixes) {
    const card = node('div', undefined, 'review'); card.append(node('strong', mix.title), node('p', `${mix.dj} · ${mix.state}`));
    if (mix.state !== 'rejected') { const audio = node('audio'); audio.controls = true; audio.preload = 'none'; audio.src = `/api/media/${mix.id}`; card.append(audio); }
    const review = async state => { await api('/api/admin/mixes', 'POST', { id: mix.id, state }); await loadAdmin(); await loadMixes(); };
    card.append(action('Approve after review', () => review('approved')), action('Reject / withdraw', () => review('rejected'))); $('mix-reviews').append(card);
  }
}
$('admin-refresh').onclick = guarded(loadAdmin);
window.addEventListener('pagehide', () => { events?.close(); stopMedia(); });
setInterval(() => { if (identity) loadDj().catch(() => {}); }, 5000);
api('/api/me').then(async result => { applyIdentity(result); if (identity) await refresh(); }).catch(e => notice(e.message, true));
