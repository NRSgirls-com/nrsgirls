# React DOM APIs

The `react-dom` package contains methods that are only supported for web applications (which run in the browser DOM environment).

---

## APIs

### `createPortal`

Lets you render some children into a different part of the DOM.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}
```

**Parameters:**
- `children`: Anything that can be rendered with React.
- `domNode`: A DOM node where the portal will render.
- `key` (optional): A unique string or number to be used as the portal's key.

---

### `flushSync`

Forces React to flush any updates inside the provided callback synchronously.

```jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(count + 1);
});
// By this line, the DOM is updated
```

**Caveats:**
- Can significantly hurt performance. Use sparingly.
- May force pending Suspense boundaries to show their fallback state.
- May run pending effects and synchronously apply updates before returning.

---

### `findDOMNode` (Deprecated)

Finds the browser DOM node for a React class component instance.

```jsx
import { findDOMNode } from 'react-dom';

const node = findDOMNode(componentInstance);
```

**Note:** This API is deprecated. Use refs instead.

---

### `unmountComponentAtNode` (Deprecated)

Removes a mounted React component from the DOM.

```jsx
import { unmountComponentAtNode } from 'react-dom';

unmountComponentAtNode(container);
```

**Note:** This API is deprecated. Use `root.unmount()` instead.

---

## Resource Preloading APIs

### `prefetchDNS`

Prefetches the DNS of a server you expect to load resources from.

```jsx
import { prefetchDNS } from 'react-dom';

prefetchDNS('https://example.com');
```

### `preconnect`

Preconnects to a server you expect to request resources from.

```jsx
import { preconnect } from 'react-dom';

preconnect('https://example.com');
```

### `preload`

Prefetches a resource you expect to use.

```jsx
import { preload } from 'react-dom';

preload('/font.woff2', { as: 'font', type: 'font/woff2' });
```

### `preloadModule`

Eagerly fetches an ESM module you expect to use.

```jsx
import { preloadModule } from 'react-dom';

preloadModule('/module.js');
```

### `preinit`

Fetches and evaluates a script.

```jsx
import { preinit } from 'react-dom';

preinit('/script.js', { as: 'script' });
```

### `preinitModule`

Fetches and evaluates an ESM module.

```jsx
import { preinitModule } from 'react-dom';

preinitModule('/module.js');
```

---

## Entry Points

The `react-dom` package provides additional entry points:

- **`react-dom/client`** - Client-side rendering APIs
- **`react-dom/server`** - Server-side rendering APIs
- **`react-dom/static`** - Static HTML generation APIs

---

*See also: [React DOM Client APIs](./react-dom-client.md) | [React DOM Server APIs](./react-dom-server.md)*
