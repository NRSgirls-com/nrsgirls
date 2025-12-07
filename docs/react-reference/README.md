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

- **[Hooks](./react-dom-hooks.md)** - Hooks for web applications which run in the browser DOM environment.
- **[Components](./react-dom-components.md)** - React supports all of the browser built-in HTML and SVG components.
- **[APIs](./react-dom-apis.md)** - The `react-dom` package contains methods supported only in web applications.
- **[Client APIs](./react-dom-client.md)** - The `react-dom/client` APIs let you render React components on the client (in the browser).
- **[Server APIs](./react-dom-server.md)** - The `react-dom/server` APIs let you render React components to HTML on the server.
- **[Static APIs](./react-dom-static.md)** - The `react-dom/static` APIs let you generate static HTML for React components.

---

## React Compiler

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

- **[Configuration](./compiler-configuration.md)** - Configuration options for React Compiler.
- **[Directives](./compiler-directives.md)** - Function-level directives to control compilation.
- **[Compiling Libraries](./compiler-libraries.md)** - Guide for shipping pre-compiled library code.

---

## ESLint Plugin React Hooks

The ESLint plugin for React Hooks helps enforce the Rules of React:

- **[Lints](./eslint-lints.md)** - Detailed documentation for each lint with examples.

---

## Rules of React

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

- **[Components and Hooks must be pure](./rules-purity.md)** – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
- **[React calls Components and Hooks](./rules-react-calls.md)** – React is responsible for rendering components and hooks when necessary to optimize the user experience.
- **[Rules of Hooks](./rules-of-hooks.md)** – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

---

## Legacy APIs

- **[Legacy APIs](./legacy-apis.md)** - Exported from the `react` package, but not recommended for use in newly written code.

---

## Quick Navigation

### Learn React
- [Quick Start](https://react.dev/learn)
- [Installation](https://react.dev/learn/installation)
- [Describing the UI](https://react.dev/learn/describing-the-ui)
- [Adding Interactivity](https://react.dev/learn/adding-interactivity)
- [Managing State](https://react.dev/learn/managing-state)
- [Escape Hatches](https://react.dev/learn/escape-hatches)

### API Reference
- [React APIs](./apis.md)
- [React DOM APIs](./react-dom-apis.md)

### Community
- [Code of Conduct](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md)
- [Meet the Team](https://react.dev/community/team)
- [Docs Contributors](https://react.dev/community/docs-contributors)
- [Acknowledgements](https://react.dev/community/acknowledgements)

### More
- [React Blog](https://react.dev/blog)

---

## Related Documentation

- [Next.js 16 Upgrade Guide](../tech-updates/nextjs16-upgrade.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Best Practices](../best-practices/README.md)

---

*Copyright Meta Platforms, Inc. | [React Documentation](https://react.dev)*
