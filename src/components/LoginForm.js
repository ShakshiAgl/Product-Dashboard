"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/auth.service";
import { tokenStore } from "@/lib/token";
import { ApiError } from "@/lib/axios";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return;
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await login(username.trim(), password);
      tokenStore.set(res.accessToken);
      const next = searchParams.get("next");
      const safe = next && next.startsWith("/") && !next.startsWith("//");
      router.replace(safe ? next : "/products");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-5 rounded-2xl border border-[#E7E1D3] bg-white p-8 shadow-sm"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9C6B30]">Atelier</p>
        <h1 className="font-display text-2xl text-[#211D17]">Admin Login</h1>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="username" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#8B8171]">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#8B8171]">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#1C1917] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#2A2521] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}