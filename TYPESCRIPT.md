# TypeScript Guide

Complete guide for using x-ray-crawler with TypeScript.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Type Imports](#type-imports)
- [Type Safety](#type-safety)
- [Advanced Patterns](#advanced-patterns)
- [Custom Types](#custom-types)
- [Type Checking](#type-checking)
- [Troubleshooting](#troubleshooting)

## Installation

```bash
npm install @hmb-research/x-ray-crawler
```

TypeScript type definitions are included automatically. No need to install `@types/x-ray-crawler`.

## Basic Usage

### Import Syntax

```typescript
// CommonJS-style import (recommended)
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context, CrawlerCallback } from '@hmb-research/x-ray-crawler';

// Create crawler
const crawl = Crawler();
```

### Simple Example

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context, CrawlerCallback } from '@hmb-research/x-ray-crawler';

const crawl = Crawler();

crawl('http://example.com', (err: Error | null, ctx: Context) => {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log('Status:', ctx.status);      // number
  console.log('Body:', ctx.body);          // string | object
  console.log('URL:', ctx.url);            // string
});
```

## Type Imports

### All Available Types

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import {
  Context,           // HTTP context object
  Driver,            // Driver function type
  Crawler,           // Crawler interface (for type annotations)
  CrawlerCallback,   // Callback function type
  CrawlerThunk,      // Thunk function type
  RequestHook,       // Request hook function type
  ResponseHook,      // Response hook function type
  DriverOptions      // Driver options interface
} from '@hmb-research/x-ray-crawler';
```

### Type Aliases for Convenience

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context as CrawlerContext, CrawlerCallback } from '@hmb-research/x-ray-crawler';

// Avoid conflicts with other Context types
type Ctx = CrawlerContext;
```

## Type Safety

### Context Properties

The `Context` interface provides full type safety for all properties:

```typescript
crawl('http://example.com', (err: Error | null, ctx: Context) => {
  if (err) return;

  // All properties are typed
  const url: string = ctx.url;
  const status: number = ctx.status;
  const headers: Record<string, string> = ctx.headers;
  const body: string | object | any = ctx.body;
  const type: string = ctx.type;

  // Methods are typed too
  ctx.set({ 'X-Custom': 'value' });
});
```

### Type Guards for Body

Since `ctx.body` can be either a string or object, use type guards:

```typescript
crawl('http://api.example.com', (err, ctx) => {
  if (err) return;

  // Type guard for string
  if (typeof ctx.body === 'string') {
    const text: string = ctx.body;
    console.log('Text length:', text.length);
  }

  // Type guard for object
  if (typeof ctx.body === 'object' && ctx.body !== null) {
    const json: object = ctx.body;
    console.log('Keys:', Object.keys(json));
  }
});
```

### Method Overloads

All configuration methods have proper getter/setter overloads:

```typescript
const crawl = Crawler();

// Setters return Crawler for chaining
crawl.concurrency(5).timeout(3000);  // ✅ Type: Crawler

// Getters return the configured value
const current: number = crawl.concurrency();  // ✅ Type: number
const time: number | false = crawl.timeout(); // ✅ Type: number | false
```

## Advanced Patterns

### Custom Driver with Types

```typescript
import { Driver, Context, CrawlerCallback } from '@hmb-research/x-ray-crawler';

const customDriver: Driver = (ctx: Context, callback: CrawlerCallback): void => {
  // Async operation
  setTimeout(() => {
    ctx.status = 200;
    ctx.body = { data: 'test' };
    ctx.type = 'application/json';
    ctx.set({ 'Content-Type': 'application/json' });

    callback(null, ctx);
  }, 100);
};

const crawl = Crawler(customDriver);
```

### Typed Hooks

```typescript
import { RequestHook, ResponseHook } from '@hmb-research/x-ray-crawler';

const requestHook: RequestHook = (req) => {
  console.log('Modifying request:', req);
  // Add custom headers, etc.
};

const responseHook: ResponseHook = (res) => {
  console.log('Processing response:', res);
  // Log, transform, etc.
};

const crawl = Crawler()
  .request(requestHook)
  .response(responseHook);
```

### Promise Wrapper

Create a Promise-based wrapper with full type safety:

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context } from '@hmb-research/x-ray-crawler';

const crawl = Crawler();

function crawlAsync(url: string): Promise<Context> {
  return new Promise((resolve, reject) => {
    crawl(url, (err, ctx) => {
      if (err) reject(err);
      else resolve(ctx);
    });
  });
}

// Usage with async/await
async function main() {
  try {
    const ctx = await crawlAsync('http://example.com');
    console.log(ctx.status);
  } catch (err) {
    console.error(err);
  }
}
```

### Typed Crawler Class

Wrap the crawler in a class with methods:

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context, Crawler as ICrawler } from '@hmb-research/x-ray-crawler';

class MyCrawler {
  private crawler: ICrawler;

  constructor() {
    this.crawler = Crawler()
      .concurrency(5)
      .timeout(30000);
  }

  async fetch(url: string): Promise<Context> {
    return new Promise((resolve, reject) => {
      this.crawler(url, (err, ctx) => {
        if (err) reject(err);
        else resolve(ctx);
      });
    });
  }

  setConcurrency(n: number): this {
    this.crawler.concurrency(n);
    return this;
  }
}

// Usage
const crawler = new MyCrawler();
const ctx = await crawler.fetch('http://example.com');
```

## Custom Types

### Extending Context

If you have custom context properties, extend the Context type:

```typescript
import { Context as BaseContext } from '@hmb-research/x-ray-crawler';

interface MyContext extends BaseContext {
  customProperty: string;
  timestamp: number;
}

// Use in driver or hooks
const crawl = Crawler()
  .response((res) => {
    const ctx = res as MyContext;
    ctx.customProperty = 'value';
    ctx.timestamp = Date.now();
  });
```

### Typed Response Bodies

Define interfaces for expected response structures:

```typescript
import { Context } from '@hmb-research/x-ray-crawler';

interface ApiResponse {
  data: string[];
  status: 'success' | 'error';
  timestamp: number;
}

crawl('http://api.example.com', (err, ctx) => {
  if (err) return;

  // Type assertion for known response structure
  const response = ctx.body as ApiResponse;

  response.data.forEach(item => console.log(item));
  console.log('Status:', response.status);
});
```

### Generic Crawler Function

Create a generic function for type-safe responses:

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context } from '@hmb-research/x-ray-crawler';

function fetchJson<T>(url: string): Promise<T> {
  const crawl = Crawler();

  return new Promise((resolve, reject) => {
    crawl(url, (err, ctx) => {
      if (err) {
        reject(err);
      } else if (typeof ctx.body === 'object') {
        resolve(ctx.body as T);
      } else {
        reject(new Error('Response is not JSON'));
      }
    });
  });
}

// Usage with type inference
interface User {
  id: number;
  name: string;
}

const user = await fetchJson<User>('http://api.example.com/user/1');
console.log(user.name); // ✅ TypeScript knows this is a string
```

## Type Checking

### Compile TypeScript

```bash
# Check types without emitting files
npx tsc --noEmit

# Or use the npm script
npm run test:types
```

### TSConfig Settings

Recommended `tsconfig.json` settings:

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "commonjs",
    "lib": ["ES2015"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "types": ["node"]
  }
}
```

### Type-Only Imports

For better tree-shaking, use type-only imports:

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import type { Context, CrawlerCallback } from '@hmb-research/x-ray-crawler';

// Context and CrawlerCallback are only used as types
const callback: CrawlerCallback = (err, ctx) => {
  // ...
};
```

## Troubleshooting

### Import Errors

**Problem:** Cannot find module '@hmb-research/x-ray-crawler'

**Solution:**
```bash
npm install @hmb-research/x-ray-crawler
```

### Type Definition Not Found

**Problem:** Type definitions not recognized

**Solution:** Ensure you have the latest version:
```bash
npm install @hmb-research/x-ray-crawler@latest
```

Check that `node_modules/@hmb-research/x-ray-crawler/index.d.ts` exists.

### Module Resolution Issues

**Problem:** TS2307: Cannot find module

**Solution:** Check your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Type Inference Not Working

**Problem:** TypeScript can't infer types properly

**Solution:** Add explicit type annotations:
```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context, CrawlerCallback } from '@hmb-research/x-ray-crawler';

const callback: CrawlerCallback = (err, ctx) => {
  // Now ctx is properly typed as Context
};
```

### CommonJS vs ES Modules

**Problem:** Using ESM and getting import errors

**Solution:** Use the CommonJS-style import:
```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
```

This is the recommended approach for this library.

## Best Practices

### 1. Always Type Callbacks

```typescript
// ✅ Good
crawl(url, (err: Error | null, ctx: Context) => {
  // Fully typed
});

// ❌ Avoid
crawl(url, (err, ctx) => {
  // Types are inferred, but less explicit
});
```

### 2. Use Type Guards for Body

```typescript
// ✅ Good
if (typeof ctx.body === 'object' && ctx.body !== null) {
  const data = ctx.body as MyType;
}

// ❌ Avoid
const data = ctx.body as MyType; // Might fail at runtime
```

### 3. Create Wrapper Functions

```typescript
// ✅ Good - reusable, type-safe wrapper
async function fetchPage(url: string): Promise<string> {
  const ctx = await crawlAsync(url);
  return typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body);
}

// ❌ Avoid - repeating logic everywhere
crawl(url, (err, ctx) => {
  const page = typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body);
});
```

### 4. Configure Once, Use Everywhere

```typescript
// ✅ Good
const crawl = Crawler()
  .concurrency(5)
  .timeout(30000)
  .delay('100ms', '500ms');

// Use the configured instance
crawl(url1, callback1);
crawl(url2, callback2);

// ❌ Avoid - reconfiguring each time
Crawler().concurrency(5).timeout(30000)(url1, callback1);
Crawler().concurrency(5).timeout(30000)(url2, callback2);
```

## Examples

### Complete TypeScript Example

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context, Driver, CrawlerCallback } from '@hmb-research/x-ray-crawler';

// Custom driver with full type safety
const customDriver: Driver = (ctx: Context, callback: CrawlerCallback): void => {
  // Custom HTTP implementation
  callback(null, ctx);
};

// Configure crawler
const crawl = Crawler(customDriver)
  .concurrency(5)
  .timeout('30s')
  .delay('100ms', '500ms')
  .throttle(10, '1s')
  .limit(100)
  .request((req) => {
    console.log('Request:', req);
  })
  .response((res) => {
    console.log('Response:', res);
  });

// Type-safe callback
const callback: CrawlerCallback = (err: Error | null, ctx: Context): void => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }

  console.log('URL:', ctx.url);
  console.log('Status:', ctx.status);
  console.log('Body:', ctx.body);
};

// Execute crawl
crawl('http://example.com', callback);

// Promise wrapper for async/await
function crawlAsync(url: string): Promise<Context> {
  return new Promise((resolve, reject) => {
    crawl(url, (err, ctx) => {
      if (err) reject(err);
      else resolve(ctx);
    });
  });
}

// Use with async/await
async function main() {
  try {
    const ctx = await crawlAsync('http://example.com');
    console.log('Success:', ctx.status);
  } catch (err) {
    console.error('Failed:', err);
  }
}
```

---

For more information, see:
- [README](README.md) - General documentation
- [API Documentation](API.md) - Complete API reference
- [Contributing Guide](.github/CONTRIBUTING.md) - Development guidelines
