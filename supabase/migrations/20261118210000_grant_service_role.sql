-- O servidor do site (chave secreta = papel service_role) precisa ler e gravar as inscrições.
-- Projetos novos do Supabase não dão essas permissões sozinhos.
grant select, insert, update on public.inscricoes to service_role;
grant select on public.organizadores to service_role;
grant usage, select on sequence public.pedido_seq to service_role;
