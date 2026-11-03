import { ArrowLeft, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { OnboardingWizard } from "@/components/demo-interactions";

export default function OnboardingPage() {
  return <main className="shell"><div className="container-narrow"><div className="page-hero"><div className="breadcrumb"><Link href="/">Winnie</Link><span>/</span><span>Onboarding</span></div><div style={{ marginTop: 32 }}><span className="eyebrow">A useful beginning</span><h1>Start with the gap, not the title.</h1><p>This short conversation shapes a first pathway around where you are, what you can already show, and the outcome you want next.</p></div></div><OnboardingWizard /><div style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "18px 0 70px", color: "var(--muted)", fontSize: 12 }}><span><ShieldCheck size={14} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Private by default</span><span><Compass size={14} style={{ verticalAlign: "-3px", marginRight: 6 }} /> No permanent labels</span><span><ArrowLeft size={14} style={{ verticalAlign: "-3px", marginRight: 6 }} /><Link href="/" style={{ color: "var(--teal)", fontWeight: 800 }}>Back to home</Link></span></div></div></main>;
}
