import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3">
        <span className="font-semibold">Product Admin</span>
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}