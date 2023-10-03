/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export const loggerService = {
  log: async (body: any, message?: string) => {
    const loggingEnabled = +(env.LOGGING_ENABLED || 0);
    if (!loggingEnabled) return;
    return prisma.log.create({
      data: {
        body,
        message,
      },
    });
  },
};
