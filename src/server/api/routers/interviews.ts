import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
const IndustrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const TopicSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const interviewDTO = {
  id: true,
  configuration: {
    select: {
      industry: {
        select: {
          id: true,
          name: true,
        },
      },
      topics: true,
      durationInMinutes: true,
      yearsOfExperience: true,
    },
  },
  messages: true,
  status: true,
  overallSatisfaction: true,
};

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
        select: interviewDTO,
      });

      return interview;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const interview = await prisma.interview.findFirst({
        where: {
          id: input.id,
        },
        select: interviewDTO,
      });
      if (!interview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "There's no interview with that id",
        });
      }

      return interview;
    }),
});
