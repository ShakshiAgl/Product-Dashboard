"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBox({ initialValue, onDebouncedChange, delayMs = 400 }) {
  const [text, setText] = useState(initialValue);
  const debounced = useDebounce(text, delayMs);

  // Fire the callback only when the debounced value actually settles.
  useEffect(() => {
    onDebouncedChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Keep the input in sync if the URL changes from elsewhere
  // (e.g. clearing the category also clears q, or browser back/forward).
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search products…"
      className="w-full max-w-xs rounded border px-3 py-2 text-sm"
    />
  );
}