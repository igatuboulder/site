import type { APIRoute } from 'astro';
import { inscrever } from '../../lib/servidor/inscrever';
import { ambiente } from '../../lib/servidor/ambiente';
import { precoVigente } from '../../lib/preco';
import { segredos } from '../../lib/servidor/hospedagem';
import { detalhePrevia } from '../../lib/servidor/erro';

export const prerender = false;
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, url, locals }) => {
  try {
    const env = segredos(locals);
    const entrada = await request.json().catch(() => null);
    if (!entrada || typeof entrada !== 'object') return json({ ok: false, motivo: 'invalido', erros: {} }, 400);
    const r = await inscrever(entrada, { ...ambiente(env), baseUrl: url.origin, preco: precoVigente(env, url.hostname) });
    return json(r, r.ok ? 200 : r.motivo === 'ja_pago' ? 409 : 400);
  } catch (e) {
    console.error('inscricao', e);
    return json({ ok: false, motivo: 'erro', detalhe: detalhePrevia(url.hostname, e) }, 500);
  }
};
