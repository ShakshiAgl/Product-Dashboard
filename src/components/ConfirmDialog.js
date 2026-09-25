export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirming }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded border px-4 py-1.5 text-sm hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="rounded bg-red-600 px-4 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}