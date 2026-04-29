"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirmation) {
      setErr("Password confirmation does not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(email.trim(), password, passwordConfirmation);
      localStorage.setItem("krypt:token", res.token);
      localStorage.setItem("krypt:user", JSON.stringify(res.user));
      router.push("/watchlist");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-8">
      <section className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/90">
        <div className="mb-5 flex items-center gap-3">
          <Image
            src="/favicon.svg"
            alt="Krypt logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-md"
            priority
          />
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Create account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Start tracking your watchlist and portfolio.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900/60"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 chars)"
            autoComplete="new-password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900/60"
          />

          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900/60"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {err ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{err}</p>
        ) : null}

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
