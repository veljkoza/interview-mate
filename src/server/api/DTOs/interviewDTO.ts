export const interviewDTO = {
  id: true,
  configuration: {
    select: {
      industry: {
        select: {
          id: true,
          name: true,
        },
      },
      topics: true,
      numberOfQuestions: true,
      yearsOfExperience: true,
    },
  },
  interviewResultId: true,
  messages: {
    include: { metadata: true },
  },
  status: true,
  questions: true,
};
