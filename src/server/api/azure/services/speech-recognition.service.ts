import { env } from "~/env.mjs";

export const speechRecognitionService = {
  getToken: async () => {
    const fetchTokenUrl = env.AZURE_COGNITIVE_TOKEN_ENDPOINT;
    const subscriptionKey = env.AZURE_SPEECH_RECOGNITION_SERVICE_KEY;
    const res = await fetch(fetchTokenUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-type": "application/x-www-form-urlencoded",
      },
    });

    return res.text();
  },
};
