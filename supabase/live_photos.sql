-- 현장 사진 테이블 + Storage 버킷 + 비밀번호 삭제 RPC
-- Supabase SQL Editor에서 실행하세요. (기존 배포면 이 파일 전체를 다시 실행)

insert into storage.buckets (id, name, public)
values ('live-photos', 'live-photos', true)
on conflict (id) do update set public = true;

create table if not exists public.live_photos (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 20),
  message text not null default '' check (char_length(message) <= 100),
  storage_path text not null,
  password_hash text not null default '',
  created_at timestamptz not null default now()
);

alter table public.live_photos
  add column if not exists password_hash text not null default '';

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
  with check (
    (timezone('Asia/Seoul', now()))::date >= date '2026-09-20'
  );

revoke update, delete on public.live_photos from anon, authenticated;

create extension if not exists pgcrypto;

create or replace function public.delete_live_photo(
  p_id uuid,
  p_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, storage, extensions
as $$
declare
  deleted_path text;
  incoming_hash text;
begin
  if p_password is null or char_length(p_password) < 4 then
    return false;
  end if;

  incoming_hash := encode(digest(p_password, 'sha256'), 'hex');

  delete from public.live_photos
  where id = p_id
    and password_hash = incoming_hash
  returning storage_path into deleted_path;

  if deleted_path is null then
    return false;
  end if;

  delete from storage.objects
  where bucket_id = 'live-photos'
    and name = deleted_path;

  return true;
end;
$$;

revoke all on function public.delete_live_photo(uuid, text) from public;
grant execute on function public.delete_live_photo(uuid, text) to anon, authenticated;

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
    and (timezone('Asia/Seoul', now()))::date >= date '2026-09-20'
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
