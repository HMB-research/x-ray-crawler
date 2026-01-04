# CI/CD Pipeline Guide

This document describes the continuous integration and deployment pipeline for the x-ray-crawler project.

## Overview

The CI/CD pipeline is built using GitHub Actions and includes:

1. **Continuous Integration (CI)** - Automated testing and code quality checks
2. **Security Auditing** - Regular vulnerability scanning
3. **Automated Releases** - Semantic versioning and changelog generation
4. **Package Publishing** - Automated NPM package publishing

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `master` branches
- Pull requests to `main` or `master`
- Manual dispatch

**Jobs:**

#### Test
- Runs tests on Node.js versions: 18.x, 20.x, 22.x
- Uploads test results as artifacts
- Continues on error to allow other checks to complete

#### Lint
- Runs code linting (if lint script exists)
- Uses Node.js 20.x

#### Build
- Attempts to build the package (if build script exists)
- Uses Node.js 20.x

**Status:** Badge displayed in README

### 2. Security Audit Workflow (`.github/workflows/security.yml`)

**Triggers:**
- Push to `main` or `master` branches
- Pull requests to `main` or `master`
- Daily schedule at 2 AM UTC
- Manual dispatch

**Jobs:**

#### NPM Security Audit
- Runs `npm audit` with moderate severity threshold
- Generates detailed JSON report
- Uploads audit report as artifact (90-day retention)

#### Dependency Review
- Reviews dependencies in pull requests
- Fails on moderate+ severity vulnerabilities
- Blocks GPL-3.0 and AGPL-3.0 licenses

#### CodeQL Analysis
- Static code analysis for security vulnerabilities
- JavaScript/TypeScript scanning
- Results available in Security tab

**Status:** Badge displayed in README

### 3. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- Push to `main` or `master` branches
- Manual dispatch
- Skipped if commit message contains `[skip ci]`

**Jobs:**

#### Release
- Uses semantic-release for automated versioning
- Generates changelog based on conventional commits
- Creates GitHub releases
- Updates version in package.json

#### Publish to NPM
- Publishes package to npm registry
- Includes provenance for supply chain security
- Only runs if new release was created

#### Publish to GitHub Packages
- Publishes package to GitHub Package Registry
- Fallback option for private hosting

**Commit Message Format:**

The release workflow uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `perf:` - Performance improvement (patch version bump)
- `refactor:` - Code refactoring (patch version bump)
- `docs:` - Documentation only (no release)
- `style:` - Code style changes (no release)
- `test:` - Test changes (no release)
- `build:` - Build system changes (no release)
- `ci:` - CI configuration changes (no release)
- `chore:` - Other changes (no release)
- `BREAKING CHANGE:` - Breaking change (major version bump)

**Examples:**

```
feat: add new throttling options
fix: resolve memory leak in crawler
docs: update API documentation
feat!: change default concurrency (BREAKING CHANGE)
```

**Status:** Badge displayed in README

### 4. Publish Workflow (`.github/workflows/publish.yml`)

**Triggers:**
- GitHub release published
- Manual dispatch with tag selection

**Jobs:**

#### Publish
- Runs tests before publishing
- Builds package (if build script exists)
- Publishes to NPM with provenance
- Supports dist-tags: latest, beta, alpha, next

**Manual Publishing:**

1. Go to Actions tab
2. Select "Publish Package" workflow
3. Click "Run workflow"
4. Select desired NPM tag
5. Click "Run workflow" button

## Automated Dependency Updates

### Dependabot (`.github/dependabot.yml`)

**NPM Dependencies:**
- Checks weekly (Mondays at 9 AM UTC)
- Groups minor/patch updates
- Creates separate PRs for production vs. development dependencies
- Auto-assigns to maintainers
- Labels: `dependencies`, `automated`

**GitHub Actions:**
- Checks weekly (Mondays at 9 AM UTC)
- Updates workflow actions
- Labels: `github-actions`, `automated`

## NPM Trusted Publishers (OIDC)

This project uses **npm Trusted Publishers** for secure package publishing. This eliminates the need for long-lived NPM tokens by using OpenID Connect (OIDC) for authentication.

### Benefits
- **No token management** - No secrets to store, rotate, or accidentally expose
- **Short-lived credentials** - Each publish uses workflow-specific, non-reusable credentials
- **Automatic provenance** - Supply chain security attestations included by default
- **Enhanced security** - Tokens cannot be exfiltrated or reused

### Setup Instructions

Configure trusted publishers on npmjs.com for this package:

