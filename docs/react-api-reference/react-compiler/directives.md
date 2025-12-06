# React Compiler Directives

Function-level directives to control React Compiler behavior.

---

## 'use memo'

Opts a function into React Compiler optimization.

```jsx
'use memo';

function MyComponent({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
  return <List items={sorted} />;
}
```

**When to use:**
- Gradual adoption with `compilationMode: 'annotation'`
- Explicitly marking components for optimization
- Testing compiler behavior on specific functions

---

## 'use no memo'

Opts a function out of React Compiler optimization.

```jsx
'use no memo';

function LegacyComponent({ data }) {
  // This component won't be compiled
  // Useful for code that doesn't follow Rules of React
  return <div>{processData(data)}</div>;
}
```

**When to use:**
- Legacy code that violates Rules of React
- Components with known compiler issues
- Third-party code you can't modify

---

## Directive Placement

Directives must be the first statement in a function:

### Function Declarations

```jsx
function MyComponent() {
  'use memo';
  return <div>Hello</div>;
}
```

### Arrow Functions

```jsx
const MyComponent = () => {
  'use memo';
  return <div>Hello</div>;
};
```

### Function Expressions

```jsx
const MyComponent = function() {
  'use memo';
  return <div>Hello</div>;
};
```

---

## Scope

Directives apply to the function where they're declared:

```jsx
function Parent() {
  'use memo';
  // Parent is compiled

  function Child() {
    // Child is NOT automatically compiled
    // (unless compilationMode is 'all')
  }

  return <Child />;
}
```

To compile nested functions, add directives to each:

```jsx
function Parent() {
  'use memo';

  function Child() {
    'use memo';
    // Now Child is also compiled
  }

  return <Child />;
}
```

---

## Combining with Server Directives

Compiler directives can be used alongside 'use client' and 'use server':

```jsx
'use client';

function InteractiveComponent() {
  'use memo';

  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Order:** File-level directives ('use client') come before function-level directives ('use memo').

---

## Migration Strategy

### Step 1: Start with annotation mode

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

### Step 2: Add 'use memo' to components

```jsx
'use memo';

function ProductCard({ product }) {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  );
}
```

### Step 3: Fix ESLint violations

```bash
npx eslint --rule 'react-compiler/react-compiler: error' src/
```

### Step 4: Expand to more components

Gradually add `'use memo'` to more components as you verify they work correctly.

### Step 5: Switch to full compilation

Once confident, remove annotations and switch to `compilationMode: 'all'`:

```js
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all'
    }]
  ]
}
```

Use `'use no memo'` only for components that can't be compiled.

---

## Common Patterns

### Excluding a component temporarily

```jsx
'use no memo';

function ComponentWithIssue() {
  // TODO: Fix Rules of React violation
  // Then remove 'use no memo'
  return <LegacyBehavior />;
}
```

### Library code

When publishing a library, you might want to pre-compile:

```jsx
// src/Button.jsx
'use memo';

export function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
```

---

## See Also

- [React Compiler Configuration](./configuration.md)
- [Compiling Libraries](./compiling-libraries.md)
- [Rules of React](https://react.dev/reference/rules)
