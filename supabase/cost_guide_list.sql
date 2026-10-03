-- ═════════════════════════════════════════════════════════════
--  Cost guide sign-ups
--  Run once in Supabase → SQL Editor (after seo_conversion.sql).
--  Lets /cost-guide store emails in newsletter_subscribers with
--  list = 'cost-guide'. Safe to run more than once.
-- ═════════════════════════════════════════════════════════════

alter table public.newsletter_subscribers
    drop constraint if exists newsletter_subscribers_list_check;

alter table public.newsletter_subscribers
    add constraint newsletter_subscribers_list_check
    check (list in ('news', 'material-prices', 'cost-guide'));
