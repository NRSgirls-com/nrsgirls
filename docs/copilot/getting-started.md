# Getting Started with GitHub Copilot

## Prerequisites

- GitHub account with Copilot access (Individual, Business, or Enterprise)
- VS Code, JetBrains IDE, or compatible editor
- Active internet connection

## Installation

### VS Code

1. **Install the Extension**
   ```
   1. Open VS Code
   2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   3. Search "GitHub Copilot"
   4. Install "GitHub Copilot" extension
   5. Install "GitHub Copilot Chat" extension
   ```

2. **Sign In**
   ```
   1. Click the Copilot icon in the status bar
   2. Select "Sign in to GitHub"
   3. Complete authentication in browser
   4. Authorize VS Code to use Copilot
   ```

3. **Verify Installation**
   - Open a code file
   - Start typing - suggestions should appear
   - Gray text = Copilot suggestion
   - Press Tab to accept

### JetBrains IDEs

1. **Install Plugin**
   ```
   1. Open Settings/Preferences
   2. Go to Plugins → Marketplace
   3. Search "GitHub Copilot"
   4. Install and restart IDE
   ```

2. **Authenticate**
   ```
   1. Go to Tools → GitHub Copilot → Login
   2. Copy device code
   3. Open github.com/login/device
   4. Enter code and authorize
   ```

## Configuration

### VS Code Settings

Add to your `settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "plaintext": false,
    "yaml": true
  },
  "github.copilot.advanced": {
    "inlineSuggestCount": 3
  },
  "github.copilot.chat.localeOverride": "en"
}
```

### Project-Level Configuration

Create `.github/copilot-instructions.md` for project-specific context:

```markdown
# Copilot Instructions for NRSgirls

## Tech Stack
- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS
- Prisma ORM
- PostgreSQL

## Coding Standards
- Use functional components with hooks
- Prefer server components when possible
- Use Zod for validation
- Follow conventional commits

## Patterns to Follow
- Use `async/await` over `.then()`
- Prefer `const` over `let`
- Use named exports
- Include JSDoc for public functions
```

## Enabling Copilot Chat

### Inline Chat

1. Select code in editor
2. Press `Ctrl+I` / `Cmd+I`
3. Type your question or instruction
4. Review and apply changes

### Chat Panel

1. Press `Ctrl+Shift+I` / `Cmd+Shift+I`
2. Or click chat icon in sidebar
3. Start conversation with context

### Chat Participants

Use `@` to target specific contexts:

```
@workspace - Full project context
@vscode - Editor settings/features
@terminal - Terminal output context
```

## Verification Checklist

- [ ] Copilot extension installed
- [ ] Successfully authenticated
- [ ] Inline suggestions appearing
- [ ] Chat panel accessible
- [ ] Project instructions configured

## Troubleshooting

### No Suggestions Appearing

1. Check Copilot is enabled (status bar icon)
2. Verify internet connection
3. Check file type is enabled in settings
4. Try reloading VS Code

### Authentication Issues

1. Sign out: Command Palette → "GitHub Copilot: Sign Out"
2. Clear credentials: `~/.config/github-copilot/`
3. Reinstall extension
4. Re-authenticate

### Slow Suggestions

1. Check network latency to GitHub
2. Reduce `inlineSuggestCount` setting
3. Disable for large files (>1000 lines)

## Next Steps

- Read [Best Practices](./best-practices.md)
- Learn [Effective Prompting](./prompting-guide.md)
- Set up [Code Review](./code-review.md) workflows
