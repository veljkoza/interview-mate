import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { Container } from "~/components/containers";

import { type PropsWithChildren } from "react";
import { Panel } from "~/components/panel";
import { RiMenu4Fill } from "react-icons/ri";
import { BsSend } from "react-icons/bs";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { RouterOutputs, api } from "~/utils/api";
import type { SENDER } from "@prisma/client";
import { useInterview } from "~/domain/mock-interview/hooks/useInterview";
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ROUTES } from "~/consts/navigation";

export type TInterviewDTO = RouterOutputs["interview"]["create"];
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const MockInterviewPage: NextPage<PageProps> = ({ id }) => {
  const {
    isEnd,
    interview,
    isLoading,
    handleSubmit,
    messageText,
    setMessageText,
    messagesContainerRef,
  } = useInterview({ id });
  const router = useRouter();

  const isInterviewOver = isEnd || interview?.status === "COMPLETED";
  const { user } = useClerk();
  const getAvatar = (sender: SENDER) => {
    if (sender === "INTERVIEWER") return "";
    return user?.profileImageUrl;
  };
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
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-auto flex w-full"
      >
        <Panel className="h-16 w-full p-0">
          <input
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
            className="h-full w-full bg-canvas-subtle px-5 py-2 text-muted-fg outline-none"
            placeholder="Type your message..."
          />
        </Panel>
        <button className="flex h-16 w-16 items-center justify-center rounded-br-md rounded-tr-md border-2   border-accent-secondary text-accent-secondary">
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
          {isLoading && <Message isGhost sender="INTERVIEWER" />}
        </div>
        {getForm()}
      </Container>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ id: string }> = async (
  context
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, currentUserId: null },
    transformer: SuperJSON,
  });

  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id");
  await ssg.interview.getById.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default MockInterviewPage;
