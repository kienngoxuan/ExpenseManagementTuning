import { useEffect, useRef } from "react";

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);

  useEffect(() => {
    const startTime = performance.now();
    renderCount.current += 1;

    return () => {
      const endTime = performance.now();
      renderTimes.current.push(endTime - startTime);

      // Log performance every 10 renders
      if (renderCount.current % 10 === 0) {
        console.group(`Performance: ${componentName}`);
        console.log("Render Count:", renderCount.current);
        console.log(
          "Average Render Time:",
          renderTimes.current.reduce((a, b) => a + b, 0) /
            renderTimes.current.length
        );
        console.groupEnd();
      }
    };
  });

  return {
    renderCount: renderCount.current,
  };
};
