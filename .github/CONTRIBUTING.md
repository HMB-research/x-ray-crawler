# Contributing to x-ray-crawler

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/x-ray-crawler.git
   cd x-ray-crawler
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Run tests locally:
   ```bash
   npm test
   ```
4. Commit your changes using conventional commits (see below)

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

**Format:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat:` - A new feature (triggers minor version bump)
- `fix:` - A bug fix (triggers patch version bump)
- `perf:` - Performance improvement (triggers patch version bump)
- `refactor:` - Code refactoring (triggers patch version bump)
- `docs:` - Documentation changes only
- `style:` - Code style/formatting changes
- `test:` - Adding or updating tests
- `build:` - Build system changes
- `ci:` - CI/CD configuration changes
- `chore:` - Other changes that don't modify src or test files

**Examples:**

```bash
# Feature
git commit -m "feat: add support for custom headers"

# Bug fix
git commit -m "fix: resolve race condition in throttling"

# Breaking change
git commit -m "feat!: change default timeout to 30s

BREAKING CHANGE: The default timeout has changed from 60s to 30s.
Users relying on the old default should explicitly set timeout."

# With scope
git commit -m "fix(crawler): handle connection timeout properly"

# Documentation
git commit -m "docs: update API examples in README"
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Tests are located in the `test/` directory

**Run tests:**
```bash
npm test
```

**Note:** Some tests may require network access and might fail in restricted environments.

### Code Style

- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

## Submitting Changes

### Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Run tests** and ensure they pass
3. **Commit using conventional commits** for proper versioning
4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** on GitHub

### Pull Request Guidelines

- **Title:** Use conventional commit format
- **Description:** Clearly describe what changed and why
- **Reference issues:** Link related issues (e.g., "Fixes #123")
- **Keep it focused:** One feature/fix per PR
- **Be responsive:** Address review feedback promptly

**PR Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Conventional commit format used
- [ ] All tests pass
```

## Code Review Process

1. Maintainers will review your PR
2. CI/CD checks must pass:
   - Tests on Node.js 18.x, 20.x, 22.x
   - Security audit
   - Code quality checks
3. Address any requested changes
4. Once approved, maintainers will merge

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
- Email security concerns privately to maintainers
- Provide detailed description and reproduction steps
- Allow reasonable time for fix before public disclosure

### Security Checks

All PRs undergo automated security scanning:
- npm audit for dependency vulnerabilities
- CodeQL for code security issues
- Dependency review for new security risks

## Release Process

Releases are automated! When your PR is merged to `main`/`master`:

1. **Semantic Release** analyzes commit messages
2. **Version** is automatically bumped based on changes
3. **Changelog** is generated from commits
4. **GitHub Release** is created
5. **NPM Package** is published

You don't need to:
- Manually update version numbers
- Write changelog entries
- Create releases
- Publish to NPM

Just write good conventional commits!

## Development Tips

### Running Specific Tests

```bash
# Run tests in watch mode
npm run test:watch

# Run specific test file
npx jest test/crawler.spec.js
```

### Debugging

Add debug output:
```javascript
const debug = require('debug')('x-ray-crawler:feature-name')
debug('Some debug information')
```

Run with debug output:
```bash
DEBUG=x-ray-crawler:* npm test
```

### Common Issues

**Tests fail with network errors:**
- Check your internet connection
- Some tests require external access
- Consider mocking external requests

**Dependency conflicts:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

- **Documentation:** Check README.md and code comments
- **Issues:** Search existing issues for similar problems
- **Questions:** Open a discussion or issue
- **CI/CD:** See `.github/CICD_GUIDE.md`

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks
- Publishing private information
- Trolling or inflammatory comments
- Other unprofessional conduct

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors are recognized through:
- Git commit history
- GitHub contributors page
- Release notes (via semantic-release)

Thank you for contributing to x-ray-crawler!
