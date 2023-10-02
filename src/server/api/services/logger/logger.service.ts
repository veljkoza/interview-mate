/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { prisma } from "~/server/db";

export const loggerService = {
  log: async (body: any, message?: string) => {
    return prisma.log.create({
      data: {
        body,
        message,
      },
    });
  },
};
