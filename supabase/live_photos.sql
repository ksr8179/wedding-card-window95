-- 현장 사진 테이블 + Storage 버킷
-- Supabase SQL Editor에서 실행하세요.

insert into storage.buckets (id, name, public)
values ('live-photos', 'live-photos', true)
on conflict (id) do update set public = true;

create table if not exists public.live_photos (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 20),
  message text not null default '' check (char_length(message) <= 100),
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists live_photos_created_at_idx
  on public.live_photos (created_at desc);

alter table public.live_photos enable row level security;

drop policy if exists "live_photos_select_public" on public.live_photos;
create policy "live_photos_select_public"
  on public.live_photos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "live_photos_insert_public" on public.live_photos;
create policy "live_photos_insert_public"
  on public.live_photos
  for insert
  to anon, authenticated
  with check (true);

revoke update, delete on public.live_photos from anon, authenticated;

drop policy if exists "live_photos_storage_select" on storage.objects;
create policy "live_photos_storage_select"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'live-photos');

drop policy if exists "live_photos_storage_insert" on storage.objects;
create policy "live_photos_storage_insert"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'live-photos'
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  );

alter table public.live_photos replica identity full;

do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    begin
      alter publication supabase_realtime add table public.live_photos;
    exception
      when duplicate_object then
        null;
    end;
  end if;
end $$;
