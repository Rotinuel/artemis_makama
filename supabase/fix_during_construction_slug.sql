-- Fixes the misspelt portfolio URL /portfolio/during-contrustion
-- (the site now redirects the old address to /portfolio/during-construction).
-- Run once in Supabase → SQL Editor.
update public.gallery_categories
set slug = 'during-construction'
where slug = 'during-contrustion';
-- Also correct the display name if it carries the same typo:
update public.gallery_categories
set name = replace(name, 'Contrustion', 'Construction')
where name ilike '%contrustion%';
