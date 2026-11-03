import Link from "next/link";
import { BarChart3, BriefcaseBusiness, ClipboardCheck, FolderKanban, LayoutDashboard, Settings2, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/pathway", label: "My pathway", icon: BarChart3 },
  { href: "/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/mentors", label: "Mentors", icon: UsersRound },
  { href: "/review", label: "Review work", icon: ClipboardCheck },
  { href: "/employer", label: "Employer view", icon: BriefcaseBusiness },
];

export function PortalShell({ children, active = "/dashboard" }: { children: React.ReactNode; active?: string }) {
  return (
    <main className="portal-shell">
      <div className="portal-grid">
        <aside className="sidebar" aria-label="Portal navigation">
          <div className="side-label">Your workspace</div>
          <nav className="side-nav">
            {links.map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href} className={active === href ? "active" : ""}>
                <Icon size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="side-label" style={{ marginTop: 26 }}>Account</div>
          <nav className="side-nav">
            <Link href="/onboarding"><Sparkles size={16} strokeWidth={1.8} /><span>Revisit onboarding</span></Link>
            <Link href="/admin"><ShieldCheck size={16} strokeWidth={1.8} /><span>Admin preview</span></Link>
            <Link href="/"><Settings2 size={16} strokeWidth={1.8} /><span>Back to home</span></Link>
          </nav>
        </aside>
        <section className="portal-main">{children}</section>
      </div>
    </main>
  );
}

export function Avatar({ initials, tone = "ink" }: { initials: string; tone?: "ink" | "mint" | "amber" }) {
  const style = tone === "mint" ? { background: "var(--mint)", color: "var(--teal-deep)" } : tone === "amber" ? { background: "var(--amber-soft)", color: "#95621e" } : undefined;
  return <div className="avatar" style={style}>{initials}</div>;
}
