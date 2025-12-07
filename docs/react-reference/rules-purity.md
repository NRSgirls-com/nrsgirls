# Components and Hooks Must Be Pure

Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.

---

## What is Purity?

A pure function has two key characteristics:

1. **Deterministic** - Given the same inputs, it always returns the same output.
2. **No side effects** - It doesn't change anything outside its scope during execution.

---

## Pure Components

React components should be pure with respect to their props, state, and context.

### Good: Pure Component

```jsx
function Greeting({ name }) {
  // Same name always produces same output
  return <h1>Hello, {name}!</h1>;
}
```

### Bad: Impure Component

```jsx
let callCount = 0;

function Counter() {
  callCount++; // Side effect during render!
  return <p>Rendered {callCount} times</p>;
}
```

---

## Rules for Pure Components

### 1. Don't mutate props

```jsx
// Bad: Mutating props
function UserCard({ user }) {
  user.displayName = user.name.toUpperCase(); // Don't do this!
  return <div>{user.displayName}</div>;
}

// Good: Derive values without mutation
function UserCard({ user }) {
  const displayName = user.name.toUpperCase();
  return <div>{displayName}</div>;
}
```

### 2. Don't mutate state directly

```jsx
// Bad: Direct mutation
function TodoList() {
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    todos.push({ text }); // Don't mutate!
    setTodos(todos);
  }

  return /* ... */;
}

// Good: Create new array
function TodoList() {
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    setTodos([...todos, { text }]); // New array
  }

  return /* ... */;
}
```

### 3. Don't modify external variables during render

```jsx
// Bad: Modifying external variable
let globalData = [];

function DataCollector({ item }) {
  globalData.push(item); // Side effect during render!
  return <div>{item.name}</div>;
}

// Good: Use effects for side effects
function DataCollector({ item }) {
  useEffect(() => {
    globalData.push(item); // OK in effect
  }, [item]);

  return <div>{item.name}</div>;
}
```

### 4. Don't make network requests during render

```jsx
// Bad: Fetch during render
function UserProfile({ userId }) {
  const user = fetch(`/api/users/${userId}`); // Don't do this!
  return <div>{user.name}</div>;
}

// Good: Use effects or data fetching libraries
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  return user ? <div>{user.name}</div> : <Loading />;
}
```

---

## Pure Hooks

Custom Hooks must also be pure.

### Good: Pure Hook

```jsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size; // Same state always returns same object
}
```

### Bad: Impure Hook

```jsx
let hookCallCount = 0;

function useBadHook() {
  hookCallCount++; // Side effect!
  return hookCallCount;
}
```

---

## Why Purity Matters

### 1. Predictable Behavior

Pure components always produce the same output for the same input, making them predictable and easier to understand.

### 2. Safe Re-rendering

React may render components multiple times (especially in StrictMode). Pure components handle this correctly.

```jsx
// This is safe because it's pure
function Counter({ count }) {
  return <span>{count}</span>;
}
```

### 3. Compiler Optimization

The React Compiler can automatically memoize pure components, improving performance.

### 4. Concurrent Features

React's concurrent features (Suspense, transitions) rely on being able to pause and resume rendering. Impure components break these features.

---

## Where Side Effects Belong

Side effects should be in:

1. **Event handlers** - `onClick`, `onSubmit`, etc.
2. **Effects** - `useEffect`, `useLayoutEffect`
3. **Server Actions** - Functions marked with `'use server'`

```jsx
function Form() {
  const [name, setName] = useState('');

  // Event handler - OK for side effects
  async function handleSubmit(e) {
    e.preventDefault();
    await saveUser(name); // Side effect is fine here
  }

  // Effect - OK for side effects
  useEffect(() => {
    logPageView(); // Side effect is fine here
  }, []);

  // Render - must be pure
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}
```

---

*See also: [React Calls Components and Hooks](./rules-react-calls.md) | [Rules of Hooks](./rules-of-hooks.md)*
