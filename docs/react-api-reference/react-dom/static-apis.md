# React DOM Static APIs

The `react-dom/static` APIs let you generate static HTML for React components.

---

## prerender

Prerenders a React tree to static HTML with a stream.

```jsx
import { prerender } from 'react-dom/static';

async function generateStaticHTML() {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return prelude;
}
```

**Parameters:**
- `reactNode` - A React node to render to HTML
- `options` - Options object with configuration

**Returns a Promise with:**
- `prelude` - A Web Readable Stream of HTML

---

## prerenderToNodeStream

Prerenders a React tree to static HTML with a Node.js Stream.

```jsx
import { prerenderToNodeStream } from 'react-dom/static';

async function generateStaticHTML() {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return prelude;
}
```

**Returns a Promise with:**
- `prelude` - A Node.js Readable Stream of HTML

---

## Options

Both `prerender` and `prerenderToNodeStream` accept the same options:

```jsx
const { prelude } = await prerender(<App />, {
  // Scripts to bootstrap the client
  bootstrapScripts: ['/main.js'],

  // ES modules to bootstrap the client
  bootstrapModules: ['/app.mjs'],

  // Prefix for React-generated IDs
  identifierPrefix: 'my-app',

  // Namespace for XML (e.g., SVG)
  namespaceURI: 'http://www.w3.org/2000/svg',

  // CSP nonce for inline scripts
  nonce: 'abc123',

  // Error handler
  onError: (error) => {
    console.error('Prerender error:', error);
  },

  // Size of progressive chunks
  progressiveChunkSize: 12800,

  // AbortSignal for cancellation
  signal: abortController.signal
});
```

---

## Usage Examples

### Static Site Generation

```jsx
import { prerender } from 'react-dom/static';
import { writeFile } from 'fs/promises';

async function buildPage(url, Component) {
  const { prelude } = await prerender(<Component />, {
    bootstrapScripts: ['/hydrate.js']
  });

  // Convert stream to string
  const reader = prelude.getReader();
  let html = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    html += new TextDecoder().decode(value);
  }

  await writeFile(`./dist${url}.html`, html);
}

// Build all pages
await buildPage('/index', HomePage);
await buildPage('/about', AboutPage);
await buildPage('/contact', ContactPage);
```

### Node.js Build Script

```jsx
import { prerenderToNodeStream } from 'react-dom/static';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

async function buildPage(pagePath, Component) {
  const { prelude } = await prerenderToNodeStream(<Component />, {
    bootstrapScripts: ['/app.js']
  });

  const outputStream = createWriteStream(`./build${pagePath}.html`);
  await pipeline(prelude, outputStream);
}
```

### With Suspense Data Loading

```jsx
import { prerender } from 'react-dom/static';
import { Suspense } from 'react';

async function Page() {
  return (
    <html>
      <body>
        <h1>My Page</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <AsyncContent />
        </Suspense>
      </body>
    </html>
  );
}

// prerender waits for all Suspense boundaries to resolve
const { prelude } = await prerender(<Page />);
```

---

## Differences from Server APIs

| Feature | `prerender` / `prerenderToNodeStream` | `renderToPipeableStream` / `renderToReadableStream` |
|---------|---------------------------------------|-----------------------------------------------------|
| Use case | Build-time static generation | Runtime server rendering |
| Streaming | Waits for all content | Streams progressively |
| Suspense | Waits for all data | Streams as data loads |
| Output | Complete HTML | Progressive HTML chunks |

---

## When to Use Static APIs

**Use static APIs when:**
- Building static sites at compile time
- Generating HTML for pages that don't change often
- Pre-rendering pages for CDN caching
- All data is available at build time

**Use server APIs when:**
- Content is dynamic per-request
- Need progressive streaming for fast TTFB
- Using personalized content
- Data fetching happens at runtime

---

## See Also

- [Server APIs](./server-apis.md)
- [Client APIs](./client-apis.md)
- [Suspense](../components.md#suspense)
