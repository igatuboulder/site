// Roda só no servidor. Valida, grava a inscrição como pendente e cria o link da InfinitePay.
// O preço vem sempre daqui (montarCheckout), nunca do formulário.
import { validarInscricao, type Inscricao } from '../inscricao';
import { montarCheckout } from '../checkout';

export type Status = 'pendente' | 'pago';
export interface Pagamento { valor_pago: number; forma: 'pix' | 'cartao'; transaction_nsu: string; invoice_slug: string; receipt_url?: string }
export interface Db {
  buscarPorCpf(cpf: string): Promise<{ pedido: string; status: Status } | null>;
  criar(d: Inscricao): Promise<string>;
  atualizarPendente(pedido: string, d: Inscricao): Promise<void>;
  marcarPago(pedido: string, p: Pagamento): Promise<boolean>;
}
export type CorpoCheckout = ReturnType<typeof montarCheckout> & { options?: unknown };

interface Deps { db: Db; criarLink: (corpo: CorpoCheckout) => Promise<string>; handle: string; apiKey?: string; baseUrl: string }

export type Resposta =
  | { ok: true; pedido: string; url: string }
  | { ok: false; motivo: 'invalido'; erros: Record<string, string> }
  | { ok: false; motivo: 'ja_pago' };

export async function inscrever(entrada: Record<string, unknown>, deps: Deps): Promise<Resposta> {
  // Campo escondido: gente não vê, robô preenche.
  if (typeof entrada.site === 'string' && entrada.site.trim()) return { ok: false, motivo: 'invalido', erros: {} };
  const r = validarInscricao(entrada);
  if (!r.ok) return { ok: false, motivo: 'invalido', erros: r.erros as Record<string, string> };

  const existente = await deps.db.buscarPorCpf(r.dados.cpf);
  if (existente?.status === 'pago') return { ok: false, motivo: 'ja_pago' };
  let pedido: string;
  if (existente) { pedido = existente.pedido; await deps.db.atualizarPendente(pedido, r.dados); }
  else pedido = await deps.db.criar(r.dados);

  const corpo: CorpoCheckout = montarCheckout(r.dados, { pedido, baseUrl: deps.baseUrl, handle: deps.handle });
  // As opções (taxa do cartão para quem compra) só valem com a chave da API.
  if (!deps.apiKey) delete corpo.options;
  const url = await deps.criarLink(corpo);
  return { ok: true, pedido, url };
}
