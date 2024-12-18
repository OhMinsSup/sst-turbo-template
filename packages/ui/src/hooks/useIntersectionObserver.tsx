import type { BasicTarget } from "../lib";
import { getTargetElement, useDeepCompareEffectWithTarget } from "../lib";
import { useLatest } from "./useLatest";

export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  target: BasicTarget,
  options: IntersectionObserverInit = {},
): void => {
  const callbackRef = useLatest(callback);

  useDeepCompareEffectWithTarget(
    () => {
      const element = getTargetElement(target);
      if (!element) {
        return;
      }
      const observer = new IntersectionObserver(callbackRef.current, options);
      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    },
    [options],
    target,
  );
};
