import type { Inscricao } from './inscricao';
import { precoEmCentavos } from './preco';
import { EVENTO } from '../config/evento';

// Corpo do link de checkout da InfinitePay. Formato a confirmar na documentação oficial
// antes de ligar o pagamento de verdade. O CPF nunca sai do nosso servidor.
export function montarCheckout(d: Inscricao, o: { pedido: string; baseUrl: string }) {
  const base = o.baseUrl.replace(/\/$/, '');
  return {
    items: [{ quantity: 1, price: precoEmCentavos(d.pagamento), description: `Passaporte ${EVENTO.nome} ${EVENTO.ano}` }],
    order_nsu: o.pedido,
    redirect_url: `${base}/inscricao/obrigado?pedido=${encodeURIComponent(o.pedido)}`,
    webhook_url: `${base}/api/pagamento`,
    customer: { name: d.nome, email: d.email, phone_number: `+55${d.telefone}` },
  };
}
