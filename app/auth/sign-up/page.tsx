import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return <main className="shell"><div className="container-narrow" style={{ padding: "78px 0 100px" }}><div className="breadcrumb"><Link href="/">Winnie</Link><span>/</span><span>Create account</span></div><div style={{ margin: "38px 0 22px", textAlign: "center" }}><span className="eyebrow">A private start</span><h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", lineHeight: .95, marginTop: 12 }}>Build evidence you can stand behind.</h1><p className="muted" style={{ maxWidth: 560, margin: "16px auto 0", lineHeight: 1.55 }}>Create a private Winnie account. Your onboarding answers and draft work do not become employer-visible by default.</p></div><AuthForm mode="sign-up" /></div></main>;
}
