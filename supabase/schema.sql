-- CMD website: members, news and news images.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste this file → Run.
--
-- Roles
--   member  can write news, edit or delete their own drafts, and submit them for review
--   admin   can do everything a member can, plus approve, reject, unpublish and delete any news
-- Visitors (not logged in) only ever see published news.

-- ── Types ─────────────────────────────────────────────────────────────
create type public.member_role as enum ('member', 'admin');
create type public.news_status as enum ('draft', 'pending', 'published', 'rejected');

-- ── Profiles: one row per login account ──────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.member_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Every new account gets a profile with the member role.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

create policy "Members can see all profiles"
  on public.profiles for select to authenticated
  using (true);

create policy "Members can rename themselves"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Only the name can be changed from the website; roles are changed by an admin in the dashboard.
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- ── News ─────────────────────────────────────────────────────────────
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  body text not null default '' check (char_length(body) <= 20000),
  kind text not null default 'event' check (kind in ('paper', 'award', 'event', 'people', 'grant')),
  news_date date not null default current_date,
  image_path text,
  status public.news_status not null default 'draft',
  review_note text,
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index news_published_idx on public.news (news_date desc) where status = 'published';
create index news_author_idx on public.news (author_id);

-- Keeps review fields in the hands of admins, whatever a member sends.
create function public.news_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();

  if not public.is_admin() then
    if tg_op = 'INSERT' then
      new.author_id := auth.uid();
      new.review_note := null;
      new.published_at := null;
    else
      new.author_id := old.author_id;
      -- The admin's note stays until the author sends the news for review again.
      new.review_note := case when new.status = 'pending' then null else old.review_note end;
      new.published_at := old.published_at;
    end if;
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  elsif new.status <> 'published' then
    new.published_at := null;
  end if;

  return new;
end;
$$;

create trigger news_guard
  before insert or update on public.news
  for each row execute function public.news_guard();

alter table public.news enable row level security;

create policy "Anyone can read published news"
  on public.news for select to anon, authenticated
  using (status = 'published');

create policy "Authors can read their own news"
  on public.news for select to authenticated
  using (author_id = (select auth.uid()));

create policy "Admins can read all news"
  on public.news for select to authenticated
  using ((select public.is_admin()));

create policy "Members can write drafts or submit for review"
  on public.news for insert to authenticated
  with check (
    author_id = (select auth.uid()) and status in ('draft', 'pending')
    or (select public.is_admin())
  );

create policy "Authors can edit their unpublished news"
  on public.news for update to authenticated
  using (author_id = (select auth.uid()) and status <> 'published')
  with check (author_id = (select auth.uid()) and status in ('draft', 'pending'));

create policy "Admins can edit any news"
  on public.news for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Authors can delete their unpublished news"
  on public.news for delete to authenticated
  using (author_id = (select auth.uid()) and status <> 'published');

create policy "Admins can delete any news"
  on public.news for delete to authenticated
  using ((select public.is_admin()));

-- ── Images ───────────────────────────────────────────────────────────
-- Public bucket: anyone can view images; members upload into a folder named after their user id.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-images', 'news-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

create policy "Members can list news images"
  on storage.objects for select to authenticated
  using (bucket_id = 'news-images');

create policy "Members upload into their own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'news-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Members delete their own images, admins any"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'news-images'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_admin()))
  );
