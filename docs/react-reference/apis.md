# React APIs

In addition to Hooks and Components, the `react` package exports a few other APIs that are useful for defining components.

---

## Component APIs

### `createContext`

Lets you create a context that components can provide or read.

```jsx
const SomeContext = createContext(defaultValue);
```

**Parameters:**
- `defaultValue`: The value you want the context to have when there is no matching context provider.

**Returns:**
- A context object with `Provider` and `Consumer` properties.

---

### `forwardRef`

Lets your component expose a DOM node to parent component with a ref.

```jsx
const SomeComponent = forwardRef(function SomeComponent(props, ref) {
  // ...
});
```

**Parameters:**
- `render`: The render function for your component.

---

### `lazy`

Lets you defer loading component's code until it is rendered for the first time.

```jsx
const SomeComponent = lazy(() => import('./SomeComponent.js'));
```

**Parameters:**
- `load`: A function that returns a Promise resolving to a module with a `default` export.

---

### `memo`

Lets you skip re-rendering a component when its props are unchanged.

```jsx
const MemoizedComponent = memo(SomeComponent, arePropsEqual?);
```

**Parameters:**
- `Component`: The component you want to memoize.
- `arePropsEqual` (optional): A function that accepts the previous and new props.

---

### `startTransition`

Lets you update the state without blocking the UI.

```jsx
startTransition(() => {
  setTab('comments');
});
```

---

### `act`

A test helper to apply pending React updates before making assertions.

```jsx
await act(async () => {
  // Render components, trigger updates
});
```

---

## Cache APIs

### `cache`

Lets you cache the result of a data fetch or computation.

```jsx
const cachedFn = cache(fn);
```

---

## Utility APIs

### `Children`

Lets you manipulate and transform the JSX received as the `children` prop.

```jsx
Children.map(children, fn, thisArg?);
Children.forEach(children, fn, thisArg?);
Children.count(children);
Children.only(children);
Children.toArray(children);
```

---

### `cloneElement`

Lets you create a new React element using another element as a starting point.

```jsx
const clonedElement = cloneElement(element, props, ...children);
```

---

### `createElement`

Lets you create a React element. Typically you use JSX instead.

```jsx
const element = createElement(type, props, ...children);
```

---

### `createRef`

Creates a ref object which can contain an arbitrary value.

```jsx
const ref = createRef();
```

---

### `isValidElement`

Checks whether a value is a React element.

```jsx
const isElement = isValidElement(value);
```

---

## Experimental APIs

### `useOptimistic`

Lets you optimistically update the UI.

```jsx
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

---

*See also: [React Hooks](./hooks.md) | [React Components](./components.md)*
