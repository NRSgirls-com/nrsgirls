# Security Considerations for GitHub Copilot

Using AI code assistants requires security awareness. This guide covers risks and mitigations.

## Data Privacy

### What Copilot Sees

When enabled, Copilot may process:

- Code in your current file
- Code in open tabs
- File names and paths
- Comments and strings
- Repository context

### What NOT to Include

Never include in code or comments:

```typescript
// ❌ NEVER DO THIS
const API_KEY = "sk-live-abc123...";
const DB_PASSWORD = "production_password_here";
const STRIPE_SECRET = "sk_live_...";

// Even in comments:
// TODO: Use production key sk-live-abc123 before deploy ❌
```

### Safe Practices

```typescript
// ✅ Use environment variables
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

// ✅ Reference .env.example with placeholders
// See .env.example for required variables
```

## Code Security Risks

### Insecure Suggestions

Copilot might suggest vulnerable code:

```typescript
// ❌ Copilot might suggest (DON'T USE):
app.get('/user/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  // SQL injection vulnerability!
});

// ✅ Always use parameterized queries:
app.get('/user/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id, 10) }
  });
});
```

### Authentication Bypasses

```typescript
// ❌ Weak auth check Copilot might suggest:
if (req.headers.authorization) {
  // User is authenticated
}

// ✅ Proper auth verification:
const session = await validateSession(req.headers.authorization);
if (!session || session.expiresAt < new Date()) {
  throw new UnauthorizedError();
}
```

### XSS Vulnerabilities

```typescript
// ❌ Dangerous (Copilot might suggest):
element.innerHTML = userInput;

// ✅ Safe alternatives:
element.textContent = userInput;
// Or with sanitization:
element.innerHTML = DOMPurify.sanitize(userInput);
```

## Security Review Checklist

For any Copilot-generated code, verify:

### Input Handling
- [ ] All user input is validated
- [ ] Input is sanitized before use
- [ ] Type coercion is explicit
- [ ] Length limits are enforced

### Authentication
- [ ] Auth checks use secure comparison
- [ ] Tokens are validated properly
- [ ] Session handling is secure
- [ ] Password handling uses bcrypt/argon2

### Authorization
- [ ] Permission checks are present
- [ ] Resource ownership is verified
- [ ] Role checks are accurate
- [ ] No privilege escalation possible

### Data Protection
- [ ] Sensitive data is encrypted
- [ ] PII is handled properly
- [ ] Logs don't contain secrets
- [ ] Errors don't leak information

### Dependencies
- [ ] No vulnerable packages suggested
- [ ] Imports are from trusted sources
- [ ] Versions are current and secure

## Configuration

### Disable for Sensitive Files

In VS Code settings:

```json
{
  "github.copilot.enable": {
    "*": true,
    "**/.env*": false,
    "**/secrets/**": false,
    "**/*secret*": false,
    "**/*credential*": false,
    "**/config/production*": false
  }
}
```

### Repository-Level Settings

Create `.github/copilot-blocked-paths.yml`:

```yaml
# Files Copilot should not access
blocked:
  - ".env*"
  - "secrets/"
  - "**/credentials/**"
  - "**/*.pem"
  - "**/*.key"
```

## Organizational Policies

### For Team Leads

1. **Training Requirements**
   - All developers must read this guide
   - Security review training for Copilot code
   - Regular security awareness updates

2. **Code Review Rules**
   - Flag Copilot-generated security code
   - Require manual review for auth/crypto
   - Document when Copilot was used

3. **Audit Trail**
   - Track Copilot usage metrics
   - Monitor for security incidents
   - Regular security audits

### Enterprise Settings

If using GitHub Copilot Business/Enterprise:

1. **Data Retention**
   - Configure prompt retention policies
   - Understand what GitHub stores
   - Review data processing agreements

2. **Access Control**
   - Limit Copilot to appropriate repos
   - Control who can enable Copilot
   - Monitor usage patterns

3. **Compliance**
   - Ensure Copilot use meets regulations
   - Document AI assistance in audits
   - Review intellectual property implications

## Incident Response

If Copilot suggests code that:

### Contains Secrets
1. Do NOT commit the code
2. Regenerate any exposed credentials immediately
3. Report to security team
4. Review Copilot settings

### Has Security Vulnerabilities
1. Do not merge vulnerable code
2. Document the suggestion for review
3. Report patterns to GitHub (if persistent)
4. Add to team awareness training

### Raises Compliance Concerns
1. Pause and assess the suggestion
2. Consult legal/compliance team
3. Document the concern
4. Update usage guidelines

## Resources

- [GitHub Copilot Trust Center](https://resources.github.com/copilot-trust-center/)
- [GitHub Security Advisories](https://github.com/advisories)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NRSgirls Security Checklist](../checklists/security.md)
