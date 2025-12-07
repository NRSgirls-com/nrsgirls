# ESLint Plugin React Hooks - Lints

The ESLint plugin for React Hooks helps enforce the Rules of React. This document details each lint rule with examples.

---

## Installation

```bash
npm install -D eslint-plugin-react-hooks
```

---

## Configuration

### ESLint Flat Config (eslint.config.js)

```js
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

### Legacy Config (.eslintrc)

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## Rules

### `react-hooks/rules-of-hooks`

Enforces the Rules of Hooks.

**Severity:** `error` (recommended)

#### What it checks

1. Hooks are called at the top level of function components
2. Hooks are called at the top level of custom Hooks
3. Hooks are not called conditionally
4. Hooks are not called inside loops
5. Hooks are not called inside nested functions

#### Examples

```jsx
// Bad: Hook inside condition
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // Error!
  }
  return <div />;
}

// Good: Condition inside Hook usage
function Component({ condition }) {
  const [state, setState] = useState(0);
  if (condition) {
    // Use state conditionally
  }
  return <div>{condition ? state : null}</div>;
}
```

```jsx
// Bad: Hook inside loop
function Component({ items }) {
  for (const item of items) {
    useEffect(() => { /* ... */ }); // Error!
  }
  return <div />;
}

// Good: Single effect that handles all items
function Component({ items }) {
  useEffect(() => {
    items.forEach(item => { /* ... */ });
  }, [items]);
  return <div />;
}
```

```jsx
// Bad: Hook inside nested function
function Component() {
  function handleClick() {
    const ref = useRef(); // Error!
  }
  return <button onClick={handleClick}>Click</button>;
}

// Good: Hook at top level
function Component() {
  const ref = useRef();
  function handleClick() {
    // Use ref here
  }
  return <button onClick={handleClick}>Click</button>;
}
```

---

### `react-hooks/exhaustive-deps`

Validates dependency arrays of Hooks.

**Severity:** `warn` (recommended)

#### What it checks

1. All reactive values used inside effects are listed in dependencies
2. Dependency arrays are not missing values
3. Dependency arrays don't contain unnecessary values
4. Functions are properly memoized when used as dependencies

#### Examples

```jsx
// Bad: Missing dependency
function Component({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Warning: 'userId' is missing

  return <div>{user?.name}</div>;
}

// Good: All dependencies listed
function Component({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Correct!

  return <div>{user?.name}</div>;
}
```

```jsx
// Bad: Function dependency not memoized
function Component({ items }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
  };

  useEffect(() => {
    handleSelect(items[0]);
  }, [handleSelect, items]); // Warning: handleSelect changes every render

  return <List items={items} onSelect={handleSelect} />;
}

// Good: Function memoized with useCallback
function Component({ items }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = useCallback((item) => {
    setSelected(item);
  }, []);

  useEffect(() => {
    handleSelect(items[0]);
  }, [handleSelect, items]); // Correct!

  return <List items={items} onSelect={handleSelect} />;
}
```

```jsx
// Bad: Object dependency
function Component({ config }) {
  useEffect(() => {
    initialize(config);
  }, [config]); // Warning if config is new object every render

  return <div />;
}

// Good: Destructure stable values
function Component({ config }) {
  const { apiKey, endpoint } = config;

  useEffect(() => {
    initialize({ apiKey, endpoint });
  }, [apiKey, endpoint]); // Correct!

  return <div />;
}
```

---

## Suppressing Lints

### Disabling for a line

```jsx
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  // Intentionally not including someDep
}, []);
```

### With explanation

```jsx
useEffect(() => {
  // Only run on mount, intentionally empty deps
  initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

---

## Common Patterns

### Fetching data

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      const data = await fetchUser(userId);
      if (!cancelled) {
        setUser(data);
        setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <Spinner />;
  return <Profile user={user} />;
}
```

### Event listeners

```jsx
function Component() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []); // Empty deps is correct - handler uses setState

  return <Cursor position={position} />;
}
```

---

*See also: [Rules of Hooks](./rules-of-hooks.md) | [React Hooks](./hooks.md)*
