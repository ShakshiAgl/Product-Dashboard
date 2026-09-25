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
      className="rounded border px-3 py-1.5 text-sm hover:bg-gray-100"
    >
      Logout
    </button>
  );
}