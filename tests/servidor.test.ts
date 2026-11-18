import { describe, it, expect, vi } from 'vitest';
import { inscrever, type Db } from '../src/lib/servidor/inscrever';
import { confirmarPagamento } from '../src/lib/servidor/confirmar';

const valido = { nome: 'Ana Souza', cpf: '529.982.247-25', email: 'ana@exemplo.com', telefone: '(75) 98170-7643', camiseta: 'M', aceite: 'on' };

function dbFalso(o: Partial<Db> = {}): Db {
  return {
    buscarPorCpf: vi.fn(async () => null),
    criar: vi.fn(async () => 'IGB27-0001'),
    atualizarPendente: vi.fn(async () => {}),
    marcarPago: vi.fn(async () => true),
    ...o,
  };
}

describe('inscrever', () => {
  const base = { handle: 'loja_teste', baseUrl: 'https://site.com.br' };

  it('recusa dados inválidos sem tocar no banco nem na InfinitePay', async () => {
    const db = dbFalso(); const link = vi.fn();
    const r = await inscrever({ ...valido, cpf: '111' }, { ...base, db, criarLink: link });
    expect(r.ok).toBe(false);
    expect(db.criar).not.toHaveBeenCalled();
    expect(link).not.toHaveBeenCalled();
  });

  it('grava como pendente e devolve o link do checkout', async () => {
    const db = dbFalso(); const link = vi.fn(async () => 'https://checkout.infinitepay.io/x');
    const r = await inscrever(valido, { ...base, db, criarLink: link });
    expect(r).toEqual({ ok: true, pedido: 'IGB27-0001', url: 'https://checkout.infinitepay.io/x' });
    expect(db.criar).toHaveBeenCalledWith(expect.objectContaining({ cpf: '52998224725', telefone: '75981707643' }));
    const corpo = link.mock.calls[0][0];
    expect(corpo.handle).toBe('loja_teste');
    expect(corpo.order_nsu).toBe('IGB27-0001');
    expect(corpo.items[0].price).toBe(16000);
  });

  it('o preço vem do servidor, mesmo que o formulário mande outro', async () => {
    const link = vi.fn(async () => 'u');
    await inscrever({ ...valido, preco: '1', price: '1' }, { ...base, db: dbFalso(), criarLink: link });
    expect(link.mock.calls[0][0].items[0].price).toBe(16000);
  });

  it('reaproveita a inscrição pendente do mesmo CPF em vez de duplicar', async () => {
    const db = dbFalso({ buscarPorCpf: vi.fn(async () => ({ pedido: 'IGB27-0007', status: 'pendente' as const })) });
    const link = vi.fn(async () => 'u');
    const r = await inscrever(valido, { ...base, db, criarLink: link });
    expect(r).toMatchObject({ ok: true, pedido: 'IGB27-0007' });
    expect(db.criar).not.toHaveBeenCalled();
    expect(db.atualizarPendente).toHaveBeenCalled();
  });

  it('avisa quando o CPF já tem inscrição paga', async () => {
    const db = dbFalso({ buscarPorCpf: vi.fn(async () => ({ pedido: 'IGB27-0003', status: 'pago' as const })) });
    const link = vi.fn();
    const r = await inscrever(valido, { ...base, db, criarLink: link });
    expect(r).toMatchObject({ ok: false, motivo: 'ja_pago' });
    expect(link).not.toHaveBeenCalled();
  });

  it('só manda as opções de taxa quando há chave da API (a InfinitePay exige)', async () => {
    const link = vi.fn(async () => 'u');
    await inscrever(valido, { ...base, db: dbFalso(), criarLink: link });
    expect(link.mock.calls[0][0].options).toBeUndefined();
    await inscrever(valido, { ...base, apiKey: 'k', db: dbFalso(), criarLink: link });
    expect(link.mock.calls[1][0].options).toEqual({ assured_installments: 0 });
  });

  it('ignora robôs que preenchem o campo escondido', async () => {
    const db = dbFalso(); const link = vi.fn();
    const r = await inscrever({ ...valido, site: 'http://spam' }, { ...base, db, criarLink: link });
    expect(r.ok).toBe(false);
    expect(db.criar).not.toHaveBeenCalled();
  });
});

