import { prisma } from "~/server/db";

export const getUser = async (id: string) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id } });
  return user;
};

export const UserRepository = {
  get: getUser,
};
