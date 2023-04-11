import { useState, useEffect } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { SelectOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { TOPICS } from "~/consts/topics";
import { useInterviewCreator } from "./context/interview-creator.context";

export const TopicSelectStep = () => {
  const { interviewCreatorState, dispatchInterviewCreatorUpdate } =
    useInterviewCreator();
  const [selectedTopics, setSelectedTopics] = useState(
    interviewCreatorState.interviewConfig.selectedTopics
  );
  const handleTopicClick = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      const index = selectedTopics.indexOf(topic);
      const temp = [...selectedTopics];
      temp.splice(index, 1);
      setSelectedTopics(temp);
      return;
    }
    setSelectedTopics((prev) => [...prev, topic]);
  };

  const getOptionVariant = (topic: string) => {
    if (selectedTopics.includes(topic)) return "active";
    return "default";
  };

  useEffect(() => {
    return () =>
      dispatchInterviewCreatorUpdate({
        type: "SET_TOPICS",
        payload: selectedTopics,
      });
  }, [selectedTopics]);
  return (
    <Container>
      <Heading className="mt-10">Select relevant topics.</Heading>

      <Panel className="mt-14 flex h-[450px] flex-wrap gap-4 overflow-y-scroll">
        {TOPICS.map((topic) => (
          <SelectOption
            key={topic}
            onClick={() => handleTopicClick(topic)}
            text={topic}
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
