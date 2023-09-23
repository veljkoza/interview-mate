import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import Stripe from "stripe";
import { buffer } from "stream/consumers";
import { UserRepository } from "~/server/api/user/user.repository";

// Initialize Stripe with your secret key
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});
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
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
      console.log(event.type, event.data);
      res.status(200).json(event);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const userId = event.data.object.client_reference_id;
    const questions = +event.data.object.metadata.questions;

    switch (event.type) {
      case "checkout.session.completed":
        const res = await UserRepository.incrementQuestionsForUsers(
          userId,
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
