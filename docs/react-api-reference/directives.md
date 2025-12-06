# React Directives

Directives provide instructions to bundlers compatible with React Server Components.

---

## 'use client'

`'use client'` marks source files whose components execute on the client.

```jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**When to use:**
- Components that use browser-only APIs
- Components that use React hooks like `useState`, `useEffect`
- Components with event handlers like `onClick`
- Third-party libraries that use client features

**Placement:**
- Must be at the top of the file, before any imports
- Only needed at the "boundary" - child components are automatically client components

---

## 'use server'

`'use server'` marks server-side functions that can be called from client-side code.

### At the top of a file

Marks all exports in the file as async Server Functions:

```jsx
'use server';

export async function createUser(formData) {
  const name = formData.get('name');
  await db.users.create({ name });
}
```

### At the top of a function

Marks an individual function as a Server Function:

```jsx
async function submitForm(formData) {
  'use server';
  await db.forms.create({ data: formData });
}
```

**Use cases:**
- Form actions
- Data mutations
- Server-side operations called from the client

**Rules:**
- Server Functions must be async
- Arguments and return values must be serializable
- Server Functions are always async from the client's perspective

---

## 'use cache' (Experimental)

`'use cache'` marks a component or function to be cached.

```jsx
async function getUser(id) {
  'use cache';
  const user = await db.user.findUnique({ id });
  return user;
}
```

**Note:** This is an experimental feature in React 19.

**Configuration with cacheLife:**
```jsx
import { cacheLife } from 'react';

async function getProducts() {
  'use cache';
  cacheLife('hours');
  return await fetchProducts();
}
```

**Cache profiles:**
- `'seconds'` - Short-lived cache
- `'minutes'` - Medium cache duration
- `'hours'` - Longer cache
- `'days'` - Extended cache
- `'weeks'` - Long-term cache
- `'max'` - Maximum cache duration

---

## Server Components vs Client Components

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Data fetching | Direct database access | Via API |
| Secrets | Can access environment vars | Cannot access secrets |
| Interactivity | No event handlers | Full interactivity |
| State | No useState/useEffect | Full hooks support |
| Bundle size | Zero client JS | Included in bundle |

### Decision tree

```
Does the component need...
├── Browser APIs (window, document)? → 'use client'
├── Event handlers (onClick, onChange)? → 'use client'
├── React state or effects? → 'use client'
├── Direct database/file access? → Server Component (default)
└── Rendering static content? → Server Component (default)
```

---

## Best Practices

### Keep client boundaries minimal

```jsx
// Good: Only the interactive part is a Client Component
function ProductPage({ id }) {
  return (
    <div>
      <ProductDetails id={id} />  {/* Server Component */}
      <AddToCartButton id={id} /> {/* Client Component */}
    </div>
  );
}
```

### Pass Server Components as children

```jsx
// ClientLayout.js
'use client';

export function ClientLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Sidebar isOpen={isOpen} />
      {children} {/* Server Components can be passed as children */}
    </div>
  );
}
```

### Compose Client and Server Components

```jsx
// ServerComponent.js - runs on server
async function ServerComponent() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// ClientComponent.js - runs on client
'use client';

function ClientComponent({ data }) {
  const [state, setState] = useState(data);
  // ...
}
```

---

## See Also

- [React Compiler Directives](./react-compiler/directives.md)
- [Server Components](https://react.dev/reference/rsc/server-components)
- [Server Functions](https://react.dev/reference/rsc/server-functions)
