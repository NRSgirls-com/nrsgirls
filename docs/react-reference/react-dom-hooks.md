# React DOM Hooks

These Hooks are specific to web applications that run in the browser DOM environment. They are not supported in non-browser environments like iOS, Android, or Windows applications.

---

## Form Hooks

### `useFormStatus`

Gives you status information of the last form submission.

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

**Returns an object with:**
- `pending`: A boolean indicating if the parent form is pending submission.
- `data`: A FormData object containing the data the parent form is submitting.
- `method`: The HTTP method (`'get'` or `'post'`).
- `action`: A reference to the function passed to the parent form's `action` prop.

**Caveats:**
- Must be called from a component rendered inside a `<form>`.
- Will not return status information for forms rendered in the same component.

---

## Usage Examples

### Displaying form status

```jsx
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function ContactForm() {
  async function submitForm(formData) {
    'use server';
    // Handle form submission
  }

  return (
    <form action={submitForm}>
      <input name="email" type="email" required />
      <SubmitButton />
    </form>
  );
}
```

### Reading form data being submitted

```jsx
import { useFormStatus } from 'react-dom';

function FormPreview() {
  const { pending, data } = useFormStatus();

  if (pending && data) {
    return (
      <div>
        Submitting: {data.get('name')}...
      </div>
    );
  }

  return null;
}
```

---

*See also: [React DOM Client APIs](./react-dom-client.md) | [React Hooks](./hooks.md)*
