---
title: Webhook Integration Overview
authors:
  - MiataVxbe
---
# Code Style Guide

This document outlines the coding conventions and best practices for the Integrations Bot project.

## General
- Use **ES6+** JavaScript syntax.
- Prefer `const` and `let` over `var`.
- Use strict equality (`===` and `!==`).
- Write clear, descriptive variable and function names.

## Formatting
- Indent with 2 spaces.
- Use Unix-style line endings (LF).
- Keep lines under 100 characters when possible.
- Use single quotes for strings, except in JSON.
- Place a space after keywords (e.g., `if (x) {`).

## Structure
- Group related functions and constants together.
- Export modules using `module.exports`.
- Each command or module should be in its own file.

## Comments
- Use JSDoc-style comments for functions and modules when appropriate.
- Add inline comments for complex logic.

## Git & PRs
- Write clear commit messages.
- Use feature branches for new features or fixes.
- Run tests and lint before submitting a PR.

---
For more details, see the existing codebase for examples.
