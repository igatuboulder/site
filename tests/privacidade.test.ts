import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const termo = readFileSync('src/pages/termo.astro', 'utf8');
const form = readFileSync('src/components/FormInscricao.astro', 'utf8');

describe('aviso de privacidade (LGPD)', () => {
  it('o termo tem a seção "Seus dados"', () => {
    expect(termo).toMatch(/id="privacidade"/);
    expect(termo).toMatch(/Seus dados/);
  });
  it('diz quais dados, pra quê, quem vê, por quanto tempo e como pedir para apagar', () => {
    for (const t of [/CPF/, /entrega do kit/, /InfinitePay/, /não vendemos/i, /90 dias/, /apagar/, /\/contato/]) expect(termo).toMatch(t);
  });
  it('o formulário avisa e leva ao aviso completo', () => {
    expect(form).toMatch(/href="\/termo#privacidade"/);
  });
});
