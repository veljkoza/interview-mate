import { InterviewStatus } from "@prisma/client";
import type { NextPage } from "next";
import { AppHeader } from "~/components/app-header";
import { Container } from "~/components/containers";
import { Panel } from "~/components/panel";
import { api } from "~/utils/api";

const interviewStatusColorMap: Record<InterviewStatus, string> = {
  ACTIVE: "bg-yellow-500",
  COMPLETED: "bg-green-500",
};

const MyInterviews: NextPage = () => {
  const { data: interviews } = api.interview.getInterviewsForUser.useQuery();
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
  if (!interviews) return <div>No data</div>;
  return (
    <main className="relative">
      <AppHeader />
      <div className="relative flex flex-col pt-36">
        <Container>
          <h1 className="text-3xl leading-normal text-white lg:text-5xl">
            My interviews
          </h1>
          <div className="mt-16 grid grid-cols-2 gap-5">
            {interviews.map(
              ({ configuration, overallSatisfaction = 0, ...interview }) => (
                <div key={interview.id}>
                  <Panel className="relative overflow-hidden">
                    <div
                      title="Satisfaction score"
                      style={{ width: `${overallSatisfaction || 0}%` }}
                      className={`absolute left-0 right-0 top-0 h-1 ${getSatisfactionClassNames(
                        overallSatisfaction || 0
                      )}`}
                    ></div>
                    <div className="mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-secondary">
                      <p className="text-accent-secondary">69%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl text-accent-secondary">
                        Front-end position at Proxify.io
                      </h2>
                      <p
                        className={`absolute -top-2 right-4 z-30 mt-2 rounded-b-md px-4  py-2 font-thin text-canvas-subtle ${getStatusColor(
                          interview.status
                        )}`}
                      >
                        {interview.status}
                      </p>
                    </div>

                    <div>
                      <p className="mt-2 font-body text-lg font-thin text-white">
                        {configuration.industry.name},{" "}
                        {configuration.yearsOfExperience} years of experience
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {configuration.topics.map((topic) => (
                          <p
                            key={topic.name}
                            className="inline-block border border-muted-fg p-2 text-muted-fg"
                          >
                            {topic.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Panel>
                </div>
              )
            )}
          </div>
        </Container>
      </div>
    </main>
  );
};

export default MyInterviews;
