import { useState, useRef, useEffect } from "react";
import { type RouterOutputs, api } from "~/utils/api";
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
  api.interview.getMessages.useQuery(
    { id },
    {
      onSuccess: (res) => {
        res.map(addMessageToState);
      },
    }
  );

  const { mutate: answerQuestion, isLoading } =
    api.interview.answerQuestion.useMutation({
      onSuccess: (res) => {
        res.map(addMessageToState);
      },
    });
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

  const lastMessageByInterviewer = messages
    ?.slice()
    .reverse()
    .find((message) => message.sender === "INTERVIEWER" && message.isQuestion);

  const generateDummyUserMessage = () => {
    const dummyMessage: TMessageDTO = {
      id: `${Math.random() * 1000}`,
      content: messageText,
      sender: "USER",
      interviewId: id,
      isQuestion: false,
      messageMetadataId: null,
      metadata: null,
    };
    addMessageToState(dummyMessage);
  };
  const handleSubmit = () => {
    generateDummyUserMessage();
    if (!interview) return;
    answerQuestion({
      answer: messageText,
      question: lastMessageByInterviewer?.content || "",
      id,
    });
    setMessageText("");
  };

  useEffect(() => {
    scrollToBottomOfMessages();
  }, [interview?.messages.length]);

  return {
    interview,
    messagesContainerRef,
    messages,
    isLoading,
    handleSubmit,
    messageText,
    setMessageText,
  };
};
