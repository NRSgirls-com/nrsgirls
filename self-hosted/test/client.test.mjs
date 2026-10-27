import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
function harness() {
  const elements = new Map();
  function element(id) {
    if (elements.has(id)) return elements.get(id);
    const e = { id, tagName: 'DIV', hidden: false, disabled: false, textContent: '', src: '', srcObject: null, paused: true, duration: NaN, currentTime: 0, plays: 0, handlers: {}, children: [],
      classList: { toggle() {} }, addEventListener(type, fn) { this.handlers[type] = fn; },
      pause() { this.paused = true; }, load() { this.paused = true; }, async play() { this.paused = false; this.plays++; },
      removeAttribute(name) { this[name] = ''; }, replaceChildren(...children) { this.children = children; }, append(...children) { this.children.push(...children); },
      reset() {}, scrollIntoView() {}, querySelector() { return null; }, elements: {}, dataset: {} };
    elements.set(id, e); return e;
  }
  let fetcher = async () => ({ user: null });
  const context = vm.createContext({ document: { getElementById: element, createElement: tag => ({ ...element(`new-${elements.size}`), tagName: tag.toUpperCase() }), createTextNode: text => ({ textContent: text }) },
    fetch: async (...args) => { const data = await fetcher(...args); return { ok: !data.__status || data.__status < 400, status: data.__status || 200, json: async () => data }; },
    setInterval() {}, setTimeout, clearTimeout, AbortController, window: { addEventListener() {} }, console,
    RTCPeerConnection: class { constructor() { this.transceivers = []; } close() {} addTrack() {} addTransceiver(track, options) { this.transceivers.push({ track, ...options }); } }, location: { origin: 'http://localhost:3000' }, Date, FormData: class {} });
  vm.runInContext(source, context);
  return { element, context, run: code => vm.runInContext(code, context), respond: fn => { fetcher = fn; } };
}

test('guarded click disables its button and rejects overlapping operations', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let finish, calls = 0; const operation = new Promise(resolve => { finish = resolve; });
  h.context.operation = async () => { calls++; await operation; };
  const button = h.element('button'); button.tagName = 'BUTTON';
  h.context.event = { currentTarget: button, preventDefault() {} };
  const first = h.run('guarded(operation)(event)');
  assert.equal(button.disabled, true);
  await h.run('guarded(operation)(event)'); assert.equal(calls, 1);
  finish(); await first; assert.equal(button.disabled, false);
});

test('withdrawing a DJ feed stops and clears browser audio', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  h.run('djState = {url:"https://example.test/old.mp3", playing:true};');
  const audio = h.element('audio'); audio.src = 'https://example.test/old.mp3'; audio.paused = false;
  h.respond(async () => ({ state: null, serverTime: Date.now() }));
  await h.run('loadDj()');
  assert.equal(audio.paused, true); assert.equal(audio.src, '');
});

test('a playing listener resumes when the DJ changes tracks', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  h.run('djState = {url:"https://example.test/old.mp3", playing:true};');
  h.element('audio').paused = false;
  h.respond(async () => ({ state: { url: 'https://example.test/new.mp3', playing: true, position: 0, updated: Date.now(), dj: 'DJ', title: 'New set' }, serverTime: Date.now() }));
  await h.run('loadDj()'); assert.equal(h.element('audio').paused, false);
});

test('stale room media events cannot overwrite the current video', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  const pc = h.run('selected={id:"old"}; peerId="old-peer"; makePeer("other-peer")');
  h.run('roomGeneration++; selected={id:"new"}; peerId="new-peer";');
  pc.ontrack({ streams: [{ label: 'old private stream' }] });
  assert.equal(h.element('video').srcObject, null);
});

test('an old account response cannot populate rooms after sign-out', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  h.run('identity={id:"old-user"};');
  let finish; h.respond(() => new Promise(resolve => { finish = resolve; }));
  const loading = h.run('loadRooms()');
  await Promise.resolve();
  h.run('identity=null;');
  finish({ rooms: [{ id: 'private-room', title: 'Previous account private room', creator: 'Previous user' }] });
  await loading;
  assert.equal(h.element('rooms').children.length, 0);
});

