"use client";

import { useState, useEffect, Suspense } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! You can now log in.");
    }
  }, [searchParams]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md border border-zinc-900 bg-zinc-950/80 rounded-xl p-8 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex h-8 w-8 rounded-lg bg-white items-center justify-center font-extrabold text-black text-base shadow-sm mb-2">
          F
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs text-zinc-400">
          Sign in to access your Job Search OS dashboard
        </p>
      </div>

      {/* Success notification */}
      {success && (
        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3 text-xs text-emerald-400 text-left">
          {success}
        </div>
      )}

      {/* Error box */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/50 rounded-lg p-3 text-xs text-rose-400 text-left">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
              Password
            </label>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-650 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center text-xs text-zinc-500 border-t border-zinc-900 pt-4">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-zinc-300 hover:text-white font-medium underline underline-offset-4 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col items-center justify-center p-4 select-none relative font-sans">
      {/* Background glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-lg h-[250px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-transparent to-transparent pointer-events-none -z-10" />

      <Suspense
        fallback={
          <div className="w-full max-w-md border border-zinc-900 bg-zinc-950/80 rounded-xl p-8 shadow-xl backdrop-blur-sm flex items-center justify-center min-h-[400px]">
            <svg className="animate-spin h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
