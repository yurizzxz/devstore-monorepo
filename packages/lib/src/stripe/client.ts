import Stripe from "stripe";

export type { Stripe };

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY não definida.",
  );
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
);
