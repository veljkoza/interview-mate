import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";

export const InterviewResultRepository = {
  createInterviewResult: async ({ interviewId }: { interviewId: string }) => {
    const interviewResult = await prisma.interviewResult.create({
      data: {
        interview: {
          connect: {
            id: interviewId,
          },
        },
        units: {
          createMany: {
            data: [],
          },
        },
      },
    });
    return interviewResult;
  },
  getById: async ({ id }: { id: string }) => {
    const interviewResult = await prisma.interviewResult.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        units: {
          include: {
            relevantTopics: true,
          },
        },
        overallSatisfaction: true,
      },
    });

    if (!interviewResult) throw new TRPCError({ code: "NOT_FOUND" });
    return interviewResult;
  },
};
