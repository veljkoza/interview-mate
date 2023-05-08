import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Container } from "~/components/containers";
import logoSrc from "assets/logo2.png";
import Image from "next/image";
import { getInterviewConfigFromParams } from "~/domain/mock-interview/consts";
import type { TInterviewConfig } from "~/domain/interview-creator/context/interview-creator.context";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { HamburgerMenu } from "~/components/mobile-menu";
import { Button } from "~/components/buttons";
import { Heading } from "~/components/typography";
import { Panel } from "~/components/panel";
import { RiMenu4Fill } from "react-icons/ri";
import { BsSend } from "react-icons/bs";
import { count } from "console";
type TSender = "ai" | "user";

const BUBBLE_VARIANTS: Record<TSender, string> = {
  ai: " text-accent-secondary border border-accent-secondary opacity-60",
  user: "bg-canvas-subtle text-muted-fg border border-muted-fg",
};

const ChatBubble = ({
  sender,
  message = "",
  isTyping = false,
}: {
  sender: TSender;
  message?: string;
  isTyping?: boolean;
}) => {
  const classNames = `rounded-lg ${BUBBLE_VARIANTS[sender]} w-auto  p-3`;

  if (isTyping)
    return (
      <div className={`${classNames} animate-bounce`}>
        <p>...</p>
      </div>
    );
  return (
    <div className={classNames}>
      <p>{message}</p>
    </div>
  );
};

const ChatMessageContainer = ({
  children,
  sender,
}: PropsWithChildren & { sender: TSender }) => (
  <div
    className={`flex items-start gap-4 ${
      sender === "ai" ? "justify-start" : "justify-end"
    }`}
  >
    {children}
  </div>
);

const Message = ({
  sender,
  message,
  isGhost,
}: {
  sender: TSender;
  message?: string;
  isGhost?: boolean;
}) => {
  return (
    <ChatMessageContainer sender={sender}>
      {sender === "ai" && (
        <Image
          src={logoSrc}
          alt="Interview mate portrait photo"
          className="block h-14 w-14 object-contain"
          height={56}
          width={56}
        />
      )}
      <ChatBubble sender={sender} message={message} isTyping={isGhost} />
      {sender === "user" && (
        <Image
          src={logoSrc}
          alt="User's portrait photo"
          className="block h-14 w-14 object-contain"
          height={56}
          width={56}
        />
      )}
    </ChatMessageContainer>
  );
};

const MockInterviewPage: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  console.log(params);
  const result = getInterviewConfigFromParams(
    params.toString()
  ) as TInterviewConfig;

  console.log(result);

  const sendMessage = () => console.log("send message");

  const [messageText, setMessageText] = useState("");
  useEffect(() => {
    const to = setTimeout(() => setMessageText("Ovo je neki tekst"), 500);
    return () => clearTimeout(to);
  }, []);

  return (
    <div className="relative h-screen pt-24">
      <Container className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between py-8">
        <button className="ml-auto">
          <RiMenu4Fill className="ml-auto text-4xl text-accent-secondary " />
        </button>
      </Container>
      <Container className="relative mx-auto flex  h-full flex-col py-5">
        <div className="flex flex-col gap-5 p-5">
          <Message sender="ai" message={messageText} />
          <Message sender="user" message={messageText} />
        </div>
        <form
          onSubmit={() => sendMessage()}
          className="mt-auto flex w-full gap-5"
        >
          <Panel className="h-16 w-full p-0">
            <input
              className="h-full w-full bg-canvas-subtle px-5 py-2 text-muted-fg outline-none"
              placeholder="Type your message..."
            />
          </Panel>
          <button className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-secondary text-accent-secondary">
            <BsSend className="text-xl" />
          </button>
        </form>
      </Container>
    </div>
  );
};

export default MockInterviewPage;
