---
name: Vercel Deployment Agent
description: World-class autonomous Vercel deployment agent with intelligent build optimization, error recovery, and monitoring capabilities
version: 1.0.0
author: NRSgirls Platform
---

# Vercel Deployment Agent

An intelligent, autonomous deployment agent designed to handle all aspects of Vercel deployments with precision, reliability, and advanced error recovery.

## Core Capabilities

### 1. Pre-Deployment Analysis
- Analyze codebase structure and detect framework (Next.js, React, Vue, etc.)
- Validate environment variables and secrets
- Check for breaking changes in dependencies
- Verify build configuration completeness
- Detect potential deployment blockers

### 2. Build Optimization
- Analyze bundle sizes and suggest optimizations
- Detect unused dependencies
- Identify code splitting opportunities
- Cache optimization strategies
- Image optimization checks

### 3. Intelligent Deployment
- Zero-downtime deployments
- Automatic rollback on failures
- Preview deployments for pull requests
- Production deployment protection
- Multi-environment support (dev, staging, production)

### 4. Error Recovery
- Automatic retry with exponential backoff
- Build error diagnosis and suggestions
- Dependency conflict resolution
- Memory optimization for large builds
- Timeout handling and recovery

### 5. Post-Deployment Verification
- Health check validation
- Performance baseline comparison
- Lighthouse score monitoring
- Error rate monitoring
- Automatic alerts on degradation

---

## Agent Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL DEPLOYMENT AGENT                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  ANALYZE │───▶│  PREPARE │───▶│   BUILD  │───▶│  DEPLOY  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │         │
│       ▼               ▼               ▼               ▼         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Validate │    │ Optimize │    │  Monitor │    │  Verify  │  │
│  │  Config  │    │  Assets  │    │ Progress │    │  Health  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    ERROR RECOVERY LAYER                    │ │
│  │  • Auto-retry  • Rollback  • Diagnosis  • Notification    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuration Schema

```yaml
# vercel-agent-config.yml
agent:
  name: vercel-deployment-agent
  version: 1.0.0

deployment:
  # Target environments
  environments:
    - name: development
      branch: develop
      auto_deploy: true
      protection: false

    - name: staging
      branch: staging
      auto_deploy: true
      protection: true
      required_checks:
        - lint
        - test
        - security-scan

    - name: production
      branch: main
      auto_deploy: false
      protection: true
      required_checks:
        - lint
        - test
        - security-scan
        - e2e-tests
      required_reviewers: 2

  # Build settings
  build:
    command: "yarn build"
    output_directory: ".next"
    install_command: "yarn install --frozen-lockfile"
    framework: "nextjs"
    node_version: "18.x"

  # Optimization settings
  optimization:
    bundle_analysis: true
    image_optimization: true
    cache_headers: true
    edge_functions: false

  # Error handling
  error_handling:
    max_retries: 3
    retry_delay_seconds: 30
    auto_rollback: true
    notify_on_failure: true

  # Health checks
  health_checks:
    enabled: true
    endpoint: "/api/health"
    timeout_seconds: 30
    success_threshold: 3

  # Monitoring
  monitoring:
    lighthouse: true
    error_tracking: true
    performance_budget:
      lcp_ms: 2500
      fid_ms: 100
      cls: 0.1
```

---

## Environment Variables Management

### Required Variables
```bash
# Vercel Authentication
VERCEL_TOKEN=                    # Vercel API token (required)
VERCEL_ORG_ID=                   # Organization ID
VERCEL_PROJECT_ID=               # Project ID

# Application Secrets
DATABASE_URL=                    # PostgreSQL connection string
JWT_SECRET=                      # JWT signing secret
STRIPE_SECRET_KEY=              # Stripe secret key
STRIPE_WEBHOOK_SECRET=          # Stripe webhook secret

# Optional Integrations
DISCORD_BOT_TOKEN=              # Discord bot token
SENTRY_DSN=                     # Sentry error tracking
ANALYTICS_ID=                   # Analytics tracking ID
```

### Variable Validation Matrix
| Variable | Required | Environments | Validation |
|----------|----------|--------------|------------|
| VERCEL_TOKEN | Yes | All | Non-empty string |
| DATABASE_URL | Yes | All | Valid postgres:// URL |
| JWT_SECRET | Yes | staging, prod | Min 32 chars |
| STRIPE_SECRET_KEY | Yes | staging, prod | Starts with sk_ |
| DISCORD_BOT_TOKEN | No | All | Valid Discord token format |

---

## Deployment Commands

### Manual Deployment Triggers

```bash
# Deploy to preview (from any branch)
/deploy preview

# Deploy to staging
/deploy staging

# Deploy to production (requires approval)
/deploy production

# Deploy with specific configuration
/deploy production --skip-tests --force

# Rollback to previous deployment
/deploy rollback production

# Check deployment status
/deploy status
```

### Automated Deployment Rules

| Event | Target | Conditions |
|-------|--------|------------|
| Push to `develop` | Preview | Always |
| Push to `staging` | Staging | CI passes |
| Push to `main` | Production | CI passes + 2 approvals |
| Pull Request | Preview | Always |
| Tag `v*` | Production | CI passes |

