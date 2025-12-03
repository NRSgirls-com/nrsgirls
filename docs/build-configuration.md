# Build Configuration Guide

## Overview

This document explains how to configure builds for the NRSgirls platform on Vercel, based on our Next.js frontend setup.

## Current Build Setup

- **Framework**: Next.js 13.5.0
- **Package Manager**: Yarn (as of recent CI updates)
- **Root Directory**: `frontend/nextjs`
- **Build Command**: `yarn build`
- **Output Directory**: `.next` (Next.js default)
- **Install Command**: `yarn install`

## Vercel Build Configuration

### Framework Preset

Our project uses **Next.js** as the framework preset. Vercel automatically detects this and configures:

- **Build Command**: `yarn build` (from package.json scripts)
- **Output Directory**: `.next`
- **Development Command**: `yarn dev`

### Build & Development Settings

Located in Project Settings > Build & Development Settings:

1. **Framework Preset**: Next.js
2. **Build Command**: `yarn build` (auto-detected from package.json)
3. **Output Directory**: `.next` (auto-configured)
4. **Install Command**: `yarn install` (auto-detected)
5. **Development Command**: `yarn dev`

### Root Directory Configuration

For our monorepo structure:

```
Path: frontend/nextjs
```

This setting:
- Tells Vercel where to find the app to build
- Restricts file access to within this directory
- Applies to both deployments and Vercel CLI

### Node.js Version

Recommended: **Node.js 18.x** (LTS)

Set via environment variable or `.nvmrc` file:

```bash
# .nvmrc in frontend/nextjs/
18
```

## Package Manager: Yarn

Our project uses **Yarn** (configured in CI workflow). To ensure consistency:

### In package.json (optional):

```json
{
  "packageManager": "yarn@1.22.19"
}
```

### Enable Corepack (optional):

Add environment variable in Vercel Project Settings:
- Name: `ENABLE_EXPERIMENTAL_COREPACK`
- Value: `1`

## Build Process

When you deploy, Vercel:

1. **Shallow Clone**: Fetches last 10 commits (`git clone --depth=10`)
2. **Install Dependencies**: Runs `yarn install` in `frontend/nextjs/`
3. **Build**: Runs `yarn build` (executes `next build`)
4. **Deploy**: Serves the `.next` output directory

## Build Commands Reference

### Override Build Command (if needed)

In Project Settings, enable "Override" for Build Command:

```bash
# Standard Next.js build
yarn build

# With custom environment
NODE_ENV=production yarn build

# With additional steps
yarn lint && yarn build
```

### Skip Build Step

For static-only projects (not applicable to our Next.js app):
1. Select "Other" as Framework Preset
2. Enable Override for Build Command
3. Leave Build Command empty

This serves files directly without building.

## Environment Variables

Build-time environment variables needed:

- `NEXT_PUBLIC_STRIPE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key (server-side)
- Any other API keys or configuration

Set these in: Project Settings > Environment Variables

## Development with vercel dev

To run locally with Vercel platform features:

```bash
# Link to Vercel project first
vercel link

# Run development server
vercel dev
```

The development command must pass `$PORT` variable:

```bash
next dev --port $PORT
```

## Monorepo Considerations

### Skip Unaffected Deployments

In Project Settings > Root Directory:
- Enable "Skip deployment" switch
- Deployments skip if no changes in `frontend/nextjs/`

### Multiple Projects

If you need separate deployments:
- Create separate Vercel projects for different directories
- Example: One for frontend, one for platform components

## vercel.json Configuration

Place in project root or `frontend/nextjs/`:

```json
{
  "buildCommand": "yarn build",
  "outputDirectory": ".next",
  "devCommand": "yarn dev",
  "installCommand": "yarn install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Per-deployment Overrides

Override settings for specific deployments:

```json
{
  "buildCommand": "yarn build:production",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

## Build Performance

### Optimization Tips

1. **Use Yarn**: Faster than npm for our project
2. **Cache Dependencies**: Vercel caches `node_modules` between builds
3. **Incremental Builds**: Next.js caches build artifacts
4. **Environment Variables**: Set build-time vars in Vercel dashboard

### Build Timeouts

Default: 45 minutes (adjustable in Enterprise plans)

## Troubleshooting Builds

### Common Issues

1. **Build fails with package not found**
   - Check `package.json` includes all dependencies
   - Verify install command runs correctly

2. **Build command not found**
   - Ensure build script exists in `package.json`
   - Check Framework Preset is set correctly

3. **Output directory empty**
   - Verify build completes successfully
   - Check Output Directory setting matches framework

4. **Environment variables missing**
   - Add to Project Settings > Environment Variables
   - Prefix with `NEXT_PUBLIC_` for client-side access

### Build Logs

Access via:
- Vercel Dashboard > Deployments > [Select deployment] > Build Logs
- Or use CLI: `vercel logs [deployment-url]`

## CI/CD Integration

Our GitHub Actions workflow (see `.github/workflows/`):

1. Runs tests
2. Lints code
3. Builds Next.js app with Yarn
4. Deploys to Vercel

The workflow uses the same build configuration as Vercel.

## Best Practices

1. **Keep build command simple**: Use `yarn build`, configure complex logic in `package.json`
2. **Use Framework Preset**: Let Vercel auto-configure when possible
3. **Set Root Directory**: Essential for monorepo structure
4. **Cache wisely**: Leverage Next.js incremental builds
5. **Environment Variables**: Never commit secrets, use Vercel dashboard
6. **Test locally**: Use `vercel dev` to test before deploying

## References

- [Vercel Build Configuration Docs](https://vercel.com/docs/build-configuration)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Yarn Documentation](https://classic.yarnpkg.com/en/docs/)

## Related Documentation

- [Project Structure](./project-structure.md)
- [Deployment Guide](./deployment-guide.md)
- [Environment Variables](./environment-variables.md)
