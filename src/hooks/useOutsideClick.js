import { useEffect, useRef } from "react";

export function useOutsideClick(
  handler,
  ignoreRefs = [],
  listenCapturing = true
) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      const isIgnored = ignoreRefs.some(
        (ignoreRef) => ignoreRef.current && ignoreRef.current.contains(e.target)
      );

      if (ref.current && !ref.current.contains(e.target) && !isIgnored) {
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);
    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
    };
  }, [handler, listenCapturing, ignoreRefs]);

  return ref;
}
