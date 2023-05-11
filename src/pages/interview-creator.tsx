import type { NextPage } from "next";
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
const CircleDigit = ({
  number,
  onClick,
  variant = "default",
}: {
  number: number;
  onClick?: () => void;
  variant?: "default" | "disabled";
}) => {
  const classNames = `flex h-16 w-16 items-center justify-center  rounded-full border-2  ${CIRCLE_VARIANTS[variant]}`;
  if (onClick) {
    return (
      <button className={classNames} onClick={onClick}>
        <p className="text-2xl">{number}</p>
      </button>
    );
  }
  return (
    <div className={classNames}>
      <p className="text-2xl">{number}</p>
    </div>
  );
};

const MockInterviewBuilder: NextPage = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const { step } = interviewCreatorState;

  const setStep = (newStep: number) =>
    dispatchInterviewCreatorUpdate({ type: "SET_STEP", payload: newStep });

  return (
    <main className="pt-20">
      <>
        <Container className="flex gap-8">
          {STEPS.map((_, i) => (
            <CircleDigit
              key={i}
              onClick={() => setStep(i)}
              number={i + 1}
              variant={i === step ? "default" : "disabled"}
            />
          ))}
        </Container>
        {STEPS[step]}
      </>
    </main>
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
