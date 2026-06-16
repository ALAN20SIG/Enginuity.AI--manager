import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import logo from "@/assets/enginuity-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Enginuity AI" },
      { name: "description", content: "Sign in to your Enginuity AI workspace." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to verify.");
        setMode("signin");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset email sent.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(16,185,129,0.15), transparent 60%), radial-gradient(ellipse at bottom right, rgba(245,158,11,0.08), transparent 60%)",
        }}
      />
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <img src={logo} alt="Enginuity AI" width={28} height={28} className="rounded" />
          <span className="font-display font-bold tracking-tight text-lg">ENGINUITY</span>
        </div>
        <div className="bg-card ring-1 ring-border rounded-xl p-6">
          <h1 className="text-xl font-display font-bold mb-1">
            {mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signup"
              ? "Spin up your engineering control plane in seconds."
              : mode === "forgot"
                ? "We'll email a recovery link."
                : "Sign in to your engineering control plane."}
          </p>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            {mode !== "forgot" && (
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Working…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
            </button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-4 flex items-center gap-3 text-[10px] font-mono uppercase text-muted-foreground">
                <div className="h-px bg-border flex-1" />
                or
                <div className="h-px bg-border flex-1" />
              </div>
              <button
                onClick={onGoogle}
                disabled={loading}
                className="w-full border border-border rounded-md py-2 text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.5 29.4 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.8 15 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.5 29.4 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.1z"/><path fill="#4CAF50" d="M24 43.5c5.3 0 10.1-2 13.7-5.3l-6.3-5.3c-2 1.4-4.6 2.2-7.4 2.2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 38.6 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.3 5.3c-.4.4 6.7-4.9 6.7-15 0-1.2-.1-2.4-.4-3.5z"/></svg>
                Continue with Google
              </button>
            </>
          )}

          <div className="mt-6 text-center text-xs text-muted-foreground space-x-2">
            {mode === "signin" && (
              <>
                <button onClick={() => setMode("signup")} className="hover:text-foreground">Create account</button>
                <span>·</span>
                <button onClick={() => setMode("forgot")} className="hover:text-foreground">Forgot password</button>
              </>
            )}
            {mode === "signup" && (
              <button onClick={() => setMode("signin")} className="hover:text-foreground">Already have an account? Sign in</button>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("signin")} className="hover:text-foreground">Back to sign in</button>
            )}
          </div>
        </div>
        <p className="mt-6 text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Enginuity AI · Engineering control plane
        </p>
        <Link to="/" className="block mt-3 text-center text-xs text-muted-foreground hover:text-foreground">← Back home</Link>
      </div>
    </div>
  );
}