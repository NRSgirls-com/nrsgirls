# Deployment Guide - NRSgirls Platform

This guide provides step-by-step instructions for deploying the NRSgirls platform to production using recommended services.

## Architecture Overview

The platform consists of:
- **Frontend**: Next.js application (Vercel)
- **API/Backend**: Node.js/Express API (Render or Fly.io)
- **Database**: PostgreSQL (Supabase or Neon)
- **Storage**: Object storage (Cloudflare R2 or AWS S3)
- **Payments**: Stripe

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account with repository access
- [ ] Stripe account (test and production keys)
- [ ] Domain name (optional but recommended)
- [ ] Accounts on chosen hosting providers

## 1. Frontend Deployment (Vercel)

### Why Vercel?
- Native Next.js support
- Automatic deployments from Git
- Free tier for hobby projects
- Built-in CDN and edge functions

### Steps

1. **Sign up and Connect GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Grant Vercel access to your repository

2. **Import Project**
   - Click "New Project"
   - Select the `nrsgirls` repository
   - Configure project:
     - **Root Directory**: `frontend/nextjs`
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Configure Environment Variables**
   
   In Vercel dashboard → Project Settings → Environment Variables, add:
   
   ```env
   STRIPE_SECRET_KEY=sk_live_your_production_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```
   
   Set these for:
   - Production
   - Preview (optional)
   - Development (optional)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `https://your-app.vercel.app`

5. **Set up Custom Domain** (Optional)
   - In Project Settings → Domains
   - Add your custom domain (e.g., `nrsgirls.com`)
   - Update DNS records as instructed

### Vercel Deployment Checklist
- [ ] Project imported and connected to GitHub
- [ ] Root directory set to `frontend/nextjs`
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)

## 2. API/Backend Deployment (Render)

### Why Render?
- Easy Docker deployment
- Free tier available
- Automatic deployments from Git
- Built-in PostgreSQL databases

### Steps

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   ```yaml
   Name: nrsgirls-api
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend (or leave blank if Dockerfile is in root)
   Runtime: Docker (or Node if using package.json)
   Build Command: npm install (if using Node)
   Start Command: npm start (if using Node)
   Instance Type: Free or Starter
   ```

3. **Environment Variables**
   
   Add in Render dashboard:
   ```env
   DATABASE_URL=postgres://...
   JWT_SECRET=your-secure-jwt-secret
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   S3_ENDPOINT=https://...
   S3_ACCESS_KEY=...
   S3_SECRET_KEY=...
   NODE_ENV=production
   ```

4. **Deploy**
   - Render will automatically deploy on push to main
   - Access logs to verify deployment

### Render Deployment Checklist
- [ ] Web service created and connected to GitHub
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Health check endpoint responding
- [ ] API accessible via provided URL

### Alternative: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app (from backend directory)
cd backend
flyctl launch

# Set secrets
flyctl secrets set DATABASE_URL="postgres://..."
flyctl secrets set JWT_SECRET="..."
flyctl secrets set STRIPE_SECRET_KEY="sk_live_..."

