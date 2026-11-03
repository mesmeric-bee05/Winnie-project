import Link from "next/link";

export default function NotFound() {
  return <main className="shell"><div className="container-narrow" style={{ padding: "120px 0" }}><span className="eyebrow">404 · This path is not mapped</span><h1 style={{ fontSize: "clamp(48px, 7vw, 82px)", lineHeight: .95, marginTop: 16 }}>Keep the next step clear.</h1><p className="hero-copy" style={{ marginTop: 20 }}>That page is not part of the current Winnie pathway. Return to the overview and continue from there.</p><Link href="/" className="button button-primary" style={{ marginTop: 28 }}>Back to home</Link></div></main>;
}
