import { type FC, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import createSpeechServicesPonyfill from "web-speech-cognitive-services";

interface UseDictaphoneProps {
  region?: string;
  authorizationToken?: string;
}

type StartListeningParams = Parameters<
  typeof SpeechRecognition.startListening
>["0"];

export const useDictaphone = (props: UseDictaphoneProps) => {
  const [speechRecognition, setSpeechRecognition] =
    useState<typeof SpeechRecognition>();
  const {
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    listening,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();
  useEffect(() => {
    if (!props.authorizationToken || !props.region) return;
    const applyPolyfill = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { SpeechRecognition: AzureSpeechRecognition } =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        createSpeechServicesPonyfill({
          credentials: {
            region: props.region,
            authorizationToken: props.authorizationToken,
          },
        });
      SpeechRecognition.applyPolyfill(AzureSpeechRecognition);
      setSpeechRecognition(SpeechRecognition);
    };
    void applyPolyfill();
  }, [props.region, props.authorizationToken]);

  const start = (params?: StartListeningParams) => {
    speechRecognition
      ?.startListening(params)
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  console.log({ speechRecognition });

  const stop = () =>
    speechRecognition?.abortListening().then((res) => {
      console.log({ res }, "stop");
    });

  return {
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    listening,
    transcript,
    start,
    stop,
    speechRecognition,
    resetTranscript,
  };
};
