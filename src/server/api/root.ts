import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { topicRouter } from "./routers/topics";
import { industryRouter } from "./routers/industries";
import { interviewRouter } from "./routers/interviews";
import { interviewResultRouter } from "./interview-result/interview-result.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  topic: topicRouter,
  industries: industryRouter,
  interview: interviewRouter,
  interviewResult: interviewResultRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
