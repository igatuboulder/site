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
