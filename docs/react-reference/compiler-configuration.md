# React Compiler Configuration

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values.

---

## Installation

### Babel Plugin

```bash
npm install -D babel-plugin-react-compiler
```

### ESLint Plugin

```bash
npm install -D eslint-plugin-react-compiler
```

---

## Babel Configuration

### Basic Setup

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Configuration options
    }],
  ],
};
```

### With Next.js

```js
// next.config.js
module.exports = {
  experimental: {
    reactCompiler: true,
  },
};
```

### With Vite

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

---

## Configuration Options

### `target`

Specifies the compilation target.

```js
{
  target: '18' // or '19'
}
```

### `sources`

Filter which files the compiler should transform.

```js
{
  sources: (filename) => {
    return filename.includes('src/');
  }
}
```

### `panicThreshold`

Controls behavior when compilation fails.

```js
{
  panicThreshold: 'NONE' // 'NONE' | 'CRITICAL_ERRORS' | 'ALL_ERRORS'
}
```

- `'NONE'`: Never panic, skip problematic code.
- `'CRITICAL_ERRORS'`: Panic on critical errors only.
- `'ALL_ERRORS'`: Panic on any compilation error.

### `environment`

Custom environment configuration.

```js
{
  environment: {
    customHooks: {
      useCustomHook: {
        valueKind: 'frozen',
      },
    },
  },
}
```

---

## ESLint Configuration

```js
// eslint.config.js
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
];
```

---

## Gradual Adoption

### Opt-in by directory

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      sources: (filename) => {
        // Only compile files in specific directories
        return filename.includes('src/components/');
      },
    }],
  ],
};
```

### Opt-out specific files

Use the `'use no memo'` directive to opt out specific files:

```jsx
'use no memo';

function UnoptimizedComponent() {
  // This component won't be compiled
}
```

---

## Verifying Compilation

### DevTools Integration

React DevTools shows which components have been optimized by the compiler with a "Memo ✨" badge.

### Logging

Enable logging to see compilation results:

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(filename, event);
    },
  },
}
```

---

## Troubleshooting

### Common Issues

1. **Component not being compiled** - Check if it violates the Rules of React.
2. **Unexpected behavior** - Ensure your code is pure and follows React conventions.
3. **Build errors** - Check for unsupported syntax or patterns.

### Debug Mode

```js
{
  debug: true,
  // Outputs detailed compilation information
}
```

---

*See also: [Compiler Directives](./compiler-directives.md) | [Rules of React](./rules-purity.md)*
