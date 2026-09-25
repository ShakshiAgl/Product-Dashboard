"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseListParams } from "@/lib/params";

export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = parseListParams(searchParams);

  function update(patch) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    router.push(`${pathname}?${next.toString()}`);
  }

  return { params, update };
}