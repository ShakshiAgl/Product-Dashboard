import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <header className="flex items-center justify-between border-b border-[#E7E1D3] bg-[#FAF8F3] px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#9C6B30]">Atelier</p>
          <p className="font-display text-lg text-[#211D17]">Product Admin</p>
        </div>
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}