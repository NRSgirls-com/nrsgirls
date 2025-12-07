# React DOM Components

React supports all of the browser's built-in HTML and SVG components.

---

## Common Components

All built-in browser components support some props and events:

### Common Props

- `children`: A React node (element, string, number, portal, `null`, `undefined`, booleans, or an array).
- `dangerouslySetInnerHTML`: An object with `__html` property containing raw HTML string.
- `ref`: A ref object from `useRef` or `createRef`, or a ref callback function.
- `suppressContentEditableWarning`: A boolean to suppress the warning for elements with both `children` and `contentEditable={true}`.
- `suppressHydrationWarning`: A boolean to suppress hydration mismatch warnings.
- `style`: An object with CSS styles, e.g., `{ color: 'red', fontSize: 12 }`.

### Common Events

- **Clipboard events**: `onCopy`, `onCut`, `onPaste`
- **Composition events**: `onCompositionEnd`, `onCompositionStart`, `onCompositionUpdate`
- **Focus events**: `onFocus`, `onBlur`
- **Form events**: `onChange`, `onInput`, `onSubmit`, `onReset`, `onInvalid`
- **Keyboard events**: `onKeyDown`, `onKeyUp`, `onKeyPress`
- **Mouse events**: `onClick`, `onDoubleClick`, `onMouseDown`, `onMouseUp`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onMouseOver`, `onMouseOut`
- **Pointer events**: `onPointerDown`, `onPointerUp`, `onPointerMove`, `onPointerEnter`, `onPointerLeave`
- **Touch events**: `onTouchStart`, `onTouchMove`, `onTouchEnd`, `onTouchCancel`
- **Scroll events**: `onScroll`
- **Wheel events**: `onWheel`
- **Animation events**: `onAnimationStart`, `onAnimationEnd`, `onAnimationIteration`
- **Transition events**: `onTransitionEnd`

---

## Form Components

### `<input>`

Displays an input field. Supports controlled and uncontrolled modes.

```jsx
// Controlled input
<input value={text} onChange={(e) => setText(e.target.value)} />

// Uncontrolled input
<input defaultValue="initial" ref={inputRef} />
```

### `<textarea>`

Displays a multiline text input.

```jsx
<textarea value={text} onChange={(e) => setText(e.target.value)} />
```

### `<select>`

Displays a select box.

```jsx
<select value={selected} onChange={(e) => setSelected(e.target.value)}>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</select>
```

### `<option>`

Renders an option inside a `<select>` box.

### `<progress>`

Renders a progress indicator.

```jsx
<progress value={progress} max={100} />
```

---

## Special React DOM Components

### `<form>`

Supports the `action` prop for handling form submissions with Server Actions.

```jsx
<form action={submitAction}>
  <input name="email" />
  <button type="submit">Submit</button>
</form>
```

### `<link>`

For rendering stylesheet links. React will hoist `<link>` elements to the document `<head>`.

```jsx
<link rel="stylesheet" href="/styles.css" precedence="default" />
```

### `<meta>`

For rendering document metadata. React will hoist `<meta>` elements to the document `<head>`.

```jsx
<meta name="description" content="Page description" />
```

### `<script>`

For rendering inline or external scripts. React will hoist `<script>` elements to the document `<head>`.

```jsx
<script src="/analytics.js" async />
```

### `<style>`

For rendering inline stylesheets. React can hoist `<style>` elements to the document `<head>`.

```jsx
<style precedence="default">{`.button { color: blue; }`}</style>
```

### `<title>`

For rendering the document title. React will hoist `<title>` elements to the document `<head>`.

```jsx
<title>My Page Title</title>
```

---

## Resource Loading Functions

These functions allow you to preload resources:

- `prefetchDNS(href)` - Prefetch DNS for a domain.
- `preconnect(href)` - Preconnect to a server.
- `preload(href, options)` - Preload a resource.
- `preloadModule(href)` - Preload an ESM module.
- `preinit(href, options)` - Preinit a script.
- `preinitModule(href, options)` - Preinit an ESM module.

```jsx
import { preload, prefetchDNS } from 'react-dom';

function App() {
  prefetchDNS('https://api.example.com');
  preload('/hero.jpg', { as: 'image' });
  // ...
}
```

---

*See also: [React DOM APIs](./react-dom-apis.md)*
