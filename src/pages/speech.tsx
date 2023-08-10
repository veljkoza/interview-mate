/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { Container } from "~/components/containers";
import { Heading } from "~/components/typography";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "~/components/buttons";
import { Message } from "~/domain/mock-interview/components/chat";
import { ChatDictaphone } from "~/domain/mock-interview/components/chat-dictaphone";

const Dictaphone = dynamic(
  () =>
    import("../components/dictaphone/dictaphone").then((mod) => mod.Dictaphone),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

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
        <Dictaphone
          render={({ start, stop, reset, listening, transcript }) => (
            <ChatDictaphone />
            // <div>
            //   <p>Microphone: {listening ? "on" : "off"}</p>
            //   <div className="flex gap-5">
            //     <Button onClick={() => start()}>Start</Button>
            //     <Button onClick={() => stop()}>Stop</Button>
            //     <Button onClick={() => reset()}>Reset</Button>
            //   </div>
            //   <Message sender="USER" message={transcript} />
            // </div>
          )}
        />
      </Container>
    </main>
  );
};

export default Speech;
