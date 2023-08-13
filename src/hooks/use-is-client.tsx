import { useState, useEffect } from "react";

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the isClient state to true once the component is mounted
    setIsClient(true);
  }, []);

  return { isClient };
};
