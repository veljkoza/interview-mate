import { FC, ReactNode } from "react";
import { BackButton } from "./back-button";

interface PageHeader {
  backButton?: ReactNode;
  title?: ReactNode;
}

export const PageHeader: FC<PageHeader> = ({
  backButton = <BackButton />,
  title,
}) => {
  return (
    <div className="flex items-center gap-4">
      {backButton}
      {title}
    </div>
  );
};
