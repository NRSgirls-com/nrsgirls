# React Built-in Components

React exposes a few built-in components that you can use in your JSX.

---

## Built-in Components

### `<Fragment>`

Wraps elements without a wrapper node. Use the `<Fragment>` component or the shorthand `<>...</>` syntax to group elements together.

```jsx
<>
  <OneChild />
  <AnotherChild />
</>
```

**Props:**
- `key` (optional): Fragments declared with the explicit `<Fragment>` syntax may have keys.

---

### `<Profiler>`

Lets you measure rendering performance of a React tree programmatically.

```jsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

**Props:**
- `id`: A string identifying the part of the UI you are measuring.
- `onRender`: A callback React calls every time components within the profiled tree update.

---

### `<StrictMode>`

Enables extra development-only checks that help you find bugs early.

```jsx
<StrictMode>
  <App />
</StrictMode>
```

StrictMode enables the following development-only behaviors:
- Components will re-render an extra time to find bugs caused by impure rendering.
- Components will re-run Effects an extra time to find bugs caused by missing Effect cleanup.
- Components will be checked for usage of deprecated APIs.

---

### `<Suspense>`

Displays a fallback while its children are loading.

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

**Props:**
- `children`: The actual UI you intend to render.
- `fallback`: An alternate UI to render in place of the actual UI if it has not finished loading.

---

## Usage Examples

### Grouping elements with Fragment

```jsx
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

### Rendering a list with keys

```jsx
function Blog({ posts }) {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

### Lazy loading with Suspense

```jsx
import { lazy, Suspense } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownPreview />
    </Suspense>
  );
}
```

---

*See also: [React DOM Components](./react-dom-components.md)*
