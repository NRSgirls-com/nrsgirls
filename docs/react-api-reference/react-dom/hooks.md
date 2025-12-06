# React DOM Hooks

React DOM provides hooks specifically for web applications running in the browser DOM environment.

---

## useFormStatus

`useFormStatus` gives you status information of the last form submission.

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

**Returns:**
- `pending` - Boolean indicating if the form is being submitted
- `data` - FormData object containing the data being submitted
- `method` - HTTP method ('get' or 'post')
- `action` - Reference to the function passed to the parent form's action prop

**Important:** Must be called from a component rendered inside a `<form>`.

---

## useFormState

`useFormState` allows you to update state based on the result of a form action.

```jsx
import { useFormState } from 'react-dom';

async function createTodo(prevState, formData) {
  const todo = await saveTodo(formData.get('title'));
  return { message: 'Todo created!' };
}

function TodoForm() {
  const [state, formAction] = useFormState(createTodo, { message: '' });
  return (
    <form action={formAction}>
      <input name="title" />
      <button type="submit">Add</button>
      <p>{state.message}</p>
    </form>
  );
}
```

**Parameters:**
- `fn` - The function to call when the form is submitted
- `initialState` - The initial state value

**Returns:**
- `[state, formAction]` - Current state and action to pass to form

---

## Usage Patterns

### Form with validation

```jsx
'use client';

import { useFormStatus, useFormState } from 'react-dom';

async function signup(prevState, formData) {
  const email = formData.get('email');

  if (!email.includes('@')) {
    return { error: 'Invalid email address' };
  }

  await createUser(email);
  return { success: true };
}

function SignupForm() {
  const [state, formAction] = useFormState(signup, {});

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <SubmitButton />
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Account created!</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Creating account...' : 'Sign up'}
    </button>
  );
}
```

### Optimistic updates

```jsx
'use client';

import { useOptimistic } from 'react';
import { useFormState } from 'react-dom';

function MessageList({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  );

  async function formAction(formData) {
    const message = formData.get('message');
    addOptimisticMessage(message);
    await sendMessage(message);
  }

  return (
    <>
      <ul>
        {optimisticMessages.map((msg, i) => (
          <li key={i} style={{ opacity: msg.sending ? 0.5 : 1 }}>
            {msg.text}
          </li>
        ))}
      </ul>
      <form action={formAction}>
        <input name="message" />
        <button>Send</button>
      </form>
    </>
  );
}
```

---

## See Also

- [React Hooks](../hooks.md)
- [Form Actions](https://react.dev/reference/react-dom/components/form)
- [useFormStatus Reference](https://react.dev/reference/react-dom/hooks/useFormStatus)
