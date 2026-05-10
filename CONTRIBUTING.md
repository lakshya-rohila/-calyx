# Contributing to Calyx RN

Thank you for your interest in contributing to Calyx RN! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/-calyx.git
   cd -calyx
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Running Tests

```bash
npm test
npm run test:watch  # Watch mode
npm run test:coverage  # With coverage
```

### Type Checking

```bash
npm run typecheck
```

### Building

```bash
npm run build
```

### Running the Example App

```bash
# iOS
npm run ios

# Android
npm run android
```

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, atomic commits

3. **Add tests** for new features or bug fixes

4. **Run the test suite** and ensure all tests pass:
   ```bash
   npm test
   npm run typecheck
   ```

5. **Update documentation** if needed (README.md, JSDoc comments)

6. **Push to your fork** and create a Pull Request

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions small and focused

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

Examples:
```
feat: add timeline conflict detection
fix: month navigation boundary issue
docs: update API reference for events
test: add tests for useWeekCalendar hook
```

## Requirements for PRs

- ✅ All tests must pass
- ✅ TypeScript must compile without errors
- ✅ New features must include tests
- ✅ Code must follow existing style
- ✅ Documentation must be updated for API changes
- ✅ No breaking changes without discussion

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (React Native version, iOS/Android, etc.)
- Code sample or minimal reproduction

## Feature Requests

We welcome feature requests! Please:

- Check if it's already been requested
- Explain the use case
- Provide examples of how it would work
- Consider if it fits the library's scope

## Questions?

- Open a [GitHub Discussion](https://github.com/lakshya-rohila/-calyx/discussions)
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
