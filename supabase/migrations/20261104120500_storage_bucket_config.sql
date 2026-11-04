-- Storage bucket metadata can be configured independently from storage.objects policies.
-- The bucket remains private; object policies are supplied in docs/supabase-storage-setup.sql
-- when the project owner runs them through a Storage-authorized SQL session.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-evidence',
  'portfolio-evidence',
  false,
  10485760,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'text/plain']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
