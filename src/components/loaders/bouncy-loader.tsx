import { FC, ReactNode, useEffect, useState } from "react";
import { Logo } from "../logo";
import { TWithClassName } from "~/types/withClassName";

const loadingMessages: string[] = [
  "This might take a while...",
  "This might take a while...",
  "Summoning the interview spirits...",
  "Adjusting the AI's tie for the interview...",
  "Brewing a cup of virtual coffee for your session...",
  "Finding the friendliest AI interviewer in the digital realm...",
  "Charging the AI's humor circuits for some light-hearted banter...",
  "Teaching the AI the art of the perfect handshake...",
  "Making sure the AI hasn't binge-watched any interview horror stories...",
  "Tuning the AI's empathy module for those nervous moments...",
  "Reminding the AI that 'break a leg' is just an expression...",
  "Ensuring the AI's virtual chair is comfy for your sit-down...",
  "Brewing the perfect blend of questions and answers...",
  "Making sure the virtual microphone is on and ready...",
  "Dusting off the digital interview desk...",
  "Ensuring there's no spinach in anyone's teeth...",
];

export const BouncyLoader = ({
  className = "",
  messages,
  progressBar,
}: {
  className?: string;
  messages?: string[];
  progressBar?: ReactNode;
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (!messages) return;
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => (prevMessage + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [messages?.length]);
  return (
    <div
      className={`${className} flex h-full w-full flex-col items-center justify-center bg-background`}
    >
      <Logo h={176} w={176} className="h-44 w-44 animate-bounce" />

      <div className="relative mt-5 w-2/3 text-center text-xl text-accent-secondary  md:w-1/2">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`absolute bottom-0 left-0 right-0 top-0  m-auto text-center transition-all duration-1000 ${
              index === currentMessage
                ? "translate-y-0 transform opacity-100"
                : "-translate-y-4 transform opacity-0"
            }`}
          >
            {message}
          </div>
        ))}
      </div>
      {progressBar}
    </div>
  );
};

BouncyLoader.questionsLoadingMessages = loadingMessages;
