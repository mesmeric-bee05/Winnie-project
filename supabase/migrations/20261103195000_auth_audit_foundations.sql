alter table public.profiles
  add column app_role text not null default 'mentee'
  check (app_role in ('mentee','mentor','reviewer','employer','org_admin','platform_admin'));

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = old.id then
    new.app_role := old.app_role;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.record_audit_event(
  p_action text,
  p_entity_type text,
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  event_id uuid;
begin
  if auth.uid() is null then
    raise exception 'authenticated user required';
  end if;
  insert into public.audit_events (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, coalesce(p_metadata, '{}'::jsonb))
  returning id into event_id;
  return event_id;
end;
$$;

grant execute on function public.record_audit_event(text, text, uuid, jsonb) to authenticated;
