-- Run this in the Supabase SQL editor.
-- It keeps public reads available and restricts write access to the allowlisted admin emails.
-- It also grants the admin account upload/update/delete access to the project-images bucket.

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    'sameenshaftqat.ss@gmail.com',
    'samreenshafqat.ss@gmail.com',
    'garuff633@gmail.com',
    'gabruff@633gmail.com',
    'gabruff633@gmail.com'
  );
$$;

alter table public.projects enable row level security;

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
on public.projects
for select
using (true);

drop policy if exists "Admin insert projects" on public.projects;
create policy "Admin insert projects"
on public.projects
for insert
with check (public.is_portfolio_admin());

drop policy if exists "Admin update projects" on public.projects;
create policy "Admin update projects"
on public.projects
for update
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin delete projects" on public.projects;
create policy "Admin delete projects"
on public.projects
for delete
using (public.is_portfolio_admin());

drop policy if exists "Admin upload project images" on storage.objects;
create policy "Admin upload project images"
on storage.objects
for insert
with check (
  bucket_id = 'project-images'
  and public.is_portfolio_admin()
);

drop policy if exists "Admin update project images" on storage.objects;
create policy "Admin update project images"
on storage.objects
for update
using (
  bucket_id = 'project-images'
  and public.is_portfolio_admin()
)
with check (
  bucket_id = 'project-images'
  and public.is_portfolio_admin()
);

drop policy if exists "Admin delete project images" on storage.objects;
create policy "Admin delete project images"
on storage.objects
for delete
using (
  bucket_id = 'project-images'
  and public.is_portfolio_admin()
);