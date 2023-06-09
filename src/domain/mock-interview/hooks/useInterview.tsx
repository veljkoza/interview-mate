import { useState, useRef, useEffect, useMemo } from "react";
import { type RouterOutputs, api } from "~/utils/api";
type TMessageDTO = RouterOutputs["interview"]["getMessages"][0];
const scrollToBottom = <T extends HTMLDivElement>(el: T) => {
  el.scrollTop = el.scrollHeight;
};

export const useInterview = ({ id }: { id: string }) => {
  const [messageText, setMessageText] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const { interview: interviewTrpc } = api.useContext();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainer = messagesContainerRef.current;

  const { data: interview } = api.interview.getById.useQuery(
    { id },
    { onSuccess: () => setTimeout(() => scrollToBottomOfMessages(), 150) }
  );
  const { isLoading: isGettingMessages } = api.interview.getMessages.useQuery(
    {
      id,
    },
    {
      onSuccess: (res) => res.map(addMessageToState),
    }
  );

  const { mutate: answerQuestion, isLoading: isSendingMessage } =
    api.interview.answerQuestion.useMutation({
      onSuccess: (res) => {
        res.messages.map(addMessageToState);
        setIsEnd(res.isEnd);
      },
    });

  const status = useMemo(() => {
    if (isGettingMessages) return "GETTING_MESSAGES";
    if (isSendingMessage) return "SENDING_MESSAGE";
    return "LOADING";
  }, [isSendingMessage, isGettingMessages]);
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
    isEnd,
    interview,
    messagesContainerRef,
    messages,
    status,
    handleSubmit,
    messageText,
    setMessageText,
    isSendingMessage,
    isGettingMessages,
  };
};
