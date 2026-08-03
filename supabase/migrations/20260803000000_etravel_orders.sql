-- eTravel orders: the queue a traveller files into and a VA files out of.
--
-- Security model, stated once because everything below follows from it:
--
--   * `etravel_orders` holds real PII — a passport number and a flight. No
--     policy grants `anon` or `authenticated` any access, so with RLS enabled
--     the table is unreachable from the browser. Every read and write goes
--     through this app's route handlers using the service role key, which
--     bypasses RLS and runs only on the server.
--   * A declaration is readable by whoever holds both its `ref` and its
--     `access_key`. That pair is the bearer credential in the verify link and
--     the QR payload, the same way an agency's own reference works. `ref`
--     alone returns status only.
--   * `etravel_order_events` carries no traveller data at all — an id and a
--     kind. It exists so the owner console can subscribe to Realtime with the
--     anon key and refetch through the admin route, without the row itself
--     ever crossing RLS.

create extension if not exists pgcrypto;

create table if not exists public.etravel_orders (
  id                uuid primary key default gen_random_uuid(),
  ref               text not null unique,          -- EGOV-YYYY-NNNN, shown to the traveller
  access_key        text not null,                 -- read credential for /verify
  user_id           uuid references auth.users (id) on delete set null,
  traveler_name     text not null,
  passport_no       text,
  flight_no         text,
  departure_date    timestamptz,
  departure_airport text not null default 'NAIA Terminal 3',
  destination       text not null,
  contact           text,
  status            text not null default 'PENDING'
                    check (status in ('PENDING', 'FILING', 'FILED')),
  official_ref      text,                          -- ETR-GOV-XXXXXX from etravel.gov.ph
  qr_path           text,                          -- object path in the private bucket
  pdf_path          text,
  notes             text,
  filed_at          timestamptz,
  filed_by          text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists etravel_orders_queue_idx
  on public.etravel_orders (status, created_at desc);

alter table public.etravel_orders enable row level security;
-- Intentionally no policies: service role only. Adding a permissive policy here
-- would expose passport numbers to anyone holding the anon key.

/* ------------------------------------------------------- change feed ----- */

create table if not exists public.etravel_order_events (
  id         bigint generated always as identity primary key,
  order_id   uuid not null references public.etravel_orders (id) on delete cascade,
  kind       text not null check (kind in ('created', 'updated')),
  created_at timestamptz not null default now()
);

alter table public.etravel_order_events enable row level security;

-- Safe to read publicly: the row says something changed, never what or for whom.
drop policy if exists "order events are public" on public.etravel_order_events;
create policy "order events are public"
  on public.etravel_order_events for select
  using (true);

create or replace function public.etravel_orders_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists etravel_orders_touch_trigger on public.etravel_orders;
create trigger etravel_orders_touch_trigger
  before update on public.etravel_orders
  for each row execute function public.etravel_orders_touch();

create or replace function public.etravel_orders_emit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.etravel_order_events (order_id, kind)
  values (new.id, case when tg_op = 'INSERT' then 'created' else 'updated' end);

  return null;
end;
$$;

drop trigger if exists etravel_orders_event_trigger on public.etravel_orders;
create trigger etravel_orders_event_trigger
  after insert or update on public.etravel_orders
  for each row execute function public.etravel_orders_emit_event();

-- Realtime only needs the event feed; the orders table stays off the wire.
do $$
begin
  alter publication supabase_realtime add table public.etravel_order_events;
exception
  when duplicate_object then null;
end;
$$;

/* ----------------------------------------------------------- storage ----- */

-- Private: the QR and the agency PDF identify a traveller and their flight.
-- Route handlers hand out short-lived signed URLs instead.
insert into storage.buckets (id, name, public)
values ('etravel-filings', 'etravel-filings', false)
on conflict (id) do nothing;
