import { IndustrySelectStep } from "../industry-select-step";
import { InterviewCreatorSummaryStep } from "../interview-creator-summary-step";
import { NumberOfQuestionsSelectStep } from "../interview-duration-select-step";
import { TopicSelectStep } from "../topic-select-step";
import { YearsOfExperienceSelectStep } from "../years-of-experience-step";

export const STEPS = [
  <IndustrySelectStep key="industry-select" />,
  <TopicSelectStep key="topic-select" />,
  <YearsOfExperienceSelectStep key="years-of-experience-select" />,
  <NumberOfQuestionsSelectStep key="interview-duration-select" />,
  <InterviewCreatorSummaryStep key="interview-creator-summary-step" />,
];
export const STEPS_LENGTH = STEPS.length;
