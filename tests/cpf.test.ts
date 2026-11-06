import { describe, it, expect } from 'vitest';
import { validarCPF } from '../src/lib/cpf';

describe('validarCPF', () => {
  it('aceita CPF válido com e sem máscara', () => {
    expect(validarCPF('529.982.247-25')).toBe(true);
    expect(validarCPF('52998224725')).toBe(true);
  });
  it('recusa dígito verificador errado', () => {
    expect(validarCPF('529.982.247-24')).toBe(false);
  });
  it('recusa sequências repetidas e tamanho errado', () => {
    expect(validarCPF('111.111.111-11')).toBe(false);
    expect(validarCPF('1234567890')).toBe(false);
    expect(validarCPF('')).toBe(false);
  });
});
