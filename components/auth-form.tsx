"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  displayName: z.string().trim().min(2, "Enter your name.").max(80, "Keep your name under 80 characters.").optional(),
});

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage("");
    const parsed = credentialsSchema.safeParse({ email, password, displayName: mode === "sign-up" ? displayName : undefined });
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }

    setStatus("loading");
    try {
      const supabase = createSupabaseBrowserClient();
      const result = mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password })
        : await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { display_name: parsed.data.displayName } } });
      if (result.error) throw result.error;
      if (mode === "sign-up" && !result.data.session) {
        setStatus("success");
        setMessage("Account created. Check your email to verify the address, then sign in.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("We could not complete that request. Check your details and try again.");
    }
  }

  return <div className="card card-pad" style={{ maxWidth: 540, margin: "0 auto" }}>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span className="brand-mark"><span>W</span></span><div><span className="eyebrow">{mode === "sign-in" ? "Return to your pathway" : "Create your account"}</span><h2 style={{ fontSize: 32, marginTop: 7 }}>{mode === "sign-in" ? "Continue the work." : "Make progress observable."}</h2></div></div>
    <p className="muted" style={{ marginTop: 15, lineHeight: 1.55, fontSize: 14 }}>{mode === "sign-in" ? "Sign in to access your private pathway, evidence and consent controls." : "Create a private account for your pathway, practical work and human feedback."}</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 15, marginTop: 24 }}>
      {mode === "sign-up" && <div className="field"><label htmlFor="displayName">Your name</label><input id="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" required /></div>}
      <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={8} required /><span className="helper">At least 8 characters. Use a unique password for this service.</span></div>
      {message && <div role="status" className={`pill ${status === "error" ? "pill-amber" : "pill-mint"}`} style={{ lineHeight: 1.45, whiteSpace: "normal" }}>{status === "success" ? <CheckCircle2 size={14} /> : null}{message}</div>}
      <button className="button button-primary" type="submit" disabled={status === "loading"}>{status === "loading" ? <Loader2 size={15} className="spin" /> : <ArrowRight size={15} />}{status === "loading" ? "Working…" : mode === "sign-in" ? "Sign in" : "Create account"}</button>
    </form>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 19, paddingTop: 17, borderTop: "1px solid var(--line)", fontSize: 12 }}><span className="muted">{mode === "sign-in" ? "New to Winnie?" : "Already have an account?"}</span><Link href={mode === "sign-in" ? "/auth/sign-up" : "/auth/sign-in"} style={{ color: "var(--teal)", fontWeight: 900 }}>{mode === "sign-in" ? "Create account" : "Sign in"}</Link></div>
    <p className="muted" style={{ display: "flex", gap: 6, alignItems: "flex-start", marginTop: 18, fontSize: 11, lineHeight: 1.45 }}><ShieldCheck size={14} /> Your account is private by default. Employer visibility requires a separate, revocable consent record.</p>
  </div>;
}
