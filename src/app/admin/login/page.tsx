"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // If already logged in, redirect
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace(next);
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [next, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined, password }),
      });
      if (res.ok) {
        router.replace(next);
      } else {
        const d = await res.json();
        setError(d.error ?? "Login failed");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-2">
            Ops by Noell
          </p>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Admin
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] border border-warm-border shadow-[0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-charcoal/70 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@opsbynoell.com"
                autoFocus
                autoComplete="email"
                className="w-full h-11 px-4 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50 text-charcoal placeholder:text-charcoal/35"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-charcoal/70 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full h-11 px-4 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50 text-charcoal placeholder:text-charcoal/35"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!password || loading}
              className="w-full h-11 rounded-xl bg-wine text-cream text-sm font-medium hover:bg-wine/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-charcoal/35 mt-6 font-mono">
          three agents · one inbox
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
