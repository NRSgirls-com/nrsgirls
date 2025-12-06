# React APIs

In addition to Hooks and Components, the `react` package exports several APIs useful for defining components.

---

## createContext

`createContext` creates a context that components can provide or read.

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}
```

**Parameters:**
- `defaultValue` - The value you want the context to have when there is no matching provider

**Returns:**
- A context object with `Provider` and `Consumer` components

---

## forwardRef

`forwardRef` lets your component expose a DOM node to parent component with a ref.

```jsx
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

**Use cases:**
- Exposing a DOM node to the parent
- Forwarding a ref through multiple components

**With TypeScript:**
```tsx
const MyInput = forwardRef<HTMLInputElement, InputProps>(
  function MyInput(props, ref) {
    return <input {...props} ref={ref} />;
  }
);
```

---

## lazy

`lazy` lets you defer loading a component's code until it is rendered for the first time.

```jsx
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownPreview />
    </Suspense>
  );
}
```

**Parameters:**
- `load` - A function that returns a Promise resolving to a module with a default export

**Note:** Must be used with `<Suspense>` to show a loading state.

---

## memo

`memo` lets you skip re-rendering a component when its props are unchanged.

```jsx
const MemoizedComponent = memo(function SomeComponent(props) {
  // ...
});
```

**Parameters:**
- `Component` - The component you want to memoize
- `arePropsEqual` (optional) - Custom comparison function

**With custom comparison:**
```jsx
const Chart = memo(function Chart({ data }) {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});
```

---

## startTransition

`startTransition` lets you update state without blocking the UI.

```jsx
startTransition(() => {
  setPage('/about');
});
```

**Difference from useTransition:**
- `startTransition` doesn't provide an `isPending` flag
- Can be called outside of components

---

## act

`act` is a test helper to apply pending React updates before making assertions.

```jsx
import { act } from 'react';

await act(async () => {
  root.render(<App />);
});
```

**Use for:**
- Rendering components in tests
- Updating state in tests
- Asserting on rendered output

---

## cache (React 19)

`cache` lets you cache the result of a data fetch or computation.

```jsx
const getUser = cache(async (id) => {
  const user = await db.user.findUnique({ id });
  return user;
});
```

**Server Components only** - For memoizing data fetches on the server.

---

## createPortal

`createPortal` lets you render children into a different part of the DOM.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    children,
    document.getElementById('modal-root')
  );
}
```

**Use cases:**
- Modals and dialogs
- Tooltips
- Floating menus

---

## use (React 19)

`use` is a React API that lets you read the value of a resource like a Promise or context.

```jsx
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  return <p>{message}</p>;
}
```

**Key differences from hooks:**
- Can be called inside loops and conditionals
- Works with promises and context

---

## Children

`Children` lets you manipulate and transform the JSX received as the `children` prop.

```jsx
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child => (
        <div className="Row">{child}</div>
      ))}
    </div>
  );
}
```

**Methods:**
- `Children.map(children, fn)` - Map over children
- `Children.forEach(children, fn)` - Iterate over children
- `Children.count(children)` - Count children
- `Children.only(children)` - Assert single child
- `Children.toArray(children)` - Convert to flat array

---

## cloneElement

`cloneElement` creates a new React element using another element as a starting point.

```jsx
import { cloneElement } from 'react';

const clonedElement = cloneElement(element, { className: 'new-class' });
```

**Note:** Using `cloneElement` is uncommon and can lead to fragile code. Consider alternatives like render props or context.

---

## isValidElement

`isValidElement` checks whether a value is a React element.

```jsx
import { isValidElement } from 'react';

console.log(isValidElement(<p>Hello</p>)); // true
console.log(isValidElement(null)); // false
```

---

## See Also

- [Hooks](./hooks.md)
- [Components](./components.md)
- [React DOM APIs](./react-dom/apis.md)
