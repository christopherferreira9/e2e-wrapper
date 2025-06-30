# Contributing to E2E Wrapper

Thank you for considering contributing to the E2E Wrapper project! This guide will help you understand our development workflow and standards.

## 🔄 Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit using conventional commits (see below)
6. Push to your fork: `git push origin feat/amazing-feature`
7. Create a Pull Request

## 📝 Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent commit messages and enable automated versioning.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation changes
- **style**: Formatting changes (no code changes)
- **refactor**: Code refactoring (no feature changes or bug fixes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration
- **chore**: Other changes (tooling, etc.)
- **revert**: Reverting a previous commit

### Examples

```bash
# Adding a new feature
feat: add support for Playwright driver
feat(detox): add custom selector support

# Bug fixes
fix: handle undefined elements gracefully
fix(appium): correct XPath selector building

# Documentation
docs: update README with new examples
docs(api): add JSDoc comments to interfaces

# Tests
test: add integration tests for builder pattern
test(detox): add edge case scenarios

# Refactoring
refactor: simplify wait condition logic
refactor(core): extract common utilities
```

### Scopes (Optional)

Common scopes in this project:
- `core`: Core functionality (WaitBuilder, WaitCondition)
- `detox`: Detox-specific implementations
- `appium`: Appium-specific implementations
- `types`: TypeScript type definitions
- `drivers`: Driver implementations
- `docs`: Documentation changes
- `tests`: Test-related changes

## 🚀 Using Commitizen (Recommended)

For easier commit message creation, use Commitizen:

```bash
# Instead of git commit, use:
pnpm run commit

# This will prompt you through creating a proper conventional commit
```

## 🔧 Git Hooks

This project uses Husky to enforce quality standards:

### Pre-commit Hook
- Runs `pnpm test` to ensure all tests pass
- Prevents commits if tests fail

### Commit-msg Hook
- Validates commit message format using commitlint
- Ensures commits follow conventional commit standards

## 🧪 Testing

Before committing:

```bash
# Run all tests
pnpm test

# Build the project
pnpm build

# Check TypeScript compilation
pnpm build
```

## 📋 Pull Request Guidelines

1. **Branch naming**: Use descriptive names with type prefixes
   - `feat/add-playwright-support`
   - `fix/detox-selector-bug`
   - `docs/update-readme`

2. **PR title**: Should follow conventional commit format
   - `feat: add Playwright driver implementation`
   - `fix(detox): handle undefined element references`

3. **Description**: Include:
   - What changes were made
   - Why the changes were necessary
   - Any breaking changes
   - Testing performed

4. **Tests**: All PRs should include relevant tests

## 🔍 Code Style

- Use TypeScript for all source code
- Follow existing code patterns and naming conventions
- Add JSDoc comments for public APIs
- Ensure proper error handling
- Write comprehensive tests

## 📚 Adding New Framework Support

When adding support for a new testing framework:

1. Create a new driver in `src/drivers/`
2. Extend `BaseElementDriver`
3. Implement all required methods
4. Add comprehensive tests
5. Update documentation and examples
6. Add to the main export in `src/index.ts`

## ❓ Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Create a new issue with the `question` label
3. Reach out to maintainers

Thank you for contributing! 🎉 