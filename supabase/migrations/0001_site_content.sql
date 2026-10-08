-- Conteúdo editável do site + fotos.
-- Rode uma vez no SQL Editor do Supabase (ou com `supabase db push`).

-- ---------------------------------------------------------------------------
-- Quem pode editar: só e-mails cadastrados aqui, mesmo que alguém consiga
-- criar uma conta no Auth.
-- ---------------------------------------------------------------------------
create table public.admins (
  email text primary key
);

alter table public.admins enable row level security;
-- Sem policies: a tabela não é lida nem alterada pela API, só pelo SQL Editor.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- ---------------------------------------------------------------------------
-- Cada "Publicar" grava uma versão nova. O site mostra sempre a mais recente,
-- e as anteriores formam o histórico (para desfazer).
-- ---------------------------------------------------------------------------
create table public.site_versions (
  id bigint generated always as identity primary key,
  content jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  created_by_email text default (auth.jwt() ->> 'email')
);

create index site_versions_created_at_idx on public.site_versions (created_at desc);

alter table public.site_versions enable row level security;

-- O conteúdo é público (é o próprio site).
create policy "Qualquer um lê as versões"
  on public.site_versions for select
  to anon, authenticated
  using (true);

create policy "Admins publicam versões"
  on public.site_versions for insert
  to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Fotos do site
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880, -- 5 MB (o painel já comprime antes de enviar)
  array['image/jpeg', 'image/png', 'image/webp']
);

create policy "Admins enviam fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

create policy "Admins atualizam fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

create policy "Admins apagam fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());
