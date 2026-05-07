"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconBolt } from "@tabler/icons-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const next = searchParams.get("next") ?? "/client/dashboard";

  useEffect(() => {
    fetch("/api/client/me")
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
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace(next);
      } else {
        const d = await res.json();
        setError(d.error ?? "Login failed. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f8f4f0] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4f0] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wine/10 mb-3">
            <IconBolt size={18} className="text-wine" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/70 mb-1">
            Ops by Noell
          </p>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Client Portal
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Sign in to view your agents and intelligence.
          </p>
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
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                placeholder="you@yourbusiness.com"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-warm-border bg-[#f8f4f0] text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine/50 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-[10px] bg-[linear-gradient(181deg,_#8B4D5E_18.12%,_#5A1F30_99.57%)] text-white text-sm font-medium shadow-[0px_4px_8px_0px_rgba(90,31,48,0.18)] hover:-translate-y-0.5 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-charcoal/50 mt-6">
          Need access?{" "}
          <a
            href="mailto:hello@opsbynoell.com"
            className="text-wine hover:underline"
          >
            Contact Ops by Noell
          </a>
        </p>
      </div>
    </div>
  );
}
