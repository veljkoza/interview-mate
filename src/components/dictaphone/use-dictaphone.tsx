import { type FC, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import createSpeechServicesPonyfill from "web-speech-cognitive-services";



interface UseDictaphoneProps {
  region: string;
  subscriptionKey: string;
}

export const useDictaphone = (props: UseDictaphoneProps) => {
  const {
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    listening,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { SpeechRecognition: AzureSpeechRecognition } =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      createSpeechServicesPonyfill({
        credentials: {
          region: props.region,
          subscriptionKey: props.subscriptionKey,
        },
      });
    SpeechRecognition.applyPolyfill(AzureSpeechRecognition);
  }, []);

  return {
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    SpeechRecognition,
    listening,
    transcript,
    resetTranscript,
  };
};
