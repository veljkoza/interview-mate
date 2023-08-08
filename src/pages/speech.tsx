/* eslint-disable @typescript-eslint/no-misused-promises */
import { NextPage } from "next";
import { Container } from "~/components/containers";
import { Heading } from "~/components/typography";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { useState, useEffect } from "react";

const Dictaphone = () => {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

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
const Speech: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the isClient state to true once the component is mounted
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <main>
      <Container className="py-10">
        <Heading className="mb-10">Speech</Heading>
        <Dictaphone />
      </Container>
    </main>
  );
};

export default Speech;
