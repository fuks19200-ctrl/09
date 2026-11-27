-- Run ONLY on a dedicated shop project after verifying the auth redirect and privacy settings.
-- Existing academy/CRM tables are not touched.
begin;
create table if not exists public.shop_purchases (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 product_id text not null,
 product_name text not null,
 description text not null default '',
 amount integer not null check (amount >= 0),
 purchased_at timestamptz not null default now(),
 payment_reference text not null unique
);
alter table public.shop_purchases enable row level security;
revoke all on public.shop_purchases from anon, authenticated;
grant select on public.shop_purchases to authenticated;
grant all on public.shop_purchases to service_role;
create policy shop_read_own_purchases on public.shop_purchases for select to authenticated using ((select auth.uid()) = user_id);
create index if not exists shop_purchases_user_idx on public.shop_purchases(user_id);
commit;
-- Purchase rows must be written by a verified payment integration or trusted administrator.
