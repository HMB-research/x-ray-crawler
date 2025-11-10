# API Documentation

Complete API reference for x-ray-crawler with TypeScript support.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Crawler Factory](#crawler-factory)
  - [Crawler Instance](#crawler-instance)
  - [TypeScript Types](#typescript-types)
- [Examples](#examples)

## Installation

```bash
npm install @hmb-research/x-ray-crawler
```

## Quick Start

### JavaScript

```javascript
const Crawler = require('@hmb-research/x-ray-crawler');

const crawl = Crawler()
  .concurrency(5)
  .delay('100ms', '500ms')
  .throttle(10, '1s');

crawl('http://example.com', (err, ctx) => {
  if (err) throw err;
  console.log('Status:', ctx.status);
  console.log('Body:', ctx.body);
});
```

### TypeScript

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context, CrawlerCallback } from '@hmb-research/x-ray-crawler';

const crawl = Crawler()
  .concurrency(5)
  .delay('100ms', '500ms')
  .throttle(10, '1s');

crawl('http://example.com', (err: Error | null, ctx: Context) => {
  if (err) throw err;
  console.log('Status:', ctx.status);
  console.log('Body:', ctx.body);
});
```

## API Reference

### Crawler Factory

#### `Crawler([driver])`

Creates a new crawler instance.

**Parameters:**
- `driver` (Function, optional): Custom driver function for handling requests

**Returns:** Crawler instance

**Example:**

```javascript
// Default HTTP driver
const crawl = Crawler();

// Custom driver
const crawl = Crawler((ctx, callback) => {
  // Custom implementation
  callback(null, ctx);
});
```

**TypeScript:**

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Driver, Context, CrawlerCallback } from '@hmb-research/x-ray-crawler';

const customDriver: Driver = (ctx: Context, callback: CrawlerCallback) => {
  // Custom implementation
  callback(null, ctx);
};

const crawl = Crawler(customDriver);
```

---

### Crawler Instance

All methods return the crawler instance for chaining, except when called without arguments (getter mode).

#### `crawler(url, callback)`

Execute a crawl request.

**Parameters:**
- `url` (String): URL to crawl
- `callback` (Function): Callback function `(err, ctx) => {}`

**Returns:** Crawler instance (for chaining)

**Example:**

```javascript
crawl('http://example.com', (err, ctx) => {
  if (err) throw err;
  console.log(ctx.status, ctx.body);
});
```

#### `crawler(url)`

Thunk-style invocation for generator/co support.

**Parameters:**
- `url` (String): URL to crawl

**Returns:** Function that accepts a callback

**Example:**

```javascript
const thunk = crawl('http://example.com');
thunk((err, ctx) => {
  if (err) throw err;
  console.log(ctx.status);
});
```

---

#### `.concurrency([n])`

Get or set maximum concurrent requests.

**Parameters:**
- `n` (Number, optional): Maximum concurrent requests

**Returns:**
- Without args: Current concurrency (Number)
- With args: Crawler instance (for chaining)

**Default:** `Infinity`

**Example:**

```javascript
// Set concurrency
crawl.concurrency(5);

// Get concurrency
const current = crawl.concurrency(); // 5

// Chain
crawl.concurrency(5).timeout(5000);
```

---

#### `.timeout([n])`

Get or set request timeout.

**Parameters:**
- `n` (Number | String, optional): Timeout in milliseconds or string format (e.g., "30s", "5m")

**Returns:**
- Without args: Current timeout (Number | false)
- With args: Crawler instance (for chaining)

**Default:** `false` (no timeout)

**Example:**

```javascript
// Set timeout in milliseconds
crawl.timeout(30000);

// Set timeout with string
crawl.timeout('30s');

// Get timeout
const current = crawl.timeout(); // 30000
```

---

#### `.delay([from], [to])`

Get or set delay between requests.

**Parameters:**
- `from` (Number | String, optional): Fixed delay or minimum delay
- `to` (Number | String, optional): Maximum delay (for random range)

**Returns:**
- Without args: Current delay function
- With args: Crawler instance (for chaining)

**Default:** No delay

**Example:**

```javascript
// Fixed delay
crawl.delay(1000);      // 1 second
crawl.delay('1s');      // 1 second

// Random delay range
crawl.delay(100, 500);      // 100-500ms
crawl.delay('100ms', '500ms');

// Get delay function
const delayFn = crawl.delay();
console.log(delayFn()); // Returns random delay in range
```

---

#### `.throttle([requests], [rate])`

Get or set request throttling.

**Parameters:**
- `requests` (Number, optional): Number of requests allowed per rate period
- `rate` (Number | String, optional): Time period in milliseconds or string format

**Returns:**
- Without args: Current throttle function
- With args: Crawler instance (for chaining)

**Default:** No throttling

**Example:**

```javascript
// 1 request per second
crawl.throttle('1s');
crawl.throttle(1000);

// 10 requests per second
crawl.throttle(10, '1s');
crawl.throttle(10, 1000);

// Get throttle function
const throttleFn = crawl.throttle();
```

---

#### `.limit([n])`

Get or set maximum total number of requests.

**Parameters:**
- `n` (Number, optional): Maximum total requests

**Returns:**
- Without args: Current limit (Number)
- With args: Crawler instance (for chaining)

**Default:** `Infinity`

**Example:**

```javascript
// Limit to 100 requests
crawl.limit(100);

// Get limit
const current = crawl.limit(); // 100
```

---

#### `.driver([fn])`

Get or set the driver function.

**Parameters:**
- `fn` (Function, optional): Driver function `(ctx, callback) => {}`

**Returns:**
- Without args: Current driver function
- With args: Crawler instance (for chaining)

**Example:**

```javascript
// Set custom driver
crawl.driver((ctx, callback) => {
  // Custom HTTP implementation
  callback(null, ctx);
});

// Get current driver
const currentDriver = crawl.driver();
```

---

#### `.request([fn])`

Get or set request hook.

**Parameters:**
- `fn` (Function, optional): Hook function to modify request before sending

**Returns:**
- Without args: Current request hook
- With args: Crawler instance (for chaining)

**Example:**

```javascript
// Set request hook
crawl.request((req) => {
  req.headers = req.headers || {};
  req.headers['User-Agent'] = 'CustomBot/1.0';
});

// Get current hook
const currentHook = crawl.request();
```

---

#### `.response([fn])`

Get or set response hook.

**Parameters:**
- `fn` (Function, optional): Hook function to modify response after receiving

**Returns:**
- Without args: Current response hook
- With args: Crawler instance (for chaining)

**Example:**

```javascript
// Set response hook
crawl.response((res) => {
  console.log('Response received:', res.status);
});

// Get current hook
const currentHook = crawl.response();
```

---

### TypeScript Types

#### `Context`

HTTP context object containing request and response information.

```typescript
interface Context {
  url: string;                          // Request URL
  headers: Record<string, string>;      // Request headers
  status: number;                       // Response status code
  body: string | object | any;          // Response body
  type: string;                         // Content-Type
  request: any;                         // Request object
  response: {                           // Response object
    header: Record<string, string>;
    [key: string]: any;
  };
  set(headers: Record<string, string>): void; // Set headers
  [key: string]: any;                   // Additional properties
}
```

#### `Driver`

Driver function type for custom HTTP implementations.

```typescript
type Driver = (ctx: Context, callback: CrawlerCallback) => void;
```

#### `CrawlerCallback`

Callback function type for crawler requests.

```typescript
type CrawlerCallback = (err: Error | null, ctx: Context) => void;
```

#### `RequestHook`

Request modification hook function type.

```typescript
type RequestHook = (request: any) => void;
```

#### `ResponseHook`

Response modification hook function type.

```typescript
type ResponseHook = (response: any) => void;
```

#### `Crawler`

Main crawler interface with all methods.

```typescript
interface Crawler {
  (url: string, callback: CrawlerCallback): Crawler;
  (url: string): CrawlerThunk;

  driver(): Driver;
  driver(fn: Driver): Crawler;

  concurrency(): number;
  concurrency(n: number): Crawler;

  timeout(): number | false;
  timeout(n: number | string): Crawler;

  delay(): () => number;
  delay(delay: number | string): Crawler;
  delay(from: number | string, to: number | string): Crawler;

  throttle(): () => number;
  throttle(rate: number | string): Crawler;
  throttle(requests: number, rate: number | string): Crawler;

  limit(): number;
  limit(n: number): Crawler;

  request(): RequestHook;
  request(fn: RequestHook): Crawler;

  response(): ResponseHook;
  response(fn: ResponseHook): Crawler;
}
```

## Examples

### Basic Crawling

```javascript
const Crawler = require('@hmb-research/x-ray-crawler');

const crawl = Crawler();

crawl('http://example.com', (err, ctx) => {
  if (err) throw err;
  console.log('Status:', ctx.status);
  console.log('Body:', ctx.body);
  console.log('Headers:', ctx.headers);
});
```

### Rate Limiting

```javascript
const crawl = Crawler()
  .throttle(10, '1s')    // 10 requests per second
  .delay('100ms', '500ms') // Random delay between requests
  .concurrency(5);        // Max 5 concurrent requests

crawl('http://example.com', (err, ctx) => {
  // Requests are automatically throttled
});
```

### Custom Headers

```javascript
const crawl = Crawler()
  .request((req) => {
    req.headers = {
      'User-Agent': 'MyBot/1.0',
      'Accept': 'application/json'
    };
  });

crawl('http://api.example.com', (err, ctx) => {
  console.log(ctx.body); // JSON response
});
```

### Custom Driver

```javascript
const customDriver = (ctx, callback) => {
  // Use any HTTP library
  require('https').get(ctx.url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      ctx.status = res.statusCode;
      ctx.body = body;
      callback(null, ctx);
    });
  }).on('error', callback);
};

const crawl = Crawler(customDriver);
```

### TypeScript with Custom Types

```typescript
import Crawler = require('@hmb-research/x-ray-crawler');
import { Context, Driver, CrawlerCallback } from '@hmb-research/x-ray-crawler';

interface MyResponse {
  data: string;
  timestamp: number;
}

const crawl = Crawler();

crawl('http://api.example.com', (err: Error | null, ctx: Context) => {
  if (err) throw err;

  // Type guard for JSON response
  if (typeof ctx.body === 'object') {
    const response = ctx.body as MyResponse;
    console.log(response.data, response.timestamp);
  }
});
```

### Chaining Multiple Requests

```javascript
const crawl = Crawler()
  .concurrency(3)
  .delay('1s', '2s')
  .limit(10);

const urls = [
  'http://example.com/page1',
  'http://example.com/page2',
  'http://example.com/page3'
];

urls.forEach(url => {
  crawl(url, (err, ctx) => {
    if (!err) console.log(`${url}: ${ctx.status}`);
  });
});
```

### Response Processing

```javascript
const crawl = Crawler()
  .response((res) => {
    console.log('Response headers:', res.header);
    console.log('Status:', res.statusCode);
  });

crawl('http://example.com', (err, ctx) => {
  if (err) throw err;

  // Process based on content type
  if (ctx.type.includes('application/json')) {
    console.log('JSON:', ctx.body);
  } else {
    console.log('HTML length:', ctx.body.length);
  }
});
```

---

## Time String Formats

The following methods accept time strings: `timeout()`, `delay()`, `throttle()`

**Supported formats:**
- `"1s"` - 1 second
- `"100ms"` - 100 milliseconds
- `"1m"` - 1 minute
- `"1h"` - 1 hour
- `"1d"` - 1 day

Powered by the [ms](https://www.npmjs.com/package/ms) library.

---

## Error Handling

```javascript
crawl('http://invalid-url.example', (err, ctx) => {
  if (err) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    return;
  }

  // Check HTTP errors
  if (ctx.status >= 400) {
    console.error('HTTP Error:', ctx.status);
  }
});
```

---

For more information, see the [README](README.md) and [Contributing Guide](.github/CONTRIBUTING.md).
