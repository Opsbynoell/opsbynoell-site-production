"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/70 mb-2">
            Ops by Noell
          </p>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Reset password
          </h1>
        </div>

        <div className="bg-white rounded-[20px] border border-warm-border shadow-[0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] p-8">
          {submitted ? (
            <div className="space-y-4 text-center">
              <p className="font-serif text-lg text-charcoal">Check your inbox</p>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                If that email is registered, we&rsquo;ve sent a reset link.
                It expires in 1 hour.
              </p>
              <Link
                href="/admin/login"
                className="inline-block text-sm text-wine hover:text-wine-dark underline underline-offset-2"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Enter your email and we&rsquo;ll send you a link to reset your
                password.
              </p>

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
                  required
                  autoComplete="email"
                  className="w-full h-11 px-4 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50 text-charcoal placeholder:text-charcoal/65"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!email || loading}
                className="w-full h-11 rounded-xl bg-wine text-cream text-sm font-medium hover:bg-wine/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="text-xs text-charcoal/70 hover:text-charcoal underline underline-offset-2"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-charcoal/65 mt-6 font-mono">
          three agents &middot; one inbox
        </p>
      </div>
    </div>
  );
}
