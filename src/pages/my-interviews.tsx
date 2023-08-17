import { InterviewStatus } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";

import { FC, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { BackButton, Heading, PageHeader } from "~/components";
import { AppHeader } from "~/components/app-header";
import { Container } from "~/components/containers";
import { BouncyLoader } from "~/components/loaders";
import { Panel } from "~/components/panel";
import { ROUTES } from "~/consts/navigation";
import { useIsClient } from "~/hooks";
import { RouterOutputs, api } from "~/utils/api";

const interviewStatusColorMap: Record<InterviewStatus, string> = {
  ACTIVE: "bg-yellow-500",
  COMPLETED: "bg-green-500",
};

export type InterviewDTO =
  RouterOutputs["interview"]["getInterviewsForUser"][0];

const MyInterviews: NextPage = () => {
  const { data: interviews, isLoading } =
    api.interview.getInterviewsForUser.useQuery();

  return (
    <main className="relative pb-10">
      <AppHeader />
      <div className="relative flex flex-col pt-36">
        <Container>
          <PageHeader
            backButton={<BackButton />}
            title={
              <h1 className="text-3xl leading-normal text-white lg:text-5xl">
                My interviews
              </h1>
            }
          />
          <div className="h-10"></div>
          <MyInterviewsPageContent
            interviews={interviews}
            isLoading={isLoading}
          />
        </Container>
      </div>
    </main>
  );
};

const InterviewCard = ({ interview }: { interview: InterviewDTO }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const router = useRouter();

  const getStatusColor = (status: InterviewStatus) =>
    interviewStatusColorMap[status];
  const getSatisfactionClassNames = (satisfaction: number) => {
    const getColor = () => {
      if (satisfaction < 33) return "bg-red-500";
      if (satisfaction < 66) return "bg-yellow-700";
      return "bg-green-500";
    };
    const color = getColor();
    return `${color} `;
  };
  const { configuration } = interview;

  const toggleIsCollapsed = () => setIsCollapsed((prev) => !prev);

  const shouldAllowExpanding = interview.configuration.topics.length > 5;

  const handleClick = () => {
    if (interview.status === "ACTIVE") {
      router.push(`${ROUTES["mock-interview"]}/${interview.id}`);
      return;
    }
    if (interview.status === "COMPLETED") {
      router.push(
        `${ROUTES["interview-results"]}/${interview.interviewResultId || ""}`
      );
    }
  };
  return (
    <div onClick={() => handleClick()}>
      <Panel
        className={`relative transform cursor-pointer hover:border-accent-secondary ${
          isCollapsed && shouldAllowExpanding ? "max-h-64 " : "max-h-auto"
        } overflow-hidden`}
      >
        {/* <div
          title="Satisfaction score"
          style={{ width: `${0}%` }}
          className={`absolute left-0 right-0 top-0 h-1 ${getSatisfactionClassNames(
            0
          )}`}
        ></div>
        <SatisfactionPercentage percentage={69} /> */}
        <div className="flex items-center justify-between">
          <h2 className=" text-lg text-accent-secondary md:text-2xl">
            {interview.title}
          </h2>
          <p
            className={`absolute -top-2 right-4 z-30 mt-2 rounded-b-md px-4  py-2 text-sm font-thin text-canvas-subtle md:text-base ${getStatusColor(
              interview.status
            )}`}
          >
            <span className="hidden md:block">{interview.status}</span>
          </p>
        </div>

        <div>
          <p className="mt-2 font-body font-thin text-white md:text-lg">
            {configuration.industry.name}, {configuration.yearsOfExperience}{" "}
            years of experience
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {configuration.topics.map((topic) => (
              <p
                key={topic.name}
                className="inline-block border border-muted-fg p-2 text-xs text-muted-fg md:text-base"
              >
                {topic.name}
              </p>
            ))}
          </div>
        </div>
        {shouldAllowExpanding && (
          <div className="absolute bottom-0 left-0 right-0 flex h-1/4 w-full items-center justify-end bg-gradient-to-t from-gray-950 to-transparent px-5 opacity-50">
            <button
              className="text-2xl text-accent-secondary"
              onClick={() => toggleIsCollapsed()}
            >
              <BsArrowDown
                className={`transform transition-transform ${
                  isCollapsed ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
};

interface MyInterviewsPageContent {
  interviews?: InterviewDTO[];
  isLoading?: boolean;
}

const MyInterviewsPageContent: FC<MyInterviewsPageContent> = ({
  interviews,
  isLoading,
}) => {
  if (isLoading)
    return (
      <div className="relative pt-4">
        <BouncyLoader className="relative" />
      </div>
    );
  if (!interviews || !interviews.length)
    return (
      <Panel className="grid items-center justify-center">
        <Heading size={4}>No data</Heading>
      </Panel>
    );
  return (
    <div className="grid gap-5 md:mt-14 md:grid-cols-2 lg:mt-16">
      {interviews.map((interview) => (
        <InterviewCard interview={interview} key={interview.id} />
      ))}
    </div>
  );
};

export const SatisfactionPercentage = ({
  percentage = 69,
  className = "",
}: {
  percentage: number;
} & { className?: string }) => {
  const getSatisfactionClassNames = (satisfaction: number) => {
    const getColor = () => {
      if (satisfaction < 33) return "border-red-500 text-red-500";
      if (satisfaction < 66) return "border-yellow-700 text-yellow-700";
      return "text-green-500 border-green-500";
    };
    const color = getColor();
    return `${color} `;
  };
  return (
    <div
      title={`You got ${percentage}% satisfaction result from interview mate`}
      className={`mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-full border-2 ${getSatisfactionClassNames(
        percentage
      )} ${className}`}
    >
      <p className="">{percentage} %</p>
    </div>
  );
};

export default MyInterviews;
