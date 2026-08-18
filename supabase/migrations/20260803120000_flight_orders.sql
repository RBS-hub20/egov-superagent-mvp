-- Flight orders — the booking half of the flights + eTravel bundle.
--
-- Same security model as etravel_orders, and for the same reason: this table
-- holds a passenger name, a passport number and an itinerary. RLS is on with
-- no policies, so the browser cannot reach it; every read and write goes
-- through this app's route handlers using the service role key.
--
-- `etravel_ref` is the link to the declaration raised alongside the booking.
-- It is a plain text reference rather than a foreign key so a booking survives
-- if the declaration is ever purged.

create extension if not exists pgcrypto;

create table if not exists public.flight_orders (
  id             uuid primary key default gen_random_uuid(),
  ref            text not null unique,          -- FLT-YYYY-NNNN, shown to the passenger
  etravel_ref    text,                          -- EGOV-YYYY-NNNN raised with this booking
  passenger_name text not null,
  passport_no    text,
  contact        text,
  origin         text not null,
  destination    text not null,
  departure_date timestamptz,
  airline        text,
  flight_no      text,
  -- Money in whole pesos: these are demonstration fares, not a payment record.
  base_price     integer not null default 0,
  markup         integer not null default 0,
  total_price    integer not null default 0,
  currency       text    not null default 'PHP',
  status         text    not null default 'PENDING'
                 check (status in ('PENDING', 'CONFIRMED', 'CANCELLED')),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists flight_orders_queue_idx
  on public.flight_orders (status, created_at desc);

alter table public.flight_orders enable row level security;
-- Intentionally no policies: service role only.

create or replace function public.flight_orders_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists flight_orders_touch_trigger on public.flight_orders;
create trigger flight_orders_touch_trigger
  before update on public.flight_orders
  for each row execute function public.flight_orders_touch();
