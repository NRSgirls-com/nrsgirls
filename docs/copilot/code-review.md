# Code Review with GitHub Copilot

GitHub Copilot can assist with code reviews, but should complement—not replace—human review.

## Copilot for Pull Requests

### Enabling Copilot PR Reviews

1. **Repository Settings**
   - Go to Settings → Copilot → Pull request summaries
   - Enable automatic summaries
   - Configure review triggers

2. **Available Features**
   - Auto-generated PR summaries
   - Code change explanations
   - Potential issue detection
   - Test coverage suggestions

### Using Copilot in PR Reviews

```markdown
# In PR comments, you can ask Copilot:

@copilot explain this change

@copilot are there any potential issues with this code?

@copilot suggest improvements for this function

@copilot what tests should cover this change?
```

## Review Workflow

### 1. Auto-Summary Review

When Copilot generates a PR summary:

- [ ] Verify summary accurately describes changes
- [ ] Check if anything important is missing
- [ ] Use summary as starting point, not final word

### 2. Code Analysis

Use Copilot Chat to analyze changes:

```
/explain What are the key changes in this PR and their potential impact?

/explain Are there any breaking changes in this code?

/explain What edge cases might this code miss?
```

### 3. Security Review

```
/explain Check this code for security vulnerabilities:
- SQL injection
- XSS vulnerabilities
- Authentication bypasses
- Data exposure risks
```

### 4. Performance Review

```
/explain Analyze this code for performance issues:
- N+1 query problems
- Memory leaks
- Unnecessary re-renders
- Missing memoization
```

## Review Checklist Template

Use this when reviewing Copilot-suggested or human-written code:

```markdown
## Code Review Checklist

### Functionality
- [ ] Code does what PR description claims
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

### Code Quality
- [ ] Follows project coding standards
- [ ] No unnecessary complexity
- [ ] Clear naming conventions
- [ ] Appropriate comments (not excessive)

### Types & Safety
- [ ] No `any` types
- [ ] Null/undefined handled properly
- [ ] Type assertions are justified

### Security
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] Auth/authz checks in place
- [ ] Safe data handling

### Testing
- [ ] Tests cover happy path
- [ ] Tests cover edge cases
- [ ] Tests are meaningful (not just coverage)

### Performance
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] No memory leaks
```

## Common Issues Copilot Finds

### Type Safety

```typescript
// Copilot might flag:
const user = data as User; // Unsafe type assertion

// Suggest instead:
const user = validateUser(data); // Runtime validation
```

### Missing Error Handling

```typescript
// Copilot might flag:
const data = await fetchData();
return data.items; // What if fetchData fails?

// Suggest instead:
try {
  const data = await fetchData();
  return data.items;
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new AppError('DATA_FETCH_FAILED');
}
```

### Security Vulnerabilities

```typescript
// Copilot might flag:
const query = `SELECT * FROM users WHERE id = ${userId}`; // SQL injection!

// Suggest instead:
const user = await prisma.user.findUnique({ where: { id: userId } });
```

## What Copilot Misses

Always manually review:

1. **Business Logic Correctness**
   - Does this match requirements?
   - Are domain rules followed?

2. **Architectural Decisions**
   - Is this the right place for this code?
   - Does it follow our patterns?

3. **User Experience**
   - Is the UX appropriate?
   - Are loading states handled?
   - Are errors user-friendly?

4. **Context-Specific Security**
   - Permission checks for this feature
   - Data access restrictions
   - Rate limiting requirements

5. **Integration Impact**
   - Effects on other systems
   - Backward compatibility
   - Migration requirements

## Review Comments with Copilot

### Generating Suggestions

```
@copilot suggest a better way to write this function

@copilot how would you refactor this to be more readable?

@copilot what's a more performant approach here?
```

### Explaining Issues

```
@copilot explain why this approach might cause issues

@copilot what problems could occur with this implementation?
```

## Best Practices

1. **Don't Approve Blindly**
   - Copilot is a tool, not an authority
   - Human judgment is still required

2. **Use as Second Opinion**
   - After your review, ask Copilot
   - Compare findings

3. **Document Copilot Suggestions**
   - Note when Copilot caught something
   - Track false positives too

4. **Configure for Your Needs**
   - Customize what Copilot checks
   - Add project-specific rules

5. **Combine with Linting**
   - Copilot + ESLint + TypeScript
   - Automated + AI + Human review
