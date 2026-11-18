import { describe, it, expect } from 'vitest';
import { montarCheckout, infiniteTag } from '../src/lib/checkout';

const dados = { nome: 'Ana Souza', cpf: '52998224725', email: 'ana@exemplo.com', telefone: '75981707643', camiseta: 'M', aceite: true as const };

describe('montarCheckout', () => {
  const c = montarCheckout(dados, { pedido: 'IGB27-0001', baseUrl: 'https://igatuboulder.com.br', handle: 'loja_teste' });
  it('cobra um passaporte pelo preço único de R$ 160', () => {
    expect(c.items).toEqual([{ quantity: 1, price: 16000, description: 'Passaporte Festival IgatuBoulder 2027' }]);
  });
  it('repassa a taxa do cartão ao comprador em qualquer parcelamento', () => {
    expect(c.options).toEqual({ assured_installments: 0, require_delivery_address: false, single_payment: true });
  });
  it('identifica o pedido e volta para o site', () => {
    expect(c.order_nsu).toBe('IGB27-0001');
    expect(c.redirect_url).toBe('https://igatuboulder.com.br/inscricao/obrigado?pedido=IGB27-0001');
    expect(c.webhook_url).toMatch(/^https:\/\/igatuboulder\.com\.br\/api\/pagamento\?pedido=/);
  });
  it('envia os dados do comprador sem o CPF', () => {
    expect(c.customer).toEqual({ name: 'Ana Souza', email: 'ana@exemplo.com', phone_number: '+5575981707643' });
    expect(JSON.stringify(c)).not.toContain('52998224725');
  });
});

describe('InfiniteTag da conta que recebe', () => {
  it('vai no corpo do checkout', () => {
    const c = montarCheckout(dados, { pedido: 'P1', baseUrl: 'https://x.com.br', handle: 'loja_teste' });
    expect(c.handle).toBe('loja_teste');
  });
  it('vem só da variável de ambiente do servidor, sem o $ do app', () => {
    expect(infiniteTag({ INFINITEPAY_HANDLE: '$loja_teste' })).toBe('loja_teste');
    expect(infiniteTag({ INFINITEPAY_HANDLE: ' loja_teste ' })).toBe('loja_teste');
  });
  it('não abre checkout sem a InfiniteTag configurada', () => {
    expect(() => infiniteTag({})).toThrow();
    expect(() => montarCheckout(dados, { pedido: 'P1', baseUrl: 'https://x.com.br', handle: '' })).toThrow();
  });
});
