import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PAGINAS } from '../src/data/navegacao';
import { SETORES, ORDEM_TRILHA } from '../src/data/setores';
import mapa from '../src/data/mapa-setores.json';
import { trilha } from '../src/lib/trilha';

describe('aba Setores', () => {
  it('fica no menu entre Como chegar e Contato', () => {
    const r = PAGINAS.map((p) => p.rotulo);
    expect(r.slice(-3)).toEqual(['Como chegar', 'Setores', 'Contato']);
    expect(PAGINAS.find((p) => p.rotulo === 'Setores')?.href).toBe('/setores');
  });

  it('mantém os 13 setores na mesma ordem de antes', () => {
    expect(SETORES.map((s) => s.nome)).toEqual(['Labirinto', 'Verruga', 'Corredor', 'Denorex', 'Disco Voador', 'Besouro', 'Cemitério', 'Lagartos', 'Laranjeiras', 'Cruzeiro', 'Califórnia', 'Coisa Boa', 'Degredo']);
  });

  it('a lista de setores sai do Sobre (agora tem página própria)', () => {
    expect(readFileSync('src/pages/sobre.astro', 'utf8')).not.toContain('Onde a gente escala');
  });

  it('não mostra distância em linha reta nem o link "Abrir no mapa"', () => {
    const p = readFileSync('src/pages/setores.astro', 'utf8');
    expect(p).not.toMatch(/linha reta/i);
    expect(p).not.toMatch(/Abrir no mapa/i);
  });
});

describe('mapa ilustrado dos setores', () => {
  it('tem posição para todos os setores', () => {
    for (const s of SETORES) expect((mapa.setores as Record<string, number[]>)[s.nome], s.nome).toHaveLength(2);
  });

  it('a trilha passa por todos os setores, uma vez cada', () => {
    expect([...ORDEM_TRILHA].sort()).toEqual(SETORES.map((s) => s.nome).sort());
  });

  it('trilha(): começa no primeiro ponto e faz uma curva por trecho', () => {
    const d = trilha([[0, 0], [10, 0], [20, 10]]);
    expect(d.startsWith('M0 0')).toBe(true);
    expect(d.match(/C/g)).toHaveLength(2);
    expect(d.endsWith('20 10')).toBe(true);
  });

  it('trilha(): pula pontos repetidos (setores no mesmo lugar)', () => {
    expect(trilha([[0, 0], [5, 5], [5, 5], [9, 9]]).match(/C/g)).toHaveLength(2);
  });
});
