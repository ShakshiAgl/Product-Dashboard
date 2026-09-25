export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <p className="text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded border px-4 py-1.5 text-sm hover:bg-gray-100"
        >
          Retry
        </button>
      )}
    </div>
  );
}