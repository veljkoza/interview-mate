/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Configuration, OpenAIApi } from "openai";
import {
  type GetIntroductionPromptParams,
  type GetNextQuestionPromptParams,
  type GetTechnicalAnnouncementPromptParams,
  Prompts,
} from "./prompts";
const configuration = new Configuration({
  organization: "org-wGQSQOlnl30MtUnbW35FfICR",
  apiKey: process.env.OPENAI_API_KEY,
});

const model = "gpt-3.5-turbo";
export const openai = new OpenAIApi(configuration);

export const createOpenAICompletion = async ({
  prompt,
}: {
  prompt: string;
}) => {
  const res = await openai.createChatCompletion({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 3000,
    temperature: 0.55,
  });
  return res.data.choices[0]?.message?.content.trim();
};

const getOpenAiResponse = async <R>(props: { prompt: string; fallback: R }) => {
  const res = await createOpenAICompletion({ prompt: props.prompt });
  try {
    return res ? JSON.parse(res) : props.fallback;
  } catch (error) {
    throw new Error(
      `Error while parsing: ${res || ""}, Error: ${
        error as string
      } \n Prompt: ${props.prompt}`
    );
  }
};

export const MockInterviewAiService = {
  getIntroduction: async (
    params: GetIntroductionPromptParams
  ): Promise<GetIntroductionResponse> => {
    const fallback = {
      introduction: "error",
      introductionQuestion: "error",
      nameOfTheJobPosting: "error",
    };
    return await getOpenAiResponse<GetIntroductionResponse>({
      prompt: Prompts.getIntroduction(params),
      fallback,
    });
  },
  getNextQuestion: async (
    params: GetNextQuestionPromptParams
  ): Promise<GetNextQuestionResponse> => {
    const fallback: GetNextQuestionResponse = {
      feedback: "error",
      nextQuestion: "error",
      response: "error",
      satisfaction: -1,
      topics: ["error"],
    };

    return await getOpenAiResponse<GetNextQuestionResponse>({
      prompt: Prompts.getNextQuestion(params),
      fallback,
    });
  },
  // getTechnicalAnnouncement: async (
  //   params: GetTechnicalAnnouncementPromptParams
  // ): Promise<GetTechnicalAnnouncementResponse> => {
  //   const fallback: GetTechnicalAnnouncementResponse = {
  //     announcement: "error",
  //     question: "error",
  //   };
  //   const res = await getOpenAiResponse<GetTechnicalAnnouncementResponse>({
  //     prompt: Prompts.getTechnicalAnnouncement(params),
  //     fallback,
  //   });
  //   console.log("hazbula", { res });
  //   return res;
  // },
};

type GetIntroductionResponse = {
  introduction: string;
  nameOfTheJobPosting: string;
  introductionQuestion: string;
};

type GetNextQuestionResponse = {
  response: string;
  nextQuestion: string;
  feedback: string;
  satisfaction: number;
  topics: string[];
};

type GetTechnicalAnnouncementResponse = {
  announcement: string;
  question: string;
};
