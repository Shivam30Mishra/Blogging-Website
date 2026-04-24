create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('viewer', 'author', 'admin');
  end if;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null,
  image_url text not null,
  author_id uuid not null references public.users(id) on delete cascade,
  summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  comment_text text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := lower(coalesce(new.raw_user_meta_data ->> 'role', 'viewer'));

  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.email, ''),
    case
      when requested_role in ('viewer', 'author', 'admin') then requested_role::public.app_role
      else 'viewer'::public.app_role
    end
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.users to anon, authenticated;
grant select on public.posts to anon, authenticated;
grant select on public.comments to anon, authenticated;
grant insert on public.comments to authenticated;
grant insert, update on public.posts to authenticated;
grant update on public.users to authenticated;

drop policy if exists "Public can read users" on public.users;
create policy "Public can read users"
on public.users
for select
using (true);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
on public.users
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "Public can read posts" on public.posts;
create policy "Public can read posts"
on public.posts
for select
using (true);

drop policy if exists "Authors and admins can create posts" on public.posts;
create policy "Authors and admins can create posts"
on public.posts
for insert
to authenticated
with check (
  auth.uid() = author_id
  and exists (
    select 1
    from public.users
    where id = auth.uid()
      and role in ('author', 'admin')
  )
);

drop policy if exists "Authors can edit own posts and admins can edit all" on public.posts;
create policy "Authors can edit own posts and admins can edit all"
on public.posts
for update
to authenticated
using (auth.uid() = author_id or public.is_admin())
with check (auth.uid() = author_id or public.is_admin());

drop policy if exists "Public can read comments" on public.comments;
create policy "Public can read comments"
on public.comments
for select
using (true);

drop policy if exists "Authenticated users can comment" on public.comments;
create policy "Authenticated users can comment"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);

create index if not exists posts_author_id_idx on public.posts(author_id);
create index if not exists posts_slug_idx on public.posts(slug);
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comments_user_id_idx on public.comments(user_id);

comment on table public.users is 'Application profile table mirroring auth.users with role metadata.';
comment on table public.posts is 'Blog posts with stored AI-generated summaries.';
comment on table public.comments is 'Viewer and reader comments on blog posts.';

-- Promote a user to admin after signup if needed:
-- update public.users set role = 'admin' where email = 'your-admin-email@example.com';
