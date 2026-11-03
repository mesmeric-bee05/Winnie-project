import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return <main className="shell"><div className="container-narrow" style={{ padding: "78px 0 100px" }}><div className="breadcrumb"><Link href="/">Winnie</Link><span>/</span><span>Sign in</span></div><div style={{ margin: "38px 0 22px", textAlign: "center" }}><span className="eyebrow">Private workspace</span><h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", lineHeight: .95, marginTop: 12 }}>Your evidence, on your terms.</h1><p className="muted" style={{ maxWidth: 560, margin: "16px auto 0", lineHeight: 1.55 }}>The public demo stays open. Sign in when you are ready to save a real pathway and keep your work private.</p></div><AuthForm mode="sign-in" /></div></main>;
}
