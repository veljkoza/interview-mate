import Stripe from "stripe";
import { env } from "~/env.mjs";
// Initialize Stripe with your secret key
export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});
