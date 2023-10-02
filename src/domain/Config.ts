import { env } from "~/env.mjs";

export const Config = {
  mockInterview: {
    maximumSpeechRecognitionDuration:
      +env.NEXT_PUBLIC_MAXIMUM_SPEECH_RECOGNITION_DURATION || 70,
  },
};
