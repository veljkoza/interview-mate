import { useState, useRef } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { useInterviewPhase } from "./useInterviewPhase";
type TMessageDTO = RouterOutputs["interview"]["sendMessage"];
const scrollToBottom = <T extends HTMLDivElement>(el: T) => {
  el.scrollTop = el.scrollHeight;
};

export const useInterview = ({ id }: { id: string }) => {
  const [messageText, setMessageText] = useState("");
  const { interview: interviewTrpc } = api.useContext();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainer = messagesContainerRef.current;

  const { data: interview } = api.interview.getById.useQuery(
    { id },
    { onSuccess: () => setTimeout(() => scrollToBottomOfMessages(), 150) }
  );

  const { interviewPhase } = useInterviewPhase({ interview });
  const { mutate: askCandidateToIntroduceHimself } =
    api.interview.askCandidateToIntroduceHimself.useMutation();
  const { mutate: announceTechnicalPart } =
    api.interview.announceTechnicalPart.useMutation();
  const { mutate: askTechnicalQuestion } =
    api.interview.askTechnicalQuestion.useMutation();
  const { mutate: answerQuestion } = api.interview.answerQuestion.useMutation();
  const { messages } = interview || {};

  const addMessageToState = (message: TMessageDTO) => {
    if (!interview?.id) return;
    interviewTrpc.getById.setData({ id: interview.id }, (prev) => {
      if (prev) {
        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      }
      return undefined;
    });
  };

  const scrollToBottomOfMessages = () => {
    if (messagesContainer) {
      scrollToBottom(messagesContainer);
    }
  };

  // Gets introduction message and adds it to the cached interview data
  api.interview.getIntroductionMessage.useQuery(
    { id },
    {
      onSuccess: (res) => {
        addMessageToState(res);
        askCandidateToIntroduceHimself(
          { id },
          { onSuccess: addMessageToState }
        );
      },
      enabled: interview?.messages.length === 0,
    }
  );

  const { mutate: sendMessage, isLoading: isSendingMessageLoading } =
    api.interview.sendMessage.useMutation({
      onSuccess: (res) => {
        addMessageToState(res);
        if (messages?.length === 2) {
          announceTechnicalPart(
            { id },
            {
              onSuccess: (res) => {
                askTechnicalQuestion({ id }, { onSuccess: addMessageToState });
                addMessageToState(res);
              },
            }
          );
        }
        scrollToBottomOfMessages();
      },
    });

  const lastMessage = messages?.at(-1);
  const handleSubmit = () => {
    if (!interview) return;
    if (interviewPhase === "TECHNICAL" && lastMessage?.isQuestion) {
      answerQuestion(
        {
          question: lastMessage.content,
          answer: messageText,
          id,
        },
        {
          onSuccess: (res) => {
            res.map(addMessageToState);
            setTimeout(() => scrollToBottomOfMessages(), 100);
          },
        }
      );
      setMessageText("");
      return;
    }
    sendMessage(
      { id: interview.id, content: messageText, sender: "USER" },
      {
        onSuccess: () => {
          setTimeout(() => scrollToBottomOfMessages(), 100);
        },
      }
    );
    setTimeout(() => scrollToBottomOfMessages(), 100);
    setMessageText("");
  };

  return {
    interview,
    messagesContainerRef,
    messages,
    isSendingMessageLoading,
    handleSubmit,
    messageText,
    setMessageText,
  };
};
