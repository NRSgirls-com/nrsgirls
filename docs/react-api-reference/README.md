# React API Reference Overview

This section provides detailed reference documentation for working with React. For an introduction to React, please visit the [Learn React](https://react.dev/learn) section.

The React reference documentation is broken down into functional subsections:

---

## React

Programmatic React features:

- **[Hooks](./hooks.md)** - Use different React features from your components.
- **[Components](./components.md)** - Built-in components that you can use in your JSX.
- **[APIs](./apis.md)** - APIs that are useful for defining components.
- **[Directives](./directives.md)** - Provide instructions to bundlers compatible with React Server Components.

---

## React DOM

React DOM contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

- **[Hooks](./react-dom/hooks.md)** - Hooks for web applications which run in the browser DOM environment.
- **[Components](./react-dom/components.md)** - React supports all of the browser built-in HTML and SVG components.
- **[APIs](./react-dom/apis.md)** - The `react-dom` package contains methods supported only in web applications.
- **[Client APIs](./react-dom/client-apis.md)** - The `react-dom/client` APIs let you render React components on the client (in the browser).
- **[Server APIs](./react-dom/server-apis.md)** - The `react-dom/server` APIs let you render React components to HTML on the server.
- **[Static APIs](./react-dom/static-apis.md)** - The `react-dom/static` APIs let you generate static HTML for React components.

---

## React Compiler

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

- **[Configuration](./react-compiler/configuration.md)** - Configuration options for React Compiler.
- **[Directives](./react-compiler/directives.md)** - Function-level directives to control compilation.
- **[Compiling Libraries](./react-compiler/compiling-libraries.md)** - Guide for shipping pre-compiled library code.

---

## ESLint Plugin React Hooks

The ESLint plugin for React Hooks helps enforce the Rules of React:

- **[Lints](./eslint-plugin/lints.md)** - Detailed documentation for each lint with examples.

---

## Rules of React

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

### Components and Hooks must be pure

Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.

**Key principles:**
- Components should be idempotent - they should always return the same output given the same inputs
- Side effects should run outside of render (in event handlers or useEffect)
- Props and state should be treated as immutable

### React calls Components and Hooks

React is responsible for rendering components and hooks when necessary to optimize the user experience.

**Key principles:**
- Don't call components as regular functions - let React render them
- Don't call hooks outside of React functions
- React decides when to re-render based on state and props changes

### Rules of Hooks

Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

**Key rules:**
1. **Only call Hooks at the top level** - Don't call Hooks inside loops, conditions, or nested functions
2. **Only call Hooks from React functions** - Call Hooks from React function components or custom Hooks

---

## Legacy APIs

Legacy APIs are exported from the `react` package but are not recommended for use in newly written code:

- Class components (prefer function components with Hooks)
- `createClass` (deprecated)
- `PropTypes` (use TypeScript instead)
- String refs (use `useRef` or callback refs)
- `findDOMNode` (use refs instead)

---

## Quick Reference

### Most Used Hooks

| Hook | Purpose |
|------|---------|
| `useState` | Add state to function components |
| `useEffect` | Perform side effects in function components |
| `useContext` | Subscribe to React context |
| `useRef` | Reference a value that doesn't need rendering |
| `useMemo` | Cache expensive calculations |
| `useCallback` | Cache function definitions |
| `useReducer` | Manage complex state logic |

### React 19+ New Features

| Feature | Description |
|---------|-------------|
| `use` | Read resources in render (promises, context) |
| `useFormStatus` | Get form submission status |
| `useFormState` | Manage form state with actions |
| `useOptimistic` | Show optimistic UI updates |
| Server Components | Components that run only on the server |
| Server Actions | Functions that run on the server |

---

## Related Documentation

- [Best Practices](../best-practices/README.md) - Code standards and React/Next.js patterns
- [Next.js 16 Upgrade](../tech-updates/nextjs16-upgrade.md) - React 19.2 compatibility notes
- [Official React Documentation](https://react.dev) - Complete reference on react.dev

---

## External Resources

- [React Official Documentation](https://react.dev)
- [React GitHub Repository](https://github.com/facebook/react)
- [React Blog](https://react.dev/blog)
- [React Community](https://react.dev/community)
