import React from "react";

interface LinearProgressBarProps {
  progress: number; // progress in percents
}

export const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  progress,
}) => {
  return (
    <div>
      <div className="h-0.5 w-full bg-transparent">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-accent-secondary"
        ></div>
      </div>
    </div>
  );
};
