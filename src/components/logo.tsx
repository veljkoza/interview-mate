import logoSrc from "assets/logo2.png";
import Image from "next/image";
import type { TWithClassName } from "~/types/withClassName";

export const Logo = ({
  h = 64,
  w = 64,
  className,
}: { h?: number; w?: number } & TWithClassName) => {
  return (
    <Image
      src={logoSrc}
      height={h}
      width={w}
      className={className}
      alt="Interview mate logo"
    />
  );
};
