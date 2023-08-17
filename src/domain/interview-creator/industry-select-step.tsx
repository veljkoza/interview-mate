import { FC, useEffect, useState } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption, SelectOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { INDUSTRIES } from "~/consts/industries";
import { useInterviewCreator } from "./context/interview-creator.context";
import { api } from "~/utils/api";
import { Industry } from "@prisma/client";
import { Separator } from "~/components";

export const IndustrySelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();

  // const { data: industries, isLoading } = api.industries.getAll.useQuery();
  const goToNextStep = () =>
    dispatchInterviewCreatorUpdate({
      type: "GO_TO_NEXT_STEP",
    });

  // if (isLoading) return <div>Loading...</div>;
  // if (!industries) return <div>No data</div>;

  const onClick = (industry: Industry) =>
    dispatchInterviewCreatorUpdate({
      type: "SET_INDUSTRY",
      payload: industry,
    });

  const activeIndustryName =
    interviewCreatorState.interviewConfig.industry.name;

  return (
    <Container className="flex h-full flex-col pb-4">
      <Heading className="mt-5 md:mt-10">Select your field of work.</Heading>

      <IndustriesList
        activeIndustryName={activeIndustryName}
        onClick={onClick}
      />
      <Separator className="h-8" />
      <div className="mt-auto flex items-center justify-between md:mt-8">
        <Heading size={3} variant="secondary">
          {activeIndustryName}
        </Heading>
        <Button
          onClick={() => {
            if (interviewCreatorState.interviewConfig.industry.name) {
              goToNextStep();
            }
          }}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

const IndustriesList: FC<{
  onClick: (industry: Industry) => void;
  activeIndustryName: string;
}> = ({ activeIndustryName, onClick }) => {
  const { data: industries, isLoading } = api.industries.getAll.useQuery();

  const getBody = () => {
    if (isLoading)
      return Array(50)
        .fill("123")
        .map((el, i) => <SelectOption.Ghost key={i} />);
    if (!industries)
      return (
        <Heading>
          Ooops. It looks like we cant show you this data right now.
        </Heading>
      );
    return industries.map((industry) => (
      <FocusedOption
        activeItem={activeIndustryName}
        onClick={() => onClick(industry)}
        item={industry.name}
        key={industry.id}
      />
    ));
  };

  return (
    <Panel className="mt-10 flex  h-[450px] flex-wrap gap-4 overflow-y-scroll lg:mt-14">
      {getBody()}
    </Panel>
  );
};
