export default function Rating({ value }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span aria-hidden>⭐</span>
      {value.toFixed(1)}
    </span>
  );
}