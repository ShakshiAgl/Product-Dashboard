"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/services/product.service";

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let ignore = false;
    getCategories()
      .then((data) => {
        if (!ignore) setCategories(data);
      })
      .catch(() => {
        // Categories failing to load shouldn't block the whole page;
        // the dropdown just falls back to "All categories" only.
        if (!ignore) setCategories([]);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return categories;
}