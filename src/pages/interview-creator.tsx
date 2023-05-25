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
export const Circle = ({
  value,
  onClick,
  variant = "default",
}: {
  value: string;
  onClick?: () => void;
  variant?: "default" | "disabled";
}) => {
  const classNames = `flex h-16 w-16 items-center justify-center  rounded-full border-2  ${CIRCLE_VARIANTS[variant]}`;
  if (onClick) {
    return (
      <button className={classNames} onClick={onClick}>
        <p className="text-2xl">{value}</p>
      </button>
    );
  }
  return (
    <div className={classNames}>
      <p className="text-2xl">{value}</p>
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
            <Circle
              key={i}
              onClick={() => setStep(i)}
              value={`${i + 1}`}
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
