
---
title: Contributing Guide
authors:
	- MiataVxbe
hide:
	- navigation
---

# Contributing

Thank you for your interest in contributing to Integrations Bot! This guide will help you get started.

## Getting Started

1. **Fork the repository** and clone it locally.
2. **Install dependencies** using `npm install`.
3. **Set up your config** by copying `src/config/template.config.json` to `src/config/config.json` and editing as needed.
4. **Run the bot** locally to test your changes.

## Making Changes

- Create a new branch for your feature or bugfix.
- Follow the [Code Style Guide](code-style.md).
- Add or update documentation as needed.
- Test your changes before committing.

## Submitting Changes

1. Push your branch to your fork.
2. Open a pull request with a clear description of your changes.
3. Address any review feedback.

## Commit Message Guidelines

Please use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages. This helps keep the project history readable and automates changelogs and releases.

### Quick examples
* `feat: new feature`
* `fix(scope): bug in scope`
* `feat!: breaking change` / `feat(scope)!: rework API`
* `chore(deps): update dependencies`

### Commit types
* `build`: Changes that affect the build system or external dependencies (example scopes: gulp, npm)
* `ci`: Changes to CI configuration files and scripts (example scopes: Travis, GitHub Actions)
* **`chore`**: Changes which don't change source code or tests (e.g. build process, tools, libraries)
* `docs`: Documentation only changes
* **`feat`**: A new feature
* **`fix`**: A bug fix
* `perf`: A code change that improves performance
* `refactor`: Code change that neither fixes a bug nor adds a feature
* `revert`: Revert something
* `style`: Changes that do not affect the meaning of the code (whitespace, formatting, etc)
* `test`: Adding missing tests or correcting existing tests

### Reminders
* Put a newline before the extended commit body
* More details at [conventionalcommits.org](https://www.conventionalcommits.org/)

## Best Practices

- Keep pull requests focused and concise.
- Write clear commit messages.
- Be respectful and collaborative in code reviews.

---
For questions, open an issue or contact the maintainers.
