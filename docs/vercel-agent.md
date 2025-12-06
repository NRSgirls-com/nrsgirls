# Vercel Agent

> **Last updated:** October 28, 2025
> **Availability:** Beta on Enterprise and Pro plans

Vercel Agent is a suite of AI-powered development tools built to speed up your workflow. Instead of spending hours debugging production issues or waiting for code reviews, Agent helps you catch problems faster and resolve incidents quickly.

## Why It Works

Agent works because it already understands your application. Vercel builds your code, deploys your functions, and serves your traffic. Agent uses this deep context about your codebase, deployment history, and runtime behavior to provide intelligent assistance right where you need it.

Everything runs on Vercel's AI Cloud, infrastructure designed specifically for AI workloads. This means Agent can use secure sandboxes to reproduce issues, access the latest models, and provide reliable results you can trust.

## Features

### Code Review

Get automatic code reviews on every pull request. Code Review analyzes your changes, identifies potential issues, and suggests fixes you can apply directly.

**What it does:**

- Performs multi-step reasoning to identify security vulnerabilities, logic errors, and performance issues
- Generates patches and runs them in secure sandboxes with your real builds, tests, and linters
- Only suggests fixes that pass validation checks, allowing you to apply specific code changes with one click

Learn more in the [Code Review docs](https://vercel.com/docs/workflow-collaboration/vercel-agent/code-review).

### Investigation

When error alerts fire, Vercel Agent Investigations can analyze what's happening to help you debug faster. Instead of manually digging through logs and metrics, AI does the analysis and shows you what might be causing the issue.

**What it does:**

- Queries logs and metrics around the time of the alert
- Looks for patterns and correlations that might explain the problem
- Provides insights about potential root causes

Learn more in the [Agent Investigation docs](https://vercel.com/docs/workflow-collaboration/vercel-agent/investigation).

## Getting Started

You can enable Vercel Agent in the **Agent** tab of your dashboard. Setup varies by feature:

| Feature | Requirements |
|---------|-------------|
| **Code Review** | Configure which repositories to review and whether to review draft PRs |
| **Agent Investigation** | Requires Observability Plus; enable Vercel Agent Investigations for automatic investigations |

## Pricing

Vercel Agent uses a credit-based system:

- **Base cost:** $0.30 USD per review or investigation
- **Token costs:** Billed at the Agent's underlying AI provider's rate with no additional markup
- **Pro teams:** Can redeem a $100 USD promotional credit when enabling Agent

You can purchase credits and enable auto-reload in the Agent tab of your dashboard.

## Privacy

- Vercel Agent doesn't store or train on your data
- Only uses LLMs from providers on Vercel's subprocessor list
- Agreements in place that don't allow providers to train on your data

## Related Documentation

- [Vercel Deployment Guide](./DEPLOYMENT.md)
- [PR Review Checklist](./checklists/pr-review.md)
- [Security Checklist](./checklists/security.md)
