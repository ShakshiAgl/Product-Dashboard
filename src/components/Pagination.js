export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const windowSize = 2;
  const start = Math.max(1, page - windowSize);
  const end = Math.min(totalPages, page + windowSize);
  const pageNumbers = [];
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-[#E7E1D3] bg-white px-4 py-3 sm:flex-row">
      <p className="text-sm text-[#8B8171]">
        Showing <span className="text-[#211D17]">{from}–{to}</span> of {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-[#E7E1D3] px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {start > 1 && <span className="px-1 text-[#8B8171]">…</span>}

        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`rounded-lg border px-3 py-1 text-sm ${
              n === page ? "border-[#1C1917] bg-[#1C1917] text-white" : "border-[#E7E1D3] hover:bg-[#F3E7D3]"
            }`}
          >
            {n}
          </button>
        ))}

        {end < totalPages && <span className="px-1 text-[#8B8171]">…</span>}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-[#E7E1D3] px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="rounded-lg border border-[#E7E1D3] px-2 py-1.5 text-sm outline-none focus:border-[#9C6B30]"
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