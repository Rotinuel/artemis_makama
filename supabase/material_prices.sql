-- ─────────────────────────────────────────────────────────────
-- Building material prices (News + Events price board)
-- Run once in Supabase → SQL Editor.
--
-- Every price is a row. The newest *published* row per item + city is the
-- current price; the one before it is used for the ▲▼ change indicator.
-- AI suggestions arrive as status = 'pending' until an admin approves.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.material_prices (
    id              bigint generated always as identity primary key,
    item_key        text        not null,          -- e.g. 'cement' (see lib/material-prices/items.js)
    city            text        not null,          -- 'Lagos' | 'Abuja' | 'Port Harcourt'
    price_min       numeric     not null check (price_min > 0),
    price_max       numeric     check (price_max is null or price_max >= price_min),
    source_name     text,
    source_url      text,
    source_date     date,
    note            text,
    effective_date  date        not null default (now() at time zone 'Africa/Lagos')::date,
    origin          text        not null default 'manual' check (origin in ('ai', 'manual')),
    status          text        not null default 'pending'
                    check (status in ('pending', 'published', 'rejected')),
    created_at      timestamptz not null default now(),
    reviewed_at     timestamptz
);

create index if not exists material_prices_lookup_idx
    on public.material_prices (item_key, city, status, effective_date desc, created_at desc);

alter table public.material_prices enable row level security;

drop policy if exists "Public reads published material prices" on public.material_prices;
create policy "Public reads published material prices"
    on public.material_prices for select
    to anon, authenticated
    using (status = 'published');

drop policy if exists "Admins manage material prices" on public.material_prices;
create policy "Admins manage material prices"
    on public.material_prices for all
    to authenticated
    using (true)
    with check (true);
