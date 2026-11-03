# Threat model

## Assets

User identity, onboarding answers, portfolio work, reviewer feedback, mentor notes, consent records, organization membership, audit events and future payment data.

## Primary threats

- unauthorized access to another mentee’s records through guessed IDs;
- employer access outside active consent;
- reviewer access outside an assignment;
- unsafe uploads and malicious files;
- XSS through portfolio content or feedback;
- account takeover and session fixation;
- abuse of invitations, submissions, exports and notifications;
- payment webhook replay once billing is enabled;
- sensitive data leaking through logs or analytics.

## Required controls before production

- Manus OAuth with a validated `webdev_app_session` and MFA for privileged roles;
- server-only DAL with authentication and authorization inside every mutation;
- managed database migrations and ownership-aware policies;
- private storage with signed, short-lived URLs;
- schema validation, rate limiting, security headers, CSRF/origin checks and output sanitization;
- immutable audit events and redacted observability;
- upload scanning and explicit file allowlists;
- security tests for IDOR, privilege escalation, XSS, CSRF, upload abuse and webhook replay.
