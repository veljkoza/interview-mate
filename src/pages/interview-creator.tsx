import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { IoMdClose } from "react-icons/io";
import { Container } from "~/components/containers";

import { STEPS } from "~/domain/interview-creator/consts/steps";
import {
  useInterviewCreator,
  InterviewCreatorProvider,
} from "~/domain/interview-creator/context/interview-creator.context";

const CIRCLE_VARIANTS = {
  default: "border-accent-secondary text-accent-secondary",
  disabled: "border-muted-default text-muted-default",
};
export const Circle = ({
  value,
  onClick,
  variant = "default",
}: {
  value: string;
  onClick?: () => void;
  variant?: "default" | "disabled";
  className?: string;
}) => {
  const classNames = `flex h-12 w-12 md:h-16 md:w-16 items-center justify-center  rounded-full border-2  ${CIRCLE_VARIANTS[variant]}`;
  if (onClick) {
    return (
      <button className={classNames} onClick={onClick}>
        <p className="text-xl md:text-2xl">{value}</p>
      </button>
    );
  }
  return (
    <div className={classNames}>
      <p className="text-xl md:text-2xl">{value}</p>
    </div>
  );
};

const MockInterviewBuilder: NextPage = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const { step, stepsArray } = interviewCreatorState;

  const setStep = (newStep: number) =>
    dispatchInterviewCreatorUpdate({ type: "SET_STEP", payload: newStep });
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Interview Creator | Interview Mate</title>
      </Head>
      <main className="fixed inset-0 flex  w-full flex-col overflow-y-auto pt-6 lg:pt-20">
        <>
          <Container className="flex gap-4 md:gap-8">
            {STEPS.map((_, i) => (
              <Circle
                key={i}
                onClick={() => {
                  if (i < stepsArray.length) {
                    setStep(i);
                  }
                }}
                value={`${i + 1}`}
                variant={
                  i === step || i < stepsArray.length ? "default" : "disabled"
                }
              />
            ))}
            <button
              className="ml-auto text-4xl text-muted-default"
              onClick={() => {
                void router.replace(`/`);
              }}
            >
              <IoMdClose />
            </button>
          </Container>
          {STEPS[step]}
        </>
      </main>
    </>
  );
};

const InterviewCreatorPage: NextPage = () => {
  return (
    <InterviewCreatorProvider>
      <MockInterviewBuilder />
    </InterviewCreatorProvider>
  );
};

export default InterviewCreatorPage;
