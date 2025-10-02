import Stripe from 'stripe';
import { buffer } from 'micro';

/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for subscription lifecycle management.
 * 
 * Required Environment Variables:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Your webhook endpoint secret (starts with whsec_)
 * 
 * Setup Instructions:
 * 1. Create a webhook endpoint in Stripe Dashboard
 *    - Go to https://dashboard.stripe.com/test/webhooks
 *    - Add endpoint URL: https://your-domain.com/api/webhook
 *    - Select events to listen for (e.g., checkout.session.completed, customer.subscription.*)
 * 2. Copy the webhook signing secret (whsec_...)
 * 3. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
 * 
 * Local Testing with Stripe CLI:
 * 1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
 * 2. Login: stripe login
 * 3. Forward webhooks: stripe listen --forward-to localhost:3000/api/webhook
 * 4. The CLI will provide a webhook secret - use it in your .env.local
 * 5. Trigger test events: stripe trigger checkout.session.completed
 */

// Disable Next.js body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Stripe secret key not configured' });
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    // Get the raw body as a buffer
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      console.error('Missing stripe-signature header');
      return res.status(400).json({ error: 'Missing signature' });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature and extract event
    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    console.log(`Received event: ${event.type}`, event.id);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', {
          sessionId: session.id,
          customerId: session.customer,
          subscriptionId: session.subscription,
        });
        // TODO: Update database with subscription information
        break;

      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object;
        console.log('Subscription created:', {
          subscriptionId: subscriptionCreated.id,
          customerId: subscriptionCreated.customer,
          status: subscriptionCreated.status,
        });
        // TODO: Create subscription record in database
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        console.log('Subscription updated:', {
          subscriptionId: subscriptionUpdated.id,
          status: subscriptionUpdated.status,
        });
        // TODO: Update subscription status in database
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        console.log('Subscription deleted:', {
          subscriptionId: subscriptionDeleted.id,
          customerId: subscriptionDeleted.customer,
        });
        // TODO: Mark subscription as cancelled in database
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('Invoice payment succeeded:', {
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
        });
        // TODO: Record successful payment
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log('Invoice payment failed:', {
          invoiceId: failedInvoice.id,
          subscriptionId: failedInvoice.subscription,
        });
        // TODO: Handle failed payment (notify user, retry logic)
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    return res.status(200).json({ received: true, eventId: event.id });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
