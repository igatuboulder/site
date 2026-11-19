import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { EVENTO } from '../src/config/evento';

describe('kit do festival', () => {
  it('lista os itens do kit 2027', () => {
    expect([...EVENTO.kit]).toEqual(['Camiseta', 'Magnésio', 'Paçoca Larikinha', 'Adesivo', 'Pulseira']);
  });
  it('tem um componente que mostra todos os itens', () => {
    const src = readFileSync('src/components/Kit.astro', 'utf8');
    expect(src).toContain('EVENTO.kit.map');
    expect(src).toMatch(/<ul/);
  });
  it('a home junta "garanta o seu kit" com o inscreva-se e mostra o kit', () => {
    const ticket = readFileSync('src/components/Ticket.astro', 'utf8');
    expect(ticket).toContain('Garanta o seu kit');
    expect(ticket).toContain('Inscreva-se');
    const home = readFileSync('src/pages/index.astro', 'utf8');
    expect(home).toContain('<Kit');
  });
  it('a página de inscrição mostra passaporte + kit e os itens', () => {
    const src = readFileSync('src/pages/inscricao.astro', 'utf8');
    expect(src).toMatch(/Passaporte \+ kit/);
    expect(src).toContain('<Kit');
  });
});
