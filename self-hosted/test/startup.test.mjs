import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

test('local startup supports environment credentials and derives its origin from PORT', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nrs-start-'));
  const port = 41000 + Math.floor(Math.random() * 10000);
  const cwd = fileURLToPath(new URL('../', import.meta.url));
  async function start(initial) {
    const env = { ...process.env, DATA_DIR: dataDir, PORT: String(port), HOST: '127.0.0.1', ADMIN_EMAIL: 'operator@example.test', ADMIN_PASSWORD: 'long bootstrap test password' };
    delete env.PUBLIC_ORIGIN;
    if (!initial) { delete env.ADMIN_EMAIL; delete env.ADMIN_PASSWORD; }
    const child = spawn('bash', ['start-local.sh'], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '', error = '';
    child.stdout.on('data', b => { output += b; }); child.stderr.on('data', b => { error += b; });
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Startup timeout: ' + output + error)), 3000);
        child.once('exit', code => { clearTimeout(timeout); reject(new Error('Startup exited ' + code + ': ' + output + error)); });
        child.stdout.on('data', () => { if (output.includes('NRSgirls running')) { clearTimeout(timeout); resolve(); } });
      });
      assert.ok(output.includes(`Open http://localhost:${port}`), output);
      const status = await new Promise((resolve, reject) => { const req = http.get({ hostname: '127.0.0.1', port, path: '/api/health', headers: { host: `localhost:${port}` } }, res => { res.resume(); resolve(res.statusCode); }); req.on('error', reject); });
      assert.equal(status, 200);
    } finally {
      if (child.exitCode === null) { const exit = new Promise(resolve => child.once('exit', resolve)); child.kill('SIGTERM'); await exit; }
    }
  }
  try { await start(true); await start(false); }
  finally { rmSync(dataDir, { recursive: true, force: true }); }
});
