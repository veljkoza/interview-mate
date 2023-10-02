import { FC } from "react";

interface Separator {
  className?: string;
}

export const Separator: FC<Separator> = ({ className = "h-4" }) => (
  <div className={className} />
);
