import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { type RouterOutputs } from "~/utils/api";
import dynamic from "next/dynamic";
import { BouncyLoader } from "~/components";
import Head from "next/head";

const MockInterviewChat = dynamic(
  () =>
    import("../../domain/mock-interview/components/mock-interview-chat").then(
      (mod) => mod.MockInterviewChat
    ),
  {
    ssr: false,
    loading: () => <BouncyLoader />,
  }
);

export type TInterviewDTO = RouterOutputs["interview"]["create"];
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const MockInterviewPage: NextPage<PageProps> = ({ id }) => {
  return (
    <>
      <Head>
        <title>Mock Interview | Interview Mate</title>
      </Head>
      <MockInterviewChat id={id} />
    </>
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
