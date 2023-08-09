/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { Container } from "~/components/containers";
import { Heading } from "~/components/typography";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Dictaphone = dynamic(
  () => import("../components/dictaphone").then((mod) => mod.Dictaphone),
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
        <Dictaphone />
      </Container>
    </main>
  );
};

export default Speech;
