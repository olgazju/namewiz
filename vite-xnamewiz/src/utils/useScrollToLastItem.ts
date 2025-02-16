import { useRef, useEffect, RefObject } from "react";

// Define generic type for items array
export const useScrollToLastItem = <T>(
  items: T[],
  shouldScroll: boolean = true
): RefObject<HTMLElement> => {
  const lastItemRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (items.length > 0 && lastItemRef.current && shouldScroll) {
      lastItemRef.current.scrollIntoView?.({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [items, shouldScroll]);

  return lastItemRef;
};