1. **Log in to npmjs.com** and navigate to the package settings
2. **Go to "Trusted Publishers"** section
3. **Add GitHub Actions publisher** with these exact values:

   | Field | Value |
   |-------|-------|
   | Owner | `HMB-research` |
   | Repository | `x-ray-crawler` |
   | Workflow file | `release.yml` |
   | Environment | *(leave empty)* |

4. **Add a second publisher** for the publish workflow:

   | Field | Value |
   |-------|-------|
   | Owner | `HMB-research` |
   | Repository | `x-ray-crawler` |
   | Workflow file | `publish.yml` |
   | Environment | *(leave empty)* |

### Requirements

- **Node.js 22.x** - Includes npm 11.5+ required for OIDC
- **`id-token: write` permission** - Allows GitHub to generate OIDC tokens
- **`registry-url` configured** - In the `setup-node` action
- **No `NODE_AUTH_TOKEN`** - Must NOT be set (even empty string breaks OIDC)

### Troubleshooting

**404 error on publish:**
- Verify trusted publisher configuration matches workflow file exactly
- Check organization/owner name capitalization matches GitHub URL
- Ensure `package.json` has correct `repository.url`

**Authentication errors:**
- Confirm `id-token: write` permission is set
- Verify `registry-url: 'https://registry.npmjs.org'` in setup-node
- Ensure `NODE_AUTH_TOKEN` or `NPM_TOKEN` is NOT set in the workflow

## Required Secrets

### GITHUB_TOKEN
**Required for:** GitHub releases, package publishing

**Configuration:** Automatically provided by GitHub Actions (no setup needed)

> **Note:** NPM_TOKEN is no longer required. This project uses OIDC trusted publishing instead.

## Permissions

The workflows require specific permissions:

### Release Workflow
- `contents: write` - Create releases and tags
- `issues: write` - Comment on issues
- `pull-requests: write` - Comment on PRs
- `id-token: write` - NPM provenance

### Security Workflow
- `security-events: write` - CodeQL analysis
- `actions: read` - Workflow access
- `contents: read` - Code access

### Publish Workflow
- `contents: read` - Code access
- `packages: write` - GitHub Packages
- `id-token: write` - NPM provenance

## Best Practices

### For Contributors

1. **Write conventional commits** for automatic changelog generation
2. **Include tests** with new features
3. **Update documentation** when changing APIs
4. **Review security alerts** from Dependabot

### For Maintainers

1. **Monitor workflow failures** via GitHub notifications
2. **Review Dependabot PRs** regularly
3. **Maintain trusted publisher config** on npmjs.com (no tokens to rotate!)
4. **Check security audit results** weekly
5. **Merge only passing PRs** to maintain quality

### For Releases

1. **Merge to main/master** triggers automatic release
2. **Use conventional commits** for proper versioning
3. **Breaking changes** must be clearly marked
4. **Changelog** is automatically generated

## Troubleshooting

### Tests failing on CI but passing locally

- Check Node.js version (CI uses 18.x, 20.x, 22.x)
- Review environment differences
- Check for network-dependent tests (may fail in CI)

### Release not being created

- Verify commit messages follow conventional format
- Check if `[skip ci]` is in commit message
- Ensure changes warrant a release (not docs-only)
- Review semantic-release logs in workflow

### NPM publish failing

- **Trusted publisher not configured:** Verify trusted publisher is set up on npmjs.com
- **Workflow mismatch:** Ensure workflow filename matches trusted publisher config exactly
- **Version exists:** Ensure version doesn't already exist on NPM
- **OIDC issues:** Check that `id-token: write` permission is set and `NODE_AUTH_TOKEN` is NOT set
- **Registry URL:** Verify `registry-url: 'https://registry.npmjs.org'` in setup-node action

### Security audit failing

- Review `npm audit` output in workflow logs
- Update vulnerable dependencies
- Consider using `npm audit fix`
- Check if vulnerability is in dev dependencies only

## Monitoring

### Workflow Status

- **CI Badge:** Shows test status
- **Security Badge:** Shows security audit status
- **Release Badge:** Shows release workflow status

### Locations to Monitor

1. **Actions tab** - All workflow runs
2. **Security tab** - CodeQL alerts, Dependabot alerts
3. **Releases** - Published versions
4. **NPM** - Published packages

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [NPM Trusted Publishers](https://docs.npmjs.com/trusted-publishers/) - OIDC-based publishing
- [NPM Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)

## Migration Notes

### From Travis CI

This project previously used Travis CI (`.travis.yml`). The GitHub Actions workflows provide:

- ✅ Multiple Node.js version testing
- ✅ Better integration with GitHub
- ✅ Automated releases and publishing
- ✅ Advanced security scanning
- ✅ Free for public repositories

The `.travis.yml` file can be removed once GitHub Actions is verified working.
