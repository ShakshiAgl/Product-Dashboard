"use client";

import { useEffect, useState } from "react";

export function useDebounce(value, delayMs = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer); // cancel the pending update if value changes again
  }, [value, delayMs]);

  return debounced;
}