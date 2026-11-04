# Supabase production setup

This runbook contains the remaining project-owner configuration that is not exposed by the current Supabase MCP management surface.

## 1. Auth URL configuration

In Supabase Dashboard → Authentication → URL Configuration:

- Set **Site URL** to the deployed Winnie origin, for example `https://app.example.com`.
- Add the local callback origin `http://localhost:3000/auth/callback` while testing locally.
- Add the exact managed Preview callback URL from the Webdev project Preview panel, ending in `/auth/callback`.
- Add the published callback URL `https://app.example.com/auth/callback`.
- Keep the allow list narrow. Do not add wildcard production domains.

The application sends `emailRedirectTo: <current-origin>/auth/callback` during sign-up and verification-email resend. The callback exchanges the authorization code server-side and redirects to `/dashboard`.

## 2. Email provider

Supabase hosted projects can use the built-in email service for development, but production delivery requires a verified SMTP provider. Create a provider account and configure it in Dashboard → Authentication → SMTP Settings. Required values are provider-specific:

- SMTP host and port.
- SMTP username and password/API credential.
- Sender name and verified sender email.
- Optional reply-to address.

Do not commit these values. Add them only in the Supabase dashboard. Disable link tracking for Supabase Auth links so verification URLs are not rewritten or prefetched by the provider.

Recommended templates:

- **Confirm signup:** explain that the link verifies the private Winnie account and use `{{ .ConfirmationURL }}`.
- **Reset password:** explain that the link is time-limited and use `{{ .ConfirmationURL }}`.
- **Magic link:** use only if passwordless login is later enabled.
- **Security notifications:** enable password-changed and email-changed notifications.

The application now reports actionable errors for unconfirmed email, invalid credentials, duplicate accounts, rate limits and redirect configuration failures. It also provides a “Send verification email again” action after an unconfirmed sign-in.

## 3. Private Storage bucket

The bucket metadata has been applied to the Winnie project:

- Bucket: `portfolio-evidence`
- Public: `false`
- Maximum object size: 10 MiB
- Allowed MIME types: PDF, PNG, JPEG, WebP and plain text

The authorized migration role cannot alter `storage.objects`, so the following policies must be run once by the project owner through Supabase SQL Editor or a Storage-authorized migration session. They use the current `owner_id` text column.

```sql
alter table storage.objects enable row level security;

drop policy if exists portfolio_evidence_insert_own on storage.objects;
drop policy if exists portfolio_evidence_select_own on storage.objects;
drop policy if exists portfolio_evidence_update_own on storage.objects;
drop policy if exists portfolio_evidence_delete_own on storage.objects;

create policy portfolio_evidence_insert_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'portfolio-evidence'
  and owner_id = (select auth.uid())::text
  and name ~ '^portfolio/[0-9a-f-]{36}/[A-Za-z0-9._-]+$'
);

create policy portfolio_evidence_select_own on storage.objects
for select to authenticated
using (
  bucket_id = 'portfolio-evidence'
  and owner_id = (select auth.uid())::text
);

create policy portfolio_evidence_update_own on storage.objects
for update to authenticated
using (bucket_id = 'portfolio-evidence' and owner_id = (select auth.uid())::text)
with check (bucket_id = 'portfolio-evidence' and owner_id = (select auth.uid())::text);

create policy portfolio_evidence_delete_own on storage.objects
for delete to authenticated
using (bucket_id = 'portfolio-evidence' and owner_id = (select auth.uid())::text);
```

The application exposes authenticated server routes for preparing a signed upload and a one-hour signed download. The upload route validates filename, MIME type, size and a random user-owned path. The download route accepts only a path under the current user’s own UUID prefix. A future employer-consented download route must check an active `employer_views` record before issuing a URL.

## 4. Manual verification

After applying the settings:

1. Create a test account with a real inbox.
2. Confirm the email and return to `/auth/callback`.
3. Sign in at `/auth/sign-in` and confirm `/dashboard` shows `Private workspace`.
4. Complete onboarding and confirm the pathway, consent record and task assignments are created.
5. Request an upload URL, upload a small allowed file, and request a signed download URL.
6. Confirm a second user cannot read the first user’s profile, pathway, object path or signed URL.
7. Confirm revoking a consent record prevents employer-scoped reads.

Do not use a real client document for this smoke test. Use a synthetic PDF or text file and delete the test account/object afterwards.
