"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Status =
  | { kind: "loading" }
  | { kind: "invalid"; message: string }
  | { kind: "ready"; email: string };

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({
        kind: "invalid",
        message: "This reset link is missing its token.",
      });
      return;
    }
    fetch(
      `/api/admin/reset-password?token=${encodeURIComponent(token)}`
    )
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (r.ok && typeof data.email === "string") {
          setStatus({ kind: "ready", email: data.email });
        } else {
          setStatus({
            kind: "invalid",
            message:
              typeof data.error === "string"
                ? data.error
                : "This reset link is invalid or has expired.",
          });
        }
      })
      .catch(() => {
        setStatus({
          kind: "invalid",
          message: "Could not verify the reset link. Try again later.",
        });
      });
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        router.replace("/admin/login?reset=1");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not reset password. Try again."
        );
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setSubmitting(false);
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
            Set new password
          </h1>
        </div>

        <div className="bg-white rounded-[20px] border border-warm-border shadow-[0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] p-8">
          {status.kind === "loading" && (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
            </div>
          )}

          {status.kind === "invalid" && (
            <div className="space-y-4 text-center">
              <p className="font-serif text-lg text-charcoal">Link unavailable</p>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                {status.message}
              </p>
              <Link
                href="/admin/forgot-password"
                className="inline-block text-sm text-wine hover:text-wine-dark underline underline-offset-2"
              >
                Request a new link
              </Link>
            </div>
          )}

          {status.kind === "ready" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Reset password for{" "}
                <span className="font-medium text-charcoal">
                  {status.email}
                </span>
              </p>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-charcoal/70 mb-1.5"
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoFocus
                  required
                  autoComplete="new-password"
                  className="w-full h-11 px-4 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50 text-charcoal placeholder:text-charcoal/65"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-xs font-medium text-charcoal/70 mb-1.5"
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
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
                disabled={!password || !confirm || submitting}
                className="w-full h-11 rounded-xl bg-wine text-cream text-sm font-medium hover:bg-wine/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Saving..." : "Save new password"}
              </button>
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

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
