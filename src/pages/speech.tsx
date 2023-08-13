/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { Container } from "~/components/containers";
import { Heading } from "~/components/typography";

import dynamic from "next/dynamic";
import { ChatDictaphone } from "~/domain/mock-interview/components/chat-dictaphone";
import { api } from "~/utils/api";
import { Message } from "~/domain/mock-interview/components/chat";
import { useIsClient } from "~/hooks";
import { useDictaphone } from "~/components/dictaphone";

const Dictaphone = dynamic(
  () =>
    import("../components/dictaphone/dictaphone").then((mod) => mod.Dictaphone),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const Speech: NextPage = () => {
  const { isClient } = useIsClient();

  const { data: azureData, isLoading } = api.azure.getToken.useQuery();
  const {
    isMicrophoneAvailable,
    start,
    stop,
    listening,
    resetTranscript,
    transcript,
    browserSupportsSpeechRecognition,
  } = useDictaphone({
    authorizationToken: azureData?.token,
    region: azureData?.region,
  });
  if (isLoading) return <Heading>Token loading...</Heading>;
  if (!azureData) return <Heading>Couldnt fetch token</Heading>;

  if (!isClient) return null;
  return (
    <main>
      <Container className="py-10">
        <Heading className="mb-10">Speech</Heading>
        <Dictaphone
          region={azureData.region}
          authorizationToken={azureData.token}
          render={({ start, stop, listening, transcript }) => (
            <>
              <ChatDictaphone
                onClick={() => {
                  if (listening) {
                    void stop();
                    resetTranscript();
                  } else {
                    start({ continuous: true, language: "en-US" });
                  }
                }}
                isRecording={listening}
              />
              <Message sender="USER" message={transcript} />
            </>
          )}
        />
      </Container>
    </main>
  );
};

export default Speech;
