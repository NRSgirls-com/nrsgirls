#!/usr/bin/env node

const { existsSync } = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

const cwd = process.cwd();
const npxBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', cwd, shell: false });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const hasTsconfig = existsSync(path.join(cwd, 'tsconfig.json'));
if (hasTsconfig) {
  run(npxBin, ['tsc', '--build']);
} else {
  console.log('Skipping TypeScript build; no tsconfig.json found.');
}

const viteConfigCandidates = [
  'vite.config.ts',
  'vite.config.mts',
  'vite.config.js',
  'vite.config.cjs',
];
const hasViteConfig = viteConfigCandidates.some((file) => existsSync(path.join(cwd, file)));
if (hasViteConfig) {
  run(npxBin, ['vite', 'build']);
} else {
  console.log('Skipping Vite build; no Vite configuration file detected.');
}
