# GitHub Copilot Best Practices

## Core Principles

### 1. Review Every Suggestion

Never blindly accept Copilot suggestions. Always:

- Read the generated code completely
- Understand what it does
- Verify it matches your intent
- Check for security issues
- Ensure it follows project standards

### 2. Provide Context

Better context = better suggestions:

```typescript
// BAD: No context
function process(data) {
  // Copilot has no idea what you want
}

// GOOD: Clear context
/**
 * Validates user registration data and returns sanitized result.
 * @param data - Raw registration form data
 * @returns Validated and sanitized user data
 * @throws ValidationError if data is invalid
 */
function validateUserRegistration(data: RegistrationInput): ValidatedUser {
  // Copilot now understands the purpose
}
```

### 3. Use Meaningful Names

Descriptive names guide Copilot:

```typescript
// BAD
const x = await fetch(url);
const d = await x.json();

// GOOD
const response = await fetch(userProfileEndpoint);
const userProfile = await response.json();
```

## Effective Patterns

### Break Down Complex Tasks

Instead of asking for everything at once:

```typescript
// Step 1: Define the interface
interface PaymentProcessor {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  refund(transactionId: string): Promise<RefundResult>;
  getTransactionStatus(id: string): Promise<TransactionStatus>;
}

// Step 2: Implement one method at a time
// Let Copilot help with each method individually
```

### Use Comment-Driven Development

Write comments first, let Copilot implement:

```typescript
async function createUserAccount(email: string, password: string) {
  // 1. Validate email format

  // 2. Check if email already exists

  // 3. Hash the password

  // 4. Create user record in database

  // 5. Send verification email

  // 6. Return created user (without password)
}
```

### Leverage Type Definitions

Strong types improve suggestions:

```typescript
// Define types first
type UserRole = 'admin' | 'performer' | 'viewer' | 'dj';

interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  profile: UserProfile;
}

// Copilot will now respect these types
function getUserPermissions(user: User): Permission[] {
  // Suggestions will use the correct types
}
```

## What to Avoid

### Don't Use for Security-Critical Code

Write these manually and have them reviewed:

```typescript
// WRITE MANUALLY - Don't rely on Copilot for:
- Authentication logic
- Authorization checks
- Password handling
- Token generation/validation
- Input sanitization
- SQL query construction
- Encryption/decryption
```

### Don't Accept Without Testing

```typescript
// Copilot suggested this, but is it correct?
function calculateDiscount(price: number, percentage: number): number {
  return price * (percentage / 100); // This subtracts, not calculates final price!
}

// Always verify with tests
expect(calculateDiscount(100, 20)).toBe(80); // This would fail!
```

### Don't Ignore Type Errors

```typescript
// BAD: Copilot suggests something with type errors
const result = someFunction(data as any); // Don't accept 'any' casts

// GOOD: Fix the types properly
const result = someFunction(validateData(data));
```

## Project-Specific Guidelines

### For NRSgirls Platform

1. **React Components**
   - Use functional components only
   - Prefer server components for data fetching
   - Use `use client` directive only when needed

2. **API Routes**
   - Always validate input with Zod
   - Return consistent error formats
   - Include proper HTTP status codes

3. **Database Operations**
   - Use Prisma for all queries
   - Never construct raw SQL from user input
   - Use transactions for related operations

4. **Styling**
   - Use Tailwind classes
   - Follow the design system
   - Ensure responsive design

## Code Review Checklist

When reviewing Copilot-generated code:

- [ ] Logic is correct and complete
- [ ] Error handling is appropriate
- [ ] Types are correct (no `any`)
- [ ] Security considerations addressed
- [ ] Performance is acceptable
- [ ] Follows project conventions
- [ ] Has appropriate tests
- [ ] Documentation is accurate

## Measuring Effectiveness

Track your Copilot usage:

1. **Acceptance Rate** - What % of suggestions you accept
2. **Edit Distance** - How much you modify accepted code
3. **Bug Rate** - Bugs in Copilot-assisted vs manual code
4. **Time Saved** - Actual productivity improvement

Aim for quality over speed. A 50% acceptance rate with high-quality code is better than 90% acceptance with bugs.
