# Supabase integration

The Winnie project now uses the Supabase project named `Winnie` for the application domain schema. The database is in the `eu-central-1` region and the initial schema migration is applied.

## Implemented

- Core domain tables for profiles, organizations, memberships, roles, skills, pathways, milestones, tasks, assignments, submissions, reviews, portfolios, mentors, sessions, endorsements, employer views, notifications, consents and audit events.
- UUID identifiers, UTC timestamps, versioned pathways, JSON evidence fields and supporting indexes.
- Row Level Security enabled on every public table.
- Owner and consent-scoped policies for mentee data, portfolio evidence, endorsements and employer views.
- Auth user bootstrap trigger that creates a private profile.
- Privilege-escalation guard that prevents a user from changing `app_role`.
- Auditable `record_audit_event` RPC for authenticated mutations.
- Non-personal seed catalog for the first product-design pathway.
- Supabase browser/server client helpers, session refresh middleware, auth routes and typed API boundaries.

## Required before production launch

The production environment must configure the Supabase Auth email provider, redirect URLs, email templates and rate limits. Storage buckets and malware scanning are still required before accepting portfolio files. A platform-admin policy layer and organization-level reviewer authorization must be added before enabling mentor, employer or admin mutations. Payments, webhooks, KYC/KYB, tax, refunds and payouts remain intentionally deferred.

Never commit the database connection string, service-role key or any other secret. Rotate the database password because it was exposed during setup, then replace the protected project secret after rotation.
