import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { Container } from "~/components/containers";

import { useState, type PropsWithChildren } from "react";
import { Panel } from "~/components/panel";
import { RiMenu4Fill } from "react-icons/ri";
import { BsSend } from "react-icons/bs";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { type RouterOutputs, api } from "~/utils/api";
import type { SENDER } from "@prisma/client";
import { useInterview } from "~/domain/mock-interview/hooks/useInterview";
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ROUTES } from "~/consts/navigation";
import { ChatDictaphone } from "~/domain/mock-interview/components/chat-dictaphone";
import { FaSpinner } from "react-icons/fa";
import { useDictaphone } from "~/components/dictaphone";
import dynamic from "next/dynamic";

const MockInterviewChat = dynamic(
  () =>
    import("../../domain/mock-interview/components/mock-interview-chat").then(
      (mod) => mod.MockInterviewChat
    ),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export type TInterviewDTO = RouterOutputs["interview"]["create"];
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const MockInterviewPage: NextPage<PageProps> = ({ id }) => {
  return <MockInterviewChat id={id} />;
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
