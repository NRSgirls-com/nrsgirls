# Rules of Hooks

Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

---

## The Two Rules

### 1. Only Call Hooks at the Top Level

Don't call Hooks inside loops, conditions, or nested functions. Always use Hooks at the top level of your React function.

### 2. Only Call Hooks from React Functions

Don't call Hooks from regular JavaScript functions. Instead, you can:
- Call Hooks from React function components
- Call Hooks from custom Hooks

---

## Rule 1: Only at the Top Level

React relies on the order in which Hooks are called. If you call Hooks conditionally, the order can change between renders, breaking React's ability to track state.

### Bad: Conditional Hook

```jsx
function Form({ isEditing }) {
  if (isEditing) {
    const [name, setName] = useState(''); // Bad!
  }

  const [submitted, setSubmitted] = useState(false);
  // ...
}
```

### Good: Condition Inside Hook Usage

```jsx
function Form({ isEditing }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Use the values conditionally, not the Hooks
  if (isEditing) {
    // use name here
  }
  // ...
}
```

### Bad: Hook in Loop

```jsx
function ItemList({ items }) {
  for (let i = 0; i < items.length; i++) {
    const [selected, setSelected] = useState(false); // Bad!
  }
  // ...
}
```

### Good: Array State for List Items

```jsx
function ItemList({ items }) {
  const [selectedItems, setSelectedItems] = useState(
    new Set()
  );

  function toggleItem(id) {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }
  // ...
}
```

### Bad: Hook in Nested Function

```jsx
function SearchResults() {
  function handleSearch(query) {
    const [results, setResults] = useState([]); // Bad!
    // ...
  }
  // ...
}
```

### Good: Hook at Component Level

```jsx
function SearchResults() {
  const [results, setResults] = useState([]);

  function handleSearch(query) {
    // Use setResults here
    fetchResults(query).then(setResults);
  }
  // ...
}
```

---

## Rule 2: Only from React Functions

Hooks only work inside React components and custom Hooks.

### Bad: Hook in Regular Function

```jsx
// This is a regular function, not a React component
function formatUserName(user) {
  const [formatted, setFormatted] = useState(''); // Bad!
  return formatted;
}
```

### Good: Hook in Component

```jsx
function UserName({ user }) {
  const [formatted, setFormatted] = useState(
    user.firstName + ' ' + user.lastName
  );
  return <span>{formatted}</span>;
}
```

### Good: Hook in Custom Hook

```jsx
// Custom Hooks must start with "use"
function useFormattedName(user) {
  const [formatted, setFormatted] = useState(
    user.firstName + ' ' + user.lastName
  );
  return formatted;
}

function UserName({ user }) {
  const formatted = useFormattedName(user);
  return <span>{formatted}</span>;
}
```

---

## Why These Rules Exist

React tracks Hooks by their call order. Consider this component:

```jsx
function Form() {
  const [name, setName] = useState('Mary');     // 1. Read name
  const [surname, setSurname] = useState('Poppins'); // 2. Read surname
  useEffect(() => { /* ... */ });              // 3. Effect
  // ...
}
```

React associates:
- First `useState` call → name state
- Second `useState` call → surname state
- `useEffect` call → effect

If you add a condition:

```jsx
function Form() {
  const [name, setName] = useState('Mary');
  if (name !== '') {
    useEffect(() => { /* ... */ }); // Bad! Changes call order
  }
  const [surname, setSurname] = useState('Poppins');
  // ...
}
```

When `name` is empty, the order changes:
- First `useState` call → name state
- Second `useState` call → **now points to wrong state!**

---

## ESLint Plugin

Use the ESLint plugin to catch violations:

```bash
npm install -D eslint-plugin-react-hooks
```

```js
// eslint.config.js
{
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
```

---

## Custom Hook Naming

Custom Hooks must start with `use` followed by a capital letter:

```jsx
// Good names
function useOnlineStatus() { /* ... */ }
function useFormInput(initialValue) { /* ... */ }
function useAuth() { /* ... */ }

// Bad names (won't be recognized as Hooks)
function getOnlineStatus() { /* ... */ }  // Not recognized
function OnlineStatus() { /* ... */ }     // Looks like component
```

---

## Valid Hook Calls

```jsx
// ✅ Top level of function component
function Component() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// ✅ Top level of custom Hook
function useCustomHook() {
  const [state, setState] = useState(0);
  return state;
}

// ✅ Early return after all Hooks
function Component({ user }) {
  const [name, setName] = useState('');

  if (!user) {
    return <LoginPrompt />;  // OK - after all Hooks
  }

  return <Profile name={name} />;
}
```

---

*See also: [ESLint Plugin React Hooks](./eslint-lints.md) | [React Hooks](./hooks.md)*
