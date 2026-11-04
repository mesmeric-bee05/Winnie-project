# Supabase integration

The Winnie project uses the Supabase project named `Winnie` for the application domain schema. The database is in the `eu-central-1` region and the core migrations are applied.

## Implemented

- Core domain tables for profiles, organizations, memberships, roles, skills, pathways, milestones, tasks, assignments, submissions, reviews, portfolios, mentors, sessions, endorsements, employer views, notifications, consents and audit events.
- UUID identifiers, UTC timestamps, versioned pathways, JSON evidence fields and supporting indexes.
- Row Level Security enabled on every public table.
- Owner and consent-scoped policies for mentee data, portfolio evidence, endorsements and employer views.
- Auth user bootstrap trigger that creates a private profile.
- Privilege-escalation guard that prevents a user from changing `app_role`.
- Trigger-based audit logging for pathway and profile changes. There is no client-callable audit-writing RPC.
- Non-personal seed catalog for the first product-design pathway.
- Supabase browser/server client helpers, Next.js 16 proxy session refresh, auth routes and typed API boundaries.
- Improved sign-in/sign-up UX with fixed verification callback redirects, actionable error messages and verification-email resend.
- Private `portfolio-evidence` bucket metadata: 10 MiB limit and allow-listed MIME types.
- Authenticated signed-upload and signed-download preparation routes with path ownership checks.
- Bounded in-process mutation rate limiting as defense in depth. A distributed production limiter still requires Redis or an edge provider.
- CI lint, typecheck, tests, production build, Gitleaks, CodeQL and Dependabot configuration.

## Provider-owned setup still required

The current authorized MCP surface cannot change Supabase Auth SMTP, URL configuration or `storage.objects` ownership-level policies. The exact copy-paste steps are in [`docs/supabase-production-setup.md`](./supabase-production-setup.md) and [`docs/supabase-storage-setup.sql`](./supabase-storage-setup.sql).

The project owner must configure a verified production SMTP provider, narrow Site URL/redirect allow lists, run the Storage object policies, and test a real inbox. Do not accept real client files until the Storage policies, malware scanning and retention/deletion workflow are verified.

Payments, webhooks, KYC/KYB, tax, refunds, payouts and investor workflows remain intentionally deferred until providers, legal terms and approval are available.

Never commit the database connection string, service-role key or any other secret. Rotate the database password because it was exposed during setup, then replace the protected project secret after rotation.
