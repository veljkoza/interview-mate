import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { Container } from "~/components/containers";
import { Message } from "~/domain/mock-interview/components/chat";
import type { Message as MessageType, SENDER } from "@prisma/client";
import { useClerk } from "@clerk/nextjs";
import { SatisfactionPercentage } from "../my-interviews";
import { BsLightbulb } from "react-icons/bs";
import { RiLightbulbFlashLine } from "react-icons/ri";
import { Heading } from "~/components/typography";
import { Circle } from "../interview-creator";
import { RouterOutputs, api } from "~/utils/api";
import { useEffect, useState } from "react";

const DUMMY_MESSAGE = `"Controlled components in React are form elements whose value and state are controlled by React itself. The value is stored in the component's state, and any changes are managed through event handlers like onChange. React updates the component's value and triggers re-rendering.

Uncontrolled components, on the other hand, have their value managed by the browser rather than React. The value is accessed using a ref and changes are handled through standard DOM events like onBlur or onChange. React doesn't have direct control over the component's state.

Controlled components offer more control and flexibility, making it easier to implement features like validation and conditional rendering. Uncontrolled components are simpler and useful in cases where you don't need extensive state management or when working with third-party libraries or legacy code."`;

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
type InterviewResultDTO =
  RouterOutputs["interview"]["getInterviewResultsById"]["0"];
const InterviewResults: NextPage<PageProps> = ({ id }) => {
  const { user } = useClerk();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const goToNextQuestion = () => {
    setSelectedQuestionIndex((prev) => {
      if (interviewResult?.[prev + 1]) {
        return prev + 1;
      }
      return prev;
    });
  };
  const goToPrevQuestion = () => {
    setSelectedQuestionIndex((prev) => {
      if (interviewResult?.[prev - 1]) {
        return prev - 1;
      }
      return prev;
    });
  };
  const { data: interviewResult } =
    api.interview.getInterviewResultsById.useQuery({
      id,
    });

  const selectedQuestion = interviewResult?.[selectedQuestionIndex];

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
