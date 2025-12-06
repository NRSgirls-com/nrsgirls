# React DOM Client APIs

The `react-dom/client` APIs let you render React components on the client (in the browser).

---

## createRoot

Creates a React root for displaying content inside a browser DOM node.

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**Parameters:**
- `domNode` - A DOM element to render into
- `options` (optional) - Configuration options

**Options:**
```jsx
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {},    // Error boundary caught an error
  onUncaughtError: (error, errorInfo) => {},  // Error thrown and not caught
  onRecoverableError: (error, errorInfo) => {}, // React auto-recovered
  identifierPrefix: 'my-app',                 // Prefix for useId
});
```

---

## Root Methods

### root.render()

Displays React components inside the root.

```jsx
root.render(<App />);
```

**Notes:**
- First call clears any existing HTML content
- Subsequent calls update the DOM efficiently

### root.unmount()

Destroys a rendered tree inside a React root.

```jsx
root.unmount();
```

**Use cases:**
- Removing a React app from the page
- Cleaning up when component is removed

---

## hydrateRoot

Hydrates server-rendered HTML with React interactivity.

```jsx
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

**Parameters:**
- `domNode` - DOM element that was rendered on the server
- `reactNode` - The React node to render (must match server output)
- `options` (optional) - Configuration options

**Options:**
```jsx
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {},
  onUncaughtError: (error, errorInfo) => {},
  onRecoverableError: (error, errorInfo) => {},
  identifierPrefix: 'my-app',
});
```

---

## Usage Examples

### Basic App Setup

```jsx
// index.js
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

### With StrictMode

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### SSR Hydration

```jsx
// On the client
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

### Multiple Roots

```jsx
import { createRoot } from 'react-dom/client';

// Create multiple React roots on the same page
const headerRoot = createRoot(document.getElementById('header'));
headerRoot.render(<Header />);

const contentRoot = createRoot(document.getElementById('content'));
contentRoot.render(<MainContent />);

const footerRoot = createRoot(document.getElementById('footer'));
footerRoot.render(<Footer />);
```

### Updating a Root

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

// Initial render
root.render(<App page="home" />);

// Update with new props
root.render(<App page="about" />);
```

---

## Error Handling

### Handling caught errors

```jsx
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    console.error('Error caught by boundary:', error);
    console.log('Component stack:', errorInfo.componentStack);
  }
});
```

### Handling uncaught errors

```jsx
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // Log to error tracking service
    logError(error, errorInfo.componentStack);

    // Show error UI
    document.getElementById('root').innerHTML = '<p>Something went wrong</p>';
  }
});
```

---

## Migration from React 17

### Before (React 17)

```jsx
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

### After (React 18+)

```jsx
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## See Also

- [Server APIs](./server-apis.md)
- [React Components](../components.md)
- [Upgrading to React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
