import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { InterviewResultRepository } from "./interview-result.repository";

export const interviewResultRouter = createTRPCRouter({
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const interviewResult = await InterviewResultRepository.getById({
        id: input.id,
      });
      return interviewResult;
    }),
});