describe('confirmarPagamento', () => {
  const dados = { order_nsu: 'IGB27-0001', transaction_nsu: 't1', slug: 's1', receipt_url: 'https://recibo' };
  const pago = { success: true, paid: true, amount: 16000, paid_amount: 16000, installments: 1, capture_method: 'pix' };

  it('nunca confia no aviso: sempre pergunta à InfinitePay', async () => {
    const db = dbFalso(); const check = vi.fn(async () => ({ ...pago, paid: false }));
    const r = await confirmarPagamento(dados, { db, handle: 'loja_teste', paymentCheck: check });
    expect(check).toHaveBeenCalledWith({ handle: 'loja_teste', order_nsu: 'IGB27-0001', transaction_nsu: 't1', slug: 's1' });
    expect(r.pago).toBe(false);
    expect(db.marcarPago).not.toHaveBeenCalled();
  });

  it('marca como pago com o valor que entrou de fato', async () => {
    const db = dbFalso(); const check = vi.fn(async () => ({ ...pago, capture_method: 'credit_card', paid_amount: 16700 }));
    const r = await confirmarPagamento(dados, { db, handle: 'loja_teste', paymentCheck: check });
    expect(r.pago).toBe(true);
    expect(db.marcarPago).toHaveBeenCalledWith('IGB27-0001', { valor_pago: 16700, forma: 'cartao', transaction_nsu: 't1', invoice_slug: 's1', receipt_url: 'https://recibo' });
  });

  it('recusa pagamento com valor menor que o passaporte', async () => {
    const db = dbFalso(); const check = vi.fn(async () => ({ ...pago, amount: 100, paid_amount: 100 }));
    const r = await confirmarPagamento(dados, { db, handle: 'loja_teste', paymentCheck: check });
    expect(r.pago).toBe(false);
    expect(db.marcarPago).not.toHaveBeenCalled();
  });

  it('recusa chamada incompleta sem perguntar nada', async () => {
    const check = vi.fn();
    const r = await confirmarPagamento({ order_nsu: 'IGB27-0001' }, { db: dbFalso(), handle: 'h', paymentCheck: check });
    expect(r.pago).toBe(false);
    expect(check).not.toHaveBeenCalled();
  });
});

describe('preço de teste (só na prévia)', () => {
  it('vale só com a variável E num endereço de prévia', async () => {
    const { precoVigente } = await import('../src/lib/preco');
    expect(precoVigente({ PRECO_TESTE_CENTAVOS: '100' }, 'deploy-preview-18--igatuboulder.netlify.app')).toBe(100);
    expect(precoVigente({ PRECO_TESTE_CENTAVOS: '100' }, 'igatuboulder.netlify.app')).toBe(16000);
    expect(precoVigente({ PRECO_TESTE_CENTAVOS: '100' }, 'igatuboulder.com.br')).toBe(16000);
    expect(precoVigente({}, 'deploy-preview-18--igatuboulder.netlify.app')).toBe(16000);
  });
  it('nunca abaixo de R$ 1 nem acima do preço real', async () => {
    const { precoVigente } = await import('../src/lib/preco');
    expect(precoVigente({ PRECO_TESTE_CENTAVOS: '10' }, 'deploy-preview-1--igatuboulder.netlify.app')).toBe(100);
    expect(precoVigente({ PRECO_TESTE_CENTAVOS: '99999' }, 'deploy-preview-1--igatuboulder.netlify.app')).toBe(16000);
    expect(precoVigente({ PRECO_TESTE_CENTAVOS: 'abc' }, 'deploy-preview-1--igatuboulder.netlify.app')).toBe(16000);
  });
  it('o checkout e a confirmação usam o preço vigente', async () => {
    const link = vi.fn(async () => 'u');
    await inscrever(valido, { handle: 'h', baseUrl: 'https://x', preco: 100, db: dbFalso(), criarLink: link });
    expect(link.mock.calls[0][0].items[0].price).toBe(100);
    const db = dbFalso();
    const r = await confirmarPagamento({ order_nsu: 'P', transaction_nsu: 't', slug: 's' },
      { db, handle: 'h', preco: 100, paymentCheck: async () => ({ success: true, paid: true, amount: 100, paid_amount: 100, capture_method: 'pix' }) });
    expect(r.pago).toBe(true);
  });
});
