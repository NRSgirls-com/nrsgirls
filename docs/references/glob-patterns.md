# Glob Patterns Reference

Glob patterns are used throughout this project and many development tools for file and folder matching. This reference covers the syntax and common use cases.

## Glob Pattern Syntax

The following glob syntax is supported:

| Pattern | Description | Example |
|---------|-------------|---------|
| `/` | Separates path segments | `src/components/Button.tsx` |
| `*` | Matches zero or more characters in a path segment | `*.js` matches `app.js`, `index.js` |
| `?` | Matches exactly one character in a path segment | `file?.txt` matches `file1.txt`, `fileA.txt` |
| `**` | Matches any number of path segments, including none | `src/**/*.ts` matches all `.ts` files in `src/` |
| `{}` | Groups conditions (OR logic) | `{**/*.html,**/*.txt}` matches all HTML and text files |
| `[]` | Declares a range of characters to match | `example.[0-9]` matches `example.0`, `example.1`, etc. |
| `[!...]` | Negates a range of characters | `example.[!0-9]` matches `example.a`, `example.b`, but not `example.0` |

> **Note:** Paths should be separated by `/` and not `\`, even on Windows. Glob patterns will match paths with both slash and backslash separators.

## Common Patterns

### Match All Files of a Type

```
*.js           # All JavaScript files in current directory
**/*.js        # All JavaScript files in any subdirectory
**/*.{ts,tsx}  # All TypeScript files (including React)
```

### Match Specific Directories

```
src/**/*       # All files under src/
**/node_modules/**  # Everything in any node_modules folder
dist/**        # All files in dist/
```

### Exclude Patterns

Many tools use `!` prefix for exclusion:

```
!**/node_modules/**   # Exclude node_modules
!**/*.test.js         # Exclude test files
!**/dist/**           # Exclude dist folder
```

## Special Cases

### Search vs. Settings Behavior

Glob patterns in search views work differently than in configuration settings:

- **In settings** (like `files.exclude`, `search.exclude`): You must use `**/example` to match a folder named `example` in any subfolder
- **In search views**: The `**` prefix is often assumed automatically

Glob patterns in settings are always evaluated relative to the workspace folder path.

### Escaping Special Characters

To literally match special characters like `[` or `]`, place them inside square brackets (single-character range):

```
# Match files under src/routes/post/[id]/
src/routes/post/[[]id[]]/**.js
```

> **Note:** Backslashes do not escape special characters in glob patterns.

## Common Use Cases in This Project

### ESLint/Prettier Configuration

```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### .gitignore Patterns

```
# Build outputs
dist/
build/
.next/

# Dependencies
node_modules/

# Environment files
.env*.local
```

### TypeScript Configuration

```json
{
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "**/node_modules/*"]
}
```

## Troubleshooting

### Pattern Not Working?

1. **Windows paths**: Ensure you're using `/` to separate paths, not `\`
2. **Missing prefix**: Some contexts require `**/` prefix for recursive matching
3. **Special characters**: Escape `[`, `]`, `{`, `}` using the bracket syntax shown above
4. **Relative paths**: Check if the pattern is evaluated relative to a specific directory

### Testing Patterns

You can test glob patterns using various tools:

```bash
# Using find (basic glob support)
find . -name "*.js"

# Using glob-testing tools
npx glob "src/**/*.tsx"
```

## Related Documentation

- [Best Practices - Editor Configuration](../best-practices/README.md)
- [TypeScript Configuration](../best-practices/README.md#typescript-guidelines)
