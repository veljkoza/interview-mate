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

export type GetQuestionsPromptV2Params = {
  questionTypes: ("technical" | "behavioural" | "situational")[];
  difficulty: "entry" | "junior" | "medior" | "senior" | "principal";
  topics: string[];
  role: string;
  domain?: string;
  numberOfQuestions: number;
};
export type GetQuestionsPromptV2Response = {
  questions: {
    type: GetQuestionsPromptV2Params["questionTypes"][0];
    question: string;
  }[];
};

export const getQuestionsPromptV2 = ({
  difficulty,
  role,
  topics,
  questionTypes,
  domain,
  numberOfQuestions,
}: GetQuestionsPromptV2Params) => `As an AI, you need to generate a structured interview for a ${difficulty} ${role} software engineer role. The difficulty level for this role is ${difficulty}. The technologies that may be included are ${topics.toString()}. The interview should include:

You MUST respond completely in JSON!

${
  (questionTypes.find((type) => type === "technical") &&
    `Technical Questions:
  Please generate a series of technical questions at the ${difficulty} level that test the candidate's understanding of software engineering principles, their expertise in the ${role} role, their in-depth familiarity with ${topics.toString()}, their understanding of recent trends and innovations in these technologies, and their problem-solving abilities.`) ||
  ""
}

${
  (questionTypes.find((type) => type === "behavioural") &&
    `Behavioural Questions:
  Please generate a series of behavioural questions that assess the candidate's leadership skills, team collaboration, adaptability, conflict resolution abilities, alignment with [company's core values], and general work ethics.
  `) ||
  ""
}

${
  (questionTypes.find((type) => type === "situational") &&
    `Situational Questions:
  Please generate a series of situational questions that assess how the candidate might handle specific scenarios they could encounter in a ${difficulty} ${role} software engineer role. These should involve problem-solving, working under pressure, and handling deadlines.  
  `) ||
  ""
}

${
  (domain &&
    `Domain-specific (${domain}) Questions:
  Please generate a series of domain-specific questions that assess the candidate's understanding of ${domain} business models, their experience with ${domain} platforms, their knowledge of ${domain} trends, and their understanding of the unique challenges and opportunities in the ${domain} industry.
  `) ||
  ""
}

The questions should be arranged in a way that makes sense for a holistic interview, transitioning smoothly from one topic to another. The aim is to comprehensively evaluate a software engineer candidate's suitability for the role. Please generate ${numberOfQuestions} number of questions in total.

The output should be provided in JSON format and contain 'questions' proeprty which is structured as an array of question objects. Each object should have a 'type' field indicating whether it's a technical, behavioural, situational, or domain-specific question, and a 'question' field containing the actual question.

`;
