import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { UserRepository } from "./user.repository";

export const userRouter = createTRPCRouter({
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    try {
      const currentUser = await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: ctx.currentUserId,
        },
        select: {
          id: true,
          interviews: {
            select: {
              status: true,
              id: true,
            },
          },
          email: true,
          firstName: true,
          lastName: true,
          image: true,
          username: true,
          numberOfQuestionsAvailable: true,
          firstInterviewCompletedAwardClaimed: true,
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
          numberOfQuestionsAvailable: +env.DEFAULT_NUMBER_OF_QUESTIONS,
        },
        select: {
          id: true,
          interviews: {
            select: {
              status: true,
              id: true,
            },
          },
          email: true,
          firstName: true,
          lastName: true,
          image: true,
          username: true,
          numberOfQuestionsAvailable: true,
          firstInterviewCompletedAwardClaimed: true,
        },
      });
      return user;
    }
  }),
  getAwardForFirstCompletedInterview: privateProcedure.mutation(
    async ({ ctx }) => {
      return await UserRepository.getAwardForFirstCompletedInterview(
        ctx.currentUserId
      );
    }
  ),
});