test('expired sessions clear the local identity and stop audio', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  h.run('identity={id:"expired-user"};'); h.element('audio').paused = false;
  h.respond(async () => ({ __status: 401, error: 'Sign in required' }));
  await assert.rejects(h.run('api("/api/dj")'), /Sign in required/);
  assert.equal(h.run('identity'), null); assert.equal(h.element('audio').paused, true);
});

test('a late broadcast response cannot change controls in a different room', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  const capture = { getTracks: () => [{ stop() {} }] };
  h.context.navigator = { mediaDevices: { getUserMedia: async () => capture } };
  h.run('identity={id:"creator",approved:true}; selected={id:"first"}; peerId="first-peer";');
  let finish; h.respond(() => new Promise(resolve => { finish = resolve; }));
  const button = h.element('go-live'); button.tagName = 'BUTTON';
  const starting = button.onclick({ currentTarget: button, preventDefault() {} });
  await new Promise(resolve => setImmediate(resolve));
  h.run('leaveRoom(); selected={id:"second"}; peerId="second-peer";');
  button.hidden = false; h.element('connection').textContent = 'Second room';
  finish({ ok: true }); await starting;
  assert.equal(button.hidden, false); assert.equal(h.element('connection').textContent, 'Second room');
});

test('an old unauthorized response cannot sign out a newer account', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  h.run('identity={id:"previous"};');
  let finish; h.respond(() => new Promise(resolve => { finish = resolve; }));
  const loading = h.run('api("/api/rooms")'); await Promise.resolve();
  h.run('applyIdentity({user:{id:"current",name:"Current",role:"viewer",approved:true},csrf:"new-token"});');
  finish({ __status: 401, error: 'Sign in required' });
  await assert.rejects(loading, /Sign in required/);
  assert.equal(h.run('identity.id'), 'current');
});

test('sign-out stops capture immediately before the server responds', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let stopped = 0, finish;
  h.context.capture = { getTracks: () => [{ stop() { stopped++; } }] };
  h.run('identity={id:"creator"}; csrf="token"; media=capture; selected={id:"room"}; peerId="peer";');
  h.respond(() => new Promise(resolve => { finish = resolve; }));
  const operation = h.element('logout').onclick({ preventDefault() {} });
  try {
    assert.equal(stopped, 1, 'camera must stop without waiting for the network');
    assert.equal(h.run('identity'), null);
  } finally { finish({ ok: true }); await operation; }
});

test('Stop broadcast stops capture immediately before the server responds', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let stopped = 0, finish;
  h.context.capture = { getTracks: () => [{ stop() { stopped++; } }] };
  h.run('identity={id:"creator"}; media=capture; selected={id:"room"}; peerId="peer"; broadcaster=peerId;');
  h.respond(() => new Promise(resolve => { finish = resolve; }));
  const operation = h.element('stop-live').onclick({ preventDefault() {} });
  try { assert.equal(stopped, 1, 'camera must stop without waiting for the network'); }
  finally { finish({ ok: true }); await operation; }
});

test('network requests time out and release the operation', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let timeout;
  h.context.setTimeout = callback => { timeout = callback; return 1; };
  h.context.clearTimeout = () => {};
  h.respond((path, options) => new Promise((resolve, reject) => {
    assert.ok(options.signal, 'requests need an abort signal');
    options.signal.addEventListener('abort', () => reject(new Error('aborted')));
  }));
  const request = h.run('api("/api/rooms")');
  const rejected = assert.rejects(request, /timed out/);
  if (timeout) timeout();
  await rejected;
});

test('the broadcaster sends media only and ignores viewer tracks', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  const capture = { getTracks: () => [{ kind: 'video' }, { kind: 'audio' }] };
  h.context.capture = capture;
  h.run('identity={id:"creator"}; media=capture; selected={id:"room"}; peerId="owner-peer"; broadcaster=peerId;');
  h.element('video').srcObject = capture;
  const pc = h.run('makePeer("viewer-peer")');
  assert.equal(pc.transceivers.length, 2);
  assert.ok(pc.transceivers.every(t => t.direction === 'sendonly'));
  pc.ontrack({ streams: [{ label: 'unsolicited viewer camera' }] });
  assert.equal(h.element('video').srcObject, capture);
});

