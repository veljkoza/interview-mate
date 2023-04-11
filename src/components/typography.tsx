import type { PropsWithChildren } from "react";

const VARIANTS = {
  primary: "text-white",
  secondary: "text-accent-secondary",
  muted: "text-muted-fg",
};

const SIZES = {
  1: "text-3xl lg:text-6xl",
  2: "text-2xl lg:text-5xl",
  3: "text-xl lg:text-4xl",
  4: "text-lg lg:text-2xl",
};

export const Heading = ({
  is = "h1",
  size = 1,
  children,
  className = "",
  variant = "primary",
}: {
  is?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  size?: keyof typeof SIZES;
  variant?: keyof typeof VARIANTS;
  className?: string;
} & PropsWithChildren) => {
  const Wrapper = is;
  return (
    <Wrapper
      className={`leading-normal   ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Wrapper>
  );
};
