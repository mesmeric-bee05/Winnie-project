import Link from "next/link";
import { SetNewPasswordForm } from "@/components/password-reset-form";

export default function ResetPasswordPage() {
  return <main className="shell"><div className="container-narrow" style={{ padding: "78px 0 100px" }}><div className="breadcrumb"><Link href="/">Winnie</Link><span>/</span><span>Set new password</span></div><div style={{ margin: "38px 0 22px", textAlign: "center" }}><span className="eyebrow">Private account recovery</span><h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", lineHeight: .95, marginTop: 12 }}>Choose your way back in.</h1><p className="muted" style={{ maxWidth: 560, margin: "16px auto 0", lineHeight: 1.55 }}>Your recovery link is time-limited. Set a new password and return to your private workspace.</p></div><SetNewPasswordForm /></div></main>;
}
