/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { Container } from "~/components/containers";
import { Heading } from "~/components/typography";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { useState, useEffect } from "react";
import createSpeechServicesPonyfill from "web-speech-cognitive-services";

const SUBSCRIPTION_KEY = "22a8c6de3cfa44f0a9524f0c27a6b56e";
const REGION = "westeurope";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

export const Dictaphone = () => {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({});

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { SpeechRecognition: AzureSpeechRecognition } =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      createSpeechServicesPonyfill({
        credentials: {
          region: REGION,
          subscriptionKey: SUBSCRIPTION_KEY,
        },
      });
    SpeechRecognition.applyPolyfill(AzureSpeechRecognition);
  }, []);

  console.log({ interimTranscript, finalTranscript });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }
  if (!isMicrophoneAvailable) {
    // Render some fallback content
    return <span>Microphone not working.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <div className="flex gap-5">
        <Button
          onClick={() =>
            SpeechRecognition.startListening({
              continuous: true,
              interimResults: true,
              language: "en-US",
            })
              .then((res) => console.log({ res }))
              .catch((err) => alert("test"))
          }
        >
          Start
        </Button>
        <Button onClick={() => void SpeechRecognition.stopListening()}>
          Stop
        </Button>
        <Button onClick={resetTranscript}>Reset</Button>
      </div>
      <Message sender="USER" message={transcript} />
    </div>
  );
};
