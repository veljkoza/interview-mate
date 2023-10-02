import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    try {
      const currentUser = await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: ctx.currentUserId,
        },
      });

      return currentUser;
    } catch (error) {
      const clerkUser = await clerkClient.users.getUser(ctx.currentUserId);
      console.log({ clerkUser });
      const user = await ctx.prisma.user.create({
        data: {
          id: clerkUser.id,
          email: clerkUser.emailAddresses.find(
            (email) => email.id === clerkUser.primaryEmailAddressId
          )?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          image: clerkUser.profileImageUrl,
          username: clerkUser.username,
        },
      });
      return user;
    }
  }),
});
