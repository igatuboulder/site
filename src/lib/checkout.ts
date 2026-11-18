import type { Inscricao } from './inscricao';
import { PRECO_PASSAPORTE } from './preco';
import { EVENTO } from '../config/evento';

// Corpo do link de checkout da InfinitePay. Formato a confirmar na documentação oficial
// antes de ligar o pagamento de verdade. O CPF nunca sai do nosso servidor.
// InfiniteTag da conta que recebe. Fica só na variável de ambiente INFINITEPAY_HANDLE (painel da Netlify),
// nunca no código: o repositório é público.
export function infiniteTag(env: Record<string, string | undefined>): string {
  const tag = (env.INFINITEPAY_HANDLE ?? '').trim().replace(/^\$/, '');
  if (!tag) throw new Error('INFINITEPAY_HANDLE não configurada');
  return tag;
}

export function montarCheckout(d: Inscricao, o: { pedido: string; baseUrl: string; handle: string; preco?: number }) {
  if (!o.handle) throw new Error('InfiniteTag ausente');
  const base = o.baseUrl.replace(/\/$/, '');
  return {
    handle: o.handle,
    items: [{ quantity: 1, price: o.preco ?? PRECO_PASSAPORTE, description: `Passaporte ${EVENTO.nome} ${EVENTO.ano}` }],
    order_nsu: o.pedido,
    redirect_url: `${base}/inscricao/obrigado?pedido=${encodeURIComponent(o.pedido)}`,
    webhook_url: `${base}/api/pagamento?pedido=${encodeURIComponent(o.pedido)}`,
    customer: { name: d.nome, email: d.email, phone_number: `+55${d.telefone}` },
    // 0 = nenhuma parcela com taxa absorvida pelo festival: no cartão, quem compra paga a taxa.
    // Confirmar num pagamento de teste que vale também para o cartão à vista.
    // Sem etapa de endereço (não há entrega) e link vale para um pagamento só.
    options: { assured_installments: 0, require_delivery_address: false, single_payment: true },
  };
}
