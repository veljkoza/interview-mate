import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";

export const YearsOfExperienceSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const selectedYears = interviewCreatorState.interviewConfig.yearsOfExperience;

  const getBottomText = () => {
    if (selectedYears === undefined || selectedYears <= 0) return;
    const yearStr = selectedYears > 1 ? "years" : "year";
    return `${selectedYears} ${yearStr} of experience`;
  };

  const handleOptionClick = (years: number) =>
    dispatchInterviewCreatorUpdate({
      type: "SET_YEARS_OF_EXPERIENCE",
      payload: years,
    });

  const onNextClick = () => {
    dispatchInterviewCreatorUpdate({ type: "GO_TO_NEXT_STEP" });
  };

  return (
    <Container>
      <Heading className="mt-10">Select target years of experience.</Heading>

      <Panel className="mt-14 flex  items-center gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((years) => (
          <FocusedOption
            key={years}
            className="grow"
            onClick={() => handleOptionClick(years)}
            item={years}
            activeItem={selectedYears}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
        {!!selectedYears && (
          <Heading size={3} variant="secondary">
            {getBottomText()}
          </Heading>
        )}
        <Button className="ml-auto" onClick={onNextClick}>
          Next
        </Button>
      </div>
    </Container>
  );
};
