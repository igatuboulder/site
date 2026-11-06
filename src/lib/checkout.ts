import type { Inscricao } from './inscricao';
import { PRECO_PASSAPORTE } from './preco';
import { EVENTO } from '../config/evento';

// Corpo do link de checkout da InfinitePay. Formato a confirmar na documentação oficial
// antes de ligar o pagamento de verdade. O CPF nunca sai do nosso servidor.
export function montarCheckout(d: Inscricao, o: { pedido: string; baseUrl: string }) {
  const base = o.baseUrl.replace(/\/$/, '');
  return {
    items: [{ quantity: 1, price: PRECO_PASSAPORTE, description: `Passaporte ${EVENTO.nome} ${EVENTO.ano}` }],
    order_nsu: o.pedido,
    redirect_url: `${base}/inscricao/obrigado?pedido=${encodeURIComponent(o.pedido)}`,
    webhook_url: `${base}/api/pagamento`,
    customer: { name: d.nome, email: d.email, phone_number: `+55${d.telefone}` },
    // 0 = nenhuma parcela com taxa absorvida pelo festival: no cartão, quem compra paga a taxa.
    // Confirmar num pagamento de teste que vale também para o cartão à vista.
    options: { assured_installments: 0 },
  };
}
