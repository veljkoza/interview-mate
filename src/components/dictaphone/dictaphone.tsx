/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { useDictaphone } from "./use-dictaphone";
import { useState, type FC, type ReactNode } from "react";

const SUBSCRIPTION_KEY = "22a8c6de3cfa44f0a9524f0c27a6b56e";
const REGION = "westeurope";

type RenderProps = ReturnType<typeof useDictaphone>;

interface IDictaphone {
  render: (props: RenderProps) => ReactNode;
  authorizationToken: string;
  region: string;
}

export const Dictaphone: FC<IDictaphone> = ({
  authorizationToken,
  region,
  render,
}) => {
  const {
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    transcript,
    start,
    stop,
    speechRecognition,
  } = useDictaphone({ authorizationToken, region });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }
  if (!isMicrophoneAvailable) {
    // Render some fallback content
    return <span>Microphone not working.</span>;
  }

  return (
    <>
      {render({
        start,
        stop,
        resetTranscript,
        listening,
        transcript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
        speechRecognition,
      })}
    </>
  );
};
