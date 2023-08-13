import { FC } from "react";
import { Logo } from "../logo";
import { TWithClassName } from "~/types/withClassName";

export const BouncyLoader: FC<TWithClassName> = ({ className = "" }) => {
  return (
    <div
      className={`${className} flex h-full w-full items-center justify-center bg-background`}
    >
      <Logo h={176} w={176} className="h-44 w-44 animate-bounce" />
    </div>
  );
};
