import { type FC, useState } from "react";
import { BiMicrophone } from "react-icons/bi";
import { FaStop } from "react-icons/fa";

const delays = ["delay-0", "delay-75", "delay-100"];
interface IChatDictaphone {
  onClick: () => void;
  isRecording: boolean;
  disabled?: boolean;
}
export const ChatDictaphone = ({
  onClick,
  isRecording,
  disabled,
}: IChatDictaphone) => {
  const handleOnClick = () => {
    onClick();
  };

  const renderIcon = () => {
    if (isRecording) return <FaStop className="text-xl" />;
    return <BiMicrophone className="text-xl" />;
  };

  if (disabled) return <ChatDictaphoneDisabled />;
  return (
    <button
      className="relative flex min-h-[50px] min-w-[50px] items-center justify-center rounded-full bg-accent-secondary"
      onClick={(e) => {
        e.preventDefault();
        handleOnClick();
      }}
    >
      {isRecording &&
        delays.map((delay, i) => (
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

const ChatDictaphoneDisabled = () => (
  <button
    disabled
    className="relative flex min-h-[50px] min-w-[50px] cursor-not-allowed items-center justify-center rounded-full bg-gray-600"
  >
    <BiMicrophone className="text-xl" />
  </button>
);

ChatDictaphone.Disabled = ChatDictaphoneDisabled;
