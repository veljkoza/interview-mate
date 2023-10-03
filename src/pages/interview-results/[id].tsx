import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { Container } from "~/components/containers";
import { Message } from "~/domain/mock-interview/components/chat";
import type { Message as MessageType, SENDER } from "@prisma/client";
import { useClerk } from "@clerk/nextjs";
import { SatisfactionPercentage } from "../my-interviews";
import { Heading } from "~/components/typography";
import { Circle } from "../interview-creator";
import { RouterOutputs, api } from "~/utils/api";
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { Panel } from "~/components/panel";
import { Logo } from "~/components/logo";
import Link from "next/link";
import { AppHeader } from "~/components/app-header";
import Head from "next/head";
import { ROUTES } from "~/consts/navigation";
import {
  FaArrowAltCircleLeft,
  FaArrowCircleLeft,
  FaBackward,
} from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { TWithClassName } from "~/types/withClassName";
import { BouncyLoader, MyModal } from "~/components";
import { useToggler } from "~/hooks";
import { toast } from "react-toastify";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
type InterviewResultDTO =
  RouterOutputs["interview"]["getInterviewResultsById"]["0"];
const InterviewResults: NextPage<PageProps> = ({ id }) => {
  const {
    isOpen: isRewardModalOpen,
    open: openRewardModal,
    close: closeRewardModal,
  } = useToggler(false);

  const { mutate: getAwardForFirstCompletedInterview } =
    api.user.getAwardForFirstCompletedInterview.useMutation({
      onSuccess: () => {
        toast.success(
          "You have successfuly claimed 20 new interview questions!"
        );
      },
      onError: () =>
        toast.error(
          "Something went wrong while claiming questions. Contact support."
        ),
    });

  const handleModalClose = () => {
    closeRewardModal();
    getAwardForFirstCompletedInterview();
  };
  
  api.user.getCurrentUser.useQuery(undefined, {
    onSuccess: (res) => {
      if (!res.firstInterviewCompletedAwardClaimed) {
        openRewardModal();
      }
    },
  });

  const { user } = useClerk();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const goToNextQuestion = () => {
    setSelectedQuestionIndex((prev) => {
      if (interviewResult?.units[prev + 1]) {
        return prev + 1;
      }
      return prev;
    });
  };
  const goToPrevQuestion = () => {
    setSelectedQuestionIndex((prev) => {
      if (interviewResult?.units[prev - 1]) {
        return prev - 1;
      }
      return prev;
    });
  };
  const { data: interviewResult, isLoading } =
    api.interviewResult.getById.useQuery({
      id,
    });

  const selectedQuestion = interviewResult?.units[selectedQuestionIndex];

  const getAvatar = (sender: SENDER) => {
    if (sender === "INTERVIEWER") return "";
    return user?.profileImageUrl;
  };

  useEffect(() => {
    const leftEvt = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevQuestion();
      }
    };
    const rightEvt = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextQuestion();
      }
    };
    window.addEventListener("keydown", leftEvt);
    window.addEventListener("keydown", rightEvt);

    return () => {
      window.removeEventListener("keydown", leftEvt);
      window.removeEventListener("keydown", rightEvt);
    };
  }, []);

  if (isLoading) return <BouncyLoader className="h-screen" />;

  const getBody = () => {
    if (!interviewResult || !interviewResult.units.length)
      return (
        <div className="flex h-screen flex-col items-center justify-center">
          <BouncyLoader className="h-auto" />
          <Heading size={4} className="mt-10 text-center">
            We are still calculating feedback.
            <br />
            Keep refreshing the page.
          </Heading>
        </div>
      );

    return (
      <section className="py-10 ">
        <MyModal
          isOpen={isRewardModalOpen}
          onClose={() => handleModalClose()}
        />
        <Container>
          <GoToHomeLink className="mb-5 lg:mb-10" />
          <div className="mb-10 flex flex-wrap gap-6">
            {interviewResult.units.map((unit, i) => (
              <Circle
                key={i}
                value={(i + 1).toString()}
                onClick={() => setSelectedQuestionIndex(i)}
              />
            ))}
          </div>
          <div>
            <Heading size={3} variant="primary">
              {selectedQuestionIndex + 1}. {selectedQuestion?.question}
            </Heading>
            <div className="mt-20">
              <Message
                sender="USER"
                message={selectedQuestion?.answer}
                avatar={getAvatar("USER")}
              />
            </div>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FeedbackUnit
              title={
                <FeedbackUnit.Title>
                  Understanding of concept:
                </FeedbackUnit.Title>
              }
              body={
                <FeedbackUnit.Paragraph>
                  {selectedQuestion?.understandingOfConcept}
                </FeedbackUnit.Paragraph>
              }
            />
            <FeedbackUnit
              title={
                <FeedbackUnit.Title>Technical accuracy:</FeedbackUnit.Title>
              }
              body={
                <FeedbackUnit.Paragraph>
                  {selectedQuestion?.technicalAccuracy}
                </FeedbackUnit.Paragraph>
              }
            />
            <FeedbackUnit
              title={
                <FeedbackUnit.Title>Real world example:</FeedbackUnit.Title>
              }
              body={
                <FeedbackUnit.Paragraph>
                  {selectedQuestion?.realWorldExample}
                </FeedbackUnit.Paragraph>
              }
            />
            <FeedbackUnit
              title={
                <FeedbackUnit.Title>
                  Explanation and communication:
                </FeedbackUnit.Title>
              }
              body={
                <FeedbackUnit.Paragraph>
                  {selectedQuestion?.explanationAndCommunication}
                </FeedbackUnit.Paragraph>
              }
            />
            {/* <FeedbackUnit
        title={<FeedbackUnit.Title>Soft skills:</FeedbackUnit.Title>}
        body={
          <FeedbackUnit.Paragraph>
            {selectedQuestion?.softSkills}
          </FeedbackUnit.Paragraph>
        }
      /> */}
            {/* <FeedbackUnit
        title={<FeedbackUnit.Title>Suggestions:</FeedbackUnit.Title>}
        body={
          <FeedbackUnit.Paragraph>
            {selectedQuestion?.suggestionsForImprovement?.toString()}
          </FeedbackUnit.Paragraph>
        }
      /> */}
          </div>
          <div className="mt-20">
            <div className="mb-10 flex items-center gap-6">
              <Logo />
              <Heading size={4}>Things you can do to improve answer:</Heading>
            </div>
            <div className=" grid grid-cols-1 gap-8 lg:grid-cols-2">
              {(selectedQuestion?.suggestionsForImprovement as string[])?.map(
                (suggestion) => (
                  <Panel key={suggestion} className="p-5">
                    <p className="text-lg text-accent-secondary">
                      {suggestion}
                    </p>
                  </Panel>
                )
              )}
            </div>
          </div>
          <div className="mt-20">
            <div className="mb-10 flex items-center gap-6">
              <Logo />
              <Heading size={4}>
                Keep learning with these{" "}
                <span className="text-accent-secondary">Google</span> search
                queries:
              </Heading>
            </div>
            <div className="flex flex-col gap-8">
              {(
                selectedQuestion?.furtherLearningRecommendations as string[]
              ).map((recommendation) => (
                <div key={recommendation}>
                  <Link
                    target="_blank"
                    href={`https://www.google.com/search?q=${recommendation.replace(
                      " ",
                      "+"
                    )}`}
                    className="border-b border-b-transparent text-lg text-accent-secondary hover:border-b-accent-secondary"
                  >
                    {recommendation}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between ">
            <GoToHomeLink />
            <div className="flex items-center justify-end gap-4">
              <Circle value="<" onClick={() => goToPrevQuestion()} />
              <Circle value=">" onClick={() => goToNextQuestion()} />
            </div>
          </div>
        </Container>
      </section>
    );
  };

  return (
    <>
      <Head>
        <title>Result | Interview Mate</title>
      </Head>
      <main className="relative">{getBody()}</main>
    </>
  );
};

const GoToHomeLink = ({ className = "" }: TWithClassName) => (
  <Link
    href={ROUTES["home"]}
    className={`flex items-center gap-2 text-accent-secondary  ${className}`}
  >
    <BiArrowBack /> Go to home
  </Link>
);

const FeedbackUnit = ({
  title,
  body,
}: {
  title: ReactNode;
  body: ReactNode;
}) => (
  <Panel className="p-5">
    <div className="flex items-center justify-between">
      {title}
      {/* <SatisfactionPercentage
  percentage={+`${selectedQuestion?.satisfaction || ""}`}
/> */}
    </div>
    <div className="mt-5">{body}</div>
  </Panel>
);

const FeedbackUnitTitle = ({ children }: PropsWithChildren) => (
  <Heading variant="secondary" size={4}>
    {children}
  </Heading>
);
const FeedbackUnitParagraph = ({ children }: PropsWithChildren) => (
  <p className="font-light text-muted-fg lg:text-lg">{children}</p>
);

FeedbackUnit.Title = FeedbackUnitTitle;
FeedbackUnit.Paragraph = FeedbackUnitParagraph;

export const getStaticProps: GetStaticProps<{ id: string }> = (context) => {
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id");
  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default InterviewResults;
