import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const topicRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.topic.findMany();
  }),
  getTopicsByIndustryId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.topic.findMany({
        where: {
          industryId: input.id,
        },
      });
    }),
});
