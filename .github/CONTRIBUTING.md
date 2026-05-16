# Contributing to schOlar

Thank you for your interest in contributing to schOlar! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/schOlar.git
   cd schOlar
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Set up development environment**:
   - Frontend: `cd frontend && npm install`
   - Contracts: `cd contracts && npm install`

## Development Workflow

### Code Standards
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

### Before Submitting a PR
1. Run tests: `npm test`
2. Lint code: `npm run lint`
3. Format code: `npm run format`
4. Update documentation if needed
5. Add your changes to a new branch

### Commit Message Format
```
type(scope): description

[optional body]
[optional footer]
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(vault): add milestone tracking functionality
```

## Pull Request Process

1. **Title**: Clear, descriptive title following commit format
2. **Description**: Explain what changed and why
3. **Testing**: Describe how changes were tested
4. **Screenshots**: Include UI changes screenshots
5. **Breaking Changes**: Note any breaking changes

## Issue Reporting

### Bug Reports
Include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, network)
- Screenshots/error messages

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

## Community Standards

- Be respectful and inclusive
- Help others learn
- Report security issues privately to maintainers
- Ask questions if unsure

## Questions?

Open an issue or reach out to the maintainers. We're here to help!
