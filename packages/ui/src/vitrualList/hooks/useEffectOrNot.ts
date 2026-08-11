import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" &&
  window.document &&
  typeof window.document.createElement === "function"
    ? useLayoutEffect
    : useEffect;
