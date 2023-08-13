/* eslint-disable @typescript-eslint/no-floating-promises */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { interviewDTO } from "../DTOs/interviewDTO";
import { messageDTO } from "../DTOs/messageDTO";
import { clerkClient } from "@clerk/nextjs";
import { InterviewResultRepository } from "../interview-result/interview-result.repository";
import { InterviewRepository } from "./interview.repository";
import { MockInterviewAiService } from "../services/openai/openai";

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
        numberOfQuestions: z.number().min(5).max(30),
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
            numberOfQuestions: input.numberOfQuestions,
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
          questions: [],
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
        },
        select: interviewDTO,
      });

      //add questions to interview
      const generatedQuestions = MockInterviewAiService.getQuestionsV2({
        numberOfQuestions: input.numberOfQuestions,
        difficulty: "senior",
        role: input.industry.name,
        topics: input.topics.map((topic) => topic.name),
        questionTypes: ["behavioural", "situational", "technical"],
      }).then(async (res) => {
        console.log({ res }, "hazbula");
        await ctx.prisma.interview.update({
          where: { id: interview.id },
          data: {
            questions: res.questions.map((question) => question.question),
          },
        });
      });

      // create empty interviewResult
      InterviewResultRepository.createInterviewResult({
        interviewId: interview.id,
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

      console.log({ interview });

      // 1.
      // get feedback and next question from openAi
      MockInterviewAiService.getFeedbackForAnswerV2({
        answer: input.answer,
        question: input.question,
      }).then(async (aiResponse) => {
        await ctx.prisma.messageMetadata.create({
          data: {
            question: input.question,
            ...aiResponse,
          },
        });

        console.log({ aiResponse });

        await ctx.prisma.interviewResultUnit.create({
          data: {
            answer: input.answer,
            question: input.question,

            interviewResultId: interview.interviewResultId,
            relevantTopics: {
              connect: [].map(({ id }) => ({ id })),
            },
            ...aiResponse,
          },
        });
      });

      // const matchingTopics = interview.configuration.topics.filter((topic) =>
      //   aiResponse.topics.includes(topic.name)
      // );
      // create interview result unit

      // 2.
      //create message for user and append metadata
      await ctx.prisma.message.create({
        data: {
          content: input.answer,
          sender: "USER",
          interview: { connect: { id: input.id } },
          // metadata: { connect: { id: messageMeta.id } },
        },
        select: messageDTO,
      });

      const { messages } = interview;
      const messagesLength = messages.length + 1;

      const numberOfQuestions = messages.filter(
        (msg) => msg.isQuestion === true
      ).length;

      //3.
      // Get next messages
      const getEndingContent = () => [
        "That was a great interview.",
        "We are finished here!",
      ];
      const isEnd =
        numberOfQuestions >= (interview.questions as string[]).length; //TODO: Replace this with timer
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
        const questions = interview.questions as string[];
        const currQuestionIndex = questions.indexOf(input.question);
        const nextQuestion = questions[currQuestionIndex + 1];
        return ["Thanks for the answer!", nextQuestion || ""];
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
          configuration: {
            include: {
              industry: true,
              topics: true,
            },
          },
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

      const getNextTechnicalQuestion = () => [
        "Thanks for the answer",
        "What is React?",
      ];
      const user = await clerkClient.users.getUser(ctx.currentUserId);

      const getContent = async () => {
        if (messages.length === 0) {
          const res = await MockInterviewAiService.getIntroduction({
            industry: interview.configuration.industry.name,
            personName: user.firstName || user.username || "",
          });
          return [res.introduction, res.introductionQuestion];
        }
        if (lastMessageSentByInterviewer) return [];
        // if (messages.length === 3) {
        //   const res = await MockInterviewAiService.getTechnicalAnnouncement({
        //     industry: interview.configuration.industry.name,
        //     topics: interview.configuration.topics.map((t) => t.name),
        //     yearsOfExperience: interview.configuration.yearsOfExperience,
        //   });
        //   return [res.announcement, res.question];
        // }
        if (messages.length > 3) return getNextTechnicalQuestion();
        return getNextTechnicalQuestion();
      };

      const contents = await getContent();

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
  getInterviewResultsById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const interview = await InterviewRepository.getInterviewOrThrow(ctx, {
        id: input.id,
      });

      const result = interview.messages.map((message) => {
        const { metadata } = message;
        if (metadata) {
          return {
            ...metadata,
            answer: message.content,
          };
        }
      });
      const filtered = result.filter(Boolean);

      return filtered;
    }),
});
