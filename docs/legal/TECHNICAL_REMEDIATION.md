# Technical Remediation Plan
## NRSgirls.com - Development Recovery Path

**Document Created:** November 29, 2025
**Current State:** Generic GoDaddy template (non-functional)
**Target State:** Phase I MVP with core NRSgirls functionality

---

## I. CURRENT ASSETS INVENTORY

### A. Existing Codebase (This Repository)

| Asset | Location | Status | Notes |
|-------|----------|--------|-------|
| Next.js Frontend | `/frontend/nextjs/` | **FUNCTIONAL** | Stripe integration complete |
| Platform Architecture | `/nrsgirls-platform/` | Documented | Implementation pending |
| Deployment Configs | `/nrsgirls-platform/deployment/` | Ready | Docker + CI/CD configured |
| Documentation | `/docs/` | Complete | DEPLOYMENT.md, onboarding |
| Brand Assets | `/nrsgirls-platform/brand-assets/` | Placeholder | Needs custom assets |
| CI/CD Pipeline | `/.github/workflows/` | **WORKING** | Yarn-based builds |

### B. Implemented Features (frontend/nextjs)

- [x] Landing page with navigation
- [x] Pricing page ($29.99/month plan)
- [x] Stripe Checkout integration
- [x] Stripe Webhook handling (6 event types)
- [x] Account page structure
- [x] Dark theme styling
- [x] Environment configuration
- [x] Build pipeline (Yarn)

### C. Missing Features (Priority Order)

| Feature | Priority | Complexity | Dependency |
|---------|----------|------------|------------|
| Database integration | HIGH | Medium | PostgreSQL setup |
| User authentication | HIGH | Medium | Database |
| Age verification gate | HIGH | Low | None |
| Legal disclaimers | HIGH | Low | None |
| Brand logo/tagline | HIGH | Low | Asset files |
| Performer registration form | HIGH | Medium | Database |
| DJ registration form | HIGH | Medium | Database |
| Custom imagery | MEDIUM | Low | Asset procurement |
| Subscription management | MEDIUM | Medium | Auth + Database |

---

## II. REMEDIATION OPTIONS

### Option 1: Deploy Existing Codebase (Fastest)

**Timeline:** 1-2 days
**Effort:** Minimal
**Cost:** Free tier eligible

**Steps:**
1. Deploy `/frontend/nextjs/` to Vercel
2. Configure environment variables
3. Connect custom domain (nrsgirls.com)
4. Add immediate compliance features (age gate, disclaimers)

**Deliverables:**
- Functional landing page
- Stripe payment processing
- Basic account management
- Proper branding foundation

**Command Sequence:**
```bash
cd /home/user/nrsgirls/frontend/nextjs
npm install -g vercel
vercel login
vercel --prod
```

---

### Option 2: Enhanced MVP Build (Recommended)

**Timeline:** 1-2 weeks (self-guided)
**Effort:** Moderate
**Cost:** Free tier + minimal database costs

**Architecture:**

```
┌─────────────────────────────────────────────────────┐
│                   PHASE I MVP                       │
├─────────────────────────────────────────────────────┤
│  Frontend (Vercel)          │  Backend (Render)     │
│  ├── Landing Page           │  ├── Auth API         │
│  ├── Age Verification       │  ├── User Management  │
│  ├── Performer Registration │  ├── Registration API │
│  ├── DJ Registration        │  └── Webhook Handler  │
│  ├── Pricing/Checkout       │                       │
│  └── Account Dashboard      │  Database (Supabase)  │
│                             │  ├── users            │
│                             │  ├── performers       │
│                             │  └── djs              │
└─────────────────────────────────────────────────────┘
```

**Implementation Order:**

1. **Deploy current frontend** → Vercel (Day 1)
2. **Add age verification** → Modal component (Day 1)
3. **Add legal disclaimers** → Footer component (Day 1)
4. **Setup Supabase database** → Schema creation (Day 2)
5. **Add registration forms** → Performer + DJ (Days 3-4)
6. **Add authentication** → NextAuth.js (Days 5-6)
7. **Brand integration** → Logo, colors, imagery (Day 7)

---

### Option 3: Full Platform Build (If Contractor Completes)

**Timeline:** 4-6 weeks
**Effort:** Significant
**Cost:** Moderate ($50-100/month at scale)

This option only if contractor agrees to complete work under strict oversight:

**Requirements for Contract Continuation:**
- [ ] Code repository access (GitHub) from day 1
- [ ] Daily progress commits
- [ ] Weekly milestone reviews
- [ ] Payment holdback (50%) until final acceptance
- [ ] Specific acceptance criteria per feature
- [ ] Right to terminate with refund if milestones missed

---

## III. IMMEDIATE WEBSITE FIX SPECIFICATION

### If Keeping GoDaddy Hosting (Temporary)

Minimum viable updates to current site:

**Must Have:**
1. **Logo Implementation**
   - Remove URL-as-text
   - Add proper NRSgirls logo image
   - Ensure responsive sizing

