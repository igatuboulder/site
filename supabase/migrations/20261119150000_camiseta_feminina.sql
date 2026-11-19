-- 2027: camiseta feminina com tamanho único (FEM); masculina de P a GG.
alter table public.inscricoes drop constraint if exists inscricoes_camiseta_check;
alter table public.inscricoes add constraint inscricoes_camiseta_check check (camiseta in ('FEM', 'P', 'M', 'G', 'GG'));
