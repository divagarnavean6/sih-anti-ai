import { useState, useEffect } from 'react';
export const useDelayedRender = delay => {
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setFinished(true), delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);
  return finished;
};