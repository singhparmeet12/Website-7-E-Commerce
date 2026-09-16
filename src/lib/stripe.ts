import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key';

export const isStripeConfigured = () => {
  return (
    Boolean(process.env.STRIPE_SECRET_KEY) &&
    process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder_key' &&
    process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
  );
};

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});
