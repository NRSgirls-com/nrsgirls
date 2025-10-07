import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      name: 'SharedComponents',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'clsx', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  }
});
