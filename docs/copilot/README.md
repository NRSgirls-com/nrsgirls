# GitHub Copilot Usage Guide

This documentation covers how to effectively use GitHub Copilot and related AI tools in the NRSgirls project.

## Table of Contents

- [Getting Started](./getting-started.md) - Setup and configuration
- [Best Practices](./best-practices.md) - Effective usage patterns
- [Prompting Guide](./prompting-guide.md) - Writing effective prompts
- [Code Review with Copilot](./code-review.md) - Using AI for reviews
- [Security Considerations](./security.md) - Keeping code secure

## Overview

GitHub Copilot is an AI pair programmer that helps you write code faster. This guide covers:

1. **Code Completion** - Inline suggestions as you type
2. **Copilot Chat** - Conversational coding assistance
3. **Code Review** - AI-powered pull request reviews
4. **Documentation** - Auto-generating docs and comments

## Quick Reference

### Keyboard Shortcuts (VS Code)

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Accept suggestion | `Tab` | `Tab` |
| Dismiss suggestion | `Esc` | `Esc` |
| Next suggestion | `Alt + ]` | `Option + ]` |
| Previous suggestion | `Alt + [` | `Option + [` |
| Open Copilot Chat | `Ctrl + Shift + I` | `Cmd + Shift + I` |
| Inline chat | `Ctrl + I` | `Cmd + I` |

### Copilot Chat Commands

```
/explain    - Explain selected code
/fix        - Suggest fixes for problems
/tests      - Generate unit tests
/doc        - Generate documentation
/optimize   - Suggest optimizations
/clear      - Clear chat history
```

## When to Use Copilot

### Recommended Uses

- **Boilerplate code** - Repetitive patterns, CRUD operations
- **Test generation** - Unit tests, test fixtures
- **Documentation** - JSDoc comments, README sections
- **Refactoring** - Converting patterns, modernizing syntax
- **Learning** - Understanding unfamiliar code/APIs

### Exercise Caution

- **Security-sensitive code** - Auth, encryption, validation
- **Business logic** - Core domain rules
- **Database queries** - Complex joins, transactions
- **API contracts** - Public interfaces, breaking changes

## Project-Specific Guidelines

For NRSgirls platform development:

1. **Always review suggestions** against our coding standards
2. **Validate TypeScript types** - Don't accept `any`
3. **Check imports** - Ensure correct package versions
4. **Test generated code** - Don't assume it works
5. **Security review** - Double-check auth/validation code

## Related Resources

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [VS Code Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Copilot Chat Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
