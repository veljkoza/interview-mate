import { useEffect, useState } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { INDUSTRIES } from "~/consts/industries";
import { useInterviewCreator } from "./context/interview-creator.context";

export const IndustrySelectStep = () => {
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
          <FocusedOption
            activeItem={activeIndustry}
            onClick={(industry) => setActiveIndustry(industry.toString())}
            item={industry}
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
