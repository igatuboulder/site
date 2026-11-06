import { describe, it, expect } from 'vitest';
import { precoEmCentavos, formatarReais } from '../src/lib/preco';

describe('preço do passaporte', () => {
  it('Pix custa R$ 160', () => {
    expect(precoEmCentavos('pix')).toBe(16000);
  });
  it('cartão nunca é mais barato que o Pix', () => {
    expect(precoEmCentavos('cartao')).toBeGreaterThanOrEqual(16000);
  });
  it('recusa forma de pagamento desconhecida', () => {
    // @ts-expect-error teste de entrada inválida
    expect(() => precoEmCentavos('boleto')).toThrow();
  });
  it('formata em reais', () => {
    expect(formatarReais(16000)).toBe('R$ 160,00');
    expect(formatarReais(16750)).toBe('R$ 167,50');
  });
});