2. **Tagline Addition**
   - "Where Rhythm Fuels Seduction"
   - Prominent placement below logo
   - On-brand typography

3. **Vision Statement**
   - DJ + Performer integration concept
   - Global Audio Bus preview
   - Unique value proposition

4. **Registration Forms**
   - Performer Interest Form (separate)
   - DJ Interest Form (separate)
   - Pre-launch waitlist functionality
   - Email collection with consent

5. **Age Verification**
   - Modal gate on first visit
   - 18+ confirmation required
   - Cookie to remember verification

6. **Legal Compliance**
   - Terms of Service link
   - Privacy Policy link
   - DMCA notice
   - 2257 compliance statement (if applicable)
   - California-specific disclosures

**Remove:**
- All stock photos
- Generic template content
- Default GoDaddy branding

---

## IV. DEPLOYMENT GUIDE (OPTION 2)

### A. Vercel Frontend Deployment

**Prerequisites:**
- GitHub account connected to this repo
- Vercel account (free tier)
- Stripe account with API keys

**Steps:**

1. **Connect Repository**
   ```
   - Go to vercel.com
   - Import Git Repository
   - Select: NRSgirls-com/nrsgirls
   - Root Directory: frontend/nextjs
   ```

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: yarn build
   Output Directory: .next
   Install Command: yarn install
   ```

3. **Set Environment Variables**
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

4. **Deploy**
   - Click Deploy
   - Wait for build completion
   - Verify preview URL works

5. **Connect Custom Domain**
   ```
   - Go to Project Settings → Domains
   - Add: nrsgirls.com
   - Add: www.nrsgirls.com
   - Update DNS at GoDaddy to point to Vercel
   ```

### B. DNS Migration (GoDaddy → Vercel)

**Current:** GoDaddy Website Builder
**Target:** Vercel hosting with GoDaddy domain

**DNS Records to Update:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**Propagation Time:** 24-48 hours

### C. Supabase Database Setup

1. **Create Project**
   - Go to supabase.com
   - New Project → Choose region
   - Note connection string

2. **Create Schema**
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255),
     role VARCHAR(50) DEFAULT 'user',
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Performers table
   CREATE TABLE performers (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     stage_name VARCHAR(255),
     bio TEXT,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- DJs table
   CREATE TABLE djs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     artist_name VARCHAR(255),
     genre VARCHAR(100),
     bio TEXT,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Pre-registration (for waitlist)
   CREATE TABLE registrations (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) NOT NULL,
     type VARCHAR(50) NOT NULL, -- 'performer' or 'dj'
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Update Environment**
   ```
   DATABASE_URL=postgresql://...@db.xxx.supabase.co:5432/postgres
   ```

---

## V. IMPLEMENTATION CHECKLIST

### Phase 1: Emergency Deployment (Day 1)

- [ ] Deploy frontend/nextjs to Vercel
- [ ] Configure Stripe environment variables
- [ ] Test payment flow in production
- [ ] Add age verification modal
- [ ] Add legal disclaimer footer
- [ ] Update branding (logo placeholder if needed)

### Phase 2: Core Features (Week 1)

- [ ] Setup Supabase database
- [ ] Create registration forms (Performer/DJ)
- [ ] Connect forms to database
- [ ] Add email notification for registrations
- [ ] Implement basic authentication
- [ ] Create account dashboard

### Phase 3: Brand Polish (Week 2)

- [ ] Integrate final logo assets
- [ ] Apply brand color scheme
- [ ] Replace all placeholder imagery
- [ ] Add "Where Rhythm Fuels Seduction" tagline
- [ ] Create About/Vision page
- [ ] Implement responsive design refinements

### Phase 4: Compliance (Ongoing)

- [ ] Terms of Service (legal review)
- [ ] Privacy Policy (legal review)
- [ ] DMCA agent registration
- [ ] 2257 compliance (if applicable)
- [ ] California privacy disclosures
- [ ] Cookie consent banner

---

## VI. COST ANALYSIS

### Free Tier (Recommended Start)

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel | $0 | 100GB bandwidth |
| Supabase | $0 | 500MB database |
| Stripe | 2.9% + $0.30/tx | Per transaction only |
| GoDaddy Domain | ~$15/year | Already owned |
| **Total** | **~$0/month** | Until scaling needed |

### Growth Tier (500+ users)

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel Pro | $20 | More bandwidth |
| Supabase Pro | $25 | 8GB database |
| Stripe | 2.9% + $0.30/tx | Volume discounts available |
| **Total** | **~$45/month** | |

---

## VII. SUPPORT RESOURCES

### Documentation References

- Vercel Deployment: `/docs/DEPLOYMENT.md`
- Next.js Onboarding: `/docs/onboarding/month-01/week-02.md`
- Database Setup: `/docs/onboarding/month-01/week-03.md`
- Security Checklist: `/docs/checklists/security.md`

### External Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs

---

*This remediation plan provides a clear path forward regardless of contractor dispute outcome. The existing codebase is deployment-ready and can serve as the foundation for a proper NRSgirls.com launch.*
