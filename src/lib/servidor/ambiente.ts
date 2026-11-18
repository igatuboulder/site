// Liga as regras às peças de verdade: banco (chave secreta) e InfinitePay. Só no servidor.
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '../../config/supabase';
import { infiniteTag } from '../checkout';
import type { Db, CorpoCheckout } from './inscrever';
import type { RespostaCheck } from './confirmar';

const API = 'https://api.checkout.infinitepay.io';

export function ambiente(env: Record<string, string | undefined> = process.env) {
  const segredo = env.SUPABASE_SECRET_KEY;
  if (!segredo) throw new Error('SUPABASE_SECRET_KEY não configurada');
  const handle = infiniteTag(env);
  const apiKey = env.INFINITEPAY_API_KEY?.trim() || undefined;
  const sb = createClient(SUPABASE_URL, segredo, { auth: { persistSession: false, autoRefreshToken: false } });

  const db: Db = {
    async buscarPorCpf(cpf) {
      const { data, error } = await sb.from('inscricoes').select('pedido,status').eq('cpf', cpf).order('criado_em', { ascending: false });
      if (error) throw error;
      return data.find((x) => x.status === 'pago') ?? data[0] ?? null;
    },
    async criar(d) {
      const { data, error } = await sb.from('inscricoes').insert({ nome: d.nome, cpf: d.cpf, email: d.email, telefone: d.telefone, camiseta: d.camiseta }).select('pedido').single();
      if (error) throw error;
      return data.pedido;
    },
    async atualizarPendente(pedido, d) {
      const { error } = await sb.from('inscricoes').update({ nome: d.nome, email: d.email, telefone: d.telefone, camiseta: d.camiseta, aceite_termo_em: new Date().toISOString() }).eq('pedido', pedido).eq('status', 'pendente');
      if (error) throw error;
    },
    async marcarPago(pedido, p) {
      const { data, error } = await sb.from('inscricoes').update({ status: 'pago', pago_em: new Date().toISOString(), ...p }).eq('pedido', pedido).eq('status', 'pendente').select('pedido');
      if (error) throw error;
      return data.length > 0;
    },
    async estaPago(pedido) {
      const { data, error } = await sb.from('inscricoes').select('status').eq('pedido', pedido).maybeSingle();
      if (error) throw error;
      return data?.status === 'pago';
    },
  };

  const cabecalhos = { 'Content-Type': 'application/json', ...(apiKey ? { 'X-Api-Key': apiKey } : {}) };
  async function criarLink(corpo: CorpoCheckout) {
    const r = await fetch(`${API}/links`, { method: 'POST', headers: cabecalhos, body: JSON.stringify(corpo) });
    const j = await r.json().catch(() => ({}));
    const url = j.url ?? j.link ?? j.checkout_url;
    if (!r.ok || typeof url !== 'string') throw new Error(`InfinitePay /links ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
    return url;
  }
  async function paymentCheck(q: { handle: string; order_nsu: string; transaction_nsu: string; slug: string }): Promise<RespostaCheck> {
    const r = await fetch(`${API}/payment_check`, { method: 'POST', headers: cabecalhos, body: JSON.stringify(q) });
    return r.ok ? r.json() : {};
  }
  return { db, handle, apiKey, criarLink, paymentCheck };
}
