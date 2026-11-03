# Winnie MVP outcomes

## Public product narrative
- [x] A premium landing page explains the career-development gap, practical evidence model, guided pathway, mentors, endorsements, and employer relevance.
- [x] The page uses responsive layouts, accessible focus states, reduced-motion support, and a bounded 3D-inspired progression visual.

## Mentee dashboard loop
- [x] A mentee can see a target role, current progress, next action, milestone state, evidence gaps, and upcoming mentor access in a coherent dashboard.
- [x] The dashboard uses meaningful empty/loading/error-style patterns in the component model rather than decorative placeholders.

## Onboarding and pathway
- [x] The onboarding route presents the target role, experience, available time, aspirations, evidence, and consent concepts.
- [x] The pathway route presents ordered milestones, skills, task progress, rubrics, and practical evidence requirements.

## Practical work and portfolio
- [x] The task workspace communicates instructions, expected evidence, rubric, submission state, and next action.
- [x] The portfolio surface connects projects to skills, milestones, reviewer feedback, endorsements, and visibility.

## Human review and employer context
- [x] The reviewer workspace shows a submission queue, rubric signals, structured feedback, and endorsement context.
- [x] The employer preview is explicitly consent-scoped and excludes hidden scores, private notes, and raw onboarding answers.

## Secure foundations
- [x] Security headers, route manifest, demo-safe data, and documentation are present.
- [x] Implement Supabase SSR/browser clients, Auth sign-in/sign-up/callback routes, and session refresh middleware.
- [x] Implement Supabase database migrations, server-only data access boundaries, RLS policies, audit events, consent records, and role-escalation protection.
- [x] Implement protected profile, pathway, and onboarding API routes with Zod validation and authenticated identity derivation.
- [ ] Configure Supabase Auth email provider, production redirect URLs, and verified transactional email templates.
- [ ] Add private storage buckets, upload MIME/signature validation, malware scanning, signed URLs, and retention policies.
- [ ] Add platform-admin and organization-level reviewer authorization policies for privileged mutations.
- [ ] Add CI, dependency scanning, secret scanning, CodeQL, automated tests, and staging security verification.

## Deferred by decision
- [ ] Public investor marketplace.
- [ ] Automated mentor payroll or provider revenue splitting.
- [ ] Open employer search across all mentees.
- [ ] Algorithmic hiring decisions.
- [ ] Large course marketplace.
- [ ] Native mobile apps.
- [ ] Complex video conferencing.
- [ ] Production payments until pricing, KYC/KYB, tax, refunds and dispute rules are approved.
