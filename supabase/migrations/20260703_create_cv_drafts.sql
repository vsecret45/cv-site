create table if not exists public.cv_drafts (
    user_id uuid primary key references auth.users(id) on delete cascade,
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.set_cv_drafts_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists cv_drafts_set_updated_at on public.cv_drafts;

create trigger cv_drafts_set_updated_at
before update on public.cv_drafts
for each row
execute function public.set_cv_drafts_updated_at();

alter table public.cv_drafts enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.cv_drafts to authenticated;

do $$
begin
    create policy "Users can read their own CV drafts"
    on public.cv_drafts
    for select
    to authenticated
    using (auth.uid() = user_id);
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create policy "Users can insert their own CV drafts"
    on public.cv_drafts
    for insert
    to authenticated
    with check (auth.uid() = user_id);
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create policy "Users can update their own CV drafts"
    on public.cv_drafts
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create policy "Users can delete their own CV drafts"
    on public.cv_drafts
    for delete
    to authenticated
    using (auth.uid() = user_id);
exception
    when duplicate_object then null;
end $$;
