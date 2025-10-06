# nrsgirls

NRSgirls.com – monorepo for the DJ + performer live-streaming platform (web, API, infra, legal). Private, pre-launch. Contains dev/staging/prod env templates, CI/CD, and policy docs. © NRS Group of Fresno. All rights reserved.

## Quick Start

### Using Dev Container (Recommended)

This repository includes a VS Code Dev Container configuration for a consistent development environment.

#### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [VS Code](https://code.visualstudio.com/)
- [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

#### Steps
1. Clone the repository
2. Open in VS Code
3. When prompted, click "Reopen in Container" (or press `F1` → "Remote-Containers: Reopen in Container")
4. The container will build and run `setup.sh` automatically
5. Set up environment variables (see below)

### Local Setup (Without Container)

#### Prerequisites
- Node.js 18 or later
- npm or yarn
- Git

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/NRSgirls-com/nrsgirls.git
   cd nrsgirls
   ```

2. Run the setup script:
   ```bash
   bash nrsgirls-platform/scripts/setup.sh
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. Set up frontend environment:
   ```bash
   cd frontend/nextjs
   cp .env.example .env.local
   # Edit .env.local with your Stripe keys
   ```

5. Install frontend dependencies:
   ```bash
   cd frontend/nextjs
   npm install
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Visit http://localhost:3000

## Environment Variables

### Root `.env`
Contains platform-wide configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token signing
- `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: Object storage credentials

### Frontend `.env.local`
Contains frontend-specific configuration:
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret

**Important**: Never commit real secrets. Use `.env.example` files as templates.

## Project Structure

```
nrsgirls/
├── .devcontainer/          # VS Code Dev Container configuration
├── .github/workflows/      # GitHub Actions CI/CD
├── .vscode/                # VS Code workspace settings and tasks
├── frontend/nextjs/        # Next.js frontend application
├── nrsgirls-platform/      # Platform scaffold and documentation
│   ├── backend/           # Backend API stubs
│   ├── frontend/          # Frontend component stubs
│   ├── scripts/           # Automation scripts
│   ├── deployment/        # Docker and deployment configs
│   └── docs/              # Technical specs and documentation
├── docs/                   # Additional documentation
│   └── DEPLOYMENT.md      # Production deployment guide
├── env/                    # Environment configurations
└── README.md              # This file
```

## Available Scripts

Run these from the root directory:

```bash
# Setup: Install dependencies
bash nrsgirls-platform/scripts/setup.sh

# Frontend: Build
bash nrsgirls-platform/scripts/build-frontend.sh

# Lint and Test
bash nrsgirls-platform/scripts/lint-test.sh

# Deploy (Docker Compose)
bash nrsgirls-platform/scripts/deploy.sh dev

# Environment Check
bash nrsgirls-platform/scripts/env-check.sh
```

Or use VS Code tasks (`Ctrl+Shift+B` or `Cmd+Shift+B`):
- Setup: Run setup.sh
- Frontend: Build
- Frontend: Dev Server
- Docker: Start Compose
- Lint and Test

## Development Workflow

### Working with the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend/nextjs
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make changes and test locally

4. Build for production:
   ```bash
   npm run build
   ```

### Testing Stripe Integration

1. Get your Stripe test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

2. Install the Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Other platforms: https://stripe.com/docs/stripe-cli#install
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. Test checkout flow at http://localhost:3000/pricing

5. Trigger webhook events:
   ```bash
   stripe trigger checkout.session.completed
   ```

## CI/CD

This repository uses GitHub Actions for continuous integration:
- **On push/PR**: Runs setup, lint, test, and build
- **No automatic deployment**: All deployments are manual
- See `.github/workflows/ci.yml` for configuration

## Deployment

For production deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Recommended stack:
- **Frontend**: Vercel
- **API**: Render or Fly.io
- **Database**: Supabase or Neon (PostgreSQL)
- **Storage**: Cloudflare R2 or AWS S3
- **Payments**: Stripe

## Branch: nrsgirls-setup

The `nrsgirls-setup` branch contains the reproducible developer environment setup, CI workflows, minimal Next.js frontend scaffold with Stripe integration, and deployment documentation. This branch is under review via pull request.

To test this setup:
1. Checkout the `nrsgirls-setup` branch
2. Follow the Quick Start instructions above
3. Test the frontend and Stripe integration locally

## Contributing

This is a private repository. For internal team members:
1. Create a feature branch from `main`
2. Make your changes
3. Run lint and tests locally
4. Create a pull request for review
5. After approval, merge to `main`

## License

© NRS Group of Fresno. All rights reserved. Private, proprietary software.
