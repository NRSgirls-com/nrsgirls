# Compiling Libraries for React Compiler

A guide for shipping pre-compiled library code that works well with the React Compiler.

---

## Overview

When building React component libraries, you can pre-compile your code with the React Compiler to provide optimized components to consumers.

---

## Configuration for Libraries

### Babel Configuration

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      target: '19', // Target React version
      // Library-specific settings
    }],
  ],
};
```

### Publishing Pre-compiled Code

Structure your package to include both compiled and source versions:

```
my-library/
├── src/           # Source code
├── dist/          # Compiled output (with React Compiler)
├── dist-raw/      # Compiled output (without React Compiler)
└── package.json
```

---

## Package.json Configuration

```json
{
  "name": "my-react-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./uncompiled": {
      "import": "./dist-raw/index.mjs",
      "require": "./dist-raw/index.js"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

---

## Best Practices for Library Authors

### 1. Follow the Rules of React

Ensure all components follow React's rules:

```jsx
// Good: Pure component
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// Avoid: Impure component
function BadButton({ label }) {
  // Don't mutate props or external state during render
  someGlobalState.lastLabel = label; // Bad!
  return <button>{label}</button>;
}
```

### 2. Document Custom Hooks

Provide type information for custom hooks:

```jsx
/**
 * @type {import('react').Hook}
 */
function useCustomState(initial) {
  const [state, setState] = useState(initial);
  // ...
  return [state, setState];
}
```

### 3. Provide Escape Hatches

Allow consumers to opt-out if needed:

```jsx
// Compiled version (default)
export { Button } from './compiled/Button';

// Uncompiled version for debugging
export { Button as ButtonUncompiled } from './uncompiled/Button';
```

---

## TypeScript Support

Include proper TypeScript declarations:

```ts
// index.d.ts
import { FC, ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps>;
```

---

## Testing Compiled Output

### Unit Tests

```jsx
import { render, screen } from '@testing-library/react';
import { Button } from './dist/Button';

test('compiled Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Performance Tests

Compare compiled vs uncompiled performance:

```jsx
import { Button } from './dist/Button';
import { Button as RawButton } from './dist-raw/Button';

// Benchmark both versions
```

---

## Compatibility Considerations

### React Version Compatibility

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Use '18' for React 18 compatibility
      // Use '19' for React 19+ features
      target: '18',
    }],
  ],
};
```

### Server Components

If your library supports Server Components:

```jsx
// Mark client components explicitly
'use client';

export function InteractiveButton({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

---

## Distribution Checklist

- [ ] Pre-compile with React Compiler
- [ ] Include source maps for debugging
- [ ] Provide TypeScript declarations
- [ ] Test with multiple React versions
- [ ] Document any opt-out requirements
- [ ] Include both ESM and CJS builds
- [ ] Test SSR compatibility

---

*See also: [Compiler Configuration](./compiler-configuration.md) | [Compiler Directives](./compiler-directives.md)*
