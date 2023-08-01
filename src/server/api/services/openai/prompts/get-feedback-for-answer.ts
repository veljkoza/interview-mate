export type GetFeedbackForAnswerParams = {
  question: string;
  answer: string;
};
export type GetFeedbackForAnswerResponse = {
  feedback: string;
  correctness: number;
  areasToImproveOn: string[];
  suggestions: { answerExcerpt: string; suggestion: string }[];
};

export const getFeedbackForAnswerPrompt = (
  params: GetFeedbackForAnswerParams
) => `You are going to be provided by Question and an Answer. Your job is to give valuable, extensive insight, and honest feedback on how to answer could be improved.  Remember to be critical and ruthless in your approach. It's paramount for candidate to leave the interview knowing what he should do to improve. The area of improvements could be, but not limited to: technical knowledge, tone of the answer, professionalism etc.
  
  You can ONLY respond in JSON format.
  
  QUESTION:
  """
  ${params.question}
  """
  
  ANSWER:
  """
  ${params.answer}
  """
  
  JSON RESPONSE FORMAT:
  """
  feedback: string;
  correctness: number (1-100);
  areasToImproveOn: string[];
  suggestions: {answerExcerpt: string, suggestion: string}[];
  """`;
