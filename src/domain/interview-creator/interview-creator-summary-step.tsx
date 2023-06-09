import type { PropsWithChildren } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { SelectOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";
import { api } from "~/utils/api";
import { Logo } from "~/components/logo";
import { useRouter } from "next/navigation";
import { ROUTES } from "~/consts/navigation";

const SingleSummary = (
  props: { title: string; className?: string } & PropsWithChildren
) => (
  <div className={props.className}>
    <Heading size={4} is="h3" variant="secondary" className={`mb-3 `}>
      {props.title}
    </Heading>
    {props.children}
  </div>
);

export const InterviewCreatorSummaryStep = () => {
  const {
    dispatchInterviewCreatorUpdate,
    interviewCreatorState: { interviewConfig },
  } = useInterviewCreator();
  const {
    industry: { name },
    topics,
    durationInMinutes,
    yearsOfExperience,
  } = interviewConfig;
  const router = useRouter();
  const { isLoading, mutate } = api.interview.create.useMutation({
    onSuccess: (res) => {
      router.replace(`${ROUTES["mock-interview"]}/${res.id}`);
    },
    onError: (err) => console.log(err),
  });

  const handleSubmit = () => mutate(interviewConfig);

  if (isLoading) {
    return (
      <aside className="fixed inset-0 flex h-full w-full items-center justify-center bg-background">
        <Logo h={176} w={176} className="h-44 w-44 animate-bounce" />
      </aside>
    );
  }

  return (
    <Container>
      <Heading className="mt-14">All okay?</Heading>
      <div className="mt-14 flex flex-col gap-14">
        <div className="flex ">
          <SingleSummary title="Industry">
            <Heading size={3} is="p" className="mt-3">
              {name}
            </Heading>
          </SingleSummary>

          <SingleSummary title="Years of experience" className="mx-auto">
            <Heading size={3} is="p" className="mt-3">
              {yearsOfExperience}
            </Heading>
          </SingleSummary>
        </div>
        <SingleSummary title="Interview duration">
          <Heading size={3} is="p" className="mt-3">
            {durationInMinutes}
            <span>m</span>
          </Heading>
        </SingleSummary>
        <SingleSummary title="Topics">
          <div className="mt-5 flex flex-wrap gap-4">
            {topics.map((topic) => (
              <SelectOption
                key={topic.id}
                text={topic.name}
                variant="inactive"
                disabled
              />
            ))}
          </div>
        </SingleSummary>
      </div>
      <div className="flex">
        <Button className="ml-auto mt-10" onClick={() => handleSubmit()}>
          Start interview
        </Button>
      </div>
    </Container>
  );
};
