# CI/CD Documentation

This document describes the Continuous Integration and Continuous Deployment setup for the e2e-wrapper project.

## 🔄 Workflows Overview

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

**Jobs:**

#### Test Job
- **Matrix Strategy**: Tests on Node.js 18.x and 20.x
- **Steps:**
  1. Checkout code
  2. Setup pnpm and Node.js with caching
  3. Install dependencies (`pnpm install --frozen-lockfile`)
  4. Run tests (`pnpm test`)
  5. Build project (`pnpm build`)
  6. Upload coverage reports (Node.js 20.x only)

#### Lint Commits Job
- **Runs only on**: Pull requests
- **Purpose**: Validates all commit messages in the PR against conventional commit format
- **Steps:**
  1. Checkout code with full history
  2. Setup pnpm and Node.js
  3. Install dependencies
  4. Lint commit messages using commitlint

#### Type Check Job
- **Purpose**: Validates TypeScript types without emitting files
- **Steps:**
  1. Checkout code
  2. Setup pnpm and Node.js
  3. Install dependencies
  4. Run TypeScript type checking (`tsc --noEmit`)

### 2. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- Manual trigger via `workflow_dispatch`

**Inputs:**
- `version`: Version to release (e.g., 1.0.0, 1.1.0, 2.0.0)
- `release_type`: Choose between `release` or `prerelease`
- `prerelease_tag`: Optional tag for prereleases (e.g., alpha, beta, rc)

**Steps:**
1. **Quality Checks**: Run tests and build
2. **Version Bump**: Update package.json version
3. **Git Operations**: Commit version bump and create tag
4. **GitHub Release**: Create release with generated changelog
5. **NPM Publish**: Publish to npm registry
6. **Summary**: Generate release summary

### 3. Dependabot Auto-merge (`.github/workflows/dependabot.yml`)

**Purpose**: Automatically approve and merge Dependabot patch updates

**Behavior:**
- Auto-approves patch updates (semver-patch)
- Auto-merges approved patch updates
- Manual review required for minor/major updates

### 4. E2E Tests Workflow (`.github/workflows/e2e-test.yml`)

**Triggers:**
- Manual trigger via `workflow_dispatch`

**Inputs:**
- `platform`: Platform to run tests on (`android` or `ios`)

**Jobs:**
- **e2e-test**: Builds and runs Detox tests for the example app
  - **Runs on**: `ubuntu-latest` for Android, `macos-latest` for iOS
  - **Steps:**
    1. Set up environment (Node.js, PNPM)
    2. Build e2e-wrapper package
    3. Platform-specific setup (Android emulator or iOS simulator)
    4. Build the TestApp for the chosen platform
    5. Run Detox tests
    6. Archive test artifacts

**Usage:**
1. Go to your GitHub repository
2. Navigate to Actions → E2E Tests workflow
3. Click "Run workflow"
4. Select platform (android or ios)
5. Click "Run workflow"

**Artifacts:**
- Screenshots of failed tests are automatically captured
- All artifacts are uploaded and available in the Actions tab

## 🔧 Setup Requirements

### GitHub Secrets

You need to configure these secrets in your GitHub repository:

#### Required Secrets:
- `NPM_TOKEN`: NPM access token for publishing packages
  - Create at: https://www.npmjs.com/settings/tokens
  - Required scopes: `Automation` or `Publish`

#### Optional Secrets:
- `CODECOV_TOKEN`: For coverage reporting (if using Codecov)

### Setting up Secrets:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the required secrets

### NPM Token Setup:

```bash
# Login to npm
npm login

# Create an automation token
npm token create --type=automation

# Copy the token and add it as NPM_TOKEN secret in GitHub
```

## 🚀 Release Process

### 1. Automated Release (Recommended)

1. Go to your GitHub repository
2. Navigate to Actions → Release workflow
3. Click "Run workflow"
4. Fill in the inputs:
   - **Version**: e.g., `1.2.0`
   - **Release type**: `release` or `prerelease`
   - **Prerelease tag**: (optional) e.g., `beta`

### 2. Manual Release

```bash
# Ensure you're on main branch with latest changes
git checkout main
git pull origin main

# Run tests
pnpm test

# Build project
pnpm build

# Update version (this will also create a git tag)
npm version patch  # or minor, major
# npm version 1.2.0  # specific version

# Push changes and tags
git push origin main --tags

# Publish to npm
pnpm publish --access public
```

## 🔍 Monitoring

### CI Status
- Check the "Actions" tab in your repository
- Green checkmarks indicate successful runs
- Red X marks indicate failures

### Release Status
- Releases appear in the "Releases" section
- NPM packages appear at: https://www.npmjs.com/package/e2e-wrapper

### Dependabot
- Dependabot PRs appear automatically
- Patch updates are auto-merged
- Minor/major updates require manual review

## 📋 Best Practices

### For Contributors:
1. **Always use conventional commits** - CI will check this
2. **Ensure tests pass locally** before pushing
3. **Keep PRs focused** on single features/fixes

### For Maintainers:
1. **Use the release workflow** for consistent releases
2. **Review dependabot PRs** for major updates
3. **Monitor CI failures** and fix promptly

### Branch Protection Rules (Recommended):
- Require status checks to pass
- Require up-to-date branches
- Require review for PRs
- Include administrators in restrictions

## 🛠️ Troubleshooting

### Common Issues:

#### CI Fails on "Install dependencies"
- Check if `pnpm-lock.yaml` is committed
- Ensure Node.js version compatibility

#### Release Fails on NPM Publish
- Check if `NPM_TOKEN` secret is set correctly
- Verify package name is available on npm
- Ensure version hasn't been published already

#### Commit Lint Fails
- Check commit message format: `type: description`
- Use `pnpm run commit` for guided commits
- See conventional commits documentation

#### Tests Fail in CI but Pass Locally
- Check Node.js version differences
- Verify environment variables
- Check timezone/locale differences

## 📈 Future Enhancements

Potential improvements to consider:

- **Semantic Release**: Automate version bumping based on conventional commits
- **E2E Testing**: Add end-to-end tests with actual frameworks
- **Performance Testing**: Benchmark performance across versions
- **Security Scanning**: Add vulnerability scanning
- **Multi-platform Testing**: Test on Windows/macOS
- **Coverage Gates**: Enforce minimum coverage thresholds 