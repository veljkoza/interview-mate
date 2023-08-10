/* eslint-disable @typescript-eslint/no-misused-promises */
import SpeechRecognition from "react-speech-recognition";
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { useDictaphone } from "./use-dictaphone";
import { type FC, type ReactNode } from "react";

const SUBSCRIPTION_KEY = "22a8c6de3cfa44f0a9524f0c27a6b56e";
const REGION = "westeurope";

type StartListeningParams = Parameters<
  typeof SpeechRecognition.startListening
>["0"];

type RenderProps = {
  start: (params?: StartListeningParams) => void;
  stop: () => void;
  reset: () => void;
  listening: boolean;
  transcript: string;
};

interface IDictaphone {
  render: (props: RenderProps) => ReactNode;
}

export const Dictaphone: FC<IDictaphone> = ({ render }) => {
  const {
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    transcript,
  } = useDictaphone({ subscriptionKey: SUBSCRIPTION_KEY, region: REGION });

  const start = (params?: StartListeningParams) => {
    SpeechRecognition.startListening(params)
      .then((res) => console.log({ res }))
      .catch((err) => alert("test"));
  };

  const stop = () => SpeechRecognition.stopListening();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }
  if (!isMicrophoneAvailable) {
    // Render some fallback content
    return <span>Microphone not working.</span>;
  }

  return (
    <>
      {render({ start, stop, reset: resetTranscript, listening, transcript })}
    </>
  );
};
