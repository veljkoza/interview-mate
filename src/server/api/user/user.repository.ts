import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";

export const getUser = async (id: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { id },
    include: {
      interviews: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
  return user;
};

export const updateUser = async (id: string, data: Partial<User>) => {
  return await prisma.user.update({
    where: { id },
    data: {
      ...data,
    },
  });
};

export const incrementQuestionsForUsers = async (
  id: string,
  questionsToAdd: number
) => {
  const user = await UserRepository.get(id);
  const newQuestionsQuantity = (user.numberOfQuestionsAvailable +=
    questionsToAdd);
  return await UserRepository.update(id, {
    numberOfQuestionsAvailable: newQuestionsQuantity,
  });
};

export const decrementQuestionsForUsers = async (
  id: string,
  questionsToAdd: number
) => {
  const user = await UserRepository.get(id);
  const getNewQuantity = () => {
    const newQuestionsQuantity = (user.numberOfQuestionsAvailable -=
      questionsToAdd);
    if (newQuestionsQuantity < 0) return 0;
    return newQuestionsQuantity;
  };
  const newQuestionsQuantity = getNewQuantity();
  return await UserRepository.update(id, {
    numberOfQuestionsAvailable: newQuestionsQuantity,
  });
};

export const getAwardForFirstCompletedInterview = async (id: string) => {
  const user = await UserRepository.get(id);
  if (!user.firstInterviewCompletedAwardClaimed) {
    try {
      await UserRepository.incrementQuestionsForUsers(id, 20);
      await UserRepository.update(id, {
        firstInterviewCompletedAwardClaimed: true,
      });

      return { awarded: true, questions: 20 };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Something went wrong while claiming error for first completed interview",
      });
    }
  }

  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "User already claimed the reward.",
  });
};

export const UserRepository = {
  get: getUser,
  update: updateUser,
  incrementQuestionsForUsers,
  decrementQuestionsForUsers,
  getAwardForFirstCompletedInterview,
};
