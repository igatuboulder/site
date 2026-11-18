// Confirma um pagamento perguntando direto à InfinitePay (/payment_check).
// O aviso (webhook) e a volta do checkout não têm assinatura: nunca confiamos neles sozinhos.
import { PRECO_PASSAPORTE } from '../preco';
import type { Db } from './inscrever';

export interface RespostaCheck { success?: boolean; paid?: boolean; amount?: number; paid_amount?: number; installments?: number; capture_method?: string }
interface Deps { db: Db; handle: string; preco?: number; paymentCheck: (q: { handle: string; order_nsu: string; transaction_nsu: string; slug: string }) => Promise<RespostaCheck> }

const texto = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 200) : '');

export async function confirmarPagamento(p: Record<string, unknown>, deps: Deps): Promise<{ pago: boolean }> {
  const order_nsu = texto(p.order_nsu), transaction_nsu = texto(p.transaction_nsu), slug = texto(p.slug ?? p.invoice_slug);
  if (!order_nsu || !transaction_nsu || !slug) return { pago: false };
  const r = await deps.paymentCheck({ handle: deps.handle, order_nsu, transaction_nsu, slug });
  if (!r.success || !r.paid) return { pago: false };
  if (!r.amount || r.amount < (deps.preco ?? PRECO_PASSAPORTE) || !r.paid_amount || r.paid_amount < r.amount) return { pago: false };
  // A InfinitePay pode trocar o order_nsu pelo número dela; o nosso pedido volta no parâmetro "pedido".
  const pedido = texto(p.pedido) || order_nsu;
  const receipt = texto(p.receipt_url);
  const marcou = await deps.db.marcarPago(pedido, {
    valor_pago: r.paid_amount,
    forma: r.capture_method === 'pix' ? 'pix' : 'cartao',
    transaction_nsu, invoice_slug: slug,
    ...(receipt.startsWith('https://') ? { receipt_url: receipt } : {}),
  });
  return { pago: marcou || (await deps.db.estaPago(pedido)) };
}
