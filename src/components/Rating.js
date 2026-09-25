export default function Rating({ value }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-[#211D17]">
      <span className="text-[#C99A3D]" aria-hidden>★</span>
      {value.toFixed(1)}
    </span>
  );
}