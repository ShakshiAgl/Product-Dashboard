export default function Loader() {
  return (
    <div className="flex justify-center py-10" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
    </div>
  );
}