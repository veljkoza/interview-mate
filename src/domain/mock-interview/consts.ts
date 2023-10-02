export const getInterviewConfigFromParams = (query: string) => {
  const interviewConfig: Record<string, string | number | string[]> = {
    selectedIndustry: "",
    selectedTopics: [] as string[],
    yearsOfExperience: 0,
    numberOfQuestions: 0,
  };

  return [...Object.entries(query)].reduce((acc, [key, value]) => {
    if (key === "selectedTopics") {
      const temp = value.split(",")?.map((topic) => decodeURIComponent(topic));
      acc["selectedTopics"] = temp;
    } else {
      if (value !== undefined) {
        const parsedValue = value;
        const temp = isNaN(+parsedValue)
          ? decodeURIComponent(parsedValue)
          : parseInt(parsedValue);
        acc[key] = temp;
      }
    }
    return acc;
  }, interviewConfig);
};
