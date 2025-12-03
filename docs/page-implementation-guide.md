# Page Implementation Guide

## Overview

This guide explains how to implement the planned pages for NRSgirls.com, comparing Next.js pages vs. static HTML approaches.

## Planned Pages

### Main Website (7 HTML Pages)

1. **index.html** - Original neon design
2. **index-professional.html** - Professional streaming layout
3. **about.html** - Team, audio bus, revenue split information
4. **dj-enrollment.html** - DJ application with chat integration
5. **performer-enrollment.html** - Performer application with 2257 compliance
6. **schedule.html** - Launch schedule & FAQs with calendar
7. **legal.html** - Complete legal framework with AI paralegal
8. **signup.html** - Early adopter registration

### Business/Outreach

9. **performer-pitch.html** - Professional one-pager for recruiting

## Implementation Approaches

### Option 1: Next.js Pages (Recommended)

**Pros:**
- Full React component ecosystem
- Server-side rendering (SEO benefits)
- API routes for form submissions
- Built-in routing and navigation
- TypeScript support
- Easy integration with existing Next.js app
- Dynamic content and state management
- Image optimization
- Better performance with code splitting

**Cons:**
- Requires React/Next.js knowledge
- More complex than plain HTML
- Build step required

**Best for:**
- Pages with forms (enrollment, signup)
- Pages needing dynamic content
- Pages requiring authentication
- Complex interactions and state

### Option 2: Static HTML Files

**Pros:**
- Simple and straightforward
- No build step for HTML itself
- Easy to prototype and design
- Direct control over markup
- Can use any CSS/JS libraries

**Cons:**
- No server-side rendering
- Manual routing setup
- Harder to maintain consistency
- Limited integration with Next.js features
- No built-in form handling
- Must manage state manually

**Best for:**
- Landing pages with minimal interaction
- Marketing/pitch pages
- Quick prototypes

## Recommended Strategy

### Phase 1: Static HTML Prototypes

Create initial designs as static HTML in `public/` directory:

```
frontend/nextjs/public/
├── index-neon.html
├── index-professional.html
├── about.html
├── dj-enrollment.html
├── performer-enrollment.html
├── schedule.html
├── legal.html
├── signup.html
└── performer-pitch.html
```

**Access at:** `https://yourdomain.com/index-neon.html`

### Phase 2: Convert to Next.js Pages

Once designs are approved, convert to Next.js pages:

```
frontend/nextjs/pages/
├── index.js (already exists)
├── professional.js (was index-professional.html)
├── about.js
├── dj-enrollment.js
├── performer-enrollment.js
├── schedule.js
├── legal.js
├── signup.js
└── pitch.js (business/outreach)
```

**Access at:** `https://yourdomain.com/professional` (clean URLs)

## Implementation Details

### Using Static HTML in Next.js

Place HTML files in `public/` directory:

```html
<!-- public/index-neon.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NRSgirls - Neon Design</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/styles/neon.css">
</head>
<body>
    <!-- Your neon design content -->
    <script src="/scripts/neon.js"></script>
</body>
</html>
```

**Note:** Files in `public/` are served at the root path.

### Converting to Next.js Pages

Create React components in `pages/` directory:

```javascript
// pages/professional.js
import Head from 'next/head'
import styles from '../styles/Professional.module.css'

export default function Professional() {
  return (
    <>
      <Head>
        <title>NRSgirls - Professional Streaming</title>
        <meta name="description" content="Professional streaming layout recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1>Professional Streaming Layout</h1>
        {/* Your content */}
      </main>
    </>
  )
}
```

## Page-Specific Recommendations

### 1. index.html (Neon Design)

**Approach:** Start with static HTML, convert to Next.js later

**Rationale:**
- Design-focused landing page
- May need multiple iterations
- Easy to prototype with HTML/CSS

**File:** `public/index-neon.html` → `pages/index-neon.js`

### 2. index-professional.html

**Approach:** Start with static HTML, convert to Next.js

**Rationale:**
- Alternative landing page design
- Can A/B test with neon version
- Design iteration phase

**File:** `public/index-professional.html` → `pages/professional.js`

### 3. about.html

**Approach:** Next.js page from the start

**Rationale:**
- Content-heavy page
- May need CMS integration later
- SEO important

**File:** `pages/about.js`

**Features:**
- Team member profiles
- Audio bus explanation
- Revenue split calculator
- Legal style memorandum content

### 4. dj-enrollment.html

**Approach:** Next.js page with API routes

**Rationale:**
- Form submission required
- Chat integration needed
- Database storage
- User authentication

**File:** `pages/dj-enrollment.js` + `pages/api/dj-enrollment.js`

**Features:**
- Multi-step form
- File uploads (DJ mixes, photos)
- Real-time chat integration
- Form validation
- Email notifications

### 5. performer-enrollment.html

**Approach:** Next.js page with API routes

**Rationale:**
- Complex form with 2257 compliance
- Age verification required
- Legal documentation
- Secure file handling

**File:** `pages/performer-enrollment.js` + `pages/api/performer-enrollment.js`

**Features:**
- Age verification (2257 compliance)
- ID upload and verification
- Legal agreements and signatures
- Video explanation of laws (AI-generated)
- Secure data storage

### 6. schedule.html

**Approach:** Next.js page with dynamic content

**Rationale:**
- Calendar integration needed
- FAQ section
- Google Workspace integration
- Real-time updates

**File:** `pages/schedule.js`

