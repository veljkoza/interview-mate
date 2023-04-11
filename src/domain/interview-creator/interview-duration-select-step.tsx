import { useState, useEffect } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";

export const InterviewDurationSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const initialState = interviewCreatorState.interviewConfig.durationInMinutes;

  const [selectedInterviewDuration, setSelectedInterviewDuration] =
    useState<number>(initialState);
  console.log({ selectedInterviewDuration: !selectedInterviewDuration });

  const getBottomText = () => {
    return `${selectedInterviewDuration} minutes`;
  };

  useEffect(() => {
    return () =>
      dispatchInterviewCreatorUpdate({
        type: "SET_INTERVIEW_DURATION",
        payload: selectedInterviewDuration,
      });
  }, [selectedInterviewDuration]);
  return (
    <Container>
      <Heading className="mt-10">Select interview duration.</Heading>

      <Panel className="mt-14 flex  items-center gap-4">
        {[10, 20, 30, 40].map((duration) => (
          <FocusedOption
            key={duration}
            className="grow"
            onClick={() => setSelectedInterviewDuration(duration)}
            item={duration}
            activeItem={selectedInterviewDuration}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
        {!!selectedInterviewDuration && (
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
