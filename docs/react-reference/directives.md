# React Directives

Directives provide instructions to bundlers compatible with React Server Components.

---

## `'use client'`

Marks source files whose components execute on the client.

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

### When to use `'use client'`

Use this directive when your component:
- Uses React Hooks like `useState`, `useEffect`, `useContext`
- Uses browser-only APIs
- Needs event handlers like `onClick`, `onChange`
- Uses effects or lifecycle methods

### Rules

- `'use client'` must be at the very top of the file, before any imports.
- `'use client'` does not need to be defined in every file. It only needs to be at the boundary.

---

## `'use server'`

Marks server-side functions that can be called from client-side code.

```jsx
'use server';

export async function createUser(formData) {
  const name = formData.get('name');
  // Database operations...
  return { success: true };
}
```

### When to use `'use server'`

Use this directive when your function:
- Performs database operations
- Accesses server-only resources
- Handles sensitive operations that shouldn't run on the client
- Is called from a Client Component as a Server Action

### Rules

- `'use server'` can be at the top of an async function body or at the top of a file.
- Server Actions must be async functions.
- Arguments and return values must be serializable.

---

## Usage with Server Components

Server Components are the default in React Server Components architecture. They run on the server and can:

- Directly access backend resources
- Keep sensitive data on the server
- Reduce client-side JavaScript bundle size

```jsx
// This is a Server Component by default
import db from './database';

async function UserProfile({ userId }) {
  const user = await db.user.findUnique({ where: { id: userId } });
  return <h1>{user.name}</h1>;
}
```

---

## Best Practices

1. **Keep client boundaries as low as possible** - Only mark components as client when necessary.

2. **Extract client logic** - If only part of a component needs client features, extract that part.

3. **Pass server data as props** - Server Components can pass data to Client Components as props.

```jsx
// Server Component
import ClientChart from './ClientChart';

async function Dashboard() {
  const data = await fetchChartData();
  return <ClientChart data={data} />;
}
```

---

*See also: [React Server Components](https://react.dev/reference/rsc/server-components)*
