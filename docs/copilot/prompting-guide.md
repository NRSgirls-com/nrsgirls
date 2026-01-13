# Copilot Prompting Guide

Effective prompting dramatically improves Copilot's suggestions. This guide covers techniques for both inline suggestions and Copilot Chat.

## Inline Suggestion Prompting

### Use Descriptive Function Names

```typescript
// Vague - poor suggestions
function handle(d) {}

// Specific - better suggestions
function handleUserLoginAttempt(credentials: LoginCredentials) {}

// Very specific - best suggestions
function validateAndProcessUserLoginWithRateLimiting(
  credentials: LoginCredentials,
  ipAddress: string
) {}
```

### Write Intent Comments

```typescript
// Parse ISO date string and return formatted date for US locale
function formatDateForDisplay(isoString: string): string {
  // Copilot will suggest the implementation
}

// Recursively find all files with given extension in directory
async function findFilesByExtension(dir: string, ext: string): Promise<string[]> {
  // Better suggestions due to clear intent
}
```

### Provide Examples in Comments

```typescript
/**
 * Converts camelCase to kebab-case
 * Examples:
 *   'userName' -> 'user-name'
 *   'getHTTPResponse' -> 'get-http-response'
 *   'already-kebab' -> 'already-kebab'
 */
function camelToKebab(str: string): string {
  // Copilot now has clear examples to follow
}
```

## Copilot Chat Prompting

### Be Specific About Requirements

```
❌ Bad: "Write a function to handle users"

✅ Good: "Write a TypeScript function that:
- Takes a user ID as input
- Fetches user data from Prisma
- Returns null if user not found
- Throws an error if database connection fails
- Uses our User type from @/types"
```

### Specify the Tech Stack

```
❌ Bad: "Create a form component"

✅ Good: "Create a React form component using:
- React Hook Form for form handling
- Zod for validation
- Tailwind CSS for styling
- Our Button and Input components from @/components/ui
- Server action for submission"
```

### Request Step-by-Step

```
"I need to implement user authentication. Let's break it down:

1. First, show me the Prisma schema for a User model with:
   - id, email, passwordHash, role, createdAt, updatedAt

2. Then, create the auth service with:
   - register function
   - login function
   - validateSession function

3. Finally, create the API routes for:
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/logout"
```

### Include Constraints

```
"Generate a pagination component with these constraints:
- Maximum 7 page buttons visible at once
- Always show first and last page
- Use ellipsis (...) for gaps
- Accessible with ARIA labels
- Mobile-friendly (fewer buttons on small screens)
- Use our existing Button component"
```

## Chat Commands

### /explain

```
/explain what does this regex do and give examples of matches

/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

### /fix

```
/fix this function throws "Cannot read property of undefined" when user.profile is null

function getUserDisplayName(user: User) {
  return user.profile.displayName || user.email;
}
```

### /tests

```
/tests generate comprehensive unit tests for this function using Vitest:
- Test happy path
- Test edge cases (empty string, null, undefined)
- Test error conditions
```

### /doc

```
/doc generate JSDoc documentation for this class including:
- Class description
- All public method descriptions
- Parameter types and descriptions
- Return types
- Example usage
```

## Advanced Techniques

### Context Priming

Open related files before asking:

```
1. Open your types file
2. Open a similar component for reference
3. Open the API route it will call
4. Then ask Copilot to generate the new component

Copilot uses open files as context!
```

### Iterative Refinement

```
First prompt: "Create a user list component"

Refinement 1: "Add pagination with 10 items per page"

Refinement 2: "Add a search filter for email"

Refinement 3: "Add sorting by name and createdAt"

Refinement 4: "Make it responsive with a card layout on mobile"
```

### Reference Existing Code

```
"Create a new API route for /api/performers similar to
the existing /api/users route, but with these differences:
- Add 'stageName' field
- Include availability schedule
- Add streaming stats"
```

## Common Prompt Templates

### API Endpoint

```
Create a Next.js API route handler for [METHOD] /api/[path] that:
- Validates input using Zod with schema: [describe fields]
- Requires authentication via [method]
- Performs [operation] using Prisma
- Returns [response format]
- Handles errors with appropriate status codes
```

### React Component

```
Create a React component called [Name] that:
- Props: [list props with types]
- State: [describe state needed]
- Behavior: [describe interactions]
- Styling: Use Tailwind with [specific styles]
- Accessibility: Include [ARIA requirements]
```

### Database Query

```
Write a Prisma query that:
- Fetches [entity] where [conditions]
- Includes related [relations]
- Orders by [field] [direction]
- Paginates with [strategy]
- Returns [specific fields only]
```

### Test Suite

```
Generate tests for [function/component] that verify:
- [Happy path scenario]
- [Edge case 1]
- [Edge case 2]
- [Error condition]
Using [test framework] with [assertion style]
```

## Tips for Better Results

1. **Start simple, add complexity** - Get basic working first
2. **Use domain vocabulary** - "performer" not "user" for NRSgirls
3. **Reference file paths** - "@/lib/auth" not "the auth file"
4. **Specify versions** - "React 18" "Next.js 14" "Prisma 5"
5. **Ask for explanations** - "explain your suggestion"
6. **Request alternatives** - "show me another approach"
