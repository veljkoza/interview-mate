import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
const IndustrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const TopicSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export const interviewRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.industry.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        industry: IndustrySchema,
        topics: z.array(TopicSchema).min(1),
        yearsOfExperience: z.number().min(1),
        durationInMinutes: z.number().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const interviewConfiguration =
        await ctx.prisma.interviewConfiguration.create({
          data: {
            industry: {
              connect: {
                id: input.industry.id,
              },
            },
            topics: {
              connect: input.topics.map(({ id }) => ({ id })),
            },
            yearsOfExperience: input.yearsOfExperience,
            durationInMinutes: input.durationInMinutes,
          },
        });
      if (!interviewConfiguration)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Something went wrong while creating interview configuration",
        });
      const interview = await ctx.prisma.interview.create({
        data: {
          configuration: {
            connect: {
              id: interviewConfiguration.id,
            },
          },
          messages: {
            createMany: {
              data: [],
            },
          },
          status: "ACTIVE",
        },
        select: {
          configuration: {
            select: {
              industry: true,
              topics: true,
              durationInMinutes: true,
              yearsOfExperience: true,
            },
          },
          messages: true,
          status: true,
          overallSatisfaction: true,
        },
      });

      return interview;
    }),
});
