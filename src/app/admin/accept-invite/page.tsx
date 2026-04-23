"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AcceptInviteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [loadError, setLoadError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoadError("This invite link is missing a token.");
      setChecking(false);
      return;
    }
    fetch(`/api/admin/accept-invite?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) {
          setLoadError(d.error ?? "This invite link is invalid.");
        } else {
          setEmail(d.email);
        }
      })
      .catch(() => setLoadError("Could not verify invite. Try again later."))
      .finally(() => setChecking(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (password.length < 8) {
      setSubmitError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setSubmitError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await res.json();
      if (!res.ok) {
        setSubmitError(d.error ?? "Could not set password.");
        return;
      }
      router.replace("/admin/login?invited=1");
    } catch {
      setSubmitError("Connection error. Try again.");
    } finally {
      setSubmitting(false);
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
        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-2">
            Ops by Noell
          </p>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Welcome aboard
          </h1>
        </div>

        <div className="bg-white rounded-[20px] border border-warm-border shadow-[0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] p-8">
          {loadError ? (
            <>
              <p className="text-sm text-charcoal/80 mb-4">{loadError}</p>
              <p className="text-xs text-charcoal/50">
                Ask your super admin to send a new invite.
              </p>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-charcoal/60 mb-2">
                Set your password for{" "}
                <span className="font-medium text-charcoal">{email}</span>
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
                  autoComplete="new-password"
                  className="w-full h-11 px-4 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50 text-charcoal placeholder:text-charcoal/35"
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
                  placeholder="Retype password"
                  autoComplete="new-password"
                  className="w-full h-11 px-4 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50 text-charcoal placeholder:text-charcoal/35"
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={!password || !confirm || submitting}
                className="w-full h-11 rounded-xl bg-wine text-cream text-sm font-medium hover:bg-wine/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Saving…" : "Set password"}
              </button>

              <p className="text-[10px] text-charcoal/40 text-center pt-1">
                This invite link expires 48 hours after it was sent.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-charcoal/35 mt-6 font-mono">
          three agents · one inbox
        </p>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
