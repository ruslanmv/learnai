# Contributing to LearnAI

First off, thank you for considering contributing to LearnAI! It's people like you that make LearnAI such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples**
- **Describe the current behavior** and explain the expected behavior
- **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** (ESLint + Prettier)
3. **Add JSDoc comments** to new functions/classes
4. **Update documentation** as needed
5. **Test your changes** locally
6. **Write clear commit messages**
7. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/learnai.git
cd learnai

# Install dependencies
make install

# Setup environment
make setup-env

# Start development
make dev
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new files
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Prefer functional programming patterns
- Use async/await over promises

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Add JSDoc comments describing the component purpose

### File Organization

```
app/          - Next.js pages and API routes
components/   - Reusable React components
lib/          - Utility functions and configurations
types/        - TypeScript type definitions
utils/        - Helper functions
```

### Commit Messages

Follow the conventional commits specification:

```
type(scope): subject

body

footer
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality
fix(api): resolve booking creation error
docs(readme): update installation instructions
```

## Testing

Before submitting a pull request:

```bash
# Run linter
make lint

# Run type checking
make type-check

# Run all checks
make validate
```

## Code Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR

## Recognition

Contributors will be recognized in:
- The README.md file
- GitHub contributors page
- Release notes

## Questions?

Feel free to reach out:
- Open an issue with your question
- Email: support@ruslanmv.com

Thank you for contributing to LearnAI!
