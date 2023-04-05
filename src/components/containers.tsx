import { PropsWithChildren } from "react";

export const Container = ({
  children,
  tag: Wrapper = "div",
  className = "",
}: PropsWithChildren & {
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
}) => {
  const computedClassName = `px-5 lg:max-w-6xl w-full lg:px-0 mx-auto ${className}`;
  return <Wrapper className={computedClassName}> {children}</Wrapper>;
};
