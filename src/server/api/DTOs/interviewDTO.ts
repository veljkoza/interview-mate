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
      durationInMinutes: true,
      yearsOfExperience: true,
    },
  },
  messages: {
    include: { metadata: true },
  },
  status: true,
  overallSatisfaction: true,
};
