import { User } from "@prisma/client";
import { prisma } from "~/server/db";

export const getUser = async (id: string) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id } });
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

export const UserRepository = {
  get: getUser,
  update: updateUser,
  incrementQuestionsForUsers,
  decrementQuestionsForUsers,
};
