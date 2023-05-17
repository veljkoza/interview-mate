import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TRPCContextType, createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { interviewDTO } from "../DTOs/interviewDTO";
import { messageDTO } from "../DTOs/messageDTO";
import { Message, SENDER } from "@prisma/client";

const GREETING_RESPONSE = `
Greetings, Veljko! I'm James, and I'll be conducting your interview today for the open Front-End position at OrionTech Solutions. At OrionTech, we are a dynamic and innovative software development company known for our cutting-edge solutions in the technology industry. Our team is driven by a passion for creating user-friendly and visually appealing web applications that provide exceptional user experiences.

As a Front-End Developer at OrionTech, you will play a crucial role in designing and implementing the user interface components of our projects. You will collaborate closely with our talented team of developers, designers, and project managers to translate design concepts into functional and responsive web applications. We value creativity, attention to detail, and a strong commitment to delivering high-quality solutions. We're excited to learn more about your skills and experiences to see how you can contribute to our team's success.`;

const openAIResponse = {
  response: "That's a great answer!",
  nextQuestion: "What is Javascript?",
};

const IndustrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const TopicSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const createMessageForInterview = async (
  ctx: TRPCContextType,
  data: Pick<Message, "interviewId" | "content" | "sender" | "isQuestion">
) => {
  const interview = await ctx.prisma.interview.findUnique({
    where: { id: data.interviewId },
    include: { messages: true }, // Include the existing messages related to the interview
  });
  if (!interview)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Interview with that ID hasn't been found",
    });

  const newMessage = await ctx.prisma.message.create({
    data: {
      content: data.content,
      sender: data.sender,
      isQuestion: data.isQuestion,
      interview: { connect: { id: interview.id } }, // Associate the message with the interview
    },
    select: messageDTO,
  });

  return newMessage;
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
          User: { connect: { id: ctx.currentUser?.id } },
          status: "ACTIVE",
          phase: "INTRODUCTION",
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
      const newMessage = await createMessageForInterview(ctx, {
        content: input.content,
        interviewId: input.id,
        sender: input.sender,
        isQuestion: false,
      });

      return newMessage;
    }),
  getIntroductionMessage: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const content = GREETING_RESPONSE;
      const newMessage = await createMessageForInterview(ctx, {
        content,
        sender: "INTERVIEWER",
        isQuestion: false,
        interviewId: input.id,
      });

      return newMessage;
    }),
  askCandidateToIntroduceHimself: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const content = "Can you please introduce yourself?";

      const newMessage = await createMessageForInterview(ctx, {
        content,
        sender: "INTERVIEWER",
        isQuestion: true,
        interviewId: input.id,
      });

      return newMessage;
    }),
  announceTechnicalPart: publicProcedure
    .input(z.object({ id: z.string() }))
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
      const openAIresponse = "Let's start with the technical interview now!";
      const newMessage = await ctx.prisma.message.create({
        data: {
          content: openAIresponse,
          sender: "INTERVIEWER",
          isQuestion: false,
          interview: { connect: { id: input.id } }, // Associate the message with the interview
        },
        select: messageDTO,
      });

      return newMessage;
    }),
  askTechnicalQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
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
      const openAIresponse = "What is React?";
      const newMessage = await ctx.prisma.message.create({
        data: {
          content: openAIresponse,
          sender: "INTERVIEWER",
          isQuestion: true,
          interview: { connect: { id: input.id } }, // Associate the message with the interview
        },
        select: messageDTO,
      });

      return newMessage;
    }),
  answerQuestion: publicProcedure
    .input(
      z.object({ id: z.string(), question: z.string(), answer: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      /**
       * 1. create user's message
       * 2. get feedback and question from openai
       * 3. create message metadata from response from openai and input
       * 4. append messagedata to user's message
       * ---------------------------
       * 1. create interviewer's message from `response` field of openAi response
       * 2. create interviewer's message from `nextQuestion` field of openAi response
       * ---------
       * return allMessages
       */

      // const usersAnswerMessage = await createMessageForInterview(ctx, {content})
      const interview = await ctx.prisma.interview.findUnique({
        where: { id: input.id },
        include: { messages: true }, // Include the existing messages related to the interview
      });
      if (!interview)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview with that ID hasn't been found",
        });

      // get feedback and next question from openAi
      const contents = [openAIResponse.response, openAIResponse.nextQuestion];
      const dummyMessageMeta = await ctx.prisma.messageMetadata.create({
        data: {
          feedback:
            "Good answer! I would suggest providing specific answer next time!",
          satisfaction: 90,
          question: input.question,
        },
      });
      const usersMessage = await ctx.prisma.message.create({
        data: {
          content: input.answer,
          sender: "USER",
          interview: { connect: { id: input.id } },
          metadata: { connect: { id: dummyMessageMeta.id } },
        },
        select: messageDTO,
      });
      const createMessages = contents.map((content, i) =>
        ctx.prisma.message.create({
          data: {
            content: content,
            sender: "INTERVIEWER",
            isQuestion: i === 1,
            interview: { connect: { id: input.id } }, // Associate the message with the interview
          },
          select: messageDTO,
        })
      );

      const interviewerMessages = await ctx.prisma.$transaction(createMessages);

      return [usersMessage, ...interviewerMessages];
    }),
  getInterviewsForUser: publicProcedure.query(async ({ ctx }) => {
    const interviews = await ctx.prisma.interview.findMany({
      where: {
        userId: ctx.currentUser?.id,
      },
      select: interviewDTO,
    });

    return interviews;
  }),
});
