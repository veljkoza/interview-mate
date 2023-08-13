import { useState, useEffect } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";

const NO_OF_QUESTIONS = [5, 10, 20, 25, 30];

export const NumberOfQuestionsSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const selectedNumberOfQuestions =
    interviewCreatorState.interviewConfig.numberOfQuestions;

  const getBottomText = () => {
    if (selectedNumberOfQuestions <= 0) return "";
    return `${selectedNumberOfQuestions} questions`;
  };

  const handleOptionClick = (duration: number) =>
    dispatchInterviewCreatorUpdate({
      type: "SET_NUMBER_OF_QUESTIONS",
      payload: duration,
    });

  return (
    <Container>
      <Heading className="mt-10">Select number of questions.</Heading>

      <Panel className="mt-14 flex  items-center gap-4">
        {NO_OF_QUESTIONS.map((duration) => (
          <FocusedOption
            key={duration}
            className="grow"
            onClick={() => handleOptionClick(duration)}
            item={duration}
            activeItem={selectedNumberOfQuestions}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
        {!!selectedNumberOfQuestions && (
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
