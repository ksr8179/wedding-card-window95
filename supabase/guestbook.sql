-- 방명록 테이블 + 비밀번호 검증 삭제 RPC
-- Supabase SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 20),
  message text not null check (char_length(message) between 1 and 300),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx
  on public.guestbook (created_at desc);

alter table public.guestbook enable row level security;

drop policy if exists "guestbook_select_public" on public.guestbook;
create policy "guestbook_select_public"
  on public.guestbook
  for select
  to anon, authenticated
  using (true);

drop policy if exists "guestbook_insert_public" on public.guestbook;
create policy "guestbook_insert_public"
  on public.guestbook
  for insert
  to anon, authenticated
  with check (true);

-- 직접 DELETE는 막고, 아래 RPC로만 삭제합니다.
revoke delete on public.guestbook from anon, authenticated;

create or replace function public.delete_guestbook_entry(
  p_id uuid,
  p_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  deleted_count integer;
  incoming_hash text;
begin
  if p_password is null or char_length(p_password) < 4 then
    return false;
  end if;

  incoming_hash := encode(digest(p_password, 'sha256'), 'hex');

  delete from public.guestbook
  where id = p_id
    and password_hash = incoming_hash;

  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

revoke all on function public.delete_guestbook_entry(uuid, text) from public;
grant execute on function public.delete_guestbook_entry(uuid, text) to anon, authenticated;

-- Realtime
alter table public.guestbook replica identity full;

do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    begin
      alter publication supabase_realtime add table public.guestbook;
    exception
      when duplicate_object then
        null;
    end;
  end if;
end $$;
