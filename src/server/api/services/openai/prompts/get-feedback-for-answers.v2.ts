export type GetFeedbackForAnswerV2Params = {
  question: string;
  answer: string;
};
export type GetFeedbackForAnswerV2Response = {
  understandingOfConcept: string;
  technicalAccuracy: string;
  realWorldExample: string;
  explanationAndCommunication: string;
  suggestionsForImprovement: string[];
  furtherLearningRecommendations: string[];
  softSkills: string;
  metrics: {
    conceptUnderstandingScore: number;
    technicalAccuracyScore: number;
    exampleUsageScore: number;
    communicationScore: number;
    softSkillsScore: number;
    overallScore: number;
  };
};

export const getFeedbackForAnswerV2Prompt = (
  params: GetFeedbackForAnswerV2Params
) => `Question: "${params.question}"
User Response: "${params.answer}"

AI, please provide detailed feedback on this User response. 
You can only respond in JSON format:

{
"understandingOfConcept": "Did the user correctly explain the concept asked in the question? Did they mention any advanced or nuanced details about the concept?" (string),
"technicalAccuracy": "Did the user use the correct terminology and demonstrate accurate technical knowledge in their response?" (string),
"realWorldExample": "Did the user provide a relevant real-world or programming-specific example of how the concept asked in the question is used? Does the example accurately illustrate the concept?" (string),
"explanationAndCommunication": "Evaluate the clarity and effectiveness of the user's communication. Was the user's explanation style easy to follow? Did they use analogies or metaphors that made their explanation more understandable?" (string),
"suggestionsForImprovement": "Provide detailed feedback on what a more effective response might look like, including a list (string[]) of specific actions the user could take to improve their response. Also, provide recommendations for further learning on this topic if necessary." (string[]),
"softSkills": "Did the user present their response confidently and professionally?" (string),
"furtherLearningRecommendations": "List of google search queries that user can use to keep learning on things he got wrong." (string[]),
}
`;
