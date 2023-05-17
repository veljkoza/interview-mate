import { createTRPCRouter, publicProcedure } from "../trpc";



export const industryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.industry.findMany();
  }),
});
