import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { azureService } from "./services";

export const azureRouter = createTRPCRouter({
  getToken: publicProcedure.query(async () => {
    const token = await azureService.speechRecognition.getToken();
    const region = env.AZURE_REGION;
    return { token, region };
  }),
});
