import { describe, it, expect } from 'vitest';
import { validarInscricao } from '../src/lib/inscricao';

const valida = {
  nome: 'Ana Souza',
  cpf: '529.982.247-25',
  email: 'ana@exemplo.com',
  telefone: '(75) 98170-7643',
  camiseta: 'M',
  aceite: true,
};

describe('validarInscricao', () => {
  it('aceita uma inscrição completa e normaliza os dados', () => {
    const r = validarInscricao(valida);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.dados.cpf).toBe('52998224725');
      expect(r.dados.telefone).toBe('75981707643');
      expect(r.dados.email).toBe('ana@exemplo.com');
    }
  });
  it('exige nome e sobrenome', () => {
    const r = validarInscricao({ ...valida, nome: 'Ana' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erros.nome).toBeTruthy();
  });
  it('recusa CPF inválido', () => {
    const r = validarInscricao({ ...valida, cpf: '111.111.111-11' });
    expect(!r.ok && r.erros.cpf).toBeTruthy();
  });
  it('recusa e-mail e telefone inválidos', () => {
    const r = validarInscricao({ ...valida, email: 'ana@', telefone: '123' });
    expect(!r.ok && r.erros.email && r.erros.telefone).toBeTruthy();
  });
  it('só aceita tamanhos de camiseta da lista', () => {
    const r = validarInscricao({ ...valida, camiseta: 'XXXL' });
    expect(!r.ok && r.erros.camiseta).toBeTruthy();
  });
  it('não pede forma de pagamento (escolhida no checkout da InfinitePay)', () => {
    const r = validarInscricao(valida);
    expect(r.ok).toBe(true);
    if (r.ok) expect('pagamento' in r.dados).toBe(false);
  });
  it('exige aceite do termo de responsabilidade', () => {
    const r = validarInscricao({ ...valida, aceite: false });
    expect(!r.ok && r.erros.aceite).toBeTruthy();
  });
  it('lista todos os erros de uma vez', () => {
    const r = validarInscricao({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.erros).sort()).toEqual(['aceite','camiseta','cpf','email','nome','telefone']);
  });
});

import { EVENTO as EV } from '../src/config/evento';
describe('tamanhos de camiseta 2027', () => {
  it('masculina só P, M, G e GG (sem PP e XG)', () => { expect([...EV.camisetasMasc]).toEqual(['P', 'M', 'G', 'GG']); });
  it('feminina tem tamanho único, gravado como FEM', () => {
    expect([...EV.camisetas]).toEqual(['FEM', 'P', 'M', 'G', 'GG']);
    const r = validarInscricao({ ...valida, camiseta: 'FEM' });
    expect(r.ok && r.dados.camiseta).toBe('FEM');
  });
});

import { readFileSync } from 'node:fs';
describe('escolha da camiseta no formulário', () => {
  const src = readFileSync('src/components/FormInscricao.astro', 'utf8');
  it('pergunta primeiro feminina ou masculina', () => {
    expect(src).toMatch(/name="modelo"[^>]*value="fem"|value="fem"[^>]*name="modelo"/);
    expect(src).toMatch(/name="modelo"[^>]*value="masc"|value="masc"[^>]*name="modelo"/);
    expect(src).toContain('Feminina');
    expect(src).toContain('Masculina');
  });
  it('feminina mostra o tamanho único já marcado; masculina mostra P a GG para escolher um', () => {
    expect(src).toContain('Tamanho único');
    expect(src).toContain('value="FEM"');
    expect(src).toContain('EVENTO.camisetasMasc.map');
    expect(src).toMatch(/fem\.checked = true/);
  });
  it('pede para escolher o modelo antes do tamanho', () => {
    expect(src).toContain('Escolha feminina ou masculina');
  });
});

describe('banco aceita a camiseta feminina', () => {
  it('tem migração liberando FEM', () => {
    const { readdirSync } = require('node:fs');
    const ultimas = (readdirSync('supabase/migrations') as string[]).sort();
    const sql = readFileSync(`supabase/migrations/${ultimas.at(-1)}`, 'utf8');
    expect(sql).toMatch(/camiseta in \('FEM', 'P', 'M', 'G', 'GG'\)/);
  });
});
