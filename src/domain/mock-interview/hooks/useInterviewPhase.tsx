import { useMemo } from "react";
import { TInterviewDTO } from "~/pages/mock-interview/[id]";

type TInterviewPhase =
  | "INTRODUCTION"
  | "GREETING"
  | "ASK_FOR_INTRODUCTION"
  | "TECHNICAL_PART_ANNOUNCEMENT"
  | "ASK_FIRST_QUESTION"
  | "TECHNICAL";

export const useInterviewPhase = ({
  interview,
}: {
  interview?: TInterviewDTO;
}) => {
  const interviewPhase: TInterviewPhase = useMemo(() => {
    const interviewMessages = interview?.messages;
    if (!interviewMessages) return "INTRODUCTION";
    if (interviewMessages.length === 0) return "GREETING";
    if (interviewMessages.length === 1) return "ASK_FOR_INTRODUCTION";
    if (interviewMessages.length === 3) return "TECHNICAL_PART_ANNOUNCEMENT";
    if (interviewMessages.length === 4) return "ASK_FIRST_QUESTION";
    if (interviewMessages.length > 4) return "TECHNICAL";
    return "TECHNICAL";
  }, [interview?.messages.length]);

  const lastMessageSentByUser = interview?.messages.at(-1)?.sender === "USER";

  return { interviewPhase, lastMessageSentByUser };
};
