import { type FC, useState } from "react";
import { BiMicrophone } from "react-icons/bi";
import { FaStop } from "react-icons/fa";

const delays = ["delay-0", "delay-75", "delay-100"];
interface IChatDictaphone {
  onStart: () => void;
  onStop: () => void;
  isRecording: boolean;
}
export const ChatDictaphone: FC<IChatDictaphone> = ({
  onStart,
  onStop,
  isRecording,
}) => {
  const start = () => {
    onStart();
  };
  const stop = () => {
    onStop?.();
  };

  const handleOnClick = () => {
    console.log("test");
    if (!isRecording) {
      start();
    } else {
      stop();
    }
  };

  const renderIcon = () => {
    if (isRecording) return <FaStop className="text-xl" />;
    return <BiMicrophone className="text-xl" />;
  };
  return (
    <button
      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent-secondary"
      onClick={() => handleOnClick()}
    >
      {delays.map((delay, i) => (
        <div
          key={i}
          className={`absolute  -z-10 h-9 w-9 animate-bounce animate-ping  rounded-full bg-accent-secondary opacity-40 ${
            delay || ""
          }`}
        ></div>
      ))}
      {renderIcon()}
    </button>
  );
};
