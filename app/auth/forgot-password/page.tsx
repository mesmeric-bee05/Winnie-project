import Link from "next/link";
import { ForgotPasswordForm } from "@/components/password-reset-form";

export default function ForgotPasswordPage() {
  return <main className="shell"><div className="container-narrow" style={{ padding: "78px 0 100px" }}><div className="breadcrumb"><Link href="/">Winnie</Link><span>/</span><span>Account recovery</span></div><div style={{ margin: "38px 0 22px", textAlign: "center" }}><span className="eyebrow">A safer way back in</span><h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", lineHeight: .95, marginTop: 12 }}>Recover your private workspace.</h1><p className="muted" style={{ maxWidth: 560, margin: "16px auto 0", lineHeight: 1.55 }}>Request a single-use link and choose a new password without exposing account existence.</p></div><ForgotPasswordForm /></div></main>;
}
