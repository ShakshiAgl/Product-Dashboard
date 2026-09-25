"use client";

import { useState } from "react";

export default function ImageGallery({ images, title }) {
  const safeImages = images && images.length > 0 ? images : ["https://cdn.dummyjson.com/product-images/placeholder.jpg"];
  const [active, setActive] = useState(safeImages[0]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-[#E7E1D3] bg-white">
        <img src={active} alt={title} className="h-80 w-full object-contain p-4" />
      </div>
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {safeImages.map((img) => (
            <button
              key={img}
              onClick={() => setActive(img)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border ${
                img === active ? "border-[#9C6B30]" : "border-[#E7E1D3]"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}