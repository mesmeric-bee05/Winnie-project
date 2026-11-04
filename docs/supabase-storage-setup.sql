-- Run once in Supabase SQL Editor as the project owner.
-- Bucket metadata is already configured by the storage_bucket_config migration.

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