test('a rejected room entry closes the unconnected room panel', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  h.run('identity={id:"viewer",approved:true};');
  h.respond(async () => ({ __status: 404, error: 'Room unavailable' }));
  await assert.rejects(h.run('enterRoom({id:"revoked",title:"Old private room",owner:"other",private:true})'), /Room unavailable/);
  assert.equal(h.element('room').hidden, true);
  assert.equal(h.run('selected'), null);
});

test('a failed broadcast stop closes signaling instead of leaving a false live session', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let closed = 0;
  h.context.roomEvents = { close() { closed++; } };
  h.run('identity={id:"creator"}; selected={id:"room"}; peerId="peer"; broadcaster=peerId; events=roomEvents;');
  h.respond(async () => ({ __status: 503, error: 'Server unavailable' }));
  await h.element('stop-live').onclick({ preventDefault() {} });
  assert.equal(closed, 1); assert.equal(h.run('peerId'), null);
});

test('live presence is renewed only by a locally active broadcaster', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  const calls = [];
  h.respond(async (path, options) => { calls.push({ path, options }); return { ok: true }; });
  await h.run('renewPresence()'); assert.equal(calls.length, 0);
  h.context.capture = { getTracks: () => [{ kind: 'video', readyState: 'live' }] };
  h.run('identity={id:"creator"}; selected={id:"room"}; peerId="owner"; broadcaster=peerId; media=capture;');
  await h.run('renewPresence()');
  assert.equal(calls[0].path, '/api/rooms/room/heartbeat');
  assert.equal(JSON.parse(calls[0].options.body).peer, 'owner');
});

test('loss of live presence confirmation stops capture and disconnects the room', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let stopped = 0, closed = 0;
  h.context.capture = { getTracks: () => [{ kind: 'video', readyState: 'live', stop() { stopped++; } }] };
  h.context.roomEvents = { close() { closed++; } };
  h.run('identity={id:"creator"}; selected={id:"room"}; peerId="owner"; broadcaster=peerId; media=capture; events=roomEvents;');
  h.respond(async () => ({ __status: 409, error: 'Broadcast expired' }));
  await h.run('renewPresence()');
  assert.equal(stopped, 1); assert.equal(closed, 1); assert.equal(h.run('peerId'), null);
});

test('camera hardware ending also stops microphone capture', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let videoEnded, microphoneStopped = false;
  const video = { kind: 'video', readyState: 'live', addEventListener(type, fn) { if (type === 'ended') videoEnded = fn; }, stop() { this.readyState = 'ended'; } };
  const microphone = { kind: 'audio', stop() { microphoneStopped = true; } };
  h.context.navigator = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [video, microphone] }) } };
  h.run('identity={id:"creator",approved:true}; selected={id:"room"}; peerId="peer";');
  h.respond(async () => ({ ok: true }));
  await h.element('go-live').onclick({ preventDefault() {} });
  assert.equal(typeof videoEnded, 'function');
  video.readyState = 'ended'; videoEnded();
  assert.equal(microphoneStopped, true);
  await new Promise(resolve => setImmediate(resolve));
});

test('camera ending during broadcast startup cannot produce a false live confirmation', async () => {
  const h = harness(); await new Promise(resolve => setImmediate(resolve));
  let videoEnded, confirmStart;
  const video = { kind: 'video', readyState: 'live', addEventListener(type, fn) { if (type === 'ended') videoEnded = fn; }, stop() { this.readyState = 'ended'; } };
  h.context.navigator = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [video] }) } };
  h.run('identity={id:"creator",approved:true}; selected={id:"room"}; peerId="peer";');
  h.respond(async (path, options) => JSON.parse(options.body).live === true ? new Promise(resolve => { confirmStart = resolve; }) : { ok: true });
  const starting = h.element('go-live').onclick({ preventDefault() {} });
  await new Promise(resolve => setImmediate(resolve));
  video.readyState = 'ended'; videoEnded();
  await new Promise(resolve => setImmediate(resolve));
  confirmStart({ ok: true }); await starting;
  assert.equal(h.run('media'), null);
  assert.equal(h.element('go-live').hidden, false);
  assert.equal(h.element('connection').textContent, 'Broadcast ended.');
});
