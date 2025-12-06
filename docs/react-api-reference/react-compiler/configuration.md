# React Compiler Configuration

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values.

---

## Overview

React Compiler automatically optimizes your React code by:
- Memoizing components (like `React.memo`)
- Memoizing values (like `useMemo`)
- Memoizing callbacks (like `useCallback`)

This eliminates the need for manual memoization while providing equal or better performance.

---

## Installation

```bash
npm install babel-plugin-react-compiler
```

---

## Babel Configuration

### Basic Setup

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // options
    }]
  ]
};
```

### With TypeScript

```js
// babel.config.js
module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    'babel-plugin-react-compiler',
    // other plugins...
  ]
};
```

---

## Next.js Configuration

### Next.js 15+

```js
// next.config.js
module.exports = {
  experimental: {
    reactCompiler: true
  }
};
```

### With Options

```js
// next.config.js
module.exports = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation', // 'all' | 'annotation'
    }
  }
};
```

---

## Compiler Options

### compilationMode

Controls which functions are compiled.

```js
{
  compilationMode: 'all' // Default: compile all functions
}
```

Options:
- `'all'` - Compile all functions (default)
- `'annotation'` - Only compile functions with `'use memo'` directive

### sources

Specify which files to compile.

```js
{
  sources: (filename) => {
    return filename.includes('src/');
  }
}
```

### runtimeModule

Override the React runtime module path.

```js
{
  runtimeModule: 'react/compiler-runtime'
}
```

### panicThreshold

Control compiler behavior on errors.

```js
{
  panicThreshold: 'NONE' // 'NONE' | 'CRITICAL_ERRORS' | 'ALL_ERRORS'
}
```

### logger

Enable logging for debugging.

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[${event.kind}] ${filename}`);
    }
  }
}
```

---

## Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler']
      }
    })
  ]
});
```

---

## Remix Configuration

```js
// vite.config.js
import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    remix({
      babel: {
        plugins: ['babel-plugin-react-compiler']
      }
    })
  ]
});
```

---

## Webpack Configuration

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['babel-plugin-react-compiler']
          }
        }
      }
    ]
  }
};
```

---

## ESLint Integration

Install the ESLint plugin to catch issues the compiler cannot handle:

```bash
npm install eslint-plugin-react-compiler
```

```js
// .eslintrc.js
module.exports = {
  plugins: ['react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error'
  }
};
```

---

## Gradual Adoption

### Using Annotations

Start with annotation mode to opt-in specific files:

```js
// babel.config.js
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation'
    }]
  ]
}
```

Then add `'use memo'` to files you want compiled:

```jsx
'use memo';

function MyComponent() {
  // This component will be compiled
}
```

### Excluding Files

Use `sources` to exclude problematic files:

```js
{
  sources: (filename) => {
    // Skip legacy code
    if (filename.includes('legacy/')) {
      return false;
    }
    return true;
  }
}
```

---

## Verifying Compilation

Check if React Compiler is working:

1. **React DevTools** - Look for "Memo ✨" badge on components
2. **Build logs** - Enable logger to see compilation events
3. **Source maps** - Inspect compiled output

---

## Troubleshooting

### Compiler skips a component

The compiler may skip functions that:
- Break the Rules of React
- Use unsupported patterns
- Have complex control flow

Use ESLint plugin to identify issues:

```bash
npx eslint --rule 'react-compiler/react-compiler: error' src/
```

### Performance issues

If you experience performance regressions:

1. Check ESLint for rule violations
2. Use annotation mode to isolate issues
3. Exclude problematic files temporarily

---

## See Also

- [React Compiler Directives](./directives.md)
- [Compiling Libraries](./compiling-libraries.md)
- [ESLint Plugin](../eslint-plugin/lints.md)
