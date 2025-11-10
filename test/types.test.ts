/**
 * TypeScript Type Definitions Test
 *
 * This file validates that all TypeScript type definitions are correct.
 * It will be type-checked by running: npm run test:types
 */

import Crawler = require('..');
import { Context, Driver, CrawlerCallback } from '..';

// Test 1: Basic crawler creation
const crawler = Crawler();

// Test 2: Crawler with custom driver
const customDriver: Driver = (ctx, callback) => {
  ctx.status = 200;
  ctx.body = 'test';
  callback(null, ctx);
};

const crawlerWithDriver = Crawler(customDriver);

// Test 3: Basic crawling with callback
crawler('http://example.com', (err, ctx) => {
  if (err) {
    console.error(err.message);
    return;
  }

  // Test context properties
  const url: string = ctx.url;
  const status: number = ctx.status;
  const body: string | object | any = ctx.body;
  const headers: Record<string, string> = ctx.headers;
  const type: string = ctx.type;
  const request: any = ctx.request;
  const response = ctx.response;
  const responseHeader: Record<string, string> = response.header;

  console.log(url, status, body, headers, type, request, responseHeader);
});

// Test 4: Thunk style (co/generator support)
const thunk = crawler('http://example.com');
thunk((err, ctx) => {
  if (err) return;
  console.log(ctx.url);
});

// Test 5: Chaining methods
crawler
  .concurrency(5)
  .timeout(5000)
  .timeout('5s')
  .delay(100)
  .delay('100ms')
  .delay(100, 500)
  .delay('100ms', '500ms')
  .throttle(1000)
  .throttle('1s')
  .throttle(10, 1000)
  .throttle(10, '1s')
  .limit(100)
  .driver(customDriver)
  .request((req) => {
    console.log('Request hook:', req);
  })
  .response((res) => {
    console.log('Response hook:', res);
  });

// Test 6: Getting configuration values
const currentDriver: Driver = crawler.driver();
const currentConcurrency: number = crawler.concurrency();
const currentTimeout: number | false = crawler.timeout();
const currentLimit: number = crawler.limit();
const currentThrottle: () => number = crawler.throttle();
const currentDelay: () => number = crawler.delay();
const currentRequest = crawler.request();
const currentResponse = crawler.response();

console.log(
  currentDriver,
  currentConcurrency,
  currentTimeout,
  currentLimit,
  currentThrottle,
  currentDelay,
  currentRequest,
  currentResponse
);

// Test 7: Complex callback handling
const callback: CrawlerCallback = (err: Error | null, ctx: Context) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }

  // Access all context properties
  console.log('URL:', ctx.url);
  console.log('Status:', ctx.status);
  console.log('Body:', ctx.body);
  console.log('Type:', ctx.type);
  console.log('Headers:', ctx.headers);

  // Use set method
  ctx.set({ 'X-Custom-Header': 'value' });
};

crawler('http://example.com', callback);

// Test 8: Custom driver implementation
const myDriver: Driver = (ctx: Context, fn: CrawlerCallback): void => {
  // Simulate async operation
  setTimeout(() => {
    ctx.status = 200;
    ctx.body = { data: 'test' };
    ctx.type = 'application/json';
    ctx.set({ 'content-type': 'application/json' });
    fn(null, ctx);
  }, 100);
};

const crawlerWithCustomDriver = Crawler(myDriver);

// Test 9: Error handling
crawler('http://invalid-url', (err, ctx) => {
  if (err) {
    const errorMessage: string = err.message;
    const errorStack: string | undefined = err.stack;
    console.error(errorMessage, errorStack);
  } else {
    console.log(ctx.status);
  }
});

// Test 10: Fluent interface chaining with execution
crawler
  .concurrency(10)
  .delay(50, 150)
  .timeout(10000)
  .throttle(5, '1s')
  .limit(50)('http://example.com', (err, ctx) => {
    if (!err) {
      console.log('Success:', ctx.url);
    }
  });

// Test 11: Request and response hooks with proper types
crawler
  .request((req) => {
    // req is any type, as the internal structure varies
    console.log('Modifying request:', req);
  })
  .response((res) => {
    // res is any type, as the internal structure varies
    console.log('Modifying response:', res);
  });

// Test 12: Multiple crawler instances
const crawler1 = Crawler();
const crawler2 = Crawler();
const crawler3 = Crawler(customDriver);

crawler1.concurrency(5);
crawler2.concurrency(10);
crawler3.timeout(5000);

// Test 13: Context manipulation
const contextCallback: CrawlerCallback = (err, ctx) => {
  if (!err) {
    // All context properties are accessible
    ctx.url = 'http://modified.com';
    ctx.headers['User-Agent'] = 'CustomAgent';
    ctx.set({ 'Authorization': 'Bearer token' });

    if (typeof ctx.body === 'string') {
      const textBody: string = ctx.body;
      console.log(textBody);
    } else if (typeof ctx.body === 'object') {
      const jsonBody: object = ctx.body;
      console.log(jsonBody);
    }
  }
};

crawler('http://example.com', contextCallback);

// Test 14: Type guards for body
crawler('http://example.com', (err, ctx) => {
  if (!err) {
    if (typeof ctx.body === 'string') {
      // TypeScript knows ctx.body is string here
      const length: number = ctx.body.length;
      console.log(length);
    } else if (typeof ctx.body === 'object' && ctx.body !== null) {
      // TypeScript knows ctx.body is object here
      const keys: string[] = Object.keys(ctx.body);
      console.log(keys);
    }
  }
});

// Test 15: Verify return type of crawler call
const chainedCrawler = crawler('http://example.com', (err, ctx) => {
  console.log(err, ctx);
});

// Should be able to chain again
chainedCrawler
  .timeout(5000)
  ('http://another-url.com', (err, ctx) => {
    console.log(err, ctx);
  });

console.log('TypeScript type definitions are valid!');
