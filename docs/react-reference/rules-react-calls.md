# React Calls Components and Hooks

React is responsible for rendering components and hooks when necessary to optimize the user experience. Understanding when and how React calls your code is essential for writing correct React applications.

---

## React Controls Rendering

React decides when to render your components. You should not call component functions directly.

### Don't: Call components as functions

```jsx
// Bad: Calling component as function
function Parent() {
  const result = ChildComponent({ name: 'Alice' }); // Don't do this!
  return <div>{result}</div>;
}
```

### Do: Use JSX syntax

```jsx
// Good: Let React handle rendering
function Parent() {
  return (
    <div>
      <ChildComponent name="Alice" />
    </div>
  );
}
```

---

## Why This Matters

### 1. Hooks Work Correctly

When React calls your component, it sets up the internal state needed for Hooks to work.

```jsx
function Counter() {
  // This only works because React called Counter()
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Proper Component Identity

React uses component identity for:
- Preserving state between renders
- Deciding what to update in the DOM
- Running effects at the right time

```jsx
function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      {show && <Counter />} {/* React tracks this instance */}
      <button onClick={() => setShow(!show)}>Toggle</button>
    </>
  );
}
```

### 3. Optimization Opportunities

React can optimize rendering when it controls the call:

- Skip rendering if props haven't changed
- Batch multiple state updates
- Interrupt rendering for higher priority updates

---

## When React Renders

React renders components when:

1. **Initial mount** - Component appears in the tree for the first time
2. **State updates** - Component's state changes via `setState`
3. **Context updates** - A context value the component reads changes
4. **Parent re-renders** - Parent component re-renders (unless memoized)

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
      <Child /> {/* Re-renders when Parent re-renders */}
    </>
  );
}
```

---

## Render Phase vs Commit Phase

### Render Phase

React calls your component functions to determine what the UI should look like.

- **Must be pure** - No side effects
- **May be interrupted** - React might pause and restart
- **May be called multiple times** - Same component may render multiple times

### Commit Phase

React applies changes to the DOM and runs effects.

- **Side effects allowed** - Effects run here
- **Runs once per update** - After render completes
- **Synchronous** - Happens in a single batch

```jsx
function Example() {
  // Render phase - must be pure
  const derived = expensiveCalculation(props.data);

  // Scheduled for commit phase
  useEffect(() => {
    // Side effects go here
    logAnalytics(derived);
  }, [derived]);

  return <div>{derived}</div>;
}
```

---

## Custom Hooks Follow the Same Rules

React also controls when custom hooks run.

### Don't: Call hooks conditionally

```jsx
// Bad: Conditional hook call
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const user = useUser(); // Don't do this!
  }
  return <div />;
}
```

### Do: Always call hooks

```jsx
// Good: Always call hooks
function Component({ isLoggedIn }) {
  const user = useUser();

  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  return <UserProfile user={user} />;
}
```

---

## Batching Updates

React batches multiple state updates into a single re-render.

```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit() {
    // Both updates are batched - only one re-render
    setName('');
    setEmail('');
  }

  return /* ... */;
}
```

---

## Concurrent Rendering

In concurrent mode, React may:

- **Pause rendering** - To handle more urgent updates
- **Restart rendering** - If something higher priority comes in
- **Render in parallel** - Prepare multiple versions of UI

This is why purity is essential - your component might be called multiple times before committing.

---

*See also: [Components and Hooks Must Be Pure](./rules-purity.md) | [Rules of Hooks](./rules-of-hooks.md)*
