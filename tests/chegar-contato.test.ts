import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const chegar = readFileSync('src/pages/como-chegar.astro', 'utf8');
const contato = readFileSync('src/pages/contato.astro', 'utf8');

describe('Como chegar', () => {
  it('não pede dinheiro em espécie', () => {
    expect(chegar).not.toMatch(/espécie/i);
  });
  it('tem o mapa de Igatu incorporado na página, no lugar do link', () => {
    expect(chegar).toMatch(/<iframe[^>]+title="Mapa de Igatu/);
    expect(chegar).not.toContain('Abrir Igatu no mapa');
  });
});

describe('Contato', () => {
  it('a frase de dúvidas vem antes dos contatos', () => {
    expect(contato.indexOf('Dúvidas sobre inscrição')).toBeLessThan(contato.indexOf('class="canais'));
  });
  it('Seja parceiro fica na mesma seção dos contatos, ao lado deles', () => {
    const secao = contato.slice(contato.indexOf('<section'), contato.indexOf('</section>'));
    expect(secao).toContain('class="canais');
    expect(secao).toContain('Seja parceiro');
    expect(contato.match(/<section/g)).toHaveLength(1);
  });
});
