import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Container } from "~/components/containers";
import logoSrc from "assets/logo2.png";
import Image from "next/image";
import { getInterviewConfigFromParams } from "~/domain/mock-interview/consts";
import type { TInterviewConfig } from "~/domain/interview-creator/context/interview-creator.context";
import { PropsWithChildren } from "react";

type TSender = "ai" | "user";

const BUBBLE_VARIANTS: Record<TSender, string> = {
  ai: " text-accent-secondary border border-accent-secondary opacity-60",
  user: "bg-canvas-subtle text-muted-fg",
};

const ChatBubble = ({
  sender,
  message = "",
  isTyping = false,
}: {
  sender: "ai" | "user";
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

  const result = getInterviewConfigFromParams(
    params.toString()
  ) as TInterviewConfig;

  console.log(result);
  return (
    <div className="fixed inset-0 h-full w-full">
      <Container className="mx-auto h-screen">
        <div className="flex flex-col gap-5 p-5">
          <Message sender="ai" message="SDAdoaisdj iafpaug pid paifg afgn pi" />
          <Message
            sender="user"
            message="SDAdoaisdj iafpaug pid paifg afgn pi"
          />
        </div>
      </Container>
    </div>
  );
};

export default MockInterviewPage;
