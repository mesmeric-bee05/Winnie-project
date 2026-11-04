"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function friendly(message: string) {
  const value = message.toLowerCase();
  if (value.includes("rate limit") || value.includes("too many")) return "Too many requests were made. Wait a few minutes and try again.";
  if (value.includes("redirect")) return "The recovery redirect is not configured for this environment yet.";
  return "We could not complete the password reset request. Check the details and try again.";
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = z.string().trim().email("Enter a valid email address.").safeParse(email);
    if (!parsed.success) { setState("error"); setMessage(parsed.error.issues[0]?.message ?? "Enter a valid email address."); return; }
    setState("loading");
    try {
      const { error } = await createSupabaseBrowserClient().auth.resetPasswordForEmail(parsed.data, { redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password` });
      if (error) throw error;
      setState("success");
      setMessage("If an account exists for that email, a recovery link is on its way. Check your inbox and spam folder.");
    } catch (error) {
      setState("error");
      setMessage(friendly(error instanceof Error ? error.message : ""));
    }
  }

  return <form onSubmit={submit} className="card card-pad" style={{ maxWidth: 540, margin: "0 auto", display: "grid", gap: 15 }}><div style={{ display: "flex", gap: 10, alignItems: "center" }}><span className="brand-mark"><Mail size={17} /></span><div><span className="eyebrow">Account recovery</span><h2 style={{ fontSize: 32, marginTop: 7 }}>Reset your password.</h2></div></div><p className="muted" style={{ lineHeight: 1.55 }}>We will send a time-limited recovery link without revealing whether an account exists.</p><div className="field"><label htmlFor="recovery-email">Email address</label><input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div>{message && <div role={state === "error" ? "alert" : "status"} className={`pill ${state === "error" ? "pill-amber" : "pill-mint"}`} style={{ whiteSpace: "normal", lineHeight: 1.45 }}>{state === "success" && <CheckCircle2 size={14} />}{message}</div>}<button className="button button-primary" type="submit" disabled={state === "loading"}>{state === "loading" ? <Loader2 size={15} className="spin" /> : <Mail size={15} />}{state === "loading" ? "Sending…" : "Send recovery link"}</button><p className="muted" style={{ display: "flex", gap: 6, fontSize: 11, lineHeight: 1.45 }}><ShieldCheck size={14} /> Recovery links are single-use and expire according to Supabase Auth policy.</p></form>;
}

export function SetNewPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) { setState("error"); setMessage("Use at least 8 characters."); return; }
    if (password !== confirm) { setState("error"); setMessage("The passwords do not match."); return; }
    setState("loading");
    try {
      const { error } = await createSupabaseBrowserClient().auth.updateUser({ password });
      if (error) throw error;
      setState("success");
      setMessage("Your password has been updated. You can continue to your private dashboard.");
    } catch (error) {
      setState("error");
      setMessage(friendly(error instanceof Error ? error.message : ""));
    }
  }

  return <form onSubmit={submit} className="card card-pad" style={{ maxWidth: 540, margin: "0 auto", display: "grid", gap: 15 }}><div><span className="eyebrow">Recovery verified</span><h2 style={{ fontSize: 34, marginTop: 8 }}>Choose a new password.</h2></div><p className="muted" style={{ lineHeight: 1.55 }}>Use a unique password for Winnie. Your existing private evidence remains unchanged.</p><div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} autoComplete="new-password" required /></div><div className="field"><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} minLength={8} autoComplete="new-password" required /></div>{message && <div role={state === "error" ? "alert" : "status"} className={`pill ${state === "error" ? "pill-amber" : "pill-mint"}`} style={{ whiteSpace: "normal", lineHeight: 1.45 }}>{state === "success" && <CheckCircle2 size={14} />}{message}</div>}<button className="button button-primary" type="submit" disabled={state === "loading" || state === "success"}>{state === "loading" ? <Loader2 size={15} className="spin" /> : <ShieldCheck size={15} />}{state === "loading" ? "Updating…" : "Update password"}</button></form>;
}
