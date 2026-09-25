"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBox({ initialValue, onDebouncedChange, delayMs = 400 }) {
  const [text, setText] = useState(initialValue);
  const debounced = useDebounce(text, delayMs);
  const lastReported = useRef(initialValue); // what we last told the parent

  useEffect(() => {
    if (debounced === lastReported.current) return; // no real change — safe against double-invoke
    lastReported.current = debounced;
    onDebouncedChange(debounced);
  }, [debounced]);

  useEffect(() => {
    setText(initialValue);
    lastReported.current = initialValue;
  }, [initialValue]);

  return (
    <div className="relative w-full max-w-xs">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8171]">⌕</span>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products…"
        className="w-full rounded-lg border border-[#E7E1D3] bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-[#9C6B30]"
      />
    </div>
  );
}