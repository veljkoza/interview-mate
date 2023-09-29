/* eslint-disable @typescript-eslint/require-await */
import type { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookRequiredHeaders } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { prisma } from "~/server/db";
import { loggerService } from "~/server/api/services/logger/logger.service";
type User = {
  data: {
    birthday: string;
    created_at: number;
    email_addresses: {
      email_address: string;
      id: string;
      linked_to: any[];
      object: string;
      verification: {
        status: string;
        strategy: string;
      };
    }[];
    external_accounts: any[];
    external_id: string;
    first_name: string;
    gender: string;
    id: string;
    image_url: string;
    last_name: string;
    last_sign_in_at: number;
    object: string;
    password_enabled: boolean;
    phone_numbers: any[];
    primary_email_address_id: string;
    primary_phone_number_id: null | string;
    primary_web3_wallet_id: null | string;
    private_metadata: Record<string, unknown>;
    profile_image_url: string;
    public_metadata: Record<string, unknown>;
    two_factor_enabled: boolean;
    unsafe_metadata: Record<string, unknown>;
    updated_at: number;
    username: null | string;
    web3_wallets: any[];
  };
  object: string;
  type: string;
};
const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  void loggerService.log(req, "CLERK-WH: Request payload");
  const payload = req.body as unknown as User;
  const headers = req.headers;
  const user = payload.data;
  const type = payload.type;
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(JSON.stringify(payload), headers) as WebhookEvent;
    void loggerService.log(payload, "CLERK-WH: Bad webhook payload");
  } catch (_) {
    void loggerService.log(_, "CLERK-WH-ERROR: Bad webhook payload");

    // If the verification fails, return a 400 error
    return res.status(400).json({ message: "lose" });
  }

  const eventType = type;
  if (eventType === "session.created") {
    try {
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email_addresses.find(
            (email) => email.id === user.primary_email_address_id
          )?.email_address,
          firstName: user.first_name,
          lastName: user.last_name,
          image: user.profile_image_url,
          username: user.username,
        },
      });
      console.log({ newUser });
      void loggerService.log(newUser, "CLERK: User created from webhook");
      res.status(201).json(user);
    } catch (error) {
      void loggerService.log(error, "CLERK-ERROR: User created from webhook");
    }
  }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
