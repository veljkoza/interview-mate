import { useState, useEffect } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";
import { api } from "~/utils/api";
import { BouncyLoader } from "~/components";

const NO_OF_QUESTIONS = [5, 10, 20, 25, 30];

export const NumberOfQuestionsSelectStep = () => {
  const { data: user, isLoading } = api.user.getCurrentUser.useQuery();
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
  console.log({ user });
  if (!user) return <div>Uip!</div>;
  if (isLoading) return <BouncyLoader />;
  return (
    <Container className="flex h-full flex-col pb-4">
      <Heading className="mt-5 md:mt-10">Select number of questions.</Heading>

      <Panel className="mt-10 grid grid-cols-3 items-center gap-4 md:mt-14  md:grid-cols-5 lg:flex">
        {NO_OF_QUESTIONS.map((duration) => {
          if (duration <= user.numberOfQuestionsAvailable)
            return (
              <FocusedOption
                key={duration}
                className="grow"
                onClick={() => handleOptionClick(duration)}
                item={duration}
                activeItem={selectedNumberOfQuestions}
              />
            );
        })}
      </Panel>
      <div className="mt-auto flex items-center justify-between md:mt-8">
        {!!selectedNumberOfQuestions && (
          <Heading size={3} variant="secondary">
            {getBottomText()}
          </Heading>
        )}
        <Button
          className="ml-auto"
          onClick={() => {
            if (interviewCreatorState.interviewConfig.numberOfQuestions) {
              dispatchInterviewCreatorUpdate({ type: "GO_TO_NEXT_STEP" });
            }
          }}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};
