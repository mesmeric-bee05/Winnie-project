import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function MainNav() {
  return (
    <header className="topbar">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="Winnie home">
          <span className="brand-mark" aria-hidden="true"><span>W</span></span>
          <span>Winnie</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/#method">The method</Link>
          <Link href="/pathway">Pathways</Link>
          <Link href="/mentors">Mentors</Link>
          <Link href="/employer">For employers</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/dashboard" className="button button-secondary button-sm">Open demo</Link>
          <Link href="/onboarding" className="button button-primary button-sm">Start your pathway <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </header>
  );
}
