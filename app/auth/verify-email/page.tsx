import Link from "next/link";
import { MailCheck, ShieldCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return <main className="shell"><div className="container-narrow" style={{ padding: "120px 0" }}><div className="card card-pad" style={{ maxWidth: 650, margin: "0 auto", textAlign: "center" }}><MailCheck size={36} color="var(--teal)" style={{ margin: "0 auto" }} /><span className="eyebrow" style={{ display: "block", marginTop: 22 }}>Check your inbox</span><h1 style={{ fontSize: 48, lineHeight: .98, marginTop: 12 }}>One more step before the work begins.</h1><p className="muted" style={{ marginTop: 15, lineHeight: 1.55 }}>Verify your email address using the secure link we sent. Then return here to sign in.</p><Link href="/auth/sign-in" className="button button-primary" style={{ marginTop: 23 }}>Back to sign in</Link><p className="muted" style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20, fontSize: 11 }}><ShieldCheck size={13} /> No employer access is created by verification.</p></div></div></main>;
}
