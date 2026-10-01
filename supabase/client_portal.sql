-- ═════════════════════════════════════════════════════════════
-- CLIENT PORTAL + ADMIN ROLES
-- Run once in Supabase → SQL Editor (the whole file, in one go).
--
-- What it does
--   1. Adds real admin roles. Until now ANY logged-in account could edit the
--      site. Every account that exists right now is kept as an admin; client
--      accounts you invite later will NOT be admins.
--   2. Locks the existing admin tables (news, events, portfolio, industry news,
--      material prices, leads) so only admins can change them. Public pages keep
--      reading them exactly as before.
--   3. Creates the client portal: projects, stages, payments, updates,
--      documents and defect requests, plus a private file store.
-- Safe to re-run. If you ever re-run industry_news.sql or material_prices.sql,
-- run this file again afterwards (they re-open those tables to every login).
-- ═════════════════════════════════════════════════════════════


-- ─── 1. Admin roles ──────────────────────────────────────────

create table if not exists public.admins (
    user_id    uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

-- First run only: everyone who can log in today stays an admin (they all were).
-- On later runs nothing is added, so invited clients never become admins.
insert into public.admins (user_id)
select id from auth.users
where not exists (select 1 from public.admins)
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
    select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.admins enable row level security;
drop policy if exists "Users see their own admin row" on public.admins;
create policy "Users see their own admin row" on public.admins
    for select to authenticated using (user_id = auth.uid() or public.is_admin());
-- (Add/remove admins with SQL: insert into public.admins (user_id) values ('<uuid>');)


-- ─── 2. Lock existing tables to admins ───────────────────────
-- Replaces whatever policies these tables had with: public can read,
-- only admins can write. (Tables that don't exist are skipped.)

do $$
declare
    t text;
    pol record;
begin
    foreach t in array array['news_items', 'events', 'gallery_categories', 'gallery_images',
                             'industry_news', 'material_prices', 'consultation_leads']
    loop
        if to_regclass('public.' || t) is null then
            continue;
        end if;

        for pol in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
            execute format('drop policy %I on public.%I', pol.policyname, t);
        end loop;

        execute format('alter table public.%I enable row level security', t);

        execute format('create policy "Admins manage" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);

        if t in ('news_items', 'events', 'gallery_categories', 'gallery_images') then
            execute format('create policy "Public read" on public.%I for select to anon, authenticated using (true)', t);
        elsif t in ('industry_news', 'material_prices') then
            execute format('create policy "Public reads published" on public.%I for select to anon, authenticated using (status = %L)', t, 'published');
        elsif t = 'consultation_leads' then
            -- the website's consultation form must still be able to submit
            execute 'create policy "Anyone can submit a lead" on public.consultation_leads for insert to anon, authenticated with check (true)';
        end if;
    end loop;
end $$;

-- Portfolio image uploads (public "gallery" bucket): admins only
do $$
declare pol record;
begin
    for pol in
        select policyname from pg_policies
        where schemaname = 'storage' and tablename = 'objects'
          and cmd <> 'SELECT'
          and (coalesce(qual, '') ilike '%gallery%' or coalesce(with_check, '') ilike '%gallery%')
    loop
        execute format('drop policy %I on storage.objects', pol.policyname);
    end loop;
end $$;

drop policy if exists "Admins upload gallery" on storage.objects;
create policy "Admins upload gallery" on storage.objects for insert to authenticated
    with check (bucket_id = 'gallery' and public.is_admin());
drop policy if exists "Admins change gallery" on storage.objects;
create policy "Admins change gallery" on storage.objects for update to authenticated
    using (bucket_id = 'gallery' and public.is_admin());
drop policy if exists "Admins delete gallery" on storage.objects;
create policy "Admins delete gallery" on storage.objects for delete to authenticated
    using (bucket_id = 'gallery' and public.is_admin());


-- ─── 3. Client portal tables ─────────────────────────────────

create table if not exists public.projects (
    id                uuid primary key default gen_random_uuid(),
    name              text not null,
    code              text,                       -- e.g. AAL-2026-014
    location          text,
    description       text,
    status            text not null default 'planning'
                      check (status in ('planning', 'in_progress', 'on_hold', 'completed', 'handed_over')),
    start_date        date,
    target_completion date,
    contract_value    numeric,
    currency          text not null default 'NGN',
    camera_url        text,                       -- live site camera link
    camera_note       text,
    defect_period_end date,                       -- end of defect liability period
    created_at        timestamptz not null default now()
);

create table if not exists public.project_members (
    project_id  uuid not null references public.projects(id) on delete cascade,
    user_id     uuid not null references auth.users(id) on delete cascade,
    full_name   text,
    email       text,
    created_at  timestamptz not null default now(),
    primary key (project_id, user_id)
);

create table if not exists public.project_stages (
    id              uuid primary key default gen_random_uuid(),
    project_id      uuid not null references public.projects(id) on delete cascade,
    position        int  not null default 0,
    name            text not null,
    status          text not null default 'pending'
                    check (status in ('pending', 'in_progress', 'awaiting_inspection', 'approved')),
    planned_start   date,
    planned_end     date,
    completed_at    date,
    inspector_name  text,
    inspected_at    date,
    inspection_note text,
    created_at      timestamptz not null default now()
);

create table if not exists public.project_payments (
    id           uuid primary key default gen_random_uuid(),
    project_id   uuid not null references public.projects(id) on delete cascade,
    stage_id     uuid references public.project_stages(id) on delete set null,
    label        text not null,
    amount       numeric not null check (amount >= 0),
    due_date     date,
    status       text not null default 'upcoming'
                 check (status in ('upcoming', 'due', 'paid', 'verified')),
    paid_at      date,
    receipt_path text,                            -- file in the private "portal" bucket
    note         text,
    position     int not null default 0,
    created_at   timestamptz not null default now()
);

create table if not exists public.project_updates (
    id          uuid primary key default gen_random_uuid(),
    project_id  uuid not null references public.projects(id) on delete cascade,
    title       text not null,
    body        text,
    photos      text[] not null default '{}',     -- paths in the "portal" bucket
    posted_at   timestamptz not null default now(),
    created_by  uuid references auth.users(id) on delete set null
);

create table if not exists public.project_documents (
    id          uuid primary key default gen_random_uuid(),
    project_id  uuid not null references public.projects(id) on delete cascade,
    category    text not null default 'other'
                check (category in ('contract', 'boq', 'drawing', 'inspection', 'handover', 'receipt', 'other')),
    title       text not null,
    file_path   text not null,
    file_size   bigint,
    uploaded_at timestamptz not null default now()
);

create table if not exists public.defect_requests (
    id          uuid primary key default gen_random_uuid(),
    project_id  uuid not null references public.projects(id) on delete cascade,
    created_by  uuid references auth.users(id) on delete set null,
    title       text not null,
    description text,
    location    text,                              -- room / area of the building
    photos      text[] not null default '{}',
    status      text not null default 'open'
                check (status in ('open', 'in_progress', 'resolved', 'closed')),
    admin_note  text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create index if not exists project_members_user_idx   on public.project_members (user_id);
create index if not exists project_stages_project_idx  on public.project_stages (project_id, position);
create index if not exists project_payments_project_idx on public.project_payments (project_id, position);
create index if not exists project_updates_project_idx on public.project_updates (project_id, posted_at desc);
create index if not exists project_documents_project_idx on public.project_documents (project_id, uploaded_at desc);
create index if not exists defect_requests_project_idx on public.defect_requests (project_id, created_at desc);

-- Is the signed-in user a client on this project?
create or replace function public.is_project_member(pid uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
    select exists (select 1 from public.project_members where project_id = pid and user_id = auth.uid());
$$;

-- Row-level security: clients see only their own projects; admins see everything
do $$
declare t text;
begin
    foreach t in array array['projects', 'project_members', 'project_stages', 'project_payments',
                             'project_updates', 'project_documents', 'defect_requests']
    loop
        execute format('alter table public.%I enable row level security', t);
        execute format('drop policy if exists "Admins manage" on public.%I', t);
        execute format('create policy "Admins manage" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
        execute format('drop policy if exists "Clients read own project" on public.%I', t);
        if t = 'projects' then
            execute 'create policy "Clients read own project" on public.projects for select to authenticated using (public.is_project_member(id))';
        else
            execute format('create policy "Clients read own project" on public.%I for select to authenticated using (public.is_project_member(project_id))', t);
        end if;
    end loop;
end $$;

-- Clients can raise defect requests on their own project (but not edit them afterwards)
drop policy if exists "Clients raise defects" on public.defect_requests;
create policy "Clients raise defects" on public.defect_requests for insert to authenticated
    with check (public.is_project_member(project_id) and created_by = auth.uid() and status = 'open' and admin_note is null);

create or replace function public.touch_defect_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists defect_requests_touch on public.defect_requests;
create trigger defect_requests_touch before update on public.defect_requests
    for each row execute function public.touch_defect_updated_at();


-- ─── 4. Private file store for the portal ────────────────────
-- Files live at  <project id>/<folder>/<file>.  Clients can open files of
-- their own projects (via short-lived signed links) and upload defect photos
-- under <project id>/defects/. Admins can do everything.

-- Project id from a file path like '<uuid>/updates/photo.jpg' (null if not a project folder)
create or replace function public.portal_project_id(object_name text)
returns uuid
language sql immutable
as $$
    select case
        when split_part(object_name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then split_part(object_name, '/', 1)::uuid
    end;
$$;

insert into storage.buckets (id, name, public)
values ('portal', 'portal', false)
on conflict (id) do update set public = false;

drop policy if exists "Portal: admins full access" on storage.objects;
create policy "Portal: admins full access" on storage.objects for all to authenticated
    using (bucket_id = 'portal' and public.is_admin())
    with check (bucket_id = 'portal' and public.is_admin());

drop policy if exists "Portal: clients read own files" on storage.objects;
create policy "Portal: clients read own files" on storage.objects for select to authenticated
    using (
        bucket_id = 'portal'
        and public.is_project_member(public.portal_project_id(name))
    );

drop policy if exists "Portal: clients upload defect photos" on storage.objects;
create policy "Portal: clients upload defect photos" on storage.objects for insert to authenticated
    with check (
        bucket_id = 'portal'
        and split_part(name, '/', 2) = 'defects'
        and public.is_project_member(public.portal_project_id(name))
    );
