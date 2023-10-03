import React, { useEffect, useState } from "react";

// Define the props type for the ProgressBar component
interface ProgressBarProps {
  shouldComplete?: boolean;
  stepPercentage?: number;
  intervalTime?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  shouldComplete = false,
  stepPercentage = 10,
  intervalTime = 1500,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If the shouldComplete prop is true, set progress to 100%
    if (shouldComplete) {
      setProgress(100);
      return;
    }

    // If progress is less than 100%, increase it every 3 seconds
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const min = stepPercentage - 2.5;
          const max = stepPercentage + 2.5;
          const randomPercentage =
            Math.floor(Math.random() * (max - min + 1)) + min;

          const actualStepPercentage = (randomPercentage / 100) * 100;

          return Math.min(
            prevProgress + (actualStepPercentage / 100) * 100,
            100
          );
        });
      }, intervalTime);

      // Clear the interval when the component is unmounted or when progress reaches 100%
      return () => clearInterval(interval);
    }
  }, [progress, shouldComplete]);

  return (
    <div className="w-full border border-accent-secondary">
      <div
        className="h-4 bg-accent-secondary transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
