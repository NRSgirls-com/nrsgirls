# Compiling Libraries with React Compiler

Guide for shipping pre-compiled library code with React Compiler optimizations.

---

## Overview

Library authors can ship pre-compiled code so consumers benefit from React Compiler optimizations without configuring it themselves.

**Benefits:**
- Users get optimizations without setup
- Consistent behavior across environments
- Smaller bundle impact (no duplicate compilation)

---

## When to Compile Libraries

### Compile your library if:
- Your library exports React components
- You want guaranteed optimization
- You've verified compatibility with Rules of React

### Don't compile if:
- Library is not React-specific
- Components are intentionally not pure
- You want users to control optimization

---

## Setup

### 1. Install Dependencies

```bash
npm install --save-dev babel-plugin-react-compiler
npm install --save-peer react@^19.0.0
```

### 2. Configure Babel

```js
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ],
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### 3. Build Script

```json
{
  "scripts": {
    "build": "babel src --out-dir dist --extensions '.js,.jsx,.ts,.tsx'"
  }
}
```

---

## Package Configuration

### package.json

```json
{
  "name": "my-component-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "babel-plugin-react-compiler": "^0.0.1"
  }
}
```

---

## React Version Compatibility

### Supporting React 18 and 19

Compiled code works with React 18, but optimizations are most effective with React 19.

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

### React 19 Only

For libraries targeting only React 19:

```json
{
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

---

## Dual Package Support

### ESM and CommonJS

```js
// rollup.config.js
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'esm' }
  ],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: ['babel-plugin-react-compiler']
    })
  ],
  external: ['react', 'react/jsx-runtime']
};
```

---

## Testing Compiled Output

### Verify Compilation

Check that components are properly memoized:

```jsx
// test/compilation.test.js
import { render } from '@testing-library/react';
import { Button } from '../dist';

test('Button renders correctly', () => {
  const { getByText } = render(<Button>Click me</Button>);
  expect(getByText('Click me')).toBeInTheDocument();
});
```

### Performance Testing

```jsx
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}

test('Button memoization works', () => {
  const { rerender } = render(
    <Profiler id="Button" onRender={onRender}>
      <Button>Click</Button>
    </Profiler>
  );

  rerender(
    <Profiler id="Button" onRender={onRender}>
      <Button>Click</Button>
    </Profiler>
  );
  // Second render should be faster due to memoization
});
```

---

## Source Maps

Include source maps for debugging:

```js
// babel.config.js
module.exports = {
  sourceMaps: true,
  plugins: ['babel-plugin-react-compiler']
};
```

```json
{
  "files": ["dist", "dist/**/*.map"]
}
```

---

## Documentation

Document compiler usage in your README:

```markdown
## React Compiler

This library is pre-compiled with React Compiler for optimal performance.
No additional configuration is needed.

### Requirements
- React 18.0.0 or higher (React 19+ recommended)

### Opting Out
If you experience issues, you can use the uncompiled source:

\`\`\`js
import { Button } from 'my-library/src';
\`\`\`
```

---

## Troubleshooting

### Users report issues

Provide an uncompiled entry point:

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./uncompiled": "./src/index.js"
  }
}
```

### TypeScript types

Ensure types are generated from source, not compiled output:

```json
{
  "scripts": {
    "build:types": "tsc --emitDeclarationOnly --outDir dist"
  }
}
```

### ESLint in development

Add ESLint plugin for development:

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

## Example: Complete Library Setup

```
my-component-library/
├── src/
│   ├── index.ts
│   ├── Button.tsx
│   └── Card.tsx
├── dist/
│   ├── index.js
│   ├── index.mjs
│   ├── index.d.ts
│   └── *.js.map
├── babel.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## See Also

- [React Compiler Configuration](./configuration.md)
- [React Compiler Directives](./directives.md)
- [Publishing ES Modules](https://nodejs.org/api/packages.html)
