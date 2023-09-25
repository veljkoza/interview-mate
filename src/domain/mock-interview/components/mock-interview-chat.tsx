import { Container } from "~/components/containers";

import { useEffect, type FC } from "react";
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
import TextareaAutosize from "react-textarea-autosize";
import { BackButton, Heading } from "~/components";

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

  useEffect(() => {
    resetTranscript();
    setMessageText("");
  }, []);

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
        className="mt-auto flex w-full items-end gap-4 pt-2"
      >
        <Panel className="min-h-16 w-full p-0 py-0">
          <TextareaAutosize
            maxRows={5}
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText + transcript}
            className="h-full w-full bg-canvas-subtle py-3 text-muted-fg outline-none"
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
          className="relative flex min-h-[50px] min-w-[50px] items-center justify-center rounded-full bg-accent-secondary"
          disabled={shouldDisableForm}
        >
          <BsSend className="text-xl" />
        </button>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col pt-11 md:pt-24">
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-canvas-subtle">
        <Container className="flex items-center gap-4  py-3">
          {/* <button className="ml-auto">
          <RiMenu4Fill className="ml-auto text-4xl text-accent-secondary " />
        </button> */}
          <BackButton />{" "}
          <Heading variant="secondary" size={4}>
            {interview.title}
          </Heading>
        </Container>
      </div>
      <Container className="relative mx-auto flex  h-full flex-1 flex-col  py-5">
        <div
          className="flex flex-1 flex-col gap-5 overflow-y-scroll px-2 py-5"
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
