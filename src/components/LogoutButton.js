"use client";

import { useRouter } from "next/navigation";
import { tokenStore } from "@/lib/token";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    tokenStore.clear();
    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-[#E7E1D3] bg-white px-4 py-1.5 text-sm text-[#211D17] transition hover:bg-[#F3E7D3]"
    >
      Logout
    </button>
  );
}