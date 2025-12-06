# React DOM Components

React supports all browser built-in HTML and SVG components.

---

## Common Components

All built-in browser components support some common props and events.

### Common Props

```jsx
<div
  className="container"      // CSS class
  style={{ color: 'red' }}   // Inline styles (object)
  id="my-element"            // DOM id
  ref={myRef}                // Ref to DOM node
  children={<span />}        // Child elements
  dangerouslySetInnerHTML={{ __html: html }}  // Raw HTML
/>
```

### Common Events

```jsx
<button
  onClick={handleClick}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onFocus={handleFocus}
  onBlur={handleBlur}
  onKeyDown={handleKeyDown}
  onKeyUp={handleKeyUp}
/>
```

---

## Form Components

### `<form>`

The built-in form component lets you create forms with optional Server Actions.

```jsx
<form action={submitAction}>
  <input name="email" type="email" />
  <button type="submit">Submit</button>
</form>
```

**Props:**
- `action` - URL or function to handle submission
- `onSubmit` - Event handler for form submission

### `<input>`

```jsx
// Controlled input
<input
  type="text"
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

// Uncontrolled input
<input
  type="text"
  defaultValue="initial"
  ref={inputRef}
/>
```

**Types:** `text`, `email`, `password`, `number`, `tel`, `url`, `search`, `date`, `time`, `datetime-local`, `checkbox`, `radio`, `file`, `hidden`, `submit`, `reset`, `button`

### `<textarea>`

```jsx
<textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  rows={4}
  cols={50}
/>
```

### `<select>`

```jsx
<select value={selected} onChange={(e) => setSelected(e.target.value)}>
  <option value="">Select...</option>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</select>
```

### `<button>`

```jsx
<button type="submit">Submit</button>
<button type="button" onClick={handleClick}>Click me</button>
<button type="reset">Reset</button>
```

---

## Special Components

### `<link>`

Renders a stylesheet or preloads resources.

```jsx
<link rel="stylesheet" href="/styles.css" />
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" />
```

### `<meta>`

Renders document metadata.

```jsx
<meta name="description" content="My page description" />
<meta property="og:title" content="My Page" />
```

### `<script>`

Renders an inline or external script.

```jsx
<script src="/analytics.js" async />
<script dangerouslySetInnerHTML={{ __html: 'console.log("Hello")' }} />
```

### `<style>`

Renders inline styles.

```jsx
<style>{`
  .container {
    display: flex;
  }
`}</style>
```

### `<title>`

Renders the document title.

```jsx
<title>My Page Title</title>
```

---

## Media Components

### `<img>`

```jsx
<img
  src="/photo.jpg"
  alt="Description"
  width={300}
  height={200}
  loading="lazy"
/>
```

### `<video>`

```jsx
<video
  src="/video.mp4"
  controls
  width={640}
  height={360}
  poster="/thumbnail.jpg"
>
  Your browser doesn't support video.
</video>
```

### `<audio>`

```jsx
<audio src="/audio.mp3" controls>
  Your browser doesn't support audio.
</audio>
```

---

## SVG Components

React supports all SVG elements:

```jsx
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="blue" />
  <rect x="10" y="10" width="30" height="30" fill="red" />
  <path d="M 10 80 Q 95 10 180 80" stroke="black" fill="transparent" />
</svg>
```

**Note:** SVG attributes use camelCase in React: `strokeWidth`, `fillOpacity`, `viewBox`

---

## Portals

`createPortal` lets you render children into a different DOM node.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
}
```

---

## See Also

- [React Components](../components.md)
- [React DOM APIs](./apis.md)
- [HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
