import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
const VARIANTS = {
  mini: "px-7 py-2.5",
  default: "px-14 py-5",
};
export const Button = ({
  className = "",
  variant = "default",
  href,
  ...props
}: {
  variant?: "default" | "mini";
  href?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const computedClassName = `block rounded-sm bg-accent-secondary ${VARIANTS[variant]} text-background hover:bg-opacity-80 ${className}`;
  if (href)
    return (
      <Link href={href} className={computedClassName}>
        {props.children}
      </Link>
    );
  return (
    <button {...props} className={computedClassName}>
      {props.children}
    </button>
  );
};
