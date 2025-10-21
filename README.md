# x-ray Crawler

[![CI](https://github.com/HMB-research/x-ray-crawler/actions/workflows/ci.yml/badge.svg)](https://github.com/HMB-research/x-ray-crawler/actions/workflows/ci.yml)
[![Security Audit](https://github.com/HMB-research/x-ray-crawler/actions/workflows/security.yml/badge.svg)](https://github.com/HMB-research/x-ray-crawler/actions/workflows/security.yml)
[![Release](https://github.com/HMB-research/x-ray-crawler/actions/workflows/release.yml/badge.svg)](https://github.com/HMB-research/x-ray-crawler/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/%40hmb-research%2Fx-ray-crawler.svg)](https://badge.fury.io/js/%40hmb-research%2Fx-ray-crawler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Friendly web crawler for [x-ray](http://github.com/lapwinglabs/x-ray).

## Features

- Extensible drivers
- Request and response hooks
- Rate limiting
- Delayed requests
- Concurrency support
- Request timeout
- Total request limiting

## Example

```js
function http(ctx, fn) {
  superagent.get(ctx.url, fn)
}

var crawl = Crawler(http)
  .throttle(3, '1s')
  .delay('1s', '10s')
  .concurrency(2)
  .limit(20)

crawl('http://lapwinglabs.com', function(err, ctx) {
  if (err) throw err
  console.log('status code: %s', ctx.status)
  console.log('status body: %s', ctx.body)
})
```

## Installation

```bash
npm install @hmb-research/x-ray-crawler
```

## Test

> **Note:** Work in progress

```js
npm test
```

## Development

### CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Automated Testing:** Tests run on Node.js 18.x, 20.x, and 22.x
- **Security Auditing:** Daily vulnerability scans and dependency reviews
- **Automated Releases:** Semantic versioning based on conventional commits
- **NPM Publishing:** Automatic package publishing on release

See [CI/CD Guide](.github/CICD_GUIDE.md) for detailed documentation.

### Contributing

We welcome contributions! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for details on:

- Setting up your development environment
- Coding standards and commit message conventions
- Pull request process
- Testing guidelines

**Quick Start for Contributors:**

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/x-ray-crawler.git
cd x-ray-crawler

# Install dependencies
npm install

# Run tests
npm test

# Create a feature branch
git checkout -b feature/my-feature

# Make changes and commit using conventional commits
git commit -m "feat: add new feature"

# Push and create a pull request
git push origin feature/my-feature
```

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning:

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

Example: `feat: add support for custom headers`

## License

(The MIT License)

Copyright (c) 2015 Matthew Mueller <matt@lapwinglabs.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
