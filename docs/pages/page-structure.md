# Page Structure Documentation

## Overview

This document provides detailed specifications for each page in the NRSgirls.com website.

## Page List

### Main Website Pages
1. [index.html - Neon Design](#1-indexhtml---neon-design)
2. [index-professional.html - Professional Layout](#2-index-professionalhtml---professional-layout)
3. [about.html - About Us](#3-abouthtml---about-us)
4. [dj-enrollment.html - DJ Application](#4-dj-enrollmenthtml---dj-application)
5. [performer-enrollment.html - Performer Application](#5-performer-enrollmenthtml---performer-application)
6. [schedule.html - Launch Schedule](#6-schedulehtml---launch-schedule)
7. [legal.html - Legal Framework](#7-legalhtml---legal-framework)
8. [signup.html - Early Adopter Registration](#8-signuphtml---early-adopter-registration)

### Business/Outreach
9. [performer-pitch.html - Recruiting One-Pager](#9-performer-pitchhtml---recruiting-one-pager)

---

## 1. index.html - Neon Design

**Purpose:** Eye-catching landing page with neon aesthetic

**Design Style:** Neon lights, cyberpunk aesthetic, vibrant colors

**Key Elements:**
- Logo with neon glow effect
- Animated neon text
- Call-to-action buttons (Join as Performer, Join as DJ, Early Access)
- Brief tagline about the platform
- Background: dark with neon accents

**Content Sections:**
1. Hero section with logo and main CTA
2. Platform features (2 rooms, DJ audio bus, female performers only)
3. Quick stats or highlights
4. Footer with social links

**Technical Requirements:**
- Favicon integration
- Responsive design
- CSS animations for neon effects
- Fast loading time
- Mobile-friendly

**File Location:**
- Prototype: `frontend/nextjs/public/index-neon.html`
- Final: `frontend/nextjs/pages/index.js` (or keep as main landing)

**Assets Needed:**
- Neon logo image
- Favicon
- Background textures
- CSS for glow effects

---

## 2. index-professional.html - Professional Layout

**Purpose:** Alternative landing page with professional streaming layout

**Design Style:** Clean, modern, professional

**Key Elements:**
- Professional header with clear navigation
- Feature showcase with streaming layout recommendations
- Faster links to views/content
- Professional color scheme (blues, whites, grays)
- Trust indicators (security, compliance, revenue split)

**Content Sections:**
1. Hero with professional value proposition
2. Streaming layout recommendations
   - Optimal camera angles
   - Lighting suggestions
   - Two-room setup benefits
3. DJ audio bus explanation
4. Revenue model transparency
5. CTA for sign up

**Technical Requirements:**
- Clean, corporate design
- Performance optimized
- Clear CTAs
- Testimonials section (future)
- FAQ section

**File Location:**
- Prototype: `frontend/nextjs/public/index-professional.html`
- Final: `frontend/nextjs/pages/professional.js`

**Assets Needed:**
- Professional logo version
- Layout mockups
- Infographics for revenue split
- Professional photos

---

## 3. about.html - About Us

**Purpose:** Comprehensive information about team, technology, and business model

**Design Style:** Professional with personality, legal-style memorandum format

**Key Elements:**
- Team introduction
- Audio bus technology explanation
- Revenue split breakdown (transparent)
- Legal structure (without DJ/performer exploitation)
- Vision and mission
- Office manager role description

**Content Sections:**

### 1. Team
- Founder(s) background
- Professor from Wharton school of finance and economics
- Legal advisor information
- Office manager (until bar passage)

### 2. Technology: Audio Bus
- What is the global DJ audio bus?
- How it works technically
- Benefits for performers
- Live vs. pre-recorded options
- Synchronization across all rooms

### 3. Revenue Model
- Transparent breakdown
- No exploitation clause
- Fair split percentages
- Payment schedule
- How it differs from competitors

### 4. Legal Framework
- Business structure (NRS Group of Fresno)
- Compliance measures
- Commitment to performer rights
- Anti-bureaucracy stance
- Building towards legal change

### 5. Our Promise
- Not just another committee
- Action-oriented approach
- Advocacy commitment
- Future legal empire vision

**Technical Requirements:**
- Long-form content with anchor links
- Revenue calculator (optional interactive element)
- Print-friendly version
- SEO optimized

**File Location:**
- Final: `frontend/nextjs/pages/about.js`

**Assets Needed:**
- Team photos
- Infographics for audio bus
- Revenue model diagrams
- Legal documentation icons

---

## 4. dj-enrollment.html - DJ Application

**Purpose:** DJ application with chat integration and final discussion ingration

**Design Style:** Application form with modern UI

**Key Elements:**
- Multi-step form
- Real-time validation
- Chat integration for final discussions
- File upload for DJ mixes
- Portfolio showcase

**Content Sections:**

### Application Form

**Step 1: Basic Information**
- Full name
- Stage name
- Email
- Phone
- Location
- Social media links

**Step 2: DJ Experience**
- Years of experience
- Genres specialization
- Equipment owned
- Previous live streaming experience
- Sample mixes (upload)

**Step 3: Technical Setup**
- Software used (Serato, Traktor, etc.)
- Audio interface details
- Internet connection speed
- Streaming experience

**Step 4: Availability**
- Preferred schedule
- Time zone
- Hours per week available
- Start date

**Step 5: Chat Integration**
- "Find all chats and integrate all final discussions"
- Real-time chat with platform team
- Q&A about the role
- Contract discussion

**Technical Requirements:**
- Form validation
- File upload (audio files up to 100MB)
- Progress indicator
- Save draft functionality
- Chat widget integration
- Email notifications
- Database storage

**File Location:**
- Final: `frontend/nextjs/pages/dj-enrollment.js`
- API: `frontend/nextjs/pages/api/dj-enrollment.js`

**Assets Needed:**
- DJ icons
- Genre tags
- Upload progress indicators

---

## 5. performer-enrollment.html - Performer Application

**Purpose:** Performer application with 2257 compliance and age verification

**Design Style:** Professional, secure, compliant

**Key Elements:**
- Age verification (2257 compliance)
- Secure ID upload
- Legal agreements
- AI-generated video explaining laws
- Multi-step application process

**Content Sections:**

### Application Form

**Step 1: Age Verification (2257 Compliance)**
- Legal notice about 18 U.S.C. 2257 requirements
- ID upload (government-issued)
- Facial recognition verification
- Age confirmation checkboxes

**Step 2: Basic Information**
- Legal name (private)
- Stage name (public)
- Date of birth
- Email
- Phone
- Location
- Emergency contact

**Step 3: Experience**
- Previous streaming experience
- Platform experience (Chaturbate, etc.)
- Comfortable content types
- Boundaries and limits

**Step 4: Technical Setup**
- Camera equipment
- Lighting setup
- Internet speed test result
- Streaming software
- Two-room setup capability

**Step 5: Legal Agreements**
- AI-created video explaining the law
  - Simple, clear explanation of 2257
  - Performer rights
  - Platform responsibilities
  - Revenue agreements
- Contract review
- Electronic signature
- Copy sent to performer email

**Step 6: Banking & Payments**
- Payment method (direct deposit, crypto, etc.)
- Tax information (W-9 or W-8BEN)
- Revenue split acknowledgment

**Step 7: Final Review**
- Summary of application
- Confirmation of age verification
- Agreement acceptance
- Submit button

**Technical Requirements:**
- 2257 compliance validation
- Secure file storage (encrypted)
- ID verification API integration
- AI video generation for legal explanations
- Electronic signature capture
- Multi-factor authentication
- HTTPS only
- Data retention policies
- Age verification checkpoints throughout

**File Location:**
- Final: `frontend/nextjs/pages/performer-enrollment.js`
- API: `frontend/nextjs/pages/api/performer-enrollment.js`
- Compliance: `frontend/nextjs/lib/compliance/2257.js`

**Assets Needed:**
- 2257 compliance notice text
- Legal disclaimer templates
- AI-generated explainer video
- Secure upload interface
- Signature capture tool

**Legal Notes:**
- Must maintain 2257 records
- Age verification must be thorough
- ID copies stored securely
- Annual re-verification required
- Compliance officer assignment

---

## 6. schedule.html - Launch Schedule

**Purpose:** Launch schedule, FAQs, and calendar for both CRO and Ms. Avaggle

**Design Style:** Calendar-focused with clean layout

**Key Elements:**
- Interactive calendar
- Launch timeline
- FAQ section
- Google Workspace integration
- Event filtering

**Content Sections:**

### 1. Launch Schedule
- Key milestones
- Launch date
- Beta testing phases
- Feature rollout timeline
- Platform updates

### 2. Interactive Calendar
- Month/week/day views
- Event categories:
  - CRO (Chief Revenue Officer) schedule
  - Ms. Avaggle schedule
  - Platform events
  - DJ sessions
  - Performer orientations
  - Office hours
- Color-coded events
- RSVP functionality
- Add to personal calendar (Google, Apple, Outlook)

### 3. FAQ Section
**Platform Questions:**
- How does the DJ audio bus work?
- What equipment do I need?
- How is revenue split?
- When will the platform launch?

**Performer Questions:**
- How do I get started?
- What are the requirements?
- How much can I earn?
- Is my information secure?

**DJ Questions:**
- What genres are needed?
- How are DJ sessions scheduled?
- What technical requirements exist?
- How am I compensated?

**Technical Questions:**
- Browser compatibility
- Internet speed requirements
- Equipment recommendations
- Software needed

### 4. Google Workspace Integration
- Sync with Google Calendar
- Shared calendars for team
- Booking system for 1-on-1s
- Automated reminders

**Technical Requirements:**
- Calendar component (React)
- Google Calendar API integration
- Event filtering
- Responsive design
- FAQ accordion
- Search functionality for FAQs
- Email notifications for events
- Time zone handling

**File Location:**
- Final: `frontend/nextjs/pages/schedule.js`
- API: `frontend/nextjs/pages/api/calendar.js`

**Assets Needed:**
- Calendar icons
- Event category colors
- FAQ graphics
- Google Workspace branding

---

## 7. legal.html - Legal Framework

**Purpose:** Complete legal framework with AI paralegal for law office

**Design Style:** Professional legal interface with modern AI chat

**Key Elements:**
- Legal documentation
- AI paralegal chatbot
- NRS Group of Fresno information
- Office manager role details
- Legal resources

**Content Sections:**

### 1. Legal Framework
**Entity Information:**
- NRS Group of Fresno
- Business structure
- Registration details
- Office manager role (until bar passage)

**Compliance:**
- 18 U.S.C. 2257 compliance program
- Privacy policy
- Terms of service
- Performer agreements
- DJ agreements
- User terms

**Regulatory:**
- Payment processing compliance
- Age verification procedures
- Content moderation policies
- DMCA procedures
- Data protection (GDPR, CCPA)

### 2. AI Paralegal
**Functionality:**
- Answer common legal questions
- Document generation
- Template access
- Legal research assistance
- Case-specific guidance

**Available Templates:**
- Performer contracts
- DJ agreements
- Liability waivers
- Release forms
- Non-disclosure agreements
- Independent contractor agreements

**Legal Assistant Features:**
- Natural language queries
- Document search
- Legal definitions
- Case law references
- Statute lookups

### 3. Office Manager Designation
**Role Description:**
- Managing day-to-day operations
- Legal compliance oversight
- Until bar examination passage
- Path to attorney role
- Responsibilities and authority

### 4. Legal Resources
- Links to relevant laws (2257, etc.)
- Industry regulations
- Best practices
- Compliance checklists
- Contact information for legal team

### 5. Building Legal Change
- Vision for legal advocacy
- Commitment to performer rights
- Industry reform goals
- Legislative engagement
- Not just bureaucratic meetings

**Technical Requirements:**
- AI chatbot integration (OpenAI API or similar)
- Document storage and retrieval
- Search functionality
- Secure document generation
- User authentication for sensitive docs
- Audit logging
- Version control for legal documents

**File Location:**
- Final: `frontend/nextjs/pages/legal.js`
- API: `frontend/nextjs/pages/api/legal-assistant.js`
- Components: `frontend/nextjs/components/AIParalegal.js`

**Assets Needed:**
- Legal document templates
- AI chatbot interface
- NRS Group of Fresno branding
- Legal resource links
- Compliance checklists

**AI Paralegal Training:**
- Train on relevant laws (2257, obscenity laws, etc.)
- Platform-specific policies
- Common legal questions
- Document templates
- Performer and DJ rights

---

## 8. signup.html - Early Adopter Registration

**Purpose:** Early adopter registration and waitlist management

**Design Style:** Clean, conversion-focused

**Key Elements:**
- Simple signup form
- Value proposition
- Early adopter benefits
- Social proof
- Referral program (optional)

**Content Sections:**

### 1. Hero
- Headline: "Join NRSgirls Early Access"
- Subheadline: Benefits of early adoption
- CTA: Sign up form

### 2. Early Adopter Benefits
- First access to platform
- Exclusive features
- Discounted rates
- Priority support
- Input on feature development
- Special recognition

### 3. Signup Form
**Fields:**
- Email (required)
- Name (optional)
- Role interest:
  - [ ] Performer
  - [ ] DJ
  - [ ] User/Viewer
  - [ ] Other
- How did you hear about us?
- Referral code (optional)
- Newsletter signup checkbox

### 4. Social Proof
- Number of people on waitlist
- Testimonials (once available)
- Press mentions
- Partner logos

### 5. FAQ
- When will the platform launch?
- What happens after I sign up?
- Is my information secure?
- Can I refer friends?

**Technical Requirements:**
- Email validation
- Duplicate email prevention
- Welcome email automation
- Waitlist position assignment
- Analytics tracking
- A/B testing capability
- GDPR compliance (consent checkboxes)
- Email service integration (SendGrid, Mailchimp, etc.)

**File Location:**
- Final: `frontend/nextjs/pages/signup.js`
- API: `frontend/nextjs/pages/api/signup.js`

**Assets Needed:**
- Hero image/video
- Benefit icons
- Social proof elements
- Email templates

**Post-Signup Flow:**
1. Thank you message
2. Confirmation email
3. Welcome series (3-5 emails)
4. Updates on launch progress
5. Exclusive early access invitation

---

## 9. performer-pitch.html - Recruiting One-Pager

**Purpose:** Professional one-pager for recruiting performers

**Design Style:** Sleek, professional, persuasive

**Key Elements:**
- High-quality design
- Invideo.ai integration
- Key benefits highlighted
- Clear CTA
- Shareable format

**Content Sections:**

### 1. Hero
- Video header (Invideo.ai created)
- Headline: "Join the Future of Live Streaming"
- Subheadline: Unique value proposition

### 2. Why NRSgirls?
**Differentiators:**
- Female performers only (safer community)
- Two-room setup (more content options)
- Global DJ audio bus (unique feature)
- Fair revenue split (transparency)
- No exploitation (ethical commitment)
- Legal support (compliance assistance)
- Advanced technology (better tools)

### 3. The Technology
- Two-room streaming explanation
- DJ audio bus visualization
- Professional streaming tips
- Platform features overview

### 4. Revenue Model
- Transparent breakdown
- Comparison with competitors
- Earning potential
- Payment schedule
- No hidden fees

### 5. Getting Started
- Simple application process
- Quick onboarding
- Technical support
- Community access

### 6. Testimonials
(Once available)
- Performer success stories
- Earnings examples
- Experience highlights

### 7. CTA
- "Apply Now" button
- Link to performer-enrollment.html
- Contact information
- Social media links

**Technical Requirements:**
- Invideo.ai integration for video creation
- Responsive design (looks great on all devices)
- Downloadable PDF version
- Share buttons (social media, email, copy link)
- Analytics tracking
- QR code for easy access
- Offline functionality (key for sharing)

**File Location:**
- Prototype: `frontend/nextjs/public/performer-pitch.html`
- Final: `frontend/nextjs/pages/pitch.js`
- PDF: Generated via print stylesheet or automated tool

**Assets Needed:**
- Professional video (Invideo.ai)
- Infographics
- Revenue comparison charts
- Feature screenshots
- Professional photos
- Logo variations

**Distribution:**
- Email campaigns
- Social media
- In-person presentations
- Downloadable PDF
- QR code for quick access
- Printable version

**Video Content (Invideo.ai):**
- 30-60 second pitch
- Platform features showcase
- Revenue model explanation
- Performer testimonials
- Call to action

---

## Common Elements Across All Pages

### Header
- Logo with link to home
- Navigation menu
  - About
  - DJ Enrollment
  - Performer Enrollment
  - Schedule
  - Legal
  - Sign Up
- Login button (future)

### Footer
- Quick links
- Social media icons
- Contact information
- Legal links (Privacy, Terms, 2257 Compliance)
- Copyright notice
- Sitemap

### Favicon
- Multiple sizes (16x16, 32x32, 48x48, 180x180, 192x192)
- Formats: ICO, PNG
- Apple touch icon
- Android chrome icon
- Consistent branding

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly buttons (44x44px minimum)
- Readable font sizes (16px minimum)
- Optimized images

### Performance
- Lazy loading images
- Minified CSS/JS
- Compressed assets
- CDN delivery
- Fast page load (<3 seconds)

### SEO
- Meta titles and descriptions
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Sitemap
- Robots.txt

### Analytics
- Google Analytics or similar
- Event tracking for CTAs
- Form conversion tracking
- User flow analysis
- A/B testing setup

### Security
- HTTPS only
- Secure headers (see next.config.js)
- Content Security Policy
- Form validation
- XSS prevention
- CSRF protection

---

## Implementation Priority

### Phase 1 (Week 1-2)
1. signup.html - Get early adopters
2. index.html (neon design) - Landing page
3. performer-pitch.html - Recruiting tool

### Phase 2 (Week 3-4)
4. about.html - Platform information
5. performer-enrollment.html - Critical for onboarding
6. dj-enrollment.html - DJ onboarding

### Phase 3 (Week 5-6)
7. schedule.html - Operations tool
8. legal.html - Compliance and support
9. index-professional.html - Alternative landing

---

## Related Documentation

- [Build Configuration](../build-configuration.md)
- [Page Implementation Guide](../page-implementation-guide.md)
- [API Routes Guide](../api-routes-guide.md)
- [2257 Compliance](../legal/2257-compliance.md)
- [Security Best Practices](../security/best-practices.md)
