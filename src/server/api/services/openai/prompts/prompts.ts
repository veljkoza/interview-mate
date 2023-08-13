import { InterviewConfiguration } from "@prisma/client";
import { join } from "path";
import {
  GetFeedbackForAnswerParams,
  GetFeedbackForAnswerResponse,
  getFeedbackForAnswerPrompt,
} from "./get-feedback-for-answer";
import { GetIntroductionResponse, GetNextQuestionResponse } from "../openai";
import {
  GetQuestionsPromptParams,
  GetQuestionsPromptResponse,
  GetQuestionsPromptV2Params,
  GetQuestionsPromptV2Response,
  getQuestionsPrompt,
  getQuestionsPromptV2,
} from "./get-questions";
import {
  GetFeedbackForAnswerV2Params,
  GetFeedbackForAnswerV2Response,
  getFeedbackForAnswerV2Prompt,
} from "./get-feedback-for-answers.v2";

export type GetIntroductionPromptParams = {
  industry: string;
  personName: string;
};
const getIntroductionPrompt = ({
  industry,
  personName,
}: GetIntroductionPromptParams) => `
You are a {generate a random person name}, and you are about to interview me for an open ${industry} position role in a {generate random company name} (Please generate random and creative name for the company. Should be at least 10 characters long). 
YOUR TASKS:
- Please greet me by my name (${personName}) 
- Please introduce yourself and tell me something about the company you work for
- Please tell me something about the open position that I'm applying for
- Ask me to introduce myself
- Separate 'introduction' completely from 'question' to introduce myself in RESPONSE SCHEMA

LIMITATIONS: 
- you will ONLY and STRICTLY respond in the format of RESPONSE SCHEMA below
- you will not add any additional text other than RESPONSE SCHEMA
- you will return a name of the job posting by combining role and company name you provided

You should only respond in JSON format as described below.

RESPONSE SCHEMA: 
{ 
  "introduction": "your introduction message goes here",
  "nameOfTheJobPosting": "name of the job posting goes here" ,
  "introductionQuestion": "your question where you ask me to introduce myself goes here"
}`;
export type GetNextQuestionPromptParams = {
  industry: string;
  topics: string[];
  yearsOfExperience: number;
  question: string;
  answer: string;
};

const getSeniority = (yearsOfExperience: number) => {
  if (yearsOfExperience < 1) return "junior";
  if (yearsOfExperience >= 1 && yearsOfExperience < 2) return "advanced junior";
  if (yearsOfExperience >= 2 && yearsOfExperience < 3) return "medior";
  if (yearsOfExperience >= 3 && yearsOfExperience < 4) return "advanced medior";
  if (yearsOfExperience >= 4 && yearsOfExperience < 5) return "senior";
  if (yearsOfExperience >= 5 && yearsOfExperience < 6) return "advanced senior";
  if (yearsOfExperience >= 7 && yearsOfExperience < 8)
    return "software architect";
  if (yearsOfExperience >= 8) return "principal engineer";
  return "senior";
};

const getNextQuestionPrompt = ({
  question,
  answer,
  topics,
  industry,
  yearsOfExperience,
}: GetNextQuestionPromptParams) => `
Assume the role of an experienced technical interviewer.
You are an expert ${industry} interviewer conducting a mock interview for a candidate applying for a position in the ${industry} industry.
The perfect candidate for this role has expertise in ${industry} skills, and should gave good knowledge of ${topics.join(
  ", "
)}, and has ${yearsOfExperience} years of professional experience.
Use this information as a guide, but also include general questions relevant to the industry.
The questions shouldn't all have to be technical.
Make sure you maintain a respectful and encouraging tone throughout the interview.
Ask him ${getSeniority(yearsOfExperience)} level questions.
QUESTION:
"${question}"

ANSWER:
"${answer}"


TASKS:
- Analyze the ANSWER question against the QUESTION section
- Give satisfaction rate (1 - 2048) of the answer
- Give exhaustive, honest, constructive and effective feedback.(feedback should include specific examples and suggestions on how the candidate can improve their answer)
- Generate the next logical question based on the given answer, (questions should be of more longer format) 
- Try to keep track and not repeat the same questions
- Optionally give a very short response to the answer

You should only respond in JSON format as described below.

RESPONSE SCHEMA:
{
   "response": "very short interviewer verbal response that is not a question",
   "nextQuestion": "next question,
   "feedback": "exhaustive feedback",
   "satisfaction": "satisfaction with the answer",
   "topics": "relevant topics from the topics mentioned - as string array",
   "nextQuestionType: "technical" | "soft skills"
}

LIMITATIONS:
- you should ONLY and STRICTLY respond in JSON
- if the provided answer is question itself 'response' field shouldn't exist
- if the provided answer is non-sensical or not relevant to the context of the mock interview, you will give an HR response and ask next question
- 'nextQuestion' field found in RESPONSE SCHEMA must never be empty
- 'feedback' field found in RESPONSE SCHEMA must never be empty
`;

export type GetTechnicalAnnouncementPromptParams = Pick<
  GetNextQuestionPromptParams,
  "industry" | "topics" | "yearsOfExperience"
>;

const getTechnicalAnnouncementPrompt = (
  params: GetTechnicalAnnouncementPromptParams
) => `
You are a Mock Interview AI. Your task is to announce the technical part of the interview. You will also ask me a technical question, but we need to separate the announcement of the technical interview starting from the actual question. You will ask a question based on the INTERVIEW CONFIGURATION section.

INTERVIEW CONFIGURATION:
industry: ${params.industry}
topics: ${params.topics.join(", ")}
years of experience: ${params.yearsOfExperience}

REQUIREMENTS:
- you will ONLY and STRICTLY respond in the format of RESPONSE SCHEMA found below
- you will ask a question based on INTERVIEW CONFIGURATION
- you will NOT ask any questions in "announcement" field

You should only respond in JSON format as described below.


RESPONSE SCHEMA:
{
"announcement": "announcement of technical part of interview starting. this value should never be a question",
"question": "question based on INTERVIEW CONFIGURATION",
}`;

export const Prompts = {
  getIntroduction: getIntroductionPrompt,
  getNextQuestion: getNextQuestionPrompt,
  getTechnicalAnnouncement: getTechnicalAnnouncementPrompt,
  getFeedbackForAnswer: getFeedbackForAnswerPrompt,
  getQuestions: getQuestionsPrompt,
  getQuestionsV2: getQuestionsPromptV2,
  getFeedbackForAnswerV2: getFeedbackForAnswerV2Prompt,
} as const;

export type PromptsTypes = {
  getFeedbackForAnswer: Prompt<
    GetFeedbackForAnswerParams,
    GetFeedbackForAnswerResponse
  >;
  getFeedbackForAnswerV2: Prompt<
    GetFeedbackForAnswerV2Params,
    GetFeedbackForAnswerV2Response
  >;
  getIntroduction: Prompt<GetIntroductionPromptParams, GetIntroductionResponse>;
  getNextQuestion: Prompt<GetNextQuestionPromptParams, GetNextQuestionResponse>;
  getQuestions: Prompt<GetQuestionsPromptParams, GetQuestionsPromptResponse>;
  getQuestionsV2: Prompt<
    GetQuestionsPromptV2Params,
    GetQuestionsPromptV2Response
  >;
};

type Prompt<P, R> = { params: P; response: R };
export type PromptFn<T extends keyof PromptsTypes> = (
  params: PromptsTypes[T]["params"]
) => Promise<PromptsTypes[T]["response"]>;

export type MockInterviewServiceType = {
  [K in keyof PromptsTypes]: PromptFn<K>;
};
