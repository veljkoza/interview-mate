import { env } from "~/env.mjs";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { Stripe } from "stripe";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});
export const stripeRouter = createTRPCRouter({
  createCheckoutSession: privateProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            price: z.number(),
            questions: z.number(),
            title: z.string(),
            description: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const origin = ctx.req.headers.origin || "";
      const items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        input.items.map((item) => ({
          quantity: 1,
          price_data: {
            currency: "USD",
            unit_amount: item.price * 100,
            product_data: {
              name: `${item.title} - ${item.questions} questions`,
              description: item.description,
            },
          },
        }));
      const session = await stripe.checkout.sessions.create({
        metadata: {
          questions: input.items.reduce(
            (acc, item) => (acc += item.questions),
            0
          ),
        },
        line_items: items,
        mode: "payment",
        success_url: `${origin}/?success=true`,
        cancel_url: `${origin}/?canceled=true`,
        automatic_tax: { enabled: true },
        client_reference_id: ctx.currentUserId,
      });

      return session.url;
    }),
});
