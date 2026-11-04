import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PortalShell } from "@/components/portal-shell";

export function AccessDenied({ active, title, detail }: { active: string; title: string; detail: string }) {
  return <PortalShell active={active}><section className="card card-pad" style={{ maxWidth: 720, margin: "70px auto" }}><span className="pill pill-amber"><LockKeyhole size={13} /> Access controlled</span><h1 style={{ fontSize: 42, marginTop: 18 }}>{title}</h1><p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>{detail}</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}><Link className="button button-primary" href="/auth/sign-in">Sign in</Link><Link className="button button-secondary" href="/dashboard">Back to dashboard</Link></div></section></PortalShell>;
}
