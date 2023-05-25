import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { Container } from "~/components/containers";
import { Message } from "~/domain/mock-interview/components/chat";
import type { Message as MessageType, SENDER } from "@prisma/client";
import { useClerk } from "@clerk/nextjs";
import { SatisfactionPercentage } from "../my-interviews";
import { Heading } from "~/components/typography";
import { Circle } from "../interview-creator";
import { RouterOutputs, api } from "~/utils/api";
import { useEffect, useState } from "react";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
type InterviewResultDTO =
  RouterOutputs["interview"]["getInterviewResultsById"]["0"];
const InterviewResults: NextPage<PageProps> = ({ id }) => {
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
  const { data: interviewResult } = api.interviewResult.getById.useQuery({
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

  if (!interviewResult) return <Heading size={1}>404</Heading>;
  return (
    <main className="relative">
      <section className="py-10">
        <Container>
          <div>
            <Heading size={3} variant="primary">
              {selectedQuestionIndex + 1}. {selectedQuestion?.question}
            </Heading>
            <div className="mt-10">
              <Message
                sender="USER"
                message={selectedQuestion?.answer}
                avatar={getAvatar("USER")}
              />
            </div>
          </div>
          <div className="mt-20 ">
            <div className="flex items-center justify-between">
              <h1 className=" text-2xl text-accent-secondary">
                Feedback from interview mate:
              </h1>
              <SatisfactionPercentage
                percentage={+`${selectedQuestion?.satisfaction || ""}`}
              />
            </div>
            <div className="mt-10">
              <Message
                sender="INTERVIEWER"
                message={selectedQuestion?.feedback}
              />
            </div>
          </div>
          <div className="mt-10 flex items-center justify-end gap-4">
            <Circle value="<" onClick={() => goToPrevQuestion()} />
            <Circle value=">" onClick={() => goToNextQuestion()} />
          </div>
        </Container>
      </section>
    </main>
  );
};

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
