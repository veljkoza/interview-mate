import { createTRPCRouter, privateProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: privateProcedure.query(({ ctx }) => {
    const currentUser = ctx.prisma.user.findFirstOrThrow({
      where: {
        id: ctx.currentUserId,
      },
    });
    return currentUser;
  }),
});
