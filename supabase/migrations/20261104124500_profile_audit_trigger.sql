create or replace function public.audit_profile_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_events (actor_id, action, entity_type, entity_id, metadata)
  values (
    new.id,
    'profile_updated',
    'profile',
    new.id,
    jsonb_build_object('onboarding_status', new.onboarding_status, 'profile_visibility', new.profile_visibility)
  );
  return new;
end;
$$;

revoke all on function public.audit_profile_change() from public, anon, authenticated;

drop trigger if exists audit_profile_change on public.profiles;
create trigger audit_profile_change
after update of display_name, locale, timezone, onboarding_status, profile_visibility on public.profiles
for each row execute function public.audit_profile_change();
