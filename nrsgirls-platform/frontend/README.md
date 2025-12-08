# NRSgirls Platform - Frontend

A Next.js application for the NRSgirls platform connecting DJs and performers with privacy-first features and Stripe integration.

## Project Structure

```
frontend/
├── pages/              # Next.js pages and routes
│   ├── index.js       # Landing page / Homepage
│   ├── pricing.js     # Pricing and subscription plans
│   ├── account.js     # User account management
│   ├── help/          # Help center pages
│   └── api/           # API routes
│       ├── checkout.js # Stripe Checkout sessions
│       └── webhook.js  # Stripe webhook handler
├── styles/            # Global CSS styles
├── public/            # Static assets
├── homepage/          # Homepage component documentation
├── dj-portal/         # DJ portal documentation (to be implemented)
├── performer-portal/  # Performer portal documentation (to be implemented)
└── shared-components/ # Shared React components
```

## Features

- **Landing Page** (`/`): Homepage with navigation to Pricing, Account, and Help
- **Pricing Page** (`/pricing`): Display subscription plans with Stripe Checkout integration
- **Account Page** (`/account`): Shows subscription status (placeholder for full implementation)
- **Help Center** (`/help`): Documentation and help resources
- **API Routes**:
  - `/api/checkout`: Creates Stripe Checkout sessions
  - `/api/webhook`: Handles Stripe webhook events

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Stripe account (for testing, use test mode keys)

### Installation

1. Navigate to the frontend directory:
```bash
cd nrsgirls-platform/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Stripe keys:
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### Running Locally

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. For webhook testing with Stripe CLI:
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

The Stripe CLI will output a webhook secret - copy this to your `.env.local` file.

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret API key (starts with `sk_test_` or `sk_live_`) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Webhook endpoint secret (starts with `whsec_`) | Yes for webhooks |

**Important**: Never commit real API keys to version control. Always use environment variables or secret management systems.

## Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `nrsgirls-platform/frontend`
4. Add environment variables in Vercel dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
5. Set up Stripe webhook endpoint:
   - URL: `https://your-app.vercel.app/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

See [/docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md) for complete deployment instructions.

## Testing with Stripe

### Test Mode

Use Stripe's test mode keys and test card numbers:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### Webhook Testing

Use the Stripe CLI to forward webhook events to your local development server:

```bash
stripe listen --forward-to localhost:3000/api/webhook
stripe trigger checkout.session.completed
```

## Component Organization

### Homepage
The homepage component provides the main landing page with split call-to-action for DJs and performers. See `homepage/README.md` for details.

### DJ Portal (Planned)
DJ enrollment, upload widgets, and dashboard. See `dj-portal/README.md` for implementation notes.

### Performer Portal (Planned)
Performer profiles and privacy controls. See `performer-portal/README.md` for implementation notes.

### Shared Components
Reusable UI components shared across all portals. See `shared-components/README.md` for available components.

## Security Notes

- All Stripe operations happen server-side via API routes
- Webhook signature verification ensures authenticity
- Never expose secret keys in client-side code
- In production, use a secret management service (e.g., AWS Secrets Manager, Vercel Environment Variables)

## Next Steps

1. Replace placeholder price IDs with real Stripe Price IDs
2. Add database integration to store subscription data
3. Implement user authentication (Auth0, NextAuth.js, etc.)
4. Add session management and protected routes
5. Implement DJ portal pages
6. Implement Performer portal pages
7. Build shared component library
8. Add error logging and monitoring (Sentry, LogRocket, etc.)

## Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Stripe API Documentation](https://stripe.com/docs/api)
- See [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- Review platform documentation in `/docs`
