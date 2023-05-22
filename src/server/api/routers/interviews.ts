import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { interviewDTO } from "../DTOs/interviewDTO";
import { messageDTO } from "../DTOs/messageDTO";
import { clerkClient } from "@clerk/nextjs";
import { InterviewRepository } from "../repository";
import { Message } from "@prisma/client";

const GREETING_RESPONSE = `
Greetings, Veljko! I'm James, and I'll be conducting your interview today for the open Front-End position at OrionTech Solutions. At OrionTech, we are a dynamic and innovative software development company known for our cutting-edge solutions in the technology industry. Our team is driven by a passion for creating user-friendly and visually appealing web applications that provide exceptional user experiences.

As a Front-End Developer at OrionTech, you will play a crucial role in designing and implementing the user interface components of our projects. You will collaborate closely with our talented team of developers, designers, and project managers to translate design concepts into functional and responsive web applications. We value creativity, attention to detail, and a strong commitment to delivering high-quality solutions. We're excited to learn more about your skills and experiences to see how you can contribute to our team's success.`;
const TELL_US_SOMETHING_ABOUT_YOURSELF =
  "Can you please tell us something more about your experience?";
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

export const interviewRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.industry.findMany();
  }),
  create: privateProcedure
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
          userId: ctx.currentUserId,
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
      const interview = await InterviewRepository.getInterviewOrThrow(ctx, {
        id: input.id,
      });

      return interview;
    }),

  answerQuestion: publicProcedure
    .input(
      z.object({ id: z.string(), question: z.string(), answer: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const interview = await InterviewRepository.getInterviewOrThrow(ctx, {
        id: input.id,
      });

      // 1.
      // get feedback and next question from openAi
      const dummyMessageMeta = await ctx.prisma.messageMetadata.create({
        data: {
          feedback:
            "Good answer! I would suggest providing specific answer next time!",
          satisfaction: 90,
          question: input.question,
        },
      });

      // 2.
      //create message for user and append metadata
      await ctx.prisma.message.create({
        data: {
          content: input.answer,
          sender: "USER",
          interview: { connect: { id: input.id } },
          metadata: { connect: { id: dummyMessageMeta.id } },
        },
        select: messageDTO,
      });

      const { messages } = interview;
      const messagesLength = messages.length + 1;

      console.log({ messages });
      const numberOfQuestions = messages.filter(
        (msg) => msg.isQuestion === true
      ).length;

      //3.
      // Get next messages
      const getTechnicalAnnouncementContent = () => [
        "Let's move on to the technical part",
        "Can you tell us the difference between JS and TS?",
      ];
      const getNextTechnicalQuestion = () => [
        "Thanks for the answer",
        "What is React?",
      ];

      const getEndingContent = () => [
        "That was a great interview.",
        "We are finished here!",
      ];

      const isEnd = numberOfQuestions >= 4;
      if (isEnd) {
        await InterviewRepository.updateInterviewById(ctx, {
          id: input.id,
          status: "COMPLETED",
        });
      }

      const getContent = () => {
        if (isEnd) {
          return getEndingContent();
        }
        if (messagesLength === 3) return getTechnicalAnnouncementContent();
        if (messages.length > 3) return getNextTechnicalQuestion();
        return getNextTechnicalQuestion();
      };
      const contents = getContent();

      const createMessages = contents.map((content, i) =>
        ctx.prisma.message.create({
          data: {
            content: content,
            sender: "INTERVIEWER",
            isQuestion: i === contents.length - 1,
            interview: { connect: { id: input.id } }, // Associate the message with the interview
          },
          select: messageDTO,
        })
      );

      const interviewerMessages = await ctx.prisma.$transaction(createMessages);

      return { messages: interviewerMessages, isEnd };
    }),
  getInterviewsForUser: privateProcedure.query(async ({ ctx }) => {
    if (!ctx.currentUserId) {
      throw new Error("No user is currently logged in");
      // or you can return an empty array if that's more suitable in your case
      // return [];
    }
    const user = await clerkClient.users.getUser(ctx.currentUserId);

    const interviews = await ctx.prisma.interview.findMany({
      where: {
        userId: user.id,
      },
      select: interviewDTO,
    });

    return interviews;
  }),
  getMessages: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const interview = await ctx.prisma.interview.findFirst({
        where: {
          id: input.id,
        },
        include: {
          messages: true,
        },
      });
      if (!interview)
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "Interview not found",
          message: "Interview not found",
        });
      const { messages } = interview;

      // if last message was by interviewer do nothing
      const lastMessageSentByInterviewer =
        messages.at(-1)?.sender === "INTERVIEWER";

      const getIntroductionContent = () => [
        GREETING_RESPONSE,
        TELL_US_SOMETHING_ABOUT_YOURSELF,
      ];
      const getTechnicalAnnouncementContent = () => [
        "Let's move on to the technical part",
        "Can you tell us the difference between JS and TS?",
      ];
      const getNextTechnicalQuestion = () => [
        "Thanks for the answer",
        "What is React?",
      ];

      const getContent = () => {
        if (messages.length === 0) return getIntroductionContent();
        if (lastMessageSentByInterviewer) return [];
        if (messages.length === 3) return getTechnicalAnnouncementContent();
        if (messages.length > 3) return getNextTechnicalQuestion();
        return getNextTechnicalQuestion();
      };
      const contents = getContent();

      const newMessages = contents.map((content, i) =>
        ctx.prisma.message.create({
          data: {
            content: content,
            sender: "INTERVIEWER",
            isQuestion: i === contents.length - 1,
            interview: { connect: { id: input.id } }, // Associate the message with the interview
          },
          select: messageDTO,
        })
      );
      const interviewerMessages = await ctx.prisma.$transaction(newMessages);
      return [...interviewerMessages];
    }),
});
