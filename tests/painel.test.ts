import { describe, it, expect } from 'vitest';
import { resumir, filtrar, listaKits, cpfMascarado, linkCobranca, type Registro } from '../src/lib/painel';
import { REGISTROS_DEMO } from '../src/data/painel-demo';

const r = (o: Partial<Registro>): Registro => ({
  pedido: 'P', nome: 'Fulano Teste', cpf: '52998224725', email: 'f@exemplo.com', telefone: '75900000000',
  camiseta: 'M', status: 'pendente', criadoEm: '2026-12-01T10:00:00Z', ...o,
});

describe('resumo do painel', () => {
  const lista = [
    r({ pedido: '1', status: 'pago', valorPago: 16000, camiseta: 'M' }),
    r({ pedido: '2', status: 'pago', valorPago: 16672, camiseta: 'G' }),
    r({ pedido: '3', status: 'pendente', camiseta: 'M' }),
    r({ pedido: '4', status: 'pago', valorPago: 16000, camiseta: 'M' }),
  ];
  const s = resumir(lista);
  it('conta pagos, pendentes e o total', () => {
    expect(s).toMatchObject({ total: 4, pagos: 3, pendentes: 1 });
  });
  it('soma o que entrou de fato (com a taxa do cartão paga pelo comprador)', () => {
    expect(s.arrecadado).toBe(16000 + 16672 + 16000);
  });
  it('conta a feminina junto', () => {
    expect(resumir([r({ status: 'pago', camiseta: 'FEM' })]).camisetas.FEM).toBe(1);
  });
  it('conta camisetas só de quem pagou, em todos os tamanhos, na ordem', () => {
    expect(s.camisetas).toEqual({ FEM: 0, P: 0, M: 2, G: 1, GG: 0 });
  });
});

describe('filtro e busca', () => {
  const lista = [r({ pedido: 'a', nome: 'Ana Souza', status: 'pago' }), r({ pedido: 'b', nome: 'João Araújo', status: 'pendente' })];
  it('filtra por situação', () => {
    expect(filtrar(lista, { status: 'pago' }).map((x) => x.pedido)).toEqual(['a']);
    expect(filtrar(lista, { status: 'todos' })).toHaveLength(2);
  });
  it('busca por nome sem ligar para acento ou maiúscula', () => {
    expect(filtrar(lista, { busca: 'joao araujo' }).map((x) => x.pedido)).toEqual(['b']);
  });
  it('busca pelos últimos dígitos do CPF ou pelo pedido', () => {
    expect(filtrar([r({ pedido: 'IGB27-0042', cpf: '52998224725' })], { busca: '4725' })).toHaveLength(1);
    expect(filtrar([r({ pedido: 'IGB27-0042' })], { busca: 'igb27-0042' })).toHaveLength(1);
  });
});

describe('lista de entrega de kits', () => {
  it('só quem pagou, em ordem alfabética', () => {
    const lista = [r({ nome: 'Bruno', status: 'pago' }), r({ nome: 'Ágata', status: 'pago' }), r({ nome: 'Carla', status: 'pendente' })];
    expect(listaKits(lista).map((x) => x.nome)).toEqual(['Ágata', 'Bruno']);
  });
});

describe('privacidade', () => {
  it('o CPF aparece mascarado, só com os últimos dígitos para conferir na entrega', () => {
    expect(cpfMascarado('52998224725')).toBe('•••.•••.•47-25');
  });
  it('cobrança de pendente abre o WhatsApp com mensagem pronta', () => {
    const l = linkCobranca(r({ nome: 'Ana Souza', telefone: '75981707643' }));
    expect(l.startsWith('https://wa.me/5575981707643?text=')).toBe(true);
    expect(decodeURIComponent(l)).toContain('Oi, Ana!');
  });
  it('os dados de demonstração são inventados (sem e-mail, telefones 7590000…)', () => {
    expect(REGISTROS_DEMO.length).toBeGreaterThan(10);
    expect(REGISTROS_DEMO.every((x) => x.email === '' && x.telefone.startsWith('7590000'))).toBe(true);
  });
});

describe('linha do banco para o painel', () => {
  it('converte os nomes das colunas', async () => {
    const { deBanco } = await import('../src/lib/painel');
    expect(deBanco({ pedido: 'IGB27-0001', nome: 'Ana', cpf: '52998224725', email: 'a@b.co', telefone: '75981707643', camiseta: 'M', status: 'pago',
      criado_em: '2026-12-01T10:00:00Z', pago_em: '2026-12-01T10:05:00Z', valor_pago: 16000, forma: 'pix' }))
      .toEqual({ pedido: 'IGB27-0001', nome: 'Ana', cpf: '52998224725', email: 'a@b.co', telefone: '75981707643', camiseta: 'M', status: 'pago',
        criadoEm: '2026-12-01T10:00:00Z', pagoEm: '2026-12-01T10:05:00Z', valorPago: 16000, forma: 'pix' });
  });
});
