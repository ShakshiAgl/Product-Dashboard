export default function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#211D17]">
      <span className="text-xs uppercase tracking-wide text-[#8B8171]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[#E7E1D3] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#9C6B30]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}