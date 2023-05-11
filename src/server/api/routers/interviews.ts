import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { interviewDTO } from "../DTOs/interviewDTO";
import { messageDTO } from "../DTOs/messageDTO";
import { SENDER } from "@prisma/client";

const GREETING_RESPONSE = `
Greetings, Veljko! I'm James, and I'll be conducting your interview today for the open Front-End position at OrionTech Solutions. At OrionTech, we are a dynamic and innovative software development company known for our cutting-edge solutions in the technology industry. Our team is driven by a passion for creating user-friendly and visually appealing web applications that provide exceptional user experiences.

As a Front-End Developer at OrionTech, you will play a crucial role in designing and implementing the user interface components of our projects. You will collaborate closely with our talented team of developers, designers, and project managers to translate design concepts into functional and responsive web applications. We value creativity, attention to detail, and a strong commitment to delivering high-quality solutions. We're excited to learn more about your skills and experiences to see how you can contribute to our team's success.`;

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
        select: interviewDTO,
      });

      return interview;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const interview = await ctx.prisma.interview.findFirst({
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
  sendMessage: publicProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
        sender: z.enum(["USER", "INTERVIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const interview = await ctx.prisma.interview.findUnique({
        where: { id: input.id },
        include: { messages: true }, // Include the existing messages related to the interview
      });
      if (!interview)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview with that ID hasn't been found",
        });

      const newMessage = await ctx.prisma.message.create({
        data: {
          content: input.content,
          sender: input.sender as SENDER,
          interview: { connect: { id: input.id } }, // Associate the message with the interview
        },
        select: messageDTO,
      });

      return newMessage;
    }),
  getIntroductionMessage: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const interview = await ctx.prisma.interview.findUnique({
        where: { id: input.id },
        include: { messages: true }, // Include the existing messages related to the interview
      });
      if (!interview)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview with that ID hasn't been found",
        });
      const content = GREETING_RESPONSE;
      const newMessage = await ctx.prisma.message.create({
        data: {
          content,
          sender: "INTERVIEWER",
          interview: { connect: { id: input.id } }, // Associate the message with the interview
        },
        select: messageDTO,
      });

      return newMessage;
    }),
});