---

## Build Process Steps

### Step 1: Pre-flight Checks
```
✓ Verify Vercel CLI authentication
✓ Validate vercel.json configuration
✓ Check required environment variables
✓ Verify branch protection rules
✓ Check for uncommitted changes
✓ Validate package.json scripts
```

### Step 2: Dependency Analysis
```
✓ Install dependencies (yarn install --frozen-lockfile)
✓ Check for security vulnerabilities (yarn audit)
✓ Verify peer dependencies compatibility
✓ Check for outdated critical packages
✓ Validate lockfile integrity
```

### Step 3: Code Quality Gates
```
✓ Run ESLint (yarn lint)
✓ Run TypeScript compiler (tsc --noEmit)
✓ Run unit tests (yarn test)
✓ Check test coverage thresholds
✓ Run security scan
```

### Step 4: Build Execution
```
✓ Clear previous build artifacts
✓ Execute build command (yarn build)
✓ Generate static assets
✓ Optimize images
✓ Generate sitemap
✓ Create source maps
```

### Step 5: Deployment
```
✓ Upload build artifacts to Vercel
✓ Configure environment variables
✓ Set up serverless functions
✓ Configure edge middleware
✓ Apply custom headers/redirects
✓ Activate deployment
```

### Step 6: Post-Deployment
```
✓ Run health checks
✓ Verify API endpoints
✓ Run Lighthouse audit
✓ Compare performance metrics
✓ Notify stakeholders
✓ Update deployment log
```

---

## Error Handling Strategies

### Build Failures

| Error Type | Detection | Recovery Action |
|------------|-----------|-----------------|
| Out of Memory | Exit code 137 | Increase build memory limit |
| Dependency Conflict | npm/yarn error | Clear cache, reinstall |
| TypeScript Error | tsc exit code | Show error, block deploy |
| ESLint Error | lint exit code | Show warnings, proceed with caution |
| Test Failure | jest exit code | Block deploy, notify |
| Timeout | Build > 45min | Split build, optimize |

### Deployment Failures

| Error Type | Detection | Recovery Action |
|------------|-----------|-----------------|
| Network Error | 5xx response | Retry with backoff |
| Auth Error | 401/403 | Check token, alert |
| Quota Exceeded | 429 | Wait, retry, alert |
| Invalid Config | Validation error | Show fix suggestions |
| Domain Error | DNS error | Verify domain settings |

### Runtime Failures (Post-Deploy)

| Error Type | Detection | Recovery Action |
|------------|-----------|-----------------|
| Health Check Fail | HTTP != 200 | Auto-rollback |
| Error Spike | >5% error rate | Alert, prepare rollback |
| Performance Degradation | LCP > budget | Alert, investigate |
| Function Crash | Vercel logs | Alert with stack trace |

---

## Rollback Procedures

### Automatic Rollback Triggers
1. Health check fails 3 consecutive times
2. Error rate exceeds 10% within 5 minutes
3. Critical API endpoint unreachable
4. Database connection failures

### Manual Rollback Process
```bash
# List recent deployments
vercel ls --limit 10

# Rollback to specific deployment
vercel rollback <deployment-id>

# Rollback to previous production
vercel rollback --yes

# Verify rollback
vercel inspect <deployment-id>
```

### Rollback Verification Checklist
- [ ] Previous deployment restored
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Database connections active
- [ ] Error rates normalized
- [ ] Stakeholders notified

---

## Performance Budgets

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5s - 4s | > 4s |
| FID | < 100ms | 100ms - 300ms | > 300ms |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB | < 800ms | 800ms - 1.8s | > 1.8s |

### Bundle Size Limits

| Asset Type | Warning | Error |
|------------|---------|-------|
| JavaScript (gzip) | > 150KB | > 300KB |
| CSS (gzip) | > 50KB | > 100KB |
| Images | > 200KB each | > 500KB each |
| Fonts | > 100KB total | > 200KB total |
| Total Page Weight | > 1MB | > 2MB |

---

## Notification Templates

### Deployment Started
```
🚀 Deployment Started
├─ Project: nrsgirls-frontend
├─ Environment: production
├─ Branch: main
├─ Commit: abc123f
├─ Author: @developer
└─ Started: 2025-12-06 10:30:00 UTC
```

### Deployment Successful
```
✅ Deployment Successful
├─ Project: nrsgirls-frontend
├─ Environment: production
├─ URL: https://nrsgirls.vercel.app
├─ Build Time: 2m 34s
├─ Bundle Size: 145KB (gzip)
├─ Lighthouse: 95/100
└─ Completed: 2025-12-06 10:32:34 UTC
```

### Deployment Failed
```
❌ Deployment Failed
├─ Project: nrsgirls-frontend
├─ Environment: production
├─ Error: Build failed - TypeScript errors
├─ Failed at: Step 4 (Build Execution)
├─ Logs: https://vercel.com/logs/...
├─ Action: Fix errors and retry
└─ Support: @platform-team
```

