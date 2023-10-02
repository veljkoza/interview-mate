import { env } from "~/env.mjs";

export const Config = {
  mockInterview: {
    maximumSpeechRecognitionDuration:
      +env.MAXIMUM_SPEECH_RECOGNITION_DURATION || 70,
  },
};
