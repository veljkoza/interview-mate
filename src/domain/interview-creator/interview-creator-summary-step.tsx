import type { PropsWithChildren } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { SelectOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";

const SingleSummary = (
  props: { title: string; className?: string } & PropsWithChildren
) => (
  <div className={props.className}>
    <Heading size={4} is="h3" variant="secondary" className={`mb-3 `}>
      {props.title}
    </Heading>
    {props.children}
  </div>
);

export const InterviewCreatorSummaryStep = () => {
  const {
    dispatchInterviewCreatorUpdate,
    interviewCreatorState: { interviewConfig },
  } = useInterviewCreator();
  return (
    <Container>
      <Heading className="mt-14">All okay?</Heading>
      <div className="mt-14 flex flex-col gap-14">
        <div className="flex ">
          <SingleSummary title="Industry">
            <Heading size={3} is="p" variant="muted" className="mt-3">
              {interviewConfig.selectedIndustry}
            </Heading>
          </SingleSummary>

          <SingleSummary title="Years of experience" className="mx-auto">
            <Heading size={3} is="p" variant="muted" className="mt-3">
              {interviewConfig.yearsOfExperience}
            </Heading>
          </SingleSummary>
        </div>
        <SingleSummary title="Interview duration">
          <Heading size={3} is="p" variant="muted" className="mt-3">
            {interviewConfig.durationInMinutes}
            <span>m</span>
          </Heading>
        </SingleSummary>
        <SingleSummary title="Topics">
          <div className="mt-5 flex flex-wrap gap-4">
            {interviewConfig.selectedTopics.map((topic) => (
              <SelectOption
                key={topic}
                text={topic}
                variant="inactive"
                disabled
              />
            ))}
          </div>
        </SingleSummary>
      </div>
      <div className="flex">
        <Button
          className="ml-auto mt-10"
          onClick={() =>
            dispatchInterviewCreatorUpdate({ type: "GO_TO_NEXT_STEP" })
          }
        >
          Start interview
        </Button>
      </div>
    </Container>
  );
};
