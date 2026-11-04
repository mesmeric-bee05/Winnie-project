-- Security and performance hardening for the application-owned public schema.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.record_audit_event(text, text, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.record_audit_event(text, text, uuid, jsonb) to authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

-- Audit records are never writable from the client, but an actor may inspect their own events.
create policy audit_events_select_own on public.audit_events
for select to authenticated
using (actor_id = (select auth.uid()));

-- Avoid overlapping permissive mentor policies while keeping verified mentors public.
drop policy if exists mentors_select_self on public.mentors;
drop policy if exists mentors_select_verified on public.mentors;
create policy mentors_select_verified on public.mentors
for select to anon
using (verification_status = 'verified');
create policy mentors_select_verified_or_self on public.mentors
for select to authenticated
using (verification_status = 'verified' or id = (select auth.uid()));

-- Cover every reported foreign key with a narrow supporting index.
create index if not exists idx_audit_events_actor on public.audit_events(actor_id);
create index if not exists idx_employer_views_mentee on public.employer_views(mentee_id);
create index if not exists idx_employer_views_organization on public.employer_views(organization_id);
create index if not exists idx_endorsements_issuer on public.endorsements(issuer_id);
create index if not exists idx_endorsements_skill on public.endorsements(skill_id);
create index if not exists idx_endorsements_submission on public.endorsements(submission_id);
create index if not exists idx_mentee_pathways_pathway on public.mentee_pathways(pathway_id);
create index if not exists idx_mentor_sessions_mentor on public.mentor_sessions(mentor_id);
create index if not exists idx_mentor_sessions_milestone on public.mentor_sessions(milestone_id);
create index if not exists idx_mentors_organization on public.mentors(organization_id);
create index if not exists idx_pathway_skills_skill on public.pathway_skills(skill_id);
create index if not exists idx_pathways_owner_organization on public.pathways(owner_organization_id);
create index if not exists idx_portfolio_items_submission on public.portfolio_items(submission_id);
create index if not exists idx_submission_reviews_reviewer on public.submission_reviews(reviewer_id);
create index if not exists idx_task_assignments_task on public.task_assignments(task_id);
