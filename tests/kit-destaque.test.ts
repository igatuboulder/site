import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { EVENTO } from '../src/config/evento';

const ler = (p: string) => readFileSync(p, 'utf8');

describe('kit do festival', () => {
  it('lista os itens do kit 2027', () => {
    expect([...EVENTO.kit]).toEqual(['Camiseta', 'Magnésio', 'Paçoca Larikinha', 'Adesivo', 'Pulseira']);
  });
  it('o componente do kit tem o título "O kit" e todos os itens, sem chips', () => {
    const src = ler('src/components/Kit.astro');
    expect(src).toMatch(/>O kit</);
    expect(src).toContain('EVENTO.kit.map');
    expect(src).toMatch(/<ul/);
    expect(src).not.toMatch(/Seu kit/);
  });
  it('na home o kit fica DENTRO do ticket (um quadro único)', () => {
    const ticket = ler('src/components/Ticket.astro');
    expect(ticket).toContain('Garanta o seu kit');
    expect(ticket).toContain('Inscreva-se');
    expect(ticket).toContain('<Kit');
    const home = ler('src/pages/index.astro');
    expect(home).not.toContain('<Kit');
  });
  it('o canhoto "Garanta o seu kit / Inscreva-se" é centralizado', () => {
    const ticket = ler('src/components/Ticket.astro');
    expect(ticket).toMatch(/\.cta \{[^}]*align-items: center[^}]*text-align: center/);
  });
  it('a inscrição mostra passaporte, valor e o kit num quadro só', () => {
    const src = ler('src/pages/inscricao.astro');
    expect(src).toMatch(/Passaporte \+ kit/);
    expect(src).toMatch(/class="quadro"[\s\S]*<Kit[\s\S]*<\/div>/);
    expect(src).not.toContain('<dl class="precos">');
  });
});

describe('links das marcas (19/11)', () => {
  it('Larikinha e Bendito apontam para os Instagrams enviados pelo Fellipe', async () => {
    const { APOIOS } = await import('../src/data/parceiros');
    const todos = APOIOS;
    expect(todos.find((p) => p.nome === 'Larikinha')?.link).toBe('https://www.instagram.com/larikinha.larikinha/');
    expect(todos.find((p) => p.nome === 'Bendito')?.link).toBe('https://www.instagram.com/benditolencois/');
  });
});
