import type { PropsWithChildren } from "react";

export const Panel = ({
  className = "",
  children,
}: { className?: string } & PropsWithChildren) => {
  const computedClassName = `rounded-md border-2 border-muted-default bg-canvas-subtle p-4 ${className}`;

  return <div className={computedClassName}>{children}</div>;
};
