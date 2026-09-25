import Rating from "./Rating";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {reviews.map((r, i) => (
        <li key={i} className="rounded border p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{r.reviewerName}</span>
            <Rating value={r.rating} />
          </div>
          <p className="mt-1 text-sm text-gray-600">{r.comment}</p>
          <p className="mt-1 text-xs text-gray-400">
            {new Date(r.date).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}