# Winnie Career Development Platform

A secure, evidence-led career-development MVP for mentees, mentors, reviewers, employers and platform administrators.

## Current build

This repository contains the investor-presentable MVP experience and the first implementation foundation. It includes a premium public landing page, a responsive mentee dashboard, onboarding, pathway roadmap, practical task flow, portfolio evidence view, mentor surface, reviewer workspace, consented employer preview, admin foundation, route manifest, security headers, documentation, and demo-safe seeded data.

The current experience is intentionally in **demo mode**. It does not claim to provide production authentication, payments, scheduling, malware scanning, employer search, or investor workflows. Those capabilities are documented as the next secure implementation phase and must not be enabled without the client’s approved product, legal and infrastructure decisions.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Checks

```bash
pnpm typecheck
pnpm build
```

## Product principles

- Show observable progression rather than certificates alone.
- Keep private data private and employer visibility opt-in.
- Use practical evidence, structured feedback, and skill-linked endorsements.
- Use motion to explain progress, never to obstruct work.
- Treat every server mutation as an authenticated and authorized boundary before production launch.

## Next secure phase

Implement Manus OAuth with a validated `webdev_app_session`, a server-only data-access layer, managed database migrations, RLS-equivalent authorization policies, private storage with signed URLs, real consent records, mentor scheduling, audit events, and production CI/security verification. Payments, investor workflows and marketplace payouts remain explicitly deferred.
