import { describe, it, expect } from 'vitest';
import { montarCheckout } from '../src/lib/checkout';

const dados = { nome: 'Ana Souza', cpf: '52998224725', email: 'ana@exemplo.com', telefone: '75981707643', camiseta: 'M', pagamento: 'pix' as const, aceite: true as const };

describe('montarCheckout', () => {
  const c = montarCheckout(dados, { pedido: 'IGB27-0001', baseUrl: 'https://igatuboulder.com.br' });
  it('cobra um passaporte pelo preço da forma de pagamento', () => {
    expect(c.items).toEqual([{ quantity: 1, price: 16000, description: 'Passaporte Festival IgatuBoulder 2027' }]);
  });
  it('identifica o pedido e volta para o site', () => {
    expect(c.order_nsu).toBe('IGB27-0001');
    expect(c.redirect_url).toBe('https://igatuboulder.com.br/inscricao/obrigado?pedido=IGB27-0001');
    expect(c.webhook_url).toBe('https://igatuboulder.com.br/api/pagamento');
  });
  it('envia os dados do comprador sem o CPF', () => {
    expect(c.customer).toEqual({ name: 'Ana Souza', email: 'ana@exemplo.com', phone_number: '+5575981707643' });
    expect(JSON.stringify(c)).not.toContain('52998224725');
  });
});
