# Frontend Implementation Plans

This document consolidates the planned frontend features for the NRSgirls platform.

## Homepage

The landing page and public marketing content will implement a split experience that surfaces DJ content and performer resources.

Key elements:
- Hero: DJ / Performer split call-to-action
- Features: privacy controls, moderation, streaming quality
- Community: events, local chapters, support

See shared-components section for reusable UI elements.

## DJ Portal

Contains DJ enrollment flow, upload widgets, and dashboard implementation.

Key components:
- Signup / onboarding
- Upload form with metadata and rights-check checklist
- Dashboard: upload history, analytics, monetization settings

TODO: Implement frontend pages and wire to backend API.

## Performer Portal

Performer profiles and privacy controls.

Key capabilities:
- Create/claim profile
- Choose visibility: anonymous/pseudonymous/identified
- Manage claims and takedowns

TODO: Implement frontend pages and wire to backend API.

## Shared UI Components

Reusable elements: Header, Footer, ConsentModal, PrivacySettings, FileUploader, AnalyticsCard.

TODO: Implement components in the chosen framework (React/Vue/Next.js) and expose design tokens from brand-assets/style-guide.md.

### Shared Components Package

The `@nrsgirls/shared-components` package is currently a placeholder.

Dependencies:
- React ^18.2.0
- React-DOM ^18.2.0

TODO: Build script and component implementations are pending.
