-- ═════════════════════════════════════════════════════════════
--  Client reviews (the /review form)
--  Run once in Supabase → SQL Editor. Safe to run more than once.
--
--  How it works:
--   • Clients submit a review at artemisatelierltd.com/review.
--     It is saved here with status = 'pending'. Nothing is published yet.
--   • To publish one: Supabase → Table Editor → client_reviews →
--     change its status to 'approved'. It appears on the homepage within
--     about 10 minutes and on Build from Abroad within a day.
--   • Set status to 'rejected' to hide it. Only approve real clients.
--   • The website can only read approved reviews, through the
--     public_reviews view, which never exposes emails.
-- ═════════════════════════════════════════════════════════════

create table if not exists public.client_reviews (
    id            bigint generated always as identity primary key,
    name          text not null,
    publish_name  boolean not null default false,
    email         text not null,
    location      text,
    project       text,
    year          text,
    rating        int  check (rating between 1 and 5),
    quote         text not null,
    status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    source_page   text,
    created_at    timestamptz not null default now()
);

alter table public.client_reviews enable row level security;

-- Anyone can submit, but only as 'pending'
drop policy if exists "Anyone can submit a review" on public.client_reviews;
create policy "Anyone can submit a review" on public.client_reviews
    for insert to anon, authenticated with check (status = 'pending');

-- Admins can read and moderate (uses is_admin() from client_portal.sql when present)
do $$
begin
    if exists (select 1 from pg_proc where proname = 'is_admin' and pronamespace = 'public'::regnamespace) then
        execute 'drop policy if exists "Admins manage reviews" on public.client_reviews';
        execute 'create policy "Admins manage reviews" on public.client_reviews for all to authenticated using (public.is_admin()) with check (public.is_admin())';
    end if;
end $$;

-- What the website shows: approved reviews only, no emails.
-- Name is shown in full only when the client ticked "publish my name";
-- otherwise first name + initial (e.g. "Ada O.").
create or replace view public.public_reviews as
select
    id,
    case when publish_name then name
         else split_part(trim(name), ' ', 1) ||
              case when position(' ' in trim(name)) > 0
                   then ' ' || left(split_part(trim(name), ' ', 2), 1) || '.'
                   else '' end
    end as display_name,
    location, project, year, rating, quote, created_at
from public.client_reviews
where status = 'approved';

grant select on public.public_reviews to anon, authenticated;
