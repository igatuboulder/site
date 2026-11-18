-- 2027: só P, M, G e GG.
alter table public.inscricoes drop constraint if exists inscricoes_camiseta_check;
alter table public.inscricoes add constraint inscricoes_camiseta_check check (camiseta in ('P', 'M', 'G', 'GG'));
