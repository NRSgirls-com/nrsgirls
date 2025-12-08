import Stripe from 'stripe';
import { z } from 'zod';

/**
 * Stripe Checkout API Route
 * 
 * Creates a Stripe Checkout session for subscription purchases.
 * 
 * Required Environment Variables:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (starts with sk_test_ or sk_live_)
 * 
 * Setup Instructions:
 * 1. Create a .env.local file in the frontend/nextjs directory
 * 2. Add: STRIPE_SECRET_KEY=sk_test_your_key_here
 * 3. For production, set this in Vercel/Render environment variables
 * 
 * Testing:
 * - Use test mode keys from https://dashboard.stripe.com/test/apikeys
 * - Test card: 4242 4242 4242 4242, any future expiry, any CVC
 */

// Request body validation schema
const CheckoutRequestSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variable
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY is not set in environment variables');
    return res.status(500).json({
      error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.',
    });
  }

  // Validate request body with Zod
  const validationResult = CheckoutRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: validationResult.error.errors,
    });
  }

  const { priceId } = validationResult.data;

  try {
    // Initialize Stripe with secret key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin || 'http://localhost:3000'}/account?success=true`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/pricing?canceled=true`,
    });

    // Return session ID to client
    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
}
