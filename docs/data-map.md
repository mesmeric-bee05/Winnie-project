# Data map

| Domain | Examples | Default visibility |
|---|---|---|
| Identity | name, email, locale, timezone | private |
| Onboarding | target role, aspirations, availability, evidence gap | private; never employer-visible by default |
| Progress | pathway, milestones, assignments, completion | mentee; selected summaries only with consent |
| Evidence | submissions, files, portfolio narratives | private draft; explicit share state |
| Reviews | rubric, feedback, reviewer notes | reviewer/mentee; employer summary only when approved |
| Mentor | expertise, availability, verification | public/curated profile fields |
| Endorsement | skill, issuer, evidence reference, visibility | explicit share state |
| Consent | version, purpose, scope, expiry, revocation | platform/audit |
| Audit | actor, action, target, timestamp, metadata | platform admins only |

Production implementation must document lawful basis, retention, export, deletion, correction, withdrawal and incident contacts for the target jurisdiction.
