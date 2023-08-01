export type GetQuestionsPromptParams = {
  numberOfQuestions: number;
};
export type GetQuestionsPromptResponse = {
  questions: string[];
};

export const getQuestionsPrompt = (
  params: GetQuestionsPromptParams
) => `You are an interviewer at one of the FAANG companies. You are interviewing for an open Front End position. The technologies required to be known are, but not limited to: React, Typescript, Next.js, SSR.
Interview should contain these question types: Background, Situational, Technical
Questions should flow smoothly and whole interview should make sense in their ordering.
You can ONLY respond in JSON format.
Number of questions: ${params.numberOfQuestions}

JSON Response format:

"""ts
questions: string[]
"""
`;
