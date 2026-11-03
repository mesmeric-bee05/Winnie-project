create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text not null default 'en-KE',
  timezone text not null default 'Africa/Nairobi',
  onboarding_status text not null default 'not_started' check (onboarding_status in ('not_started','in_progress','complete')),
  profile_visibility text not null default 'private' check (profile_visibility in ('private','consented')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('employer','provider','institution','platform')),
  status text not null default 'pending' check (status in ('pending','approved','suspended')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('member','reviewer','admin')),
  status text not null default 'pending' check (status in ('pending','active','revoked')),
  invited_email text,
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id)
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  evidence_requirements jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.pathways (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id),
  slug text not null unique,
  title text not null,
  version integer not null default 1 check (version > 0),
  description text not null,
  status text not null default 'draft' check (status in ('draft','active','retired')),
  owner_organization_id uuid references public.organizations(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.pathway_skills (
  pathway_id uuid not null references public.pathways(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  position integer not null default 1 check (position > 0),
  primary key (pathway_id, skill_id)
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  pathway_id uuid not null references public.pathways(id) on delete cascade,
  position integer not null check (position > 0),
  slug text not null,
  title text not null,
  description text not null,
  unlock_rules jsonb not null default '{}'::jsonb,
  reviewer_requirements jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (pathway_id, position),
  unique (pathway_id, slug)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  pathway_id uuid not null references public.pathways(id) on delete cascade,
  slug text not null,
  title text not null,
  description text not null,
  instructions text not null,
  rubric jsonb not null default '[]'::jsonb,
  expected_artifact_types jsonb not null default '[]'::jsonb,
  due_date_policy jsonb not null default '{}'::jsonb,
  position integer not null default 1 check (position > 0),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (pathway_id, slug)
);

create table public.mentee_pathways (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  pathway_id uuid not null references public.pathways(id),
  baseline_state jsonb not null default '{}'::jsonb,
  target_state jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','paused','completed','archived')),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (mentee_id, pathway_id)
);

create table public.task_assignments (
  id uuid primary key default gen_random_uuid(),
  mentee_pathway_id uuid not null references public.mentee_pathways(id) on delete cascade,
  task_id uuid not null references public.tasks(id),
  state text not null default 'locked' check (state in ('locked','available','in_progress','submitted','complete','needs_changes')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  unlocked_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (mentee_pathway_id, task_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  task_assignment_id uuid not null references public.task_assignments(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  version integer not null default 1 check (version > 0),
  body text,
  links jsonb not null default '[]'::jsonb,
  files jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','submitted','in_review','approved','needs_changes','withdrawn')),
  submitted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (task_assignment_id, version)
);

create table public.submission_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id),
  rubric_scores jsonb not null default '{}'::jsonb,
  feedback text not null,
  decision text not null check (decision in ('approve','request_changes','reject')),
  conflict_of_interest boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id),
  title text not null,
  summary text not null,
  artifact_url text,
  skills jsonb not null default '[]'::jsonb,
  visibility text not null default 'private' check (visibility in ('private','shared')),
  curated boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.mentors (
  id uuid primary key references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id),
  bio text,
  expertise jsonb not null default '[]'::jsonb,
  availability jsonb not null default '{}'::jsonb,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','suspended')),
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.mentor_sessions (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  mentor_id uuid not null references public.mentors(id),
  milestone_id uuid references public.milestones(id),
  request_note text not null,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  status text not null default 'requested' check (status in ('requested','confirmed','completed','cancelled','no_show')),
  consent_recorded_at timestamptz,
  notes text,
  follow_up_actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.endorsements (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  issuer_id uuid not null references public.profiles(id),
  skill_id uuid not null references public.skills(id),
  submission_id uuid references public.submissions(id),
  statement text not null,
  visibility text not null default 'private' check (visibility in ('private','shared')),
  revoked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.employer_views (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  viewer_user_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id),
  purpose text not null,
  scopes jsonb not null default '["portfolio","milestones","endorsements"]'::jsonb,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  check (mentee_id <> viewer_user_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null check (consent_type in ('terms','privacy','data_sharing','recording','marketing','employer_view')),
  version text not null,
  purpose text not null,
  granted boolean not null default false,
  scope jsonb not null default '{}'::jsonb,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index idx_memberships_user on public.organization_memberships(user_id);
create index idx_pathways_role_status on public.pathways(role_id, status);
create index idx_milestones_pathway on public.milestones(pathway_id, position);
create index idx_tasks_milestone on public.tasks(milestone_id, position);
create index idx_mentee_pathways_mentee on public.mentee_pathways(mentee_id, status);
create index idx_assignments_pathway on public.task_assignments(mentee_pathway_id, state);
create index idx_submissions_mentee_status on public.submissions(mentee_id, status);
create index idx_reviews_submission on public.submission_reviews(submission_id, created_at desc);
create index idx_portfolio_owner_visibility on public.portfolio_items(owner_id, visibility);
create index idx_sessions_mentee_status on public.mentor_sessions(mentee_id, status);
create index idx_endorsements_mentee_visibility on public.endorsements(mentee_id, visibility);
create index idx_employer_views_viewer_expiry on public.employer_views(viewer_user_id, expires_at);
create index idx_notifications_user_read on public.notifications(user_id, read_at, created_at desc);
create index idx_consents_user_type on public.consents(user_id, consent_type, created_at desc);
create index idx_audit_events_entity on public.audit_events(entity_type, entity_id, created_at desc);

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger pathways_set_updated_at before update on public.pathways for each row execute function public.set_updated_at();
create trigger assignments_set_updated_at before update on public.task_assignments for each row execute function public.set_updated_at();
create trigger portfolio_set_updated_at before update on public.portfolio_items for each row execute function public.set_updated_at();
create trigger mentors_set_updated_at before update on public.mentors for each row execute function public.set_updated_at();
create trigger sessions_set_updated_at before update on public.mentor_sessions for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.roles enable row level security;
alter table public.skills enable row level security;
alter table public.pathways enable row level security;
alter table public.pathway_skills enable row level security;
alter table public.milestones enable row level security;
alter table public.tasks enable row level security;
alter table public.mentee_pathways enable row level security;
alter table public.task_assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_reviews enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.mentors enable row level security;
alter table public.mentor_sessions enable row level security;
alter table public.endorsements enable row level security;
alter table public.employer_views enable row level security;
alter table public.notifications enable row level security;
alter table public.consents enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_select_self on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy organizations_select_approved on public.organizations for select to authenticated using (status = 'approved');
create policy memberships_select_self on public.organization_memberships for select to authenticated using (user_id = auth.uid());

create policy roles_select_active on public.roles for select to anon, authenticated using (active = true);
create policy skills_select_active on public.skills for select to anon, authenticated using (active = true);
create policy pathways_select_active on public.pathways for select to anon, authenticated using (status = 'active');
create policy pathway_skills_select_active on public.pathway_skills for select to anon, authenticated using (exists (select 1 from public.pathways p where p.id = pathway_id and p.status = 'active'));
create policy milestones_select_active on public.milestones for select to anon, authenticated using (exists (select 1 from public.pathways p where p.id = pathway_id and p.status = 'active'));
create policy tasks_select_active on public.tasks for select to anon, authenticated using (active = true and exists (select 1 from public.pathways p where p.id = pathway_id and p.status = 'active'));

create policy mentee_pathways_select_own on public.mentee_pathways for select to authenticated using (mentee_id = auth.uid());
create policy mentee_pathways_insert_own on public.mentee_pathways for insert to authenticated with check (mentee_id = auth.uid());
create policy mentee_pathways_update_own on public.mentee_pathways for update to authenticated using (mentee_id = auth.uid()) with check (mentee_id = auth.uid());

create policy assignments_select_own on public.task_assignments for select to authenticated using (exists (select 1 from public.mentee_pathways mp where mp.id = mentee_pathway_id and mp.mentee_id = auth.uid()));
create policy assignments_insert_own on public.task_assignments for insert to authenticated with check (exists (select 1 from public.mentee_pathways mp where mp.id = mentee_pathway_id and mp.mentee_id = auth.uid()));
create policy assignments_update_own on public.task_assignments for update to authenticated using (exists (select 1 from public.mentee_pathways mp where mp.id = mentee_pathway_id and mp.mentee_id = auth.uid())) with check (exists (select 1 from public.mentee_pathways mp where mp.id = mentee_pathway_id and mp.mentee_id = auth.uid()));

create policy submissions_select_own on public.submissions for select to authenticated using (mentee_id = auth.uid());
create policy submissions_insert_own on public.submissions for insert to authenticated with check (mentee_id = auth.uid());
create policy submissions_update_own on public.submissions for update to authenticated using (mentee_id = auth.uid()) with check (mentee_id = auth.uid());

create policy reviews_select_own_submission on public.submission_reviews for select to authenticated using (reviewer_id = auth.uid() or exists (select 1 from public.submissions s where s.id = submission_id and s.mentee_id = auth.uid()));
create policy reviews_insert_self on public.submission_reviews for insert to authenticated with check (reviewer_id = auth.uid());

create policy portfolio_select_owner_or_consent on public.portfolio_items for select to authenticated using (
  owner_id = auth.uid()
  or (visibility = 'shared' and exists (
    select 1 from public.employer_views ev
    where ev.mentee_id = owner_id and ev.viewer_user_id = auth.uid() and ev.revoked_at is null and ev.expires_at > timezone('utc', now())
  ))
);
create policy portfolio_insert_owner on public.portfolio_items for insert to authenticated with check (owner_id = auth.uid());
create policy portfolio_update_owner on public.portfolio_items for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy mentors_select_verified on public.mentors for select to anon, authenticated using (verification_status = 'verified');
create policy mentors_select_self on public.mentors for select to authenticated using (id = auth.uid());
create policy mentors_insert_self on public.mentors for insert to authenticated with check (id = auth.uid());
create policy mentors_update_self on public.mentors for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy sessions_select_participant on public.mentor_sessions for select to authenticated using (mentee_id = auth.uid() or mentor_id = auth.uid());
create policy sessions_insert_mentee on public.mentor_sessions for insert to authenticated with check (mentee_id = auth.uid());
create policy sessions_update_participant on public.mentor_sessions for update to authenticated using (mentee_id = auth.uid() or mentor_id = auth.uid()) with check (mentee_id = auth.uid() or mentor_id = auth.uid());

create policy endorsements_select_owner_or_consent on public.endorsements for select to authenticated using (
  mentee_id = auth.uid()
  or issuer_id = auth.uid()
  or (visibility = 'shared' and revoked_at is null and exists (
    select 1 from public.employer_views ev
    where ev.mentee_id = endorsements.mentee_id and ev.viewer_user_id = auth.uid() and ev.revoked_at is null and ev.expires_at > timezone('utc', now())
  ))
);
create policy endorsements_insert_issuer on public.endorsements for insert to authenticated with check (issuer_id = auth.uid());
create policy endorsements_update_issuer on public.endorsements for update to authenticated using (issuer_id = auth.uid()) with check (issuer_id = auth.uid());

create policy employer_views_select_participant on public.employer_views for select to authenticated using (mentee_id = auth.uid() or viewer_user_id = auth.uid());
create policy employer_views_insert_mentee on public.employer_views for insert to authenticated with check (mentee_id = auth.uid());
create policy employer_views_update_mentee on public.employer_views for update to authenticated using (mentee_id = auth.uid()) with check (mentee_id = auth.uid());

create policy notifications_select_own on public.notifications for select to authenticated using (user_id = auth.uid());
create policy notifications_update_own on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy consents_select_own on public.consents for select to authenticated using (user_id = auth.uid());
create policy consents_insert_own on public.consents for insert to authenticated with check (user_id = auth.uid());
create policy consents_update_own on public.consents for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into public.roles (slug, title, description)
values ('product-designer', 'Product designer', 'Shape useful, accessible experiences by connecting user insight to interface decisions.')
on conflict (slug) do nothing;

insert into public.skills (slug, name, description, evidence_requirements)
values
  ('product-thinking', 'Product thinking', 'Frame a real user tension before reaching for a solution.', '["problem framing","evidence of user insight","clear trade-off"]'::jsonb),
  ('interaction-design', 'Interaction design', 'Turn a user need into a clear, testable flow.', '["flow","states","next test"]'::jsonb),
  ('communication', 'Communication', 'Explain decisions, trade-offs and learning with clarity.', '["design rationale","reflection","feedback response"]'::jsonb)
on conflict (slug) do nothing;

insert into public.pathways (role_id, slug, title, version, description, status)
select r.id, 'product-designer-v1', 'From curiosity to craft', 1, 'A practical first pathway from direction-setting to reviewable product design evidence.', 'active'
from public.roles r
where r.slug = 'product-designer'
on conflict (slug) do nothing;

insert into public.pathway_skills (pathway_id, skill_id, position)
select p.id, s.id, v.position
from public.pathways p
cross join (values ('product-thinking', 1), ('interaction-design', 2), ('communication', 3)) as v(slug, position)
join public.skills s on s.slug = v.slug
where p.slug = 'product-designer-v1'
on conflict do nothing;

insert into public.milestones (pathway_id, position, slug, title, description, unlock_rules, reviewer_requirements)
select p.id, v.position, v.slug, v.title, v.description, v.unlock_rules::jsonb, v.reviewer_requirements::jsonb
from public.pathways p
cross join (values
  (1, 'name-the-direction', 'Name the direction', 'Clarify your target role, context and evidence gap.', '{}', '{"required": false}'),
  (2, 'build-the-evidence', 'Build the evidence', 'Complete small, practical projects that prove your craft.', '{"previous_complete": true}', '{"required": true, "min_reviewers": 1}'),
  (3, 'work-with-a-mentor', 'Work with a mentor', 'Bring your work to someone who has done the job.', '{"milestone_progress": 0.5}', '{"required": true, "min_reviewers": 1}'),
  (4, 'show-your-progression', 'Show your progression', 'Curate a portfolio that gives employers a fuller signal.', '{"endorsement_count": 1}', '{"required": false}')
) as v(position, slug, title, description, unlock_rules, reviewer_requirements) 
where p.slug = 'product-designer-v1'
on conflict (pathway_id, position) do nothing;

insert into public.tasks (milestone_id, pathway_id, slug, title, description, instructions, rubric, expected_artifact_types, due_date_policy, position)
select m.id, p.id, v.slug, v.title, v.description, v.instructions, v.rubric::jsonb, v.artifacts::jsonb, v.due_policy::jsonb, v.position
from public.pathways p
join public.milestones m on m.pathway_id = p.id
cross join (values
  ('map-one-user-tension', 'Map one user tension', 'Translate a real observation into a concise problem statement and evidence plan.', 'Write a one-page insight map: observation, tension, who it affects and what you need to learn next.', '[{"criterion":"Specific user tension","max":5},{"criterion":"Evidence plan","max":5}]', '["document","link"]', '{"days": 7}', 1, 'name-the-direction'),
  ('turn-insight-into-flow', 'Turn the insight into a flow', 'Sketch the smallest useful path from user intent to a meaningful outcome.', 'Create a clickable low-fidelity flow and annotate the key decision or trade-off.', '[{"criterion":"Clear path","max":5},{"criterion":"Reasoned trade-off","max":5},{"criterion":"Next test","max":5}]', '["link","image","document"]', '{"days": 10}', 1, 'build-the-evidence'),
  ('write-design-rationale', 'Write the design rationale', 'Explain what changed, why it changed and what you would test next.', 'Write a 300-word case note connecting your decision to user evidence and a next test.', '[{"criterion":"Clarity","max":5},{"criterion":"Reflection","max":5}]', '["document"]', '{"days": 5}', 2, 'build-the-evidence')
) as v(slug, title, description, instructions, rubric, artifacts, due_policy, position, milestone_slug)
where p.slug = 'product-designer-v1' and m.slug = v.milestone_slug
on conflict (pathway_id, slug) do nothing;
