/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import Stripe from "stripe";
import { buffer } from "stream/consumers";
import { UserRepository } from "~/server/api/user/user.repository";
import { stripeClient } from "~/server/api/stripe/stripe.client";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Your Stripe CLI webhook secret for testing your endpoint locally
const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("123usao sam!");
  if (req.method === "POST") {
    // Buffering the request body
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
      console.log(event.type, event.data);
      res.status(200).json(event);
    } catch (err) {
      const error = err as any;
      return res.status(400).send(`Webhook Error: ${error.message || ""}`);
    }
    const eventAny = event as unknown as any;
    const userId = eventAny.data.object.client_reference_id;
    const questions = +eventAny.data.object.metadata.questions;

    switch (event.type) {
      case "checkout.session.completed":
        const res = await UserRepository.incrementQuestionsForUsers(
          userId as string,
          questions
        );
        console.log(res, "hazbula");
        break;

      default:
        break;
    }

    console.log("✅ Success:", event.id);
    return res.status(200).json({ received: true });
  }

  // Return a 405 Method Not Allowed if the request method is not POST
  res.setHeader("Allow", "POST");
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
