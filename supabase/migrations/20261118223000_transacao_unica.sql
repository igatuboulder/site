-- Um pagamento confirma uma inscrição só.
create unique index if not exists inscricoes_transaction_nsu_unica on public.inscricoes (transaction_nsu) where transaction_nsu is not null;
