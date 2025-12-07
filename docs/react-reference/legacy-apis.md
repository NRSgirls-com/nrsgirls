# Legacy React APIs

These APIs are exported from the `react` package, but they are not recommended for use in newly written code. See the linked modern alternatives for each API.

---

## Legacy APIs

### `Children`

The `Children` API lets you manipulate the JSX received as the `children` prop.

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

**Modern alternative:** Prefer accepting an array prop instead of using `Children` to manipulate children.

```jsx
// Modern approach
function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map((row, i) => (
        <div className="Row" key={i}>{row}</div>
      ))}
    </div>
  );
}
```

---

### `cloneElement`

Creates a new React element using another element as a starting point.

```jsx
import { cloneElement } from 'react';

function Parent({ children }) {
  return cloneElement(children, { className: 'enhanced' });
}
```

**Modern alternative:** Use render props or composition instead.

```jsx
// Modern approach with render props
function Parent({ render }) {
  return render({ className: 'enhanced' });
}

// Usage
<Parent render={(props) => <Child {...props} />} />
```

---

### `Component` (Class Component)

Base class for defining React components as JavaScript classes.

```jsx
import { Component } from 'react';

class Counter extends Component {
  state = { count: 0 };

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

**Modern alternative:** Use function components with Hooks.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

### `PureComponent`

Similar to `Component`, but skips re-renders when props are shallowly equal.

```jsx
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

**Modern alternative:** Use `memo` with function components.

```jsx
import { memo } from 'react';

const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});
```

---

### `createRef`

Creates a ref object which can contain an arbitrary value.

```jsx
import { createRef, Component } from 'react';

class MyComponent extends Component {
  inputRef = createRef();

  focusInput = () => {
    this.inputRef.current.focus();
  };

  render() {
    return <input ref={this.inputRef} />;
  }
}
```

**Modern alternative:** Use `useRef` in function components.

```jsx
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();
  }

  return <input ref={inputRef} />;
}
```

---

### `createFactory`

Creates a function that produces React elements of a given type.

```jsx
import { createFactory } from 'react';

const button = createFactory('button');
const element = button({ className: 'primary' }, 'Click me');
```

**Modern alternative:** Use JSX or `createElement`.

```jsx
// With JSX
const element = <button className="primary">Click me</button>;

// With createElement
import { createElement } from 'react';
const element = createElement('button', { className: 'primary' }, 'Click me');
```

---

### `isValidElement`

Checks whether a value is a React element.

```jsx
import { isValidElement } from 'react';

isValidElement(<div />); // true
isValidElement('Hello'); // false
```

This API is still valid but rarely needed in modern React code.

---

## Deprecated Lifecycle Methods

These class component lifecycle methods are deprecated:

| Deprecated | Modern Alternative |
|------------|-------------------|
| `componentWillMount` | Use `constructor` or `useEffect` |
| `componentWillReceiveProps` | Use `getDerivedStateFromProps` or `useEffect` |
| `componentWillUpdate` | Use `getSnapshotBeforeUpdate` or `useEffect` |

---

## Deprecated React DOM APIs

### `render` (from react-dom)

```jsx
// Deprecated
import { render } from 'react-dom';
render(<App />, document.getElementById('root'));

// Modern
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### `hydrate` (from react-dom)

```jsx
// Deprecated
import { hydrate } from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// Modern
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

### `unmountComponentAtNode` (from react-dom)

```jsx
// Deprecated
import { unmountComponentAtNode } from 'react-dom';
unmountComponentAtNode(container);

// Modern
root.unmount();
```

### `findDOMNode` (from react-dom)

```jsx
// Deprecated
import { findDOMNode } from 'react-dom';
const node = findDOMNode(componentInstance);

// Modern: Use refs
const ref = useRef(null);
// Access via ref.current
```

---

## Migration Guide

When migrating from legacy APIs:

1. **Class to Function Components** - Convert class components to function components with Hooks.
2. **createRef to useRef** - Replace `createRef` with `useRef` Hook.
3. **PureComponent to memo** - Wrap function components with `memo`.
4. **render to createRoot** - Use new React 18+ client APIs.
5. **Children API to arrays** - Pass data as array props instead of using Children utilities.

---

*See also: [React Hooks](./hooks.md) | [React APIs](./apis.md)*
