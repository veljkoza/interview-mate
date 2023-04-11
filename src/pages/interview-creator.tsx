/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container } from "~/components/containers";
import { ROUTES } from "~/consts/navigation";
import {
  IndustrySelectStep,
  TopicSelectStep,
  YearsOfExperienceSelectStep,
  InterviewDurationSelectStep,
} from "~/domain/interview-creator";
import { STEPS_LENGTH } from "~/domain/interview-creator/consts/consts";
import { STEPS } from "~/domain/interview-creator/consts/steps";
import {
  TInterviewConfig,
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

// const getUrlParams = (interviewConfig: TInterviewConfig) => {
//   const params = new URLSearchParams();
//   for (const key in interviewConfig) {
//     const param = interviewConfig[key];
//     if (param !== undefined) {
//       params.append(key, interviewConfig[key] as string);
//     }
//   }

//   const urlParams = new URLSearchParams(params.toString());

//   const test: { [k: string]: any } = {
//     selectedIndustry: "",
//     selectedTopics: [] as string[],
//     yearsOfExperience: 0,
//     durationInMinutes: 0,
//   };
//   params.forEach((value, key) => {
//     if (key.includes(".")) {
//       const [parentKey, childKey] = key.split(".");
//       test[parentKey][childKey] = value;
//     } else {
//       test[key] = value;
//     }
//   });
// };

const MockInterviewBuilder: NextPage = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const { step } = interviewCreatorState;

  const setStep = (newStep: number) =>
    dispatchInterviewCreatorUpdate({ type: "SET_STEP", payload: newStep });
  const router = useRouter();
  useEffect(() => {
    if (step === STEPS_LENGTH) {
      const params = new URLSearchParams(
        interviewCreatorState.interviewConfig as unknown as string
      );

      router.replace(`${ROUTES["mock-interview"]}?${params.toString()}`);
    }
  }, [step, interviewCreatorState.interviewConfig]);
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
