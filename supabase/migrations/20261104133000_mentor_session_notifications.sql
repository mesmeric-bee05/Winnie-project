create or replace function public.notify_mentor_session_requested()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, kind, title, body)
  values (
    new.mentor_id,
    'mentor_session_requested',
    'New mentor request',
    'A mentee has requested an evidence review conversation. Open the mentor workspace to respond.'
  );
  return new;
end;
$$;

revoke all on function public.notify_mentor_session_requested() from public, anon, authenticated;

drop trigger if exists mentor_session_requested_notification on public.mentor_sessions;
create trigger mentor_session_requested_notification
after insert on public.mentor_sessions
for each row
execute function public.notify_mentor_session_requested();
