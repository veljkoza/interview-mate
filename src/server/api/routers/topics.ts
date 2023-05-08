import { createTRPCRouter, publicProcedure } from "../trpc";

export const topicRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.topic.findMany();
  }),
});