**Features:**
- Interactive calendar
- Event scheduling
- FAQ accordion
- Filter by CRO/Ms. Avaggle
- Google Calendar integration

### 7. legal.html

**Approach:** Next.js page with AI integration

**Rationale:**
- AI paralegal feature
- Complex legal framework
- Document generation
- Search functionality

**File:** `pages/legal.js` + `pages/api/legal-assistant.js`

**Features:**
- Legal framework documentation
- AI paralegal chatbot
- Document templates
- NRS Group of Fresno information
- Office manager role description

### 8. signup.html

**Approach:** Next.js page with API routes

**Rationale:**
- Early adopter registration
- Database integration
- Email collection
- Analytics tracking

**File:** `pages/signup.js` + `pages/api/signup.js`

**Features:**
- Email signup form
- Early adopter perks
- Waitlist management
- Email notifications
- Analytics events

### 9. performer-pitch.html (Business/Outreach)

**Approach:** Static HTML or Next.js page

**Rationale:**
- One-pager for recruiting
- May be sent as standalone file
- Needs to work offline
- Professional presentation

**File:** `public/performer-pitch.html` or `pages/pitch.js`

**Features:**
- Professional design
- Invideo.ai integration for video
- Downloadable PDF version
- Share links
- Analytics tracking

## Build Configuration Impact

### Static HTML Files

**Build Command:** No changes needed
- Files in `public/` are copied as-is during build
- No processing or compilation

**Vercel Configuration:**
```json
{
  "framework": "nextjs"
}
```

Vercel automatically serves files from `public/` at root path.

### Next.js Pages

**Build Command:** `yarn build`
- Pages are compiled and optimized
- Server-side rendering setup
- API routes configured

**Vercel Configuration:**
```json
{
  "framework": "nextjs",
  "buildCommand": "yarn build",
  "outputDirectory": ".next"
}
```

## File Organization

```
frontend/nextjs/
├── pages/
│   ├── index.js (main landing - choose neon or professional)
│   ├── professional.js (alternative landing)
│   ├── about.js
│   ├── dj-enrollment.js
│   ├── performer-enrollment.js
│   ├── schedule.js
│   ├── legal.js
│   ├── signup.js
│   ├── pitch.js
│   └── api/
│       ├── dj-enrollment.js
│       ├── performer-enrollment.js
│       ├── signup.js
│       └── legal-assistant.js
├── public/
│   ├── favicon.ico
│   ├── neon-logo.png
│   ├── styles/
│   │   ├── neon.css (if using static HTML)
│   │   └── professional.css
│   └── scripts/
│       └── neon.js
├── styles/
│   ├── Professional.module.css
│   ├── About.module.css
│   ├── Enrollment.module.css
│   └── globals.css
└── components/
    ├── Layout.js
    ├── Navigation.js
    ├── Footer.js
    ├── EnrollmentForm.js
    └── LegalAssistant.js
```

## Favicon Setup

As noted in your plan, you need a favicon. Place it in `public/`:

```
frontend/nextjs/public/
├── favicon.ico (16x16, 32x32, 48x48)
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png (180x180)
└── android-chrome-192x192.png
```

Reference in pages:

```javascript
// Next.js pages automatically load /favicon.ico

// For custom icons:
<Head>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
</Head>
```

## Development Workflow

### Step 1: Design Phase (Static HTML)

1. Create HTML files in `public/` for design iteration
2. Use your neon design for `index-neon.html`
3. Get feedback and refine
4. No build step needed - just refresh browser

### Step 2: Functionality Phase (Next.js)

1. Convert approved designs to Next.js pages
2. Add form handling and API routes
3. Implement database integration
4. Add authentication where needed
5. Test with `yarn dev` or `vercel dev`

### Step 3: Production

1. Build with `yarn build`
2. Test production build locally: `yarn start`
3. Deploy to Vercel
4. Both static files (if any remain) and Next.js pages work together

## Testing

### Static HTML

```bash
# Serve locally
cd frontend/nextjs
python3 -m http.server 3000
# Or use any static server
```

### Next.js Pages

```bash
# Development
cd frontend/nextjs
yarn dev

# Production build
yarn build
yarn start

# With Vercel features
vercel dev
```

## SEO Considerations

### Static HTML

- Manually add meta tags
- No automatic optimization
- Need to manage sitemap manually

### Next.js Pages

- Use `next/head` for meta tags
- Automatic optimization
- Built-in image optimization
- Better crawlability

**Recommendation:** Use Next.js pages for all public-facing pages where SEO matters.

## Migration Path

1. **Week 1-2:** Create static HTML prototypes for all pages
2. **Week 3-4:** Convert high-priority pages to Next.js (signup, enrollments)
3. **Week 5-6:** Convert remaining pages to Next.js
4. **Week 7:** Remove static HTML files, use only Next.js pages

## Best Practices

1. **Start simple:** Static HTML for quick design iteration
2. **Convert strategically:** Move to Next.js for pages with forms/interaction
3. **Reuse components:** Create shared components in `components/`
4. **Consistent styling:** Use CSS modules or styled-components
5. **API security:** Validate all inputs in API routes
6. **Legal compliance:** Extra care with performer enrollment (2257)
7. **Performance:** Optimize images, lazy load components
8. **Accessibility:** Follow WCAG guidelines for all pages

## Related Documentation

- [Build Configuration](./build-configuration.md)
- [API Routes Guide](./api-routes-guide.md)
- [Component Library](./component-library.md)
- [Form Handling](./form-handling.md)
- [2257 Compliance](./legal/2257-compliance.md)
