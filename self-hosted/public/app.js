'use strict';
const $ = id => document.getElementById(id);
let identity = null, csrf = '', selected = null, events = null, peerId = null, media = null, broadcaster = null;
let iceServers = [], peers = new Map(), pending = new Map(), djState = null, offset = 0, roomGeneration = 0;
let radioEnabled = false, radioTransition = false, djGeneration = 0, accountGeneration = 0;
const notice = (text, error = false) => { $('status').textContent = text; $('status').classList.toggle('error', error); };
async function request(path, options) {
  const generation = accountGeneration, account = identity?.id;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(path, { ...options, signal: controller.signal });
    let result;
    try { result = await response.json(); }
    catch { if (controller.signal.aborted) throw new Error('Request timed out. Try again when connected.'); throw new Error('The server returned an invalid response. Try again when connected.'); }
    if (!response.ok) {
      if (response.status === 401 && generation === accountGeneration && account === identity?.id && !['/api/login', '/api/register'].includes(path)) applyIdentity({ user: null });
      throw new Error(result.error || 'Request failed');
    }
    return result;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Request timed out. Try again when connected.');
    throw error;
  } finally { clearTimeout(timeout); }
}
async function api(path, method = 'GET', data) {
  return request(path, { method, headers: method === 'GET' ? {} : { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: data === undefined ? undefined : JSON.stringify(data) });
}
const guarded = fn => async event => {
  event?.preventDefault();
  const button = event?.submitter || (event?.currentTarget?.tagName === 'BUTTON' ? event.currentTarget : null);
  if (button?.disabled) return;
  if (button) button.disabled = true;
  try { await fn(event); } catch (e) { notice(e.message, true); }
  finally { if (button) button.disabled = false; }
};
const fields = form => Object.fromEntries(new FormData(form));
function node(tag, text, className) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; }
function action(label, fn) { const b = node('button', label); b.addEventListener('click', guarded(fn)); return b; }
function applyIdentity(result) {
  if (identity?.id !== result.user?.id) {
    ++accountGeneration; ++djGeneration; leaveRoom();
    radioEnabled = false; djState = null; $('audio').pause(); $('audio').removeAttribute('src'); $('audio').load();
    for (const id of ['rooms', 'messages', 'guests', 'mixes', 'users', 'reports', 'mix-reviews']) $(id).replaceChildren();
    $('track').textContent = 'No DJ feed selected';
  }
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
$('logout').onclick = guarded(async () => {
  const ending = api('/api/logout', 'POST', {});
  // Local privacy controls must work even if the network never responds.
  leaveRoom(); applyIdentity({ user: null });
  notice('Camera stopped. Confirming server sign-out…');
  try { await ending; notice('Signed out.'); }
  catch { notice('Camera stopped and local view cleared. Server sign-out could not be confirmed. Reconnect, reload, and sign out again.', true); }
});
async function refresh() {
  const generation = accountGeneration, account = identity?.id, result = await api('/api/me');
  if (generation !== accountGeneration || identity?.id !== account) return;
  applyIdentity(result); if (!identity) { notice('Sign in required.', true); return; }
  await loadRooms(); await loadDj(); await loadMixes(); if (identity?.role === 'admin') await loadAdmin();
}
async function loadRooms() {
  const generation = accountGeneration, account = identity?.id, result = await api('/api/rooms');
  if (generation !== accountGeneration || identity?.id !== account) return;
  $('rooms').replaceChildren();
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
function disconnectRoom(message) {
  events?.close(); events = null; stopMedia(); peerId = null; broadcaster = null;
  $('connection').textContent = message;
}
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
  if (!identity) throw new Error('Sign in required');
  leaveRoom(); selected = room; const generation = roomGeneration;
  $('room').hidden = false; $('room-title').textContent = room.title; $('messages').replaceChildren(); $('connection').textContent = 'Connecting…';
  $('go-live').hidden = !(room.owner === identity.id && identity.approved);
  $('owner-tools').hidden = !(room.private && (room.owner === identity.id || identity.role === 'admin'));
  let messages;
  try { messages = await api(`/api/rooms/${room.id}/messages`); }
  catch (error) { if (generation === roomGeneration) leaveRoom(); throw error; }
  if (generation !== roomGeneration) return;
  messages.messages.forEach(showMessage);
  const stream = new EventSource(`/api/rooms/${room.id}/events`); events = stream;
  function event(type, fn) { stream.addEventListener(type, e => { if (generation !== roomGeneration) return; Promise.resolve().then(() => { if (generation === roomGeneration) return fn(JSON.parse(e.data)); }).catch(e => { if (generation === roomGeneration) notice(e.message, true); }); }); }
  event('welcome', data => { peerId = data.peer; iceServers = data.iceServers; broadcaster = data.broadcaster; $('connection').textContent = broadcaster ? 'Broadcast available. Connecting video…' : 'Room connected. Camera offline.'; });
  event('message', showMessage);
  event('viewer', async data => { if (media && broadcaster === peerId) await offer(data.peer); });
  event('broadcast-started', data => { broadcaster = data.peer; $('connection').textContent = 'Broadcast starting…'; });
  event('broadcast-ended', () => { broadcaster = null; clearPeers(); if (!media) $('video').srcObject = null; $('connection').textContent = 'Broadcast ended.'; });
  event('peer-left', data => { peers.get(data.peer)?.close(); peers.delete(data.peer); pending.delete(data.peer); });
  event('signal', receiveSignal);
  stream.onerror = () => { if (generation !== roomGeneration) return; disconnectRoom('Room disconnected. Re-enter the room to reconnect; access may have changed.'); };
  if (!$('owner-tools').hidden) await loadGuests();
  if (generation === roomGeneration) $('room').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function loadGuests() {
  const room = selected?.id, generation = roomGeneration;
  if (!room) return;
  const result = await api(`/api/rooms/${room}/access`);
  if (generation === roomGeneration && selected?.id === room) $('guests').replaceChildren(...result.guests.map(g => node('li', g.name)));
}
$('invite').addEventListener('submit', guarded(async e => { await api(`/api/rooms/${selected.id}/access`, e.submitter.value === 'revoke' ? 'DELETE' : 'POST', fields($('invite'))); await loadGuests(); notice('Guest access updated.'); }));
$('chat').addEventListener('submit', guarded(async () => { const room = selected; const message = await api(`/api/rooms/${room.id}/messages`, 'POST', fields($('chat'))); if (selected?.id === room.id) { showMessage(message); $('chat').reset(); } }));
$('report-room').onclick = guarded(async () => { const reason = window.prompt('Describe the concern. Do not include sensitive identity documents.'); if (!reason) return; await api(`/api/rooms/${selected.id}/report`, 'POST', { reason }); notice('Report submitted for administrator review.'); });
const roomContext = () => ({ generation: roomGeneration, room: selected?.id, peer: peerId });
const currentRoom = context => context.generation === roomGeneration && context.room === selected?.id && context.peer === peerId;
async function signal(to, type, data, context = roomContext()) {
  if (!context.room || !context.peer || !currentRoom(context)) return;
  return api(`/api/rooms/${context.room}/signal`, 'POST', { from: context.peer, to, type, data });
}
function makePeer(id) {
  if (peers.has(id)) return peers.get(id);
  const context = roomContext();
  const pc = new RTCPeerConnection({ iceServers }); peers.set(id, pc);
  pc.onicecandidate = e => { if (e.candidate && currentRoom(context)) signal(id, 'candidate', e.candidate.toJSON(), context).catch(e => { if (currentRoom(context)) notice(e.message, true); }); };
  pc.ontrack = e => { if (!currentRoom(context) || media || context.peer === broadcaster) return; $('video').muted = false; $('video').srcObject = e.streams[0]; $('connection').textContent = 'Video connected. Use the player to enable sound if your browser blocks autoplay.'; };
  pc.onconnectionstatechange = () => { if (currentRoom(context) && ['failed', 'disconnected'].includes(pc.connectionState)) $('connection').textContent = 'Video connection interrupted. A configured TURN relay may be needed on this network.'; };
  if (media) media.getTracks().forEach(track => pc.addTransceiver(track, { direction: 'sendonly', streams: [media] }));
  return pc;
}
async function offer(id) {
  if (peers.has(id)) return;
  const context = roomContext(), pc = makePeer(id), description = await pc.createOffer();
  if (!currentRoom(context)) return;
  await pc.setLocalDescription(description);
  if (currentRoom(context)) await signal(id, 'offer', pc.localDescription.toJSON(), context);
}
async function receiveSignal(data) {
  const context = roomContext(), pc = makePeer(data.from);
  if (data.type === 'candidate') {
    if (pc.remoteDescription) await pc.addIceCandidate(data.data);
    else { const queue = pending.get(data.from) || []; if (queue.length < 100) queue.push(data.data); pending.set(data.from, queue); }
  } else {
    await pc.setRemoteDescription(data.data);
    if (!currentRoom(context)) return;
    for (const candidate of pending.get(data.from) || []) await pc.addIceCandidate(candidate);
    if (!currentRoom(context)) return;
    pending.delete(data.from);
    if (data.type === 'offer') {
      const answer = await pc.createAnswer(); if (!currentRoom(context)) return;
      await pc.setLocalDescription(answer);
      if (currentRoom(context)) await signal(data.from, 'answer', pc.localDescription.toJSON(), context);
    }
  }
}
$('go-live').onclick = guarded(async () => {
  if (!peerId) throw new Error('Wait for the room connection');
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera requires localhost or HTTPS and a supported browser');
  const generation = roomGeneration, context = roomContext();
  const capture = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  if (generation !== roomGeneration) { capture.getTracks().forEach(t => t.stop()); return; }
  media = capture; clearPeers(); $('video').muted = true; $('video').srcObject = media;
  // Set locally before the request: viewer notifications may arrive before the HTTP response.
  broadcaster = peerId;
  try { await api(`/api/rooms/${selected.id}/broadcast`, 'POST', { peer: peerId, live: true }); }
  catch (e) { if (currentRoom(context)) { disconnectRoom('Camera stopped. Re-enter the room before broadcasting again.'); throw e; } return; }
  if (!currentRoom(context)) return;
  $('go-live').hidden = true; $('stop-live').hidden = false; $('connection').textContent = 'You are broadcasting. Keep this tab open.';
});
$('stop-live').onclick = guarded(async () => {
  const context = roomContext();
  const ending = api(`/api/rooms/${context.room}/broadcast`, 'POST', { peer: context.peer, live: false });
  stopMedia(); broadcaster = null;
  $('connection').textContent = 'Camera stopped locally. Confirming broadcast end…';
  try { await ending; if (currentRoom(context)) $('connection').textContent = 'Broadcast ended.'; }
  catch (error) { if (currentRoom(context)) disconnectRoom('Camera stopped. Re-enter the room to reconnect after the server error.'); throw error; }
  finally { if (currentRoom(context)) $('go-live').hidden = false; }
});
async function loadDj() {
  const generation = ++djGeneration, account = identity?.id;
  const start = Date.now(), result = await api('/api/dj');
  if (generation !== djGeneration || identity?.id !== account) return;
  offset = result.serverTime - (start + Date.now()) / 2;
  const previous = djState; djState = result.state;
  const audio = $('audio');
  if (!djState) {
    radioEnabled = false; audio.pause(); audio.removeAttribute('src'); audio.load();
    $('track').textContent = 'No DJ feed selected'; $('dj-name').textContent = 'The shared feed is unavailable.'; return;
  }
  $('track').textContent = djState.title; $('dj-name').textContent = `Selected by ${djState.dj}. Browser playback permission required.`;
  const resume = !audio.paused || (radioEnabled && previous && !previous.playing);
  radioTransition = true;
  try {
    if (previous?.url !== djState.url) { audio.src = djState.url; audio.load(); }
    if (!djState.playing) audio.pause();
    else if (resume && syncPosition()) {
      try { await audio.play(); } catch { notice('Select Play / resync to enable the new DJ track.'); }
    }
  } finally { radioTransition = false; }
}
function syncPosition() {
  if (!djState) return false;
  const audio = $('audio');
  const target = djState.position + (djState.playing ? Math.max(0, Date.now() + offset - djState.updated) / 1000 : 0);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    if (target >= audio.duration) { audio.pause(); $('dj-name').textContent = 'The selected recording has ended.'; return false; }
    if (Math.abs(audio.currentTime - target) > 1.5) audio.currentTime = target;
  }
  return true;
}
$('audio').addEventListener('loadedmetadata', syncPosition);
$('audio').addEventListener('play', () => { radioEnabled = true; });
$('audio').addEventListener('pause', () => { if (!radioTransition && djState?.playing) radioEnabled = false; });
$('audio').addEventListener('error', () => notice('The selected DJ URL could not be played. The DJ must supply a reachable direct audio URL.', true));
$('sync-audio').onclick = guarded(async () => { await loadDj(); if (!djState) throw new Error('No DJ feed selected'); if (!djState.playing) throw new Error('The DJ has paused the shared feed'); if (syncPosition()) { await $('audio').play(); radioEnabled = true; } });
$('dj-form').addEventListener('submit', guarded(async () => { const b = fields($('dj-form')); b.position = Number(b.position); b.playing = $('dj-form').elements.playing.checked; b.rights = $('dj-form').elements.rights.checked; await api('/api/dj', 'POST', b); await loadDj(); notice('Shared feed updated.'); }));
async function loadMixes() {
  if ($('dj-panel').hidden) return;
  const generation = accountGeneration, account = identity?.id, result = await api('/api/mixes');
  if (generation !== accountGeneration || identity?.id !== account) return;
  $('mixes').replaceChildren();
  for (const mix of result.mixes) {
    const row = node('div', undefined, 'review'); row.append(node('p', `${mix.title} · ${mix.dj} · ${mix.state}`));
    if (mix.state === 'approved') row.append(action('Select for DJ feed', () => { $('dj-form').elements.title.value = mix.title; $('dj-form').elements.url.value = `${location.origin}/api/media/${mix.id}`; notice('Mix selected. Confirm rights and update the shared feed.'); }));
    $('mixes').append(row);
  }
}
$('upload-form').addEventListener('submit', guarded(async () => {
  const form = $('upload-form'), file = form.elements.file.files[0];
  if (!file || file.size > 20 * 1024 * 1024) throw new Error('Choose an MP3 no larger than 20 MB');
  await request('/api/mixes', { method: 'POST', headers: { 'Content-Type': 'audio/mpeg', 'X-CSRF-Token': csrf, 'X-Track-Title': encodeURIComponent(form.elements.title.value), 'X-Rights-Confirmed': String(form.elements.rights.checked) }, body: file });
  form.reset(); await loadMixes(); notice('Mix uploaded and waiting for administrator review.');
}));
async function loadAdmin() {
  const generation = accountGeneration, account = identity?.id;
  const [u, r, mixes] = await Promise.all([api('/api/admin/users'), api('/api/admin/reports'), api('/api/admin/mixes')]);
  if (generation !== accountGeneration || identity?.id !== account) return;
  $('users').replaceChildren(); $('reports').replaceChildren();
  for (const user of u.users) {
    const card = node('div', undefined, 'review'); card.append(node('strong', user.name), node('p', user.email, 'muted'), node('p', `${user.role} · ${user.disabled ? 'suspended' : user.approved ? 'approved' : 'pending'}`));
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
window.addEventListener('pagehide', leaveRoom);
window.addEventListener('pageshow', event => { if (event.persisted && identity) refresh().catch(e => notice(e.message, true)); });
setInterval(() => { if (identity) loadDj().catch(() => {}); }, 5000);
api('/api/me').then(async result => { applyIdentity(result); if (identity) await refresh(); }).catch(e => notice(e.message, true));
