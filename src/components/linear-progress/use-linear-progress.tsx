import { useState, useRef } from "react";

interface UseLinearProgressProps {
  duration: number; // duration in seconds
  onExpired?: () => void;
}

export const useLinearProgress = ({
  duration,
  onExpired,
}: UseLinearProgressProps) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const incrementValue = 100 / (duration * 60); // for smoother progress

    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onExpired?.();
          return 100;
        }
        return prevProgress + incrementValue;
      });
    }, 1000 / 60); // 60 times a second for smoother progress
  };

  const resetProgress = () => {
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return {
    progress,
    startProgress,
    resetProgress,
  };
};
