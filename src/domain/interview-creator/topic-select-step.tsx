import { useState, useEffect } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { SelectOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";
import { Topic } from "@prisma/client";
import { api } from "~/utils/api";

export const TopicSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const [selectedTopics, setSelectedTopics] = useState(
    interviewCreatorState.interviewConfig.topics
  );
  const handleTopicClick = (clickedTopic: Topic) => {
    console.log(clickedTopic);
    const foundIndex = selectedTopics.findIndex(
      (topic) => topic.id === clickedTopic.id
    );
    if (foundIndex >= 0) {
      console.log({ foundIndex }, "test");
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
  }, [selectedTopics]);

  console.log({ selectedTopics });

  const { data: topics, isLoading } = api.topic.getTopicsByIndustryId.useQuery({
    id: interviewCreatorState.interviewConfig.industry.id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!topics) return <div>No data...</div>;
  return (
    <Container>
      <Heading className="mt-10">Select relevant topics.</Heading>

      <Panel className="mt-14 flex h-[450px] flex-wrap gap-4 overflow-y-scroll">
        {topics.map((topic) => (
          <SelectOption
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            text={topic.name}
            variant={getOptionVariant(topic)}
          />
        ))}
      </Panel>
      <div className="mt-8 flex items-center justify-between">
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
