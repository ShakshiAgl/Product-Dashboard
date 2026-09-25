export default function EmptyState({ message = "No products found." }) {
  return (
    <div className="rounded-xl border border-dashed border-[#E7E1D3] bg-white py-16 text-center text-[#8B8171]">
      {message}
    </div>
  );
}