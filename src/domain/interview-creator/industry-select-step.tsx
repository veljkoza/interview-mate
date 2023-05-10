import { useEffect, useState } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { INDUSTRIES } from "~/consts/industries";
import { useInterviewCreator } from "./context/interview-creator.context";
import { api } from "~/utils/api";
import { Industry } from "@prisma/client";

export const IndustrySelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();

  const { data: industries, isLoading } = api.industries.getAll.useQuery();
  const goToNextStep = () =>
    dispatchInterviewCreatorUpdate({
      type: "GO_TO_NEXT_STEP",
    });

  if (isLoading) return <div>Loading...</div>;
  if (!industries) return <div>No data</div>;

  const onClick = (industry: Industry) =>
    dispatchInterviewCreatorUpdate({
      type: "SET_INDUSTRY",
      payload: industry,
    });

  const activeIndustryName =
    interviewCreatorState.interviewConfig.industry.name;

  return (
    <Container>
      <Heading className="mt-10">Select your field of work.</Heading>

      <Panel className="mt-14 flex h-[450px] flex-wrap gap-4 overflow-y-scroll">
        {industries.map((industry) => (
          <FocusedOption
            activeItem={activeIndustryName}
            onClick={() => onClick(industry)}
            item={industry.name}
            key={industry.id}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
        <Heading size={3} variant="secondary">
          {activeIndustryName}
        </Heading>
        <Button onClick={() => goToNextStep()}>Next</Button>
      </div>
    </Container>
  );
};
