// Recebe o aviso da InfinitePay (webhook) e a volta do checkout. Em ambos, confirma direto na InfinitePay.
import type { APIRoute } from 'astro';
import { confirmarPagamento } from '../../lib/servidor/confirmar';
import { ambiente } from '../../lib/servidor/ambiente';
import { precoVigente } from '../../lib/preco';

export const prerender = false;
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const corpo = await request.json().catch(() => null);
    if (!corpo || typeof corpo !== 'object') return json({ pago: false }, 400);
    const { db, handle, paymentCheck } = ambiente();
    return json(await confirmarPagamento(corpo, { db, handle, paymentCheck, preco: precoVigente(process.env, url.hostname) }));
  } catch (e) {
    console.error('pagamento', e);
    return json({ pago: false }, 500);
  }
};
