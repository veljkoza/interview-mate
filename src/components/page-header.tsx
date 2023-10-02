import { FC, ReactNode } from "react";

interface PageHeader {
  backButton?: ReactNode;
  title?: ReactNode;
}

export const PageHeader: FC<PageHeader> = ({ backButton, title }) => {
  return (
    <div className="flex items-center gap-4">
      {backButton}
      {title}
    </div>
  );
};
