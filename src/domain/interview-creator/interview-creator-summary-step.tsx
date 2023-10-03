import { PropsWithChildren, useEffect, useState } from "react";
import { Button } from "~/components/buttons";
import { Container } from "~/components/containers";
import { SelectOption } from "~/components/select-option";
import { Heading } from "~/components/typography";
import { useInterviewCreator } from "./context/interview-creator.context";
import { api } from "~/utils/api";
import { Logo } from "~/components/logo";
import { useRouter } from "next/navigation";
import { ROUTES } from "~/consts/navigation";
import { BouncyLoader } from "~/components/loaders";
import { Config } from "../Config";
import { toast } from "react-toastify";
import { ProgressBar } from "~/components";
import { useToggler } from "~/hooks";

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
    interviewCreatorState: { interviewConfig },
  } = useInterviewCreator();
  const [interviewId, setInterviewId] = useState<string>();
  const {
    industry: { name },
    topics,
    numberOfQuestions,
    yearsOfExperience,
  } = interviewConfig;
  const router = useRouter();

  const [pollCount, setPollCount] = useState(0);

  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [progressBarCompleted, setProgressBarCompleted] = useState(false);

  api.interview.questionsReceivedPoll.useQuery(
    { id: interviewId! },
    {
      enabled: !!interviewId,
      onSuccess: (res) => {
        setPollCount((prev) => prev + 1);
        if (res.status === "QUESTIONS_RECEIVED") {
          setProgressBarCompleted(true);
          setTimeout(() => {
            router.replace(`${ROUTES["mock-interview"]}/${res.id}`);
          }, 500);
        }
        if (pollCount > Config.interviewCreator.maximumNumberOfPolls) {
          toast.error(
            'Request timed out. Check "My Interviews" page shortly to see your created interview.',
            {
              closeOnClick: true,
              autoClose: false,
            }
          );
          router.replace(ROUTES["my-interviews"]);
        }
      },
      refetchInterval: Config.interviewCreator.pollingRefetchInterval,
      retry: 10,
    }
  );

  const { isLoading, mutate } = api.interview.create.useMutation({
    onSuccess: (res) => {
      // router.replace(`${ROUTES["mock-interview"]}/${res.id}`);
      setInterviewId(res.id);
      setIsLoadingRoute(true);
    },
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    return () => setIsLoadingRoute(false);
  }, []);

  const handleSubmit = () => mutate(interviewConfig);

  // 100 % / total duration in seconds = %/s
  const progressBarStepPercentage =
    100 / (interviewConfig.numberOfQuestions * 6);

  const shouldShowLoader = isLoading || isLoadingRoute;

  if (shouldShowLoader)
    return (
      <BouncyLoader
        className="fixed inset-0"
        messages={BouncyLoader.questionsLoadingMessages}
        progressBar={
          <div className="mt-32 w-1/2 md:w-1/3 lg:w-1/4">
            <ProgressBar
              shouldComplete={progressBarCompleted}
              stepPercentage={progressBarStepPercentage}
              intervalTime={1000}
            />
          </div>
        }
      />
    );

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
        <SingleSummary title="Number of questions">
          <Heading size={3} is="p" className="mt-3">
            {numberOfQuestions}
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
