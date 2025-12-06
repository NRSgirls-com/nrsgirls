# React Hooks Reference

Hooks let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own.

---

## State Hooks

State lets a component "remember" information like user input.

### useState

`useState` declares a state variable that you can update directly.

```jsx
const [count, setCount] = useState(0);
```

**Parameters:**
- `initialState` - The value you want the state to be initially

**Returns:**
- `[state, setState]` - Current state value and a function to update it

### useReducer

`useReducer` declares a state variable with update logic inside a reducer function.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

**Best for:**
- Complex state logic involving multiple sub-values
- Next state depends on the previous state
- State updates need to be passed down to deeply nested components

---

## Context Hooks

Context lets a component receive information from distant parents without passing it as props.

### useContext

`useContext` reads and subscribes to a context.

```jsx
const theme = useContext(ThemeContext);
```

**Parameters:**
- `SomeContext` - The context created with `createContext`

**Returns:**
- The context value for the calling component

---

## Ref Hooks

Refs let a component hold some information that isn't used for rendering.

### useRef

`useRef` declares a ref that can hold any value but is most often used to hold a DOM node.

```jsx
const inputRef = useRef(null);
```

**Parameters:**
- `initialValue` - The value you want the ref object's `current` property to be initially

**Returns:**
- A ref object with a single `current` property

### useImperativeHandle

`useImperativeHandle` lets you customize the ref exposed by your component.

```jsx
useImperativeHandle(ref, () => ({
  focus() {
    inputRef.current.focus();
  }
}));
```

---

## Effect Hooks

Effects let a component connect to and synchronize with external systems.

### useEffect

`useEffect` connects a component to an external system.

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [serverUrl, roomId]);
```

**Parameters:**
- `setup` - Function with your Effect's logic
- `dependencies` (optional) - Array of reactive values referenced inside setup

### useLayoutEffect

`useLayoutEffect` fires before the browser repaints the screen. Use for measuring layout.

```jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, []);
```

### useInsertionEffect

`useInsertionEffect` fires before any DOM mutations. Used by CSS-in-JS libraries.

---

## Performance Hooks

A common way to optimize re-rendering performance is to skip unnecessary work.

### useMemo

`useMemo` lets you cache the result of an expensive calculation.

```jsx
const visibleTodos = useMemo(
  () => filterTodos(todos, filter),
  [todos, filter]
);
```

### useCallback

`useCallback` lets you cache a function definition before passing it to an optimized component.

```jsx
const handleSubmit = useCallback((orderDetails) => {
  post('/product/' + productId + '/buy', { orderDetails });
}, [productId]);
```

### useTransition

`useTransition` lets you mark a state transition as non-blocking and allow other updates to interrupt it.

```jsx
const [isPending, startTransition] = useTransition();
```

### useDeferredValue

`useDeferredValue` lets you defer updating a part of the UI.

```jsx
const deferredQuery = useDeferredValue(query);
```

---

## React 19 Hooks

New hooks introduced in React 19:

### use

`use` lets you read a resource like a Promise or context.

```jsx
const message = use(messagePromise);
const theme = use(ThemeContext);
```

### useFormStatus

`useFormStatus` gives you status information of the last form submission.

```jsx
const { pending, data, method, action } = useFormStatus();
```

### useFormState

`useFormState` allows you to update state based on the result of a form action.

```jsx
const [state, formAction] = useFormState(fn, initialState);
```

### useOptimistic

`useOptimistic` lets you show a different state while an async action is underway.

```jsx
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

### useActionState

`useActionState` allows you to update state based on the result of an action.

```jsx
const [state, action, isPending] = useActionState(fn, initialState);
```

---

## Other Hooks

### useDebugValue

`useDebugValue` lets you customize the label React DevTools displays for your custom Hook.

```jsx
useDebugValue(isOnline ? 'Online' : 'Offline');
```

### useId

`useId` generates unique IDs that can be passed to accessibility attributes.

```jsx
const id = useId();
```

### useSyncExternalStore

`useSyncExternalStore` lets you subscribe to an external store.

```jsx
const state = useSyncExternalStore(subscribe, getSnapshot);
```

---

## Custom Hooks

You can define your own Hooks by extracting component logic into reusable functions.

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }

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

**Rules for custom Hooks:**
- Name must start with `use` followed by a capital letter
- Can call other Hooks
- Share stateful logic, not state itself

---

## See Also

- [Rules of Hooks](./rules-of-hooks.md)
- [React DOM Hooks](./react-dom/hooks.md)
- [Building Your Own Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
