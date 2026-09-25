import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}