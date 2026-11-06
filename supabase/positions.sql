-- CMD website: open positions on the Join us page, editable by admins at /admin/positions.
-- Run once, after schema.sql and content.sql: SQL Editor → New query → paste this file → Run.

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  level text not null default '',     -- e.g. "PhD, fully funded"
  deadline text not null default '',  -- free text, e.g. "Open until filled"
  body text not null default '',
  requirements text[] not null default '{}',
  -- Closed positions stay in the admin list but are hidden from the website.
  is_open boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.positions enable row level security;

create trigger touch_updated_at
  before update on public.positions
  for each row execute function public.touch_updated_at();

create policy "Anyone can read open positions"
  on public.positions for select to anon, authenticated
  using (is_open);

create policy "Admins can read all positions"
  on public.positions for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can add" on public.positions for insert to authenticated with check ((select public.is_admin()));
create policy "Admins can edit" on public.positions for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete" on public.positions for delete to authenticated using ((select public.is_admin()));
