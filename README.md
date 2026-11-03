# Winnie Career Development Platform

Winnie is an evidence-led career-development platform for mentees, mentors, reviewers, employers and platform administrators. The product direction is based on the approved implementation blueprint: help a person move from a current state to a target role through practical work, milestones, structured feedback, portfolio evidence and consent-scoped progression sharing.

## What is implemented

The repository contains the polished MVP experience and the first real application foundation. The public product page, responsive mentee dashboard, onboarding flow, pathway roadmap, portfolio evidence view, mentor surface, reviewer workspace, consented employer preview and admin foundation are implemented with the premium editorial/data-workspace design system from the blueprint.

The Supabase `Winnie` project is connected through SSR and browser clients. Its first migrations create profiles, roles, skills, pathways, milestones, tasks, task assignments, submissions, reviews, portfolios, mentors, mentor sessions, endorsements, employer views, notifications, consents and audit events. Every public table has Row Level Security enabled. The Auth bootstrap trigger creates a private profile for a new user, and a database trigger prevents a user from changing their own application role. Auth routes, session refresh middleware, profile/pathway/onboarding APIs, Zod validation and an auditable mutation RPC are included.

The remaining portal pages still preserve the investor-facing demo content where the full production workflow requires additional approved product decisions, storage, scheduling and reviewer administration. The demo is clearly labeled and does not expose personal records or fabricate production activity.

## Run locally

```bash
pnpm install
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.
pnpm dev
```

Open `http://localhost:3000`. The server-only database connection is managed through protected project configuration and is never read by browser code or committed to source.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Supabase migrations

SQL migrations are stored under `supabase/migrations/` and are applied to the `Winnie` Supabase project through the authorized Supabase migration workflow. The seeded records are non-personal catalog data: one product-design role, three skills, one active pathway, four milestones and three practical tasks.

Never commit a PostgreSQL connection string, Supabase service-role key or other credential. The database password used during setup was exposed in the request and must be rotated immediately; after rotation, replace the protected `WINNIE_SUPABASE_DATABASE_URL` project secret. Supabase Auth email settings, redirect URLs and email templates must be configured before onboarding is used with real participants.

## Product and security boundaries

Winnie keeps private data private and employer visibility opt-in. Server mutations derive identity from Supabase Auth rather than accepting a browser-supplied user ID. RLS policies scope mentee data to its owner or an active consent record. The project uses structured evidence and human feedback; it does not make automated hiring decisions.

Before production launch, add private storage buckets, file signature/MIME validation, malware scanning, signed URLs, retention and deletion policies, organization-level reviewer authorization, platform-admin policies, rate limiting, dependency and secret scanning, CodeQL, staging verification, consent/legal review, scheduling controls and an incident-response exercise. Payments, investor workflows, marketplace payouts, KYC/KYB and tax workflows remain deferred until explicitly approved.

## Project structure

- `app/` — Next.js App Router pages and API routes.
- `components/` — shared navigation, portal shell, auth and interactive controls.
- `lib/supabase/` — browser/server client helpers and preview-safe session cookies.
- `lib/data/` — server-only session/profile helpers.
- `supabase/migrations/` — versioned PostgreSQL schema, RLS and security functions.
- `docs/` — product requirements, threat model, data map, incident response and integration notes.
- `tests/` — domain-level tests for the progression model.
