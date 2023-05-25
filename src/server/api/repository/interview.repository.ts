import { TRPCError } from "@trpc/server";
import { messageDTO } from "../DTOs/messageDTO";
import { TRPCContextType } from "../trpc";
import { Interview, Message } from "@prisma/client";
import { interviewDTO } from "../DTOs/interviewDTO";

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
    data,
    include: { messages: true, configuration: true },
  });

  return newInterview;
};
