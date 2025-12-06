# React DOM Server APIs

The `react-dom/server` APIs let you render React components to HTML on the server.

---

## Streaming APIs (Recommended)

These APIs work in Node.js streams and Web Streams environments.

### renderToPipeableStream

Renders a React tree to a pipeable Node.js Stream.

```jsx
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(error) {
      res.statusCode = 500;
      res.send('<h1>Something went wrong</h1>');
    },
    onAllReady() {
      // Optional: called when all content is ready (for crawlers)
    },
    onError(error) {
      console.error(error);
    }
  });

  // Abort after timeout
  setTimeout(() => abort(), 10000);
});
```

**Returns:**
- `pipe(writable)` - Pipe output to a Node.js Writable stream
- `abort()` - Abort server rendering and render the rest on the client

### renderToReadableStream

Renders a React tree to a Web Readable Stream.

```jsx
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/html' }
  });
}
```

**Options:**
```jsx
const stream = await renderToReadableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  bootstrapModules: ['/app.mjs'],
  identifierPrefix: 'my-app',
  namespaceURI: 'http://www.w3.org/2000/svg',
  nonce: 'abc123',
  onError: (error) => console.error(error),
  progressiveChunkSize: 12800,
  signal: abortController.signal
});
```

---

## Static APIs

For generating static HTML without client-side interactivity.

### renderToString

Renders a React tree to an HTML string. Does not support streaming or waiting for data.

```jsx
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

**Note:** Limited Suspense support. For streaming, use `renderToPipeableStream` or `renderToReadableStream`.

### renderToStaticMarkup

Renders non-interactive React tree to an HTML string.

```jsx
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<EmailTemplate user={user} />);
```

**Use cases:**
- Email templates
- Static PDF generation
- Non-interactive HTML exports

**Note:** Output cannot be hydrated. Use only for static content.

---

## Usage Examples

### Express.js Server

```jsx
import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import App from './App.js';

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(
    <html>
      <head>
        <title>My App</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div id="root">
          <App />
        </div>
      </body>
    </html>,
    {
      bootstrapScripts: ['/client.js'],
      onShellReady() {
        res.setHeader('content-type', 'text/html');
        pipe(res);
      }
    }
  );
});

app.listen(3000);
```

### With Suspense

```jsx
import { Suspense } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

function App() {
  return (
    <html>
      <body>
        <Suspense fallback={<p>Loading...</p>}>
          <AsyncContent />
        </Suspense>
      </body>
    </html>
  );
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    // Shell (non-suspended parts) is ready
    pipe(response);
  },
  onAllReady() {
    // All content including Suspense boundaries is ready
    // Useful for crawlers that need complete content
  }
});
```

### Edge Runtime (Cloudflare Workers, Deno)

```jsx
import { renderToReadableStream } from 'react-dom/server';

export default {
  async fetch(request) {
    const stream = await renderToReadableStream(<App />, {
      bootstrapModules: ['/client.js']
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/html',
        'cache-control': 'public, max-age=3600'
      }
    });
  }
};
```

---

## Error Handling

### Catching shell errors

```jsx
const { pipe } = renderToPipeableStream(<App />, {
  onShellError(error) {
    // Critical error: shell couldn't render
    response.statusCode = 500;
    response.send('<h1>Error</h1>');
  },
  onError(error) {
    // Non-critical error during streaming
    console.error('Streaming error:', error);
  }
});
```

### Aborting rendering

```jsx
const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
  }
});

// Abort after 10 seconds
setTimeout(() => {
  abort();
}, 10000);
```

---

## See Also

- [Client APIs](./client-apis.md)
- [Static APIs](./static-apis.md)
- [React Server Components](../directives.md)
