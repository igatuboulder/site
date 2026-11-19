import { describe, it, expect } from 'vitest';
import { resumir, filtrar, deBanco, type Registro } from '../src/lib/painel';
import { readFileSync, readdirSync } from 'node:fs';

const r = (o: Partial<Registro>): Registro => ({ pedido: 'P', nome: 'Ana', cpf: '52998224725', email: '', telefone: '75981707643',
  camiseta: 'M', status: 'pago', criadoEm: '2026-12-01T10:00:00Z', ...o });

describe('entrega de kits', () => {
  const lista = [
    r({ pedido: '1', kitEntregueEm: '2027-01-08T15:00:00Z', kitEntreguePor: 'a@b.co' }),
    r({ pedido: '2' }),
    r({ pedido: '3', status: 'pendente' }),
  ];
  it('conta kits entregues só entre os pagos', () => {
    expect(resumir(lista).entregues).toBe(1);
    expect(resumir(lista).pagos).toBe(2);
  });
  it('aba "falta entregar" mostra só pagos sem entrega', () => {
    expect(filtrar(lista, { status: 'entregar' }).map((x) => x.pedido)).toEqual(['2']);
  });
  it('aba "entregues"', () => {
    expect(filtrar(lista, { status: 'entregue' }).map((x) => x.pedido)).toEqual(['1']);
  });
  it('lê do banco quem entregou e quando', () => {
    const x = deBanco({ pedido: 'P', nome: 'Ana', cpf: '1', email: '', telefone: '1', camiseta: 'M', status: 'pago', criado_em: 'c',
      kit_entregue_em: '2027-01-08T15:00:00Z', kit_entregue_por: 'a@b.co' });
    expect(x.kitEntregueEm).toBe('2027-01-08T15:00:00Z');
    expect(x.kitEntreguePor).toBe('a@b.co');
    expect(deBanco({ pedido: 'P', nome: 'A', cpf: '1', email: '', telefone: '1', camiseta: 'M', status: 'pago', criado_em: 'c' }).kitEntregueEm).toBeUndefined();
  });
});

describe('regras do banco para a entrega', () => {
  const sql = readdirSync('supabase/migrations').filter((f) => f.includes('kit')).map((f) => readFileSync(`supabase/migrations/${f}`, 'utf8')).join('\n');
  it('só organizador entrega, só inscrição paga, nunca duas vezes', () => {
    expect(sql).toMatch(/security definer/i);
    expect(sql).toMatch(/organizadores/);
    expect(sql).toMatch(/status = 'pago'/);
    expect(sql).toMatch(/kit_entregue_em is null/);
  });
  it('visitante não executa', () => {
    expect(sql).toMatch(/revoke all on function public\.entregar_kit[\s\S]*from public, anon/i);
  });
});

describe('painel', () => {
  const p = readFileSync('src/pages/painel.astro', 'utf8');
  it('chama a função do banco e mostra o tamanho grande antes de confirmar', () => {
    expect(p).toMatch(/rpc\('entregar_kit'/);
    expect(p).toMatch(/<dialog[^>]*id="confirmar"/);
    expect(p).toMatch(/Desfazer/);
  });
});
