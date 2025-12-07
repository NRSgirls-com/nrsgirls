# React Compiler Directives

Function-level directives that control how the React Compiler processes your code.

---

## `'use no memo'`

Opts out a component or hook from being compiled.

```jsx
'use no memo';

function ManuallyOptimizedComponent({ data }) {
  // This component won't be auto-memoized
  // You manage optimization manually
  return <div>{data}</div>;
}
```

### When to use

- **Debugging** - Temporarily disable compilation to isolate issues.
- **Performance testing** - Compare compiled vs uncompiled behavior.
- **Incompatible patterns** - When code uses patterns the compiler doesn't support.

### File-level opt-out

Place at the top of a file to opt out the entire file:

```jsx
'use no memo';

// All components and hooks in this file are skipped
function ComponentA() { /* ... */ }
function ComponentB() { /* ... */ }
```

### Function-level opt-out

Place inside a function to opt out only that function:

```jsx
function OptimizedComponent() {
  // This component IS compiled
  return <ChildComponent />;
}

function ManualComponent() {
  'use no memo';
  // This component is NOT compiled
  return <div>Manual</div>;
}
```

---

## `'use memo'`

Explicitly opts in a component or hook to be compiled. Useful when using `sources` filter to limit compilation scope.

```jsx
'use memo';

function ExplicitlyCompiledComponent({ items }) {
  // Explicitly request compilation even if file is filtered out
  return items.map(item => <Item key={item.id} {...item} />);
}
```

### Use case: Gradual adoption

When adopting the compiler gradually with a `sources` filter:

```js
// babel.config.js
{
  sources: (filename) => filename.includes('src/new-code/')
}
```

You can opt-in specific components in old code:

```jsx
// src/old-code/ImportantComponent.jsx
'use memo';

function ImportantComponent() {
  // This gets compiled even though it's in old-code/
}
```

---

## Best Practices

### 1. Prefer fixing code over opting out

Instead of:
```jsx
'use no memo';

function Component({ onClick }) {
  // Using 'use no memo' because of issue
}
```

Try to fix the underlying issue:
```jsx
function Component({ onClick }) {
  // Fixed the issue, now it compiles correctly
}
```

### 2. Document why you're opting out

```jsx
'use no memo';
// Opted out because: [specific reason]
// TODO: Remove when [condition]

function TemporarilyOptedOut() {
  // ...
}
```

### 3. Minimize opt-out scope

Prefer function-level over file-level:

```jsx
// Good: Only opt out the specific function
function NormalComponent() { /* compiled */ }

function ProblematicComponent() {
  'use no memo';
  // Not compiled
}

// Avoid: Opting out entire file
```

---

## Compiler Behavior

When a component is opted out:

1. **No automatic memoization** - React.memo, useMemo, useCallback are not auto-inserted.
2. **No dependency analysis** - The compiler doesn't track value dependencies.
3. **Original code preserved** - Your code runs exactly as written.

When a component is compiled:

1. **Automatic memoization** - Values and callbacks are memoized.
2. **Dependency tracking** - The compiler analyzes what values depend on what.
3. **Optimized re-renders** - Components skip unnecessary re-renders.

---

*See also: [Compiler Configuration](./compiler-configuration.md) | [Rules of React](./rules-purity.md)*
