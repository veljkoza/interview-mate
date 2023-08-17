import { SENDER } from "@prisma/client";
import { PropsWithChildren } from "react";
import logoSrc from "assets/logo2.png";
import Image, { StaticImageData } from "next/image";
const BUBBLE_VARIANTS: Record<SENDER, string> = {
  INTERVIEWER:
    " text-accent-secondary border border-accent-secondary opacity-60",
  USER: "bg-canvas-subtle text-muted-fg border border-muted-fg",
};

export const ChatBubble = ({
  sender,
  message = "",
  isTyping = false,
}: {
  sender: SENDER;
  message?: string;
  isTyping?: boolean;
}) => {
  const classNames = `rounded-lg text-sm md:text-base ${BUBBLE_VARIANTS[sender]} w-auto  p-3`;

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

export const ChatMessageContainer = ({
  children,
  sender,
}: PropsWithChildren & { sender: SENDER }) => (
  <div
    className={`flex items-start gap-4 ${
      sender === "INTERVIEWER" ? "justify-start" : "justify-end"
    }`}
  >
    {children}
  </div>
);

export const Message = ({
  sender,
  message,
  isGhost,
  avatar = logoSrc as unknown as string,
}: {
  sender: SENDER;
  message?: string;
  isGhost?: boolean;
  avatar?: string;
}) => {
  return (
    <ChatMessageContainer sender={sender}>
      {sender === "INTERVIEWER" && (
        <Image
          src={logoSrc}
          alt="Interview mate portrait photo"
          className="block h-10 w-10 rounded-full object-cover md:h-14 md:w-14"
          height={56}
          width={56}
        />
      )}
      <ChatBubble sender={sender} message={message} isTyping={isGhost} />
      {sender === "USER" && (
        <Image
          src={avatar}
          alt="User's portrait photo"
          className="block h-10 w-10 rounded-full object-contain md:h-14 md:w-14"
          height={56}
          width={56}
        />
      )}
    </ChatMessageContainer>
  );
};
