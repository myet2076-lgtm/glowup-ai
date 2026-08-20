-- Glowup AI Supabase schema (P1.5)

create table if not exists public.analyses (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  timestamp bigint not null,
  source text not null check (source in ('quiz', 'celebrity', 'inspiration')),
  analysis jsonb not null,
  user_photo_url text,
  inspo_photo_url text,
  tryon_image_url text
);

create table if not exists public.inventory (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text,
  category text not null,
  description text
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  master_photo_url text
);

create index if not exists analyses_user_id_idx on public.analyses (user_id);
create index if not exists analyses_timestamp_idx on public.analyses (timestamp desc);
create index if not exists inventory_user_id_idx on public.inventory (user_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'analyses_source_check'
  ) then
    alter table public.analyses
      add constraint analyses_source_check
      check (source in ('quiz', 'celebrity', 'inspiration')) not valid;
  end if;
end $$;

alter table public.analyses enable row level security;
alter table public.inventory enable row level security;
alter table public.profiles enable row level security;

-- analyses policies
drop policy if exists "Users can read own analyses" on public.analyses;
create policy "Users can read own analyses"
  on public.analyses
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own analyses" on public.analyses;
create policy "Users can insert own analyses"
  on public.analyses
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own analyses" on public.analyses;
create policy "Users can update own analyses"
  on public.analyses
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own analyses" on public.analyses;
create policy "Users can delete own analyses"
  on public.analyses
  for delete
  using (auth.uid() = user_id);

-- inventory policies
drop policy if exists "Users can read own inventory" on public.inventory;
create policy "Users can read own inventory"
  on public.inventory
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own inventory" on public.inventory;
create policy "Users can insert own inventory"
  on public.inventory
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own inventory" on public.inventory;
create policy "Users can update own inventory"
  on public.inventory
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own inventory" on public.inventory;
create policy "Users can delete own inventory"
  on public.inventory
  for delete
  using (auth.uid() = user_id);

-- profiles policies
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = user_id);
