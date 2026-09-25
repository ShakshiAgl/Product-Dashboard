"use client";

import { useState } from "react";

export default function ImageGallery({ images, title }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-3">
      <img
        src={active}
        alt={title}
        className="h-72 w-full rounded-lg border object-contain bg-white"
      />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img) => (
            <button
              key={img}
              onClick={() => setActive(img)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border ${
                img === active ? "border-black" : "border-gray-200"
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