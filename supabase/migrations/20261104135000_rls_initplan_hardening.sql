do $$
declare
  policy_row record;
  clauses text;
begin
  for policy_row in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and (coalesce(qual, '') like '%auth.uid()%' or coalesce(with_check, '') like '%auth.uid()%')
  loop
    clauses := '';
    if policy_row.qual is not null then
      clauses := clauses || format(' using (%s)', replace(policy_row.qual, 'auth.uid()', '(select auth.uid())'));
    end if;
    if policy_row.with_check is not null then
      clauses := clauses || format(' with check (%s)', replace(policy_row.with_check, 'auth.uid()', '(select auth.uid())'));
    end if;
    execute format('alter policy %I on %I.%I%s', policy_row.policyname, policy_row.schemaname, policy_row.tablename, clauses);
  end loop;
end;
$$;
