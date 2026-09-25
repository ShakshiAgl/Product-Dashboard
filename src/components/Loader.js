export default function Loader() {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E7E1D3] border-t-[#9C6B30]" />
    </div>
  );
}