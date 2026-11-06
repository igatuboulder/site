import { describe, it, expect } from 'vitest';
import { PRECO_PASSAPORTE, formatarReais } from '../src/lib/preco';

describe('preço do passaporte', () => {
  it('é um preço único de R$ 160 (a taxa do cartão é acrescentada pela InfinitePay)', () => {
    expect(PRECO_PASSAPORTE).toBe(16000);
  });
  it('formata em reais', () => {
    expect(formatarReais(16000)).toBe('R$ 160,00');
    expect(formatarReais(16750)).toBe('R$ 167,50');
  });
});
