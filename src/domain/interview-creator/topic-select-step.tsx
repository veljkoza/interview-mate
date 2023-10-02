import { useState, useEffect, FC } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { FocusedOption, SelectOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";
import { Topic } from "@prisma/client";
import { api } from "~/utils/api";
import { Separator } from "~/components";

export const TopicSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const [selectedTopics, setSelectedTopics] = useState(
    interviewCreatorState.interviewConfig.topics
  );
  const handleTopicClick = (clickedTopic: Topic) => {
    const foundIndex = selectedTopics.findIndex(
      (topic) => topic.id === clickedTopic.id
    );
    if (foundIndex >= 0) {
      const temp = [...selectedTopics];
      temp.splice(foundIndex, 1);
      setSelectedTopics(temp);
      return;
    }
    setSelectedTopics((prev) => [...prev, clickedTopic]);
  };

  const getOptionVariant = (tempTopic: Topic) => {
    if (selectedTopics.find((topic) => topic.id === tempTopic.id))
      return "active";
    return "default";
  };

  useEffect(() => {
    return () =>
      dispatchInterviewCreatorUpdate({
        type: "SET_TOPICS",
        payload: selectedTopics,
      });
  }, [selectedTopics.length]);

  const { data: topics, isLoading } = api.topic.getTopicsByIndustryId.useQuery({
    id: interviewCreatorState.interviewConfig.industry.id,
  });

  const getBody = () => {
    if (isLoading)
      return Array(50)
        .fill("123")
        .map((el, i) => <SelectOption.Ghost key={i} />);
    if (!topics)
      return (
        <Heading>
          Ooops. It looks like we cant show you this data right now.
        </Heading>
      );
    return topics.map((topic) => (
      <SelectOption
        key={topic.id}
        onClick={() => handleTopicClick(topic)}
        text={topic.name}
        variant={getOptionVariant(topic)}
      />
    ));
  };
  return (
    <Container className="flex h-full flex-col pb-4">
      <Heading className="mt-5 md:mt-10">Select relevant topics.</Heading>

      <Panel className="mt-10 flex  h-[450px] flex-wrap gap-4 overflow-y-scroll lg:mt-14">
        {getBody()}
      </Panel>
      <Separator className="h-8" />
      <div className="mt-8 flex items-center justify-between">
        <Button
          className="ml-auto"
          onClick={() => {
            if (selectedTopics.length > 0) {
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
