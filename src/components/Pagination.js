export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Build a short window of page numbers around the current page,
  // e.g. current=5 → [3,4,5,6,7], clamped to [1, totalPages].
  const windowSize = 2;
  const start = Math.max(1, page - windowSize);
  const end = Math.min(totalPages, page + windowSize);
  const pageNumbers = [];
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
      <p className="text-sm text-gray-500">
        Showing {from}–{to} of {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {start > 1 && <span className="px-1 text-gray-400">…</span>}

        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`rounded border px-3 py-1 text-sm ${
              n === page ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}

        {end < totalPages && <span className="px-1 text-gray-400">…</span>}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="rounded border px-2 py-1 text-sm"
      >
        {[10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n} / page
          </option>
        ))}
      </select>
    </div>
  );
}