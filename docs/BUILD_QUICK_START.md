# Build Configuration Quick Start Guide

## What We've Set Up

Based on your website plan and the Vercel documentation you shared, we've configured your build settings for optimal deployment.

## Your Website Plan

You want to create **9 pages** for NRSgirls.com:

### Main Website (7 pages)
1. **index.html** - Original neon design landing page
2. **index-professional.html** - Professional streaming layout
3. **about.html** - Team, audio bus, revenue split info
4. **dj-enrollment.html** - DJ application with chat integration
5. **performer-enrollment.html** - Performer application (2257 compliance)
6. **schedule.html** - Launch schedule & FAQs with calendar
7. **legal.html** - Legal framework with AI paralegal
8. **signup.html** - Early adopter registration

### Business/Outreach (1 page)
9. **performer-pitch.html** - Professional recruiting one-pager (Invideo.ai)

## Documentation Created

### 1. Build Configuration Guide
**Location:** `docs/build-configuration.md`

**What it covers:**
- Vercel build settings for your Next.js app
- Package manager configuration (Yarn)
- Build commands and environment variables
- Troubleshooting common build issues
- CI/CD integration with GitHub Actions

**Key settings:**
- Framework: Next.js 13.5.0
- Package Manager: Yarn
- Root Directory: `frontend/nextjs`
- Build Command: `yarn build`
- Output Directory: `.next`

### 2. Page Implementation Guide
**Location:** `docs/page-implementation-guide.md`

**What it covers:**
- Two approaches: Next.js pages vs. Static HTML
- Pros and cons of each approach
- Recommended strategy (start with HTML prototypes, convert to Next.js)
- Specific recommendations for each page
- Migration path from static to dynamic

**Key recommendations:**
- Start with static HTML in `public/` for quick design iteration
- Convert to Next.js pages for forms and interactive features
- Use Next.js for: enrollments, signup, schedule, legal (AI chat)
- Keep as HTML (optional): pitch page, alternative designs

### 3. Page Structure Documentation
**Location:** `docs/pages/page-structure.md`

**What it covers:**
- Detailed specifications for all 9 pages
- Content sections and required elements
- Technical requirements for each page
- Assets needed
- Implementation priority

**Highlights:**
- 2257 compliance requirements for performer-enrollment
- AI paralegal integration for legal page
- Chat integration for DJ enrollment
- Calendar integration for schedule page
- Invideo.ai integration for pitch page

### 4. Configuration Files

#### vercel.json
**Location:** `frontend/nextjs/vercel.json`

**What it does:**
- Configures Vercel deployment settings
- Sets up security headers
- Configures rewrites for clean URLs
- Specifies build commands and environment

**Key features:**
- Framework: Next.js
- Region: IAD1 (US East)
- Security headers for XSS protection
- Clean URL rewrites

#### next.config.js
**Location:** `frontend/nextjs/next.config.js`

**What's new:**
- Security headers (HSTS, CSP, etc.)
- Image optimization settings
- Compression enabled
- Removed `X-Powered-By` header
- Redirects and rewrites configuration

## Next Steps

### 1. Add Your Favicon (Required)

You mentioned needing a favicon. Create these files:

```
frontend/nextjs/public/
├── favicon.ico (16x16, 32x32, 48x48)
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png (180x180)
└── android-chrome-192x192.png
```

**Quick way to generate:**
- Use a tool like https://realfavicongenerator.net/
- Upload your logo image
- Download the package
- Place files in `public/` directory

### 2. Start Building Pages

**Option A: Quick Prototypes (Recommended First)**

Create static HTML files for design iteration:

```bash
cd frontend/nextjs/public

# Create your pages
touch index-neon.html
touch index-professional.html
touch about.html
touch dj-enrollment.html
touch performer-enrollment.html
touch schedule.html
touch legal.html
touch signup.html
touch performer-pitch.html
```

Access at: `http://localhost:3000/index-neon.html`

**Option B: Next.js Pages (For Production)**

Create React components:

```bash
cd frontend/nextjs/pages

# Create your pages
touch professional.js
touch about.js
touch dj-enrollment.js
touch performer-enrollment.js
touch schedule.js
touch legal.js
touch signup.js
touch pitch.js
```

Access at: `http://localhost:3000/professional` (clean URLs)

