import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Industry } from "@prisma/client";
import { TRPCError } from "@trpc/server";



export const industryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.industry.findMany();
  }),
});
