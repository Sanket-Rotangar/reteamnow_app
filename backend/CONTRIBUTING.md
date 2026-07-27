# Contributing to ReteamNow Backend

Thank you for considering contributing to the ReteamNow Backend! We welcome contributions of all kinds, including bug fixes, feature additions, documentation improvements, and more.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/reteamnow-backend.git`
3. Install dependencies: `npm install`
4. Create a `.env` file from the example: `cp .env.example .env`
5. Start the development server: `npm run dev`

## Development Workflow

1. Create a new branch for your work: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes
4. Commit with a descriptive message
5. Push to your fork
6. Open a Pull Request

### Branch Naming

- `feature/description` — New features
- `fix/description` — Bug fixes
- `docs/description` — Documentation changes
- `refactor/description` — Code refactoring
- `chore/description` — Maintenance tasks

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Write clear, descriptive commit messages
- Update documentation if needed
- Ensure all tests pass
- Add tests for new functionality
- Follow the existing code style

## Code Style

This project uses:

- **ESLint** for code quality checks
- **Prettier** for code formatting

Before submitting a PR, run:

```bash
npx eslint . --fix
npx prettier --write .
```

### Guidelines

- Use `const` by default, `let` only when reassignment is needed
- Use ES module syntax (`import`/`export`)
- Use meaningful variable and function names
- Add JSDoc comments for exported functions
- Keep functions small and focused on a single responsibility
- Handle errors appropriately using try/catch

## Testing

We use Jest for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npx jest --watch
```

When adding new features, include appropriate tests.

## Issue Reporting

When reporting issues, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Environment details (Node version, OS, etc.)
- Any relevant logs or error messages

---

Thank you for contributing! 🎉
