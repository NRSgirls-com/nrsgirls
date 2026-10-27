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
    setInterval() {}, window: { addEventListener() {} }, console,
    RTCPeerConnection: class { close() {} }, location: { origin: 'http://localhost:3000' }, Date, FormData: class {} });
  vm.runInContext(source, context);
  return { element, context, run: code => vm.runInContext(code, context), respond: fn => { fetcher = fn; } };
}

test('guarded click disables its button and rejects overlapping operations', async () => {
  const h = harness(); await Promise.resolve();
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
  const h = harness(); await Promise.resolve();
  h.run('djState = {url:"https://example.test/old.mp3", playing:true};');
  const audio = h.element('audio'); audio.src = 'https://example.test/old.mp3'; audio.paused = false;
  h.respond(async () => ({ state: null, serverTime: Date.now() }));
  await h.run('loadDj()');
  assert.equal(audio.paused, true); assert.equal(audio.src, '');
});

test('a playing listener resumes when the DJ changes tracks', async () => {
  const h = harness(); await Promise.resolve();
  h.run('djState = {url:"https://example.test/old.mp3", playing:true};');
  h.element('audio').paused = false;
  h.respond(async () => ({ state: { url: 'https://example.test/new.mp3', playing: true, position: 0, updated: Date.now(), dj: 'DJ', title: 'New set' }, serverTime: Date.now() }));
  await h.run('loadDj()'); assert.equal(h.element('audio').paused, false);
});

test('stale room media events cannot overwrite the current video', async () => {
  const h = harness(); await Promise.resolve();
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
