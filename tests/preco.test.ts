import { describe, it, expect } from 'vitest';
import { precoEmCentavos, formatarReais, TAXA_CARTAO } from '../src/lib/preco';

describe('preço do passaporte', () => {
  it('Pix custa R$ 160', () => {
    expect(precoEmCentavos('pix')).toBe(16000);
  });
  it('cartão custa mais que o Pix', () => {
    expect(precoEmCentavos('cartao')).toBeGreaterThan(precoEmCentavos('pix'));
  });
  it('no cartão, o festival recebe pelo menos o valor do Pix depois da taxa', () => {
    const liquido = precoEmCentavos('cartao') * (1 - TAXA_CARTAO);
    expect(liquido).toBeGreaterThanOrEqual(precoEmCentavos('pix'));
  });
  it('cartão fica em reais redondos', () => {
    expect(precoEmCentavos('cartao') % 100).toBe(0);
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
