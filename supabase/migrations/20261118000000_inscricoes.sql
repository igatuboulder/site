-- Inscrições do Festival IgatuBoulder.
-- Escrita só pelo servidor do site (chave secreta, fora do repositório).
-- Leitura só por organizadores logados cujo e-mail está na tabela organizadores.
-- Os e-mails dos organizadores são inseridos direto no banco, nunca aqui (repositório público).

create sequence if not exists public.pedido_seq;

create table public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  pedido text not null unique default ('IGB27-' || lpad(nextval('public.pedido_seq')::text, 4, '0')),
  nome text not null check (char_length(nome) between 3 and 120),
  cpf text not null check (cpf ~ '^[0-9]{11}$'),
  email text not null check (char_length(email) <= 200),
  telefone text not null check (telefone ~ '^[0-9]{10,11}$'),
  camiseta text not null check (camiseta in ('PP', 'P', 'M', 'G', 'GG', 'XG')),
  status text not null default 'pendente' check (status in ('pendente', 'pago')),
  aceite_termo_em timestamptz not null default now(),
  criado_em timestamptz not null default now(),
  pago_em timestamptz,
  valor_pago integer check (valor_pago is null or valor_pago > 0),
  forma text check (forma is null or forma in ('pix', 'cartao')),
  transaction_nsu text,
  invoice_slug text,
  receipt_url text
);
create index inscricoes_cpf_idx on public.inscricoes (cpf);
create index inscricoes_status_idx on public.inscricoes (status);

create table public.organizadores (
  email text primary key check (email = lower(email))
);

alter table public.inscricoes enable row level security;
alter table public.organizadores enable row level security;

revoke all on public.inscricoes from anon, authenticated;
revoke all on public.organizadores from anon, authenticated;
revoke all on sequence public.pedido_seq from anon, authenticated;
grant select on public.inscricoes to authenticated;
grant select on public.organizadores to authenticated;

create policy "organizador vê o próprio cadastro" on public.organizadores
  for select to authenticated
  using (email = lower((select auth.jwt() ->> 'email')));

create policy "organizadores leem as inscrições" on public.inscricoes
  for select to authenticated
  using (exists (select 1 from public.organizadores o where o.email = lower((select auth.jwt() ->> 'email'))));
