-- ─────────────────────────────────────────────────────────────
-- Industry Watch — daily AI-curated industry news
-- Run once in Supabase → SQL Editor.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.industry_news (
    id              bigint generated always as identity primary key,
    headline        text        not null,
    summary         text,
    category        text,
    source          text        not null,
    url             text        not null,
    url_key         text        not null unique,   -- normalised URL, used to avoid duplicates
    original_title  text,
    published_at    timestamptz,
    status          text        not null default 'pending'
                    check (status in ('pending', 'published', 'rejected')),
    created_at      timestamptz not null default now(),
    reviewed_at     timestamptz
);

create index if not exists industry_news_status_published_idx
    on public.industry_news (status, published_at desc);

alter table public.industry_news enable row level security;

-- Visitors can only ever see approved stories
drop policy if exists "Public reads published industry news" on public.industry_news;
create policy "Public reads published industry news"
    on public.industry_news for select
    to anon, authenticated
    using (status = 'published');

-- Logged-in admins can review, edit and delete
-- (same model as your other admin tables: any authenticated user is an admin)
drop policy if exists "Admins manage industry news" on public.industry_news;
create policy "Admins manage industry news"
    on public.industry_news for all
    to authenticated
    using (true)
    with check (true);

-- The daily job writes with the service-role key, which bypasses RLS.
