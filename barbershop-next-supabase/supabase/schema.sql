-- BarberShop Elite - Supabase schema
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('client', 'admin');
create type public.appointment_status as enum ('pending', 'confirmed', 'rejected', 'completed', 'no_show');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now()
);

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'BarberShop Elite',
  whatsapp_phone text not null default '5527999999999',
  address text default 'Rua Principal, 123 - Centro',
  instagram text default '@barbershopelite',
  hero_title text default 'Corte limpo, barba alinhada e horário confirmado.',
  hero_description text default 'Uma barbearia moderna para quem quer praticidade, estilo e organização.',
  created_at timestamptz not null default now()
);

create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  duration_minutes integer not null default 30,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  weekday integer not null check (weekday between 0 and 6),
  opens_at time not null,
  closes_at time not null,
  is_open boolean not null default true,
  unique (weekday)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  barber_id uuid references public.barbers(id) on delete set null,
  barber_name text not null,
  appointment_date date not null,
  appointment_time time not null,
  price numeric(10,2) not null default 0,
  status public.appointment_status not null default 'pending',
  notes text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.business_settings (business_name, whatsapp_phone, address, instagram)
select 'BarberShop Elite', '5527999999999', 'Rua Principal, 123 - Centro', '@barbershopelite'
where not exists (select 1 from public.business_settings);

insert into public.barbers (name)
select v.name
from (values ('Dani'), ('Carlos'), ('Lucas')) as v(name)
where not exists (select 1 from public.barbers);

insert into public.services (name, description, price, duration_minutes)
select * from (
  values
  ('Corte masculino', 'Degradê, social, navalhado, moderno ou clássico.', 40.00, 40),
  ('Barba completa', 'Modelagem, toalha quente, navalha e finalização.', 30.00, 30),
  ('Combo corte + barba', 'Experiência completa para sair pronto.', 65.00, 70),
  ('Sobrancelha', 'Alinhamento e acabamento rápido.', 20.00, 15)
) as v(name, description, price, duration_minutes)
where not exists (select 1 from public.services);

insert into public.availability (weekday, opens_at, closes_at, is_open)
select * from (
  values
  (0, '09:00'::time, '14:00'::time, false),
  (1, '09:00'::time, '20:00'::time, true),
  (2, '09:00'::time, '20:00'::time, true),
  (3, '09:00'::time, '20:00'::time, true),
  (4, '09:00'::time, '20:00'::time, true),
  (5, '09:00'::time, '20:00'::time, true),
  (6, '09:00'::time, '18:00'::time, true)
) as v(weekday, opens_at, closes_at, is_open)
on conflict (weekday) do nothing;

alter table public.profiles enable row level security;
alter table public.business_settings enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.appointments enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
on public.profiles for update
using (id = auth.uid() or public.is_admin());

drop policy if exists "public read settings" on public.business_settings;
create policy "public read settings"
on public.business_settings for select
to anon, authenticated
using (true);

drop policy if exists "admin manage settings" on public.business_settings;
create policy "admin manage settings"
on public.business_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read active barbers" on public.barbers;
create policy "public read active barbers"
on public.barbers for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "admin manage barbers" on public.barbers;
create policy "admin manage barbers"
on public.barbers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read active services" on public.services;
create policy "public read active services"
on public.services for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "admin manage services" on public.services;
create policy "admin manage services"
on public.services for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read availability" on public.availability;
create policy "public read availability"
on public.availability for select
to anon, authenticated
using (true);

drop policy if exists "admin manage availability" on public.availability;
create policy "admin manage availability"
on public.availability for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "client read own appointments" on public.appointments;
create policy "client read own appointments"
on public.appointments for select
to authenticated
using (client_id = auth.uid() or public.is_admin());

drop policy if exists "client create own appointments" on public.appointments;
create policy "client create own appointments"
on public.appointments for insert
to authenticated
with check (client_id = auth.uid());

drop policy if exists "admin update appointments" on public.appointments;
create policy "admin update appointments"
on public.appointments for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin delete appointments" on public.appointments;
create policy "admin delete appointments"
on public.appointments for delete
to authenticated
using (public.is_admin());
