import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="hero-gradient flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-[0_20px_60px_-25px_rgba(23,24,28,0.25)]">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Sign in</h1>
        <p className="mt-2 text-[15px] text-muted">Welcome back. Let&apos;s get you to your dashboard.</p>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-muted-soft">
          New to naano?{" "}
          <Link href="/register" className="font-medium text-accent">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
