# React Built-in Components

React provides a few built-in components that you can use in your JSX.

---

## Fragment

`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node.

```jsx
<>
  <OneChild />
  <AnotherChild />
</>
```

**When to use:**
- Return multiple elements from a component
- Assign multiple elements to a variable
- Group elements with text
- Map a collection to multiple elements

**With key:**
```jsx
{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
))}
```

---

## Profiler

`<Profiler>` lets you measure rendering performance of a React tree programmatically.

```jsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

**Props:**
- `id` - A string identifying the part of the UI you are measuring
- `onRender` - A callback React calls every time components within the tree update

**onRender callback:**
```jsx
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log(`${id} took ${actualDuration}ms to render`);
}
```

---

## StrictMode

`<StrictMode>` enables extra development-only checks for the entire component tree.

```jsx
<StrictMode>
  <App />
</StrictMode>
```

**Checks enabled:**
- Components re-render an extra time to find bugs caused by impure rendering
- Effects run an extra time to find bugs caused by missing cleanup
- Deprecated APIs are flagged

**Note:** StrictMode has no effect in production builds.

---

## Suspense

`<Suspense>` lets you display a fallback while its children are loading.

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

**Props:**
- `children` - The actual UI you intend to render
- `fallback` - An alternate UI to render while loading

**Common use cases:**
- Code splitting with `lazy()`
- Data fetching with Suspense-enabled frameworks
- Server Components

**Nested Suspense boundaries:**
```jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

---

## React 19 Components

### Experimental: Activity

`<Activity>` lets you hide and show part of the UI.

```jsx
<Activity mode={isVisible ? "visible" : "hidden"}>
  <Page />
</Activity>
```

**Note:** This is an experimental feature.

---

## Creating Custom Components

Function components are the recommended way to create components:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

**Component rules:**
- Component names must start with a capital letter
- Components must be pure - given the same inputs, return the same output
- Props are read-only

**With TypeScript:**
```tsx
interface GreetingProps {
  name: string;
  className?: string;
}

function Greeting({ name, className }: GreetingProps) {
  return <h1 className={className}>Hello, {name}!</h1>;
}
```

---

## See Also

- [Your First Component](https://react.dev/learn/your-first-component)
- [Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
- [React DOM Components](./react-dom/components.md)
