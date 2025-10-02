# Homepage - NRSgirls Platform

## Overview
The landing page for NRSgirls.com featuring a split design that highlights both DJ and Performer sections, providing clear navigation paths for different user types.

## Features

### DJ/Performer Split View
- **Left Side**: DJ section with mixing features and music upload highlights
- **Right Side**: Performer section with streaming and privacy features
- Smooth animations and transitions between sections
- Mobile-responsive design

### Navigation
- Clear call-to-action buttons for:
  - DJ Enrollment
  - Performer Registration
  - Viewer Sign Up
  - Login for existing users
- Featured live streams carousel
- Trending content showcase

### Content Sections
1. **Hero Section**: Split-screen design with DJ and Performer highlights
2. **How It Works**: Step-by-step explanation for each user type
3. **Featured Creators**: Carousel of top DJs and performers
4. **Live Now**: Real-time display of active streams
5. **Statistics**: Platform metrics (creators, viewers, earnings)
6. **Testimonials**: Creator success stories
7. **Footer**: Links, policies, social media

## Technology Stack
- **Framework**: React with Next.js
- **Styling**: Tailwind CSS or styled-components
- **Animations**: Framer Motion
- **State Management**: React Context or Redux
- **API Integration**: REST API for dynamic content

## Components

### Key Components
- `HeroSection.jsx` - Split-screen hero with DJ/Performer sections
- `FeaturedCreators.jsx` - Carousel of top creators
- `LiveStreams.jsx` - Real-time live stream grid
- `HowItWorks.jsx` - Step-by-step process explanation
- `Statistics.jsx` - Platform metrics display
- `Testimonials.jsx` - Creator success stories
- `Navigation.jsx` - Header with user type navigation
- `Footer.jsx` - Site-wide footer with links

## Responsive Design
- Desktop: Full split-screen experience
- Tablet: Stacked sections with maintained hierarchy
- Mobile: Vertical scroll with optimized content

## SEO Optimization
- Meta tags for search engines
- Open Graph tags for social sharing
- Structured data markup
- Optimized images and lazy loading
- Fast page load times (<2 seconds)

## Development Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## File Structure
```
homepage/
├── components/
│   ├── HeroSection.jsx
│   ├── FeaturedCreators.jsx
│   ├── LiveStreams.jsx
│   ├── HowItWorks.jsx
│   ├── Statistics.jsx
│   ├── Testimonials.jsx
│   ├── Navigation.jsx
│   └── Footer.jsx
├── styles/
│   ├── homepage.css
│   └── animations.css
├── assets/
│   ├── images/
│   └── icons/
├── pages/
│   └── index.jsx
└── README.md
```

## API Endpoints Used
- `GET /api/stream/live` - Fetch live streams
- `GET /api/featured-creators` - Get featured DJs and performers
- `GET /api/statistics` - Platform statistics
- `GET /api/testimonials` - Creator testimonials

## Testing
- Unit tests for all components
- Integration tests for user flows
- E2E tests for critical paths
- Performance testing for load times

## Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements met
- Alt text for all images
