import { Container } from "~/components/containers";

import { type FC } from "react";
import { Panel } from "~/components/panel";
import { RiMenu4Fill } from "react-icons/ri";
import { BsSend } from "react-icons/bs";
import { api } from "~/utils/api";
import type { SENDER } from "@prisma/client";
import { useInterview } from "~/domain/mock-interview/hooks/useInterview";
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ROUTES } from "~/consts/navigation";
import { ChatDictaphone } from "~/domain/mock-interview/components/chat-dictaphone";
import { useDictaphone } from "~/components/dictaphone";

export const MockInterviewChat: FC<{ id: string }> = ({ id }) => {
  const {
    isEnd,
    interview,
    handleSubmit,
    messageText,
    isGettingMessages,
    isSendingMessage,
    setMessageText,
    messagesContainerRef,
  } = useInterview({ id });
  const router = useRouter();
  const { data: azureData } = api.azure.getToken.useQuery();

  const {
    isMicrophoneAvailable,
    start,
    stop,
    listening,
    resetTranscript,
    transcript,
    browserSupportsSpeechRecognition,
  } = useDictaphone({
    authorizationToken: azureData?.token,
    region: azureData?.region,
  });

  const isInterviewOver = isEnd || interview?.status === "COMPLETED";
  const { user } = useClerk();
  const getAvatar = (sender: SENDER) => {
    if (sender === "INTERVIEWER") return "";
    return user?.profileImageUrl;
  };

  const shouldDisableForm = isSendingMessage || isGettingMessages || listening;
  const shouldShowInterviewerGhost = isGettingMessages;
  if (!interview) return <div>404</div>;

  const getForm = () => {
    if (isInterviewOver) {
      return (
        <Button
          onClick={() =>
            router.replace(
              `${ROUTES["interview-results"]}/${
                interview.interviewResultId || ""
              }`
            )
          }
        >
          See your results
        </Button>
      );
    }
    return (
      <form
        onSubmit={(e) => {
          if (shouldDisableForm) return;
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-auto flex w-full"
      >
        <Panel className="h-16 w-full p-0">
          <input
            onChange={(e) => setMessageText(e.target.value)}
            value={`${messageText} ${transcript}`}
            className="h-full w-full bg-canvas-subtle px-5 py-2 text-muted-fg outline-none"
            placeholder="Type your message..."
          />
        </Panel>
        <ChatDictaphone
          disabled={!isMicrophoneAvailable || !browserSupportsSpeechRecognition}
          isRecording={listening}
          onClick={() => {
            if (listening) {
              setMessageText((prev) => `${prev} ${transcript}`);
              void stop();
              resetTranscript();
            } else {
              start({ continuous: true, language: "en-US" });
            }
          }}
        />

        <button
          className="flex h-16 w-16 items-center justify-center rounded-br-md rounded-tr-md border-2   border-accent-secondary text-accent-secondary"
          disabled={shouldDisableForm}
        >
          <BsSend className="text-xl" />
        </button>
      </form>
    );
  };

  return (
    <div className="relative flex h-screen flex-col pt-24">
      <Container className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between py-8">
        <button className="ml-auto">
          <RiMenu4Fill className="ml-auto text-4xl text-accent-secondary " />
        </button>
      </Container>
      <Container className="relative mx-auto flex  h-full flex-1 flex-col py-5">
        <div
          className="flex flex-1 flex-col gap-5 overflow-y-scroll p-5"
          ref={messagesContainerRef}
        >
          {interview.messages.map((message) => (
            <Message
              key={message.id}
              sender={message.sender}
              message={message.content}
              avatar={getAvatar(message.sender)}
            />
          ))}
          {shouldShowInterviewerGhost && (
            <Message isGhost sender="INTERVIEWER" />
          )}
        </div>
        {getForm()}
      </Container>
    </div>
  );
};