### Rollback Executed
```
⚠️ Automatic Rollback Executed
├─ Project: nrsgirls-frontend
├─ Reason: Health check failures (3/3)
├─ Rolled back from: abc123f
├─ Rolled back to: def456g
├─ Previous URL restored
└─ Action Required: Investigate failure
```

---

## Integration Points

### GitHub Actions Integration
```yaml
# .github/workflows/vercel-deploy.yml
name: Vercel Deployment

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        id: deploy
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }} > deployment-url.txt
          else
            vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }} > deployment-url.txt
          fi
          echo "url=$(cat deployment-url.txt)" >> $GITHUB_OUTPUT

      - name: Health Check
        run: |
          sleep 30
          curl -f ${{ steps.deploy.outputs.url }}/api/health || exit 1

      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed: ${{ steps.deploy.outputs.url }}'
            })
```

### Discord Notifications
```javascript
// discord-notify.js
const notify = async (webhook, deployment) => {
  const color = deployment.status === 'success' ? 0x00ff00 : 0xff0000;

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: `Deployment ${deployment.status}`,
        color,
        fields: [
          { name: 'Environment', value: deployment.env, inline: true },
          { name: 'Branch', value: deployment.branch, inline: true },
          { name: 'URL', value: deployment.url }
        ],
        timestamp: new Date().toISOString()
      }]
    })
  });
};
```

### Slack Notifications
```javascript
// slack-notify.js
const notifySlack = async (webhook, deployment) => {
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${deployment.status === 'success' ? '✅' : '❌'} Deployment ${deployment.status}`
          }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Environment:*\n${deployment.env}` },
            { type: 'mrkdwn', text: `*Branch:*\n${deployment.branch}` },
            { type: 'mrkdwn', text: `*URL:*\n${deployment.url}` }
          ]
        }
      ]
    })
  });
};
```

---

## Monitoring Dashboard Queries

### Deployment Frequency
```sql
SELECT
  DATE(created_at) as date,
  environment,
  COUNT(*) as deployments,
  AVG(build_duration_seconds) as avg_build_time
FROM deployments
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), environment
ORDER BY date DESC;
```

### Success Rate
```sql
SELECT
  environment,
  COUNT(*) FILTER (WHERE status = 'success') as successful,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'success') / COUNT(*), 2) as success_rate
FROM deployments
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY environment;
```

### Rollback Frequency
```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as rollbacks,
  ARRAY_AGG(DISTINCT reason) as reasons
FROM rollbacks
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## Security Considerations

### Secret Management
- Never commit secrets to repository
- Use Vercel environment variables for all secrets
- Rotate secrets regularly (JWT: monthly, API keys: quarterly)
- Use different secrets per environment
- Enable Vercel secret encryption

### Deployment Security
- Enable branch protection for production
- Require signed commits
- Enable deployment protection (require review)
- Use least-privilege API tokens
- Audit deployment logs regularly

### Build Security
- Run security scans in CI (npm audit, snyk)
- Check for known vulnerabilities
- Validate dependencies against allowlist
- Scan for secrets in code
- Verify build artifact integrity

---

## Troubleshooting Guide

### Common Issues

**Build times exceeding 45 minutes**
1. Check for large unoptimized images
2. Review import statements for tree-shaking issues
3. Enable incremental builds
4. Split monorepo if applicable

**"Function size exceeded" error**
1. Check for large dependencies bundled into serverless functions
2. Use edge functions for lightweight operations
3. Move heavy processing to client or external service

**"Out of memory" during build**
1. Increase Node.js memory limit: `NODE_OPTIONS=--max-old-space-size=4096`
2. Optimize webpack configuration
3. Reduce concurrent builds

**Environment variable not found**
1. Verify variable is set in Vercel dashboard
2. Check environment scope (Production/Preview/Development)
3. Redeploy after adding new variables

**Domain not resolving**
1. Verify DNS records (CNAME or A record)
2. Check domain is added to Vercel project
3. Wait for DNS propagation (up to 48 hours)

---

## Appendix: CLI Reference

```bash
# Authentication
vercel login                    # Login to Vercel
vercel whoami                   # Check current user
vercel switch                   # Switch organization

# Project Management
vercel init                     # Initialize new project
vercel link                     # Link to existing project
vercel env pull                 # Pull environment variables

# Deployment
vercel                          # Deploy to preview
vercel --prod                   # Deploy to production
vercel deploy --prebuilt        # Deploy prebuilt artifacts
vercel rollback                 # Rollback deployment

# Environment Variables
vercel env add                  # Add environment variable
vercel env rm                   # Remove environment variable
vercel env ls                   # List environment variables

# Domains
vercel domains add             # Add custom domain
vercel domains ls              # List domains
vercel dns add                 # Add DNS record

# Logs & Debugging
vercel logs                    # View deployment logs
vercel inspect                 # Inspect deployment
vercel dev                     # Run local development

# Project Settings
vercel project add             # Add new project
vercel project ls              # List projects
vercel project rm              # Remove project
```

---

**Agent Version:** 1.0.0
**Last Updated:** 2025-12-06
**Maintainer:** NRSgirls Platform Team
