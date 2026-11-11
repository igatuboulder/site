import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PAGINAS } from '../src/data/navegacao';
import { SETORES, linkMapa } from '../src/data/setores';

describe('aba Setores', () => {
  it('fica no menu logo antes de Como chegar e Contato', () => {
    const r = PAGINAS.map((p) => p.rotulo);
    expect(r.slice(-3)).toEqual(['Setores', 'Como chegar', 'Contato']);
    expect(PAGINAS.find((p) => p.rotulo === 'Setores')?.href).toBe('/setores');
  });

  it('mantém os 13 setores na mesma ordem de antes', () => {
    expect(SETORES.map((s) => s.nome)).toEqual(['Labirinto', 'Verruga', 'Corredor', 'Denorex', 'Disco Voador', 'Besouro', 'Cemitério', 'Lagartos', 'Laranjeiras', 'Cruzeiro', 'Califórnia', 'Coisa Boa', 'Degredo']);
  });

  it('gera link de mapa só para setor com coordenada', () => {
    const lab = SETORES.find((s) => s.nome === 'Labirinto')!;
    expect(linkMapa(lab)).toBe('https://www.google.com/maps/search/?api=1&query=-12.897474,-41.322788');
    expect(linkMapa({ nome: 'X' })).toBeNull();
  });

  it('a lista de setores sai do Sobre (agora tem página própria)', () => {
    expect(readFileSync('src/pages/sobre.astro', 'utf8')).not.toContain('Onde a gente escala');
  });
});

describe('ordem do Sobre', () => {
  it('abre com "Feito com a vila", antes do festival e das duas frentes', () => {
    const s = readFileSync('src/pages/sobre.astro', 'utf8');
    const vila = s.indexOf('Feito com a vila');
    const festival = s.indexOf('O IgatuBoulder é um festival');
    const frentes = s.indexOf('Duas frentes, um propósito');
    expect(vila).toBeGreaterThan(-1);
    expect(vila).toBeLessThan(festival);
    expect(festival).toBeLessThan(frentes);
  });
});
