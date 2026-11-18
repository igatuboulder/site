-- Entrega de kits no dia do festival.
-- Só organizadores logados, só inscrição paga, e o mesmo kit não sai duas vezes
-- (dois voluntários tocando ao mesmo tempo: o segundo recebe "já entregue").
alter table public.inscricoes
  add column if not exists kit_entregue_em timestamptz,
  add column if not exists kit_entregue_por text;

-- entregar = true marca a entrega; entregar = false desfaz (toque errado).
-- Devolve: 'entregue', 'ja_entregue' (com quem e quando), 'desfeito', 'nao_pago' ou 'sem_acesso'.
create or replace function public.entregar_kit(p_pedido text, p_entregar boolean default true)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower((select auth.jwt() ->> 'email'));
  v_linha public.inscricoes%rowtype;
begin
  if v_email is null or not exists (select 1 from public.organizadores o where o.email = v_email) then
    return jsonb_build_object('resultado', 'sem_acesso');
  end if;

  if not p_entregar then
    update public.inscricoes set kit_entregue_em = null, kit_entregue_por = null
      where pedido = p_pedido and status = 'pago';
    return jsonb_build_object('resultado', 'desfeito');
  end if;

  update public.inscricoes set kit_entregue_em = now(), kit_entregue_por = v_email
    where pedido = p_pedido and status = 'pago' and kit_entregue_em is null
    returning * into v_linha;
  if found then
    return jsonb_build_object('resultado', 'entregue', 'em', v_linha.kit_entregue_em, 'por', v_linha.kit_entregue_por);
  end if;

  select * into v_linha from public.inscricoes where pedido = p_pedido;
  if not found or v_linha.status <> 'pago' then
    return jsonb_build_object('resultado', 'nao_pago');
  end if;
  return jsonb_build_object('resultado', 'ja_entregue', 'em', v_linha.kit_entregue_em, 'por', v_linha.kit_entregue_por);
end;
$$;

revoke all on function public.entregar_kit(text, boolean) from public, anon;
grant execute on function public.entregar_kit(text, boolean) to authenticated;
