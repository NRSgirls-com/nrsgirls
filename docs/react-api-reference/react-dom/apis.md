# React DOM APIs

The `react-dom` package contains methods that are only supported for web applications.

---

## flushSync

Forces React to flush any pending updates inside the callback synchronously.

```jsx
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(count + 1);
  });
  // DOM is updated here
  inputRef.current.focus();
}
```

**Warning:** Using `flushSync` is uncommon and can hurt performance. Use as a last resort.

---

## createPortal

Lets you render children into a different DOM node.

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
- `children` - Anything that can be rendered with React
- `domNode` - A DOM node to render into
- `key` (optional) - A unique string to use as the portal's key

**Use cases:**
- Modals and dialogs
- Tooltips
- Floating menus
- Widgets that need to break out of container styling

---

## preconnect

Preconnects to a server you expect to load resources from.

```jsx
import { preconnect } from 'react-dom';

preconnect('https://fonts.googleapis.com');
```

---

## prefetchDNS

Prefetches DNS for a domain you expect to load resources from.

```jsx
import { prefetchDNS } from 'react-dom';

prefetchDNS('https://api.example.com');
```

---

## preload

Preloads a resource you expect to use.

```jsx
import { preload } from 'react-dom';

preload('/font.woff2', { as: 'font', type: 'font/woff2' });
preload('/hero.jpg', { as: 'image' });
```

---

## preloadModule

Preloads an ESM module you expect to use.

```jsx
import { preloadModule } from 'react-dom';

preloadModule('/heavy-component.js', { as: 'script' });
```

---

## preinit

Eagerly fetches and evaluates a script or stylesheet.

```jsx
import { preinit } from 'react-dom';

preinit('/analytics.js', { as: 'script' });
preinit('/styles.css', { as: 'style' });
```

---

## preinitModule

Eagerly fetches and evaluates an ESM module.

```jsx
import { preinitModule } from 'react-dom';

preinitModule('/module.js', { as: 'script' });
```

---

## unmountComponentAtNode (Legacy)

Removes a mounted React component from the DOM.

```jsx
import { unmountComponentAtNode } from 'react-dom';

unmountComponentAtNode(container);
```

**Note:** In React 18+, use `root.unmount()` instead.

---

## findDOMNode (Legacy)

Finds the browser DOM node for a React class component instance.

```jsx
import { findDOMNode } from 'react-dom';

const node = findDOMNode(componentInstance);
```

**Warning:** `findDOMNode` is deprecated. Use refs instead.

---

## See Also

- [Client APIs](./client-apis.md)
- [Server APIs](./server-apis.md)
- [Static APIs](./static-apis.md)
