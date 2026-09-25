import Rating from "./Rating";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-[#8B8171]">No reviews yet.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {reviews.map((r, i) => (
        <div key={i} className="rounded-xl border border-[#E7E1D3] bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#211D17]">{r.reviewerName}</span>
            <Rating value={r.rating} />
          </div>
          <p className="mt-2 text-sm italic text-[#5C5548]">"{r.comment}"</p>
          <p className="mt-2 text-xs text-[#8B8171]">{new Date(r.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}