# Deploy
flyctl deploy
```

## 3. Database (Supabase or Neon)

### Option A: Supabase (Recommended)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Choose region close to your users

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy the connection string
   - Use the "Transaction" pooler for serverless functions

3. **Run Migrations**
   ```bash
   # Using psql
   psql "postgresql://..." -f nrsgirls-platform/backend/database/schema.sql
   
   # Or using migration script
   bash nrsgirls-platform/scripts/migrate.sh
   ```

4. **Configure Row Level Security**
   - Enable RLS on all tables
   - Set up appropriate policies for user access

### Option B: Neon

1. **Create Project**
   - Go to [neon.tech](https://neon.tech)
   - Create new project

2. **Get Connection String**
   - Copy from dashboard
   - Use in your environment variables

### Database Checklist
- [ ] Database created
- [ ] Connection string obtained
- [ ] Schema/migrations applied
- [ ] Row Level Security configured (if using Supabase)
- [ ] Backups enabled
- [ ] Connection string added to API environment variables

## 4. Storage (Cloudflare R2 or AWS S3)

### Option A: Cloudflare R2 (Recommended - No egress fees)

1. **Create R2 Bucket**
   - Go to Cloudflare dashboard → R2
   - Create new bucket (e.g., `nrsgirls-uploads`)

2. **Generate API Tokens**
   - Create API token with R2 read/write permissions
   - Save Access Key ID and Secret Access Key

3. **Configure CORS**
   ```json
   [
     {
       "AllowedOrigins": ["https://nrsgirls.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

### Option B: AWS S3

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://nrsgirls-uploads
   ```

2. **Configure Bucket Policy**
   - Enable versioning
   - Set appropriate CORS configuration
   - Configure lifecycle rules for old objects

3. **Create IAM User**
   - Create user with S3 access
   - Generate access keys

### Storage Checklist
- [ ] Bucket created
- [ ] CORS configured
- [ ] Access keys generated
- [ ] Keys added to API environment variables
- [ ] Lifecycle policies configured
- [ ] Versioning enabled (optional)

## 5. Stripe Configuration

### Production Setup

1. **Switch to Live Mode**
   - In Stripe dashboard, toggle to "Live mode"
   - Get your production keys

2. **Create Products and Prices**
   ```bash
   # Using Stripe CLI
   stripe products create --name="Premium Membership"
   stripe prices create --product=prod_xxx --unit-amount=2999 --currency=usd --recurring=month
   ```

3. **Configure Webhooks**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-api.com/api/webhook` (or `https://your-app.vercel.app/api/webhook`)
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy webhook signing secret

4. **Update Environment Variables**
   - Add production `STRIPE_SECRET_KEY` to Vercel/Render
   - Add `STRIPE_WEBHOOK_SECRET` to Vercel/Render

### Stripe Checklist
- [ ] Switched to live mode
- [ ] Products and prices created
- [ ] Production API keys obtained
- [ ] Webhook endpoint configured
- [ ] Webhook events selected
- [ ] Webhook secret obtained and configured
- [ ] Test webhook delivery

## 6. Local Webhook Testing with Stripe CLI

For testing webhooks during development:

```bash
# Install Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows (Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_linux_x86_64.tar.gz
tar -xvf stripe_*.tar.gz
sudo mv stripe /usr/local/bin/

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

## 7. DNS Configuration

If using a custom domain:

1. **Add DNS Records**
   
   For Vercel (frontend):
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
   
   For Render (API):
   ```
   Type: CNAME
   Name: api
   Value: your-service.onrender.com
   ```

2. **Configure SSL**
   - Both Vercel and Render provide automatic SSL
   - Certificates are issued via Let's Encrypt

## 8. Monitoring and Logging

### Recommended Tools

1. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```
   
   Configure in `next.config.js` and add `SENTRY_DSN` to environment variables

2. **LogRocket** (Session Replay)
   ```bash
   npm install logrocket
   ```

3. **Vercel Analytics**
   - Built-in analytics in Vercel dashboard
   - Add `@vercel/analytics` package

4. **Render Logs**
   - Access via Render dashboard
   - Set up log drains to external services

### Monitoring Checklist
- [ ] Error tracking configured (Sentry)
- [ ] Logs accessible and searchable
- [ ] Uptime monitoring set up
- [ ] Performance monitoring enabled
- [ ] Alerts configured for critical errors

## 9. Production Hardening Checklist

### Security
- [ ] All secrets stored in environment variables (never in code)
- [ ] Secrets rotated from development keys
- [ ] HTTPS enforced everywhere
- [ ] CORS configured properly
- [ ] Rate limiting enabled on API endpoints
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user content)
- [ ] CSRF protection enabled
- [ ] Security headers configured (CSP, HSTS, etc.)

### Performance
- [ ] CDN enabled (Vercel provides this)
- [ ] Image optimization configured
- [ ] Database connection pooling
- [ ] Caching strategy implemented
- [ ] Gzip compression enabled

### Reliability
- [ ] Database backups scheduled
- [ ] Error logging and monitoring active
- [ ] Health check endpoints implemented
- [ ] Graceful error handling
- [ ] Retry logic for external API calls
- [ ] Circuit breakers for dependent services

### Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance (if EU users)
- [ ] Data retention policies defined
- [ ] User data export functionality
- [ ] User data deletion functionality

## 10. Deployment Workflow

### Recommended Git Flow

```bash
# Development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "Add new feature"
git push origin feature/new-feature
# Create PR → Review → Merge to main

# Automatic deployment
# - Vercel deploys on push to main
# - Render deploys on push to main
```

### Environment Strategy

- **Development**: Local environment with `.env.local`
- **Preview**: Vercel preview deployments for PRs
- **Staging**: Optional staging environment (separate Vercel/Render projects)
- **Production**: Main branch deploys to production

## 11. Rollback Procedure

### Vercel
```bash
# Via CLI
vercel rollback

# Via Dashboard
# Go to Deployments → Click on previous deployment → "Promote to Production"
```

### Render
```bash
# Via Dashboard
# Go to Service → Deploys → Click on previous deploy → "Redeploy"
```

### Database
```bash
# Restore from backup (Supabase)
# Use Point-in-Time Recovery from dashboard

# Restore from backup (manual)
psql "postgresql://..." < backup.sql
```

## 12. Cost Estimates (Monthly)

### Free Tier / Starting Out
- **Vercel**: Free (Hobby plan)
- **Render**: $0-7 (Free tier for web service)
- **Supabase**: Free (up to 500MB database)
- **Cloudflare R2**: Free (up to 10GB)
- **Stripe**: Pay as you go (2.9% + 30¢ per transaction)
- **Total**: ~$0-7/month

### Small Scale (~1000 users)
- **Vercel**: $20/month (Pro plan)
- **Render**: $7-25/month (Starter instance)
- **Supabase**: $25/month (Pro plan)
- **Cloudflare R2**: $0-5/month
- **Stripe**: Transaction fees only
- **Total**: ~$52-75/month

### Medium Scale (~10,000 users)
- **Vercel**: $20/month (Pro plan)
- **Render**: $85/month (Standard instance + database)
- **Supabase**: $25-100/month (Pro plan with add-ons)
- **Cloudflare R2**: $5-20/month
- **Stripe**: Transaction fees only
- **Total**: ~$135-225/month

## Support and Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Stripe Documentation](https://stripe.com/docs)

## Troubleshooting

### Common Issues

**Frontend not loading**
- Check Vercel deployment logs
- Verify environment variables are set
- Check browser console for errors

**API returning 500 errors**
- Check Render logs
- Verify database connection string
- Verify all environment variables are set

**Webhooks not working**
- Verify webhook URL is accessible
- Check webhook secret is correct
- Test with Stripe CLI
- Review webhook event logs in Stripe dashboard

**Database connection fails**
- Check connection string format
- Verify IP whitelist (if applicable)
- Check database is running
- Verify credentials are correct

---

For additional help or questions, consult the platform documentation or reach out to the development team.
