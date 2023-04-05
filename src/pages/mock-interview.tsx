import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { Heading } from "~/components/typography";

import { INDUSTRIES } from "~/consts/industries";
import { TOPICS } from "~/consts/topics";
import {
  InterviewCreatorProvider,
  useInterviewCreator,
} from "~/domain/interview/interview-creator/interview-creator.context";

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

const VARIANTS = {
  active: "border-accent-secondary bg-accent-secondary text-black",
  default: "border-white text-white",
  inactive: "border-muted-fg text-muted-fg",
};

const SelectOption = (props: {
  variant: "active" | "default" | "inactive";
  text: string;
  onClick: () => void;
  className?: string;
}) => {
  const { onClick, text, variant, className = "" } = props;
  return (
    <button
      onClick={() => onClick()}
      className={`border  px-10 py-5   hover:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {text}
    </button>
  );
};

const IndustryOption = ({
  industry,
  activeIndustry,
  onClick,
}: {
  industry: string;
  activeIndustry: string;
  onClick: (industry: string) => void;
}) => {
  const isActive = activeIndustry === industry;
  const getVariant = () => {
    if (!activeIndustry) return "default";
    if (activeIndustry === industry) return "active";
    return "inactive";
  };
  return (
    <SelectOption
      onClick={() => onClick(industry)}
      text={industry}
      variant={getVariant()}
    />
  );
};

const IndustrySelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const [activeIndustry, setActiveIndustry] = useState(
    interviewCreatorState.interviewConfig.selectedIndustry
  );
  const goToNextStep = () =>
    dispatchInterviewCreatorUpdate({
      type: "GO_TO_NEXT_STEP",
    });

  useEffect(() => {
    return () =>
      dispatchInterviewCreatorUpdate({
        type: "SET_INDUSTRY",
        payload: activeIndustry,
      });
  }, [activeIndustry]);

  return (
    <Container>
      <Heading className="mt-10">Select your field of work.</Heading>

      <Panel className="mt-14 flex h-[450px] flex-wrap gap-4 overflow-y-scroll">
        {INDUSTRIES.map((industry) => (
          <IndustryOption
            activeIndustry={activeIndustry}
            onClick={(industry) => setActiveIndustry(industry)}
            industry={industry}
            key={industry}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
        <Heading size={3} variant="secondary">
          {activeIndustry}
        </Heading>
        <Button onClick={() => goToNextStep()}>Next</Button>
      </div>
    </Container>
  );
};

const TopicSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const [selectedTopics, setSelectedTopics] = useState(
    interviewCreatorState.interviewConfig.selectedTopics
  );
  const handleTopicClick = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      const index = selectedTopics.indexOf(topic);
      const temp = [...selectedTopics];
      temp.splice(index, 1);
      setSelectedTopics(temp);
      return;
    }
    setSelectedTopics((prev) => [...prev, topic]);
  };

  const getOptionVariant = (topic: string) => {
    if (selectedTopics.includes(topic)) return "active";
    return "default";
  };

  useEffect(() => {
    return () =>
      dispatchInterviewCreatorUpdate({
        type: "SET_TOPICS",
        payload: selectedTopics,
      });
  }, [selectedTopics]);
  return (
    <Container>
      <Heading className="mt-10">Select relevant topics.</Heading>

      <Panel className="mt-14 flex h-[450px] flex-wrap gap-4 overflow-y-scroll">
        {TOPICS.map((topic) => (
          <SelectOption
            key={topic}
            onClick={() => handleTopicClick(topic)}
            text={topic}
            variant={getOptionVariant(topic)}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
        <Button
          className="ml-auto"
          onClick={() =>
            dispatchInterviewCreatorUpdate({ type: "GO_TO_NEXT_STEP" })
          }
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

const YearsOfExperienceSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const initialState = interviewCreatorState.interviewConfig.yearsOfExperience;

  const [selectedYears, setSelectedYears] = useState<number | undefined>(
    initialState
  );

  const getBottomText = () => {
    if (selectedYears === undefined) return;
    const yearStr = selectedYears > 1 ? "years" : "year";
    return `${selectedYears} ${yearStr} of experience`;
  };

  useEffect(() => {
    return () =>
      dispatchInterviewCreatorUpdate({
        type: "SET_YEARS_OF_EXPERIENCE",
        payload: selectedYears,
      });
  }, [selectedYears]);
  return (
    <Container>
      <Heading className="mt-10">Select target years of experience.</Heading>

      <Panel className="mt-14 flex  items-center gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((years) => (
          <SelectOption
            key={years}
            className="grow"
            onClick={() => setSelectedYears(years)}
            text={years.toString()}
            variant={selectedYears === years ? "active" : "default"}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
        {!!selectedYears && (
          <Heading size={3} variant="secondary">
            {getBottomText()}
          </Heading>
        )}
        <Button
          className="ml-auto"
          onClick={() =>
            dispatchInterviewCreatorUpdate({ type: "GO_TO_NEXT_STEP" })
          }
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

const STEPS = [
  <IndustrySelectStep key="industry-select" />,
  <TopicSelectStep key="topic-select" />,
  <YearsOfExperienceSelectStep key="years-of-experience-select" />,
];

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
            <>
              <CircleDigit
                onClick={() => setStep(i)}
                number={i + 1}
                variant={i === step ? "default" : "disabled"}
              />
            </>
          ))}
        </Container>
        {STEPS[step]}
      </>
    </main>
  );
};

const MockInterviewPage: NextPage = () => {
  return (
    <InterviewCreatorProvider>
      <MockInterviewBuilder />
    </InterviewCreatorProvider>
  );
};

export default MockInterviewPage;
