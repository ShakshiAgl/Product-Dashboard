export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-[#E7E1D3] bg-white py-16 text-center">
      <p className="text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-[#E7E1D3] px-4 py-1.5 text-sm hover:bg-[#F3E7D3]"
        >
          Retry
        </button>
      )}
    </div>
  );
}