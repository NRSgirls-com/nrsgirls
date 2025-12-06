# ESLint Plugin React Hooks

The ESLint plugin for React Hooks helps enforce the Rules of React.

---

## Installation

```bash
npm install eslint-plugin-react-hooks --save-dev
```

---

## Configuration

### ESLint 9+ (Flat Config)

```js
// eslint.config.js
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];
```

### ESLint 8 (Legacy Config)

```js
// .eslintrc.js
module.exports = {
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

---

## Rules

### react-hooks/rules-of-hooks

Enforces the Rules of Hooks.

**Severity:** Error

**What it catches:**

#### Hooks called conditionally

```jsx
// ❌ Bad: Hook inside condition
function Component({ isEnabled }) {
  if (isEnabled) {
    const [state, setState] = useState(0); // Error!
  }
}

// ✅ Good: Condition inside hook
function Component({ isEnabled }) {
  const [state, setState] = useState(0);
  // Use isEnabled in logic, not around the hook
}
```

#### Hooks called in loops

```jsx
// ❌ Bad: Hook inside loop
function Component({ items }) {
  for (const item of items) {
    const [state, setState] = useState(item); // Error!
  }
}

// ✅ Good: Single hook for collection
function Component({ items }) {
  const [states, setStates] = useState(items);
}
```

#### Hooks called in nested functions

```jsx
// ❌ Bad: Hook in nested function
function Component() {
  function handleClick() {
    const [state, setState] = useState(0); // Error!
  }
}

// ✅ Good: Hook at component top level
function Component() {
  const [state, setState] = useState(0);

  function handleClick() {
    setState(state + 1);
  }
}
```

#### Hooks called in non-React functions

```jsx
// ❌ Bad: Hook in regular function
function calculateValue() {
  const value = useMemo(() => 42, []); // Error!
  return value;
}

// ✅ Good: Hook in component or custom hook
function useCalculatedValue() {
  return useMemo(() => 42, []);
}
```

---

### react-hooks/exhaustive-deps

Verifies the dependency array of Hooks.

**Severity:** Warning

**What it catches:**

#### Missing dependencies

```jsx
// ⚠️ Warning: Missing dependency
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId);
  }, []); // Warning: 'userId' is missing
}

// ✅ Good: All dependencies included
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
}
```

#### Unnecessary dependencies

```jsx
// ⚠️ Warning: Unnecessary dependency
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('mounted');
  }, [count]); // Warning: 'count' is not used
}

// ✅ Good: Only necessary dependencies
function Component() {
  useEffect(() => {
    console.log('mounted');
  }, []);
}
```

#### Functions should be wrapped in useCallback

```jsx
// ⚠️ Warning: Function changes on every render
function Component({ onSave }) {
  useEffect(() => {
    document.addEventListener('save', onSave);
    return () => document.removeEventListener('save', onSave);
  }, [onSave]); // May cause infinite loop if onSave is recreated
}

// ✅ Good: Stable function reference
function Parent() {
  const handleSave = useCallback(() => {
    // save logic
  }, []);

  return <Component onSave={handleSave} />;
}
```

---

## Common Fixes

### Moving functions inside effects

```jsx
// ⚠️ Warning: fetchData changes on every render
function Component({ userId }) {
  function fetchData() {
    return fetch(`/api/users/${userId}`);
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Problem!
}

// ✅ Good: Function inside effect
function Component({ userId }) {
  useEffect(() => {
    function fetchData() {
      return fetch(`/api/users/${userId}`);
    }
    fetchData();
  }, [userId]);
}
```

### Using useCallback for stable references

```jsx
// ⚠️ Problem: handleSubmit recreated every render
function Component({ onSubmit }) {
  const handleSubmit = (data) => {
    onSubmit(data);
  };

  useEffect(() => {
    // Uses handleSubmit
  }, [handleSubmit]); // Runs every render!
}

// ✅ Good: Stable callback
function Component({ onSubmit }) {
  const handleSubmit = useCallback((data) => {
    onSubmit(data);
  }, [onSubmit]);

  useEffect(() => {
    // Uses handleSubmit
  }, [handleSubmit]); // Only runs when onSubmit changes
}
```

### Using refs for values you don't want to track

```jsx
// ⚠️ Warning: latestCallback changes every render
function Component({ callback }) {
  useEffect(() => {
    const timer = setInterval(() => {
      callback();
    }, 1000);
    return () => clearInterval(timer);
  }, [callback]); // Restarts timer on every change
}

// ✅ Good: Use ref for latest value
function Component({ callback }) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const timer = setInterval(() => {
      callbackRef.current();
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Timer runs continuously
}
```

---

## Disabling Rules

### For a specific line

```jsx
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  loadData();
}, []);
```

### For a block

```jsx
/* eslint-disable react-hooks/exhaustive-deps */
useEffect(() => {
  loadData();
}, []);
/* eslint-enable react-hooks/exhaustive-deps */
```

**Warning:** Disabling these rules can lead to subtle bugs. Only disable when you're certain the behavior is intentional.

---

## Configuration Options

### Additional Hooks

Configure additional functions to be checked:

```js
{
  rules: {
    'react-hooks/exhaustive-deps': ['warn', {
      additionalHooks: '(useMyCustomHook|useAnotherHook)'
    }]
  }
}
```

---

## See Also

- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [useEffect Dependencies](https://react.dev/learn/lifecycle-of-reactive-effects)
- [React Compiler ESLint Plugin](../react-compiler/configuration.md#eslint-integration)
