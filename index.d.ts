// Type definitions for @hmb-research/x-ray-crawler
// Project: https://github.com/HMB-research/x-ray-crawler
// Definitions by: Claude AI

/// <reference types="node" />

import * as http from 'http';

/**
 * HTTP Context object containing request and response information
 */
export interface Context {
  /**
   * The URL being crawled
   */
  url: string;

  /**
   * HTTP headers for the request
   */
  headers: Record<string, string>;

  /**
   * HTTP status code of the response
   */
  status: number;

  /**
   * Response body - either raw text or parsed JSON
   */
  body: string | object | any;

  /**
   * Content-Type of the response
   */
  type: string;

  /**
   * HTTP request object
   */
  request: any;

  /**
   * HTTP response object
   */
  response: {
    header: Record<string, string>;
    [key: string]: any;
  };

  /**
   * Set response headers
   */
  set(headers: Record<string, string>): void;

  /**
   * Other properties from http-context
   */
  [key: string]: any;
}

/**
 * Callback function for crawler requests
 */
export type CrawlerCallback = (err: Error | null, ctx: Context) => void;

/**
 * Driver function that handles HTTP requests
 * @param ctx - The context object
 * @param callback - Callback to invoke with results
 */
export type Driver = (ctx: Context, callback: CrawlerCallback) => void;

/**
 * Request hook function that modifies the request before sending
 */
export type RequestHook = (request: any) => void;

/**
 * Response hook function that modifies the response after receiving
 */
export type ResponseHook = (response: any) => void;

/**
 * Options for the HTTP driver
 */
export interface DriverOptions {
  [key: string]: any;
}

/**
 * Thunk function returned when crawler is called with only a URL
 */
export interface CrawlerThunk {
  (callback: CrawlerCallback): Crawler;
}

/**
 * Main Crawler interface with all chainable methods
 */
export interface Crawler {
  /**
   * Execute a crawl request
   * @param url - URL to crawl
   * @param callback - Callback function to handle results
   * @returns The crawler instance for chaining
   */
  (url: string, callback: CrawlerCallback): Crawler;

  /**
   * Execute a crawl request (thunk style for co/generator support)
   * @param url - URL to crawl
   * @returns A thunk function that accepts a callback
   */
  (url: string): CrawlerThunk;

  /**
   * Get the current driver
   * @returns The current driver function
   */
  driver(): Driver;

  /**
   * Set a custom driver
   * @param fn - Driver function to use
   * @returns The crawler instance for chaining
   */
  driver(fn: Driver): Crawler;

  /**
   * Get the current throttle function
   * @returns The current throttle function
   */
  throttle(): () => number;

  /**
   * Set throttle rate (1 request per specified rate)
   * @param rate - Rate limit (e.g., "1s", 1000 for milliseconds)
   * @returns The crawler instance for chaining
   */
  throttle(rate: number | string): Crawler;

  /**
   * Set throttle with specific requests per rate
   * @param requests - Number of requests allowed per rate
   * @param rate - Time period (e.g., "1s", 1000 for milliseconds)
   * @returns The crawler instance for chaining
   */
  throttle(requests: number, rate: number | string): Crawler;

  /**
   * Get the current delay function
   * @returns The current delay function
   */
  delay(): () => number;

  /**
   * Set a fixed delay between requests
   * @param delay - Delay in milliseconds or string format (e.g., "1s")
   * @returns The crawler instance for chaining
   */
  delay(delay: number | string): Crawler;

  /**
   * Set a random delay range between requests
   * @param from - Minimum delay in milliseconds or string format
   * @param to - Maximum delay in milliseconds or string format
   * @returns The crawler instance for chaining
   */
  delay(from: number | string, to: number | string): Crawler;

  /**
   * Get the current timeout value
   * @returns The current timeout in milliseconds
   */
  timeout(): number | false;

  /**
   * Set request timeout
   * @param timeout - Timeout in milliseconds or string format (e.g., "30s")
   * @returns The crawler instance for chaining
   */
  timeout(timeout: number | string): Crawler;

  /**
   * Get the current concurrency value
   * @returns The current concurrency limit
   */
  concurrency(): number;

  /**
   * Set maximum number of concurrent requests
   * @param n - Maximum concurrent requests
   * @returns The crawler instance for chaining
   */
  concurrency(n: number): Crawler;

  /**
   * Get the current request hook
   * @returns The current request hook function
   */
  request(): RequestHook;

  /**
   * Set a request hook to modify requests before sending
   * @param fn - Function to process request objects
   * @returns The crawler instance for chaining
   */
  request(fn: RequestHook): Crawler;

  /**
   * Get the current response hook
   * @returns The current response hook function
   */
  response(): ResponseHook;

  /**
   * Set a response hook to modify responses after receiving
   * @param fn - Function to process response objects
   * @returns The crawler instance for chaining
   */
  response(fn: ResponseHook): Crawler;

  /**
   * Get the current request limit
   * @returns The current limit on total requests
   */
  limit(): number;

  /**
   * Set maximum total number of requests
   * @param n - Maximum total requests
   * @returns The crawler instance for chaining
   */
  limit(n: number): Crawler;
}

/**
 * Create a new crawler instance
 * @param driver - Optional custom driver function (defaults to HTTP driver)
 * @returns A new crawler instance
 */
declare function createCrawler(driver?: Driver): Crawler;

export = createCrawler;
