import { TRPCError } from "@trpc/server";
import { messageDTO } from "../DTOs/messageDTO";
import { TRPCContextType } from "../trpc";
import { Interview, Message } from "@prisma/client";
import { interviewDTO } from "../DTOs/interviewDTO";
import { prisma } from "~/server/db";
import { clerkClient } from "@clerk/nextjs";
import { MockInterviewAiService } from "../services/openai/openai";

// export const createMessageForInterview = async (
//   ctx: TRPCContextType,
//   data: Pick<Message, "interviewId" | "content" | "sender" | "isQuestion">
// ) => {
//   const interview = await ctx.prisma.interview.findUnique({
//     where: { id: data.interviewId },
//     include: { messages: true }, // Include the existing messages related to the interview
//   });
//   if (!interview)
//     throw new TRPCError({
//       code: "NOT_FOUND",
//       message: "Interview with that ID hasn't been found",
//     });

//   const newMessage = await ctx.prisma.message.create({
//     data: {
//       content: data.content,
//       sender: data.sender,
//       isQuestion: data.isQuestion,
//       interview: { connect: { id: interview.id } }, // Associate the message with the interview
//     },
//     select: messageDTO,
//   });

//   return newMessage;
// };

export const getInterviewOrThrow = async (
  ctx: TRPCContextType,
  data: { id: string }
) => {
  const interview = await ctx.prisma.interview.findUnique({
    where: { id: data.id },
    select: interviewDTO, // Include the existing messages related to the interview
  });
  if (!interview)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Interview with that ID hasn't been found",
    });

  return interview;
};

export const updateInterviewById = async (
  ctx: TRPCContextType,
  data: Partial<Interview>
) => {
  const interview = await ctx.prisma.interview.findUnique({
    where: { id: data.id },
    include: { messages: true, configuration: true }, // Include the existing messages related to the interview
  });

  if (!interview)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Interview with that ID hasn't been found",
    });

  const newInterview = await ctx.prisma.interview.update({
    where: { id: data.id },
    data: {
      ...data,
      questions: data.questions as string[],
    },
    include: { messages: true, configuration: true },
  });

  return newInterview;
};

const getIntroductionMessages = async (input: {
  interviewId: string;
  userId: string;
}) => {
  const interview = await prisma.interview.findFirst({
    where: {
      id: input.interviewId,
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
  const user = await clerkClient.users.getUser(input.userId);

  const getContent = async () => {
    if (messages.length === 0) {
      const res = await MockInterviewAiService.getIntroduction({
        industry: interview.configuration.industry.name,
        personName: user.firstName || user.username || "",
      });
      void prisma.interview
        .update({
          where: { id: input.interviewId },
          data: {
            title: res.nameOfTheJobPosting,
          },
        })
        .then(() => console.log(res.nameOfTheJobPosting));
      return [res.introduction, res.introductionQuestion];
    }
    if (lastMessageSentByInterviewer) return [];

    if (messages.length > 3) return getNextTechnicalQuestion();
    return getNextTechnicalQuestion();
  };

  const contents = await getContent();

  const newMessages = contents.map((content, i) =>
    prisma.message.create({
      data: {
        content: content,
        sender: "INTERVIEWER",
        isQuestion: i === contents.length - 1,
        interview: { connect: { id: input.interviewId } }, // Associate the message with the interview
      },
      select: messageDTO,
    })
  );
  const interviewerMessages = await prisma.$transaction(newMessages);
  return [...interviewerMessages];
};

export const InterviewRepository = {
  getInterviewOrThrow,
  updateInterviewById,
  getIntroductionMessages,
};