### 3. Test Your Build

```bash
cd frontend/nextjs

# Install dependencies (if not already done)
yarn install

# Run development server
yarn dev

# Open browser to http://localhost:3000

# Test production build
yarn build
yarn start
```

### 4. Set Up Environment Variables

For local development, create `.env.local`:

```bash
cd frontend/nextjs
cp .env.example .env.local

# Edit .env.local with your keys
nano .env.local
```

Add your API keys:
```
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-... (for AI paralegal)
GOOGLE_CALENDAR_API_KEY=... (for schedule page)
```

For Vercel deployment, add these in:
**Vercel Dashboard > Project Settings > Environment Variables**

### 5. Deploy to Vercel

```bash
# First time: Link to Vercel project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Or push to your branch and let GitHub Actions handle it!

## Build Command Reference

### Local Development

```bash
# Install dependencies
yarn install

# Run dev server (hot reload)
yarn dev

# Run dev with Vercel features
vercel dev

# Lint code
yarn lint

# Build for production
yarn build

# Test production build locally
yarn start
```

### Vercel Deployment

Automatic on git push, or manual:

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Check logs
vercel logs [deployment-url]
```

## Troubleshooting

### Build fails with "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules
rm yarn.lock
yarn install
```

### Pages not loading
- Check file is in correct directory (`pages/` or `public/`)
- Verify file extension (`.js` for Next.js, `.html` for static)
- Check Next.js dev server is running

### Environment variables not working
- Prefix with `NEXT_PUBLIC_` for client-side access
- Add to `.env.local` for local dev
- Add to Vercel dashboard for deployments
- Restart dev server after adding

### Build succeeds but page is blank
- Check browser console for errors
- Verify all components are exported correctly
- Check for typos in file paths

## Implementation Timeline

### Week 1-2: Foundation
- [ ] Add favicon
- [ ] Create static HTML prototypes for all pages
- [ ] Get design feedback
- [ ] Set up basic styles and assets

### Week 3-4: Core Functionality
- [ ] Convert signup.html to Next.js (priority for early adopters)
- [ ] Convert performer-enrollment.html to Next.js (2257 compliance)
- [ ] Convert dj-enrollment.html to Next.js (with chat)
- [ ] Set up API routes for forms

### Week 5-6: Advanced Features
- [ ] Convert schedule.html to Next.js (calendar integration)
- [ ] Convert legal.html to Next.js (AI paralegal)
- [ ] Convert about.html to Next.js
- [ ] Finalize pitch page

### Week 7: Polish & Launch
- [ ] Remove static HTML files (if fully converted)
- [ ] SEO optimization
- [ ] Performance testing
- [ ] Security audit
- [ ] Launch!

## Key Features to Implement

### High Priority
1. **Early Adopter Signup** - Get waitlist going ASAP
2. **Performer Enrollment** - With 2257 compliance
3. **DJ Enrollment** - With chat integration
4. **Favicon** - Professional branding

### Medium Priority
5. **About Page** - Platform information
6. **Schedule Page** - Calendar integration
7. **Legal Page** - AI paralegal feature
8. **Pitch Page** - Recruiting tool

### Lower Priority
9. **Alternative Landing Pages** - A/B testing

## Resources

### Documentation
- [Build Configuration Details](./build-configuration.md)
- [Page Implementation Guide](./page-implementation-guide.md)
- [Page Structure Specifications](./pages/page-structure.md)

### External Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [2257 Compliance Resources](https://www.justice.gov/criminal-ceos/18-usc-2257)
- [Yarn Documentation](https://classic.yarnpkg.com/en/docs/)

## Questions?

If you need help with:
- **Build configuration:** See `docs/build-configuration.md`
- **Page implementation:** See `docs/page-implementation-guide.md`
- **Specific page details:** See `docs/pages/page-structure.md`
- **Vercel settings:** Check `frontend/nextjs/vercel.json`
- **Next.js config:** Check `frontend/nextjs/next.config.js`

## Summary

You now have:
- ✅ Complete build configuration for Vercel
- ✅ Next.js optimized settings
- ✅ Security headers configured
- ✅ Documentation for all 9 pages
- ✅ Implementation strategy (HTML → Next.js)
- ✅ Clear next steps and timeline

Ready to start building! 🚀
