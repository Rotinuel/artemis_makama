-- ═════════════════════════════════════════════════════════════
-- WEBSITE ENQUIRIES + NEWSLETTER  (from the SEO & conversion audit)
-- Run once in Supabase → SQL Editor. Safe to re-run.
--
--  1. consultation_leads gets the extra fields the contact form and the
--     time-zone booking picker send (email, phone, message, call slot…).
--  2. newsletter_subscribers stores "subscribe" sign-ups (news + monthly
--     material prices). Anyone can sign up; only admins can read the list.
-- ═════════════════════════════════════════════════════════════

alter table public.consultation_leads
    add column if not exists email          text,
    add column if not exists phone          text,
    add column if not exists message        text,
    add column if not exists project_type   text,
    add column if not exists inquiry        text,
    add column if not exists organization   text,
    add column if not exists preferred_slot timestamptz,
    add column if not exists timezone       text,
    add column if not exists page           text;

-- The contact form doesn't always ask where someone is building
do $$
begin
    begin alter table public.consultation_leads alter column country  drop not null; exception when others then null; end;
    begin alter table public.consultation_leads alter column location drop not null; exception when others then null; end;
end $$;

create table if not exists public.newsletter_subscribers (
    id          bigint generated always as identity primary key,
    email       text not null,
    list        text not null default 'news' check (list in ('news', 'material-prices', 'cost-guide')),
    source_page text,
    created_at  timestamptz not null default now(),
    unique (email, list)
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
    for insert to anon, authenticated with check (true);

-- Reading the list: admins only (uses is_admin() from client_portal.sql when present)
drop policy if exists "Admins read subscribers" on public.newsletter_subscribers;
do $$
begin
    if exists (select 1 from pg_proc where proname = 'is_admin' and pronamespace = 'public'::regnamespace) then
        execute 'create policy "Admins read subscribers" on public.newsletter_subscribers for select to authenticated using (public.is_admin())';
    else
        execute 'create policy "Admins read subscribers" on public.newsletter_subscribers for select to authenticated using (true)';
    end if;
end $$;
