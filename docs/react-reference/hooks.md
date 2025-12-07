# React Hooks

Hooks let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own.

---

## State Hooks

State lets a component "remember" information like user input. For example, a form component can use state to store the input value, while an image gallery component can use state to store the selected image index.

### `useState`

Declares a state variable that you can update directly.

```jsx
const [state, setState] = useState(initialState);
```

### `useReducer`

Declares a state variable with the update logic inside a reducer function.

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

---

## Context Hooks

Context lets a component receive information from distant parents without passing it as props.

### `useContext`

Reads and subscribes to a context.

```jsx
const value = useContext(SomeContext);
```

---

## Ref Hooks

Refs let a component hold some information that isn't used for rendering, like a DOM node or a timeout ID.

### `useRef`

Declares a ref. You can hold any value in it, but most often it's used to hold a DOM node.

```jsx
const ref = useRef(initialValue);
```

### `useImperativeHandle`

Lets you customize the ref exposed by your component.

```jsx
useImperativeHandle(ref, createHandle, dependencies?);
```

---

## Effect Hooks

Effects let a component connect to and synchronize with external systems.

### `useEffect`

Connects a component to an external system.

```jsx
useEffect(() => {
  // Setup code
  return () => {
    // Cleanup code
  };
}, [dependencies]);
```

### `useLayoutEffect`

Fires before the browser repaints the screen. You can measure layout here.

```jsx
useLayoutEffect(() => {
  // Measure DOM layout
}, [dependencies]);
```

### `useInsertionEffect`

Fires before React makes changes to the DOM. Libraries can insert dynamic CSS here.

```jsx
useInsertionEffect(() => {
  // Insert styles
}, [dependencies]);
```

---

## Performance Hooks

A common way to optimize re-rendering performance is to skip unnecessary work.

### `useMemo`

Lets you cache the result of an expensive calculation.

```jsx
const cachedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### `useCallback`

Lets you cache a function definition before passing it down to an optimized component.

```jsx
const cachedFn = useCallback(fn, [dependencies]);
```

### `useTransition`

Lets you mark a state transition as non-blocking and allow other updates to interrupt it.

```jsx
const [isPending, startTransition] = useTransition();
```

### `useDeferredValue`

Lets you defer updating a part of the UI.

```jsx
const deferredValue = useDeferredValue(value);
```

---

## Resource Hooks

Resources can be accessed by a component without having them as part of their state.

### `use`

Lets you read the value of a resource like a Promise or context.

```jsx
const value = use(resource);
```

---

## Other Hooks

### `useDebugValue`

Lets you customize the label React DevTools displays for your custom Hook.

```jsx
useDebugValue(value, format?);
```

### `useId`

Lets a component associate a unique ID with itself. Typically used with accessibility APIs.

```jsx
const id = useId();
```

### `useSyncExternalStore`

Lets a component subscribe to an external store.

```jsx
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);
```

### `useActionState`

Allows you to manage state of actions.

```jsx
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

---

## Custom Hooks

You can define your own Hooks as JavaScript functions. Custom Hooks let you share logic between components.

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

---

*See also: [Rules of Hooks](./rules-of-hooks.md)*
