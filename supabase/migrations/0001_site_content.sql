-- Conteúdo editável do site + fotos.
-- Rode no SQL Editor do Supabase (ou com `supabase db push`). Pode rodar de
-- novo sem problema: só cria o que ainda não existe e reaplica as regras.

-- ---------------------------------------------------------------------------
-- Quem pode editar: só e-mails cadastrados aqui, mesmo que alguém consiga
-- criar uma conta no Auth.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
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
create table if not exists public.site_versions (
  id bigint generated always as identity primary key,
  content jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  created_by_email text default (auth.jwt() ->> 'email')
);

create index if not exists site_versions_created_at_idx on public.site_versions (created_at desc);

alter table public.site_versions enable row level security;

-- O conteúdo é público (é o próprio site).
drop policy if exists "Qualquer um lê as versões" on public.site_versions;
create policy "Qualquer um lê as versões"
  on public.site_versions for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins publicam versões" on public.site_versions;
create policy "Admins publicam versões"
  on public.site_versions for insert
  to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Permissões explícitas da Data API. Necessárias quando o projeto é criado
-- com "Automatically expose new tables" desligado (recomendado); sem efeito
-- quando está ligado. As regras de quem pode o quê continuam no RLS acima.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.site_versions to anon, authenticated;
grant insert on public.site_versions to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

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
)
on conflict (id) do nothing;

drop policy if exists "Admins enviam fotos" on storage.objects;
create policy "Admins enviam fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins atualizam fotos" on storage.objects;
create policy "Admins atualizam fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins apagam fotos" on storage.objects;
create policy "Admins apagam fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Conferência: todas as colunas devem vir "true".
-- ---------------------------------------------------------------------------
select
  has_table_privilege('anon', 'public.site_versions', 'select')          as site_le_conteudo,
  has_table_privilege('authenticated', 'public.site_versions', 'insert') as painel_publica,
  exists (select 1 from storage.buckets where id = 'site-images')        as bucket_de_fotos,
  (select count(*) = 3 from pg_policies
     where schemaname = 'storage' and policyname like 'Admins%')         as regras_das_fotos,
  (select count(*) > 0 from auth.users u
     join public.admins a on lower(a.email) = lower(u.email))            as tem_editor_com_login;
